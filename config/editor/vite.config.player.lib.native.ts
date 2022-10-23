import typescript from '@rollup/plugin-typescript';
import * as path from 'path';
import {
  defineConfig, mergeConfig,
  ResolvedConfig,
} from 'vite';

import root from '../helpers/path/root';
import basePlayerViteConfig from './vite.config.player.base';

const rootPlayerDir = path.resolve(__dirname, root, 'src/editor/versions/native');
const nodeModulesDir = path.resolve(__dirname, root, 'node_modules/**');
const outDir = path.resolve(__dirname, root, 'lib');

export default mergeConfig(basePlayerViteConfig, defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, rootPlayerDir, 'index.ts'),
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
        typescript({
          rootDir: rootPlayerDir,
          declaration: true,
          declarationDir: outDir,
          exclude: nodeModulesDir,
          allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
}));
