import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    // Never inline assets as data: URIs — the nginx CSP only allows fonts from 'self'.
    assetsInlineLimit: 0,
  },
  server: { port: 5173 },
});
