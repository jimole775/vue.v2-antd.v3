import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { getUserInfo } from '@/api/bonusDistributeConfirm'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    nickName:'',
    roleId:'',
    isNew: null,
    userId:'',
    isGuide:[],
    lastGetTime:0,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    GET_INFO: (state, {nickName,roleId,userId,isNew}) => {

      state.nickName = nickName
      state.roleId = roleId
      state.userId = userId
      state.isNew = isNew 
      state.isGuide = isNew == null ? [] : isNew.split(',')

    },
    ADD_GUIDE: (state, page) => {

      state.isGuide.push(page)

    },
    MODIFY_GUIDE: (state, page) => {

      state.isGuide = page

    },
    UPDATE_LAST_TIME: (state) => {

      state.lastGetTime = Date.parse(new Date())

    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
		return new Promise((resolve, reject) => {
			getInfo().then(response => {
			const result = response.result

			if (result.role && result.role.permissions.length > 0) {
				const role = result.role
				role.permissions = result.role.permissions
				role.permissions.map(per => {
				if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
					const action = per.actionEntitySet.map(action => { return action.action })
					per.actionList = action
				}
				})
				role.permissionList = role.permissions.map(permission => { return permission.permissionId })
				commit('SET_ROLES', result.role)
				commit('SET_INFO', result)
			} else {
				reject(new Error('getInfo: roles must be a non-null array !'))
			}

			commit('SET_NAME', { name: result.name, welcome: welcome() })
			commit('SET_AVATAR', result.avatar)

			resolve(response)
			}).catch(error => {
			reject(error)
			})
		})
	},
	
	GetUserInfo ({ commit }) {

		return getUserInfo().then(res => {

			let { code , data } = res

			if(code == 200 && data != null){

				/* let { nickName , roleId } = data */

				commit('GET_INFO', data)

			}

			return data
		})
	},

	UpdateLastTime ({ commit }) {

		commit('UPDATE_LAST_TIME')

	},

    // 登出
    Logout ({ commit, state }) {
		return new Promise((resolve) => {
			logout(state.token).then(() => {
			resolve()
			}).catch(() => {
			resolve()
			}).finally(() => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			Vue.ls.remove(ACCESS_TOKEN)
			})
		})
    },

    AddGuide({ commit, state }, pageNmae ){
      commit('ADD_GUIDE', pageNmae)
    },

    ModifyGuide({ commit, state },newGuide){
      commit('MODIFY_GUIDE',newGuide)
    }

  }
}

export default user
