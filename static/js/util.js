function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}
// 格式化时间
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
// YYYY-MM-DD
function formatDate(date) {
	var y = date.getFullYear()
	var m = date.getMonth() + 1
	m = m < 10 ? '0' + m : m
	var d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	return y + '-' + m + '-' + d
}
// 格式化日期
function dateFtt(fmt, date) { // author: meizz
	var o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	}
	return fmt
}
// 判断是支付宝还是微信浏览器
function isAlipayOrWechat() {
	//#ifdef H5
    var userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.match(/Alipay/i) == "alipay") {
        return 'alipay'
    } else if(userAgent.match(/MicroMessenger/i) == "micromessenger") {
        return 'wechat'
    } else if(userAgent.match(/jdjr/i) == "jdjr") {
		return 'jd'
	} else if(userAgent.match(/jd/i) == "jd") {
		return 'jd'
	} else if(userAgent.match(/unionpay/i) == "unionpay") {
		return 'unionpay'
	} else {
		return 'wechat'
	}
	//#endif
}
// 表单提交
function json2Form(json) {
	var str = [];
	for (var p in json) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
	}
	return str.join("&");
}

// 排序
function compare(property, type) {
	return function(a, b) {
		var value1 = a[property]
		var value2 = b[property]
		if (type === 'asc') { // 升序asc
			return value1 - value2
		} else if (type === 'desc') { // 降序desc
			return value2 - value1
		}
	}
}
module.exports = {
	formatTime,
	formatLocation,
	dateUtils,
	formatDate,
	dateFtt,
	isAlipayOrWechat,
	json2Form,
	compare,
}
