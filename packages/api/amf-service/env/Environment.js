const amf = require('amf-client-js');
const {FileResourceLoader} = require('./FileResourceLoader.js');

class Environment {
  static getEnvironment(apiPath) {
    let env = amf.client.DefaultEnvironment.apply();
    const resourceLoader = new FileResourceLoader(apiPath);
    env = env.addClientLoader(resourceLoader);
    return env;
  }
}

exports.Environment = Environment;
