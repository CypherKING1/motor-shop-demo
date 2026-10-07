import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * GitHub Pages 会把站点挂在子路径下：https://<用户名>.github.io/<仓库名>/
 * 这时必须把 base 设成 '/<仓库名>/'，否则打包出来的资源路径是 /assets/... ，
 * 在 Pages 上全部 404 → 页面白屏（GitHub Pages 项目站的经典坑）。
 *
 * 这里做成自动判断，不用手改、也不会影响本地开发：
 *   - 本地 npm run dev / preview：base = '/'
 *   - GitHub Actions 里构建：自动从 GITHUB_REPOSITORY 取仓库名 → base = '/<仓库名>/'
 * 所以仓库改名了也不用管。
 */
const repoName = (process.env.GITHUB_REPOSITORY || '').split('/')[1]
const isPagesBuild = Boolean(process.env.GITHUB_ACTIONS) && Boolean(repoName)
const base = isPagesBuild ? `/${repoName}/` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  base,

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    host: true,   // 允许手机 / 同局域网同事访问，方便看移动端效果
    port: 5173,
    open: false,

    watch: {
      /**
       * ⚠️ 必须忽略这些目录。
       * Vite 默认递归监听整个项目根目录；如果把临时产物（例如截图用的无头浏览器
       * user-data-dir）放在项目里，那些文件会被持续写入，触发大量 HMR / 整页 reload，
       * 一个空闲的 dev server 也能被顶到 40%+ CPU。
       */
      ignored: [
        '**/.tmp-check/**',
        '**/.tmp-scrape/**',
        '**/screenshots/**',
        '**/dist/**'
      ]
    }
  },

  preview: {
    host: true,
    port: 4173
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1200
  }
})
