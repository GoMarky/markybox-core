import * as path from 'path';
import {
  defineConfig,
  mergeConfig,
} from 'vite';

import root from '../helpers/path/root';
import basePlayerViteConfig from './vite.config.player.base';

const rootDir = path.resolve(__dirname, root, 'src/core');
const outDir = path.resolve(__dirname, root, 'lib');

export default mergeConfig(basePlayerViteConfig, defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, rootDir, 'index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    outDir,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
      plugins: [
      ],
    },
  },
}));
