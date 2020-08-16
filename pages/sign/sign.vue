<template>
	<view id="sign">
		<view class="nav-bar">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white" @click="back"></u-icon>
				<span>注册</span>
			</view>
		</view>
		<view class="sign-info" v-if="visible">
			<p>请输入电话号码</p>
			<view class="phone">
				<span>+86</span>
				<input type="text" v-model="phone">
			</view>
			<u-button type="primary" @click="sendCapcha">下一步</u-button>
		</view>
		<view class="sign-capcha" v-else>
			<p>请输入验证码</p>
			<u-message-input mode="box" :focus="true" @finish="finish"></u-message-input>
		</view>
		<u-popup 
			class="pass-pop" v-model="show" mode="center" 
			border-radius="10" :mask-close-able="false" :closeable="true"
		>
			<p>请设置你的密码</p>
			<u-field 
				label="密码" :type="type" icon="lock" v-model="password" placeholder="八位数字英文及字符"
				right-icon="eye" :clearable="false" @right-icon-click="flag = !flag"
			>	
			</u-field>
			<u-button class="pass-save" type="default" size="medium" @click="save">保存</u-button>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				password: '',
				capcha: '',
				show: false,
				visible: true,
				flag: false
			};
		},
		computed: {
			type() {
				return this.flag ? 'text' : 'password'
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					url: '../log/log'
				})
			},
			finish(val) {
				if (val === this.capcha) {
					this.show = true
				}
			},
			save() {
				const passreg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W]).{8}$/;
				if (passreg.test(this.password)) {
					uni.request({
						url: 'http://10.145.226.11:3000/sign',
						method: 'POST',
						data: { phone: this.phone, password: this.password },
						success: (res) => {
							let icon = 'none';
							let title = '';
							if (res.data === 'ok') {
								icon = 'success';
								title = '注册成功';
								this.show = false;
								uni.navigateBack({
									url: '../log/log'
								})
							} else {
								title = '注册失败'
							}
							uni.showToast({
								icon,
								title
							})
						}
					})
				} else {
					uni.showToast({
						title: '密码不符合要求',
						position: 'top'
					})
				}
			},
			sendCapcha() {
				const usereg = /^[0-9]{11}$/;
				if (usereg.test(this.phone)) {
					uni.showLoading({
						title: '校验中...'
					});
					uni.request({
						url: 'http://10.145.226.11:3000/sign',
						method: 'GET',
						data: { phone: this.phone },
						success: (res) => {
							let icon = 'none';
							let title = '';
							if (res.data === 'fail') {
								title = '验证码发送失败';
							} else if (res.data === 'same') {
								title = '用户名已存在';
							} else {
								title = '验证码发送成功';
								icon = 'success';
								this.visible = false;
								this.capcha = res.data.toString();
							}
							uni.showToast({
								icon,
								title
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
#sign {
	width: 750rpx;
	.nav-bar {
		width: 750rpx;
		background: linear-gradient(to right, #74b9ff, #0984e3);
		.status-bar {
			height: var(--status-bar-height);
		}
		.content {
			height: 40px;
			padding: 0 10px;
			display: flex;
			align-items: center;
			span {
				font-size: 16px;
				color: white;
				margin: 0 auto;
			}
		}
	}
	.sign-info {
		width: 100%;
		padding: 0 20px;
		p {
			font-size: 20px;
			margin: 10px 0;
		}
		.phone {
			display: flex;
			margin-bottom: 20px;
			align-items: center;
			padding-bottom: 10px;
			border-bottom: 2px solid #c8d6e5;
			span {
				font-size: 18px;
				margin-right: 10px;
				color: gray;
			}
			input {
				// height: 35px;
				color: black;
				font-size: 18px;
				caret-color: #0abde3;
				letter-spacing: 5px;
			}
		}
	}
	.sign-capcha {
		width: 100%;
		padding: 0 20px;
		p {
			font-size: 20px;
			margin: 10px 0;
		}
	}
	.pass-pop {
		p {
			font-size: 18px;
			text-align: center;
			margin: 10px 0;
		}
		.pass-save {
			margin-top: 20px;
			margin-bottom: 20px;
			margin-left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
