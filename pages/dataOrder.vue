<template>
	<view class="courseOrder">
		<view class="head">
			<block v-for="(item, index) in nav" :key="index">
				<view :class="[Inv == index ? 'cur' : '']" @tap="navTap(index, item.id)">{{ item.navName }}</view>
			</block>
		</view>
		<view class="line" style="height: 92rpx;"></view>
		<view class="content">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
				<block v-for="(item, index) in list" :key="index">
					<view class="line"></view>
					<view class="item" @tap="goDetail(item)">
						<view class="top">
							<text>{{ item.created_at }}</text>
							<view class="topR">
								<text v-if="item.state == '1'">待付款</text>
								<text v-if="item.state == '2'">待发货</text>
								<text v-if="item.state == '3'">待收货</text>
								<text v-if="item.state == '4'">完成/评价</text>
								<view v-if="item.state == 4"  @tap.stop="del(item.ordernum)">
									<text class="topLine"></text>
									<image src="../static/clear.png" mode=""></image>
								</view>
							</view>
						</view>
						<view class="center">
							<image :src="imgUrl+item.data.theme" mode=""></image>
							<view class="right">
								<view class="rightT">
									<text>{{ item.data.title }}</text>
									<view class="price">
										<text>￥</text>
										{{ item.data.price }}
									</view>
								</view>
								<view class="rightB">
									<text>{{ item.data.introduce }}</text>
									<!-- <text>×{{ item.num }}</text> -->
								</view>
							</view>
						</view>
						<view class="bottom">
							<view class="bottomItem">
								<!-- <text>共{{ item.num }}件</text> -->
								<text>付款金额： ￥{{ item.price }}</text>
							</view>
							<view class="bottomItem">
								<text v-if="item.state == 1" class="button" type="" @tap.stop="del(item.ordernum)">取消订单</text>
								<text v-if="item.state == 1" class="button cur" type="" @tap.stop="promptlyPay(item.ordernum)">立即付款</text>
								<text v-if="item.state == 2" class="button" type="" @tap.stop="remind(item.ordernum)">提醒发货</text>
								<view v-if="item.state == 4">
									<text v-if="orderType== 'data'" class="button" type="" @tap.stop="againBuy(item.data_id)">再次购买</text>
									<text v-if="orderType== 'book'" class="button" type="" @tap.stop="againBuy(item.book_id)">再次购买</text>
								</view>
								<text v-if="item.state == 4 && item.evaluate == 0" class="button" type="" @tap.stop="prompEvaluate(item)">立即评价</text>
								<text v-if="item.state == 3" class="button cur" type="" @tap.stop="orderConfirm(item.ordernum)">确认收货</text>
							</view>
						</view>
					</view>
				</block>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			Inv: 0,
			imgUrl: '',
			navId: '-1',
			nav: [{ navName: '全部', id: '-1' }, { navName: '待付款', id: '1' }, { navName: '待发货', id: '2' }, { navName: '待收货', id: '3' }, { navName: '评价', id: '4' }],
			list: [],
			downOption: {
				auto: true //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 20 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多数据了'
			},
			orderType: ''
		};
	},
	onLoad(e) {
		this.imgUrl = this.$helper.imgUrl
		console.log(e);
		if(e.type == '图书订单'){
			this.orderType = 'book'
		}else{
			this.orderType = 'data'
		}
		uni.setNavigationBarTitle({
			title: e.type
		});
	},
	methods: {
		// 选项卡点击事件
		navTap(e, id) {
			this.Inv = e;
			this.navId = id;
			this.list = []
			this.mescroll.resetUpScroll();
		},
		prompEvaluate(e){
			uni.navigateTo({
				url:`/pages/orderAssess?obj=${JSON.stringify(e)}&type=${this.orderType}`
			})
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			this.getList(page)
		},
		getList(page){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/myOrderList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					type: this.orderType,
					state: this.navId,
					page_size: page.size,
					page: page.num
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						if(res.message == '暂无信息'){
							this.list = []
							this.mescroll.endByPage(0, 0);
						}else{
							if (page.num == 1) this.list = [];
							this.list = this.list.concat(res.data.data);
							this.mescroll.endByPage(res.data.data.length,  res.data.total);
						}
					} else {
						
					}
				}
			});
		},
		// 再次购买
		againBuy(e){
			uni.navigateTo({
				url: `/pages/indexDataDetail?type=${this.orderType}&id=${e}`
			})
		},
		// 提醒发货
		remind(e){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/sendRemind`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					type: this.orderType,
					ordernum: e,
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
						setTimeout(e => {
							this.mescroll.resetUpScroll();
						}, 2000)
					} else {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				}
			});
		},
		// 确认收货
		orderConfirm(e){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/receive`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					type: this.orderType,
					ordernum: e,
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
						setTimeout(e => {
							this.mescroll.resetUpScroll();
						}, 2000)
					} else {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				}
			});
		},
		// 删除取消订单
		del(e){
			uni.showLoading({
				title: '删除中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/delOrder`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					type: this.orderType,
					ordernum: e,
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					console.log(res);
					if (res.status_code == 'ok') {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
						setTimeout(e => {
							this.mescroll.resetUpScroll();
						}, 2000)
					} else {
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				}
			});
		},
		// 立即支付
		promptlyPay(e){
			uni.request({
				url: `${this.$helper.requestUrl}pay/pay`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: this.orderType,
					ordernum: e,
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
		getPay(payNode){
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
					uni.showToast({
						title: "支付成功",
						icon: 'success',
						duration: 2000
					});
					// 两秒后返回上一页
					setTimeout(e => {
						this.mescroll.resetUpScroll();
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
		},
		goDetail(e){
			console.log(e)
			uni.navigateTo({
				url: `/pages/orderDetail?obj=${JSON.stringify(e)}&type=${this.orderType}`
			})
		}
		
	}
};
</script>

<style lang="scss">
.courseOrder {
	width: 750rpx;
}
.head {
	width: 750rpx;
	padding: 30rpx 0 0;
	display: flex;
	justify-content: space-around;
	position: fixed;
	top: 0;
	left: 0;
	background: #fff;
	z-index: 9999;
	> view {
		color: #343434;
		font-size: 30rpx;
		height: 60rpx;
		font-weight: 600;
	}
	.cur {
		color: #fe9359;
		border-bottom: 4rpx solid #fe9359;
	}
}
.content {
	.item {
		width: 750rpx;
		padding-bottom: 20rpx;
		.top {
			width: 690rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			height: 60rpx;
			align-items: center;
			align-content: center;
			text {
				color: #999999;
				font-size: 24rpx;
			}
			.topR {
				display: flex;
				align-items: center;
				view {
					display: flex;
					align-items: center;
				}
				.topLine {
					width: 3rpx;
					height: 25rpx;
					background-color: #999999;
					display: block;
					margin: 0 20rpx;
				}
				image {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
		.center {
			width: 690rpx;
			padding: 30rpx;
			border-bottom: 1rpx solid #dddddd;
			border-top: 1rpx solid #dddddd;
			display: flex;
			align-items: center;
			align-content: center;
			justify-content: space-between;
			image {
				width: 112rpx;
				height: 94rpx;
				border-radius: 10rpx;
			}
			.right {
				width: 550rpx;
				.rightT {
					width: 550rpx;
					display: flex;
					justify-content: space-between;
					> text {
						color: #343434;
						font-size: 28rpx;
						display: block;
						width: 460rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.price {
						color: #ff1d00;
						font-size: 26rpx;
						font-weight: 600;
						text {
							font-size: 22rpx;
						}
					}
				}
				.rightB {
					width: 550rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 10rpx;
					text {
						display: block;
						color: #999999;
						font-size: 24rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
		.bottom {
			.bottomItem {
				width: 690rpx;
				padding: 30rpx 30rpx 0;
				display: flex;
				justify-content: flex-end;
				text {
					color: #343434;
					font-size: 28rpx;
					display: block;
					margin-left: 16rpx;
				}
				.button {
					border: 1rpx solid #dddddd;
					padding: 8rpx 30rpx;
					border-radius: 20rpx;
					color: #666666;
				}
				.cur{
					background-color: #FECF59;
					color: #FFFFFF;
					border: none;
				}
			}
		}
	}
}
</style>
