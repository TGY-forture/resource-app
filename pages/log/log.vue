<template>
	<view id="log">
		<view class="status-bar"></view>
		<img class="hammer" src="static/img/hammer.png" alt="logo">
		<h2 style="text-align: center;">欢迎使用溯源信息平台App</h2>
		<view class="log-inp">
			<input type="text" v-model="username" placeholder="用户名">
			<u-icon class="icon" custom-prefix="custom-icon" color="#b2bec3" name="user" size="40"></u-icon>
			<u-icon class="icon-after" v-show="comUser" color="#b2bec3" name="close-circle-fill" size="40" @click="username = ''"></u-icon>
		</view>
		<view class="log-inp">
			<input :type="type" v-model="password" placeholder="密码">
			<u-icon class="icon" custom-prefix="custom-icon" color="#b2bec3" name="lock" size="40"></u-icon>
			<u-icon class="icon-after" color="#b2bec3" name="eye" size="40" @click="flag = !flag"></u-icon>
		</view>
		<view class="log-act" @tap="log">
			<u-icon name="arrow-rightward" color="white" size="70"></u-icon>
		</view>
		<view class="bot-mes">
			<span @tap="getPass">忘记密码</span>
			<span>|</span>
			<span @tap="toSign">用户注册</span>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapActions } from 'vuex'
	export default {
		data() {
			return {
				username: '18361812729',
				password: 'tgy1234.',
				flag: true
			};
		},
		computed: {
			comUser() {
				return this.username ? true : false
			},
			type() {
				return this.flag ? 'password' : 'text'
			}
		},
		methods: {
			...mapMutations(['initUserinfo']),
			...mapActions(['getAvatar']),
			log() {
				const usereg = /^[0-9]{11}$/;
				const passreg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W]).{8}$/;
				if (usereg.test(this.username) && passreg.test(this.password)) {
					uni.showLoading({
						title: '正在检验...',
						mask: true
					});
					uni.request({
						url: 'http://10.145.226.11:3000/log',
						data: {
							username: this.username,
							password: this.password
						},
						method: 'POST',
						dataType: 'json',
						success: (res) => {
							let title = '';
							let icon = 'none';
							if (res.data === 'success') {
								title = '登录成功';
								icon = 'success';
								uni.setStorageSync('username', this.username)
								uni.request({
									url: 'http://10.145.226.11:3000/log',
									data: { username: this.username },
									method: 'GET',
									success: (res) => {
										if (res.data !== 'fail') {
											this.initUserinfo(res.data);
											this.getAvatar();
										}
									}
								});
								uni.switchTab({
									url: '../index/index'
								})
							} else if (res.data === 'empty') {
								title = '该用户不存在';
							} else if (res.data === 'active') {
								title = '该用户已登录';
							} else if (res.data === 'fail') {
							  title = '用户名或密码错误';
							}
							uni.showToast({
								title,
								icon
							})
						}
					})
				}
			},
			toSign() {
				uni.navigateTo({
					url: '../sign/sign'
				});
			},
			getPass() {
				uni.navigateTo({
					url: '../pass/pass',
					animationType: 'slide-in-left'
				})
			}
		}
	}
</script>

<style lang="scss">
	#log {
		width: 750rpx;

		.status-bar {
			height: var(--status-bar-height);
		}

		.hammer {
			display: block;
			width: 200rpx;
			height: 200rpx;
			margin: 20px auto;
		}

		.log-inp {
			width: 600rpx;
			position: relative;
			margin: 40px auto;

			input {
				border: 1px solid #dfe6e9;
				text-align: center;
				width: 100%;
				height: 50px;
				padding: 0 35px;
				border-radius: 25px;
				box-sizing: border-box;
				caret-color: #00CAFC;
				font-size: 20px;
				letter-spacing: 2px;
				box-shadow: 2px 2px 10px 2px #dfe6e9,
					2px -2px 10px 2px #dfe6e9,
					-2px 2px 10px 2px #dfe6e9,
					-2px -2px 10px 2px #dfe6e9;

			}

			.icon {
				position: absolute;
				top: 50%;
				left: 10px;
				transform: translateY(-50%);
			}

			.icon-after {
				position: absolute;
				top: 50%;
				right: 10px;
				transform: translateY(-50%);
			}
		}

		.log-act {
			width: 70px;
			height: 70px;
			background-color: #00CAFC;
			margin: 0 auto;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.bot-mes {
			margin: 60px auto 0;
			display: flex;
			width: 600rpx;
			font-size: 12px;
			color: #b2bec3;
			justify-content: space-between;
		}
	}
</style>
