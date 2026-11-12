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
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)]),
      ),
    },
  },
});
