import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import nconf from 'nconf';

const __dirname = dirname(fileURLToPath(import.meta.url));

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    // 'CLOUD_BUCKET',
    'GCLOUD_PROJECT',
    'NODE_ENV',
    'PORT'
  ])
  // 3. Config file
  .file({ file: join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    PORT: 8080
  });

export default nconf;

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}

// Check for required settings
checkConfig('GCLOUD_PROJECT');
checkConfig('PORT');
