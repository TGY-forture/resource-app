<template>
	<view id="pass">
		<view class="nav-bar">
			<view class="status-bar"></view>
			<view class="content">
				<span>找回密码</span>
				<u-icon name="Right" custom-prefix="custom-icon" size="50" color="white" @click="back"></u-icon>
			</view>
		</view>
		<view class="pass-body">
			<u-field label="用户名" :clearable="false" v-model="username"></u-field>
			<u-field label="邮箱" :clearable="false" v-model="email"></u-field>
			<u-field label="验证码" :clearable="false" v-model="code">
				<u-button :disabled="havaval" size="mini" slot="right" type="success" @click="getCode">发送验证码</u-button>
			</u-field>
			<u-button :disabled="alcode" style="margin-top: 30px;" @click="getPass">确定</u-button>
		</view>
		<u-modal v-model="show" title="密码" :content="content"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				email: '',
				code: '',
				receivecode: '',
				show: false,
				content: ''
			};
		},
		computed: {
			havaval() {
				return this.username && this.email ? false : true
			},
			alcode() {
				return this.receivecode ? false : true
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			getCode() {
				uni.showLoading();
				uni.request({
					url: 'http://10.145.226.11:3000/index',
					data: {
						username: this.username,
						email: this.email
					},
					method: 'POST',
					success: (res) => {
						if (res.data !== 'fail') {
							this.receivecode = res.data;
							uni.showToast({
								title: '发送成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: '发送失败',
								icon: 'none'
							})
						}
					}
				})
			},
			getPass() {
				if (this.code === this.receivecode) {
					uni.request({
						url: 'http://10.145.226.11:3000/index',
						data: {username: this.username},
						method: 'GET',
						success: (res) => {
							if (res.data !== 'fail') {
								this.content = res.data.password;
								this.show = true;
							}
						}
					})
				} else {
					uni.showToast({
						title: '验证码不正确',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
#pass {
	width: 750rx;
	.nav-bar {
		background: linear-gradient(to right, #74b9ff, #6ab04c);
		.status-bar {
			height: var(--status-bar-height);
		}
		.content {
			height: 40px;
			padding: 0 10px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			span {
				font-size: 16px;
				color: white;
				margin: 0 auto;
			}
		}
	}
	.pass-body {
		padding: 20px;
	}
}
</style>
