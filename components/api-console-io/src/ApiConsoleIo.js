import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import styles from './Styles.js';

export class ApiConsoleIo extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html `
      <header>
        <h1>API console</h1>
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
            API Console automates API documentation process by generating an UI
            from <b>RAML</b> and <b>OAS</b> files.
          </p>
        </section>

        <section class="ss-carousel">
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-method.png"/>
              <figcaption>API method documentation</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-type-doc.png"/>
              <figcaption>A type documentation</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-examples.png"/>
              <figcaption>Generated examples</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-tryit.png"/>
              <figcaption>API testing with pre-populated values</figcaption>
            </figure>
          </div>
          <div class="ss-img">
            <figure>
              <img src="/resources/api-images/ss-mobile.png"/>
              <figcaption>Mobile view build-in into design</figcaption>
            </figure>
          </div>
        </section>

        <section class="use-reasons">
          <div class="image">
            <img src="/resources/api-images/ss-mobile2.png" width="403" height="386" class="shadow-image"/>
          </div>
          <div class="desc">
            <h2>Document everything, easily</h2>
            <ul class="checked-list">
              <li>Support for <b>RAML</b> and <b>OAS</b> documents is built-in by default.</li>
              <li>Automatic API documentation generation from <b>AMF</b> data model. Use AMF parser to process API files.</li>
              <li>API Console can be embedded inside existing application as a web component or be used as a standalone application.</li>
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
            These products are used by enterprise customers. We work hard
            to ensure our API documentation is a world-class tool.
          </p>

          <div class="dual-screens">
            <figure>
              <img src="/resources/api-images/ss-designer.png"/>
              <figcaption>API Designer</figcaption>
            </figure>
            <figure>
              <img src="/resources/api-images/ss-exchange.png"/>
              <figcaption>Anypoint Exchange</figcaption>
            </figure>
          </div>
        </section>
      </main>
    `;
  }

  static get styles() {
    return [styles];
  }
}
