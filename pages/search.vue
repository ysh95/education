<template>
	<view class="search">
		<view class="searchInput">
			<view>
				<uni-icons type="" class="iconfont iconsousuo"></uni-icons>
				<input type="text" value="" @input="bindInput" placeholder="搜索" placeholder-class="searchTip" @confirm="setSearchStorage(inputValue)" />
			</view>
		</view>
		<view v-if="mask">
			<view class="history" style="margin-bottom: 10rpx;" v-if="storageFlag">
				<view class="head">
					<text>搜索历史</text>
					<image @tap="clearSearchStorage" src="../static/clear.png" mode=""></image>
				</view>
				<view class="historyList">
					<block v-for="(item, index) in historyList" :key="index">
						<text @tap="tapSercherStorage(item)">{{ item }}</text>
					</block>
				</view>
			</view>
			<view class="history" v-if="hotList.length != 0">
				<view class="head"><text>热门搜索</text></view>
				<view class="historyList">
					<block v-for="(item, index) in hotList" :key="index">
						<text @tap="goHot(item.content)">{{ item.content }}</text>
					</block>
				</view>
			</view>
		</view>
		<view v-if="!mask">
			<view class="classfyDetail">
				<block v-for="(item,index) in itemList" :key="index">
					<view class="item" @tap="goDetail(item.id,item.type)">
						<image :src="imgUrl + item.theme" mode=""></image>
						<view class="teach">{{item.title}}</view>
						<view class="star">
							<uniRate text="1" size="8" margin="2" :value="item.star"></uniRate>
						</view>
						<text class="price">￥{{ item.price }}</text>
					</view>
				</block>
				<view class="null" v-if="itemList == ''">
					暂无数据
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
const app = getApp();
import uniRate from '@/componets/wyc-rate/uni-rate.vue';
export default {
	components: { uniRate },
	data() {
		return {
			historyList: [],
			hotList: [],
			inputValue: '',
			storageFlag: false, // 显示搜索记录标志位
			mask: true,
			imgUrl: '',
			itemList: [],
		};
	},
	onLoad() {
		this.imgUrl = this.$helper.imgUrl;
		this.openLocationsercher();
		this.getHot();
	},
	methods: {
		// 热门搜索
		getHot() {
			uni.request({
				url: `${this.$helper.requestUrl}search/getHotSearch`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '-------------------');
					uni.hideToast();
					if (res.status_code == 'ok') {
						this.hotList = res.data;
						// this.getPay(res.data);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		goHot(e) {
			this.inputValue = e
			this.storageFlag = true;
			this.mask = false;
			this.itemList = [];
			this.getListData()
		},
		// 获取输入框的输入信息
		bindInput(e) {
			this.inputValue = e.detail.value;
			if (this.inputValue == '') {
				this.mask = true;
			}
		},
		// // 清楚缓存历史并关闭历史搜索框
		clearSearchStorage() {
			uni.removeStorageSync('searchData');
			this.historyList = [];
			this.storageFlag = false;
		},
		// // 点击缓存搜索列表
		tapSercherStorage(e) {
			console.log(e)
			var index = e;
			this.inputValue = index;
			this.storageFlag = true;
			this.mask = false;
			this.itemList = [];
			this.getListData();
		},
		// //添加搜索记录并搜索
		setSearchStorage(e) {
			this.inputValue = e;
			if (this.inputValue != '') {
				//将搜索记录更新到缓存
				var searchData = this.historyList;
				searchData.unshift(this.inputValue);
				searchData = [...new Set(searchData)];
				searchData = searchData.splice(0, 6);
				console.log(searchData);
				uni.setStorageSync('searchData', searchData);
				this.storageFlag = true;
				this.mask = false;
				this.openLocationsercher();
				this.itemList = [];
				this.getListData();
			}
		},
		// // 打开历史记录列表
		openLocationsercher() {
			console.log(uni.getStorageSync('searchData'));
			this.historyList = uni.getStorageSync('searchData') || []; //调用API从本地缓存中获取数据
			if (this.historyList == '') {
				this.storageFlag = false;
			} else {
				this.storageFlag = true;
			}
		},
		getListData() {
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}search/search`,
				header: {
					authorization: app.globalData.token
				},
				method: 'POST',
				data: {
					search: this.inputValue
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.itemList = res.data;
					} else {
						this.itemList = '';
					}
				}
			});
		},
		goDetail(id,e){
			console.log(id,e)
			let url = ''
			if(e == 'curricula'){
				url = '/pages/indexCourse'
			}else{
				url = '/pages/indexDataDetail'
			}
			uni.navigateTo({
				url:`${url}?id=${id}&type=${e}`
			})
		}
		
	}
};
</script>

<style lang="scss">
.search {
	width: 750rpx;
}
.searchInput {
	width: 690rpx;
	padding: 20rpx 30rpx;
	background-color: #efcf5e;

	view {
		width: 630rpx;
		display: flex;
		background-color: #fff;
		border-radius: 30rpx;
		height: 60rpx;
		align-items: center;
		padding: 0 30rpx;
		.iconfont {
			font-size: 30rpx;
			margin-right: 20rpx;
			color: #dcdcdc;
		}
		.searchTip {
			color: #cdcdcd;
			font-size: 26rpx;
		}
	}
	input {
		width: 100%;

		border-radius: 30rpx;
	}
}
.history {
	width: 690rpx;
	padding: 30rpx;
	.head {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18rpx;
		image {
			width: 26rpx;
			height: 26rpx;
		}
		text {
			color: #343434;
			font-size: 28rpx;
		}
	}
	.historyList {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		text {
			display: block;
			border: 1rpx solid #dddddd;
			color: #666666;
			font-size: 22rpx;
			padding: 6rpx 16rpx;
			border-radius: 20rpx;
			margin: 0 16rpx 16rpx 0;
		}
	}
}
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
.null{
	text-align: center;
	color: #545454;
	font-size: 28rpx;
	display: flex;
	justify-content: center;
	width: 100%;
}
</style>
