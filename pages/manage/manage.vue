<template>
	<view id="manage">
		<status-bar />
		<view class="content">
			<input type="text" v-model="seq" placeholder="请输入产品序列号">
			<u-button type="primary" size="medium" @click="sure">确定</u-button>
		</view>
		<u-popup v-model="show" mode="top" height="250px" border-radius="20">
			<view class="man-pop">
				<view class="status-bar"></view>
				<input type="text" v-model="batch" placeholder="请输入批次">
				<u-button type="default" size="medium" @click="toRecord">确认</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import StatusBar from '@/components/statusbar/statusbar.vue'
	export default {
		data() {
			return {
				show: false,
				seq: '',
				batch: ''
			};
		},
		components: {
			StatusBar
		},
		created() {
			// if (this.userinfo.company) {
			uni.request({
				url: 'http://10.145.226.11:3000/addinfo/all',
				data: {
					company: '能力有限公司' //this.userinfo.company
				},
				method: 'GET',
				success: (res) => {
					if (res.data !== 'fail') {
						this.initCompanyinfo(res.data)
					}
				}
			})
			// }
		},
		computed: {
			...mapState(['userinfo', 'companyinfo']),
			regseq() {
				return new RegExp(this.companyinfo.seq)
			},
			regbatch() {
				return new RegExp(this.companyinfo.batch)
			}
		},
		methods: {
			...mapMutations(['initCompanyinfo']),
			sure() {
				if (!this.regseq.test(this.seq)) {
					plus.nativeUI.alert("序列号不符合要求!", function() {}, "提示", "知道了")
					return;
				}
				uni.request({
					url: 'http://10.145.226.11:3000/plus',
					data: {
						seq: this.seq,
						tablename: this.companyinfo.tablename
					},
					method: 'GET',
					success: (res) => {
						if (res.data === 'empty') {
							this.show = true
						} else if (res.data === 'exist') {
							uni.navigateTo({
								url: '../record/record?exist=yes&seq=' + this.seq,
								animationType: 'slide-in-left'
							})
						}
					}
				})
			},
			toRecord() {
				if (!this.regbatch.test(this.batch)) return;
				this.show = false
				uni.navigateTo({
					url: '../record/record?exist=no&seq=' + this.seq + '&batch=' + this.batch,
					animationType: 'slide-in-left'
				})
			}
		}
	}
</script>

<style lang="scss">
	#manage {
		width: 750rpx;
		height: 100vh;

		.content {
			padding: 20px;
			position: relative;
			top: 35%;
			text-align: center;

			input {
				width: 600rpx;
				height: 40px;
				border: 1px solid #c8d6e5;
				font-size: 20px;
				border-radius: 10px;
				margin: 0 auto 30px;
			}
		}

		.man-pop {
			height: 100%;
			text-align: center;

			.status-bar {
				height: var(--status-bar-height);
				background: linear-gradient(to right, #74b9ff, #0984e3);
			}

			input {
				width: 80%;
				height: 34px;
				border: 1px solid #dfe4ea;
				border-radius: 10px;
				margin: 80px auto 20px;
				padding: 0 20px;
			}
		}
	}
</style>
