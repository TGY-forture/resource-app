<template>
	<view id="record">
		<view class="nav-bar">
			<view class="status-bar"></view>
			<view class="content">
				<u-icon name="Larrow" custom-prefix="custom-icon" size="50" color="white" @click="back"></u-icon>
				<span>记录</span>
				<view class="rec-menu">
					<u-icon name="plus-circle" size="50" color="white" @click="showmenu = !showmenu"></u-icon>
					<view class="list-menu" :class="showmenu ? 'showpop' : ''" v-show="showmenu">
						<view class="list-menu-item" v-for="item in menulist" :key="item.name" @click="showActionPop(item.name)">
							<u-icon :name="item.name" custom-prefix="custom-icon" color="black" size="50"></u-icon>
							<p>{{item.text}}</p>
						</view>
					</view>
				</view>
			</view>
		</view>
		<p v-if="steps.length > 0 ? false : true" class="empty">
			暂无记录
		</p>
		<view v-else class="process">
			<u-time-line>
				<u-time-line-item nodeTop="2" v-for="item in steps" :key="item.id">
					<template v-slot:node>
						<view class="u-node" style="background: #19be6b;">
							<u-icon custom-prefix="custom-icon" :name="icon(item.action)" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">{{ proinfo[item.process] }}</view>
							<view class="u-order-desc">
								员工{{ item.name }}执行操作{{item.action === "add" ? "增加工序" : "修改信息"}}</view>
							<view class="u-order-time">{{item.date}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		<u-popup v-model="visible" mode="top" border-radius="14">
			<view style="height:var(--status-bar-height);background: linear-gradient(to right, #74b9ff, #0984e3);"></view>
			<u-form :model="form" ref="uForm" class="rec-form">
				<u-form-item v-for="(item, key) in partfields" :label="item" :key="key">
					<u-input v-model="form[key]" />
				</u-form-item>
			</u-form>
			<view class="rec-btn">
				<u-button type="default" size="medium" @click="save">保存</u-button>
			</view>
		</u-popup>
		<u-select v-model="showselect" :list="list" @confirm="showDetail"></u-select>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="subInfo"></u-modal>
	</view>
</template>

<script>
	const moment = require('moment');
	import {
		mapActions,
		mapState
	} from 'vuex'
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
				visible: false,
				showselect: false,
				show: false,
				partfields: {},
				list: [],
				form: {},
				action: '',
				process: '',
				seq: '',
				content: '你确定要删除最新记录吗？'
			};
		},
		computed: {
			...mapState(['companyinfo']),
			...mapState("product", [
				"proinfo",
				"fields",
				"fieldsvalue",
				"steps",
				"havedone",
			])
		},
		created() {
			this.getProinfo();
		},
		onLoad(option) {
			this.seq = option.seq;
			if (option.exist === 'no') {
				uni.request({
					url: 'http://10.145.226.11:3000/record',
					method: 'PUT',
					data: {
						seq: option.seq,
						batch: option.batch,
						table: this.companyinfo.tablename
					},
					success: (res) => {
						let title;
						let icon = 'none'
						if (res.data === 'ok') {
							this.getFlashValue(option.seq);
							title = '操作成功';
							icon = 'success'
						} else {
							title = '操作失败'
						}
						uni.showToast({
							title,
							icon
						})
					}
				});
			} else if (option.exist === 'yes') {
				this.getFlashValue(option.seq);
				this.getHavedone(option.seq);
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				})
			}
		},
		methods: {
			...mapActions('product', ['getProinfo', 'getHavedone', 'getFlashValue', 'dataCRUD']),
			icon(action) {
				let icon;
				switch (action) {
					case "add":
						icon = "plus";
						break;
					case "change":
						icon = "edit";
						break;
					default:
						break;
				}
				return icon;
			},
			back() {
				uni.navigateBack({
					url: '../manage/manage'
				})
			},
			editInfo(name) {
				this.showmenu = false;
				this.showselect = true;
				let arr = [];
				if (name === 'plus') {
					this.action = 'add';
					let midpro = this.proinfo;
					for (let key in midpro) {
						arr.push({
							label: midpro[key],
							value: key
						})
					}
				} else if (name === 'edit') {
					this.action = 'change';
					for (let i = 1; i <= this.havedone; i++) { //根据已添加过得工序生成可修改的工序项
						arr.push({
							label: this.proinfo["process" + i],
							value: "process" + i
						});
					}
				}
				this.list = arr
			},
			deleteLog() {
				this.show = true;
				this.showmenu = false;
			},
			createQrcode() {
				this.showmenu = false;
				uni.request({
					url: 'http://10.145.226.11:3000/record/add',
					data: {
						seq: this.seq,
						name: this.companyinfo.proname,
						date: moment(new Date()).format("YYYY-MM-DD"),
						company: this.companyinfo.company
					},
					method: 'POST',
					success: (res) => {
						if (res.data === "ok" || res.data === "exist") {
							uni.navigateTo({
								url: '../saveimg/saveimg?seq=' + this.seq + '&company=' + this.companyinfo.company
							})
						}
					}
				})
			},
			subInfo() {
				uni.request({
					url: 'http://10.145.226.11:3000/record',
					method: 'DELETE',
					data: {
						company: this.companyinfo.company
					},
					success: (res) => {
						if (res.data === 'ok') {
							this.getFlashValue(this.seq);
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							})
						}
					}
				})
			},
			showActionPop(name) {
				switch (name) {
					case 'plus':
						this.editInfo(name);
						break;
					case 'edit':
						this.editInfo(name);
						break;
					case 'sub':
						this.deleteLog();
						break;
					case 'qrcode':
						this.createQrcode();
						break;
					default:
						break;
				}
			},
			showDetail(val) {
				this.visible = true;
				this.process = val[0].value;
				let data = this.fields[val[0].value] //数组
				let repobj = {} //每次重新用一个新对象代替
				for (let val of data) {
					repobj[val] = this.fieldsvalue[val];
					this.form[val] = ''
				}
				this.partfields = repobj
			},
			save() {
				let updata = this.form;
				for (let key in updata) {
					if (!updata[key].trim()) {
						uni.showToast({
							title: '信息不完整',
							icon: 'none'
						})
						return;
					}
				}
				if (this.action === 'add') { //不能重复添加同一工序
					let selectnum = parseInt(this.process.slice(7), 10)
					if (selectnum !== this.havedone + 1) {
						uni.showToast({
							title: '工序不符',
							icon: 'none'
						})
						return
					} else {
						this.form.havedone = this.havedone + 1
					}
				}
				this.form.process = this.process;
				this.dataCRUD({form: this.form, seq: this.seq, action: this.action}).then(() => {
					this.visible = false;
				})
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
			position: sticky;
			top: 0;
			z-index: 7;
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
							align-items: center;

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
