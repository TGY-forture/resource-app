<script>
export default {
	onLaunch: function() {
		const username = uni.getStorageSync('username');
		// if (username) {
		// 	uni.switchTab({
		// 		url: './pages/index/index'
		// 	})
		// } else {
		// 	uni.navigateTo({
		// 		url: './pages/log/log'
		// 	})
		// }
	}
};
</script>

<style lang="scss">
@import "./static/css/iconfont.css";
@import "uview-ui/index.scss";
</style>
