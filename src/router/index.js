import Vue from 'vue'
import Router from 'vue-router'
import {
  constantRouterMap,
  asyncRouterMap
} from '@/router/router.config'

// 不经过动态路由

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap.concat(asyncRouterMap)
})
