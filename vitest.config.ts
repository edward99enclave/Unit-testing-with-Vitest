import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true,
    // Speed up tests by excluding folders
    exclude: ['node_modules', '.next'],
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
})