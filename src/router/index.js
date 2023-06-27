import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    // hidden: true 的意思是该路由不会在导航菜单中显示，但是仍然可以通过编程方式进行访问和导航。
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    // 路由/report被访问时会重定向到/report路径下的子路由，这是因为这个子路由是该路由下的默认子路由。
    redirect: '/system/emp',
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system',
    name: 'System',
    meta: { title: 'System Information', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/dept'),
        meta: { title: 'Department', icon: 'el-icon-menu' }
      },
      {
        path: 'emp',
        name: 'Emp',
        component: () => import('@/views/emp'),
        meta: { title: 'Employee', icon: 'el-icon-user-solid' }
      }
    ]
  },


  // 404 page must be placed at the end !!!通配符路径"*"，表示匹配所有未定义的路径
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // 默认情况下，Vue Router 使用的是哈希模式（hash mode），即 URL 中会有一个 # 符号来表示路由的路径。
  // 而当你将 mode 设置为 'history' 时，Vue Router 将使用 HTML5 History API 来管理路由，不再使用哈希模式。这样，URL 中的 # 符号将被去除
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),  //函数需要返回一个包含 x 和 y 属性的对象，表示切换到目标路由时的滚动位置。例如，{ x: 0, y: 0 } 表示滚动到页面顶部。
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
