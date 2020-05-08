<template>
	<view class="findDetail">
		<!-- 视频组件 -->
		<view class="swiper">
			<!-- <swiper-item> -->
			<video
				:src="videoList.video"
				preload
				show-play-btn="true"
				id="myVideo"
				objectFit="contain"
				@click="clickVideo"
				:autoplay="isShow"
				ref="video_url"
				play-btn-position="center"
				class="video"
				@timeupdate="timeupdate"
			></video>
			<image class="play" v-if="show_play" @tap="videoPlay" src="../static/stop.png"></image>
			<view class="cover-view-left">
				<view class="view-left-text">{{ videoList.title }}</view>
				<view class="view-left-text-content">
					<view class="text-content-text">{{ videoList.introduce }}</view>
				</view>
			</view>
			<view class="cover-view-right">
				<view class="item">
					<input @tap="tapShade" class="post" type="text" value="说点什么..." disabled="" placeholder="说点什么吧" placeholder-class="" />
				</view>

				<view>
					<view class="item">
						<view @tap="tapShade">
							<uni-icons class="iconfont iconcomment" type=""></uni-icons>
							<text>{{ videoList.comment || 0 }}</text>
						</view>
					</view>
					<view class="item">
						<view @tap="tapLike(is_like)">
							<uni-icons class="iconfont iconxin" type="" v-if="is_like == 0"></uni-icons>
							<uni-icons class="iconfont icontaoxin" style="color: #FF0000;" type="" v-if="is_like == 1"></uni-icons>
							<text>{{ videoList.like || 0 }}</text>
						</view>
					</view>
					<view class="item">
						<button open-type="share" style="opacity: 0;width: 100rpx;height: 100rpx;z-index: 99;position: absolute;"></button>
						<uni-icons class="iconfont iconfenxiang" type=""></uni-icons>
						<text>{{ videoList.share || 0 }}</text>
					</view>
				</view>
			</view>
			<view class="shade" v-show="shade">
				<view class="head">
					<text>全部评论({{ totalPage || 0 }})</text>
					<uni-icons @tap="closeTapShade()" type="" class="iconfont iconguanbi"></uni-icons>
				</view>
				<view class="content">
					<scroll-view class="scroll" scroll-y="true" @scrolltolower="nextScroll">
						<block v-for="(item, index) in shadeList" :key="index">
							<view class="conItem">
								<image :src="item.user.avatar" mode=""></image>
								<view>
									<text>{{ item.user.nickname }}</text>
									<text class="conFont">{{ item.content }}</text>
								</view>
							</view>
						</block>
						<text>{{ text }}</text>
					</scroll-view>
				</view>
				<view class="bottom">
					<input type="text" :value="postContent" @input="post" />
					<text @tap="send">发送</text>
				</view>
			</view>
		</view>
		
		<button
			open-type="getUserInfo"
			style="opacity: 0;width: 100vw;height: 100vh;z-index: 999;position: absolute;"
			v-if="userInfoButtonShow"
			lang="zh_CN"
			@getuserinfo="onGetUserInfo"
		></button>
	</view>
</template>

