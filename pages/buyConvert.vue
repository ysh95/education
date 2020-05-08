<template>
	<view class="sale">
		<view class="head">
			<view class="headItem">
				<label for="">分类</label>
				<picker mode="selector" @change="bindPickerChange" :value="index" :data-id='object[index].id' :range="object" :range-key="'title'">
					<view class="right">
						<!-- {{object[index].title}} -->
						<view class="uni-input">{{ object[index].title }}</view>
						<uni-icons type="" class="iconfont iconshixinjiantou-xiangshang-copy"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="headItem">
				<label for="">学科</label>
				<picker @change="bindChange" :value="classIndex" :range="object[index].curriculum" :range-key="'curriculum'">
					<view class="right">
						<view class="uni-input">{{ object[index].curriculum[classIndex].curriculum }}</view>
						<uni-icons type="" class="iconfont iconshixinjiantou-xiangshang-copy"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="line"></view>
		<view class="order">
			<view class="item">
				<text>单价</text>
				<text class="price">￥{{price}}</text>
			</view>
			<view class="item">
				<text>数量</text>
				<view class="stepper">
					<!-- 减号 -->
					<text :class="minusStatus" @tap="bindMinus">-</text>
					<!-- 数值 -->
					<input type="number" @input="bindManual" v-model="num" />
					<!-- 加号 -->
					<text class="normal" @tap="bindPlus">+</text>
				</view>
			</view>
			<view class="item">
				<text>合计</text>
				<text>￥{{countPrice}}</text>
			</view>
		</view>
		<view class="line"></view>
