/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-08-20 16:54:15
 * @Description:
 * @FilePath: /Vue2Component/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../Layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('../views/HomeView.vue')
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          title: '关于'
        },
        component: () => import('../views/AboutView.vue')
      },
      {
        path: '/map',
        name: 'map',
        meta: {
          title: '地图'
        },
        component: () => import('../views/Map.vue')
      },
      {
        path: '/iframe',
        name: 'iframe',
        meta: {
          title: 'iframe'
        },
        component: () => import('../views/IframeView.vue')
      },
      {
        path: '/nestPage',
        name: 'nestPage',
        meta: {
          title: '嵌套页面'
        },
        component: () => import('../views/NestPage/index.vue'),
        redirect: '/nestPage/pageOne',
        children: [
          {
            path: 'pageOne',
            name: 'pageOne',
            meta: {
              title: '页面一'
            },
            component: () => import('../views/NestPage/PageOne/index.vue')
          },
          {
            path: 'pageTwo',
            name: 'pageTwo',
            meta: {
              title: '页面二'
            },
            component: () => import('../views/NestPage/PageTwo/index.vue')
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export function getRouter() {
  return router.options.routes
}

export default router
