import {json2Form} from '../static/js/util.js'

const toString = Object.prototype.toString

function isObject(value) {
	return toString.call(value) === '[object Object]'
}

function isString(value) {
	return toString.call(value) === '[object String]'
}

function isDefault(value) {
	return value === void 0
}
function openPage(args) {
	let name, query = {},
		queryStr = null,
		path, type, isName = false
	switch (true) {
		case isObject(args):
			({
				type,
				name,
				query = {}
			} = args)
			break
		case isString(args):
			name = args
			break
		default:
			throw new Error('参数必须是对象或者字符串')
	}
	if (isObject(query)) {
		queryStr = json2Form(query)
	} else {
		throw new Error('query数据必须是Object')
	}
	this.$minRouter.forEach(item => {
		if (item.name === name) {
			path = item.path
			type = type ? type : (item.type || 'navigateTo')
			isName = true
		}
	})
	if (!isName) {
		throw new Error(`没有${name}页面`)
	}
	if (!['navigateTo', 'switchTab', 'reLaunch', 'redirectTo'].includes(type)) {
		throw new Error(`name:${name}里面的type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']`)
	}
	if(queryStr) {
		path = `/${path}?${queryStr}`
	}else{
		path = `/${path}`
	}
	return new Promise((resolve, reject) => {
		uni[type]({
			url: path,
			success: resolve,
			fail: reject
		})
	})
}

function parseURL() {
	const query = this.$root.$mp.query;
	if (query) {
		return query
	} else {
		return {}
	}
}
function linkParseURL (url) {
	//#ifdef H5
	let json = {};
	let str = url.replace(/\#\//,''); //取得整个地址栏
	let urlarr = str.split('?');
	let itemKey = '';
	let itemVal = '';
	if(urlarr.length > 1) {
		let urlObj = urlarr[urlarr.length - 1].split('&') || [];
		urlObj.forEach(function(item,index){
			itemKey = decodeURIComponent(item.split('=')[0]);
			itemVal = decodeURIComponent(item.split('=')[1]);
			json[itemKey] = itemVal;
		});
	}
	return json;
	//#endif
}
function getLinkURL(options) {
	//#ifdef H5
	let href = location.href;
	if (href) {
		return linkParseURL(href)
	} else {
		return {}
	}
	//#endif
	//#ifndef H5
	if(options) {
		return options
	}else {
		return {}
	}
	//#endif
}

function install(Vue) {
	Vue.mixin({
		beforeCreate: function() {
			if (!isDefault(this.$options.minRouter)) {
				Vue._minRouter = this.$options.minRouter
			}
		}
	})
	Object.defineProperty(Vue.prototype, '$minRouter', {
		get: function() {
			return Vue._minRouter._router
		}
	})
	Object.defineProperty(Vue.prototype, '$parseURL', {
		get: function() {
			return Vue._minRouter.parseURL
		}
	})
	Object.defineProperty(Vue.prototype, '$openPage', {
		get: function() {
			return Vue._minRouter.openPage
		}
	})
	Object.defineProperty(Vue.prototype, '$getLinkURL', {
		get: function() {
			return Vue._minRouter.getLinkURL
		}
	})
}

function MinRouter(options) {
	if (!(this instanceof MinRouter)) {
		throw Error("MinRouter是一个构造函数，应该用`new`关键字调用")
	}
	isDefault(options) && (options = {})
	this.options = options
	this._router = options.routes || []
}
MinRouter.install = install
MinRouter.prototype.openPage = openPage // 路由跳转方法
MinRouter.prototype.parseURL = parseURL // h5获取参数
MinRouter.prototype.getLinkURL = getLinkURL // h5 小程序获取参数,通用此方法获取参数 ,必须传入页面入口options
export default MinRouter
