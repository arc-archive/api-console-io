/* eslint-disable import/no-extraneous-dependencies */
import { createSpaConfig } from '@open-wc/building-rollup';
import path from 'path';
import cpy from 'rollup-plugin-cpy';
import merge from 'deepmerge';

const baseConfig = createSpaConfig({
  outputDir: 'www-dist',
  developmentMode: process.env.ROLLUP_WATCH === 'true',
  injectServiceWorker: true,
});


export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: path.join(__dirname, 'index.html'),
  output: {
    sourcemap: false,
  },
  plugins: [
    cpy({
      files: [
        path.join(__dirname, 'index.css'),
        path.join(__dirname, 'robots.txt'),
        path.join(__dirname, 'humans.txt'),
      ],
      dest: 'www-dist',
      options: {
        parents: false,
      },
    }),
    cpy({
      files: [
        path.join(__dirname, 'resources/*.png'),
      ],
      dest: path.join('www-dist', 'resources'),
      options: {
        parents: false,
      },
    }),
    cpy({
      files: [
        path.join(__dirname, 'resources/api-images/*.png'),
      ],
      dest: path.join('www-dist', 'resources', 'api-images'),
      options: {
        parents: false,
      },
    }),
  ],
});
//
// config.output.dir = 'www-dist';
// export default {
//   ...config,
//   output: {
//     ...config.output,
//     // sourcemap: false,
//   },
//   plugins: [
//     ...config.plugins,
//     cpy({
//       files: [
//         './resources/**/*.*',
//         './index.css',
//         './robots.txt',
//         './humans.txt',
//       ],
//       dest: 'www-dist',
//       options: {
//         parents: true,
//       },
//     }),
//   ],
// };
