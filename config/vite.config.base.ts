import vue from '@vitejs/plugin-vue';
import path from 'path';
import { UserConfigExport } from 'vite';
import svgLoader from 'vite-svg-loader';

import root from './helpers/path/root';

const src = path.resolve(__dirname, '../', 'src');
const outDir = path.join(root, 'build');

export default {
  resolve: {
    alias: {
      '@': src,
    },
  },
  optimizeDeps: {
    exclude: ['vue', 'pinia', 'vue-router'],
  },
  server: {
    host: true,
  },
  build: {
    outDir,
    ssr: false,
    minify: 'esbuild',
    emptyOutDir: true,
    sourcemap: process.env.mode === 'production',
  },
  plugins: [
    vue(),
    svgLoader(),
  ],
} as UserConfigExport;
