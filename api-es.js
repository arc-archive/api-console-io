import * as traceAgent from '@google-cloud/trace-agent';
import * as debugAgent from '@google-cloud/debug-agent';
import express from 'express';
import compression from 'compression';
import sjs from 'safe-json-stringify';
import { requestLogger } from './lib/logging.js';
import apiRouter from './packages/api/index.js';
import config from './config.js';

// import { isLocalhost } from './lib/Utils.js';

const IS_PRODUCTION = config.get('NODE_ENV') === 'production';

if (IS_PRODUCTION) {
  traceAgent.start();
  debugAgent.start();
}

const app = express();
export default app;

app.disable('etag');
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(requestLogger);
app.use(compression());

app.get('/_ah/health', (req, res) => {
  res.status(200).send('ok');
});

// app.use((req, res, next) => {
//   const host = req.get('host');
//   if (req.protocol === 'http' && !isLocalhost(host)) {
//     res.redirect(301, `https://${host}${req.url}`);
//     return;
//   }
//   next();
// });

// API
app.use('/v1', apiRouter);

app.get('/', (req, res) => {
  const data = sjs({
    error: true,
    description: 'This API has no main page. Go to demo.api-console.io instead.',
    // req,
  }, null, 2);
  res.header("Content-Type", "application/json");
  res.send(data);
});

const server = app.listen(config.get('PORT'), () => {
  const { port } = server.address();
  /* eslint-disable-next-line no-console */
  console.log(`App listening on port ${port}`);
});
