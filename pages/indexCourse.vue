<template>
	<view class="indexCourse">
		<!-- 视频 -->
		<view class="video">
			<image :src="imgUrl + content.theme" mode="" v-if="!isSAutoplay"></image>
			<video :src="videoUrl" v-if="isSAutoplay" controls="true" :autoplay="isSAutoplay"></video>
		</view>
		<view class="course">
			<view class="head">
				<block v-for="(item, index) in nav" :key="index">
					<view :class="[Inv == index ? 'cur' : '']" @tap="navTap(index)">{{ item.navName }}</view>
				</block>
			</view>
			<view v-if="Inv == '0'">
				<view class="detail">
					<text class="detailTitle">{{ content.curriculum }}</text>
					<text>{{ content.introduce }}</text>
				</view>
				<view class="imgList">
					<block v-for="(item, index) in content.details" :key="index"><image :src="imgUrl + item" mode="widthFix"></image></block>
				</view>
			</view>
			<view class="chapter" v-if="Inv == '1'">
				<view class="contList">
					<block v-for="(item, index) in content.api_extend" :key="index">
						<view class="item" @tap="showVideo(item.id,item.try)">
							<view>
								<text>视频</text>
								<view>{{ item.title }}</view>
							</view>
							<text v-if="item.try == 1">可试看</text>
						</view>
					</block>
				</view>
			</view>
			<view class="chapter" v-if="Inv == '2'">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
				<view class="comment">
					<block v-for="(item, index) in commentList" :key="index">
						<view class="item">
							<image :src="item.user.avatar" mode=""></image>
							<view class="right">
								<view class="courseComment">
									<text class="name">{{ item.user.nickname }}</text>
									<text class="time">{{ item.created_at }}</text>
								</view>
								<text class="content">{{ item.content }}</text>
							</view>
						</view>
						<view class="line"></view>
					</block>
				</view>
			</mescroll-body>
			</view>
		</view>
		<view class="buy">
			<button class="buyCourse" v-if='buyShow == 0' type="" @tap="goBuy(content.id)">购买完整教程</button>
			<button class="buyConvert" v-if='buyShow == 0' type="" @tap="convert(content.id)">兑换完整教程</button>
		</view>
		<view class="contact">
			<image src="../static/concat.png" mode=""></image>
			<button type=""  open-type="contact"></button>
		</view>
		
	</view>
</template>

<script>
const app =getApp()
import helper from '../componets/helper.js'
import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			Inv: 0,
			isSAutoplay:  false,
			curricula_id: '',
			nav: [{ navName: '课程详情' }, { navName: '课程章节' }, { navName: '课程评价' }],
			imgList: [{ img: '../static/nn.png' }, { img: '../static/nn.png' }],
			commentList:[],
			content: {},
			imgUrl: '',
			videoUrl: '',
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
			buyShow: ''
		};
	},
	onLoad(option) {
		this.imgUrl = helper.imgUrl
		this.curricula_id = option.id
		this.getList()
	},
	onShow() {
		
	},
	methods: {
		navTap(e) {
			this.Inv = e;
		},
		getList(){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${helper.requestUrl}details/curricula`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					curricula_id: this.curricula_id
				},
				success: res => {
					uni.hideLoading();
					res = helper.null2str(res.data);
					console.log(res)
					if (res.status_code == 'ok') {
						this.content = res.data;
						this.buyShow = res.is_buy
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				}
			});
		},
		convert(e){
			uni.navigateTo({
				url:`/pages/courseCode?id=${e}`
			})
		},
		// 购买课程
		goBuy(e){
			uni.navigateTo({
				url:`/pages/dataBuy?type=courseBuy&id=${e}`
			})
		},
		// 视频播放
		showVideo(id,e){
				uni.request({
					url: `${this.$helper.requestUrl}details/getVideoUrl`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data:{
						id: id
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data);
						console.log(res)
						if (res.status_code == 'ok') {
							this.isSAutoplay = true
							this.videoUrl = res.data
						} else {
							uni.showToast({
								title: res.message,
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
			this.getCommitList(page)
		},
		getCommitList(page){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}details/evaluateList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					id: this.curricula_id,
					type: 'curricula',
					page_size: page.size,
					page: page.num
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						if(res.message == '暂无信息'){
							this.commentList = []
							this.mescroll.endByPage(0, 0);
						}else{
							if (page.num == 1) this.commentList = [];
							this.commentList = this.commentList.concat(res.data.data);
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
.indexCourse {
	width: 750rpx;
	.video {
		width: 100%;
		height: 350rpx;
		video,
		image {
			width: 100%;
			height: 100%;
		}
	}
}
.detail {
	width: 690rpx;
	padding: 30rpx;
	text {
		display: block;
		color: #999999;
		font-size: 22rpx;
		margin-bottom: 16rpx;
	}
	.detailTitle {
		color: #343434;
		font-size: 30rpx;
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
.course {
	width: 750rpx;
	padding-bottom: 100rpx;
	.head {
		width: 750rpx;
		padding: 30rpx 0 0;
		display: flex;
		justify-content: space-around;
		> view {
			color: #343434;
			font-size: 30rpx;
			height: 60rpx;
			font-weight: 600;
		}
		.cur {
			color: #fe9359;
		}
	}
	.imgList {
		width: 100%;
		height: auto;
		image {
			width: 100%;
			height: auto;
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

.contList {
	width: 690rpx;
	padding: 30rpx;
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		> text {
			color: #999999;
			font-size: 24rpx;
		}
		> view {
			display: flex;
			align-items: center;
			text {
				color: #666666;
				font-size: 20rpx;
				border: 1rpx solid #dddddd;
				border-radius: 6rpx;
				padding: 1rpx 6rpx;
			}
			view {
				color: #343434;
				font-size: 28rpx;
				width: 510rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-left: 10rpx;
				font-weight: 600;
			}
		}
	}
}
.comment {
	width: 750rpx;
	padding-bottom: 110rpx;
	.item {
		width: 690rpx;
		padding: 30rpx;
		display: flex;
		align-items: flex-start;
		> image {
			width: 66rpx;
			height: 66rpx;
			border-radius: 66rpx;
			margin-right: 26rpx;
		}
		.right {
			width: 600rpx;
			text {
				display: block;
			}
			.courseComment {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.name {
				color: #565656;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.content {
				color: #898989;
				font-size: 26rpx;
				margin: 16rpx 0;
			}
			.time {
				color: #999999;
				font-size: 22rpx;
			}
		}
	}
}
.buy {
	width: 550rpx;
	padding: 26rpx 100rpx 26rpx;
	background-color: #fff;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	position: fixed;
	bottom: 0;
	left: 50%;
	margin-left: -376rpx;
	button {
		width: 230rpx;
		font-size: 24rpx;
		border-radius: 34rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
	}
	.buyCourse {
		background-color: #fe9359;
		color: #ffffff;
	}
	.buyConvert {
		border: 1rpx solid #fe9359;
		color: #fe9359;
	}
}
.contact{
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	position: fixed;
	z-index: 99;
	right: -12rpx;
	bottom: 22vh;
	image{
		width: 100%;
		height: 100%;
	}
	button{
		background: rgba($color: #000000, $alpha: 0) !important;
		width: 120rpx;
		height: 120rpx;
		border: none !important;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0;
	}
}
button::after {
	border: none;
}

</style>
