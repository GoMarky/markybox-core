import path from 'path';
import {
  defineConfig, mergeConfig,
} from 'vite';

import root from '../helpers/path/root';
import basePlayerViteConfig from './vite.config.player.base';

export default mergeConfig(basePlayerViteConfig, defineConfig({
  root: path.resolve(root, 'src/editor/versions/smart'),
}));
