import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pages = [
  'index',
  'catalogo',
  'carrinho',
  'checkout',
  'login',
  'produto',
  'sobre',
];

export default defineConfig({
  plugins: [
    {
      name: 'copy-classic-scripts',
      apply: 'build',
      async closeBundle() {
        const outputDirectory = resolve(import.meta.dirname, 'dist', 'js');
        await mkdir(outputDirectory, { recursive: true });

        for (const script of ['main.js', 'catalogo.js', 'customizador.js']) {
          await copyFile(
            resolve(import.meta.dirname, 'js', script),
            resolve(outputDirectory, script),
          );
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)]),
      ),
    },
  },
});
