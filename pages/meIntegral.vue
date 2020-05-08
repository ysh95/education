<template>
	<view class="meIntegral">
		<view class="head">
			<image src="../static/img13.png" mode=""></image>
			<text class="number">{{userInfo.integral || 0}}</text>
			<text>当前积分</text>
		</view>
		<view class="line"></view>
		<view class="list">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
			<block v-for="(item,index) in list" :key="index">
				<view class="item">
					<view class="left">
						<text class="type">{{item.title}}</text>
						<text>{{item.created_at}}</text>
					</view>
					<view class="right">
						<text class="price">{{item.content}}</text>
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
				list:[],
				imgUrl: '',
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
				userInfo: {}
			}
		},
		onLoad() {
			this.userInfo = app.globalData.userInfo
		},
		methods: {
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
					url: `${this.$helper.requestUrl}user/integralRecord`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data:{
						page_size: page.size,
						page: page.num
					},
					success: res => {
						uni.hideLoading()
						res = this.$helper.null2str(res.data);
						if (res.status_code == 'ok') {
							if (page.num == 1) this.list = [];
							this.list = this.list.concat(res.data.data);
							this.mescroll.endByPage(res.data.data.length,  res.data.total);
						} else {
							 if(res.message == '暂无信息'){
							 	this.list = []
							 	this.mescroll.endByPage(0, 0);
							 }else{
							 	
							 }
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
.meIntegral{
	width: 750rpx;
}
.head{
	width: 750rpx;
	padding: 60rpx 0 30rpx 0;
	image{
		width: 104rpx;
		height: 112rpx;
		margin: 0 auto;
		display: block;
	}
	text{
		display: block;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}
	.number{
		color: #FE9359;
		font-size: 40rpx;
		margin-top: 30rpx;
	}
}
.list{
	width: 690rpx;
	padding:0 30rpx 30rpx;
	.item{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #DDDDDD;
		padding: 30rpx 0;
		.left{
			text{
				display: block;
				color: #999999;
				font-size: 24rpx;
			}
			.type{
				color: #343434;
				font-size: 30rpx;
				margin-bottom: 10rpx;
			}
		}
		.right{
			text{
				color: #C91D23;
				font-size: 26rpx;
			}
			.price{
				font-size: 30rpx;
			}
		}
	}
}
</style>
