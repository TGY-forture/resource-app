<template>
	<view id="record">
		<view class="nav-bar">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white"></u-icon>
				<span>记录</span>
				<view class="rec-menu">
					<u-icon name="plus-circle" size="50" color="white" @click="action"></u-icon>
					<view class="list-menu" :class="showmenu ? 'showpop' : ''" v-show="showmenu">
						<view class="list-menu-item" v-for="item in menulist" :key="item.name" @click="showActionPop">
							<u-icon :name="item.name" custom-prefix="custom-icon" color="black" size="50"></u-icon>
							<p>{{item.text}}</p>
						</view>
					</view>
				</view>
			</view>
		</view>
		<p v-if="false" class="empty">
			暂无记录
		</p>
		<view v-else class="process">
			<u-time-line>
				<u-time-line-item nodeTop="2">
					<template v-slot:node>
						<view class="u-node" style="background: #19be6b;">
							<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">待取件</view>
							<view class="u-order-desc">[自提柜]您的快件已放在楼下侧门，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
							<view class="u-order-time">2019-05-08 12:12</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		<u-popup v-model="visible" mode="top" border-radius="14">
			<view style="height:var(--status-bar-height);background: linear-gradient(to right, #74b9ff, #0984e3);"></view>
			<u-form :model="form" ref="uForm" class="rec-form">
				<u-form-item label="姓名">
					<u-input v-model="form.name" />
				</u-form-item>
				<u-form-item label="简介">
					<u-input v-model="form.intro" />
				</u-form-item>
			</u-form>
			<view class="rec-btn">
				<u-button type="default" size="medium">保存</u-button>
			</view>
		</u-popup>
		<u-select v-model="showselect" :list="list" @confirm="showDetail"></u-select>
	</view>
</template>

<script>
	const menulist = [{
			name: 'plus',
			text: '增加记录'
		},
		{
			name: 'sub',
			text: '删除记录'
		},
		{
			name: 'edit',
			text: '编辑信息'
		},
		{
			name: 'qrcode',
			text: '生成二维码'
		}
	]
	export default {
		data() {
			return {
				menulist,
				showmenu: false,
				visible: true,
				showselect: false,
				list: [{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
				form: {
					name: '',
					intro: '',
					sex: ''
				}
			};
		},
		methods: {
			action() {
				this.showmenu = !this.showmenu;
			},
			showActionPop() {
				this.showmenu = false;
				this.showselect = true;
			},
			showDetail(val) {
				this.visible = true;
			}
		}
	}
</script>

<style lang="scss">
	@keyframes fadepop {
		from {
			opacity: 0;
			transform: translateY(-100px) translateX(50px) scale(0);
		}

		to {
			opacity: 1;
		}
	}

	#record {
		width: 750rpx;
		height: 100vh;

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

				.rec-menu {
					position: relative;
					z-index: 5;

					.list-menu {
						width: 140px;
						position: absolute;
						right: -5px;
						top: 36px;
						background-color: #f1f2f6;
						border-radius: 4px;
						padding: 16px 10px;

						&::before {
							content: '';
							width: 20px;
							height: 20px;
							border-radius: 4px;
							background-color: #f1f2f6;
							position: absolute;
							top: -6px;
							right: 8px;
							transform: rotateZ(45deg);
						}

						.list-menu-item {
							display: flex;
							margin: 15px 0;

							p {
								margin-left: 16px;
							}
						}
					}

					.showpop {
						animation: fadepop .3s linear;
					}
				}
			}
		}

		.process {
			padding: 20px;

			.u-node {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.u-order-title {
				color: #333333;
				font-weight: bold;
				font-size: 32rpx;
			}

			.u-order-desc {
				color: rgb(150, 150, 150);
				font-size: 28rpx;
				margin-bottom: 6rpx;
			}

			.u-order-time {
				color: rgb(200, 200, 200);
				font-size: 26rpx;
			}
		}

		.empty {
			font-size: 20px;
			text-align: center;
			color: #333333;
			position: relative;
			top: 40%;
		}
		.rec-form {
			padding: 20px;
		}
		.rec-btn {
			text-align: center;
			margin-bottom: 10px;
		}
	}
</style>
