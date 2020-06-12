import Mock from 'mockjs2'

// 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  // 使用同步加载依赖
  // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
  console.log('mock mounting 挂载数据')
  require('./services/auth')
  require('./services/user')
  require('./services/manage')
  require('./services/other')
  require('./services/tagCloud')
  require('./services/article')

  // 使用中间件，把重复繁琐的事情交给脚本，开发人员配置代理路径和模拟数据就行
  require('./middleWare')

  Mock.setup({
    timeout: 800 // setter delay time
  })
  console.log('模拟数据')
}
