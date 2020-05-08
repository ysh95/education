<template>
	<view class="articleDetail">
		<view class="head">
			<text class="title">{{detail.title}}</text>
			<text>{{detail.created_at}}</text>
		</view>
		<jyf-parser class='content' :html="detail.content"></jyf-parser>
		<!-- <view class="share">
			<text>分享至 </text>
			<button type="" open-type="share"><image src="../static/wx.png" mode=""></image></button>
			<button class="friend" type="" open-type="share"><image src="../static/friend.png" mode=""></image></button>
		</view>
		<view class="line"></view> -->
		<!-- <view class="comment">
			<block v-for="(item,index) in commentList" :key="index">
				<view class="item">
					<image :src="item.img" mode=""></image>
					<view class="right">
						<text class="name">{{item.name}}</text>
						<text class="content">{{item.content}}</text>
						<text class="time">{{item.time}}</text>
					</view>
				</view>
				<view class="line"></view>
			</block>
		</view> -->
		<!-- <view class="post">
			<input type="text" value="" />
			<text>发送</text>
		</view> -->
	</view>
</template>

<script>
	import parser from '../componets/jyf-parser.vue';
	const app = getApp()
	export default {
		components:{'jyf-parser': parser},
		data() {
			return {
				detail: {},
			}
		},
		onLoad(e) {
			console.log(e.id)
			this.getDetail(e.id)
		},
		methods: {
			getDetail(id){
				uni.showLoading({
					title: "加载中...",
				})
				uni.request({
					url: `${this.$helper.requestUrl}system/getSystemMessageDetails`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: {
						id: id,
					},
					success: res => {
						uni.hideLoading()
						res = this.$helper.null2str(res.data);
						if (res.status_code == 'ok') {
							this.detail = res.data
						} else {
						
						
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
.articleDetail{
	width: 750rpx;
}
.head{
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	text{
		color: #999999;
		font-size: 24rpx;
	}
	.title{
		color: #343434;
		font-size: 32rpx;
	}
}
.content{
	width: 690rpx;
	padding: 20rpx 30rpx;
}
// .share{
// 	width: 690rpx;
// 	padding: 30rpx;
// 	color: #565656;
// 	font-size: 24rpx;
// 	display: flex;
// 	align-items: center;
// 	button{
// 		width:36rpx;
// 		height: 30rpx;
// 		border: none !important;
// 		padding: 0;
// 		margin-right: 0;
// 		margin-left: 30rpx;
// 		image{
// 			width: 100%;
// 			height: 100%;
// 			display: block;
// 		}
// 	}
// 	.friend{
// 		width: 30rpx;
// 		height: 30rpx;
// 	}
// }
uni-button:after{
	border: none;
	-webkit-transform: none;
	transform: none;
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	box-sizing: border-box;
	border-radius: 10px;
}
// .comment{
// 	width: 750rpx;
// 	padding-bottom: 110rpx;
// 	.item{
// 		width: 690rpx;
// 		padding: 30rpx;
// 		display: flex;
// 		align-items: flex-start;
// 		>image{
// 			width: 66rpx;
// 			height: 66rpx;
// 			border-radius: 66rpx;
// 			margin-right: 26rpx;
// 		}
// 		.right{
// 			width: 600rpx;
// 			text{
// 				display: block;
// 			}
// 			.name{
// 				color: #565656;
// 				font-size: 28rpx;
// 				overflow: hidden;
// 				text-overflow: ellipsis;
// 				white-space: nowrap;
// 			}
// 			.content{
// 				color: #898989;
// 				font-size: 26rpx;
// 				margin: 16rpx 0;
// 			}
// 			.time{
// 				color: #999999;
// 				font-size: 22rpx;
// 			}
// 		}
// 	}
// }
.post{
	width: 690rpx;
	padding:0 30rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 110rpx;
	input{
		width: 580rpx;
		height: 70rpx;
		border: 1rpx solid #C0C0C0;
		border-radius: 40rpx;
	}
	text{
		color: #898989;
		font-size: 32rpx;
		display: block;
		margin-right: 10rpx;
	}
}
</style>
