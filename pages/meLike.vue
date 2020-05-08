<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
	<view class="meLike">
		<block v-for="(item,index) in list" :key="index">
			<view class="item" @tap="goDetail(item.discover_id)">
				<image :src="imgUrl+ item.discover.theme" mode=""></image>
				<view class="tip">
					<uni-icons class="iconfont iconxin" type=""></uni-icons>
					<text>{{item.discover.like}}</text>
				</view>
			</view>
		</block>
	</view>
	</mescroll-body>
</template>

<script>
	const app = getApp()
	import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				list: [],
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
			}
		},
		onShow() {
			this.mescroll.resetUpScroll();
		},
		onLoad() {
			this.imgUrl = this.$helper.imgUrl
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
					url: `${this.$helper.requestUrl}user/getLikeDiscover`,
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
			goDetail(id){
				uni.navigateTo({
					url: `/pages/findDetail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
.meLike{
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	flex-wrap: wrap;
}
.item{
	width: 216rpx;
	height: 200rpx;
	border-radius: 10rpx;
	margin: 0 20rpx 20rpx 0;
	overflow: hidden;
	position: relative;
	image{
		width: 100%;
		height: 100%;
	}
	.tip{
		z-index: 99;
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		color: #FFFFFF;
		text{
			font-size: 24rpx;
		}
		.iconfont{
			font-size: 24rpx;
		}
	}
}
.item:nth-of-type(3n){
	margin: 0;
}
.mescroll-body {
	// left: 19vw;
}
</style>
