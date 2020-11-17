import {json2Form} from '../static/js/util.js'
import vuex from '../vuex';
var API = {
	HOST: '',
	KEY: ''
}
// 私有函数
var api = {
	API: API
}
// 签名算法 md5 加密
function signature(postData, _timestamp) {
	const apiKey = ''
	// 排序去空
	var strParams = ''
	var newkey = Object.keys(postData).sort()
	newkey.forEach(function(item) {
		if (postData[item] && typeof postData[item] === 'object') {
			if (strParams) {
				strParams += ('&' + item + '=' + JSON.stringify(postData[item]))
			} else {
				strParams += (item + '=' + JSON.stringify(postData[item]))
			}
		} else if (postData[item]) {
			if (strParams) {
				strParams += ('&' + item + '=' + postData[item])
			} else {
				strParams += (item + '=' + postData[item])
			}
		}
	})
	// 生成字符串
	var stringSignTemp = strParams + '&key=' + apiKey + '&timestamp=' + _timestamp
	if (newkey.length === 0) stringSignTemp = 'key=' + apiKey + '&timestamp=' + _timestamp
	var MD5 = function(string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
		}

		function AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult
			lX8 = (lX & 0x80000000)
			lY8 = (lY & 0x80000000)
			lX4 = (lX & 0x40000000)
			lY4 = (lY & 0x40000000)
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
				}
			} else {
				return (lResult ^ lX8 ^ lY8)
			}
		}

		function F(x, y, z) {
			return (x & y) | ((~x) & z)
		}

		function G(x, y, z) {
			return (x & z) | (y & (~z))
		}

		function H(x, y, z) {
			return (x ^ y ^ z)
		}

		function I(x, y, z) {
			return (y ^ (x | (~z)))
		}

		function FF(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac))
			return AddUnsigned(RotateLeft(a, s), b)
		};

		function GG(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac))
			return AddUnsigned(RotateLeft(a, s), b)
		};

		function HH(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac))
			return AddUnsigned(RotateLeft(a, s), b)
		};

		function II(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac))
			return AddUnsigned(RotateLeft(a, s), b)
		};

		function ConvertToWordArray(string) {
			var lWordCount
			var lMessageLength = string.length
			var lNumberOfWordsTemp1 = lMessageLength + 8
			var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
			var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
			var lWordArray = Array(lNumberOfWords - 1)
			var lBytePosition = 0
			var lByteCount = 0
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4
				lBytePosition = (lByteCount % 4) * 8
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
				lByteCount++
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4
			lBytePosition = (lByteCount % 4) * 8
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
			return lWordArray
		}

		function WordToHex(lValue) {
			var WordToHexValue = ''
			var WordToHexValueTemp = ''
			var lByte
			var lCount
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255
				WordToHexValueTemp = '0' + lByte.toString(16)
				WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
			}
			return WordToHexValue
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, '\n')
			var utftext = ''
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n)
				if (c < 128) {
					utftext += String.fromCharCode(c)
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192)
					utftext += String.fromCharCode((c & 63) | 128)
				} else {
					utftext += String.fromCharCode((c >> 12) | 224)
					utftext += String.fromCharCode(((c >> 6) & 63) | 128)
					utftext += String.fromCharCode((c & 63) | 128)
				}
			}
			return utftext
		}
		var x = Array
		var k, AA, BB, CC, DD, a, b, c, d
		var S11 = 7
		var S12 = 12
		var S13 = 17
		var S14 = 22
		var S21 = 5
		var S22 = 9
		var S23 = 14
		var S24 = 20
		var S31 = 4
		var S32 = 11
		var S33 = 16
		var S34 = 23
		var S41 = 6
		var S42 = 10
		var S43 = 15
		var S44 = 21
		string = Utf8Encode(string)
		x = ConvertToWordArray(string)
		a = 0x67452301
		b = 0xEFCDAB89
		c = 0x98BADCFE
		d = 0x10325476
		for (k = 0; k < x.length; k += 16) {
			AA = a
			BB = b
			CC = c
			DD = d
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244)
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314)
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
			a = AddUnsigned(a, AA)
			b = AddUnsigned(b, BB)
			c = AddUnsigned(c, CC)
			d = AddUnsigned(d, DD)
		}
		var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)
		return temp.toUpperCase()
	}
	var md5 = MD5(stringSignTemp)
	return md5
}
// 共有参数
function getAction(url, _postdata,isToken) {
	var accessToken = api.storage('access_token') || ''
	// 时间戳
	var timestamp = Math.floor(new Date() / 1000)
	// 签名
	var _signature = signature(_postdata, timestamp)
	// api地址
	let myurl = API.HOST;
	let getpar = ''; 
	// 默认拼接token
	if(isToken != 1) {
		getpar = '?access_token=' + accessToken;
	}
	var apiUrl = myurl + url + getpar
	return apiUrl
}
// 调用接口
api.postJson = function(url, params, callback, isToken) {
	let options = api.storage('options') || {};
	for (let key in params) {
		// 传入的值为undefined 或者为null 则删除参数
		if ( params[key] === undefined || params[key] === null) {
			delete params[key]
		}
		params[key] = typeof(params[key]) === 'string' ? params[key].replace(/(^\s*)|(\s*$)/g, "") : params[key]
	}
	var loop_count=0;
	var apiUrl = getAction(url, params,isToken)
	var loop = function() {
		uni.request({
			url: apiUrl,
			method: 'POST',
			data: params,
			success: (res) => {
				// 接口请求成功
				if (res.data.errno == 0) {
					try {
						callback && callback(res)
					} catch (e) {
						console.log('cb error', e)
					}
					console.log('返回成功', url, res)
				}else {
					callback && callback(res)
					uni.showToast({
						title: res.data.message,
						icon: 'none'
					});
					console.log('接口错误提示-----', url, res)
				}
			},
			fail: (error) => {
				uni.hideLoading()
				console.log('e', error)
			}
		})
	}
	loop()
}
/**
 * 计算两个经纬度之间的距离, 米为单位
 */
