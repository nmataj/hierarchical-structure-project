import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          { removeViewBox: false },
          { removeDimensions: true },
          { removeAttrs: { attrs: '(stroke|fill)' } }
        ]
      }
    })
  ],
});
