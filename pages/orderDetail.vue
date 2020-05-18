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
			<view>
				<block v-for="(item, index) in tracesData" :key="index">
				 <!-- <trackNode class='trackNodeList' :is-first="index===tracesData.length-1" :is-newest="index===0" :is-main-node="item.isMainNode" :node-data="item"></trackNode> -->
				 <view class="total-wrap" :style="{marginTop: isMainNode?'22rpx':'6rpx'}">
				   <view class="node-container">
				     <view class="node-container-left">
				       <view class="tag-container">
				 				<view  v-if="isMainNode" class="node-tag-container">
				 				  <view class="node-tag" style='background-color: #FE9359;'></view>
				 				</view>
				         <view v-else class="node-tag-container">
				           <view class="node-tag"></view>
				         </view>
				       </view>
				       <view class="line-container" :style="{height: isMainNode?'142rpx':'88rpx', paddingTop: isMainNode?'22rpx':'8rpx'}">
				         <view v-if="!isFirst" class="line" :style="{height: isMainNode?'120rpx':'80rpx'}"></view>
				       </view>
				     </view>
				     <view class="node-container-right">
				       <!-- <div v-if="isMainNode" class="node-title" :style="{color: isNewest?'#222':'#999'}">{{nodeData.statusName}}</div> -->
				       <view class="node-desc" style="color:'#999'">{{item.remark}}</view>
				       <view class="node-time">{{item.datetime}}</view>
				     </view>
				   </view>
				 </view>
				</block>
			</view>
			
		</view>
	</view>
</template>

<script>
const app = getApp();
// import trackNode from '../componets/trackNode.vue'
export default {
	// components: {
	//   trackNode
	// },
	data() {
		return {
			info: {},
			imgUrl: '',
			dataType: '',
			usePoints: '',
			addressList: {},
			tracesData: [
				
			]
		};
	},
	onLoad(option) {
		console.log(option)
		this.imgUrl = this.$helper.imgUrl;
		let item = JSON.parse(option.obj)
		console.log(item)
		if(item.address){
			if(item.logistics != false){
				this.tracesData = item.logistics.result.list
			}
			
		}
		
		console.log(item.address)
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
.total-wrap {
  margin-top: 22rpx;
  width: 100%;
  .node-container {
    width: 100%;
    height: auto;
    display: flex;
    &-left {
      width: 44rpx;
      height: auto;
      .tag-container {
        width: 44rpx;
        height: 44rpx;
        img {
          width: 44rpx;
          height: 44rpx;
        }
        .node-tag-container {
          width: 44rpx;
          height: 44rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .node-tag {
            width: 14rpx;
            height: 14rpx;
            background-color: #dcdcdc;
            border-radius: 50%;
          }
        }
      }
      .line-container {
        box-sizing: border-box;
        width: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .line {
          width: 2rpx;
          background-color: #dcdcdc;
        }
      }
    }
    &-right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 10rpx 0 24rpx;
      .node-title {
        width: 100%;
        height: 40rpx;
        line-height: 44rpx;
        color: #222;
        font-size: 28rpx;
        font-family: 'PingFangSC-Medium';
      }
      .node-desc {
        margin-top: 16rpx;
        width: 100%;
        min-height: 30rpx;
        line-height: 30rpx;
        color: #999;
        font-size: 28rpx;
        font-family: 'PingFangSC-Regular';
        word-wrap: break-word;
        word-break: normal;
      }
      .node-time {
        margin-top: 12rpx;
        width: 100%;
        height: 34rpx;
        line-height: 34rpx;
        color: #999;
        font-size: 28rpx;
        font-family: 'Avenir-Book';
      }
    }
  }
}
.logistics>view .total-wrap:first-child{
	
	.node-container .node-container-left .tag-container .node-tag{
		 background-color: #FE9359;
	}
	.node-container .node-container-right .node-desc{
		color: #FE9359;
	}
	.node-container .node-container-right .node-time{
		color: #FE9359;
	}
}
// .trackNodeList{
// 	background-color: #FE9359;
// }
</style>
