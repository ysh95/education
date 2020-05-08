<template>
	<view class="changeTel">
		<view class="item">
			<label for="">+86</label>
			<input type="number" @input="inputVal" value="" placeholder="请输入手机号"/>
		</view>
		<view class="itemCode">
			<input type="number" @input="inputCode" value="" placeholder="请输入验证码"/>
			<text class="getCode" @tap="getCode">{{ time }}</text>
		</view>
		<!-- <text class="tip">温馨提示：未注册133**88888账号的手机号，登录时将自动注册</text> -->
		<button class="submint" type="" @tap="bind">确认修改</button>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				disabled: false,
				currentTime: 60, // 倒计时初始值
				time: '获取验证码',
				mobile: '',
				verification_key: ''
			}
		},
		methods: {
			inputVal(e){
				this.mobile = e.detail.value
				console.log(e)
			},
			inputCode(e){
				this.code = e.detail.value
				console.log(e)
			},
			getCode(){
				if (this.disabled) {
					return false;
				}
				if (this.mobile == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (this.mobile.length != 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				this.disabled = true;
				// this.countdown();
				// return
				uni.request({
					url: `${this.$helper.requestUrl}user/send_sms`,
					header: {
						authorization: app.globalData.token
					},
					method: 'POST',
					data: {
						mobile: this.mobile
					},
					success: res => {
						console.log(res);
						res = this.$helper.null2str(res.data);
						console.log(res,'****************')
						if (res.status_code == 'ok') {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							this.verification_key = res.data.verification_key;
							this.countdown();
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			},
			//倒计时
			countdown() {
				console.log('---------------')
				var currentTime = this.currentTime;
				this.time = `倒计时${currentTime}秒`;
				var interval = setInterval(() => {
					this.time = '倒计时' + (currentTime - 1) + '秒';
					currentTime--;
					if (currentTime <= 0) {
						clearInterval(interval);
						this.time = '重新获取';
						this.currentTime = 60;
						this.disabled = false;
					}
				}, 1000);
			},
			bind(){
				if(this.code == ''){
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				uni.request({
					url: `${this.$helper.requestUrl}user/bindMobile`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: {
						verification_key: this.verification_key,
						mobile: this.mobile,
						code: this.code
					},
					success: res => {
						res = this.$helper.null2str(res.data);
						console.log(res, '-------------------');
						if (res.status_code == 'ok') {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
							setTimeout(e =>{
								uni.navigateBack({
									data: 1
								})
							},2000)
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
	}
</script>

<style lang="scss">
.changeTel{
	width: 690rpx;
	padding: 30rpx;
}
.item{
	width: 650rpx;
	border: 1rpx solid #DDDDDD;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	height: 40rpx;
	padding: 20rpx;
	margin-bottom: 30rpx;
	label{
		font-size: 28rpx;
		color: #666666;
		border-right: 1rpx solid #DDDDDD;
		padding-right: 20rpx;
	}
	input{
		color: #BBBBBB;
		font-size: 28rpx;
		padding-left: 20rpx;
		width: 550rpx;
	}
}
.itemCode{
	width: 690rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80rpx;
	margin-bottom: 30rpx;
	input{
		height: 80rpx;
		width: 400rpx;
		border: 1rpx solid #DDDDDD;
		border-radius: 10rpx;
		padding: 0 20rpx;
		color: #BBBBBB;
		font-size: 28rpx;
	}
	.getCode{
		width: 200rpx;
		background-color: #FE9359;
		color: #FFFFFF;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
	}
}
.tip{
	color: #BBBBBB;
	font-size: 24rpx;
	font-weight: normal;
}
.submint{
	width: 690rpx;
	background-color: #FE9359;
	color: #FFFFFF;
	font-size: 28rpx;
	font-weight: 600;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30rpx;
	margin-top: 100rpx;
}
</style>
