<template>
	<view class="classfyDetail">
		<block v-for="(item,index) in list" :key="index">
			<view class="item">
				<image :src="item.img" mode=""></image>
				<view class="teach">{{item.teach}}</view>
				<view class="star">
					<image src="../static/selected.png" mode=""></image>
					<image src="../static/selected.png" mode=""></image>
					<image src="../static/selected.png" mode=""></image>
					<image src="../static/selected.png" mode=""></image>
					<image src="../static/selected.png" mode=""></image>
				</view>
				<view class="price">￥{{ item.price }}</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{ teach: '陈老师语文课堂陈老师语文课堂', img: '../static/logo.png', price: '36.5' },
					{ teach: '陈老师语文课堂', img: '../static/logo.png', price: '39.5' },
					{ teach: '陈老师语文课堂', img: '../static/logo.png', price: '38.5' }
				]
			}
		},
		onLoad(e){
			console.log(e)
			uni.setNavigationBarTitle({
				title:e.title
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
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
</style>
