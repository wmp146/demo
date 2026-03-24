import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  console.log('当前环境变量：', env)
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      UnoCss({ configFile: './uno.config.ts' /*注意这里的后缀名*/ }),
      AutoImport({
        // 自动生成类型声明文件，方便 TypeScript 智能提示。
        dts: 'src/auto-imports.d.ts',
        // resolvers: [ElementPlusResolver()]
        // 自动按需导入 Element Plus 组件库相关的 API。
        resolvers: [ElementPlusResolver()],
        // [imports: [{ 'element-plus/es': ['ElMessageBox', 'ElMessage', 'ElNotification'] }]](http://vscodecontentref/2)
        // 自动导入 element-plus/es 包下的 ElMessageBox、ElMessage、ElNotification，你在代码里直接用这些 API，无需手动 import。
        imports: [{ 'element-plus/es': ['ElMessageBox', 'ElMessage', 'ElNotification'] }],
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      // 通过环境变量控制是否输出内联 sourcemap。
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      reportCompressedSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            'element-plus': ['element-plus'],
            'lodash-es': ['lodash-es'],
            axios: ['axios'],
            'vue-router': ['vue-router'],
            pinia: ['pinia', 'pinia-plugin-persistedstate'],
          },
        },
      },
    },
  }
})
