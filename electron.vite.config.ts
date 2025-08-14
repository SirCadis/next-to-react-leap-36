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
      external: ['electron', 'better-sqlite3'],
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist-electron',
    emptyOutDir: true,
    minify: false, // Keep readable for debugging
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});