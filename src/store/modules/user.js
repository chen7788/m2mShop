import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from "@/store";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    user: '',
    status: '',
    code: '',
    introduction: '',
    roles: [],
    perms: [],
    setting: {
      articlePlatform: []
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_SETTING: (state, setting) => {
    state.setting = setting
  },
  SET_STATUS: (state, status) => {
    state.status = status
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data
        if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
          commit('SET_PERMS', data.perms)
        } else {
          reject('getInfo: perms must be a non-null array !')
        }
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMS', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
// 前端 登出
  fedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 动态修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(resolve => {
      commit('SET_TOKEN', role)
      setToken(role)
      getInfo(role).then(response => {
        const data = response.data
        commit('SET_ROLES', data.roles)
        commit('SET_PERMS', data.perms)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

