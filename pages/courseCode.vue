<template>
	<view class="dataBuy">
		<view class="shop">
			<image :src="imgUrl + info.theme" mode=""></image>
			<view class="left">
				<text class="title">{{info.title}}</text>
				<text class="type">{{info.introduce}}</text>
				<text class="price">￥{{info.price}}</text>
			</view>
		</view>
		<view class="item" @tap="gocourse(info.id)">
			<text>选择课程码</text>
			<view>
				<text style="font-size: 24rpx;color: #343434;margin-right: 10rpx;" v-if="typeId != ''">已选择</text>
				<uni-icons type="" class="iconfont iconyoujiantou1"></uni-icons>
			</view>
			
		</view>
		<button type="" class="submint" @tap="getSubmint()">确认兑换</button>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				info:{},
				imgUrl: '',
				typeId: ''
			}
		},
		onLoad(option) {
			this.imgUrl =this.$helper.imgUrl
			this.id = option.id
			this.getInfo()
		},
		onShow() {
			this.typeId = uni.getStorageSync('coupon');
		},
		onUnload() {
			uni.removeStorageSync('coupon');
		},
		methods: {
			getInfo(){
				uni.showLoading({
					title:'加载中...',
				})
				uni.request({
					url: `${this.$helper.requestUrl}pay/calculationPrice`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: {
						type: 'curricula',
						id: this.id
					},
					success: res => {
						uni.hideLoading()
						res = this.$helper.null2str(res.data);
						if (res.status_code == 'ok') {
							this.info = res.data;
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			},
			gocourse(e){
				console.log('----------------')
				uni.navigateTo({
					url: `/pages/courseConvert?id=${e}`
				})
			},
			getSubmint(){
				console.log(this.typeId)
				if(this.typeId == ''){
					uni.showToast({
						title: '请选择兑换码',
						icon: 'none'
					})
					return false
				}
				uni.request({
					url: `${this.$helper.requestUrl}details/useExchangeCode`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: {
						id: this.typeId
					},
					success: res => {
						res = this.$helper.null2str(res.data);
						console.log(res, '--------');
						if (res.status_code == 'ok') {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							setTimeout(e =>{
								uni.redirectTo({
									url: '/pages/mePurchased'
								})
							},2000)
							// this.info = res.data;
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F0F2F6;
	}
.dataBuy{
	width: 750rpx;
}
.shop{
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	align-content: center;
	background-color: #FFFFFF;
	image{
		width: 152rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 24rpx;
	}
	.left{
		width: 505rpx;
		text{
			display: block;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.title{
			color: #343434;
			font-size: 28rpx;
		}
		.type{
			color: #999999;
			font-size: 24rpx;
			margin: 6rpx 0;
		}
		.price{
			color: #FF1D00;
			font-size: 22rpx;
		}
	}
}
.item{
	margin-top: 18rpx;
	width: 690rpx;
	padding: 20rpx 30rpx;
	color: #343434;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	background-color: #FFFFFF;
	.iconfont{
		color: #999999;
	}
}
.submint{
	width: 670rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: none;
	background-color: #FE9359 !important;
	line-height: 80rpx;
	color: #FFFFFF !important;
	font-size: 28rpx;
	margin-top: 100rpx;
}
</style>
