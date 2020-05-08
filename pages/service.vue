<template>
	  <view class="containe">
	    <view class="messageList">
	      <block v-for="(item,index) in messageList" :key='index'>
	        <view class="carList" v-if="item.status=='0'">
	          <view class="top">
	            <image src='../static/kf.png'>
								<view @tap='copy(item.title)' style="max-width: 500rpx;display:inline-block;"><text style="word-break: break-all;" class="userName">{{item.title}}</text></view>
								<!-- <view style="width: 505rpx;"><text class="userName" @tap='copy(item.title)'>{{item.title}}</text></view> -->
	          </view>
	          <!-- <text class="you">{{item.content}}</text> -->
	        </view>
	        <view class="carList" v-if="item.status=='1'">
	          <view class="twoTop">
							<view style="max-width: 500rpx;display:inline-block;"><text style="word-break: break-all;" class="userName">{{item.title}}</text></view>
							<image :src="userImg" mode=""></image>
	          </view>
	          <!-- <text class="me">{{item.content}}</text> -->
	        </view>
	      </block>
	    </view>
	    <view class="send">
	      <input type="text" @input="getSetData" :value="inputValue" data-name="inputVal" placeholder="请输入...">
	      <text @tap='send'>发送</text>
	    </view>
	  </view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				messageList: [
					{title: '请输入编号获取链接',status: '0'}
				],
				userImg: '',
				inputValue: ''
			}
		},
		onLoad() {
			this.userImg = app.globalData.userInfo.avatar
		},
		methods: {
			getSetData(e){
				console.log(e)
				this.inputVal = e.detail.value;
				this.inputValue = this.inputVal
			},
			send(){
				console.log(this.inputVal)
				if(this.inputValue == ''){
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return false
				}else{
					this.item = {
						title: this.inputVal,
						status: '1'
					}
					this.messageList.push(this.item)
					this.inputValue = ''
					setTimeout(e => {
						uni.request({
							url: `${this.$helper.requestUrl}customer/getDataUrl`,
							method: 'POST',
							header: {
								authorization: app.globalData.token
							},
							data:{
								ordernum: this.inputVal
							},
							success: res => {
								res = this.$helper.null2str(res.data);
								console.log(res, '-------------------');
								if (res.status_code == 'ok') {
									this.list = {
										title: res.data,
										status: '0'
									}
									this.messageList.push(this.list)
									// this.getPay(res.data);
								} else {
									this.list = {
										title: res.message,
										status: '0'
									}
									this.messageList.push(this.list)
								}
							}
						});
					},1000)
				}
				
			},
			copy(e){
				uni.setClipboardData({
					data: e,
					success: function (res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			}
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F5F5F5;
}
.containe{
  width: 750rpx;
  padding-bottom: 100rpx;
  box-sizing: border-box;
  .carList{
    width: 670rpx;
    padding: 0 40rpx;
    margin: 20rpx 0 60rpx;
    .top{
      display: flex;
      justify-content: flex-start;
      align-content: center;
			align-content: center;
      margin-bottom: 26rpx;
      image{
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        overflow: hidden;
      }
      .userName{
        color: #343434;
        font-size: 28rpx;
        font-weight: 600;
        margin-left: 20rpx;
        display: block;
        background-color: #FFFFFF;
        padding: 18rpx 30rpx;
        display: flex;
        align-content: center;
        align-items: center;
        border-radius: 40rpx;
				// width: 505rpx;
      }
    }
    .twoTop{
      display: flex;
      justify-content: flex-end;
      align-content: flex-end;
      margin-bottom: 26rpx;
			overflow: hidden;
        image{
        width:64rpx;
        height: 64rpx;
        border-radius: 50%;
        overflow: hidden;
         margin-left: 20rpx;
				 
       }
      .userName{
        color: #343434;
        font-size: 28rpx;
        font-weight: 600;
        margin-left: 20rpx;
        display: block;
        background-color: #FFFFFF;
        padding: 18rpx 30rpx;
        display: flex;
        align-content: center;
        align-items: center;
        border-radius: 40rpx;
				white-space: pre-wrap;
      }
    }
    .me{
      font-size: 28rpx;
      color: #1F1F1F;
      display: flex;
      justify-content: flex-end;
    }
    .you{
      font-size: 28rpx;
      color: #1F1F1F;
      display: flex;
      justify-content: flex-start;
    }
    .message{
      display: flex;
      justify-content: flex-start;
      margin-left: 18rpx;
      height: 44rpx;
      line-height: 66rpx;
      align-content: flex-end;
      text{
        font-size: 22rpx;
        color: #999999;
        display: flex;
        align-content: flex-end;
      }
      .hd{
        color: #5CBCFF;
      }
      .tw{
        color: #FF4646;
      }
    }
  }
  .send{
    width: 690rpx;
    padding: 20rpx 30rpx;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-content: center;
    position: fixed;
		align-content: center;
		align-items: center;
    bottom: 0;
    left: 0;
    text{
      width: 98rpx;
      height: 60rpx;
      border: 1rpx solid #B6B6B6;
      border-radius: 10rpx;
      text-align: center;
      line-height: 60rpx;
      font-size: 26rpx;
      color: #1F1F1F;
    }
    input{
      width: 520rpx;
      padding-left: 40rpx;
    }
  }
}
</style>
