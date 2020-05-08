<script>
	import helper from './componets/helper.js';
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		globalData: {
			userInfo: {},
			token: ''
		},
		onLoad() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */	
	.line{
		width: 100%;
		height: 20rpx;
		background-color: #F2F1F6;
	}
	text{
		font-weight: 600;
	}
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_1741828_iw7zb4rcd.eot?t=1587610420814'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1741828_iw7zb4rcd.eot?t=1587610420814#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('//at.alicdn.com/t/font_1741828_iw7zb4rcd.woff?t=1587610420814') format('woff'),
  url('//at.alicdn.com/t/font_1741828_iw7zb4rcd.ttf?t=1587610420814') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_1741828_iw7zb4rcd.svg?t=1587610420814#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icontaoxin:before {
  content: "\e63a";
}

.iconxiaoxi:before {
  content: "\e6eb";
}

.iconcomment:before {
  content: "\e638";
}

.iconfenxiang:before {
  content: "\e7a5";
}

.icontongxunlu:before {
  content: "\e640";
}

.iconshixinjiantou-xiangshang:before {
  content: "\e659";
}

.iconshixinjiantou-xiangshang-copy:before {
  content: "\e65a";
}

.iconguanbi:before {
  content: "\e60f";
}

.icondingwei:before {
  content: "\e884";
}

.iconyoujiantou1:before {
  content: "\e628";
}

.iconshengriliwu:before {
  content: "\e653";
}

.icondkw_jifen:before {
  content: "\e60a";
}

.iconxin:before {
  content: "\e61d";
}

.iconsousuo:before {
  content: "\e636";
}

</style>
