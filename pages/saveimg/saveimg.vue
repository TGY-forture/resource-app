<template>
	<view id="saveimg" v-if="load">
		<view class="status-bar"></view>
		<img :src="src" alt="qrcode">
		<view class="btn-group">
			<u-button class="btn" size="medium" type="primary" @click="saveImg">保存</u-button>
			<u-button class="btn" size="medium" @click="back">返回</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				load: false
			};
		},
		onLoad(value) {
			uni.showLoading({
				title: '正在生成...'
			})
			uni.request({
				url: 'http://10.145.226.11:3000/record/qrcode',
				data: {
					seq: value.seq,
					company: value.company
				},
				method: 'POST',
				success: (res) => {
					if (res.data !== 'fail') {
						this.src = res.data;
						this.load = true;
						uni.hideLoading();
					} else {
						uni.showToast({
							title: '生成失败',
							icon: 'none'
						})
					}
				}
			})
		},
		methods: {
			saveImg() {
				uni.downloadFile({
					url: 'http://10.145.226.11:3000/img/qrcode.png',
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '已保存到相册',
									icon: 'success'
								})
							}
						})
					}
				})
			},
			back() {
				uni.navigateBack({
					url: '../record/record'
				})
			}
		}
	}
</script>

<style lang="scss">
	#saveimg {
		width: 750rpx;
		.status-bar {
			height: var(--status-bar-height);
			background: linear-gradient(to right, #7bed9f, #2ed573);
		}
		img {
			display: block;
			margin: 20px auto;
		}
		.btn-group {
			display: flex;
			justify-content: space-around;
		}
		
	}
</style>
