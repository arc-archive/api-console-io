/* eslint-disable func-names */
import fs from 'fs/promises';
import path from 'path';

const name = 'rollup-plugin-cpy';

/**
 * @param {string} dir 
 * @param {string} pattern 
 * @param {string} output 
 */
async function copyPattern(dir, pattern, output) {
  const files = await fs.readdir(dir);
  const finalPattern = pattern.replaceAll(/\./gm, '\\.').replaceAll('*', '.*');
  const re = new RegExp(finalPattern);

  for (const file of files) {
    if (re.test(file)) {
      await fs.copyFile(path.join(dir, file), path.join(output, file));
    }
  }
}

/**
 * @param {string} input 
 * @param {string} output 
 */
async function copyPath(input, output) {
  const srcDir = path.dirname(input);
  const file = path.basename(input);
  if (file.includes('*')) {
    await copyPattern(srcDir, file, output);
  } else {
    await fs.copyFile(input, path.join(output, file));
  }
}

async function copyFiles(options) {
  const { files, dest } = options;
  await fs.mkdir(dest, { recursive: true });
  for (const file of files) {
    await copyPath(file, dest);
  }
}

export default function(options) {
  return {
    name,
    async writeBundle() {
      await copyFiles(options)
    },
  }
}
