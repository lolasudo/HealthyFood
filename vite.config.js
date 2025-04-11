import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gigachat': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/gigachat/, '/api/v1'),
      },
    },
  },
});