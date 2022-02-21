/* eslint-disable class-methods-use-this */
import { html, LitElement } from 'lit-element';
import '@api-components/api-request/xhr-simple-request.js';
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@polymer/paper-toast/paper-toast.js';

import './loader-screen.js';
import './upload-api-screen.js';
import './api-file-selector.js';
import './api-selector.js';

/** @typedef {import('./api-selector').ApiSelector} ApiSelector */
/** @typedef {import('api-console').ApiConsole} ApiConsole */
/** @typedef {import('@advanced-rest-client/events').Amf.ApiParseResult} ApiParseResult */
/** @typedef {import('@api-components/amf-helper-mixin').AmfDocument} AmfDocument */

const apiCache = new WeakMap();

export class DemoPageBase extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      hasUploader: { type: Boolean },
      hasApiFileSelector: { type: Boolean },
      apiSelectorOpened: { type: Boolean },
      /**
       * AMF model to pass to the console.
       * @type {Object}
       */
      model: { type: Object },
    };
  }

  get model() {
    return this._model;
  }

  set model(value) {
    const old = this._model;
    if (old === value) {
      return;
    }
    this._model = value;
    this.requestUpdate('model', old);
    this._modelChanged();
  }

  get loader() {
    return this.shadowRoot.querySelector('loader-screen');
  }

  constructor() {
    super();
    this.loading = true;
    if (window.location.port) {
      // Dev mode
      const base = window.location.origin.replace(window.location.port, '8081');
      const url = new URL('/v1', base);
      this.apiBase = url.toString();
    } else {
      this.apiBase = 'https://api.api-console.io/v1';
    }
    this.apis = [
      ['google-drive-api', 'Google Drive API'],
      ['httpbin', 'HTTPbin API'],
      ['data-type-fragment', 'RAML data type fragment'],
      ['demo-api', 'Demo API'],
    ];

    /** @type {string[] | undefined} */
    this.apiCandidates = undefined;
  }

  firstUpdated() {
    this.selectFirstApi();
  }

  selectFirstApi() {
    const listbox = /** @type ApiSelector */ (this.shadowRoot.querySelector('api-selector'));
    if (listbox) {
      listbox.selected = 0;
    }
  }

  _selectApi(e) {
    this.apiSelectorOpened = false;
    const node = e.target.selectedItem;
    if (!node) {
      return;
    }
    const model = apiCache.get(node);
    if (model) {
      this.model = model;
      return;
    }
    const file = node.dataset.src;
    if (!file) {
      this.openUploader();
      return;
    }
    this.loadApi(file, node);
  }

  notifyError(message) {
    const node = document.createElement('paper-toast');
    document.body.appendChild(node);
    node.text = message;
    node.opened = true;
  }

  async loadApi(file, cacheKey) {
    const url = `/models/${file}.json`;
    const absoluteUrl = new URL(url, window.location.href).toString();
    this.loading = true;
    try {
      const response = await fetch(absoluteUrl);
      const model = await response.json();
      apiCache.set(cacheKey, model);
      this.model = model;
    } catch (e) {
      this.notifyError(e.message);
    }
    this.loading = false;
  }

  _modelChanged() {
    const apic = /** @type ApiConsole */ (this.shadowRoot.querySelector('api-console,api-console-app'));
    apic.selectedShape = 'summary';
    apic.selectedShapeType = 'summary';
  }

  _uploadHandler() {
    this.openUploader();
  }

  openUploader() {
    this.hasUploader = true;
  }

  openApiSelector() {
    this.apiSelectorOpened = true;
  }

  _apiSelectorOpenedHandler(e) {
    this.apiSelectorOpened = e.detail.value;
  }

  async _processApiFileUpload(e) {
    this.hasUploader = false;
    
    const file = /** @type File */ (e.detail.value);
    this._processSources(file);
  }

  /**
   * @param {File} file 
   */
  async _processSources(file) {
    if (this.loading) {
      return this.cancelOutstanding(file);
    }
    this.loading = true;
    try {
      const headers = /** @type Record<string, string> */ ({
        'Content-Type': 'application/zip',
      });
      const response = await fetch(`${this.apiBase}/file`, {
        body: file,
        method: 'POST',
        headers: headers,
      });
      const body = await response.json();
      if (response.status !== 201) {
        throw new Error(body.message || 'Unable to communicate with the API parser service.');
      }
      const { location, key } = body;
      this.latestStatusKey = key;
      if (!location) {
        throw new Error(`The API parsing service returned unexpected value.`);
      }
      const result = await this.readAndProcessParsingResult(location);
      this.model = /** @type AmfDocument */ (/** @type unknown */(result.model));
      this.latestStatusKey = undefined;
    } catch (e) {
      this.notifyError(e.message);
      console.error(e);
    }
    this.loading = false;
  }

  /**
   * Cancels previous and starts a new parsing job.
   * @param {File} file 
   */
  async cancelOutstanding(file) {
    if (!this.latestStatusKey) {
      this.loading = false;
      return this._processSources(file);
    }
    
    this.loading = true;
    try {
      const key = this.latestStatusKey;
      this.latestStatusKey = undefined;
      await fetch(`${this.apiBase}/job/${key}`, {
        method: 'DELETE',
      });
    } catch (e) {
      // ...
    }
    this.loading = false;
    return this._processSources(file);
  }

  /**
   * Makes a query to the AMF service for the parsing result. When ready it either returns 
   * the value or pics the API main file.
   * 
   * This function is made to be called recursively until one of the expected status codes are returned.
   * 
   * @param {string} headerLocation The current URL to query.
   * @returns {Promise<ApiParseResult|undefined>}
   */
  async readAndProcessParsingResult(headerLocation) {
    const url = this.getApiServiceUrl(headerLocation);
    const response = await fetch(url);
    if (response.status === 200) {
      const model = await response.json();
      const result = /** @type ApiParseResult */ ({
        model,
        type: {
          type: response.headers.get('x-api-vendor'),
          contentType: '',
        },
      });
      return result;
    }
    if (response.status === 204) {
      const location = response.headers.get('location');
      await this.aTimeout(250);
      return this.readAndProcessParsingResult(location || headerLocation);
    }
    if (response.status === 300) {
      const location = response.headers.get('location');
      const body = await response.json();
      const mainFile = await this.selectApiMainFile(body.files);
      if (!mainFile) {
        return undefined;
      }
      this.loading = true;
      const newUrl = this.getApiServiceUrl(location || headerLocation);
      const updateResponse = await fetch(newUrl, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ entrypoint: mainFile }),
      });
      if (updateResponse.status === 200) {
        return this.readAndProcessParsingResult(updateResponse.headers.get('location') || headerLocation);
      }
      throw new Error(`The API parsing service returned unexpected response ${updateResponse.status}`);
    }
    const body = await response.json();
    throw new Error(body.message || 'Unable to communicate with the API parser service.');
  }

  /**
   * @param {string=} path
   * @returns {string} The base URI of the API service.
   */
  getApiServiceUrl(path='/') {
    const url = new URL(path, this.apiBase);
    return url.toString();
  }

  /**
   * @param {number=} timeout
   * @returns {Promise<void>} 
   */
  aTimeout(timeout=0) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), timeout);
    });
  }

  /**
   * @param {string[]} candidates
   * @returns {Promise<string|undefined>}
   */
  async selectApiMainFile(candidates) {
    this.apiCandidates = candidates;
    this.hasApiFileSelector = true;
    this.loading = false;
    return new Promise((resolve) => {
      this.candidateResolver = resolve;
    });
  }

  _apiCandidateHandler(e) {
    const file = e.detail;
    this.apiCandidates = undefined;
    this.hasApiFileSelector = false;
    if (this.candidateResolver) {
      this.candidateResolver(file);
    } else {
      this.notifyError(new Error('Unknown state.'));
    }
  }

  apiSelectorTemplate() {
    const items = this.apis;
    if (!items) {
      return '';
    }
    const result = items.map(
      ([file, label]) =>
        html`
          <anypoint-item data-src="${file}">${label}</anypoint-item>
        `,
    );
    return html`
      <api-selector
        ?opened="${this.apiSelectorOpened}"
        @opened-changed="${this._apiSelectorOpenedHandler}"
        @select="${this._selectApi}"
        @upload="${this._uploadHandler}"
      >
        ${result}
      </api-selector>
    `;
  }

  _renderPage() {
    if (this.hasUploader) {
      return html`
        <upload-api-screen @select="${this._processApiFileUpload}"></upload-api-screen>
      `;
    }
    if (this.hasApiFileSelector) {
      const items = this.apiCandidates;
      return html`
        <api-file-selector @candidate-selected="${this._apiCandidateHandler}">
          ${items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
        </api-file-selector>
      `;
    }
    return this.demoTemplate();
  }

  render() {
    return html`
      ${this._renderPage()} 
      ${this.apiSelectorTemplate()}
      <loader-screen .visible="${this.loading}"></loader-screen>
    `;
  }

  demoTemplate() {
    return html``;
  }
}
