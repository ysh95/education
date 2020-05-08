<template>
	<view class="message">
		<block v-for="(item,index) in list" :key="index">
			<view class="list" @tap="goTo(item.title)">
				<view class="itemL">
					<view class="left">
						<image :src="item.img" mode=""></image>
						<!-- <text v-if="item.num != undefined">{{item.num}}</text> -->
					</view>
					<view class="right">
						<text class="title">{{item.title}}</text>
						<text>{{item.content}}</text>
					</view>
				</view>
				<text class="time">{{item.time}}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[{
					title: '系统消息',
					img: '../static/message.png',
				},
				{
					title: '客服消息',
					img: '../static/user.png',
				},
				]
			}
		},
		methods: {
			goTo(e){
				console.log(e)
				let urlNew = ''
				if(e== '系统消息'){
					urlNew = 'systemNotice'
				}else if(e== '客服消息'){
					urlNew = 'service'
				}
				uni.navigateTo({
					url:`/pages/${urlNew}`
				})
				console.log(urlNew)
			}
		}
	}
</script>

<style lang="scss">
.message{
	width: 690rpx;
	padding: 0 30rpx;
}
.message .list{
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #DDDDDD;
	padding: 30rpx 0;
}
.message .itemL image{
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
}

.message .itemL{
	display: flex;
	.left{
		position: relative;
		>text{
			width: 26rpx;
			height: 26rpx;
			border-radius: 26rpx;
			background-color: #FF0002;
			font-size: 20rpx;
			display: block;
			color: #FFFFFF;
			text-align: center;
			line-height: 26rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
	}
	>.right{
		margin-left: 20rpx;
		display: flex;
		align-content: center;
		align-items: center;
		.title{
			color: #343434;
			font-size: 28rpx;
		}
		>text{
			display: block;
			color: #999999;
			font-size: 22rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
}
.message .list .time{
	color: #666666;
	font-size: 26rpx;
}
</style>
