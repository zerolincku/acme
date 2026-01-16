import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包在一起
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // 将工具库打包在一起
          utils: [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],
          // 将图标库打包在一起
          icons: [
            'lucide-react',
          ],
        },
      },
    },
  },
});
