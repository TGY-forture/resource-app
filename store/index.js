import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userinfo: {},
		avatar: '',
		companyinfo: {}
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
		initAvatar(state, url) {
			if (/^file/.test(url)) {
				state.avatar = url
			} else {
				state.avatar = 'data:image/png;base64,' + url;
			}
		},
		initCompanyinfo(state, value) {
			state.companyinfo = value
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
		},
		clearUserinfo(state) {
			state.userinfo = {};
			state.avatar = ''
		}
	},
	actions: {
		getAvatar({
			state,
			commit
		}) {
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
		product: {
			namespaced: true,
			state: () => ({
				proinfo: {}, //工序名称
				fields: {}, //工序对应字段名
				fieldsvalue: {}, //字段对应值
				steps: [], //步骤信息,
				havedone: 0 //当前已完成的工序
			}),
			mutations: {
				injectdata(state, value) { //模块中接收 mutations 的 state 为局部的 state
					state.proinfo = value[0][0] //每道工序名称
					let items = value[0][1] //每道工序所需添加信息对应的字段名
					for (let key in items) { //将字段名拆分为数组
						items[key] = items[key].split('&')
					}
					state.fields = items;
					state.fieldsvalue = value[1]
				},
				flashsteps(state, data) {
					state.steps = data.sort((previous, after) => {
						if (previous.id < after.id) {
							return -1
						} else if (previous.id > after.id) {
							return 1
						} else {
							return 0
						}
					})
				},
				setHavedone(state, value) {
					state.havedone = value
				}
			},
			actions: {
				getProinfo({
					rootState,
					commit
				}) {
					uni.request({
						url: 'http://10.145.226.11:3000/record',
						method: 'GET',
						data: {
							tablename: rootState.companyinfo.tablename,
							totalprocess: rootState.companyinfo.totalprocess,
							company: rootState.companyinfo.company
						},
						success: function(res) {
							if (res.data !== 'fail') {
								commit('injectdata', res.data)
							}
						}
					})
				},
				getHavedone({
					commit,
					rootState
				}, seq) {
					uni.request({
						url: 'http://10.145.226.11:3000/record/pronum',
						data: {
							seq,
							tablename: rootState.companyinfo.tablename
						},
						method: 'GET',
						success: function(res) {
							if (res.data !== 'fail') {
								commit('setHavedone', res.data.havedone)
							}
						}
					})
				},
				getFlashValue({
					commit,
					rootState
				}, seq) {
					uni.request({
						url: 'http://10.145.226.11:3000/record/data',
						data: {
							seq,
							company: rootState.companyinfo.company
						},
						method: 'GET',
						success: function(res) {
							if (res.data !== 'fail') {
								commit('flashsteps', res.data)
							}
						}
					})
				},
				dataCRUD({state, rootState, commit, dispatch}, additional) {
					let today = new Date();
					let year = today.getFullYear();
					let month = today.getMonth() + 1;
					let date = today.getDate()
					let stateval = {
						table: rootState.companyinfo.tablename,
						seq: additional.seq,
						name: rootState.userinfo.name,
						action: additional.action,
						date: year + '/' + month + '/' + date,
						company: rootState.companyinfo.company
					}
					uni.request({
						url: 'http://10.145.226.11:3000/record',
						method: 'POST',
						data: {values: additional.form, stateval},
						success: (res) => {
							if (res.data === 'ok') {
								uni.showToast({
									title: '保存成功',
									position: 'top'
								})
								if (additional.action === 'add') {
									commit('setHavedone', state.havedone + 1)
								}
								dispatch('getFlashValue', additional.seq)
							}
						}
					})
				}
			}
		}
	},
	strict: process.env.NODE_ENV !== 'production'
})
