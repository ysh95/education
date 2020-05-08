<template>
	<view class="replyMe">
		<view>
			<block v-for="(item,index) in list" :key="index">
				<view class="item">
					<text class="reply">{{item.name}}回复我： {{item.conten}}</text>
					<text>{{item.time}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{id: '1',name: '你是猪',conten: '惊雷 通天修为天塌地陷紫金锤',time: '10小时'},
					{id: '1',name: '你是猪',conten: '惊雷 通天修为天塌地陷紫金锤',time: '10小时'},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.replyMe{
	width: 690rpx;
	padding:0 30rpx;
	.item{
		width: 690rpx;
		display: flex;
		justify-content: space-between;
		border-bottom: 1rpx solid #DDDDDD;
		padding: 30rpx 0;
		text{
			color: #999999;
			font-size: 24rpx;
		}
		.reply{
			color: #343434;
			font-size: 28rpx;
			width: 580rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
