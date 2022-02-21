/* eslint-disable no-console */
const generator = require('@api-components/api-model-generator');

generator('./models/apis.json', {
  src: 'models/',
  dest: 'models/',
})
.then(() => console.log('Models created'))
.catch((cause) => console.error(cause));
