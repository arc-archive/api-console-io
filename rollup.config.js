import { createDefaultConfig } from '@open-wc/building-rollup';
import cpy from 'rollup-plugin-cpy';

const config = createDefaultConfig({ input: './index.html' });
config.output.dir = 'www-dist';
export default {
  ...config,
  output: {
    ...config.output,
    // sourcemap: false,
  },
  plugins: [
    ...config.plugins,
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
};
