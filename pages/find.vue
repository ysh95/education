<template>
	<view class="find">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick='emptyClick'>
		<view class="left">
			<block v-for="(item,index) in findList" :key="index">
				<view class="list" @tap="getDetail(item.id)">
					<image :src="imgUrl+item.theme" mode="widthFix" ></image>
					<view class="bottom">
						<text class="title">{{item.title}}</text>
						<view class="findB">
							<view class="findBL">
								<image :src="item.imgHead" mode=""></image>
								<text>{{item.name}}</text>
							</view>
							<view class="findBR">
								<uni-icons class="iconfont iconxin"></uni-icons>
								<text>{{item.like}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			
		</view>
		</mescroll-body>
	</view>
</template>

<script>
	const app = getApp()
	import helper from "../componets/helper.js";
	import MescrollMixin from "../componets/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				findList:[],
				imgUrl: '',
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore: '没有更多数据了'
				}
			}
		},
		onShow() {
			this.mescroll.resetUpScroll()
		},
		onLoad() {
			this.imgUrl = helper.imgUrl;
			// this.upCallback(page)
			// this.getList()
		},
		methods: {
			// 获取数据
			/*下拉刷新的回调 */
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			 // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
			upCallback (page) {
				this.getList(page)
			},
			getList(page) {
				console.log(page,'-----------------------')
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				uni.showLoading({
					title: '加载中...',
				})
				uni.request({
					url: `${helper.requestUrl}discover/getDiscoverList`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: {
						page_size: pageSize,
						page: pageNum
					},
					success: res => {
						uni.hideLoading()
						res = helper.null2str(res);
						console.log(res);
						if (res.data.status_code == 'ok') {
							let curPageData = res.data.data.data
							let totalPage = res.data.data.total
							if(page.num == 1) this.findList = []; 
							this.findList = this.findList.concat(curPageData);
							console.log(this.findList)
							this.mescroll.endByPage(curPageData.length, totalPage); 
						}else {
							uni.showToast({
								title: res.data.message,
								icon: 'none'
							});
						}
					}
				});
			},
			// 跳转详情
			getDetail(e){
				uni.navigateTo({
					url: `/pages/findDetail?id=${e}`
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F2F2F4;
}
.find{
	width: 700rpx;
	padding: 25rpx;
	display: flex;
	flex-wrap: wrap;
}
.find .list{
	width: 340rpx;
	border-radius: 20rpx;
	background-color: #FFFFFF;
	break-inside: avoid;
	overflow: auto;
	margin-bottom: 20rpx;
	> image {
		width: 340rpx;
	}
}
.find .left{
	padding-top: 4rpx;
 column-count: 2;
 column-gap: 18rpx;
}
/* .find .list video{
	width: 100%;
	height: 300rpx;
} */
.find .bottom{
	width: 100%;
}
.find .title{
	color: #343434;
	font-size: 28rpx;
	font-weight: 600;
	overflow:hidden;
	
	text-overflow:ellipsis;
	
	display:-webkit-box;
	
	-webkit-box-orient:vertical;
	
	-webkit-line-clamp:2; 
	padding:0 10rpx;
	margin: 10rpx 0;
}
.find .findB{
	width: 94%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	padding:0 10rpx;
}
.find .findB .findBL,.find .findB .findBR{
	display: flex;
	align-items: center;
	
}
.find .findB .findBL>image{
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
}
.find .findB .findBL>text{
	color: #666666;
	font-weight: 600;
	font-size: 24rpx;
	margin-left: 10rpx;
}
.find .findB .findBR{
	color: #666666;
	font-weight: 600;
	font-size: 24rpx;
}
</style>