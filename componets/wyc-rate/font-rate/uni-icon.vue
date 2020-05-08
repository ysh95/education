<template>
  <view
    :class="type"
    :style="{ color: color,'font-size': size + 'px',border:border }"
    @click="_onClick"
  />
</template>

<script>
export default {
  name: 'uniIcon',
  props: {
    type: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333333'
    },
    size: {
      type: [Number, String],
      default: 16
    }, 
	border: {
      type: String,
      default: ''
    }
  },
  methods: {
    _onClick () {
      this.$emit('click')
    }
  }
}
</script>
<style>

uni-icon {
	line-height: 1;
}

@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_1762212_pikoq431nq.eot?t=1587109312148'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1762212_pikoq431nq.eot?t=1587109312148#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAPYAAsAAAAAB+wAAAOMAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqDTIMLATYCJAMMCwgABCAFhG0HPhvZBsgekiQlQgQUWoaqIgLzFA9f+7E/d3cR0SQa6T5dJeLTaWSxVkmUzpDgfy/hDeRpGeScNNhtB2dJMacZBB1eRip7tv/P5fRGic9vWU5zDD/qBRgHFNBYmzZgXCAJesPYBS1xPYFGo56jWTW2dASYFWa3QFyTid4Ac0arNBSGeqG2YmwRr2rUp7u0A/ASfD/+kw9mkprM7Lt2auQL6P5qfbefE6oERx6CN50ZbBIZcwCFOKm07qGLonPoNKpS+ubMWkVIUwWqioCriWutPzySIGqZ+c1gCqmTi+I5TBJ/nPlXzXu4zrUoeMUbJnfPm8W8As1j76ynbUNihPIqQXxX0/D8o2i+diFC9XT2pAiutFUA1zo72PDYsaQC9KkcmFl5iC/L4nds8cxq8epXTNx3LOmoqBTAddYKw3krO1uFCO3ZD3Cl7d3Vgviq+meE8uqqLlCvbUoUX9bmFo0r7awxj54+Hykqgqs9UWfhiTMpQvW879R3rkJo7xYi9Ger8UgVBclrCOW8yKhEIIUVgaTlHP5Dz0Pt+M1P9ZsJnQRXz8NHvuVkgWUFBKqMFBfKsdQ72HyM0xsVW41bdun7z90foJ3QSqHm8H+nFjANQ9yfVIRyZGaK3pzFLZvLmruvfPtVNC0jlKP6kQb2mY7tg77n8lNdWrUT4voVKoGxzLHVE99EOzfUIWxxcJc2XQ9KzVroSid2Ov+98xeIEuMUC3CWu366/IADYYuOOTGa5lvHHpwd4AVAdW7LfEFc3s2Kv+83Bg5RfU8uzd/MTQV8zMctQHelAN1yAfUSnXk/i9expGgCU5eLwnW4hj07v3FzArK5zC8qhk4vh9t7AIk51HMehKTOCGT1xtBCnoMaTeahVr0FaDTLZHKTLig6URowIxVAaNcPSat3yNrtooV8CzV6fYZa7UEHjXaCb84mE0FmNUBhbwz2BX0iQTIUFIjYBow1LLSHiaH+3mhaEFDwMEolB0A5adl8wgQOhNEpBlDDiPIYhoAIGhQAGoPNYH//IDAYDaLAECZNwrBgdRkZpOpK0lBQAMBqBQrmDQPzBfIRCUQGCRII8SpjWAuftwcjCuXPG9pAqLLiwVBU5NpBcqTJdkBNpIGdCLdyCVUYInkYDAKEQAUJADIGZpi/FQ0CCq5uRQGDYKSRBoSDqZNB5ZCuUunl5QHvtwoamc1zpMhR1N+QA4mOgiW0yAEA') format('woff2'),
  url('//at.alicdn.com/t/font_1762212_pikoq431nq.woff?t=1587109312148') format('woff'),
  url('//at.alicdn.com/t/font_1762212_pikoq431nq.ttf?t=1587109312148') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_1762212_pikoq431nq.svg?t=1587109312148#iconfont') format('svg'); /* iOS 4.1- */
}

.uni-icon-filled {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-xingxing:before {
  content: "\e859";
}

.uni-icon-star:before {
  content: "\e60e";
}

</style>
