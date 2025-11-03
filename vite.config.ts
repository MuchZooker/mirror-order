import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// 用于清理文件名的正则
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: '/mirror-order/',
  build: {
    rollupOptions: {
      output: {
        // 清理文件名，去除非法字符，并避免以下划线开头
        sanitizeFileName(name) {
          const match = DRIVE_LETTER_REGEX.exec(name);
          const driveLetter = match ? match[0] : '';
          // 过滤掉非法字符，并替换掉可能导致问题的字符（如下划线在某些情况下的处理）
          return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '');
        },
      },
    },
  },
})
