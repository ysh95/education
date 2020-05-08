import Vue from 'vue'
import App from './App'
import MescrollBody from "./componets/mescroll-uni/mescroll-body.vue"
import MescrollUni from "./componets/mescroll-uni/mescroll-uni.vue"
import helper from "componets/helper.js"

Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
Vue.config.productionTip = false

Vue.prototype.$helper = helper
App.mpType = 'app'

const app = new Vue({
    ...App
})

app.$mount()
