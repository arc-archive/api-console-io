import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import styles from './Styles.js';

export class ApiConsoleIo extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html`
      <header>
        <h1>API Console</h1>
        <p class="subtitle">API design for humans</p>

        <section class="main-action-buttons">
          <a href="https://demo.api-console.io" class="button-anchor">
            <anypoint-button tabindex="-1" emphasis="medium">See demo</anypoint-button>
          </a>
          <a href="https://docs.api-console.io" class="button-anchor">
            <anypoint-button tabindex="-1" emphasis="low">Documentation</anypoint-button>
          </a>
        </section>
      </header>
      <main>
        <section class="short-description">
          <p>
            API Console automates API documentation process <br />
            by generating an UI from <b>RAML</b> and <b>OAS</b> files.
          </p>
        </section>

        <section class="ss-carousel">
          <div class="ss-img">
            <figure>
              <img
                src="/resources/api-images/ss-method.png"
                alt="Screenshot of API method documentation"
              />
              <figcaption>API method documentation</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img
                src="/resources/api-images/ss-type-doc.png"
                alt="Screenshot of type documentation"
              />
              <figcaption>A type documentation</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img
                src="/resources/api-images/ss-examples.png"
                alt="Screenshot of example documentation"
              />
              <figcaption>Generated examples</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img
                src="/resources/api-images/ss-tryit.png"
                alt="Screenshot of the request editor"
              />
              <figcaption>API testing with pre-populated values</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-mobile.png" alt="Screenshot of mobile view" />
              <figcaption>Mobile view build-in into design</figcaption>
            </figure>
          </div>
        </section>

        <section class="use-reasons info-section">
          <div class="image">
            <img
              src="/resources/api-images/ss-mobile2.png"
              width="403"
              height="386"
              class="shadow-image"
              alt="Screenshot of query parameters documentation"
            />
          </div>
          <div class="desc">
            <h2>Document everything, easily</h2>
            <ul class="checked-list">
              <li>Support for <b>RAML</b> and <b>OAS</b> documents is built-in by default.</li>
              <li>
                Automatic API documentation generation from <b>AMF</b> data model. Use AMF parser to
                process API files.
              </li>
              <li>
                API Console can be embedded inside existing application as a web component or be
                used as a standalone application.
              </li>
            </ul>
          </div>
        </section>

        <section class="platform-cases">
          <h2 class="section-title">Tested in enterprise environment</h2>
          <p class="medium-desc">
            API Console is embedded in multiple MuleSoft platform products like
            <b>API Designer</b>, <b>Exchange</b>, and <b>Studio</b>.
          </p>
          <p class="medium-desc">
            These products are used by enterprise customers. We work hard to ensure our API
            documentation is a world-class tool.
          </p>

          <div class="dual-screens">
            <figure>
              <img
                src="/resources/api-images/ss-designer.png"
                alt="Screenshot of MuleSoft API designer"
              />
              <figcaption>API Designer</figcaption>
            </figure>
            <figure>
              <img
                src="/resources/api-images/ss-exchange.png"
                alt="Screenshot of Anypoint Exchange"
              />
              <figcaption>Anypoint Exchange</figcaption>
            </figure>
          </div>
        </section>

        <section class="work-flow info-section">
          <h2>Works great with MuleSoft API tooling</h2>
          <img
            src="/resources/general-data-flow.png"
            width="682"
            height="244"
            alt="API tooling use flow"
          />
          <p>
            API Console uses data model generated by the
            <a href="https://github.com/aml-org/amf" target="_blank" rel="noreferrer">AMF parser</a>
            from RAML or OAS project.
          </p>
        </section>
      </main>
    `;
  }

  static get styles() {
    return [styles];
  }
}
