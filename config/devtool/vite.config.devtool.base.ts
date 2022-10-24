import * as path from 'path';
import { defineConfig, mergeConfig } from 'vite';

import { EnvironmentVariable } from '../helpers/env';
import root from '../helpers/path/root';
import viteConfigBase from '../vite.config.base';
import vue from '@vitejs/plugin-vue';

const src = path.resolve(root, 'src');

export default mergeConfig(viteConfigBase, defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': src,
    },
  },
  define: {
    'process.env.APP_VERSION': JSON.stringify(EnvironmentVariable.APP_VERSION),
  },
  plugins: [
    vue(),
  ],
}));
