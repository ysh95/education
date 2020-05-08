<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
	<view class="systemNotice">
		<block v-for="(item, index) in list" :key="index">
			<view class="item" @tap="goDetail(item.id)">
				<view class="head">
					<text class="title">{{ item.title }}</text>
					<text>{{item.created_at}}</text>
				</view>
				<text class="conFont">{{ item.introduce }}</text>
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
		onLoad() {
			this.imgUrl = this.$helper.imgUrl
		},
	methods: {
		goDetail(e){
			uni.navigateTo({
				url:`/pages/articleDetail?id=${e}`
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
				url: `${this.$helper.requestUrl}system/getSystemMessageList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					page_size: page.size,
					page: page.num
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					uni.hideLoading()
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
		
		
		
	}
};
</script>

<style lang="scss">
	page{
		background-color: #F0F2F6;
	}
.systemNotice {
	width: 750rpx;
	.item {
		width: 690rpx;
		padding: 30rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			text {
				color: #999999;
				font-size: 24rpx;
			}
			.title {
				color: #343434;
				font-size: 32rpx;
				width: 500rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		text {
			display: block;
		}
		.conFont {
			color: #565656;
			font-size: 28rpx;
			margin-top: 10rpx;
			line-height: 50rpx;
			display: -webkit-box;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
}
</style>
