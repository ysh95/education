<template>
	<view class="dataBuy">
		<view class="dataAdder" v-if="info.address">
			<view>
				<view class="dataUser">
					<text class="name">{{ info.consignee }}</text>
					<text class="tel">{{ info.mobile }}</text>
				</view>
				<view class="adders">
					<uni-icons type="" class="iconfont icondingwei"></uni-icons>
					<text>{{ info.address }}</text>
				</view>
			</view>
		</view>
		<view class="shop">
			<image :src="imgUrl + info.orderitem.theme" mode=""></image>
			<view class="left">
				<text class="title">{{ info.orderitem.title }}</text>
				<text class="type">{{ info.orderitem.introduce }}</text>
				<text class="price">￥{{ info.orderitem.price }}</text>
			</view>
		</view>
		<view v-if="info.address">
			<view class="item">配送方式: 系统物流</view>
		</view>
		<view class="item" @tap="capyOrder(info.ordernum)">订单号：{{info.ordernum}}</view>
		<view class="item" style="height: 40rpx;" v-show="info.integral != 0">
			<text>使用积分: {{ info.integral }}</text>
			<!-- <checkbox-group>
				<label><checkbox disabled="" :value="usePoints" color="#FE9359" style="transform:scale(0.7)" checked="true"/></label>
			</checkbox-group> -->
		</view>
		<view class="item">订单价格: ￥{{ info.price }}</view>

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
		};
	},
	onLoad(option) {
		console.log(option)
		this.imgUrl = this.$helper.imgUrl;
		let item = JSON.parse(option.obj)
		for (let key in item) {
			for (let key2 in item[key]) {
				item['orderitem'] = item[key]
			}
		}
		this.info = item
		if (option.type == 'courseBuy') {
			this.dataType = 'curricula';
		} else if (option.type == 'books') {
			this.dataType = 'book';
		} else if (option.type == 'datas') {
			this.dataType = 'data';
		}
	},
	methods: {
		checkboxChange(e) {
			let isType = e.detail.value;
		},
		capyOrder(e){
			uni.setClipboardData({
				data: e,
				success: function (res) {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			});
		}
	}
};
</script>

<style lang="scss">
	page{
		background: #f0f2f6;
	}
.dataBuy {
	width: 750rpx;
}
.dataAdder {
	width: 690rpx;
	padding: 30rpx;
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
	background: #fff;
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
	background: #fff;
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
</style>
