<template>
	<view class="dataBuy">
		<view class="dataAdder" v-if="info.type == 1">
			<view v-if="addressList != ''" @tap="goAdderss">
				<view class="dataUser">
					<text class="name">{{ addressList.name }}</text>
					<text class="tel">{{ addressList.mobile }}</text>
					<text class="default" v-if="addressList.is_default == 1">默认</text>
				</view>
				<view class="adders">
					<uni-icons type="" class="iconfont icondingwei"></uni-icons>
					<text>{{ addressList.area }}{{ addressList.details }}</text>
				</view>
			</view>
			<view @tap="addAddress" v-else>添加收货地址</view>
		</view>
		<view class="shop">
			<image :src="imgUrl + info.theme" mode=""></image>
			<view class="left">
				<text class="title">{{ info.title }}</text>
				<text class="type">{{ info.introduce }}</text>
				<text class="price">￥{{ info.price }}</text>
			</view>
		</view>
		<view v-if="info.type == 1">
			<view class="item">配送方式: 系统物流</view>
		</view>
		<view class="item" style="height: 40rpx;" v-show="info.use_integral == 1">
			<text>可抵扣积分: {{ info.integral }}</text>
			<checkbox-group @change="checkboxChange">
				<label><checkbox :value="usePoints" color="#FE9359" style="transform:scale(0.7)" /></label>
			</checkbox-group>
		</view>
		<view class="item" v-if="usePoints == 1">订单价格: ￥{{ info.price }}</view>
		<view class="item" v-if="usePoints == 0">订单价格: ￥{{ info.discount }}</view>
		<!-- </view> -->
		<text class="tip" v-if="info.type == 2 && dataType == 'data'">备注：支付成功后联系客服，通过订单号获取电子版课程链接</text>
		<button type="default" class="submint" @tap="submintOrder">提交订单</button>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			info: {},
			imgUrl: '',
			dataType: '',
			usePoints: '',
			addressList: {},
			is_use: '2'
		};
	},
	onShow() {
		var arr = uni.getStorageSync('address') || [];
		// // 更新数据
		this.addressList = arr;
	},
	onLoad(option) {
		this.imgUrl = this.$helper.imgUrl;
		this.shopId = option.id;
		if (option.type == 'courseBuy') {
			this.dataType = 'curricula';
			this.title = '课程购买';
		} else if (option.type == 'books') {
			this.dataType = 'book';
			this.title = '图书购买';
		} else if (option.type == 'datas') {
			this.dataType = 'data';
			this.title = '资料购买';
		}
		this.type = option.type;
		uni.setNavigationBarTitle({
			title: this.title
		});
		this.getShop();
		this.submintOrder= this.$helper.debounce(this.submintPay, 1500)
	},
	methods: {
		getShop() {
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}pay/calculationPrice`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: this.dataType,
					id: this.shopId
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.info = res.data;
						this.usePoints = res.data.use_integral;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		},
		checkboxChange(e) {
			let isType = e.detail.value;
			console.log(isType);
			if (isType == 1) {
				this.usePoints = 0;
				this.is_use = 1;
			} else {
				this.usePoints = 1;
				this.is_use = 2;
			}
		},
		goAdderss() {
			uni.navigateTo({
				url: '/pages/addersList'
			});
		},
		addAddress() {
			uni.navigateTo({
				url: '/pages/addersList'
			});
		},
		submintPay() {
			let address_id = '';
			if (this.info.type == 1) {
				address_id = this.addressList.id;
			}else{
				address_id = ''
			}
			uni.request({
				url: `${this.$helper.requestUrl}pay/placeOrder`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: this.dataType,
					id: this.shopId,
					is_use: this.is_use,
					address_id: address_id
					// discover_id: this.findId
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '下单信息');
					uni.hideToast()
					if (res.status_code == 'ok') {
						this.goBuy(res.data)

					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		goBuy(orderId){
			uni.request({
				url: `${this.$helper.requestUrl}pay/pay`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: this.dataType,
					ordernum: orderId,
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '-------------------');
					uni.hideToast()
					if (res.status_code == 'ok') {
						this.getPay(res.data);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		getPay(payNode) {
			uni.showLoading({
				title: '支付加载中...',
			})
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payNode.timeStamp,
				nonceStr: payNode.nonceStr,
				package: payNode.package,
				signType: payNode.signType,
				paySign: payNode.paySign,
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res)
					console.log(res)
					// console.log('success:' + JSON.stringify(res));
					uni.showToast({
						title: "支付成功",
						icon: 'success',
						duration: 2000
					});
					// 两秒后返回上一页
					setTimeout(e => {
						if (this.title == '课程购买') {
							uni.redirectTo({
								url:'/pages/courseOrder'
							})
						} else if (this.title == '图书购买') {
							uni.redirectTo({
								url:`/pages/dataOrder?type=图书订单`
							})
						} else if (this.title == '资料购买') {
							uni.redirectTo({
								url:`/pages/dataOrder?type=资料订单`
							})
						}
					}, 2000)
				},
				fail: err => {
					uni.showToast({
						title: "支付失败",
						icon: 'none',
						duration: 2000
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
	page{
		background-color: #f0f2f6;
	}
.dataBuy {
	width: 750rpx;
}
.dataAdder {
	width: 690rpx;
	padding: 30rpx 30rpx 0;
	background-color: #FFFFFF;
	.dataUser {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		text {
			display: block;
			font-size: 26rpx;
			color: #343434;
		}
		.tel {
			margin: 0 16rpx;
		}
		.default {
			background-color: #fe7c1e;
			color: #ffffff;
			font-size: 20rpx;
			padding: 1rpx 10rpx;
			border-radius: 4rpx;
		}
	}
	.adders {
		display: flex;
		align-items: center;
		text {
			font-size: 26rpx;
			color: #343434;
			display: block;
			width: 630rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.icondingwei {
			font-size: 36rpx;
			color: #343434;
			margin-right: 8rpx;
		}
	}
}
.shop {
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	align-content: center;
	background-color: #FFFFFF;
	image {
		width: 152rpx;
		height: 106rpx;
		border-radius: 8rpx;
		margin-right: 24rpx;
	}
	.left {
		width: 505rpx;
		text {
			display: block;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.title {
			color: #343434;
			font-size: 28rpx;
		}
		.type {
			color: #999999;
			font-size: 24rpx;
			margin: 6rpx 0;
		}
		.price {
			color: #ff1d00;
			font-size: 22rpx;
		}
	}
}
.item {
	width: 690rpx;
	padding: 20rpx 30rpx;
	color: #343434;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	background-color: #FFFFFF;
	margin-top: 20rpx;
}
.submint {
	width: 670rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: none;
	background-color: #fe9359 !important;
	line-height: 80rpx;
	color: #ffffff !important;
	font-size: 28rpx;
	margin-top: 100rpx;
}
checkbox .wx-checkbox-input {
	border-radius: 50% !important;
	color: #ffffff !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	color: #fff;
	background: #fe7c1e;
}

.wx-checkbox-input.wx-checkbox-input-checked {
	border: none !important;
}
.tip{
	color: #999;
	font-size: 24rpx;
	// width: 100%;
	text-align: center;
	display: block;
	margin: 20rpx auto;
}
</style>
