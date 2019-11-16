import { css } from 'lit-element';

export default css`
  :host {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    --header-height: 50vh;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    position: absolute;
    left: 0;
    right: 0;
    background-color: #2196f3;
    background: linear-gradient(167deg, rgba(33, 150, 243, 1) 46%, rgba(3, 169, 244, 1) 100%);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 0 15px 0 rgba(0, 0, 0, 0.02),
      0 0 20px 4px rgba(0, 0, 0, 0.06);
  }

  h1 {
    font-size: 7rem;
    font-weight: 300;
    letter-spacing: -0.044em;
    color: #fff;
    box-sizing: border-box;
    margin: 0;
  }

  h2 {
    font-size: 1.7em;
    font-weight: 800;
    line-height: 1.6em;
  }

  .subtitle {
    color: #fff;
    font-size: 3rem;
    font-weight: 200;
    margin-top: 80px;
  }

  main {
    margin-top: var(--header-height);
    width: 100%;
    max-width: 1680px;
  }

  .short-description {
    text-align: center;
    font-size: 1.64rem;
    line-height: 2.4rem;
    color: #212121;
    font-weight: 400;
    max-width: 900px;
    margin: 6rem auto;
  }

  .ss-carousel {
    white-space: nowrap;
    height: auto;
    width: 100%;
    overflow-x: scroll;
    scroll-snap-type: x proximity;
    background-color: white;
    margin: 60px 0;
  }

  .ss-img {
    scroll-snap-align: start;
    display: inline-block;
    vertical-align: middle;
    margin: 8px 16px;
  }

  .ss-img figure {
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .ss-img figcaption {
    background-color: #0ba3f3;
    color: black;
    padding: 4px 8px;
  }

  .ss-img img {
    height: 600px;
  }

  .button-anchor {
    text-decoration: none;
  }

  .main-action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 40px 0 0 0;
  }

  .main-action-buttons anypoint-button {
    margin: 8px 0;
    color: white;
  }

  .main-action-buttons a:focus {
    outline: none;
  }

  .main-action-buttons a:focus anypoint-button {
    outline: #fff auto 1px;
  }

  .main-action-buttons anypoint-button[emphasis='medium'] {
    background-color: #1565c0;
    border-color: transparent;
  }

  h2.section-title {
    font-size: 3rem;
    text-align: center;
  }

  .medium-desc {
    font-size: 1.6rem;
    line-height: 2.2rem;
    text-align: center;
  }

  .platform-cases {
    background-color: #f5f5f5;
    padding: 48px 0;
    margin: 40px 0;
  }

  .dual-screens {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 40px 0;
  }

  .dual-screens figure {
    flex: 1;
  }

  .dual-screens img {
    width: 100%;
  }

  .info-section {
    margin: 8rem 0;
    display: flex;
  }

  .use-reasons {
    flex-direction: row;
  }

  .use-reasons .image,
  .use-reasons .desc {
    flex: 1;
  }

  .use-reasons .image {
    text-align: center;
  }

  .shadow-image {
    box-shadow: 0px 0px 20px 2px #00000038;
  }

  .checked-list {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1rem;
    max-width: 500px;
  }

  .checked-list > li {
    padding-left: calc(4px + 1.75em);
    padding-right: 4px;
    margin-bottom: 0.75em;
  }

  .checked-list > li::before {
    content: '✓';
    color: #3e4348;
    overflow: hidden;
    display: inline-block;
    position: absolute;
    width: 1.75em;
    margin-left: -1.75em;
    text-align: left;
  }

  .work-flow {
    flex-direction: column;
    align-items: center;
  }

  @media (max-height: 980px) {
    :host {
      --header-height: 70vh;
    }
  }

  @media (min-height: 980px and max-height: 1100px) {
    :host {
      --header-height: 60vh;
    }
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
      margin: var(--header-height) 24px auto;
    }
  }

  @media (max-width: 1024px) {
    .dual-screens,
    .use-reasons {
      flex-direction: column;
    }

    .ss-img img {
      width: initial;
      height: 360px;
      max-width: initial;
    }

    img {
      margin: 0 12px;
      max-width: calc(100% - 24px);
      height: auto;
    }

    figure {
      margin: 0;
    }

    .info-section {
      margin-left: 24px;
      margin-right: 24px;
    }

    .platform-cases {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
`;
