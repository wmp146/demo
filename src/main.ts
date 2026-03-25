import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'uno.css'
import App from './App.vue'
import ElementPlus from 'element-plus' // 导入 Element Plus
import 'element-plus/dist/index.css' // 导入样式文件
import { setupRouter } from './router'
const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
setupRouter(app)

app.mount('#app')
