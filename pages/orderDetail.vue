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
		<view class="logistics"  v-if="info.address">
			<text>物流信息</text>
			<block v-for="(item, index) in tracesData" :key="index">
			  <trackNode :is-first="index===tracesData.length-1" :is-newest="index===0" :is-main-node="item.isMainNode" :node-data="item"></trackNode>
			</block>
		</view>
	</view>
</template>

<script>
const app = getApp();
import trackNode from '../componets/trackNode.vue'
export default {
	components: {
	  trackNode
	},
	data() {
		return {
			info: {},
			imgUrl: '',
			dataType: '',
			usePoints: '',
			addressList: {},
			tracesData: [
			    {
			      acceptStation: '包裹已被吴亦发同学签收', // 节点描述
			      createTime: '2019-10-24 15: 27: 16',
			      status: 'COMPLETE', // 节点状态
			      phone: '', // 电话
			      statusName: '已签收', // 节点标题
			      isMainNode: true // 是否主节点，主节点前方展示icon
			    },
			    {
			      acceptStation: '由派送员蔡小坤同志配送，电话：',
			      createTime: '2019-10-24 15: 26: 41',
			      status: 'DELIVERING',
			      phone: '16677778888',
			      statusName: '运输中',
			      isMainNode: true
			    },
			    {
			      acceptStation: '已到XXX小区快递点',
			      createTime: '2019-10-24 15: 26: 41',
			      status: 'DELIVERING',
			      phone: '',
			      statusName: '运输中',
			      isMainNode: false
			    },
			    {
			      acceptStation: '已到海宁集散中心',
			      createTime: '2019-10-24 15: 26: 18',
			      status: 'DELIVERING',
			      phone: '',
			      statusName: '运输中',
			      isMainNode: false
			    },
			    {
			      acceptStation: '已到杭州集散中心',
			      createTime: '2019-10-24 15: 26: 07',
			      status: 'DELIVERING',
			      phone: '',
			      statusName: '运输中',
			      isMainNode: false
			    },
			    {
			      acceptStation: '包裹已到达余杭区集散中心',
			      createTime: '2019-10-24 15: 25: 54',
			      status: 'DELIVERING',
			      phone: '',
			      statusName: '运输中',
			      isMainNode: false
			    },
			    {
			      acceptStation: '快递员已上门取件',
			      createTime: '2019-10-24 15: 25: 17',
			      status: 'DELIVERING',
			      phone: '',
			      statusName: '已揽收',
			      isMainNode: false
			    },
			    {
			      acceptStation: '等待快递员上门揽件',
			      createTime: '2019-10-24 15: 25: 00',
			      status: 'WATTING_DELIVER',
			      phone: '',
			      statusName: '已发货',
			      isMainNode: true
			    },
			{
			      acceptStation: '您的包裹正在打包',
			      createTime: '2019-10-24 15: 24: 00',
			      status: 'WATTING_DELIVER',
			      phone: '',
			      statusName: '待发货',
			      isMainNode: false
			    },
			    {
			      acceptStation: '订单支付成功，等待商家发货',
			      createTime: '2019-10-24 15: 22: 30',
			      status: 'PAYED',
			      statusName: '已支付',
			      isMainNode: true
			    },
			    {
			      acceptStation: '订单提交成功',
			      createTime: '2019-10-24 15: 22: 00',
			      status: 'WATTING_PAY',
			      statusName: '已下单',
			      isMainNode: true
			    }
			  ]
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
.logistics{
	width: 690rpx;
	padding: 30upx;
	background-color: #ffffff;
	margin-top: 20rpx;
	>text{
		color: #343434;
		font-size: 28rpx;
	}
}
</style>
