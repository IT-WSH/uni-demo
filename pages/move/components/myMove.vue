<template>
	<!-- 
	布局注意点
	1. 引用组件不可以用v-if动态显示
	2. 不能动态操作引入组件的位置
	3. h5平台需要组织外部页面的touchmove事件 给引入组件的父元素添加  @touchmove.prevent 即可
	因为这样会改变获取摇杆所在屏幕左上角的x，y轴 的位置，编译h5正常，app出现位置混乱情况，可以使用定位后,z-index来控制什么时候显示摇杆，什么时候隐藏 小程序平台暂时没有测试
	 -->
	<div style="position: relative;" :style="{width: josize + 'px',height: josize + 'px'}">
		<view id="canvasBox" style="width:100%;height:100%;bottom: 0;left: 0;">
			<canvas canvas-id="moveCanvas" style="width:150px;height:150px;"></canvas>
		</view>
		<!-- 兼容某些ios手机触摸在canvas上touchstart事件偶尔不触发问题 所以将触摸点移动在此处 -->
		<view style="width:100%;height:100%;position: absolute;z-index: 100;bottom: 0;left: 0;" @touchstart="moverStart" @touchmove="moveMove" @touchend="moveEnd" @touchcancel="moveEnd">
		</view>
	</div>
	
</template>
<script>
let j_bg = require('../img/j.png');
let j_play_bg = require('../img/j_play.png');
export default {
	data() {
		return {
			isStart: false,
			top: 0,// 操作杆初始位置 top
			left: 0,// 操作杆初始位置 left
			jx: 0, // 摇杆移动的x轴位置
			jy: 0, // 摇杆移动的y轴位置
			josize: 150, // 摇杆大小
			josize_bg: 120, // 摇杆背景大小
			jisize: 75, // 原点中心点大小
			centerX: 75, // 摇杆最大圈中心点x轴位置
			centerY: 75,// 摇杆最大圈中心点y轴位置
			effectiveFinger: 0, 
			jc: null // 画板 canvas画板存储
		};
	},
	props: {
		// 获取外部自定义传入摇杆最大直径
		bl: {
			default: 100
		},
		// 是否开始执行创建摇杆
		isstart: {
			default: false
		}
	},
	watch:{
		// 监听位置移动 计算需要信息 比如位置，移动距离，判断的方位仅支持上下左右
		jx(val) {
			// app画图使用这个方法 app不存在 requestAnimationFrame这个更新canvas视图的方法
			//#ifdef APP-PLUS
			this.move();
			//#endif
			let distance = Math.ceil(Math.sqrt(this.jx * this.jx + this.jy * this.jy)); // 使用沟谷定义计算摇杆移动的距离
			// 判断方位信息
			let obj = {
				angle: '', // 方向
				size: this.josize, // 返回摇杆大小
				distance: distance, // 摇杆中心按钮距离中心的的距离 绝对值
			};
			// 判断方位 bottom top right left 四个方向
			if(val > 0) {
				// 操作杆在右上、右下
				if(Math.abs(this.jy) > Math.abs(this.jx)) {
					// 右边
					if(this.jy > 0) {
						obj.angle = 'bottom';
					}else {
						obj.angle = 'top';
					}
				}else {
					// 正右方
					obj.angle = 'right';
				}
			}else if(val <= 0){
				// 操作杆在左上、左下
				if(Math.abs(this.jy) > Math.abs(this.jx)) {
					// 左边
					if(this.jy > 0) {
						obj.angle = 'bottom';
					}else {
						obj.angle = 'top';
					}
				}else {
					// 正左方
					obj.angle = 'left';
				}
			}
			let time = new Date().getTime();
			// 回调给上级页面
			this.$emit('getObj',obj);
		}
	},
	mounted() {
		// 动态计算大小
		let result = 110;
		let bls = this.bl / result;
		let size = Math.floor(100 * bls);
		if (size >= 150) {
			size = 150;
		}
		this.josize = size;
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#A7AFEA',
			animation: {
				duration: 400,
				timingFunc: 'easeIn'
			}
		})
		this.jc = uni.createCanvasContext('moveCanvas', this);
		this.getElSize('canvasBox').then(res => {
			this.top = res.top || 0;
			this.left = res.left || 0;
			this.jisize = this.josize * 0.4;
			this.josize_bg = this.josize * 0.8;
			this.centerX = this.josize / 2; //摇杆中心x坐标
			this.centerY = this.josize / 2; //摇杆中心y坐标
			//#ifdef APP-PLUS
			this.move();
			//#endif
			//#ifndef APP-PLUS
			requestAnimationFrame(this.move); //开始绘图
			//#endif
		});
	},
	methods: {
		// 获取元素的属性
		getElSize(id) {
			//得到元素的size
			return new Promise((res, rej) => {
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id).boundingClientRect(data => {
					res(data);
				}).exec();
			});
		},
		//绘图函数（绘制图形的时候就是用户观察到摇杆动了，所以取名是move）
		move() {
			this.jc.clearRect(this.centerX - this.josize / 2, this.centerY - this.josize / 2, this.josize, this.josize); //清空画板
			this.jc.drawImage(j_bg, (this.josize - this.josize_bg) / 2, (this.josize - this.josize_bg) / 2, this.josize_bg, this.josize_bg); //画底座
			// this.jc.drawImage(this.jo, this.centerX - this.josize / 2, this.centerY - this.josize / 2, this.josize, this.josize);
			this.jc.drawImage(j_play_bg, this.centerX - this.jisize / 2 + this.jx, this.centerY - this.jisize / 2 + this.jy, this.jisize, this.jisize); //画摇杆头
			this.jc.draw()
			// 非app平台支持 requestAnimationFrame app报错
			//#ifndef APP-PLUS
			requestAnimationFrame(this.move); //开始绘图
			//#endif
		},
		// 手指触摸摇杆触发
		moverStart(event) {
			event.preventDefault();
			var clientX = event.touches[this.effectiveFinger].clientX - this.left;
			var clientY = event.touches[this.effectiveFinger].clientY - this.top;
			if(clientX > 0 && clientX < this.josize && clientY > 0 && clientY < this.josize) {
				this.isStart = true;
			}else {
				// 不符合条件
				// console.log('不符合条件不能移动',clientX,clientY,this.josize);
				return;
			}
			//是否触摸点在摇杆上
			if (
				Math.sqrt(Math.pow(clientX - this.centerX, 2) + Math.pow(clientY - this.centerY, 2)) <=
				this.josize / 2 - this.jisize / 2
			) {
				this.jx = clientX - this.centerX;
				this.jy = clientY - this.centerY;
			}
			//否则计算摇杆最接近的位置
			else {
				var x = clientX,
					y = clientY,
					r = this.josize / 2 - this.jisize / 2;
				var ans = this.getPoint(this.centerX, this.centerY, r, this.centerX, this.centerY, x, y);
				//圆与直线有两个交点，计算出离手指最近的交点
				if (Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
					this.jx = ans[0] - this.centerX;
					this.jy = ans[1] - this.centerY;
				} else {
					this.jx = ans[2] - this.centerX;
					this.jy = ans[3] - this.centerY;
				}
			}
		},
		moveMove(event) {
			if(!this.isStart) {
				// 首次触摸点未在操作杆上 停止运行
				return;
			}
			var clientX = event.touches[this.effectiveFinger].clientX - this.left;
			var clientY = event.touches[this.effectiveFinger].clientY - this.top;
			//是否触摸点在摇杆上
			if (
				Math.sqrt(Math.pow(clientX - this.centerX, 2) + Math.pow(clientY - this.centerY, 2)) <=
				this.josize / 2 - this.jisize / 2
			) {
				this.jx = clientX - this.centerX;
				this.jy = clientY - this.centerY;
			}
			//否则计算摇杆最接近的位置
			else {
				var x = clientX,
					y = clientY,
					r = this.josize / 2 - this.jisize / 2;

				var ans = this.getPoint(this.centerX, this.centerY, r, this.centerX, this.centerY, x, y);
				//圆与直线有两个交点，计算出离手指最近的交点
				if (Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
					this.jx = ans[0] - this.centerX;
					this.jy = ans[1] - this.centerY;
				} else {
					this.jx = ans[2] - this.centerX;
					this.jy = ans[3] - this.centerY;
				}
			}
		},
		moveEnd(event) {
			//若手指离开,那就把内摇杆放中间
			this.jx = 0;
			this.jy = 0;
			this.isStart = false;
			this.$emit('getObj', {
				isStop: 1
			});
		},
		//计算圆于直线的交点 （有缘在分析这段是如何计算的）
		getPoint(cx, cy, r, stx, sty, edx, edy) {
			var k = (edy - sty) / (edx - stx);
			var b = edy - k * edx; 
			var x1, y1, x2, y2;
			var c = cx * cx + (b - cy) * (b - cy) - r * r;
			var a = 1 + k * k;
			var b1 = 2 * cx - 2 * k * (b - cy);
			var tmp = Math.sqrt(b1 * b1 - 4 * a * c);
			x1 = (b1 + tmp) / (2 * a);
			y1 = k * x1 + b;
			x2 = (b1 - tmp) / (2 * a);
			y2 = k * x2 + b;
			return [x1, y1, x2, y2];
		}
	}
};
</script>
