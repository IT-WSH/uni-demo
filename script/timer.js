let timer = {}
let h = '00'
let i = '00'
let s = '00'
let setTime =  null
let leftTime = 0
timer.init = function(time) {
	if(!time) {
		console.log('时间格式错误-没有时间',time);
		return false;
	}
	console.log('时间传递',time);
	var reg = /^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
	var res = time.match(reg);
	if (res == null) {
		console.log('时间格式错误-没有时间2',res);
		return false;
	} else {
		var year = parseInt(res[1]);
		if (year < 1000) {
			console.log('时间格式错误-没有时间3',year);
			return false;
		}
		var month = parseInt(res[2]);
		var day = parseInt(res[3]);
		var h = parseInt(res[4]);
		if (h < 0 || h > 24) {
			console.log('时间格式错误-没有时间4',h);
			return false;
		}
		var i = parseInt(res[5]);
		if (i < 0 || i > 60) {
			console.log('时间格式错误-没有时间5',i);
			return false;
		}
		var s = parseInt(res[6]);
		if (s < 0 || s > 60) {
			console.log('时间格式错误-没有时间6',s);
			return false;
		}
		leftTime = new Date(year, month - 1, day, h, i, s);
		timer.countDown();
		// timer.setInterValFunc();
	}
}
timer.clearTimer =  function() {
	clearInterval(setTime)
}
timer.setInterValFunc =  function() {
	setTime = setInterval(function() {
		timer.countDown();
	}, 1000);
}
timer.countDown = function() {
	let myleftTime = leftTime - new Date();
	if (myleftTime > 0) {
		var hours = parseInt(myleftTime / 1000 / 60 / 60, 10);
		var minutes = parseInt(myleftTime / 1000 / 60 % 60, 10);
		var seconds = parseInt(myleftTime / 1000 % 60, 10);
	} else {
		var hours = 0,
			minutes = 0,
			seconds = 0;
	}
	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	h = hours;
	i = minutes;
	s = seconds;
	let time = [h, i, s]
	return time
}
export default timer