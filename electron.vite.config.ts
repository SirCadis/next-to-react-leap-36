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
      external: ['electron'],
    },
    outDir: 'dist-electron',
    emptyOutDir: true,
  },
});