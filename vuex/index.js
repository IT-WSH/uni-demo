import Vue from 'vue'
import Vuex from 'vuex'
import api from '../script/api.js'
import footerJson from './footer.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	Vuex,
	state: {
		footerDate: [
			
		], // 底部配置
	},
	mutations: {

	},
	getters: {
		getColor: (state) => { // 获取当前主题颜色
			return '#ff5855'
		},
		getFooterDate: (state) => { // 获取底部配置
			let arr = [];
			let footerDate = state.footerDate;
			let footerDateStorage = api.storage('footerDate') || [];
			if(!Array.isArray(footerDate) || footerDate.length <= 0 ) {
				if(!Array.isArray(footerDateStorage) || footerDateStorage.length <= 0 ) {
					//这里获取默认配置
					arr = footerJson
				}else {
					arr = footerDateStorage;
				}
			}else {
				arr = footerDate;
			}
			return arr
		}
	}
})

Vue.use(store)
export default store
