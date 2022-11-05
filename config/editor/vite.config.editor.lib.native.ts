import * as path from 'path';
import { mergeConfig } from 'vite';

import root from '../helpers/path/root';
import basePlayerViteConfig from './vite.config.editor.base';
import typescript from '@rollup/plugin-typescript';
import * as ttypescript from 'ttypescript';

const rootDir = path.resolve(__dirname, root, 'src/core');
const outDir = path.resolve(__dirname, root, 'lib');
const declarationDir = path.resolve(outDir, 'types');

export default mergeConfig(basePlayerViteConfig, {
  build: {
    lib: {
      entry: path.resolve(__dirname, rootDir, 'index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    outDir,
    rollupOptions: {
      plugins: [
        typescript({
          typescript: ttypescript,
          declaration: true,
          declarationDir,
          rootDir: rootDir,
          compilerOptions: {
            'plugins': [
              { 'transform': 'typescript-transform-paths', 'useRootDirs': true },
              { 'transform': 'typescript-transform-paths', 'useRootDirs': true, 'afterDeclarations': true }
            ]
          }
        }),
      ],
    },
  },
});
