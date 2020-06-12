<template>
  <div class="logo">
    <router-link :to="{ path: '/index', query: { id:'index' }}">
      <!-- <img src="@/assets/logo.png" /> -->
      <LogoSvg alt="logo"/>
    </router-link>
    <!-- <LogoSvg alt="logo" height="50" />
    <h2 v-if="showTitle" style="color:#00CF61; padding-left:20px;">{{ title }}</h2>-->
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: 'rongxis', //左侧菜单标题
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style lang="less" scoped>
html body .sider .logo img, html body .sider .logo svg {
    width: 80%;
    margin-left: -0.3rem;
}
</style>
