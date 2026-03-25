import { fileURLToPath } from 'node:url' // 用于将文件URL转换为路径
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite' // Vite相关类型和函数
import vue from '@vitejs/plugin-vue' // Vue 3 单文件组件支持插件
import vueJsx from '@vitejs/plugin-vue-jsx' // Vue JSX 语法支持插件
import vueDevTools from 'vite-plugin-vue-devtools' // Vue 开发者工具插件
import UnoCss from 'unocss/vite' // UnoCSS 原子化CSS引擎
import AutoImport from 'unplugin-auto-import/vite' // 自动导入API插件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // Element Plus 组件解析器
import path from 'node:path' // Node.js 路径处理模块

// 获取当前文件的目录路径（ES模块中替代__dirname）
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 导出Vite配置（使用defineConfig以获得类型提示）
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载环境变量：根据当前模式（development/production等）加载对应的.env文件
  const env = loadEnv(mode, process.cwd())
  // 控制台输出当前环境变量（用于调试）
  console.log('当前环境变量：', env)

  return {
    // 插件配置：Vite 构建过程中使用的插件列表
    plugins: [
      vue(), // 支持 .vue 单文件组件
      vueJsx(), // 支持 JSX/TSX 语法
      vueDevTools(), // 集成 Vue DevTools，提升开发体验
      // UnoCSS 配置：指定配置文件路径
      UnoCss({ configFile: './uno.config.ts' /*注意这里的后缀名*/ }),
      // 自动导入API配置：无需手动 import，直接在代码中使用
      AutoImport({
        // 自动生成类型声明文件，方便 TypeScript 智能提示。
        dts: 'src/auto-imports.d.ts',
        // 自动按需导入 Element Plus 组件库相关的 API。
        resolvers: [ElementPlusResolver()],
        // 自动导入 element-plus/es 包下的 ElMessageBox、ElMessage、ElNotification
        // 你在代码里直接用这些 API，无需手动 import。
        imports: [{ 'element-plus/es': ['ElMessageBox', 'ElMessage', 'ElNotification'] }],
      }),
    ],

    // 模块解析配置
    resolve: {
      // 自动解析的扩展名列表：导入时可以省略这些后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      // 路径别名配置：简化模块导入路径
      alias: {
        '@': path.resolve(__dirname, './src'), // @ 指向 src 目录
        '@components': path.resolve(__dirname, './src/components'), // 组件目录别名
        '@utils': path.resolve(__dirname, './src/utils'), // 工具函数目录别名
      },
    },

    // 生产环境构建配置
    build: {
      // 代码压缩工具：使用 terser 进行代码压缩
      minify: 'terser',
      // 输出目录：通过环境变量 VITE_OUT_DIR 指定，默认为 'dist'
      outDir: env.VITE_OUT_DIR || 'dist',
      // 通过环境变量控制是否输出内联 sourcemap。
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // 是否报告打包后的文件压缩大小（设为 false 可加快构建速度）
      reportCompressedSize: false,
      // terser 压缩选项配置
      terserOptions: {
        compress: {
          // 是否删除 debugger 语句：通过环境变量 VITE_DROP_DEBUGGER 控制
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          // 是否删除 console 语句：通过环境变量 VITE_DROP_CONSOLE 控制
          drop_console: env.VITE_DROP_CONSOLE === 'true',
        },
      },
      // Rollup 打包选项（Vite 底层使用 Rollup）
      rollupOptions: {
        output: {
          // 手动代码分割配置：将大型依赖拆分成独立的 chunk
          manualChunks: {
            vue: ['vue'], // Vue 核心库单独打包
            'element-plus': ['element-plus'], // Element Plus 组件库单独打包
            'lodash-es': ['lodash-es'], // lodash-es 工具库单独打包
            axios: ['axios'], // HTTP 请求库单独打包
            'vue-router': ['vue-router'], // Vue Router 单独打包
            pinia: ['pinia', 'pinia-plugin-persistedstate'], // Pinia 状态管理及持久化插件单独打包
          },
        },
      },
    },
  }
})
