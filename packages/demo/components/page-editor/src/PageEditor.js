/* eslint-disable class-methods-use-this */
import { html, css, LitElement } from 'lit-element';
import 'api-console/api-console.js';
import { menu } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@api-components/api-request/xhr-simple-request.js';
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@polymer/paper-toast/paper-toast.js';
import defaultApiValue from './default-raml.js';

/** @typedef {import('@polymer/paper-toast').PaperToastElement} PaperToastElement */
/** @typedef {import('@advanced-rest-client/events').Amf.ApiParseResult} ApiParseResult */
/** @typedef {import('@api-components/amf-helper-mixin').AmfDocument} AmfDocument */

const SOURCE_KEY = 'api.source';

export class PageEditor extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          --code-background-color: #f5f5f5;
          --code-mirror-background-color: #f5f5f5;
        }

        #demo {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        header {
          background-color: #2196f3;
          color: #000;
          padding: 0 24px;
        }

        h1 {
          font-size: 96px;
          font-weight: 300;
          font-style: normal;
          letter-spacing: -1.5px;
          margin: 0;
        }

        h2 {
          font-size: 60px;
          font-weight: 300;
          font-style: normal;
          letter-spacing: -0.5px;
        }

        main {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          flex: 1;
          margin: 0 24px;
        }

        .editor,
        .docs {
          flex: 1;
          align-self: stretch;
          display: flex;
          flex-direction: column;
        }

        .editor {
          margin-right: 16px;
        }

        .main-border {
          width: 2px;
          background-color: #e5e5e5;
          cursor: row-resize;
        }

        progress {
          width: 100%;
          position: absolute;
        }

        .docs-header {
          display: flex;
          align-items: center;
        }

        .icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        api-console {
          flex: 1;
        }
      `,
    ];
  }

  static get properties() {
    return {
      source: { type: String },
      navigationOpened: { type: Boolean },
      loading: { type: Boolean },
      model: { type: Boolean },
    };
  }

  /**
   * @returns {string}
   */
  get source() {
    return this._source;
  }

  set source(value) {
    const old = this._source;
    if (value === old) {
      return;
    }
    this._source = value;
    this._updateModel();
  }

  constructor() {
    super();
    this.mediaType = '';
    this.vendorName = '';

    const storedSource = localStorage.getItem(SOURCE_KEY);
    this.source = storedSource || defaultApiValue;
    this.setupVendors();
    if (window.location.port) {
      // Dev mode
      const base = window.location.origin.replace(window.location.port, '8081');
      const url = new URL('/v1', base);
      this.apiBase = url.toString();
    } else {
      this.apiBase = 'https://api.api-console.io/v1';
    }
  }

  _updateModel() {
    if (this.__updatingModelDebouncer) {
      clearTimeout(this.__updatingModelDebouncer);
    }
    this.__updatingModelDebouncer = setTimeout(() => {
      this.__updatingModelDebouncer = null;
      this._storeSource();
      this._processSources();
    }, 700);
  }

  _storeSource() {
    const { source } = this;
    localStorage.setItem(SOURCE_KEY, source);
  }

  async _processSources() {
    if (this.loading) {
      this.isDirty = true;
      return;
    }
    this.loading = true;
    try {
      const headers = /** @type Record<string, string> */ ({
        'Content-Type': this.mediaType,
        'x-api-vendor': this.vendorName,
      });
      const response = await fetch(`${this.apiBase}/text`, {
        body: this.source,
        method: 'POST',
        headers: headers,
      });
      const body = await response.json();
      if (response.status !== 201) {
        throw new Error(body.message || 'Unable to communicate with the API parser service.');
      }
      const { location } = body;
      if (!location) {
        throw new Error(`The API parsing service returned unexpected value.`);
      }
      const result = await this.readAndProcessParsingResult(location);
      this.model = /** @type AmfDocument */ (/** @type unknown */(result.model));
    } catch (e) {
      this.notifyError(e.message);
      console.error(e);
    }
    this.loading = false;
    if (this.isDirty) {
      this.isDirty = false;
      this._updateModel();
    }
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
      throw new Error(`The API parsing service returned unexpected response ${response.status}`);
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
   * Adds content type and vendor header to the request headers.
   */
  setupVendors() {
    const { source='' } = this;
    if (source.includes('#%RAML')) {
      this.vendorName = 'RAML 1.0';
      this.mediaType = 'application/raml';
    } else if (source.includes('asyncapi')) {
      this.vendorName = 'ASYNC 2.0';
      this.mediaType = 'application/asyncapi20';
    } else if (source.includes('openapi:')) {
      this.vendorName = 'OAS 3.0';
      this.mediaType = 'application/openapi30';
    } else if (source.includes('swagger:') || source.includes('"swagger"')) {
      this.vendorName = 'OAS 2.0';
      this.mediaType = 'application/oas20';
    } else {
      this.vendorName = '';
      this.mediaType = '';
    }
  }

  _sourceChanged(e) {
    this.source = e.detail.value;
    this.setupVendors();
  }

  notifyError(message) {
    const node = document.createElement('paper-toast');
    document.body.appendChild(node);
    node.text = message;
    node.opened = true;
  }

  toggleNavigation() {
    this.navigationOpened = !this.navigationOpened;
  }

  _navigationClosed() {
    this.navigationOpened = false;
  }

  render() {
    const { model, navigationOpened, loading, source } = this;
    return html`
      <header>
        <h1>API Editor</h1>
      </header>
      <main>
        <div class="editor">
          <h2>Editor</h2>
          <code-mirror
            mode="yaml"
            lineNumbers
            id="codeSource"
            .value="${source}"
            @value-changed="${this._sourceChanged}"
          ></code-mirror>
        </div>
        <div class="main-border"></div>
        <div class="docs">
          <div class="docs-header">
            <anypoint-icon-button
              aria-label="Activate to open API console menu"
              title="Open API console menu"
              @click="${this.toggleNavigation}"
            >
              <span class="icon">${menu}</span>
            </anypoint-icon-button>
            <h2>Documentation</h2>
          </div>
          ${loading
            ? html`
                <progress></progress>
              `
            : ''}
          <api-console
            .amf="${model}"
            selectedShape="summary"
            selectedShapeType="summary"
            redirectUri="https://auth.advancedrestclient.com/oauth-popup.html"
            ?navigationOpened="${navigationOpened}"
            @navigation-close="${this._navigationClosed}"
          >
          </api-console>
        </div>
      </main>

      <xhr-simple-request></xhr-simple-request>
      <oauth1-authorization></oauth1-authorization>
      <oauth2-authorization></oauth2-authorization>
    `;
  }
}
