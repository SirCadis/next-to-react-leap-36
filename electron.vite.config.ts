import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, 'src/electron/main.ts'),
        preload: resolve(__dirname, 'src/electron/preload.ts'),
      },
      formats: ['cjs'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'electron', 
        'better-sqlite3', 
        'node:url', 
        'node:path', 
        'path', 
        'fs', 
        'os',
        /^node:/
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
    target: 'node14',
    outDir: 'dist-electron',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});