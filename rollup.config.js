import { createSpaConfig } from '@open-wc/building-rollup';
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
  input: './index.html',
  output: {
    sourcemap: false,
  },
  plugins: [
    cpy({
      files: [
        './resources/**/*.*',
        './index.css',
        './robots.txt',
        './humans.txt',
      ],
      dest: 'www-dist',
      options: {
        parents: true,
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
