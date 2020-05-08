<template>
	<view>
		<view class="addressList">
			<block v-for="(item, index) in addressList" :key="index">
				<view class="item" @tap="getSel(item)">
					<view class="left">
						<view class="top">
							<text>{{ item.name }}</text>
							<text>{{ item.mobile }}</text>
							<text class="tip" v-if="item.is_default == 1">默认</text>
						</view>
						<view class="bottom">
							<uni-icons type="" class="iconfont icondingwei"></uni-icons>
							<view>{{ item.area }}{{ item.details }}</view>
						</view>
					</view>
					<text class="right" @tap.stop="revise(item)">编辑</text>
				</view>
			</block>
			
		</view>
		<view class="add-address" @tap="addAddress">新增地址</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			addressList: []
		};
	},
	onLoad() {
		
	},
	onShow() {
		this.getList()
		// var arr = uni.getStorageSync('addressList') || [];
		// console.info('缓存数据：' + arr);
		// // 更新数据
		// this.addressList = arr;
	},
	methods: {
		addAddress() {
			uni.navigateTo({
				url: `/pages/addersNew?type=1`
			});
		},
		getSel(e){
			uni.setStorageSync('address', e);
			uni.navigateBack({
				delta: 1
			})
		},
		revise(e){
			console.log(e)
			uni.navigateTo({
				url: `/pages/addersNew?type=2&obj=${JSON.stringify(e)}`
			});
		},
		getList(){
			uni.showLoading({
				title: "加载中...",
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/getAddressList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					uni.hideLoading();
					res = this.$helper.null2str(res.data)
					console.log(res,'++++++++')
					if(res.status_code == 'ok'){
						this.addressList = res.data
					}
				}
			})
		}
		//   /* 删除item */
		//   delAddress (e) {
		//     this.data.addressList.splice(e.target.id.substring(3), 1);
		//     // 更新data数据对象
		//     if (this.data.addressList.length > 0) {
		//       this.addressList = this.data.addressList
		//       wx.setStorageSync('addressList', this.data.addressList);
		//     } else {
		//       this.setData({
		//         addressList: this.data.addressList
		//       })
		//       wx.setStorageSync('addressList', []);
		//     }
		//   }
	}
};
</script>

<style lang="scss">
.addressList {
	width: 690rpx;
	padding: 30rpx 30rpx 80rpx;
}
.item {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	.right {
		display: block;
		color: #343434;
		font-size: 28rpx;
		border-left: 1rpx solid #cccccc;
		width: 100rpx;
		text-align: center;
	}
	.left {
		.top {
			display: flex;
			text {
				color: #343434;
				font-size: 26rpx;
				margin-right: 10rpx;
			}
			.tip {
				color: #ffffff;
				font-size: 22rpx;
				display: block;
				background-color: #fe9359;
				padding: 1rpx 10rpx;
			}
		}
		.bottom {
			display: flex;
			align-items: center;
			margin-top: 8rpx;
			view {
				color: #343434;
				font-size: 26rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				width: 500rpx;
				font-weight: 600;
			}
			.iconfont {
				color: #343434;
			}
		}
	}
}

.add-address {
	width: 600rpx;
	height: 70rpx;
	// border: 1rpx #000 solid;
	background-color: #fe9359;
	line-height: 70rpx;
	text-align: center;
	color: #fff;
	font-size: 28rpx;
	border-radius: 40rpx;
	margin: 50rpx auto 0;
}
</style>
