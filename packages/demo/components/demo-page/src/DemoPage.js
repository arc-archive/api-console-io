import { LitElement, html } from 'lit-element';
import { router as routerMixin, navigator as navMixin } from 'lit-element-router';
import styles from './Styles.js';

import '../../page-main/page-main.js';
import '../../page-standalone/page-standalone.js';
import '../../page-element/page-element.js';
import '../../page-editor/page-editor.js';

export class DemoPage extends navMixin(routerMixin(LitElement)) {
  static get properties() {
    return {
      /**
       * A currently rendered page
       */
      page: { type: String },
    };
  }

  static get routes() {
    return [
      {
        name: 'main',
        pattern: '',
        data: {},
      },
      {
        name: 'standalone',
        pattern: '/standalone',
        data: {},
      },
      {
        name: 'element',
        pattern: '/element',
        data: {},
      },
      {
        name: 'themed',
        pattern: '/themed/anypoint',
        data: { theme: 'anypoint' },
      },
      {
        name: 'themed',
        pattern: '/themed/dark',
        data: { theme: 'dark' },
      },
      {
        name: 'editor',
        pattern: '/editor',
        data: {},
      },
    ];
  }

  constructor() {
    super();
    this.page = 'main';
    this._clickHandler = this._clickHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._clickHandler);
  }

  router(route, params, query, data={}) {
    let finalRoute;
    if (route === '/') {
      finalRoute = 'main';
    } else {
      finalRoute = route;
    }
    this.page = finalRoute;
    this.params = params;
    this.routeData = data;
  }

  /**
   * @param {Event} e 
   */
  _clickHandler(e) {
    if (!e.composed) {
      return;
    }
    const path = /** @type Element[] */ (e.composedPath());
    const anchor = /** @type HTMLAnchorElement */ (path.find((node) => node.nodeName === 'A'));
    if (!anchor) {
      return;
    }
    const href = anchor.getAttribute('href');
    if (!href) {
      return;
    }
    if (anchor.href.indexOf(window.location.host) !== 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.navigate(href);
  }

  render() {
    switch (this.page) {
      case 'main':
        return html`
          <page-main></page-main>
        `;
      case 'standalone':
        return html`
          <page-standalone></page-standalone>
        `;
      case 'themed':
        return html`
          <page-standalone theme="${this.routeData.theme}"></page-standalone>
        `;
      case 'element':
        return html`
          <page-element></page-element>
        `;
      case 'editor':
        return html`
          <page-editor></page-editor>
        `;
      default:
        return html`
          <p>Page not found try going to <a href="/">Main</a></p>
        `;
    }
  }

  static get styles() {
    return [styles];
  }
}
