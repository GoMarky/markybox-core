import * as path from 'path';
import { defineConfig, mergeConfig } from 'vite';

import { EnvironmentVariable } from '../helpers/env';
import viteConfigBase from '../vite.config.base';

const src = path.resolve(__dirname, '../../', 'src');

export default mergeConfig(viteConfigBase, defineConfig({
  base: EnvironmentVariable.OUTPUT_PATH,
  resolve: {
    alias: {
      '@': src,
    },
  },
  server: {
    port: EnvironmentVariable.PORT,
  },
  define: {
    'process.env.APP_VERSION': JSON.stringify(EnvironmentVariable.APP_VERSION),
  },
}));

