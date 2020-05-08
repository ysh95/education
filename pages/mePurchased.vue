<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
	<view class="classfyDetail">
		<block v-for="(item,index) in list" :key="index">
			<view class="item" @tap="goDetail(item.id)">
				<image :src="imgUrl + item.theme" mode=""></image>
				<view class="teach">{{item.curriculum}}</view>
				<view class="star">
					<uniRate text="1" size="8" margin="2" :value="item.star"></uniRate>
				</view>
			</view>
		</block>
	</view>
	</mescroll-body>
</template>

<script>
	const app = getApp()
	import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
	import uniRate from '@/componets/wyc-rate/uni-rate.vue';
	export default {
		components: { uniRate },
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
			}
		},
		onLoad(e){
			this.imgUrl = this.$helper.imgUrl
			uni.setNavigationBarTitle({
				title:e.title
			})
			
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
					url: `${this.$helper.requestUrl}user/getMyCurricula`,
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
							this.list = this.list.concat(res.data);
							this.mescroll.endByPage(res.data.length,  res.total);
						} else {
							this.list = []
							this.mescroll.endByPage(0, 0);
						}
					}
				});
			},
			goDetail(id){
				uni.navigateTo({
					url: `/pages/indexCourse?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
.classfyDetail{
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.item .teach {
		color: #343434;
		font-weight: 600;
		font-size: 28rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 10rpx 0;
	}
	.item .price {
		color: #ff1d00;
		font-weight: 600;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 10rpx 0;
	}
	.item .star{
		display: flex;
	}
	.item .star image{
		width: 14rpx;
		height: 14rpx;
	}
}
.classfyDetail .item{
	width: 330rpx;
	margin-bottom: 20rpx;
	margin-right: 24rpx;
}
.classfyDetail .item:nth-of-type(2n){
	margin-right: 0;
}
.classfyDetail .item>image{
	width: 330rpx;
	height: 180rpx;
	border-radius: 20rpx;
}
</style>
