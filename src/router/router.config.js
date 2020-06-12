// eslint-disable-next-line
import {
  // Main,
  UserLayout,
  BasicLayout,
  BlankLayout
} from '@/layouts'

// 动态路由配置
export const asyncRouterMap = [
  {
    path: '/',
    name: 'Index', // 默认首页
    component: BasicLayout,
    meta: {
      title: '首页' // 面包宵索引名称
    },
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'BonusIndex',
        component: () => import('@/views/bonusIndex/'),
        meta: {
          title: '首页', // '社会调查报告分发首页列表',
          icon: 'icon-ic_normal_home',
          permission: [1, 2, 3]
        }
      },
      {
        path: '/bonusDistribute',
        name: 'BonusDistribute',
        // component: PageView,
        component: () => import('@/views/index'),
        redirect: '/bonusDistribute/list',
        meta: {
          title: '分发社会调查报告', // '分发社会调查报告',
          icon: 'icon-ic_normal_distri',
          permission: [3]
        },
        children: [
          {
            path: 'list',
            name: 'DistributeList',
            // component: PageView,
            component: () => import('@/views/bonusDistribute/index'),
            meta: {
              title: '分发社会调查报告', // '分发社会调查报告',
              permission: [3]
            }
          },
          {
            path: 'pendingHandledUnit',
            name: 'PendingHandledUnit',
            // component: PageView,
            component: () => import('@/views/bonusDistribute/pendingHandledUnit/index'),
            meta: {
              title: '待处理社会调查报告单元', // '待处理社会调查报告单元',
              permission: [3]
            }
          },
          {
            path: 'distributing',
            name: 'Distributing',
            // component: PageView,
            component: () => import('@/views/bonusDistribute/distributing/index'),
            meta: {
              title: '待分发社会调查报告单元', // '待分发社会调查报告单元',
              permission: [3]
            }
          },
          {
            path: 'searchMember',
            name: 'SearchMember',
            // component: PageView,
            component: () => import('@/views/bonusDistribute/searchMember/index'),
            meta: {
              title: '社会调查报告分发人员搜索', // '社会调查报告分发人员搜索',
              permission: [3]
            }
          }
        ]
      },
      {
        path: '/bonusDistributeProcess',
        name: 'BonusDistributeProcess',
        // component: PageView,
        component: () => import('@/views/bonusDistributeProcess/index'),
        meta: {
          title: '查看社会调查报告分发进度', // '查看社会调查报告分发进度',
          icon: 'icon-ic_selected_bonus',
          permission: [1]
        }
      },
      {
        path: '/recheckBonusInfo',
        name: 'RecheckBonusInfo',
        // component: PageView,
        component: () => import('@/views/recheckBonusInfo/index'),
        meta: {
          title: '复核社会调查报告信息', // '复核社会调查报告信息',
          icon: 'icon-ic_selected_check',
          permission: [2]
        }
      },
      {
        path: '/supplementTaxInfo',
        name: 'SupplementTaxInfo',
        // component: PageView,
        component: () => import('@/views/supplementTaxInfo/index'),
        meta: {
          title: '补充明文信息', // '补充明文信息',
          icon: 'icon-ic_selected_tax',
          permission: [2]
        }
      },
      {
        path: '/financeInfo',
        name: 'FinanceInfo',
        // component: PageView,
        component: () => import('@/views/financeInfo/index'),
        meta: {
          title: '报告导入上年实体', // '报告导入',
          icon: 'icon-ic_selected_treeschedule',
          permission: [2]
        }
      },
      {
        path: '/creatingRules',
        name: 'creatingRules',
        // component: PageView,
        component: () => import('@/views/index'),
        redirect: '/creatingRules/ruleList',
        meta: {
          title: '设置预算和预警规则', // '设置预算和预警规则',
          icon: 'icon-ic_selected_alert',
          permission: [1]
        },
        children: [
          {
            path: 'ruleList',
            name: 'RuleList',
            // component: PageView,
            component: () => import('@/views/creatingRules/RuleList'),
            // redirect: '/editModules/EarlyWarningRule',
            meta: {
              title: '编辑预算和预警规则', // '编辑预算和预警规则',
              permission: [1]
            },
            hidden: true
          },
          {
            path: 'rulesEdit',
            name: 'rulesEdit',
            // component: PageView,
            component: () => import('@/views/creatingRules/editModules/index'),
            // redirect: '/editModules/EarlyWarningRule',
            meta: {
              title: '编辑预算和预警规则', // '编辑预算和预警规则',
              permission: [1]
            },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录',
      permission: [1, 2, 3]
    }
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403')
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/exception/401')
  }
]
