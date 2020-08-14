<template>
	<view id="search">
		<view class="sea-top">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white"></u-icon>
				<span>搜索结果</span>
			</view>
		</view>
		<view class="sea-result">
			<p style="font-size:18px">共找到20条数据：</p>
			<view class="sea-items" v-for="i in 1" :key="i">
				<view class="sea-single" v-for="(item, index) in label" :key="index">
					<p style="color:#333">{{item}}</p>
					<p style="font-size: 10px;">{{i}}</p>
				</view>
				<view class="spe" @tap="showDetail(i)">
					<p>详情</p>
				</view>
			</view>
		</view>
		<u-popup v-model="show" width="70%">
			<view class="sea-pop">
				<view style="height:var(--status-bar-height);margin-bottom: 20px;"></view>
				<view class="detail-content">
					<span class="lab">我是标签我是标签</span>
					<span class="con">我是一些内容哈哈哈我是一些内容哈哈哈</span>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const label = ['产品名称', '产品编号', '产品批次', '所属公司', '出厂日期']
	export default {
		data() {
			return {
				label,
				show: false
			};
		},
		methods: {
			showDetail(val) {
				this.show = true;
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
