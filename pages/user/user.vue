<template>
	<view id="user">
		<view class="user-top">
			<view class="status-bar"></view>
			<view class="camera">
				<u-icon custom-prefix="custom-icon" name="icon" size="50" color="white" @click="takePhoto"></u-icon>
			</view>
			<view class="user-basic">
				<u-avatar :src="avatar" size="large" show-sex :sex-icon="gender" @click="changeAvatar">
				</u-avatar>
				<view class="text-name">
					<p>{{nickname}}</p>
					<p>{{name}}</p>
				</view>
			</view>
			<view class="user-tips" @click="changeInfo('worker')">
				<p>进行员工认证后才能管理信息噢！</p>
				<u-icon name="Right" custom-prefix="custom-icon" size="50" color="white"></u-icon>
			</view>
		</view>
		<view class="user-mid">
			<view v-for="item in infodata" :key="item.name" class="item-cell" @click="show(item)">
				<u-icon custom-prefix="custom-icon" :name="item.name" size="60" color="#5290FF"></u-icon>
				<p>{{item.text}}</p>
			</view>
			<view class="item-cell">
				<u-button type="primary" size="medium" @click="changeInfo('change')">修改</u-button>
			</view>
		</view>
		<view class="user-bot">
			<u-button type="error" size="medium" @click="logout">退出登录</u-button>
		</view>
		<u-modal v-model="sight" :title="title" :show-confirm-button="false" :mask-close-able="true">
			<p style="margin: 10px 0;text-align: center">{{text}}</p>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	const infodata = [{
			name: 'name',
			text: '姓名'
		},
		{
			name: 'yonghuming',
			text: '用户名'
		},
		{
			name: 'age',
			text: '年龄'
		},
		{
			name: 'Verifiedgender',
			text: '性别'
		},
		{
			name: 'xiugainicheng',
			text: '昵称'
		},
		{
			name: 'CompanyPages',
			text: '公司'
		},
		{
			name: 'Email',
			text: '邮箱'
		}
	]
	export default {
		data() {
			return {
				infodata,
				sight: false,
				text: '',
				title: ''
			};
		},
		computed: {
			...mapState(['avatar', 'userinfo']),
			...mapGetters(['name', 'nickname', 'gender'])
		},
		onHide() {
			this.sight = false
		},
		methods: {
			...mapMutations(['initAvatar']),
			woker() {
				console.log('dds')
			},
			show(val) {
				let key;
				switch (val.name) {
					case 'name':
						key = 'name';
						break
					case 'yonghuming':
						key = 'username';
						break
					case 'age':
						key = 'age';
						break
					case 'Verifiedgender':
						key = 'sex';
						break
					case 'xiugainicheng':
						key = 'nickname';
						break
					case 'CompanyPages':
						key = 'company';
						break
					case 'Email':
						key = 'email';
						break
					default:
						break
				}
				this.title = val.text;
				this.text = this.userinfo[key];
				this.sight = true;
			},
			logout() {
				if (this.userinfo.username) {
					uni.request({
						url: 'http://10.145.226.11:3000/log',
						method: 'PUT',
						data: {
							username: this.userinfo.username
						},
						success: (res) => {
							if (res.data === 'ok') {
								this.$store.commit('clearUserinfo');
								uni.removeStorage({
									key: 'username'
								})
								uni.navigateTo({
									url: '../log/log'
								});
								uni.showToast({
									position: 'top',
									title: '退出登录'
								})
							}
						}
					})
				}
			},
			changeInfo(val) {
				if (!this.userinfo.username) {
					uni.showToast({
						title: '未登录',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '../change/change?bool=' + val,
					animationType: 'slide-in-bottom'
				})
			},
			takePhoto() {
				const camera = plus.camera.getCamera();
				const res = camera.supportedImageResolutions[0];
				const fmt = camera.supportedImageFormats[0];
				camera.captureImage(
					(path) => {
						//转换成绝对路径才可以直接使用，上传不需要转换
						const abpath = plus.io.convertLocalFileSystemURL(path); 
						this.uploadImg(abpath);
					},
					(error) => {
						console.log("Capture image failed: " + error.message);
					}, {
						resolution: res,
						format: fmt
					}
				);
			},
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album'],
					success: (res) => {
						const path = res.tempFilePaths;
						this.uploadImg(path[0])
					}
				});
			},
			uploadImg(path) {
				if (!this.userinfo.username) {
					uni.showToast({
						title: '未登录',
						icon: 'none'
					})
					return
				}
				plus.io.getFileInfo({
					filePath: path,
					digestAlgorithm: 'md5',
					success: ({size}) => {
						if (size >= 1048576) {
							uni.showToast({
								title: '图片应小于1M',
								position: 'top'
							})
						} else {
							uni.uploadFile({
								url: 'http://10.145.226.11:3000/user',
								filePath: path,
								name: 'avatar',
								formData: {
									username: this.userinfo.username
								},
								success: (uploadFileRes) => {
									if (uploadFileRes.data === 'ok') {
										this.initAvatar(path)
										uni.showToast({
											title: '上传成功',
											icon: 'success'
										})
									}
								}
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	#user {
		width: 750rpx;

		.user-top {
			background-color: #5290FF;
			padding-bottom: 80px;
			color: white;

			.status-bar {
				height: var(--status-bar-height);
			}

			.camera {
				display: flex;
				justify-content: flex-end;
				padding: 0 20px;
			}

			.user-basic {
				margin: 0 0 20px 0;
				padding: 0 20px;
				display: flex;
				align-items: center;

				.text-name {
					margin-left: 20px;
				}
			}

			.user-tips {
				margin: 0 20px;
				padding-left: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-radius: 5px;
				background-color: #4281F0;
				height: 40px;
			}
		}

		.user-mid {
			width: 90%;
			height: 400px;
			background-color: white;
			position: relative;
			top: -50px;
			margin: 0 auto;
			padding: 10px;
			border-radius: 10px;
			box-shadow: 2px 2px 5px 2px #dfe6e9,
				2px -2px 5px 2px #dfe6e9,
				-2px 2px 5px 2px #dfe6e9,
				-2px -2px 5px 2px #dfe6e9;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(4, 1fr);

			.item-cell {
				display: flex;
				align-items: center;
				justify-content: center;

				p {
					margin-left: 10px;
				}
			}
		}

		.user-bot {
			position: relative;
			top: -30px;
			text-align: center;
		}
	}
</style>
