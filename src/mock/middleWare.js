import Mock from 'mockjs2'
import { builder } from './util'
const services = []

// 载入配置项
services.push(require('./services/creatingRule'))
services.push(require('./services/supplementTaxInfo'))
services.push(require('./services/recheckBonusInfo'))
services.push(require('./services/bonusDistributeProcess'))

// 循环挂载 MOCK 代理
services.forEach(service => {
  const configs = service.default
  configs.forEach(config => {
    const res = () => {
      const count = Math.round(Math.random() * 20)
      const data = {
        data: [],
        pageNo: 0, // 当页页码
        pageSize: 0, // 当页总数
        totalCount: 0, // 总条数
        totalPage: 0 // 总页数
      }
      for (let i = 0; i < count; i++) {
        const randomRow = Mock.mock(config.mock)
        // 添加下标
        randomRow.id = randomRow.index = randomRow.key = i + 1
        data.data.push(randomRow)
      }
      data.pageNo = 1
      data.totalPage = 1
      data.pageSize = data.data.length
      data.totalCount = data.data.length
      return builder(data)
    }

    // 统一使用 POST 方式代理
    Mock.mock(config.path, 'post', res)
  })
})
