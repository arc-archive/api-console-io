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
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return this.fetchRemote(path);
    }
    const localPath = path.replace('file://', '');
    const realPath = await fs.realpath(localPath);
    if (!realPath.includes(this.workingDir)) {
      return new Error('Unable to include file from the outside of the API root folder');
    }
    return this.resourceLoader.fetch(path);
  }

  /**
   * Fetches a remote content only if it doesn't link to a resource in the local network.
   * @param {string} path
   * @return {Promise}
   */
  async fetchRemote(path) {
    let host = path.replace('http://', '').replace('https://', '');
    const index = host.indexOf('/');
    if (index > -1) {
      host = host.substr(0, index);
    }
    if (this.isPrivateNetwork(host)) {
      throw new Error('Unable to include resources pointing to an internal network');
    }
    return this.resourceLoader.fetch(path);
  }

  /**
   * Tests whether a host is an IP address to a local network resource.
   * @param {string} host The host
   * @return {boolean} True when the host refers to a local network
   */
  isPrivateNetwork(host) {
    const match = /(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?(?::(\d+))?/.exec(host);
    if (!match) {
      return false;
    }
    const a = Number(match[1]);
    const b = Number(match[2]);
    const c = Number(match[3]);
    const d = Number(match[4]);
    // 10.0.0.0 – 10.255.255.255
    if (a === 10) {
      return true;
    }
    // 172.16.0.0 – 172.31.255.255
    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }
    // 172.0.0.1
    if (a === 127 && b === 0 && c === 0 && d === 1) {
      return true;
    }
    // 192.168.0.0 – 192.168.255.255
    if (a === 192 && b === 168) {
      return true;
    }
    return false;
  }

  accepts(path) {
    return path.startsWith('file://') || path.startsWith('http://');
  }

  static async fail() {
    throw new Error('Failed to load resource');
  }
}
exports.FileResourceLoader = FileResourceLoader;
