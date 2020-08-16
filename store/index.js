import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {},
    avatar: ''
  },
  getters: {
		name(state) {
		  return state.userinfo.name
		},
    nickname(state) {
      return state.userinfo.nickname ? state.userinfo.nickname : 'Hello!'
    },
		gender(state) {
			return state.userinfo.sex
		}
  },
  mutations: {
    initUserinfo(state, value) {
      state.userinfo = value
    },
    initAvatar(state, bloburl) {
      state.avatar = 'data:image/png;base64,' + bloburl;
    },
		changeAuthority(state, val) {
			state.userinfo.company = val.company;
			state.userinfo.name = val.name
		},
		changeUserinfo(state, payload) {
			state.userinfo.age = payload.age;
			state.userinfo.sex = payload.sex;
			state.userinfo.nickname = payload.nickname;
			state.userinfo.email = payload.email;
		}
  },
  actions: {
    getAvatar({state, commit}) {
			uni.request({
				url: 'http://10.145.226.11:3000/user',
				data: {
					username: state.userinfo.username
				},
				method: 'GET',
				responseType: 'arraybuffer',
				success: (res) => {
					commit('initAvatar', uni.arrayBufferToBase64(res.data))
				}
			})
    }
  },
  modules: {
    
  },
  strict: process.env.NODE_ENV !== 'production'
})
