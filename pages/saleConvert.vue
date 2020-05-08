<template>
	<view class="sale">
		<view class="head" v-show="type == '批量'">
			<view class="headItem">
				<label for="">分类</label>
				<picker mode="selector" @change="bindPickerChange" :value="index"  :range="object" :range-key="'title'">
					<view class="right">
						<!-- {{object[index].title}} -->
						<view class="uni-input">{{ object[index].title }}</view>
						<uni-icons type="" class="iconfont iconshixinjiantou-xiangshang-copy"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="headItem">
				<label for="">学科</label>
				<picker @change="bindChange" :value="classIndex" :range="classify" :range-key="'curricula'" :data-item="classify[classIndex]">
					<view class="right">
						<view class="uni-input">{{ classify[classIndex].curricula }}</view>
						<uni-icons type="" class="iconfont iconshixinjiantou-xiangshang-copy"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="line"></view>
		<view class="tel" v-show="type == '批量'">
			<view class="item">
				<label for="">账户课程码可用数量</label>
				<view class="count">{{num}}</view>
			</view>
			<view class="item">
				<label for="">输入数量</label>
				<input type="number" value="" @input="inputVal" placeholder-class="inputClass" placeholder="请输入数量" />
			</view>
		</view>
		<view class="content" v-show="type == '单个'">
			<view class="item">
				<view class="right">
					<uni-icons class="iconfont iconshengriliwu" type=""></uni-icons>
					<text>课程兑换码</text>
				</view>
				<view class="left">
					<view class="leftT">
						<text>{{orderConvert.title}}</text>
					</view>
					<view class="leftB">
						<text>课程兑换码剩余{{orderConvert.num}}次</text>
					</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="tel">
			<view class="item">
				<label for="">手机号码</label>
				<input type="number" value="" @input="telName" placeholder-class="inputClass" placeholder="请输入手机号码" />
			</view>
			<view class="item">
				<label for="">用户名</label>
				<text>{{userName}}</text>
			</view>
		</view>
		<button class="submint" type="" @tap="give">提交</button>
	</view>
</template>

<script>
	const app = getApp()
