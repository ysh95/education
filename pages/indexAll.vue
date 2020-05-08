<template>
	<view class="indexAll">
		<view class="head" v-if="type != '更多'">
			<scroll-view scroll-x="true" class="scroll-list">
				<view :class="[Inv == -1 ? 'cur' : '']" @tap="navTap(-1,0)" style="margin-left: 30rpx;">全部</view>
				<block v-for="(item, index) in nav" :key="index">
					<view :class="[Inv == index ? 'cur' : '']" @tap="navTap(index,item.id)">{{ item.classify }}</view>
				</block>
			</scroll-view>
		</view>
		<view class="line" style="height: 100rpx;" v-show="type != '更多'"></view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
			<view class="indexAllList">
				<block v-for="(item, index) in list" :key="index">
					<view class="item" @tap="getDetail(item.id)">
						<image :src="imgUrl+item.theme" mode=""></image>
						<view class="teach">{{ item.title }}</view>
						<view class="star">
							<uniRate text="1" size="8" margin="2" :value="item.star"></uniRate>
						</view>
						<view class="price">￥{{ item.price }}</view>
					</view>
				</block>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
const app = getApp();
import helper from '../componets/helper.js';
import uniRate from '@/componets/wyc-rate/uni-rate.vue';
import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: { uniRate },
	data() {
		return {
			Inv: -1,
			type: '',
			imgUrl: '',
			downOption: {
				auto: true //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多数据了'
			},
			url: '',
			nav: [],
			list: [],
			listUrl:'',
			classify_id: '0',
			mode:''
		};
	},
	onLoad(option) {
		let navTitle = '全部图书'
		this.imgUrl = helper.imgUrl;
		// 判断是更多进入还是导航
		this.type = option.type;
		this.mode = option.mode
		if (this.mode == 'sellData') {
			// 畅销资料
			this.url = 'index/data'
			navTitle = '畅销资料'
			// this.getSellData();
		} else if (this.mode == 'books') {
			navTitle = '精选图书'
			this.url = 'index/book'
		}else if(this.mode == '畅销资料'){
			navTitle = '全部资料'
		}
		uni.setNavigationBarTitle({
			title: navTitle
		})
		if(this.type != '更多'){
			let navUrl = ''
			if(this.mode == '畅销资料'){
				navUrl = 'class/data_classify'
				this.listUrl = 'class/getDataList'
			}else if(this.mode == '推荐图书'){
				navUrl = 'class/book_classify'
				this.listUrl = 'class/getBookList'
			}
			this.getNavList(navUrl)
		}
	},
	methods: {
		// 选项卡
		navTap(e,id) {
			this.Inv = e;
			console.log(id)
			this.classify_id = id
			this.mescroll.resetUpScroll()
			this.list = []
		},
		// 跳转详情
		getDetail(id){
			uni.navigateTo({
				url: `/pages/indexDataDetail?id=${id}&type=${this.mode}`
			})
		},
		getNavList(navUrl){
			uni.request({
				url: `${helper.requestUrl}${navUrl}`,
				method: 'GET',
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					if (res.data.status_code == 'ok') {
						this.nav = res.data.data;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			if (this.type == '更多') {
				this.getSellData(page);
			} else {
				console.log('导航');
				this.getAll(page)
			}
		},
		// 首页导航
		getAll(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${helper.requestUrl}${this.listUrl}`,
				method: 'GET',
				data: {
					classify_id: this.classify_id,
					page_size: pageSize,
					page: pageNum
				},
				success: res => {
					res = helper.null2str(res);
					uni.hideLoading()
					if (res.data.status_code == 'ok') {
						let curPageData = res.data.data.data;
						let totalPage = res.data.data.total;
						if (page.num == 1) this.list = [];
						this.list = this.list.concat(curPageData);
						this.mescroll.endByPage(curPageData.length, totalPage);
					} else {
						this.list = []
						this.mescroll.endByPage(0, 0);
					}
				}
			});
		},
		// 畅销资料和精选图书
		getSellData(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${helper.requestUrl}${this.url}`,
				method: 'GET',
				data: {
					type: 'more',
					page_size: pageSize,
					page: pageNum 
				},
				success: res => {
					uni.hideLoading()
					res = helper.null2str(res);
					if (res.data.status_code == 'ok') {
						let curPageData = res.data.data.data;
						let totalPage = res.data.data.total;
						if (page.num == 1) this.list = [];
						this.list = this.list.concat(curPageData);
						this.mescroll.endByPage(curPageData.length, totalPage);
					} else {
						this.list = []
						this.mescroll.endByPage(0, 0);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.indexAll {
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
	z-index: 9;
	background-color: #ffffff;
	.scroll-list {
		white-space: nowrap;
		view {
			color: #343434;
			font-size: 30rpx;
			height: 60rpx;
			font-weight: 600;
			display: inline-block;
			margin-right: 80rpx;
		}
		.cur {
			color: #fe9359;
		}
	}
}
.cur::after {
	content: '';
	width: 60rpx;
	height: 6rpx;
	background-color: #fe9359;
	display: block;
	margin: 10rpx auto 0;
	border-radius: 6rpx;
}
.indexAllList {
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
	.item .star {
		display: flex;
	}
	.item .star image {
		width: 14rpx;
		height: 14rpx;
	}
}
.indexAllList .item {
	width: 330rpx;
	margin-bottom: 20rpx;
	margin-right: 24rpx;
}
.indexAllList .item:nth-of-type(2n) {
	margin-right: 0;
}
.indexAllList .item > image {
	width: 330rpx;
	height: 180rpx;
	border-radius: 20rpx;
}
</style>
