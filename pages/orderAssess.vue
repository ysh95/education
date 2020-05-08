<template>
	<view>
		<view class="order">
			<image :src="imgUrl+order.theme" mode=""></image>
			<view class="right">
				<text class="title">{{order.title}}</text>
				<text>{{order.introduce}}</text>
			</view>
		</view>
		<view class="content">
			<textarea value="" @input="bindText" maxlength="100" placeholder="请输入您的评价，有机会被评为优质评价被更多人看到哦~" />
			<text>{{ t_length }}/100</text>
		</view>
		<view class="star">
			<text>评分</text>
			<uniRate text="1" size="14" margin="2" :value="rateValue" @change="rateChange"></uniRate>
		</view>
		<button type="" class="button" @tap="post">发布评价</button>
	</view>
</template>

<script>
	const app = getApp()
import uniRate from '@/componets/wyc-rate/uni-rate.vue';
export default {
	data() {
		return {
			t_length: 0,
			rateValue: 5,
			order: {},
			imgUrl: '',
			inputVal: ''
		};
	},
	components: { uniRate },
	onLoad(e) {
		this.imgUrl = this.$helper.imgUrl
		this.type = e.type
		let orderObj = ''
		if(e.type == 'curricula'){
			orderObj = JSON.parse(e.obj)
			this.ordernum = orderObj.ordernum
			this.order = orderObj.curricula
		}else{
			orderObj = JSON.parse(e.obj)
			this.ordernum = orderObj.ordernum
			this.order = orderObj.data
		}
	},
	methods: {
		bindText(e) {
			this.t_length = e.detail.value.length
			this.inputVal = e.detail.value
		},
		rateChange(val){
		  this.rateValue = val.value
		},
		post(){
			if(this.inputVal == ''){
				uni.showToast({
					title: '请输入评价内容',
					icon: 'none'
				})
				return false
			}
			uni.request({
				url: `${this.$helper.requestUrl}user/evaluate`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: this.type,
					ordernum: this.ordernum,
					content: this.inputVal,
					star: this.rateValue
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
						setTimeout(e => {
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.message,
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
page {
	background-color: #f0f2f6;
}
.order{
	width: 690rpx;
	padding: 30rpx;
	background-color: #FFFFFF;
	display: flex;
	justify-content: space-between;
	align-items: center;
	image{
		width: 112rpx;
		height: 94rpx;
		border-radius: 6rpx;
	}
	.right{
		width: 550rpx;
		.title{
			color: #343434;
			font-size: 28rpx;
			margin-bottom: 6rpx;
		}
		text{
			display: block;
			font-size: 24rpx;
			color: #999999;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
.star{
	width: 690rpx;
	background-color: #FFFFFF;
	padding: 30rpx;
	display: flex;
	align-items: center;
	text{
		color: #343434;
		font-size: 28rpx;
		margin-right: 18rpx;
	}
}
.content {
	width: 750rpx;
	background-color: #ffffff;
	padding-bottom: 20rpx;
	margin: 10rpx 0;
	textarea {
		width: 690rpx;
		padding: 20rpx 30rpx 0;
		color: #545454;
		font-size: 26rpx;
		font-weight: 600;
		height: 200rpx;
	}
	text{
		color: #545454;
		font-size: 28rpx;
		display: flex;
		flex-direction: row-reverse;
		margin-right: 30rpx;
	}
}

.button {
	width: 690rpx;
	margin: 100rpx auto 0;
	background-color: #fe9359;
	border-radius: 40rpx;
	font-size: 28rpx;
	color: #ffffff;
	border: none;
	font-weight: 600;
	padding: 7rpx 0;
}
button::after {
	border: none;
}
</style>
