const amf = require('amf-client-js');
const fs = require('fs-extra');

/* eslint-disable class-methods-use-this */

class FileResourceLoader {
  constructor(workingDir) {
    this.workingDir = workingDir;
    this.resourceLoader = new amf.JsServerFileResourceLoader();
  }

  async fetch(path) {
    if (!path) {
      throw new Error('Empty path given.');
    }
    const localPath = path.replace('file://', '');
    const realPath = await fs.realpath(localPath);
    if (!realPath.includes(this.workingDir)) {
      throw new Error('Unable to include file from the outside of the API root folder');
    }
    return this.resourceLoader.fetch(path);
  }

  accepts(path) {
    return path.startsWith('file://');
  }

  static fail() {
    return Promise.reject(new Error('Failed to load resource'));
  }
}
exports.FileResourceLoader = FileResourceLoader;
