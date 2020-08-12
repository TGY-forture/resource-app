<template>
	<view id="log">
		<view class="status-bar"></view>
		<img class="hammer" src="static/img/hammer.png" alt="logo">
		<h2 style="text-align: center;">欢迎使用溯源信息平台App</h2>
		<view class="log-inp">
			<input type="text" placeholder="用户名">
			<u-icon class="icon" custom-prefix="custom-icon" color="#b2bec3" name="user" size="40"></u-icon>
			<u-icon class="icon-after" color="#b2bec3" name="close-circle-fill" size="40"></u-icon>
		</view>
		<view class="log-inp">
			<input type="password" placeholder="密码">
			<u-icon class="icon" custom-prefix="custom-icon" color="#b2bec3" name="lock" size="40"></u-icon>
			<u-icon class="icon-after" color="#b2bec3" name="eye" size="40"></u-icon>
		</view>
		<view class="log-act" @tap="log">
			<u-icon name="arrow-rightward" color="white" size="70"></u-icon>
		</view>
		<view class="bot-mes">
			<span>忘记密码</span>
			<span>|</span>
			<span @tap="toSign">用户注册</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			log() {
				uni.showLoading({
					title: '正在登陆',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '登陆成功',
						icon: 'success'
					})
				}, 2000)
			},
			toSign() {
				uni.navigateTo({
					url: '../sign/sign'
				});
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
