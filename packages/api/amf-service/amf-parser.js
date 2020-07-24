const amf = require('amf-client-js');
const {FileResourceLoader} = require('./env/FileResourceLoader.js');

// import amf from 'amf-client-js';
amf.plugins.document.WebApi.register();
amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFValidation.register();
let initied = false;

async function validateDoc(type, doc) {
  let validateProfile;
  switch (type) {
    case 'RAML 1.0':
      validateProfile = amf.ProfileNames.RAML;
      break;
    case 'RAML 0.8':
      validateProfile = amf.ProfileNames.RAML08;
      break;
    case 'OAS 1.0':
    case 'OAS 2.0':
    case 'OAS 3.0':
      validateProfile = amf.ProfileNames.OAS;
      break;
    default:
      return;
  }
  const result = await amf.AMF.validate(doc, validateProfile);
  process.send({ validation: result.toString() });
}

function setupEnvironment(apiPath) {
  return new amf.client.environment.Environment()
    .addClientLoader(new amf.JsServerFileResourceLoader())
    .addClientLoader(new FileResourceLoader(apiPath));
}

function getParser(type, contentType, env) {
  switch (type) {
    case 'RAML 0.8':
      return new amf.Raml08Parser(env);
    case 'RAML 1.0':
      return new amf.Raml10Parser(env);
    case 'OAS 2.0':
      if (contentType === 'application/json') {
        return new amf.Oas20Parser(env);
      }
      return new amf.Oas20YamlParser(env);
    case 'OAS 3.0':
      if (contentType === 'application/json') {
        return new amf.Oas30Parser(env);
      }
      return new amf.Oas30YamlParser(env);
    default:
      return amf.Core.parser("AMF Graph", "application/ld+json")
  }
}

/**
 * AMF parser to be called in a child process.
 *
 * AMF can in extreme cases takes forever to parse API data if, for example,
 * RAML type us defined as a number of union types. It may sometimes cause
 * the process to crash. To protect the renderer proces this is run as forked
 * process.
 *
 * @param {Object} data
 */
async function processData(data) {
  const sourceFile = data.source;
  const { type, contentType } = data.from;
  const { validate, apiRoot } = data;
  if (!initied) {
    await amf.Core.init();
  }
  /* eslint-disable-next-line require-atomic-updates */
  initied = true;
  const env = setupEnvironment(apiRoot);
  const file = `file://${sourceFile}`;
  // const parser = amf.Core.parser(type, contentType);
  const parser = getParser(type, contentType, env);
  let doc = await parser.parseFileAsync(file);
  if (validate) {
    await validateDoc(type, doc);
  }

  const resolver = amf.Core.resolver(type);
  doc = resolver.resolve(doc, 'editing');
  const generator = amf.Core.generator('AMF Graph', 'application/ld+json');
  const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
  return generator.generateString(doc, opts);
}

process.on('message', async data => {
  try {
    const api = await processData(data);
    process.send({
      api,
    });
  } catch (cause) {
    console.log(cause.toString());
    let m = `AMF parser: Unable to parse API ${data.source}.\n`;
    m += cause.s$1 || cause.message;
    process.send({ error: m });
  }
});