export default {
	data() {
		return {
			object: [],
			index: 0,
			classIndex: 0,
			type: '',
			orderConvert: {},
			userName: '',
			classify: [],
			num: '',
			userId: '',
			inputValNum: ''
		};
	},
	onLoad(option) {
		this.type = option.type;
		
		if(option.type == '批量'){
			this.getObject()
		}else{
			this.orderConvert = JSON.parse(option.obj)
			this.id = this.orderConvert.id
		}
	},
	methods: {
		inputVal(e){
			if( e.detail.value > this.num){
				uni.showToast({
					title: '不能大于剩余数量',
					icon: 'none'
				})
			}else if( e.detail.value < 1){
				uni.showToast({
					title: '赠送数量不能小于1',
					icon: 'none'
				})
			}
			this.inputValNum = e.detail.value
		},
		bindPickerChange(e) {
			this.index = e.target.value;
			this.classify_id = this.object[this.index].id
			this.getClassify()
		},
		bindChange(e){
			this.classIndex = e.target.value;
			this.num =  this.classify[this.classIndex].num
			console.log(this.num)
			this.id =  this.classify[this.classIndex].id
		},
		getObject(){
			uni.request({
				url: `${this.$helper.requestUrl}user/getClassifyList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.object = res.data
						this.classify_id =res.data[0].id
						this.getClassify()
					} else {
		
					}
				}
			});
		},
		getClassify(){
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/getCurriculaList`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					classify_id: this.classify_id
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.classify = res.data
						this.num =  this.classify[0].num
						this.id = this.classify[0].id
					} else {
			
					}
				}
			});
		},
		telName(e){
			console.log(e)
			this.inputVal = e.detail.value
			this.getName()
		},
		getName(){
			uni.request({
				url: `${this.$helper.requestUrl}user/getUserByMobile`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					mobile: this.inputVal
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '下单信息');
					uni.hideToast()
					if (res.status_code == 'ok') {
						this.userName = res.data.nickname
						this.userId = res.data.id
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		give(){
			if(this.type == '批量'){
				if(this.inputValNum == ''){
					uni.showToast({
						title: '请输入赠送数量',
						icon: 'none'
					})
					return false
				}
			}else{
				this.inputValNum = ''
			}
			if(this.userId == ''){
				uni.showToast({
					title: '请选择赠送用户',
					icon: 'none'
				})
				return false
			}
			uni.request({
				url: `${this.$helper.requestUrl}user/sendExchangeCode`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					uid: this.userId,
					id: this.id,
					num: this.inputValNum
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '');
					uni.hideToast()
					if (res.status_code == 'ok') {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
						setTimeout(e => {
							uni.navigateBack({
								data: 1
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
		},
		
		
	}
};
</script>

<style lang="scss">
.sale {
	width: 750rpx;
}
.head {
	width: 690rpx;
	padding: 30rpx 30rpx 0;
	.headItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #343434;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
		.right {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 540rpx;
			border: 1rpx solid #dddddd;
			border-radius: 10rpx;
			height: 70rpx;
			padding: 0 30rpx;
			.iconfont {
				font-size: 20rpx;
				color: #999999;
			}
			view {
				font-size: 28rpx;
				color: #999999;
				font-weight: 600;
			}
		}
	}
}
.content {
	width: 690rpx;
	padding: 30rpx 30rpx 30rpx;
	.item {
		width: 690rpx;
		height: 170rpx;
		margin-bottom: 30rpx;
		display: flex;
		.right {
			width: 240rpx;
			height: 170rpx;
			background-color: #fecf59;
			border-radius: 20rpx 0 0 20rpx;
			/* 相对定位，方便让before和after伪元素绝对定位偏移 */
			position: relative;
			/* 把超出div的部分隐藏起来 */
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-content: center;
			align-items: center;
			flex-wrap: wrap;
			.iconfont {
				color: #ffffff;
				font-size: 62rpx;
				margin-bottom: 10rpx;
			}
			text {
				color: #ffffff;
				font-size: 22rpx;
				text-align: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: block;
				width: 100%;
			}
		}
		.left {
			width: 401rpx;
			background-color: #ffffff;
			padding: 0 24rpx;
			height: 170rpx;
			border-radius: 0 20rpx 20rpx 0;
			.leftT {
				width: 100%;
				position: relative;
				padding: 10rpx 0 26rpx;
				text {
					color: #343434;
					font-size: 30rpx;
					margin: 20rpx 0;
					display: block;
				}
			}
			.leftB {
				height: 54rpx;
				border-top: 1rpx dashed #dddddd;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text {
					color: #999999;
					font-size: 22rpx;
				}
				.goUse {
					color: #fe9359;
				}
			}
		}
	}
}

.right:after {
	content: ' ';
	width: 0;
	height: 100%;
	/* 绝对定位进行偏移 */
	position: absolute;
	top: 14rpx;
	border-right: 14rpx dotted white;
	/* 偏移一个半径，让圆点的一半覆盖div */
	right: -7rpx;
}
// .count{
// 	width: 690rpx;
// 	padding: 0 30rpx;
// }
.tel {
	width: 690rpx;
	padding: 30rpx;

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #343434;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 30rpx;
		.count {
			width: 400rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #999999;
			font-size: 28rpx;
		}
		text {
			width: 550rpx;
			height: 70rpx;
			// padding: 2rpx 20rpx;
			line-height: 70rpx;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #999999;
			font-size: 28rpx;
		}
		input {
			width: 510rpx;
			border: 1rpx solid #dddddd;
			border-radius: 10rpx;
			padding: 2rpx 20rpx;
			height: 70rpx;
		}
		.inputClass {
			color: #999;
			font-size: 28rpx;
			font-weight: 600;
		}
	}
}

.submint {
	font-size: 28rpx;
	color: #ffffff;
	background-color: #fe9359;
	border-radius: 40rpx;
	height: 80rpx;
	font-weight: 600;
	width: 680rpx;
	margin: 30rpx auto;
}
</style>
