import { html, css } from 'lit-element';
import 'api-console/api-console-app.js';
import { moreVert } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import { DemoPageBase } from '../../DemoPageBase.js';

export class PageStandalone extends DemoPageBase {
  static get styles() {
    return [
      css`
        :host {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }

        api-console-app {
          overflow: auto;
        }

        .icon {
          fill: currentColor;
        }

        .toolbar-icon .icon {
          color: #fff;
          width: 24px;
          height: 24px;
        }
      `,
    ];
  }

  get compatibility() {
    return this.theme === 'anypoint';
  }

  static get properties() {
    return {
      theme: { type: String },
    };
  }

  constructor() {
    super();
    this.theme = undefined;
  }

  demoTemplate() {
    const { model, theme, compatibility } = this;
    return html`
      ${theme
        ? html`
            <link rel="stylesheet" href="/api-console-${theme}-theme.css" />
          `
        : ''}
      <api-console-app
        redirectUri="https://auth.advancedrestclient.com/oauth-popup.html"
        oauth2ClientId="821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com"
        rearrangeEndpoints
        ?compatibility="${compatibility}"
        .amf="${model}"
      >
        <anypoint-icon-button
          slot="toolbar"
          aria-label="Activate to open API selection menu"
          title="Open API selection menu"
          @click="${this.openApiSelector}"
          class="toolbar-icon"
        >
          <span class="icon">${moreVert}</span>
        </anypoint-icon-button>
      </api-console-app>
    `;
  }
}
