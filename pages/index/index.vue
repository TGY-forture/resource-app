<template>
	<view id="index">
		<status-bar />
		<view class="index-mid">
			<u-swiper :list="list" border-radius="10" duration="1000" :interval="4000" img-mode="aspectFit"></u-swiper>
			<p class="index-mes">
				欢迎使用溯源信息平台软件，如果你是员工，你可以在这里管理公司产品信息，如果你是用户，你可以查询购买的产品信息。
			</p>
			<p class="getstart" @click="start">Get Start</p>
		</view>
		<view class="index-bot">
			<p>Copyright</p>
			<u-icon name="copyright" custom-prefix="custom-icon" size="30"></u-icon>
			<p>2020 TGY</p>
		</view>
	</view>
</template>

<script>
	import StatusBar from '@/components/statusbar/statusbar.vue'
	const list = [
		{
			image: '../../static/img/wa.png'
		},
		{
			image: '../../static/img/ka.png'
		},
		{
			image: '../../static/img/chan.png'
		}
	]
	export default {
		data() {
			return {
				list
			}
		},
		beforeCreate() {
			uni.request({
				url: 'http://10.145.226.11:3000/log',
				data: { username: '18361812729' },
				method: 'GET',
				success: (res) => {
					if (res.data !== 'fail') {
						this.$store.commit('initUserinfo', res.data);
						this.$store.dispatch('getAvatar');
					}
				}
			});
		},
		components: {
			StatusBar
		},
		methods: {
			start() {
				uni.navigateTo({
					url: '../log/log'
				})
			}
		}
	}
</script>

<style lang="scss">
#index {
	width: 750rpx;
	.index-mid {
		padding: 15px;
		.index-mes {
			margin: 20px 0;
			padding: 15px;
			font-size: 18px;
			border-radius: 6px;
			border: 1px solid #bdc3c7;
		}
		.getstart {
			width: 200px;
			height: 50px;
			text-align: center;
			line-height: 50px;
			margin: 60px auto 0;
			background-color: #2980b9;
			font-size: 26px;
			font-weight: bold;
			border-radius: 10px;
			color: white;
		}
	}
	.index-bot {
		display: flex;
		justify-content: center;
		margin-top: 150px;
		p {
			margin: 0 10px;
			color: #c8d6e5;
		}
	}
}
</style>
