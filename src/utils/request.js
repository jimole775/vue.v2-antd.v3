import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { logout } from '@/utils/util.js'
import {
  VueAxios
} from './axios'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 300000 // 请求超时时间
})

const errHandler = (error) => {
  console.log('接口出错request-error:', error)
  // 出错拦截器
  if (error.response) {
    const data = error.response.data
    // const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '禁止访问了、Forbidden', // 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 404) {
      console.log('请求接口地址路径不对:', data.message)
      // notification.error({
      //   message: '请求接口地址路径不对!', // 'Not found',
      //   description: data.message
      // })
    }
    if (error.response.status === 400) {
      notification.error({
        message: '错误参数',
        description: data.message
      })
    }
    if (error.response.status === 500) {
      notification.error({
        message: '服务端异常',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      // 401需要重新登陆，必须携带重定向地址
      router.push({ path: '/401', query: { from: router.currentRoute.path }}).catch(err => { err })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  // 保存到本地
  const token = localStorage.getItem('token') // Vue.ls.get(ACCESS_TOKEN) ||
  // 获取token 'Bearer '
  // console.log('request-token:', token)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
    config.headers['Appid'] = '7b541b12cedb48fd9656e4cf6b2bfd32' // Access-Token 让每个请求携带自定义 token 请根据实际情况自行修改
  } else {
    logout() // 没有token就先跳转到登出页面，防止单点登录无限循环跳转
  }

  // 5分钟不操作拦截当前请求并退出登录
  const { state, dispatch, state: { user }, state: { user: { lastGetTime }}} = store
  const currentTime = Date.parse(new Date()) // 获取当前时间戳，lastGetTime为最后一次请求的时间
  const diffTime = currentTime - lastGetTime // 最后一期请求和当前时间的时间差
  const min = 30 * 60 * 1000 // 5分钟转换成的时间戳
  if (lastGetTime == 0 || diffTime < min) { // 如果刷新页面或者当前请求是在设置的时间差范围内就执行更新最后一次请求时间的操作
    dispatch('UpdateLastTime')
  } else { // 否则就是超过设置的时间，执行登出操作
    logout() // 清除所有缓存//强制退出登录
    return Promise.reject(new Error('静默超时')) // 拦截请求，不进行后台数据交互
  }

  return config
}, errHandler)

// response interceptor
service.interceptors.response.use((response) => {
  response.headers['Content-Type'] = 'application/json; charset=UTF-8'
  return response.data
}, errHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
