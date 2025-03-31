import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // 自定义输出目录（默认为 dist）
    sourcemap: true, // 是否生成 sourcemap
    minify: 'esbuild', // 代码压缩工具（默认 terser）
    rollupOptions: {
      output: {
        manualChunks: { // 手动代码分割配置
          'react-vendor': ['react', 'react-dom'],
          'lodash': ['lodash-es']
        }
      }
    }
  }
})