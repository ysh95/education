<template>
	<view>
		<form bindsubmit="saveAddress">
			<view class="form">
				<view class="item">
					<label for="">收货姓名</label>
					<view>
						<input type="text" :value="address.name" data-name='name' @input="inputValue" placeholder="请输入收货人姓名" placeholder-class="inputSize"/>
						<!-- <uni-icons class="iconfont icontongxunlu" type=""></uni-icons> -->
					</view>
				</view>
				<view class="item">
					<label for="">手机号码</label>
					<view>
						<input type="number" :value="address.mobile" data-name='mobile' @input="inputValue" placeholder="请输入收货人手机号" placeholder-class="inputSize"/>
						<!-- <uni-icons class="iconfont icontongxunlu" type=""></uni-icons> -->
					</view>
				</view>
				<view class="item">
					<label for="">所在地区</label>
					<!-- <view> -->
						<pickerAddress @change="goAddress">
							<view>
								<input type="text" :value="address.area" disabled="" placeholder-class="inputSize" placeholder="请选择地区"/>
								<uni-icons class="iconfont icondingwei" type=""></uni-icons>
							</view>
							
						</pickerAddress>
				</view>
				<view class="item">
					<label for="">详细地址</label>
					<view>
						<input type="text" :value="address.details" data-name='details' @input="inputValue" placeholder="请输入详细地址" placeholder-class="inputSize"/>
						<!-- <uni-icons class="iconfont icontongxunlu" type=""></uni-icons> -->
					</view>
				</view>
				<view class="item">
					<label for="">设为默认收货地址</label>
					<!-- <view> -->
						<switch :checked="isFalse" @change="getSwitch" color="#0DB458" style="transform:scale(0.7)"/>
						<!-- <uni-icons class="iconfont icontongxunlu" type=""></uni-icons> -->
					<!-- </view> -->
				</view>
			</view>
		  <button class="weui-btn" type="" form-type="submit" @tap="getSubmint">保存</button>
		</form>
	</view>
</template>

<script>
	const app = getApp()
	import pickerAddress from '../componets/wangding-pickerAddress.vue';
	export default {
		data() {
			return {
				address: {
					area: '',
					details: '',
					mobile: '',
					name: '',
					is_default: ''
				},
				isFalse: false
				// txt: ''
			}
		},
		components: {
			pickerAddress
		},
		onLoad(option) {
			console.log(option)
			if(option.type == 2){
				this.address = JSON.parse(option.obj);
				this.address.mobile = this.address.mobile.toString() 
				if(this.address.is_default == 1){
					this.isFalse = true
				}else{
					this.isFalse = false
				}
				this.url = 'user/editAddress'
			}else{
				this.url = 'user/createAddress'
			}
			
		},
		methods: {
			inputValue(e){
				let address = this.address
				let name = e.currentTarget.dataset.name
				let value = e.detail.value
				address[name] = value
				this.address = address
				console.log(e)
			},
			// 省市区联动
			goAddress(e){
				console.log(e)
				this.address.area = e.data.join('');
			},
			getSwitch(e){
				console.log(e)
				if(e.detail.value == true){
					this.address.is_default = 1
				}else{
					this.address.is_default = 0
				}
			},
			getSubmint(){
				console.log(this.address.mobile)
				if(this.address.name == ''){
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					})
					return false
				}
				if(this.address.mobile == ''){
					uni.showToast({
						title: '请输入收件人电话',
						icon: 'none'
					})
					return false
				}
				if(this.address.mobile.length != 11){
					uni.showToast({
						title: '请输入正确电话',
						icon: 'none'
					})
					return false
				}
				if(this.address.area == ''){
					uni.showToast({
						title: '请选择地区',
						icon: 'none'
					})
					return false
				}
				if(this.address.details == ''){
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
					return false
				}
				uni.showLoading({
					title: '保存中...',
					icon: 'none'
				})
				uni.request({
					url: `${this.$helper.requestUrl}${this.url}`,
					method: 'POST',
					header: {
						authorization: app.globalData.token
					},
					data: this.address,
					success: res => {
						uni.hideLoading();
						res = this.$helper.null2str(res.data)
						console.log(res,'++++++++')
						if(res.status_code == 'ok'){
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							})
							uni.setStorageSync('address',this.address);
							setTimeout(() => {
								uni.navigateBack({
									delta:1
								})
							}, 2000)
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
						}
					}
				})
			}
	
			
		}
	}
</script>

<style lang="scss">
.form{
	width: 690rpx;
	padding: 0 30rpx;
	.item{
		width: 690rpx;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #FFDDDDDD;
		display: flex;
		justify-content: space-between;
		align-items: center;
		label{
			font-weight: 600;
			font-size: 28rpx;
			color: #545454;
		}
		view{
			width: 550rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #999999;
			font-size: 26rpx;
			.inputSize{
				color: #999999;
				font-size: 26rpx;
			}
			input{
				color: #999999;
				font-size: 26rpx;
				width: 480rpx;
			}
			.iconfont{
				font-size: 26rpx;
				color: #999999;
			}
			// background-color: #2C405A;
		}
	}
}
.weui-btn{
	width: 600rpx;
	margin: 100rpx auto 0;
	background-color: #FE9359;
	color: #fff;
	font-size: 30rpx;
	font-weight: 600;
	border: none;
	border-radius: 40rpx;
}
</style>
