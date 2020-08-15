import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {
      nickname: 'Hello',
      age: 18,
      sex: 'woman',
      username: '',
      email: ''
    },
    companyinfo: {},
    copyinfo: {
      company: ''
    },
    avatar: ''
  },
  getters: {
		name(state) {
		  return state.copyinfo.name
		},
    nickname(state) {
      return state.userinfo.nickname;
    },
		gender(state) {
			return state.copyinfo.sex
		},
    username(state) {
      return {username: state.userinfo.username}
    },
    commonuser(state) {
      return state.userinfo.username
    },
    company(state) {
      return state.copyinfo.company
    },
    stranger(state) {
      return state.copyinfo.company == '' ? true : false
    },
    companyinfo(state) {
      return state.companyinfo
    }
  },
  mutations: {
    initUserinfo(state, value) {
      for (let key in state.userinfo) {
        state.userinfo[key] = value[key]
      }
      state.copyinfo = value;
    },
    initAvatar(state, bloburl) {
      state.avatar = 'data:image/jpeg;base64,' + bloburl;
    },
    resetUserinfo(state, value) {
      state.userinfo = value
    },
    initCompanyinfo(state, value) {
      state.companyinfo = value.data
    },
    resetRootinfo(state) {
      let sourcedata = {
        userinfo: {nickname: 'Hello',age: 18,sex: 'woman',username: '',email: ''},
        companyinfo: {},
        copyinfo: {
          company: ''
        },
        avatar: '',
        search: {
          totalcompany: state.search.totalcompany
        },
        product: state.product
      }
      this.replaceState(sourcedata)
    },
    addInfo(state, data) {
      state.copyinfo.name = data.name 
      state.copyinfo.company = data.company 
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
    },
    getCompanyinfo({commit, state}) {
      if (!state.copyinfo.company) return  //用户未完成员工认证则不获取工厂数据
      axios.get('/addinfo/all', {params: {company: state.copyinfo.company}}).then(
        (res) => {
          if (res.data !== 'fail') {
            commit({type: 'initCompanyinfo', data: res.data})
          }
        }
      ).catch(
        err => {
          console.error(err)
        }
      )
    }
  },
  modules: {
    
  },
  strict: process.env.NODE_ENV !== 'production'
})
