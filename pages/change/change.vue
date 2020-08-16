<template>
	<view id="change">
		<view class="ch-top">
			<view class="status-bar"></view>
			<view class="ch-down">
				<u-icon name="arrow-down" custom-prefix="custom-icon" size="50" color="white" @click="close"></u-icon>
			</view>
		</view>
		<view class="form-info" v-if="show">
			<u-form :model="form" ref="uForm" :error-type="errorType">
				<u-form-item label="年龄" prop="age">
					<u-input type="number" v-model="form.age" />
				</u-form-item>
				<u-form-item label="昵称" prop="nickname">
					<u-input v-model="form.nickname" />
				</u-form-item>
				<u-form-item label="性别">
					<u-radio-group v-model="form.sex" active-color="#9b59b6">
						<u-radio name="man">男</u-radio>
						<u-radio name="woman">女</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="邮箱" prop="email">
					<u-input v-model="form.email" />
				</u-form-item>
			</u-form>
			<view style="margin-top: 40px;">
				<u-button @click="submit">提交</u-button>
			</view>
		</view>
		<view class="ch-worker" v-else>
			<u-form :model="person" ref="pForm" :error-type="errorType">
				<u-form-item label="姓名" prop="name">
					<u-input v-model="person.name" />
				</u-form-item>
				<u-form-item label="公司" prop="company">
					<u-input type="select" v-model="person.company" :select-open="visible" @click="visible = true"/>
				</u-form-item>
				<u-form-item label="员工码" prop="workcode">
					<u-input v-model="person.workcode" />
				</u-form-item>
			</u-form>
			<view style="margin-top: 40px;">
				<u-button @click="verify">提交</u-button>
			</view>
		</view>
		<u-select v-model="visible" :list="list" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {mapMutations, mapState} from 'vuex'
	export default {
		data() {
			return {
				visible: false,
				list: [],
				form: {
					age: '18',
					sex: 'man',
					nickname: '',
					email: ''
				},
				person: {
					name: '',
					company: '',
					workcode: ''
				},
				errorType: ['toast'],
				rules: {
					age: [
						{
							required: true,
							message: '请填写年龄'
						},
						{
							max: 2,
							message: '年龄不符'
						}
					],
					nickname: [
						{
							required: true,
							message: '请填写昵称'
						},
						{
							max: 8,
							message: '昵称不能超过八个字符'
						}
					],
					email: [
						{
							required: true,
							message: '请输入邮箱'
						},
						{
							type: 'email',
							message: '邮箱不符'
						}
					]
				},
				verifyrule: {
					name: [
						{
							required: true,
							message: '请填写姓名'
						}
					],
					company: [
						{
							required: true,
							message: '请选择公司'
						}
					],
					workcode: [
						{
							required: true,
							message: '请填写员工码'
						}
					]
				}
			};
		},
		computed: {
			...mapState(['userinfo'])
		},
		onReady() {
			if (this.$refs.uForm) {
				this.$refs.uForm.setRules(this.rules);
			} else if (this.$refs.pForm) {
				this.$refs.pForm.setRules(this.verifyrule);
			}
		},
		onLoad(v) {
			if (v.bool === 'change') {
				this.show = true
			} else if (v.bool === 'worker') {
				this.show = false;
				uni.request({
					url: 'http://10.145.226.11:3000/addinfo',
					method: 'GET',
					success: (res) => {
						if (res.data !== 'fail') {
							let data = res.data;
							data.forEach((val) => {
								this.list.push({
									label: val.company,
									value: val.company
								})
							})
						}
					}
				})
			}
		},
		methods: {
			...mapMutations(['changeAuthority', 'changeUserinfo']),
			close() {
				uni.navigateBack({
					url: '../user/user'
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '正在提交...'
						})
						uni.request({
							url: 'http://10.145.226.11:3000/user',
							data: {
								username: this.userinfo.username,
								...this.form
							},
							method: 'PUT',
							success: (res) => {
								if (res.data === 'ok') {
									this.changeUserinfo({...this.form});
									uni.navigateBack({
										url: '../user/user'
									});
									uni.showToast({
										title: '提交成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '提交失败',
										position: 'top'
									})
								}
							}
						})
					}
				});
			},
			verify() {
				this.$refs.pForm.validate(valid => {
					if (valid) {
						uni.request({
							url: 'http://10.145.226.11:3000/addinfo',
							data: {
								username: this.userinfo.username,
								...this.person
							},
							method: 'PUT',
							success: (res) => {
								if (res.data === 'ok') {
									this.changeAuthority({...this.person});
									uni.navigateBack({
										url: '../user/user'
									});
									uni.showToast({
										title: '认证成功',
										icon: 'success'
									});
								}
							}
						})
					}
				})
			},
			confirm(e) {
				this.person.company = e[0].value;
			}
		}
	}
</script>

<style lang="scss">
	#change {
		width: 750rpx;

		.ch-top {
			background: linear-gradient(to right, #74b9ff, #0984e3);

			.status-bar {
				height: var(--status-bar-height);
			}

			.ch-down {
				padding: 5px 20px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
		}

		.form-info, .ch-worker {
			padding: 20px 40px;
		}
	}
</style>
