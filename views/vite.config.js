import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'modify-index-html', // 插件名称
      // 插件的构建钩子函数
      transformIndexHtml(html, { publicPath }) {
        // 定义要拼接到路径前面的字符串
        const prefix = '{{contextPath}}';
        // 替换 index.html 中的路径
        html = html.replace(/(src|href)="(\/.*\.js|\/.*\.css)"/g, (match, p1, p2) => {
          // 拼接路径前缀
          return `${p1}="${prefix}${p2}"`;
        });
        return html;
      },
    },
  ],
  server: {
    proxy: {
      '/adminapi': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
