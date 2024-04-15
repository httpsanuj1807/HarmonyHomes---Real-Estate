import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Apply proxy configuration only during development
      ...(process.env.NODE_ENV === 'development' && {
        '/api': {
          target: 'http://localhost:3000',
          secure: false
        }
      })
    }
  }, 
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.json'],
  },
});
