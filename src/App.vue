<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import iconfont from '@/assets/font/iconfont' //新加图标


export default {
  mixins: [AppDeviceEnquire, iconfont],
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {
    this.setBaseFontSize()
    this.disabledRightMenu()
  },
  methods: {
    setBaseFontSize() {
      const windowWidth = document.documentElement.clientWidth
      const base = 1920 // 1920 为设计稿基础宽度
      document.documentElement.style.fontSize = windowWidth * 0.0073 + (base - windowWidth) / 220 + 'px'
    },
    disabledRightMenu() {
      document.oncontextmenu = function(){
        event.returnValue = false;
      }
      // 或者直接返回整个事件
      document.oncontextmenu = function(){
        return false;
      }
    }
  }
}
</script>
<style >
@import url('./assets/font/iconfont.css'); /*导进图标*/
#app {
  height: 100%;
}
</style>
