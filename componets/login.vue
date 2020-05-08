<template>
	<!-- <view class="login"> -->
		<button open-type="getUserInfo" class="getUserInfo" v-if="userInfoButtonShow" lang="zh_CN" @getuserinfo="onGetUserInfo"></button>
	<!-- </view> -->
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				userInfoButtonShow: true
			};
		},
		onShow() {
			this.onGetUserInfo()
		},
		methods:{
			// 用户信息获取
			onGetUserInfo() {
				// 查看是否授权
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.userInfo']) {
							this.userInfoButtonShow = false;
							console.log(res, '-----------');
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							uni.getUserInfo({
								success: res => {
									console.log(res);
									this.userInfo = Object.assign(this.userInfo, res.userInfo);
									app.globalData.userInfo = this.userInfo;
									// 登录
									this.setUserInfo();
								}
							});
						} else {
							this.setUserInfo();
						}
					}
				});
			},
			// 提交用户信息
			setUserInfo() {
				let that = this
				uni.login({
					success: res => {
						uni.request({
							url: `${this.$helper.requestUrl}auth/login`,
							method: 'POST',
							header: {
								// 'content-type':'application/json',
							},
							data: {
								code: res.code,
								nickname: that.userInfo.nickName,
								sex: that.userInfo.gender,
								headimgurl: that.userInfo.avatarUrl,
								mobile: ''
							},
							success: data => {
								res = this.$helper.null2str(res);
								uni.hideToast();
								console.log(data)
								if (data.statusCode === 200) {
									let token = data.data.token_type + ' ' + data.data.access_token;
									app.globalData.token = token;
									that.getIndexInfo();
								} else {
									uni.showModal({
										title: '',
										content: data.data.errmsg
									});
								}
							}
						});
					}
				});
			},
			getIndexInfo() {
				// 用户信息获取
				uni.request({
					url: `${this.$helper.requestUrl}auth/me`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res)
						console.log(res,'++++++++')
						if(res.data.status_code == 'ok'){
							this.userInfo = res.data.data
							app.globalData.userInfo = res.data.data
						}
					}
				})
			},
		}
	}
</script>

<style>
.getUserInfo {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 999;
	background: transparent;
/* 	// transparent
	// background-color: rgba($color: #000000, $alpha: 0); */
	border: none !important;
}
button::after {
	border: none !important;
}
</style>
