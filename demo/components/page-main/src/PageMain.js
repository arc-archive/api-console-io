import { html, css, LitElement } from 'lit-element';

export class PageMain extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: absolute;
          left: 0px;
          right: 0px;
          top: 0px;
          bottom: 0px;
        }

        h1 {
          font-size: 112px;
          font-weight: 300;
          letter-spacing: -0.044em;
          line-height: 120px;
          color: #fff;
          box-sizing: border-box;
          margin: 0;
        }

        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 63%;
          background-color: #2196f3;
          background: linear-gradient(167deg, rgba(33, 150, 243, 1) 46%, rgba(3, 169, 244, 1) 100%);
          box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 0 15px 0 rgba(0, 0, 0, 0.02),
            0 0 20px 4px rgba(0, 0, 0, 0.06);
        }

        .subtitle {
          color: #fff;
          font-size: 34px;
          font-weight: 200;
          line-height: 28px;
          margin-top: 80px;
        }

        main {
          max-width: 700px;
          margin: 80px auto;
        }

        .list-item {
          margin: 24px 0;
        }

        .list-item p {
          margin: 4px 0;
          font-size: 1.05rem;
        }

        @media (max-width: 1200px) {
          h1 {
            font-size: 54px;
            text-align: center;
            margin: 0 24px;
            line-height: 64px;
          }

          .subtitle {
            font-size: 28px;
          }

          main {
            max-width: 100%;
            margin: 40px 24px auto;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <header>
        <h1>API console demo pages</h1>
        <p class="subtitle">API design for humans</p>
      </header>
      <main class="centered">
        <div class="list-item">
          <p>API console standalone application</p>
          <a href="standalone">/standalone</a>
        </div>
        <div class="list-item">
          <p>API console web component</p>
          <a href="element">/element</a>
        </div>
        <div class="list-item">
          <p>API console with Anypoint theme</p>
          <a href="themed/anypoint">/themed/anypoint</a>
        </div>
        <div class="list-item">
          <p>API console with dark theme</p>
          <a href="themed/dark">/themed/dark</a>
        </div>
        <div class="list-item">
          <p>API console with code editor</p>
          <a href="editor">/editor</a>
        </div>
      </main>
    `;
  }
}
