<template>
	<view class="me">
		<view class="meHead"></view>
		<view class="meHeadUser">
			<view class="meUserTop">
				<image :src="userInfo.avatar" mode=""></image>
				<view class="meUserName">
					<view><text>{{userInfo.nickname}}</text>
					<uni-icons @tap='goMessage' class="iconfont iconxiaoxi" type=""></uni-icons></view>
					<text v-if="userInfo.extension != 0">{{agentType}}级代理</text>
				</view>
			</view>
			<view class="meUserBottom">
				<view @tap="meConvert(userInfo.extension)">
					<uni-icons class="iconfont iconshengriliwu" type=""></uni-icons>
					<text>我的兑换码</text>
				</view>
				<view @tap="meIntegral">
					<uni-icons class="iconfont icondkw_jifen" type=""></uni-icons>
					<text>我的积分</text>
				</view>
			</view>
		</view>
		<view class="meList">
			<block v-for="(item,index) in meList" :key='index'>
				<view class="item" @tap="go(item.url,item.title)">
					<view class="itemL">
						<image :src="item.iconImg" mode="aspectFit"></image>
						<text>{{item.title}}</text>
					</view>
					<view class="itemR">
						<text>{{item.tel || ''}}</text>
						<uni-icons class="iconfont iconyoujiantou1" type=""></uni-icons>
					</view>
				</view>
			</block>
		</view>
		<button open-type="getUserInfo" class="getUserInfo" v-if="userInfoButtonShow" lang="zh_CN" @getuserinfo="onGetUserInfo"></button>
		
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				userInfo:{},
				userInfoButtonShow: true,
				agentType: '',
				meList:[
					{title: '已购课程',iconImg: '../static/meBuy.png',url: 'mePurchased'},
					{title: '资料订单',iconImg: '../static/meData.png',url: 'dataOrder'},
					{title: '图书订单',iconImg: '../static/meData.png',url: 'dataOrder'},
					{title: '课程订单',iconImg: '../static/meOrder.png',url: 'courseOrder'},
					{title: '我的喜欢',iconImg: '../static/meLike.png',url: 'meLike'},
					{title: '绑定手机号',iconImg: '../static/meTel.png',tel:'',url: 'bindTel'},
					{title: '加入代理',iconImg: '../static/meFollow.png',url: 'joinAgent'},
				]
			}
		},
		onLoad() {
			this.onGetUserInfo()
		},
		onShow() {
			this.getInfo()
		},
		methods: {
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
								if (data.statusCode === 200) {
									let token = data.data.token_type + ' ' + data.data.access_token;
									app.globalData.token = token;
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
			
			getInfo(){
				uni.request({
					url: `${this.$helper.requestUrl}auth/me`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data)
						if(res.status_code == 'ok'){
							this.userInfo = res.data
							app.globalData.userInfo = res.data
							if(res.data.extension != '0'){
								this.meList[6] ={
									title: '我的代理',
									url: 'agentList',
									iconImg: '../static/meFollow.png'
								}
							}else{
								this.meList[6] ={
									title: '加入代理',
									url: 'joinAgent',
									iconImg: '../static/meFollow.png'
								}
							}
							if(res.data.mobile != ''){
								this.meList[5] ={
									title: '更换手机号',
									url: 'changeTel',
									iconImg: '../static/meTel.png'
								}
							}
							this.meList[5].tel = res.data.mobile
							if(res.data.extension == 1){
								this.agentType = '一'
							}else if(res.data.extension == 2){
								this.agentType = '二'
							}else if(res.data.extension == 3){
								this.agentType = '三'
							}
						}
					}
				})
			},
			// 我的兑换码
			meConvert(e){
				uni.navigateTo({
					url: `/pages/meConvert?type=${e}`
				})
			},
			go(e,title){
				console.log(e)
				if(e == 'joinAgent'){
					this.getAngent(e)
				}else{
					if(this.agentType == '三' && title == '我的代理'){
						uni.showToast({
							title: '暂无此权限',
							icon: 'none'
						})
					}else{
						uni.navigateTo({
							url: `/pages/${e}?type=${title}`
						})
					}
					
				}
				
				
			},
			// 申请代理
			getAngent(e){
				uni.request({
					url: `${this.$helper.requestUrl}agent/applyState`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data)
						console.log(res,'++++++++')
						if(res.message == '未申请'){
							uni.navigateTo({
								url: `/pages/${e}`
							})
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
						}
						
					}
				})
			},
			goMessage(){
				uni.navigateTo({
					url:'message'
				})
			},
			// 我的积分
			meIntegral(){
				uni.navigateTo({
					url:'/pages/meIntegral'
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F2F1F6;
}
.me{
	width: 750rpx;
}
.me .meHead{
	width: 750rpx;
	height: 138rpx;
	background-color: #efcf59;
}
.me .meHeadUser{
	width: 650rpx;
	height: 184rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	margin: -130rpx auto 0;
	padding: 20rpx;
}
.me .meUserTop{
	display: flex;
}
.me .meUserTop>image{
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 20rpx;
}
.me .meUserTop .meUserName{
	width: 542rpx;
	height: 80rpx;
	display: flex;
	// align-content: space-between;
	justify-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	align-content: center;
	>view{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.iconfont{
		font-size: 40rpx;
		color: #FE9359;
	}
}
.me .meUserTop .meUserName>text{
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: #999999 !important;
	font-size: 24rpx !important;
	font-weight: 600;
	width: 500rpx;
}
.me .meUserTop .meUserName>text:first-of-type{
	font-size: 30rpx;
	color: #343434;
}
.me .meHeadUser .meUserBottom{
	display: flex;
	justify-content: space-around;
	margin-top: 30rpx;
}
.me .meHeadUser .meUserBottom .iconshengriliwu{
	color: #FF7613;
	font-size: 32rpx;
	margin-right: 16rpx;
}
.me .meHeadUser .meUserBottom .icondkw_jifen{
	color: #17B3B5;
	font-size: 32rpx;
	margin-right: 16rpx;
}
.me .meHeadUser .meUserBottom text{
	color: #343434;
	font-size: 28rpx;
}
.me .meList{
	width: 690rpx;
	padding:0 30rpx 30rpx;
	background-color: #FFFFFF;
	margin-top: 20rpx;
}
.me .meList .item{
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	padding:60rpx 0 0;
}
.me .meList .item .itemL{
	display: flex;
	align-content: center;
	align-items: center;
}
.me .meList .item .itemL>image{
	width: 32rpx;
	height: 34rpx;
	margin-right: 20rpx;
}
.me .meList .item .itemL>text{
	color: #343434;
	font-size: 30rpx;
}
.me .meList .item .iconyoujiantou1{
	color: #999999;
	font-size: 28rpx;
}
.me .meList .item .itemR text{
	color: #999999;
	font-size: 30rpx;
}
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
