<template>
	<view id="sign">
		<view class="nav-bar">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white"></u-icon>
				<span>注册</span>
			</view>
		</view>
		<view class="sign-info" v-if="true">
			<p>请输入电话号码</p>
			<view class="phone">
				<span>+86</span>
				<input type="text">
			</view>
			<u-button type="primary" @click="sendCapcha">下一步</u-button>
		</view>
		<view class="sign-capcha" v-if="true">
			<p>请输入验证码</p>
			<u-message-input mode="box" :focus="false" @finish="finish"></u-message-input>
			<u-button style="margin-top: 20px" type="primary" @click="setPass">下一步</u-button>
		</view>
		<u-popup 
			class="pass-pop" v-model="show" mode="center" 
			border-radius="10" :mask-close-able="false" :closeable="true"
		>
			<p>请设置你的密码</p>
			<u-field 
				label="密码" type="password" icon="lock" 
				right-icon="eye" :clearable="false"
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
				show: false
			};
		},
		methods: {
			finish(e) {
				console.log(e)
			},
			setPass() {
				this.show = true;
			},
			save() {
				
			},
			sendCapcha() {
				uni.request({
					url: 'http://10.145.226.11:3000/index',
					method: 'GET',
					success(res) {
						console.log(res.data)
					}
				})
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
