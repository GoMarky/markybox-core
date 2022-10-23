import path from 'path';
import {
  defineConfig, mergeConfig,
  ResolvedConfig,
} from 'vite';

import root from '../helpers/path/root';
import viteConfigDevtoolBase from './vite.config.devtool.base';

export default (_: ResolvedConfig) => {
  return mergeConfig(viteConfigDevtoolBase, defineConfig({
    root: path.resolve(root, 'src/devtool/versions/native'),
  }));
};
