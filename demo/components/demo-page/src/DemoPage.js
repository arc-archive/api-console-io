import { LitElement, html } from 'lit-element';
import { linkMixin, routerMixin } from 'lit-element-router';
import styles from './Styles.js';

import '../../page-main/page-main.js';

export class DemoPage extends routerMixin(linkMixin(LitElement)) {
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
      },
      {
        name: 'standalone',
        pattern: '/standalone',
      },
      {
        name: 'element',
        pattern: '/element',
      },
      {
        name: 'themed',
        pattern: '/themed/anypoint',
        data: { css: 'anypoint.css' },
      },
      {
        name: 'themed',
        pattern: '/themed/dark',
        data: { css: 'dark.css' },
      },
      {
        name: 'themed',
        pattern: '/themed/dark',
        data: { css: 'dark.css' },
      },
      {
        name: 'editor',
        pattern: '/editor',
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

  router(route, params, query, data = {}) {
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

  _clickHandler(e) {
    if (!e.composed) {
      return;
    }
    const path = e.composedPath();
    const anhor = path.find(node => node.nodeName === 'A');
    if (!anhor) {
      return;
    }
    const href = anhor.getAttribute('href');
    if (!href) {
      return;
    }
    if (anhor.href.indexOf(window.location.host) !== 0) {
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
