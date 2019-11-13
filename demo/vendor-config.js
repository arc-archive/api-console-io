import multiEntry from 'rollup-plugin-multi-entry';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: [
    require.resolve('jsonlint/lib/jsonlint.js'),
    'node_modules/codemirror/lib/codemirror.js',
    'node_modules/codemirror/addon/mode/loadmode.js',
    'node_modules/codemirror/mode/meta.js',
    'node_modules/codemirror/mode/javascript/javascript.js',
    'node_modules/codemirror/mode/xml/xml.js',
    'node_modules/codemirror/mode/htmlmixed/htmlmixed.js',
    'node_modules/codemirror/addon/lint/lint.js',
    'node_modules/codemirror/addon/lint/json-lint.js'
  ],
  output: {
    format: 'iife',
    file: 'demo-dist/vendor.js'
  },
  plugins: [
    multiEntry(),
    uglify()
  ],
  context: 'window'
};
