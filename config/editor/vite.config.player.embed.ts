import path from 'path';
import {
  defineConfig, mergeConfig,
  ResolvedConfig,
} from 'vite';

import root from '../helpers/path/root';
import viteConfigPlayerBase from './vite.config.player.base';

export default (_: ResolvedConfig) => {
  return mergeConfig(viteConfigPlayerBase, defineConfig({
    root: path.resolve(root, 'src/editor/versions/embed'),
  }));
};
