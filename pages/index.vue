<template>
	<view class="index">
		<view class="head">
			<!-- 搜索 -->
			<view class="search" @tap="goSearch">
				<uni-icons class="iconfont iconsousuo"></uni-icons>
				<input type="text" value="搜索" confirm-type="search" disabled="" />
			</view>
		</view>
		<!-- 轮播 -->
		<swiper class="indexBanner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#FEBE9B" indicator-active-color="#FE9359">
			<block v-for="(item, index) in bannerList" :key="index">
				<swiper-item><image :src="imgUrl + item.url" mode=""></image></swiper-item>
			</block>
		</swiper>
		<view class="nav">
			<block v-for="(item, index) in navList" :key="index">
				<view class="item" @tap="getNav(item.title)">
					<image :src="item.img" mode=""></image>
					<text>{{ item.title }}</text>
				</view>
			</block>
		</view>
		<!-- <view class="line"></view> -->
		<!-- <!课程推荐 -->
		<view class="recommend" v-if="recList != ''">
			<view class="recTitle">
				<text class="recTitleL">课程推荐</text>
				<text class="recTitleR">共有{{ curriculaCount }}门课程推荐</text>
			</view>
			<view class="recList">
				<block v-for="(item, index) in recList" :key="index">
					<view class="item" @tap="goRecList(item.id)">
						<image class="img" :src="imgUrl + item.theme" mode=""></image>
						<view class="recBottom">
							<text class="teach">{{ item.curriculum }}</text>
							<view class="star"><uniRate text="1" size="8" margin="2" :value="item.star"></uniRate></view>
							<text class="price">￥{{ item.price }}</text>
						</view>
					</view>
				</block>
			</view>
			<text class="more" @tap="getMore('recommend')">查看更多教程</text>
		</view>
		<!-- 畅销资料 -->
		<view class="sellData" v-if="sellList != ''">
			<view class="recTitle">
				<text class="recTitleL">畅销资料</text>
				<text class="recTitleR">共有{{ dataCount }}册畅销资料</text>
			</view>
			<scroll-view class="scroll-list" scroll-x>
				<block v-for="(item, index) in sellList" :key="index">
					<view class="item" @tap="goData('data', item.id)">
						<image class="img" :src="imgUrl + item.theme" mode=""></image>
						<view class="recBottom">
							<text class="teach">{{ item.title }}</text>
							<view class="star"><uniRate text="1" size="8" margin="2" :value="item.star"></uniRate></view>
							<text class="price">￥{{ item.price }}</text>
						</view>
					</view>
				</block>
			</scroll-view>
			<text class="more" @tap="getMore('sellData')">查看更多资料</text>
		</view>
		<!-- 精选图书 -->
		<view class="sellData" v-if="bookList != ''">
			<view class="recTitle">
				<text class="recTitleL">精选图书</text>
				<text class="recTitleR">共有{{ bookCount }}本精选图书</text>
			</view>
			<scroll-view class="scroll-list" scroll-x>
				<block v-for="(item, index) in bookList" :key="index">
					<view class="item" @tap="goData('books', item.id)">
						<image class="img" :src="imgUrl + item.theme" mode=""></image>
						<view class="recBottom">
							<text class="teach">{{ item.title }}</text>
							<view class="star">
								<uniRate text="1" size="8" margin="2" :value="item.star"></uniRate>
								<!-- 	<view class="rate-tips">{{rateTitleArr[rateValue-1]}}</view> -->
							</view>
							<text class="price">￥{{ item.price }}</text>
						</view>
					</view>
				</block>
			</scroll-view>
			<text class="more" @tap="getMore('books')">查看更多图书</text>
		</view>
		<button open-type="getUserInfo" id="getUserInfo" v-if="userInfoButtonShow" lang="zh_CN" @getuserinfo="onGetUserInfo"></button>
	</view>
</template>

