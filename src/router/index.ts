import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routerMap: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home', // 添加这行实现自动跳转
    meta: { title: '首页' },
    children: [
      {
        name: 'Home',
        path: '/home',
        component: () => import('@/App.vue'),
      },
    ],
  },
  // {
  //     path: '/login',
  //     name: 'Login',
  //     component: () => import('@/views/login/index.vue'),
  //     meta: { title: '登录页' },
  // }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
  strict: true,
  routes: [...routerMap],
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
