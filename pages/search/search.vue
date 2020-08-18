<template>
	<view id="search">
		<view class="sea-top">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white" @click="back"></u-icon>
				<span>搜索结果</span>
			</view>
		</view>
		<view class="sea-result">
			<p style="font-size:18px">共找到{{length}}条数据</p>
			<view class="sea-items" v-for="item in list" :key="item.id">
				<view class="sea-single" v-for="(val, key) in label">
					<p style="color:#333">{{val}}</p>
					<p style="font-size: 10px;">{{item[key]}}</p>
				</view>
				<view class="spe" @tap="showDetail(item.seq, item.company)">
					<p>详情</p>
				</view>
			</view>
		</view>
		<u-popup v-model="show" width="70%">
			<view class="sea-pop">
				<view style="height:var(--status-bar-height);margin-bottom: 20px;"></view>
				<view class="detail-content" v-for="(item, index) of lastdata" :key="index">
					<span class="lab">{{item.name}}</span>
					<span class="con">{{item.val}}</span>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const label = {
		name: '产品名称',
		seq: '产品编号',
		batch: '产品批次',
		company: '所属公司',
		date: '出厂日期'
	}
	export default {
		data() {
			return {
				label,
				show: false,
				list: [],
				basicinfo: {},
				processinfo: {},
				items: {}
			};
		},
		computed: {
			length() {
				return this.list.length
			},
			process() {
				let ret = [];
				for (let key in this.processinfo) {
					if (/^p/.test(key)) {
						ret.push({
							name: '第' + key.slice(-1) + '道工序',
							val: this.processinfo[key]
						})
					}
				}
				return ret
			},
			detail() {
				let val = [];
				for (let key in this.items[0]) {
					if (key !== 'seq' && key !== 'id' && key !== 'havedone' && key !== 'batch') {
						val.push({
							name: this.items[0][key],
							val: this.items[1][key]
						})
					}
				}
				return val
			},
			lastdata() {
				return this.process.concat(this.detail)
			}
		},
		onLoad(opt) {
			uni.showLoading({
				title: '正在加载..'
			});
			uni.request({
				url: 'http://10.145.226.11:3000/search',
				data: {
					seq: opt.seq
				},
				method: 'GET',
				success: (res) => {
					if (res.data !== 'fail') {
						this.list = res.data
						uni.hideLoading()
					}
				}
			})
		},
		methods: {
			showDetail(seq, company) {
				uni.request({
					url: 'http://10.145.226.11:3000/search/data',
					data: {
						seq,
						company
					},
					method: 'GET',
					success: (res) => {
						if (res.data !== 'fail') {
							// this.basicinfo = res.data[0];
							this.processinfo = res.data[1][0][0];
							this.items = res.data[1][1];
						}
					}
				})
				this.show = true;
			},
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
#search {
	width: 750rpx;
	.sea-top {
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
	.sea-result {
		padding: 20px;
		.sea-items {
			display: grid;
			grid-template-rows: repeat(2, 1fr);
			grid-template-columns: repeat(3, 1fr);
			border: 1px solid #CAD3C8;
			margin: 20px 0;
			padding: 10px;
			border-radius: 6px;
			gap: 5px;
			.sea-single {
				text-align: center;
			}
			.spe {
				color: #1B9CFC;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	.sea-pop {
		padding: 0 20px;
		.detail-content {
			margin-bottom: 20px;
			.lab {
				background-color: #4b4b4b;
				border-radius: 4px;
				color: white;
				padding: 0 10px;
			}
			.con {
				margin-left: 10px;
			}
		}
	}
}
</style>
