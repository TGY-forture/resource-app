<template>
	<view id="user">
		<view class="user-top">
			<view class="status-bar"></view>
			<view class="camera">
				<u-icon custom-prefix="custom-icon" name="icon" size="50" color="white"></u-icon>
			</view>
			<!-- http://10.145.226.11:3000/img/avatar.jpeg -->
			<view class="user-basic">
				<u-avatar 
					src=""
					size="large" show-sex sex-icon="man"
				>
				</u-avatar>
				<view class="text-name">
					<p>环境大幅度发四大皆空</p>
					<p>胡富国</p>
				</view>
			</view>
			<view class="user-tips">
				<p>进行员工认证后才能管理信息噢！</p>
				<u-icon name="Right" custom-prefix="custom-icon" size="50" color="white"></u-icon>
			</view>
		</view>
		<view class="user-mid">
			<view v-for="item in infodata" :key="item.name" class="item-cell" @click="show(item.name)">
				<u-icon custom-prefix="custom-icon" :name="item.name" size="60" color="#5290FF"></u-icon>
				<p>{{item.text}}</p>
			</view>
			<view class="item-cell">
				<u-button type="primary" size="medium">修改</u-button>
			</view>
		</view>
		<view class="user-bot">
			<u-button type="error" size="medium">退出登录</u-button>
		</view>
	</view>
</template>

<script>
	const infodata = [
		{
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
				infodata
			};
		},
		methods: {
			show(val) {
				console.log(val)
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
			padding:0 20px;
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