<script>
const app = getApp();
import helper from '../componets/helper.js';
import uniRate from '@/componets/wyc-rate/uni-rate.vue';
export default {
	components: { uniRate },
	data() {
		return {
			recList: {},
			navList: [{ title: '发现精彩', img: '/static/index1.png' }, { title: '推荐图书', img: '/static/index2.png' }, { title: '畅销资料', img: '/static/index3.png' }],
			bannerList: [],
			imgUrl: '',
			userInfoButtonShow: true,
			userInfo: {},
			sellList: [],
			bookList: [],
			authorizationButton: null,
			dataCount: 0,
			bookCount: 0,
			curriculaCount: 0
		};
	},
	onLoad() {
		this.userInfo = app.globalData.userInfo;
		this.imgUrl = helper.imgUrl;
		this.onGetUserInfo();
		uni.showShareMenu({
			withShareTicket: true
		});
	},
	onShow() {
		this.banner();
		// 课程推荐
		this.course();
		//畅销资料
		this.sellData();
		//精选图书
		this.books();
	},
	methods: {
		// 轮播
		banner(callBack) {
			uni.request({
				url: `${helper.requestUrl}index/getBanners`,
				method: 'GET',
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					console.log(res);
					if (res.data.status_code == 'ok') {
						this.bannerList = res.data.data;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		},
		// 导航
		getNav(e) {
			if (e == '发现精彩') {
				uni.navigateTo({
					url: `/pages/find`
				});
			} else {
				uni.navigateTo({
					url: `/pages/indexAll?type=导航&mode=${e}`
				});
			}
		},
		// 课程推荐
		course() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: `${helper.requestUrl}index/curriculum`,
				method: 'GET',
				data: {
					type: 'index'
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					console.log(res);
					if (res.data.status_code == 'ok') {
						this.recList = res.data.data;
						this.curriculaCount = res.data.count;
					} else {
						this.recList = [];
					}
				}
			});
		},
		goRecList(e) {
			uni.navigateTo({
				url: `/pages/indexCourse?id=${e}`
			});
		},
		// 畅销资料
		sellData() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: `${helper.requestUrl}index/data`,
				method: 'GET',
				data: {
					type: 'index'
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					console.log(res);
					if (res.data.status_code == 'ok') {
						this.sellList = res.data.data;
						this.dataCount = res.data.count;
					} else {
						this.sellList = [];
					}
				}
			});
		},
		// 精选图书
		books() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: `${helper.requestUrl}index/book`,
				method: 'GET',
				data: {
					type: 'index'
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					console.log(res);
					if (res.data.status_code == 'ok') {
						this.bookList = res.data.data;
						this.bookCount = res.data.count;
					} else {
						this.bookList = [];
					}
				}
			});
		},
		// 获取更多
		getMore(e) {
			if (e == 'recommend') {
				uni.switchTab({
					url: `/pages/classify`
				});
			} else {
				uni.navigateTo({
					url: `/pages/indexAll?type=更多&mode=${e}`
				});
			}
		},
		// 跳转资料详情
		goData(e, id) {
			uni.navigateTo({
				url: `/pages/indexDataDetail?type=${e}&id=${id}`
			});
		},
		// 用户信息校验
		verificationUserInfo() {
			if (!this.userInfo.hasOwnProperty('id')) {
				uni.showToast({
					title: '用户信息加载中...',
					icon: 'none'
				});
				return true;
			}
		},
		// 用户信息获取
		onGetUserInfo() {
			// 查看是否授权
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						this.userInfoButtonShow = false;
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						uni.getUserInfo({
							success: res => {
								console.log(res);
								this.userInfo = Object.assign(this.userInfo, res.userInfo);
								app.globalData.userInfo = this.userInfo;
								// 登录
								this.setUserInfo();
							}
						});
					} else {
						this.setUserInfo();
					}
				}
			});
		},
		// 提交用户信息
		setUserInfo() {
			let that = this;
			uni.login({
				success: res => {
					uni.request({
						url: `${helper.requestUrl}auth/login`,
						method: 'POST',
						data: {
							code: res.code,
							nickname: that.userInfo.nickName,
							sex: that.userInfo.gender,
							headimgurl: that.userInfo.avatarUrl,
							mobile: ''
						},
						success: data => {
							res = helper.null2str(res);
							uni.hideToast();
							console.log(data);
							if (data.statusCode === 200) {
								let token = data.data.token_type + ' ' + data.data.access_token;
								app.globalData.token = token;
								that.getIndexInfo();
							} else {
								uni.showModal({
									title: '',
									content: data.data.errmsg
								});
							}
						}
					});
				}
			});
		},
		getIndexInfo() {
			// 用户信息获取
			uni.request({
				url: `${helper.requestUrl}auth/me`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					if (res.data.status_code == 'ok') {
						this.userInfo = res.data.data;
						app.globalData.userInfo = res.data.data;
					}
				}
			});
		},
		// 搜索
		goSearch() {
			uni.navigateTo({
				url: 'search'
			});
		}
	}
};
</script>

