<template>
	<view class="meConvert">
		<view class="nav">
			<view class="head">
				<view class="navName" :class="[Inv == 0 ? 'inv-h-se' : '']" @tap="screenShow(0)"><text>全部</text></view>
				<view class="navName" :class="[Inv == 1 ? 'inv-h-se' : '']" @tap="screenShow(1)">
					<text>{{ subject }}</text>
					<uni-icon class="iconfont iconshixinjiantou-xiangshang-copy" type=""></uni-icon>
				</view>
			</view>
		</view>
		<view class="navList" v-if="isShow" @tap="getShow">
			<view class="itemBox">
				<block v-for="(item, index) in nav" :key="index">
					<text @tap="navItem(item.title,item.id)">{{ item.title }}</text>
				</block>
			</view>
		</view>
		<view class="line" style="height: 80rpx;"></view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" @emptyclick="emptyClick">
			<view class="content">
				<block v-for="(item, index) in list" :key="index">
					<view class="item">
						<view class="right" v-if="item.num != 0">
							<uni-icons class="iconfont iconshengriliwu" type=""></uni-icons>
							<text>课程兑换码</text>
						</view>
						<view class="right" style="background-color: #E4E4E4;" v-if="item.num == 0">
							<uni-icons class="iconfont iconshengriliwu" type=""></uni-icons>
							<text>课程兑换码</text>
						</view>
						<view class="left">
							<view class="leftT">
								<!-- <radio value="cc" color="#FE7C1E" style="transform: scale(.7);" /> -->
								<text>{{ item.title }}</text>
							</view>
							<view class="leftB">
								<text>课程兑换码剩余{{item.num}}次</text>
								<text class="goUse" v-if="item.num != 0 && type != 0" @tap="goUse(item)">去赠送</text>
								<text class="goUse" v-if="item.num == 0" >已失效</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</mescroll-body>
		<view class="bottom" v-if="type != 0">
			<button type="" @tap="goBuy">购买兑换码</button>
			<button class="more" type="" @tap="goMore" v-if="list != ''">批量赠送兑换码</button>
		</view>
	</view>
</template>

<script>
const app = getApp();
import MescrollMixin from '../componets/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			subject: '科目',
			Inv: '0',
			type: '',
			isShow: false,
			nav: [],
			list: [],
			classify_id: '-1',
			downOption: {
				auto: true //是否在初始化后,自动执行downCallback; 默认true
			},
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 20 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多数据了'
			}
		};
	},
	onShow() {
		this.mescroll.resetUpScroll();
	},
	onLoad(option) {
		this.type = option.type;
	},
	methods: {
		// 选项卡
		screenShow(e) {
			this.Inv = e;
			if ((this.isShow = true)) {
				this.isShow = false;
			} else {
				this.isShow = true;
			}
			if (e != '0') {
				this.isShow = true;
			}
			if(e == '0'){
				this.classify_id = '-1'
				this.mescroll.resetUpScroll();
			}else{
				this.getNav()
			}
			
		},
		getShow() {
			this.isShow = false;
		},
		// 筛选
		navItem(e,id) {
			this.subject = e;
			this.isShow = false;
			this.classify_id = id
			this.list = []
			this.mescroll.resetUpScroll();
		},
		getNav(){
			uni.request({
				url: `${this.$helper.requestUrl}class/video_classify`,
				method: 'GET',
				header: {
					authorization: app.globalData.token
				},
				success: res => {
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						this.nav = res.data
					} else {

					}
				}
			});
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			this.getList(page);
		},
		getList(page) {
			uni.showLoading({
				title: '加载中...',
			})
			uni.request({
				url: `${this.$helper.requestUrl}user/myExchangeCode`,
				method: 'POST',
				header: {
					authorization: app.globalData.token
				},
				data: {
					classify_id: this.classify_id,
					page_size: page.size,
					page: page.num
				},
				success: res => {
					uni.hideLoading()
					res = this.$helper.null2str(res.data);
					if (res.status_code == 'ok') {
						if (res.message == '暂无信息') {
							this.list = this.list.concat([]);
							this.mescroll.endByPage(0, 0);
						} else {
							if (page.num == 1) this.list = [];
							this.list = this.list.concat(res.data.data);
							this.mescroll.endByPage(res.data.data.length, res.data.total);
						}
					} else {
						
					}
				}
			});
		},
		// 批量赠送
		goMore() {
			uni.navigateTo({
				url: `/pages/saleConvert?type=批量`
			});
		},
		// 赠送
		goUse(e) {
			uni.navigateTo({
				url: `/pages/saleConvert?type=单个&obj=${JSON.stringify(e)}`
			});
		},
		// 购买
		goBuy() {
			let grade = app.globalData.userInfo.extension
			if(grade == 2 || grade == 3){
				uni.navigateTo({
					url: `/pages/contact`
				});
			}else if(grade == 1){
				uni.navigateTo({
					url: `/pages/buyConvert`
				});
			}
		}
	}
};
</script>

<style lang="scss">
.nav {
	width: 750rpx;
}
.head {
	width: 100%;
	height: 80rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #DDDDDD;
	box-sizing: border-box;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
}
.navName {
	display: flex;
	align-items: center;
	.iconfont {
		font-size: 18rpx;
		display: block;
		color: #bbb8bb;
		margin-left: 16rpx;
	}
}
.inv-h-se {
	> text,
	.iconfont {
		color: #fe7c1e !important;
	}
}
.navName > text {
	flex: 1;
	display: flex;
	justify-content: center;
	font-size: 30rpx;
	color: #343434;
}
.navList {
	width: 750rpx;
	// padding: 30rpx;
	height: calc(100vh - 40px);
	position: absolute;
	left: 0;
	top: 80rpx;
	z-index: 9;
	background-color: rgba($color: #000000, $alpha: 0.5);
	.itemBox {
		// position: absolute;
		// top: 80rpx;
		width: 690rpx;
		background-color: #ffffff;
		padding: 0 30rpx 20rpx;
		text {
			display: block;
			color: #343434;
			font-size: 28rpx;
			padding: 20rpx 0 0 0;
		}
	}
}
.content {
	width: 690rpx;
	padding: 30rpx 30rpx 100rpx;
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

.bottom {
	width: 690rpx;
	background-color: #ffffff;
	height: 60rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	button {
		width: 300rpx;
		color: #fff;
		background-color: #ef9359;
		height: 68rpx;
		border-radius: 34rpx;
		font-size: 28rpx;
	}
	.more {
		background-color: #fff;
		color: #ef9359;
		border: 1rpx solid #ef9359;
	}
}
</style>
