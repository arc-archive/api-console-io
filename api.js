/* eslint-disable no-console */
import Server from '@api-components/amf-web-api';
import * as debugAgent from '@google-cloud/debug-agent';
import * as traceAgent from '@google-cloud/trace-agent';
import config from './config.js';

const IS_PRODUCTION = config.get('NODE_ENV') === 'production';

if (IS_PRODUCTION) {
  traceAgent.start();
  debugAgent.start();
}

(async () => {
  try {
    const httpPort = config.get('PORT');
    const srv = new Server({
      cors: {
        enabled: true,
        cors: {
          origin: (ctx) => {
            const origin = ctx.get('origin');
            if (!origin) {
              return '';
            }
            if (origin.includes('//localhost:') || origin.includes('//127.0.0.1:')) {
              return origin;
            }
            return 'https://demo.api-console.io';
          },
        }
      }
    });
    srv.setupRoutes('/v1');
    await srv.startHttp(httpPort);
  } catch (e) {
    console.error(`Unable to start the AMF server.`);
    console.error(e);
  }
})();
