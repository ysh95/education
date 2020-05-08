<template>
	<view class="classfy">
		<view class="nav">
			<scroll-view scroll-y>
				<block v-for="(item,index) in navList" :key='index'>
					<view :class="{ active: current == index }" class="navItem" @tap="getNavList(index,item.id)">
						<text>{{item.title}}</text>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="content">
			
			<scroll-view scroll-y @scrolltolower="next">
				<image class="banner" :src="imgUrl + navList[current].theme" mode=""></image>
				<view class="list">
					<block v-for="(item,index) in list" :key='index'>
						<view class="item"  @tap="getList(item.id)">
							<image :src="imgUrl + item.theme" mode=""></image>
							<text>{{item.curriculum}}</text>
						</view>
					</block>
				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				navList:[],
				imgUrl: '',
				list:[],
				current: '0',
				navId: '',
				page: '1'
			}
		},
		onLoad() {
			this.imgUrl = this.$helper.imgUrl
		},
		onShow() {
			this.list = []
			this.getNav()
		},
		methods: {
			// 选项卡
			getNavList(e,nav_id){
				console.log(e)
				this.current = e
				this.navId = nav_id
				this.list = []
				this.page = '1'
				this.getCourseList()
			},
			getNav(){
				uni.showLoading({
					title:'加载中...',
					icon: 'loading',
					duration: 2000
				})
				uni.request({
					url: `${this.$helper.requestUrl}class/video_classify`,
					method: 'GET',
					header: {
						authorization: app.globalData.token
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data)
						console.log(res,'++++++++')
						if(res.status_code == 'ok'){
							this.navList = res.data
							this.navId = res.data[0].id
							console.log(this.navId,'*********************')
							this.getCourseList()
						}
					}
				})
			},
			getCourseList(){
				console.log(this.navId,'video_id')
				uni.showLoading({
					title:'加载中...',
					icon: 'loading',
					duration: 2000
				})
				uni.request({
					url: `${this.$helper.requestUrl}class/getVideoList`,
					method: 'GET',
					header: {
						authorization: app.globalData.token
					},
					data:{
						video_id: this.navId,
						page: this.page,
						page_size: '10'
					},
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data)
						console.log(res,'++++++++')
						if(res.status_code == 'ok'){
							this.list = this.list.concat(res.data.data)
						}
					}
				})
			},
			// 跳转
			getList(e){
				console.log(e)
				uni.navigateTo({
					url: `/pages/indexCourse?id=${e}`
				})
			},
			
		},
		next(){
			this.page ++ ;
			this.getCourseList()
		}
	
	}
</script>

<style lang="scss">
page{
	background-color: #FAF9F5;
}
.classfy{
	width: 750rpx;
	height: calc(100vh - 0px);
	display: flex;
	justify-content: start;
}
.nav{
	width: 210rpx;
	text-align: center;
	line-height: 86rpx;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.nav>view{
	width: 210rpx;
	height: 86rpx;
}
.nav .navItem{
	/* content: ''; */
	/* height:20rpx; */
	border-left: 10rpx solid transparent;
	/* margin-right: 20rpx; */
}
.active{
		background-color: #FFFFFF;
}
.nav .navItem text{
	font-size: 30rpx;
	color: #343434;
}
.nav .active{
	border-left: 10rpx solid #FE9359;
	/* margin-right: 20rpx; */
}
.content{
	width: 540rpx;
	padding: 22rpx;
	background-color: #FFFFFF;
}
scroll-view {
	height: 100%;
}
.content .banner{
	width: 504rpx;
	height: 160rpx;
	border-radius: 10rpx;
}
.content .list{
	padding: 30rpx 0;
	display: flex;
	justify-content: flex-start;
	// flex: 1;
	flex-wrap: wrap;
	 // column-count: 3; //多列的列数
}
.content .list .item{
	margin:0 20rpx 20rpx 0;
	width: 240rpx;
	text{
		color: #343434;
		font-size: 28rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: block;
	}
	// display: flex;
	image{
		width: 240rpx;
		height: 148rpx;
		border-radius: 10rpx;
	}
}
.content .list .item:nth-of-type(2n){
	margin-right: 0;
}
.content .list .item .title{
	color: #343434;
	font-size: 30rpx;
}
.content .itemName{
	/* color: #666666;
	font-size: 26rpx; */
	display: flex;
	flex-wrap: wrap;
}
.content .itemName>text{
	color: #666666;
	font-size: 26rpx;
	display: block;
	margin: 26rpx 20rpx 0 0;
	border: 1rpx solid #DDDDDD;
	border-radius: 20rpx;
	padding: 4rpx 26rpx;
}
.content .itemName>text:nth-of-type(4n){
	margin-right: 0;
}
</style>