<style lang="scss">
.index {
	width: 750rpx;
}
.index .head {
	width: 690rpx;
	padding: 30rpx;
	background-color: #efcf59;
	height: 160rpx;
}
.index .search {
	width: 640rpx;
	background: #ffffff;
	border-radius: 30rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	align-content: center;
	padding: 0 30rpx;
}
.index .search .iconsousuo {
	color: #cdcdcd;
	font-size: 28rpx;
	margin-right: 20rpx;
}
.index .search input {
	color: #cdcdcd;
	font-size: 28rpx;
}
.index .indexBanner {
	width: 690rpx;
	height: 294rpx;
	border-radius: 14rpx;
	overflow: hidden;
	z-index: 9;
	margin-top: -120rpx;
	padding: 30rpx;
}
.index .indexBanner swiper-item {
	width: 100%;
	height: 100%;
	border-radius: 14rpx;
}
.index .indexBanner image {
	width: 100%;
	height: 100%;
}
.nav {
	width: 690rpx;
	padding: 0 30rpx 30rpx;
	display: flex;
	justify-content: space-around;
	.item {
		width: 140rpx;
		text-align: center;
		font-size: 28rpx;
		color: #343434;
		image {
			width: 80rpx;
			height: 80rpx;
			display: block;
			margin: 0 auto 10rpx;
		}
	}
}
.nav .item:nth-of-type(3){
	margin-right: 0rpx;
}
.sellData {
	width: 690rpx;
	padding: 30rpx 30rpx 20rpx;
	overflow: hidden;
	border-top: 20rpx solid #FAF9F5;
	.recTitle {
		// margin-left: 30rpx;
	}
	.item {
		// margin-left: 30rpx;
		// margin-right: 0;
		width: 300rpx;
	}
}
.index .recommend {
	width: 690rpx;
	padding: 30rpx;
}
.recTitle {
	display: flex;
	align-items: center;
}
.recTitle .recTitleL {
	font-weight: 600;
	color: #343434;
	font-size: 36rpx;
}
.recTitle .recTitleR {
	color: #999999;
	font-weight: 600;
	font-size: 24rpx;
	margin-left: 20rpx;
}
.index .recommend .recList {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.scroll-list {
	// width: 100%;
	// padding-right: 30rpx;
	white-space: nowrap;
	// overflow-x: hidden;
}
.item {
	width: 330rpx;
	margin: 20rpx 30rpx 0 0;
	display: inline-block;
}
.recommend .item:nth-of-type(2n) {
	margin-right: 0;
}
.item .img {
	width: 100%;
	height: 178rpx;
	border-radius: 12rpx;
	overflow: hidden;
}
.recBottom text {
	display: block;
}
.recBottom .teach {
	color: #343434;
	font-weight: 600;
	font-size: 28rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 10rpx 0;
}
.recBottom .price {
	color: #ff1d00;
	font-weight: 600;
	font-size: 24rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 10rpx 0;
}
.more {
	color: #999999;
	font-weight: 600;
	font-size: 26rpx;
	border: 1rpx solid #dddddd;
	border-radius: 10rpx;
	width: 220rpx;
	height: 60rpx;
	line-height: 60rpx;
	margin: 20rpx auto;
	text-align: center;
	display: block;
}
.index .star {
	display: flex;
}
.index .star image {
	width: 14rpx;
	height: 14rpx;
}
#getUserInfo {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 9;
	background-color: rgba($color: #000000, $alpha: 0);
	border: none !important;
}
button::after {
	border: none !important;
}
::-webkit-scrollbar{
    width: 0;
    height: 0;
    color: transparent;
}
</style>
