import fs from 'fs-extra';
import path from 'path';
import { readApiType } from './utils.js';

/**
 * Searches for API main file in given location
 */
export class ApiSearch {
  /**
   * @param {String} dir API directory location
   */
  constructor(dir) {
    this._workingDir = dir;
  }

  /**
   * Finds main API name.
   *
   * If one of the files is one of the popular names for the API spec files
   * then it always returns this file.
   *
   * If it finds single candidate it returns it as a main file.
   *
   * If it finds more than a single file it means that the user has to decide
   * which one is the main file.
   *
   * If it returns undefined than the process failed and API main file cannot
   * be determined.
   *
   * @return {Promise<Array<String>|String|undefined>}
   */
  async findApiFile() {
    const items = await fs.readdir(this._workingDir);
    const popularNames = ['api.raml', 'api.yaml', 'api.json'];
    const exts = ['.raml', '.yaml', '.json'];
    const ignore = ['__macosx', 'exchange.json', '.ds_store'];
    const files = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lower = items[i].toLowerCase();
      if (ignore.indexOf(lower) !== -1) {
        continue;
      }
      if (popularNames.indexOf(lower) !== -1) {
        return item;
      }
      const ext = path.extname(lower);
      if (exts.indexOf(ext) !== -1) {
        files.push(item);
      }
    }
    if (files.length === 1) {
      return files[0];
    }
    if (files.length) {
      return this._decideMainFile(files);
    }
    return null;
  }

  /**
   * Decides which file to use as API main file.
   * @param {Array<String>} files A file or list of files.
   * @return {Promise<String>}
   */
  async _decideMainFile(files) {
    const root = this._workingDir;
    const fullPathFiles = files.map(item => {
      return {
        absolute: path.join(root, item),
        relative: item,
      };
    });
    const list = await this._findWebApiFile(fullPathFiles);
    if (!list) {
      return files;
    }
    return list;
  }

  /**
   * Reads all files and looks for 'RAML 0.8' or 'RAML 1.0' header which
   * is a WebApi.
   * @param {Array<String>} files List of candidates
   * @return {Promise<String>}
   */
  async _findWebApiFile(files) {
    const f = files.shift();
    if (!f) {
      return null;
    }
    let results = [];
    try {
      const type = await readApiType(f.absolute);
      if (type && type.type) {
        /* eslint-disable-next-line require-atomic-updates */
        results[results.length] = f.relative;
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.warn('Unable to find file type', e);
    }
    const other = await this._findWebApiFile(files, results);
    if (other) {
      results = results.concat(other);
    }
    if (!results.length) {
      return null;
    }
    if (results.length === 1) {
      return results[0];
    }
    return results;
  }
}