<!-- 		<view class="item">
			<text>张三</text>
			<text>13000000000</text>
		</view> -->
		<view class="tip">
			<text>提货须知：</text>
			<text>1.提货码每件商品仅限使用一次</text>
			<text>2.提货码获取仅限平台购买，最终解释权归平台所有</text>
		</view>
		<button class="submint" type="" @tap="submintOrder">确认购买</button>
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
			num: 1,
			minusStatus: 'disabled',
			classify: [],
			price: '',
			countPrice: ''
		};
	},
	onLoad() {
		this.getObject()
		this.submintOrder= this.$helper.debounce(this.confirmPay, 1500)
	},
	methods: {
		bindPickerChange(e) {
			console.log(e.currentTarget.dataset.id)
			this.index = e.target.value;
			this.classify_id = e.currentTarget.dataset.id
			this.price = this.object[this.index].curriculum[this.classIndex].price
			this.countPrice = this.object[this.index].curriculum[this.classIndex].price
			this.id =  this.object[this.index].curriculum[this.classIndex].id
			this.num = 1
			// this.getClassify()
		},
		bindChange(e){
			console.log(e)
			this.classIndex = e.target.value;
			this.price = this.object[this.index].curriculum[this.classIndex].price
			this.countPrice = this.object[this.index].curriculum[this.classIndex].price
			this.id =  this.object[this.index].curriculum[this.classIndex].id
			this.num = 1
		},
		getObject(){
			// uni.showToast({
			// 	title: "加载中...",
			// 	icon: 'loading'
			// });
			uni.request({
				url: `${this.$helper.requestUrl}pay/classify`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					console.log(res);
					if (res.status_code == 'ok') {
						this.object = res.data
						this.price =  this.object[0].curriculum[0].price
						this.countPrice = this.object[0].curriculum[0].price
						this.id = this.object[0].curriculum[0].id
						console.log(this.id)
						this.classify_id =res.data[0].id
						// this.getClassify()
					} else {

					}
				}
			});
		},
		getClassify(){
			uni.request({
				url: `${this.$helper.requestUrl}pay/curricula`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data:{
					classify_id: this.classify_id
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res);
					if (res.status_code == 'ok') {
						this.classify = res.data
						this.price =  this.classify[0].price
						this.countPrice = this.classify[0].price
						this.id = this.classify[0].id
					} else {
			
					}
				}
			});
		},
		/* 点击减号 */

		bindMinus() {
			var num = this.num;
			// 如果大于1时，才可以减
			if (num > 1) {
				num--;
			}
			// 只有大于一件的时候，才能normal状态，否则disable状态
			var minusStatus = num <= 1 ? 'disabled' : 'normal';
			// 将数值与状态写回
			this.num = num
			this.countPrice = (num * this.price).toFixed(2)
			// console.log(parseFloat(num * this.price))
			this.minusStatus =minusStatus
		},
		/* 点击加号 */

		bindPlus() {
			var num = this.num;
			// 不作过多考虑自增1
			num++;
			// 只有大于一件的时候，才能normal状态，否则disable状态
			var minusStatus = num < 1 ? 'disabled' : 'normal';
			// 将数值与状态写回
			this.num = num
			// this.countPrice = num * this.price
			this.countPrice = (num * this.price).toFixed(2)
			// this.countPrice = num * this.priceOrder
			this.minusStatus =minusStatus
		},
		/* 输入框事件 */
		bindManual(e) {
			var num = e.detail.value;
			num.replace(/\s+/g, '')
			console.log(num)
			let reg = /^[1-9]\d*$/
			if(!reg.test(num)){
				num = '1'
			}
			this.num = num
			console.log(this.num,'*')
		},
		confirmPay(){
			uni.request({
				url: `${this.$helper.requestUrl}pay/exchangeCodePlaceOrder`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					classify_id: this.classify_id,
					curricula_id: this.id,
					num: this.num,
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '下单信息');
					// uni.hideToast()
					if (res.status_code == 'ok') {
						this.goBuy(res.data)
			
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		goBuy(orderId){
			uni.request({
				url: `${this.$helper.requestUrl}pay/pay`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					type: 'exchangeCode',
					ordernum: orderId,
					// discover_id: this.findId
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					console.log(res, '-------------------');
					uni.hideToast()
					if (res.status_code == 'ok') {
						// this.goBuy(res.data)
						this.getPay(res.data);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		getPay(payNode) {
			uni.showToast({
				title: "支付加载中...",
				icon: 'loading',
				duration: 2000
			});
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payNode.timeStamp,
				nonceStr: payNode.nonceStr,
				package: payNode.package,
				signType: payNode.signType,
				paySign: payNode.paySign,
				success: res => {
					uni.hideToast()
					res = this.$helper.null2str(res)
					console.log(res)
					// console.log('success:' + JSON.stringify(res));
					uni.showToast({
						title: "支付成功",
						icon: 'success',
						duration: 2000
					});
					// 两秒后返回上一页
					setTimeout(e => {
						uni.navigateBack({
							data: 1
						})
					}, 2000)
				},
				fail: err => {
					uni.showToast({
						title: "支付失败",
						icon: 'none',
						duration: 2000
					});
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

.item {
	width: 690rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	> text {
		color: #343434;
		font-size: 28rpx;
	}
	.price {
		color: #ff0000;
	}
}
.tip {
	width: 690rpx;
	padding: 30rpx;
	text {
		display: block;
		color: #999999;
		font-size: 26rpx;
		margin-bottom: 10rpx;
	}
}
.stepper {
	width: 160rpx;
	height: 52rpx;
	/*给主容器设一个边框*/
	border: 1rpx solid #ccc;
	border-radius: 6rpx;
	// margin: 0 auto;
}

/*加号和减号*/
.stepper text {
	width: 38rpx;
	line-height: 52rpx;
	text-align: center;
	float: left;
}

/*数值*/
.stepper input {
	width: 80rpx;
	height: 52rpx;
	float: left;
	margin: 0 auto;
	text-align: center;
	font-size: 24rpx;
	/*给中间的input设置左右边框即可*/
	border-left: 1rpx solid #ccc;
	border-right: 1rpx solid #ccc;
}

/*普通样式*/
.stepper .normal {
	color: black;
}

/*禁用样式*/
.stepper .disabled {
	color: #ccc;
}
.submint {
	font-size: 28rpx;
	color: #ffffff;
	background-color: #FE9359;
	border-radius: 40rpx;
	height: 80rpx;
	font-weight: 600;
	width: 680rpx;
	margin: 30rpx auto;
}
</style>
