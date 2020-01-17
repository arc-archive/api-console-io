import { html, css } from 'lit-element';
import 'api-console/api-console.js';
import { moreVert, menu } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@advanced-rest-client/xhr-simple-request/xhr-simple-request.js';
import '@advanced-rest-client/oauth-authorization/oauth1-authorization.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import { DemoPageBase } from '../../DemoPageBase.js';

export class PageElement extends DemoPageBase {
  static get styles() {
    return [
      css`
        api-console-app {
          overflow: auto;
        }

        .icon {
          fill: currentColor;
          width: 24px;
          height: 24px;
          display: inlink-block;
        }

        .demo-section {
          height: 100%;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          width: 60%;
        }

        h1 {
          font-size: 34px;
          font-weight: 200;
          line-height: 28px;
          box-sizing: border-box;
          margin: 0 0 0 12px;
          flex: 1;
        }

        api-console {
          flex: 1;
          overflow: auto;
        }

        #demo {
          height: 100%;
        }

        .wrapper {
          position: relative;
          height: calc(100% - 100px);
        }

        .header {
          display: flex;
          align-items: center;
          margin: 20px 0;
        }

        .footer {
          padding: 20px 0;
          font-size: 1rem;
          text-align: center;
          color: #9e9e9e;
        }
      `,
    ];
  }

  toggleConsoleMenu() {
    const apic = this.shadowRoot.querySelector('api-console');
    apic.navigationOpened = !apic.navigationOpened;
  }

  demoTemplate() {
    const { model } = this;
    return html`
      <section class="demo-section">
        <div class="header">
          <anypoint-icon-button
            aria-label="Activate to open API console menu"
            title="Open API console menu"
            @click="${this.toggleConsoleMenu}"
          >
            <span class="icon">${menu}</span>
          </anypoint-icon-button>

          <h1>API Console as an element</h1>

          <anypoint-icon-button
            aria-label="Activate to open API selection menu"
            title="Open API selection menu"
            @click="${this.openApiSelector}"
          >
            <span class="icon">${moreVert}</span>
          </anypoint-icon-button>
        </div>

        <api-console
          redirecturi="https://auth.advancedrestclient.com/oauth-popup.html"
          oauth2clientid="821776164331-rserncqpdsq32lmbf5cfeolgcoujb6fm.apps.googleusercontent.com"
          .amf="${model}"
        >
        </api-console>

        <xhr-simple-request></xhr-simple-request>
        <oauth1-authorization></oauth1-authorization>
        <oauth2-authorization></oauth2-authorization>

        <div class="footer">
          Brought to you with ❤ by MuleSoft, a Salesforce company.
        </div>
      </section>
    `;
  }
}
