<template>
	<view class="dataDetail">
		<swiper class="indexBanner" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000">
			<block v-for="(item,index) in dataInfo.banner" :key="index">
				<swiper-item class="swiper-item">
					<image :src="imgUrl+item" mode=""></image>
				</swiper-item>
			</block>
		</swiper>
		<view class="dataInfo">
			<text class="title">{{dataInfo.title}}</text>
			<text>{{dataInfo.introduce}}</text>
		</view>
		<view class="line"></view>
		<view class="specs">
			<view class="specsList" v-if="dataInfo.type != undefined">
				<text>已选</text>
				<view class="specsType">
					<view class="" v-if="dataInfo.type == 1">
						纸质版
					</view>
					<view class="" v-if="dataInfo.type == 2">
						电子版
					</view>
				</view>
			</view>
			<view class="specsList" v-if="dataInfo.type != 2">
				<text>送至</text>
				<view class="specsType">
					<text v-if="addressList != ''" @tap="addAddress(0)">{{addressList.area || ''}}{{addressList.details || ''}}</text>
					<text @tap="addAddress(1)" v-else>请选择收货地址</text>
				</view>
			</view>
		</view>
		<view class="dataDate">
			<view class="head">
				<view :class="[Inv == 0 ? 'cur' : '']" @tap="navTap(0)" v-if="urlType == 'datas'">资料详情</view>
				<view :class="[Inv == 0 ? 'cur' : '']" @tap="navTap(0)" v-if="urlType == 'books'">图书详情</view>
				<view :class="[Inv == 1 ? 'cur' : '']" @tap="navTap(1)">出版详情</view>
			</view>
			<view class="dataList" v-if="Inv == 0">
				<block v-for="(item,index) in dataInfo.details" :key="index">
					<image mode="widthFix" :src="imgUrl + item"></image>
				</block>
			</view>
			<view class="dataList" v-if="Inv == 1">
				<image mode="widthFix" :src="imgUrl + dataInfo.publish"></image>
			</view>
		</view>
		<view class="bottom" @tap="goBuy(dataInfo.id)"><button type="" class="buy">购买完整资料</button></view>
	</view>
</template>

<script>
	const app = getApp();
	import helper from '../componets/helper.js';
	export default {
		data() {
			return {
				Inv: '0',
				banner:[{
					img: '../static/logo.png',
				},
				{img: '../static/logo.png'}],
				dataInfo:{},
				urlType: '',
				url:'',
				imgUrl:'',
				addressList: {}
			}
		},
		onLoad(option) {
			this.imgUrl = helper.imgUrl;
			console.log(option)
			let headTitle = option.type
			let navH = ''
			if(headTitle == '推荐图书' || headTitle == 'books'){
				navH = '图书详情'
				this.url = 'details/book'
				this.dataT = {
					book_id: option.id
				}
				this.goPay = 'books'
			}else{
				navH = '资料详情'
				this.url = 'details/data'
				this.dataT = {
					data_id: option.id
				}
				this.goPay = 'datas'
			}
			uni.setNavigationBarTitle({
				title: navH
			})
			this.getDetail()
			this.urlType = this.goPay
			this.getAdderssL()
		},
		onShow() {
			var arr = uni.getStorageSync('address') || [];
			console.info('缓存数据：' + arr);
			// // 更新数据
			this.addressList = arr;
		},
		methods: {
			// 选项卡
			navTap(e){
				this.Inv = e
			},
			// 获取数据
			getDetail(){
				uni.showLoading({
					title: '加载中...',
				})
				uni.request({
					url: `${helper.requestUrl}${this.url}`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: this.dataT,
					success: res => {
						uni.hideLoading();
						res = helper.null2str(res.data);
						if (res.status_code == 'ok') {
							this.dataInfo = res.data
						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						}
					}
				});
			},
			goBuy(e){
				uni.navigateTo({
					url:`/pages/dataBuy?type=${this.urlType}&id=${e}`
				})
			},
			getAdderssL(){
				uni.request({
					url: `${this.$helper.requestUrl}user/getAddressList`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						res = this.$helper.null2str(res.data);
						if (res.status_code == 'ok') {
							let temp = res.data
							 for(let i=0;i<res.data.length;i++){
									 if(temp[i].is_default == 1){
										 let add = temp[i]
										 this.addressList = add
										 uni.setStorageSync('address', add);
									 }
							 }
						} else {
							this.addressList = ''
						}
					}
				});
			},
			addAddress(e){
				let url = ''
				if(e == '0'){
					url = 'addersList'
				}else if(e== '1'){
					url = 'addersList'
				}
				uni.navigateTo({
					url: `/pages/${url}`
				})
			},
			
			
		}
	}
</script>

<style lang="scss">
.dataDetail{
	width: 750rpx;
}
.indexBanner{
	width: 750rpx;
	height: 350rpx;
	// background-color: #007AFF;
}
.indexBanner image{
	width: 750rpx;
	height: 350rpx;
}
.dataInfo{
	width: 690rpx;
	padding: 30rpx;
	.title{
		color: #343434;
		font-size: 30rpx;
	}
	text{
		display: block;
		color: #999999;
	  font-size: 22rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		margin-bottom: 18rpx;
	}
}
.specs{
	width: 690rpx;
	padding: 30rpx 30rpx 0;
	.specsList{
		display: flex;
		align-items: center;
		align-content: center;
		margin-bottom: 30rpx;
		>text{
			color: #343434;
			font-size: 28rpx;
			margin-right: 30rpx;
		}
		.specsType{
			width: 590rpx;
			display: flex;
			view,text{
				color: #666666;
				font-size: 22rpx;
				margin-right: 18rpx;
				padding: 4rpx 10rpx;
			}
			view{
				border: 1rpx solid #DDDDDD;
				border-radius: 4rpx;
			}
		}
	}
}
.dataDate{
	width: 750rpx;
	padding-bottom: 100rpx;
	.head {
		width: 650rpx;
		padding: 20rpx 50rpx 20rpx;
		display: flex;
		justify-content: space-around;
		background-color: #F1F3F4;
		> view {
			color: #343434;
			font-size: 30rpx;
			height: 60rpx;
			font-weight: 600;
		}
		.cur {
			color: #FE9359;
		}
	}
}
.dataList{
	width: 750rpx;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	image{
		display: block;
		width: 100%;
		height: auto;
	}
}
.cur::after {
	content: '';
	width: 60rpx;
	height: 6rpx;
	background-color: #FE9359;
	display: block;
	margin: 10rpx auto 0;
	border-radius: 6rpx;
}
.bottom{
	width: 750rpx;
	background-color: #FFFFFF;
	height:110rpx;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	bottom: 0rpx;
	left: 0;
}
.buy{
	width: 600rpx;
	height: 62rpx;
	background-color: #FE9359;
	color: #FFFFFF;
	font-size: 24rpx;
	line-height: 62rpx;
	border: none;
	border-radius: 34rpx;
}
</style>