<script>
let play = false;
const app = getApp();
import helper from '../componets/helper.js';
import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			isShow: true,
			is_like: 0,
			findId: '',
			shadeList: [],
			videoList: {},
			time: 0,
			show_play: false,
			shade: false,
			imgUrl: '',
			totalPage: '',
			page: '1',
			text: '',
			postContent: '说点什么吧',
			userInfoButtonShow: true
		};
	},
	onLoad(option) {
		this.imgUrl = this.$helper.imgUrl;
		this.findId = option.id;
		this.getVideo();
		// this.onGetUserInfo();

		uni.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					this.userInfoButtonShow = false;
				}
			}
		});
	},
	onShareAppMessage(res) {
		uni.request({
			url: `${helper.requestUrl}discover/sharePlus`,
			method: 'POST',
			data: {
				discover_id: this.findId
			},
			success: data => {
				res = helper.null2str(res);
				uni.hideToast();
				if (data.statusCode === 200) {
					this.videoList.share++;
				} else {
				}
			}
		});
		return {
			title: this.videoList.title,
			path: `/pages/findDetail?id=${this.findId}`
		};
	},
	methods: {
		clickVideo() {
			this.videoPlay();
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
		// 提交用户信息
		onGetUserInfo(e) {
			let that = this;
			if (e.detail.errMsg == 'getUserInfo:ok') {
				var user = e.detail.userInfo
				uni.login({
					success: res => {
						uni.request({
							url: `${helper.requestUrl}auth/login`,
							method: 'POST',
							data: {
								code: res.code,
								nickname: user.nickName,
								sex: user.gender,
								headimgurl: user.avatarUrl,
								mobile: ''
							},
							success: data => {
								res = helper.null2str(res);
								uni.hideToast();
								if (data.statusCode === 200) {
									that.userInfoButtonShow = false;
									let token = data.data.token_type + ' ' + data.data.access_token;
									app.globalData.token = token;
									that.getIndexInfo();
									that.getVideo()
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
			}
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
		videoPlay() {
			let video_id = this.videoList.id;
			if (play) {
				this.videoCtx = uni.createVideoContext('myVideo');
				this.videoCtx.play();
				this.show_play = false;
				play = false;
			} else {
				this.videoCtx = uni.createVideoContext('myVideo');
				this.videoCtx.pause();
				this.show_play = true;
				play = true;
			}
		},
		timeupdate(event) {
			let t_w = parseInt(this.width);
			this.duration = event.detail.duration;
			this.time = event.detail.currentTime;
			let width = (this.time / this.duration) * t_w;
			let w = 0;
		},
		// 获取视频
		getVideo() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: `${helper.requestUrl}discover/discoverDetails`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					discover_id: this.findId
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					if (res.data.status_code == 'ok') {
						this.videoList = res.data.data;
						this.is_like = res.data.is_like;
					}
				}
			});
		},
		// 评论
		tapShade() {
			this.shadeList = [];
			this.shade = true;
			this.getShade();
		},
		getShade() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.request({
				url: `${helper.requestUrl}discover/commentList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					discover_id: this.findId,
					page_size: '10',
					page: this.page
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res);
					if (res.data.status_code == 'ok') {
						let curPageData = res.data.data.data;
						this.totalPage = res.data.data.total;
						this.shadeList = this.shadeList.concat(curPageData);
					}
				}
			});
		},
		nextScroll() {
			this.page++;
			this.getShade();
		},
		closeTapShade() {
			this.shade = false;
		},
		post(e) {
			this.postContent = e.detail.value;
		},
		send() {
			if (this.postContent == '') {
				uni.showToast({
					title: '请输入发表内容',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '发表中...'
			});
			uni.request({
				url: `${helper.requestUrl}discover/comment`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					discover_id: this.findId,
					content: this.postContent
				},
				success: res => {
					res = helper.null2str(res);
					uni.hideLoading();
					if (res.data.status_code == 'ok') {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
						this.postContent = '';
						this.page = '1';
						this.getShade();
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		},
		// 赞
		tapLike(e) {
			let url = '';
			if (e == 0) {
				// 添加关注
				url = 'discover/setLike';
			} else {
				url = 'discover/delLike';
			}
			this.getLike(url);
		},
		getLike(url) {
			uni.request({
				url: `${helper.requestUrl}${url}`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					discover_id: this.findId
				},
				success: res => {
					res = helper.null2str(res.data);
					if (res.status_code == 'ok') {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
						if (this.is_like == 1) {
							this.is_like = 0;
							this.videoList.like--;
						} else {
							this.is_like = 1;
							this.videoList.like++;
						}
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.findDetail {
	width: 750rpx;
	display: flex;
	flex-direction: column;
	/* align-items: center; */
	justify-content: center;
	background-color: #333333;
	height: 100vh;
}
.swiper {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
}
.video {
	width: 100%;
	height: 100%;
	position: relative;
	// position: absolute;
}
.play {
	position: absolute;
	width: 100rpx;
	height: 100rpx;
	left: 50%;
	margin-left: -50rpx;
	top: 44vh;
	opacity: 0.5;
}
.progressBar {
	border-radius: 2upx;
	height: 4upx;
	background-color: #ff4500;
	z-index: 999999;
	position: absolute;
	bottom: 68rpx;
}

.cover-view-left {
	position: absolute;
	margin-left: 20upx;
	width: 690upx;
	bottom: 110upx;
	z-index: 9999;
	font-size: 14px;
	color: #ffffff;
}
.left-text {
	font-size: 14px;
	color: #ffffff;
}

.cover-view-right {
	position: absolute;
	bottom: 60upx;
	z-index: 9999;
	text-align: center;
	right: 0;
	width: 690rpx;
	padding: 0 30rpx;
	display: flex;
	justify-content: space-between;
	view {
		// width: 400rpx;
		display: flex;
		justify-content: flex-end;
	}
}
.cover-view-right .item {
	display: flex;
	align-items: center;
	margin-right: 30rpx;
	// width: 200rpx;
	position: relative;
}
.cover-view-right .item .iconfont {
	// width: 32rpx;
	// height: 32rpx;
	font-size: 32rpx;
	color: #ffffff;
	margin-right: 10rpx;
	display: block;
}
.cover-view-right .item text {
	color: #ffffff;
	font-size: 26rpx;
}
.cover-view-right .post {
	width: 280rpx;
	background-color: #98a0a8;
	color: #ffffff;
	font-size: 26rpx;
	border-radius: 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	margin-right: 30rpx;
}
.view-left-text-content {
	flex: 1;
}
.view-left-text {
	color: #ffffff;
	font-size: 18px;
	margin-bottom: 10upx;
	font-weight: bold;
}
.text-content-text {
	color: #ffffff;
	font-size: 16px;
	line-height: 50upx;
	height: 100upx;
	overflow: hidden;
}
.shade {
	width: 690rpx;
	height: 57vh;
	padding: 30rpx;
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999999999999999999999 !important;
	border-radius: 30rpx 30rpx 0 0;
	.head {
		width: 100%;
		display: flex;
		justify-content: space-between;
		text {
			font-size: 36rpx;
			color: #343434;
		}
		.iconfont {
			color: #343434;
			font-size: 46rpx;
			font-weight: 600;
		}
	}
	.content {
		width: 690rpx;
		margin: 30rpx 0;
		height: 44vh;
		.scroll {
			height: 44vh;
		}
		.conItem {
			display: flex;
			align-items: flex-start;
			margin-bottom: 20rpx;
			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 68rpx;
				margin-right: 20rpx;
			}
			> view {
				width: 600rpx;
			}
			text {
				display: block;
				color: #343434;
				font-size: 28rpx;
			}
			.conFont {
				color: #666666;
				display: -webkit-box;
				text-overflow: ellipsis;
				overflow: hidden;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
	.conItem > view text:first-of-type {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.bottom {
		width: 690rpx;
		padding: 0 30rpx;
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		bottom: 40rpx;
		left: 0;
		text {
			color: #fe9359;
			font-size: 28rpx;
		}
		input {
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 30rpx;
			color: #999999;
			font-size: 26rpx;
			width: 540rpx;
			background-color: #f0f2f6;
			border-radius: 30rpx;
		}
	}
}
.getUserInfo {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 99999999999999999999999999;
	background-color: rgba($color: #000000, $alpha: 0);
	border: none !important;
}
button::after {
	border: none !important;
}
</style>
