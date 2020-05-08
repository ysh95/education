<template>
	<view class="join">
		<image class="head" src="../static/img14.png" mode=""></image>
		<view class="tip">
			<view>
				<image src="../static/img15.png" mode=""></image>
				<text>代理权益</text>
			</view>
			<text>1.成为代理享受优惠提货价</text>
			<text>2.成为代理开通推广功能</text>
			<text>3.成为代理开通购买兑换码功能</text>
		</view>
		<view class="form">
			<view class="item">
				<label for="">手机号码</label>
				<input type="number" value="" data-name="mobile" placeholder="请输入手机号码" placeholder-class="inputC" @input="inputValue"/>
			</view>
			<view class="item">
				<label for="">微信名称</label>
				<input type="text" value="" placeholder="请输入微信名称" placeholder-class="inputC" @input="inputValue" data-name="wx_code"/>
			</view>
			<view class="itemA">
				<label for="" style="letter-spacing: 48rpx;">地区</label>
				<pickerAddress @change="goAddress">
					<view>
						<input type="text" :value="formNode.area" disabled="" placeholder="" placeholder-class="inputC"/>
						<uni-icons class="iconfont iconshixinjiantou-xiangshang-copy" type=""></uni-icons>
					</view>
				</pickerAddress>
			</view>
			<button class="submint" @tap="getJoin()">加入代理</button>
		</view>
	</view>
</template>

<script>
	const app = getApp()
import pickerAddress from '@/componets/wangding-pickerAddress.vue';
export default {
	components: {
		pickerAddress
	},
	data() {
		return {
			formNode:{
				area: '请选择地区',
				mobile: '',
				wx_code:''
			}
			
		};
	},
	methods: {
		inputValue(e){
			let formNode = this.formNode
			let name = e.currentTarget.dataset.name
			let value = e.detail.value
			formNode[name] = value
			this.formNode = formNode
		},
		// 省市区联动
		goAddress(e) {
			this.formNode.area = e.data.join('');
		},
		getJoin(){
			if(this.formNode.mobile == ''){
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
				return false
			}
			if(this.formNode.mobile.length != 11){
				uni.showToast({
					title: '请输入正确手机号',
					icon: 'none'
				})
				return false
			}
			if(this.formNode.wx_code == ''){
				uni.showToast({
					title: '请输入微信名',
					icon: 'none'
				})
				return false
			}
			if(this.formNode.area == '请选择地区'){
				uni.showToast({
					title: '请选择地址',
					icon: 'none'
				})
				return false
			}
			uni.showLoading({
				title: '加载中...',
				icon: 'none'
			})
			uni.request({
				url: `${this.$helper.requestUrl}agent/agentApply`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: this.formNode,
				success: res => {
					uni.hideLoading();
					res = this.$helper.null2str(res.data)
					if(res.status_code == 'ok'){
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
						setTimeout(() => {
							// 进入登录页
							uni.navigateBack({
								delta: 1
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
		// }
	}
};
</script>

<style lang="scss">
.join {
	width: 750rpx;
}
.head {
	width: 750rpx;
	height: 286rpx;
}
.tip {
	width: 690rpx;
	padding: 0 30rpx 20rpx;
	image {
		width: 38rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	> text {
		display: block;
		color: #676767;
		font-size: 30rpx;
		margin-bottom: 10rpx;
	}
	view {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		text {
			font-size: 32rpx;
			color: #343434;
		}
	}
}
.form {
	width: 690rpx;
	padding: 30rpx;
	border-top: 1rpx solid #dddddd;
	.itemA {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28rpx;
		label {
			color: #343434;
			font-size: 28rpx;
			font-weight: 600;
		}
		view {
			width: 490rpx;
			height: 70rpx;
			border-radius: 10rpx;
			padding: 0 20rpx;
			border: 1rpx solid #dddddd;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.iconfont {
				color: #999999;
				font-size: 20rpx;
			}
		}
	}
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28rpx;
		label {
			color: #343434;
			font-size: 28rpx;
			font-weight: 600;
		}
		.inputC {
			color: #999999;
			font-size: 28rpx;
		}
		input {
			width: 490rpx;
			height: 70rpx;
			border-radius: 10rpx;
			padding: 0 20rpx;
			border: 1rpx solid #dddddd;
		}
	}
}
.submint {
	background-color: #fe9359;
	border-radius: 40rpx;
	color: #fff;
	font-size: 28rpx;
	height: 80rpx;
	line-height: 80rpx;
	margin-top: 80rpx;
}
</style>
