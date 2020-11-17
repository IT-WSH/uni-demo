import Vue from 'vue'
import App from './App'
import store from './vuex'
// 引入MinRouter文件
import MinRouter from './script/minRouter'
// 引入minRouter文件
import minRouter from './script/router'

Vue.prototype.$store = store // 导入vuex
Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(MinRouter) // 注册插件
const app = new Vue({
	store,
	minRouter,
    ...App
})
app.$mount()