api.getDistance = function (lat1, lng1, lat2, lng2) {
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;
    return s;
}
// 本地缓存封装
api.storage = function(key, value,expried=undefined) {
	var storage_value = {};
	var timestamp = new Date().getTime();
	var key_name = key; // 可加前缀，处理不同项目在相同目录下本地缓存key冲突
	if (value !== undefined) { 
		storage_value  = {value:value};
		if(undefined != expried){
			storage_value.expried = Number(expried) + timestamp;
		}			
		uni.setStorageSync(key_name, JSON.stringify(storage_value))
		return
	}
	// 获取参数
	try {
		storage_value = JSON.parse(uni.getStorageSync(key_name));
		value = {}
		value = storage_value.value !=undefined ? storage_value.value : storage_value;
		return value ;
	} catch (err) {
		return uni.getStorageSync(key_name)
	}
}

// 转化json格式字符串
api.jsonParse = function (key) {
	if(!key)
		return '';
	if (typeof key == 'string') {
		try {
			return JSON.parse(key);
		} catch (err) {
			return {};
		}
	} else {
		return key
	}
}
// 获取元素的属性
api.getElSize = function (id) {
	//得到元素的size
	return new Promise((res, rej) => {
		uni.createSelectorQuery()
			.select('#' + id)
			.fields(
				{
					size: true,
					scrollOffset: true
				},
				data => {
					res(data);
				}
			)
			.exec();
	});
}

// 获取手机信息 网络状态
api.getSystemInfo = function(call) {
	try {
	    var info = uni.getSystemInfoSync();
		uni.getNetworkType({
		    success: function (res) {
				if(call) {
					call({
						version: info.model + '--' + info.platform + '--' + info.version,
						network: res.networkType,
					})
				}
		    }
		});
	} catch (e) {
	    // error
	}
}
//获取日期 (距离今日多少天后的日期)
api.getDates=function(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    if (m == 0) {
        m = 12;
        y = y - 1;
    }else if (m < 10) {
        m = "0" + m;
    }
    if(d<10){
        d = "0" + d ;
    }
    return y + "-" + m + "-" + d;
}
// 获取一个月第一天和最后一天
api.getMonthFDLD=function(months) {
    var dd = new Date();
    dd.setDate(dd.getDate()); //获取AddDayCount天后的日期
    var year1 = dd.getFullYear() * 12;
    var month1 = dd.getMonth() + 1; //+months;//获取当前月份的日期

    var total = year1 + month1 + months;
    var year = parseInt(total / 12);
    var month = parseInt(total % 12);

    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var firstDay = year + "-" + month + "-" + "01"; //上个月的第一天
    var myDate = new Date(year, month, 0);
    var lastDay = year + "-" + month + "-" + myDate.getDate(); //上个月的最后一天

    var ary = [firstDay, lastDay];
    return ary;
}
api.dateFormat = function (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
	  if (!date) {
		return ''
	  }
	  if (typeof date === 'string') {
		date = new Date(date.replace(/-/g, '/'))
	  }
	  if (typeof date === 'number') {
		date = new Date(date)
	  }
	  var o = {
		'M+': date.getMonth() + 1,
		'D+': date.getDate(),
		'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
		'H+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),
		'S': date.getMilliseconds()
	  }
	  var week = {
		'0': '\u65e5',
		'1': '\u4e00',
		'2': '\u4e8c',
		'3': '\u4e09',
		'4': '\u56db',
		'5': '\u4e94',
		'6': '\u516d'
	  }
	  if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	  }
	  if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
	  }
	  for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
		  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	  }
	  return fmt
}
//时间转化 刚刚，多少分钟前， 多少小时前，多少天前，多少月前
api.dataStr = function (date, ship) {
	date = date.replace(/[-]/g, '/');
    //获取js 时间戳
    var time = new Date().getTime();
    //去掉 js 时间戳后三位，与php 时间戳保持一致
    time = parseInt((time - new Date(date)) / 1000);

    //存储转换值
    var s;
    if (time < 60 * 10) { //十分钟内
        return '刚刚';
    } else if ((time < 60 * 60) && (time >= 60 * 10)) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60);
        return s + "分钟前";
    } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60);
        return s + "小时前";
    } else if ((time < 60 * 60 * 24 * 30) && (time >= 60 * 60 * 24)) {
        //超过1天少于31天内
        s = Math.floor(time / 60 / 60 / 24);
        return s + "天前";
    } else if ((time < 60 * 60 * 24 * 30 * 12) && (time >= 60 * 60 * 24 * 30)) {
        //超过3天
        s = Math.floor(time / 60 / 60 / 24 / 30);
        return s + "月前";
    }

}

// 公共函数
export default api
