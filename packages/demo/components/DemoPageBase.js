import { html, LitElement } from 'lit-element';
import '@advanced-rest-client/xhr-simple-request/xhr-simple-request.js';
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';

import './loader-screen.js';
import './upload-api-screen.js';
import './api-file-selector.js';
import './api-selector.js';

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
    this.apiBase = window.ApiDemos.apiBase;
    this.apis = [
      ['google-drive-api', 'Google Drive API'],
      ['httpbin', 'HTTPbin API'],
      ['data-type-fragment', 'RAML data type fragment'],
      ['demo-api', 'Demo API'],
    ];
  }

  firstUpdated() {
    this.selectFirstApi();
  }

  selectFirstApi() {
    const listbox = this.shadowRoot.querySelector('api-selector');
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
    const apic = this.shadowRoot.querySelector('api-console,api-console-app');
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
    const { apiBase } = this;
    const { value } = e.detail;
    this.hasUploader = false;
    const url = `${apiBase}/parser/`;
    this.loading = true;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: value,
      });
      const data = await response.json();
      if (response.status === 200) {
        this.model = JSON.parse(data.data.api);
      } else if (response.status === 300) {
        this._requestSelectApi(data.data);
      } else {
        this.notifyError(data.message);
      }
    } catch (cause) {
      this.notifyError(cause.message);
    }
    this.loading = false;
  }

  _requestSelectApi(data) {
    const { key, candidates } = data;
    this.apiCandidates = candidates;
    this.candidatesKey = key;
    this.hasApiFileSelector = true;
  }

  _apiHandidateHandler(e) {
    const file = e.detail;
    const key = this.candidatesKey;
    this.candidatesKey = undefined;
    this.apiCandidates = undefined;
    this.hasApiFileSelector = false;
    this._processCandidates(file, key);
  }

  async _processCandidates(file, key) {
    const { apiBase } = this;
    const url = `${apiBase}/parser/candidate`;
    this.loading = true;
    const body = JSON.stringify({
      key,
      file,
    });
    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
      });
      const data = await response.json();
      if (response.status === 200) {
        this.model = JSON.parse(data.data.api);
      } else {
        this.notifyError(data.message);
      }
    } catch (e) {
      this.notifyError(e.message);
    }
    this.loading = false;
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
        <api-file-selector @candidate-selected="${this._apiHandidateHandler}">
          ${items.map(
            item =>
              html`
                <anypoint-item>${item}</anypoint-item>
              `,
          )}
        </api-file-selector>
      `;
    }
    return this.demoTemplate();
  }

  render() {
    return html`
      ${this._renderPage()} ${this.apiSelectorTemplate()}
      <loader-screen .visible="${this.loading}"></loader-screen>
    `;
  }
}
