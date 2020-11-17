let date = {}
// 得到今天、昨天、明天日期//dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日。
date.getDate = function (dates) {
  var dd = new Date()
  var n = dates || 0
  dd.setDate(dd.getDate() + n)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  var d = dd.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  var day = y + '-' + m + '-' + d
  return day
}
// 得到本周、上周、下周的起始、结束日期//type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
date.getMonday = function (type, dates) {
  var now = new Date()
  var nowTime = now.getTime()
  var day = now.getDay() === 0 ? 7 : now.getDay()
  var longTime = 24 * 60 * 60 * 1000
  var n = longTime * 7 * (dates || 0)
  var dd
  if (type === 's') {
    dd = nowTime - (day - 1) * longTime + n
  }
  if (type === 'e') {
    dd = nowTime + (7 - day) * longTime + n
  }
  dd = new Date(dd)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  var d = dd.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  var monday = y + '-' + m + '-' + d
  return monday
}
// 得到本月、上月、下月的起始、结束日期//type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
date.getMonth = function (type, months) {
  var d = new Date()
  var year = d.getFullYear()
  var month = d.getMonth() + 1
  if (Math.abs(months) > 12) {
    months = months % 12
  };
  if (months !== 0) {
    if (month + months > 12) {
      year++
      month = (month + months) % 12
    } else if (month + months < 1) {
      year--
      month = 12 + month + months
    } else {
      month = month + months
    }
  }
  month = month < 10 ? '0' + month : month
  var firstday = year + '-' + month + '-' + '01'
  var lastday = ''
  if (month === '01' || month === '03' || month === '05' || month === '07' || month === '08' || month === 10 || month === 12) {
    lastday = year + '-' + month + '-' + 31
  } else if (month === '02') {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
      lastday = year + '-' + month + '-' + 29
    } else {
      lastday = year + '-' + month + '-' + 28
    }
  } else {
    lastday = year + '-' + month + '-' + 30
  }
  var day = ''
  if (type === 's') {
    day = firstday
  } else {
    day = lastday
  }
  return day
}
// 得到今年、去年、明年的开始、结束日期//type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
date.getYear = function (type, dates) {
  var dd = new Date()
  var n = dates || 0
  var year = dd.getFullYear() + Number(n)
  var day
  if (type === 's') {
    day = year + '-01-01'
  }
  if (type === 'e') {
    day = year + '-12-31'
  }
  if (!type) {
    day = [year + '-01-01', year + '-12-31']
  }
  return day
}
date.timestampFormat = function (date) {
	date = date.replace(/-/g, '/')
	var timestamp = new Date(date).getTime() / 1000
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return '今天 ' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
            return '昨天 ' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
            return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}
// 传入0 获取今日的年月日，1获取明日 -1 获取昨日以此类推
date.getDateStr = function(AddDayCount){
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount);   //获取AddDayCount天后的日期
	var year = dd.getFullYear();
	var mon = dd.getMonth()+1;                             //获取当前月份的日期
	var day = dd.getDate();
	return year + '-' + ( mon < 10 ? ( '0' + mon ) : mon ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
}
export default date
