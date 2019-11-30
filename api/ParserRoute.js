import express from 'express';
import { BaseApi } from './BaseApi.js';
import { ApiParser } from './ApiParser.js';
import { sendError } from './ErrorSupport.js';

const router = express.Router();
export default router;

class ParserRoute extends BaseApi {
  constructor() {
    super();
    this.parser = new ApiParser();
  }

  async parseFile(req, res) {
    try {
      const result = await this.parser.parseFile(req);
      res.status(result.code).send(result);
    } catch (e) {
      sendError(res, e.message, e.status || 500);
    }
  }

  async processCandidate(req, res) {
    try {
      const result = await this.parser.parseCandidate(req);
      res.send(result);
    } catch (e) {
      sendError(res, e.message, e.status || 500);
    }
  }
}

const api = new ParserRoute();
api.setCors(router);
api.wrapApi(router, [
  ['/', 'parseFile', 'post'],
  ['/candidate', 'processCandidate', 'post'],
  // ['/result', 'checkStatus'],
]);
