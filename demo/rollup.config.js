import { createDefaultConfig } from '@open-wc/building-rollup';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';
import vendorConfig from './vendor-config.js';

const config = createDefaultConfig({
  input: path.join(__dirname, 'index.html'),
  indexHTMLPlugin: {
    minify: {
      minifyJS: true,
      removeComments: true
    }
  }
});

config.output.dir = 'demo-dist';

// console.log(config);

export default [
  vendorConfig,
  {
    ...config,
    plugins: [
      ...config.plugins,
      postcss(),
      cpy({
        files: [
          path.join(__dirname, 'google-drive-api-compact.json'),
        ],
        dest: 'demo-dist',
        options: {
          parents: false,
        },
      }),
    ]
  }
];
