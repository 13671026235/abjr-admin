import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/libs/util'

export default {
  state: {
    userId: '',
    username: '',
    avatorImgPath: '',
    token: getToken(),
    expiresAt: null,
    access: null
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUsername (state, name) {
      state.username = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, {token, expiresAt}) {
      state.token = token
      state.expiresAt = expiresAt
      setToken(token, expiresAt)
    },
    removeToken (state) {
      state.token = null
      state.expiresAt = null
      state.access = null
      removeToken()
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {username, password}) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          let token = data.accessToken
          let expiresAt = new Date()
          expiresAt.setTime(data.createdAt + data.expiresIn * 1000)
          commit('setToken', {token, expiresAt})
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('removeToken')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data
          commit('setAvator', data.avator)
          commit('setUsername', data.name)
          commit('setUserId', data.id)
          commit('setAccess', data.permissions)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
