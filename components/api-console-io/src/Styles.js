import { css } from 'lit-element';

export default css`
:host {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh / 2);
  position: absolute;
  left: 0;
  right: 0;
  background-color: #2196F3;
  background: linear-gradient(167deg, rgba(33,150,243,1) 46%, rgba(3,169,244,1) 100%);
  box-shadow: 0 0 8px 0 rgba(0,0,0,.08),
              0 0 15px 0 rgba(0,0,0,.02),
              0 0 20px 4px rgba(0,0,0,.06);
}

h1 {
  font-size: 7rem;
  font-weight: 300;
  letter-spacing: -.044em;
  color: #fff;
  box-sizing: border-box;
  margin: 0;
}

.subtitle {
  color: #fff;
  font-size: 3rem;
  font-weight: 200;
  margin-top: 80px;
}

main {
  margin-top: calc(100vh / 2);
  width: 100%;
  max-width: 1680px;
}

.short-description {
  text-align: center;
  margin: 5rem 0;
  font-size: 2rem;
  color: #212121;
  font-weight: 400;
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

.main-action-buttons anypoint-button[emphasis="medium"] {
  background-color: #1565C0;
  border-color: transparent;
}

h2.section-title {
  font-size: 3rem;
  text-align: center;
}

.medium-desc {
  font-size: 1.8rem;
  text-align: center;
}

.platform-cases {
  background-color: #F5F5F5;
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

.use-reasons {
  margin: 60px 0;
  display: flex;
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
    margin: 50vh 24px auto;
  }
}
`;
