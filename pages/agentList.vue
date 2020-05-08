<template>
	<view class="agentList">
		
		<view class="head">
			<text class="tel">手机号码</text>
			<text class="agent">微信号</text>
			<text class="time">加入时间</text>
		</view>
		<view class="list">
			<block v-for="(item,index) in list" :key='index'>
				<view class="item">
					<text class="tel">{{item.user.mobile}}</text>
					<text class="agent">{{item.user.nickname}}</text>
					<text class="time">{{item.created_at}}</text>
				</view>
			</block> 
			<view class="null" v-if="list == ''">
				<image src="http://www.mescroll.com/img/mescroll-empty.png?v=1" mode=""></image>
				<text>暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList(){
				uni.showLoading({
					title: "加载中..."
				});
				uni.request({
					url: `${this.$helper.requestUrl}user/myAgentList`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						uni.hideLoading()
						res = this.$helper.null2str(res.data);
						console.log(res);
						if (res.status_code == 'ok') {
							this.list = res.data
						} else {
							this.list = []
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
.agentList{
	width: 750rpx;
}
.head{
	width: 690rpx;
	display: flex;
	justify-content: space-between;
	padding: 0 30rpx;
	margin: 20rpx 0;
	text{
		display: block;
		text-align: center;
		color: #343434;
		font-size: 30rpx;
	}
}
.tel{
	width: 220rpx;
}
.agent{
	width: 220rpx;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.time{
	width: 220rpx;
}
.list{
	width: 750rpx;
	.item{
		width: 690rpx;
		padding:20rpx 30rpx;
		background-color: #F2F2F4;
		
		display: flex;
		justify-content: space-between;
		text{
			display: block;
			text-align: center;
			color: #565656;
			font-size: 28rpx;
		}
	}
	
}
.list .item:nth-of-type(2n){
	background-color: #FFFFFF;
}

.null{
	width: 690rpx;
	padding: 30rpx;
	image{
		width: 280rpx;
		height: 280rpx;
		margin: 0 auto;
		display: block;
	}
	text{
		// margin-top: 20rpx;
		font-size: 24rpx;
		color: gray;
		display: block;
		margin: 20rpx auto;
		text-align: center;

	}
}
</style>
