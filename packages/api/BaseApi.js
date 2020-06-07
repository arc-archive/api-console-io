import cors from 'cors';
// import { logger } from '../../lib/logging.js';

export class BaseApi {
  constructor() {
    this._processCors = this._processCors.bind(this);

    this.allowedOrigins = ['https://demo.api-console.io'];
  }

  /**
   * Sets CORS on all routes for `OPTIONS` HTTP method.
   * @param {Object} router Express app.
   */
  setCors(router) {
    router.options('*', cors(this._processCors));
  }

  /**
   * Shorthand function to register a route on this class.
   * @param {Object} router Express app.
   * @param {Array<Array<String>>} routes List of routes. Each route is an array
   * where:
   * - index `0` is the API route, eg, `/api/models/:modelId`
   * - index `1` is the function name to call
   * - index `2` is optional and describes HTTP method. Defaults to 'get'.
   * It must be lowercase.
   */
  wrapApi(router, routes) {
    for (let i = 0, len = routes.length; i < len; i++) {
      const route = routes[i];
      const method = route[2] || 'get';
      const clb = this[route[1]].bind(this);
      router[method](route[0], cors(this._processCors), clb);
    }
  }

  _processCors(req, callback) {
    const whitelist = this.allowedOrigins;
    const origin = req.header('Origin');
    let corsOptions;
    if (!origin) {
      corsOptions = { origin: false };
    } else if (
      origin.indexOf('http://localhost:') === 0 ||
      origin.indexOf('http://127.0.0.1:') === 0
    ) {
      corsOptions = { origin: true };
    } else if (whitelist.indexOf(origin) !== -1) {
      corsOptions = { origin: true };
    }
    if (corsOptions) {
      // corsOptions.credentials = true;
      corsOptions.allowedHeaders = ['Content-Type'];
      corsOptions.origin = origin;
    }
    callback(null, corsOptions);
  }
}
