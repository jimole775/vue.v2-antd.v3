import router from './router'
import store from './store/'
import { verticalScroll, horizontalScroll } from '@/utils/util'
// 路由守卫获取获取用户基础信息
// 并将没有进入页面权限的用户进行404跳转
// 这里注意next()和next({}), 后者是递归
const whiteList = ['403', '404', '401'] // 白名单不需要验证权限
const publicRoutes = ['EmpMessage'] // 公共名单不需要验证权限，但是需要手机二次登陆
router.beforeEach((to, from, next) => {
  const { nickName, roleId } = store.state.user
  const {
    path,
    fullPath,
    query,
    params,
    name,
    meta: { permission }
  } = to
  if (!loginPermission(path)) return
  if (whiteList.includes(name)) {
    next()
  } else if (isToPublicRoute(fullPath)) {
    const token = localStorage.getItem('second_login_beacon')
    if (!token) {
      // 二次鉴权判断
      if (path === '/login') {
        next()
      } else {
        next({
          path: '/login', query: { from: from.fullPath, to: to.fullPath }
        })
      }
    } else {
      next()
      // PublicRoute下，二次鉴权只能使用一次，每次登陆都要重新获取
      localStorage.setItem('second_login_beacon', '')
    }
  } else {
    if (nickName === '' && roleId === '') {
      store
        .dispatch('GetUserInfo')
        .then(res => {
          if (res == null) {
            // 判断用户权限是否有值返回，没有的话就跳转403
            // 这里取 'to.fullPath' 为 'from' 的值：
            // 原因是路由执行 'to' 跳转的时候，会被劫持到403
            // 所以再这里的 'to' 对 403页面来说，就是 'from'
            next({ path: '/403', query: { from: to.fullPath }})
          } else {
            next({
              path,
              query,
              params
            })
          }
        })
        .catch(err => {
          console.log(err)
          // 判断用户权限是否有值返回，没有的话就跳转403
          // 这里取 'to.fullPath' 为 'from' 的值：
          // 原因是路由执行 'to' 跳转的时候，会被劫持到403
          // 所以再这里的 'to' 对 403页面来说，就是 'from'
          next({ path: '/403', query: { from: to.fullPath }})
        })
    } else {
      // 判断上面保存在store里的权限id是否对应当前跳转的页面权限，没有就进行403跳转
      const index = permission.findIndex(value => value === roleId)
      const token = localStorage.getItem('second_login_beacon')
      if (!token) {
        // 二次鉴权判断
        if (path === '/login') {
          next()
        } else {
          next({
            path: '/login', query: { from: from.fullPath, to: to.fullPath }
          })
        }
      } else if (index === -1) {
        // 判断用户权限是否有值返回，没有的话就跳转403
        // 这里取 'to.fullPath' 为 'from' 的值：
        // 原因是路由执行 'to' 跳转的时候，会被劫持到403
        // 所以再这里的 'to' 对 403页面来说，就是 'from'
        next({ path: '/403', query: { from: to.fullPath }})
      } else {
        next()
      }
    }
  }
})

router.afterEach((to, from, next) => {
  setTimeout(() => {
    const tables = document.querySelectorAll('.ant-table-wrapper')
    // 如果table数量超过1个，就不出发监听器
    if (tables.length === 1) {
      window.removeEventListener('scroll', verticalScroll)
      window.addEventListener('scroll', verticalScroll)

      // 只有有左右滚动条的table，才监听ant-table-body的滚动
      const antTableBody = tables[0].querySelector('.ant-table-scroll .ant-table-body')
      antTableBody && antTableBody.removeEventListener('scroll', horizontalScroll)
      antTableBody && antTableBody.addEventListener('scroll', horizontalScroll)
    }
  }, 1000)
})

function loginPermission(path) {
  const { location } = window
  const token = localStorage.getItem('token')
  const sToken = localStorage.getItem('second_login_beacon')
  // 如果本地和url都没有token, 就强制跳转到登陆页面
  if (!token && location.href.indexOf('token') === -1) {
    path = path.indexOf('empMessage') === -1 ? '/' : path
    location.replace(`${process.env.VUE_APP_LOGIN_URL}${path}`)
    return false
  } else {
    // 如果有新的token, 就重新存
    if (location.href.indexOf('token') > 0) {
      const locationSearch = location.search
      let token = locationSearch.split('token=').pop()
      token = token.includes('&') ? token.split('&').shift() : token
      localStorage.setItem('token', token)
      // 每次从SSO登录的时候删除掉二次登录的token
      if (sToken) {
        localStorage.removeItem('second_login_beacon')
      }
      // 剪裁掉URL的 token
      const { origin, pathname, search, hash } = location
      location.replace(`${origin}${pathname}${kickToken(search)}${hash}`)
    }

    return true
  }
}

function kickToken(search) {
  if (!search) return ''
  let res = ''
  search = search.replace('?', '')
  if (search.includes('&')) {
    const arr = []
    search.split('&').forEach((item) => {
      if (!item.includes('token')) {
        arr.push(item)
      }
    })
    res = arr.join('&')
  } else {
    return ''
  }
  return '?' + res
}

function isToPublicRoute(fullPath) {
  const reg = new RegExp(`[\/%2F](${
    publicRoutes.reduce((a, b) => {
      return a + '|' + b
    })
  })([\/%2F]|[\?%3F]|$)`, 'i')
  return reg.test(fullPath)
}
