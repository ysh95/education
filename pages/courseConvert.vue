<template>
	<view class="courseConvert">
		<view class="item" @tap="go(list.id)" v-if="list != ''">
			<view class="right">
				<uni-icons class="iconfont iconshengriliwu" type=""></uni-icons>
				<text>课程兑换码</text>
			</view>
			<view class="left">
				<view class="leftT">
					<text>{{ list.title }}</text>
				</view>
				<view class="leftB">
					<text>课程兑换码剩余{{ list.num }}次</text>
					<text class="goUse">去使用</text>
				</view>
			</view>
		</view>
		<view class="null" v-if="list == ''">暂无可使用兑换课程</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			list: {}
		};
	},
	onLoad(e) {
		console.log(e);
		this.id = e.id;
		this.getList();
	},
	methods: {
		getList() {
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}details/getExchangeCode`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					curricula_id: this.id
				},
				success: res => {
					uni.hideLoading();
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.list = res.data;
					} else {
						this.list = [];
					}
				}
			});
		},
		go(e) {
			uni.setStorageSync('coupon', e);
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f2f1f6;
}
.courseConvert {
	width: 690rpx;
	padding: 30rpx;
	.item {
		width: 690rpx;
		height: 170rpx;
		margin-bottom: 30rpx;
		display: flex;
		.right {
			width: 240rpx;
			height: 170rpx;
			background-color: #fecf59;
			border-radius: 20rpx 0 0 20rpx;
			/* 相对定位，方便让before和after伪元素绝对定位偏移 */
			position: relative;
			/* 把超出div的部分隐藏起来 */
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-content: center;
			align-items: center;
			flex-wrap: wrap;
			.iconfont {
				color: #ffffff;
				font-size: 62rpx;
				margin-bottom: 10rpx;
			}
			text {
				color: #ffffff;
				font-size: 22rpx;
				text-align: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: block;
				width: 100%;
			}
		}
		.left {
			width: 401rpx;
			background-color: #ffffff;
			padding: 0 24rpx;
			height: 170rpx;
			border-radius: 0 20rpx 20rpx 0;
			.leftT {
				width: 100%;
				position: relative;
				padding: 10rpx 0 26rpx;
				text {
					color: #343434;
					font-size: 30rpx;
					margin: 20rpx 0;
					display: block;
				}
			}
			.leftB {
				height: 54rpx;
				border-top: 1rpx dashed #dddddd;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text {
					color: #999999;
					font-size: 22rpx;
				}
				.goUse {
					color: #fe9359;
				}
			}
		}
	}
}

.right:after {
	content: ' ';
	width: 0;
	height: 100%;
	/* 绝对定位进行偏移 */
	position: absolute;
	top: 14rpx;
	border-right: 14rpx dotted white;
	/* 偏移一个半径，让圆点的一半覆盖div */
	right: -7rpx;
}
.null {
	text-align: center;
	color: #545454;
	font-size: 28rpx;
	display: flex;
	justify-content: center;
	width: 100%;
}
</style>
