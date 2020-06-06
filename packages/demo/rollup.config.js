import { createSpaConfig } from '@open-wc/building-rollup';
import path from 'path';
import merge from 'deepmerge';
import postcss from 'rollup-plugin-postcss';
import cpy from 'rollup-plugin-cpy';

const baseConfig = createSpaConfig({
  outputDir: 'demo-dist',
  developmentMode: process.env.ROLLUP_WATCH === 'true',
  injectServiceWorker: true,
});


baseConfig.context = 'window';

export default merge(baseConfig, {
  input: path.join(__dirname, 'index.html'),
  output: {
    sourcemap: false,
  },
  plugins: [
    postcss(),
    cpy({
      files: [
        path.join(__dirname, 'vendor.js'),
        // path.join(__dirname, 'models'),
        path.join(__dirname, '*.css'),
      ],
      dest: 'demo-dist',
      options: {
        parents: false,
      },
    }),
    cpy({
      files: [path.join(__dirname, 'models', '*.json')],
      dest: path.join('demo-dist', 'models'),
      options: {
        parents: false,
      },
    }),
  ],
});

// const config = createDefaultConfig({
//   input: path.join(__dirname, 'index.html'),
//   indexHTMLPlugin: {
//     minify: {
//       minifyJS: true,
//       removeComments: true,
//     },
//   },
// });
//
// config.output.dir = 'demo-dist';
// config.context = 'window';
//
// // console.log(config);
//
// export default [
//   {
//     ...config,
//     plugins: [
//       ...config.plugins,
//       postcss(),
//       cpy({
//         files: [
//           path.join(__dirname, 'vendor.js'),
//           // path.join(__dirname, 'models'),
//           path.join(__dirname, '*.css'),
//         ],
//         dest: 'demo-dist',
//         options: {
//           parents: false,
//         },
//       }),
//       cpy({
//         files: [path.join(__dirname, 'models', '*.json')],
//         dest: path.join('demo-dist', 'models'),
//         options: {
//           parents: false,
//         },
//       }),
//     ],
//   },
// ];
