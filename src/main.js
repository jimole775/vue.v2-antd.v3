// ie polyfill
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import VueI18n from 'vue-i18n'
// mock
// import './mock' // 去掉模拟数据

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

import { message } from 'ant-design-vue'

// import i18n from '@/lang/index'
import enData from '@/lang/en'
import zhData from '@/lang/zh'
Vue.config.productionTip = false

Vue.use(VueAxios)
Vue.use(VueI18n)

message.config({
  duration: 2,
  maxCount: 1
})

const i18n = new VueI18n({
  // locale: localStorage.getItem('locale') || 'zh', // 默认中文
  locale: localStorage.getItem('locale') || 'en', // 英文
  messages: {
    en: {
      ...enData
    },
    zh: {
      ...zhData
    }
  }
})

new Vue({
  router,
  store,
  created: bootstrap,
  i18n,
  render: h => h(App)
}).$mount('#app')
