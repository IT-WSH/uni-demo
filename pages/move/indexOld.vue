<template>
	<div @touchmove.prevent style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #f5f5f5;box-sizing: border-box;">
		<view id="canvasBox" style="width:150px;height:150px;position: fixed;bottom: 100rpx;left: 200rpx;">
			<canvas canvas-id="moveCanvas" style="width:150px;height:150px;"></canvas>
		</view>
		<view style="width:150px;height:150px;position: fixed;z-index: 100;bottom: 100rpx;left: 200rpx;" @touchstart="moverStart" @touchmove="moveMove" @touchend="moveEnd" @touchcancel="moveEnd">
		</view>
		
	</div>
	
</template>

<!-- 虚拟摇杆页面版本 组件版本在同目录index.vue -->

<script>
let j_bg = require('./img/j.png');
let j_play_bg = require('./img/j_play.png');
export default {
	data() {
		return {
			isStart: false,
			top: 0,// 操作杆初始位置 top
			left: 0,// 操作杆初始位置 left
			jx: 0,
			jy: 0,
			josize: 150,
			josize_bg: 120,
			jisize: 75,
			centerX: 75,
			centerY: 75,
			effectiveFinger: 0,
			jc: null // 画板
		};
	},
	watch:{
		jx(val) {
			// app画图使用这个方法
			//#ifdef APP-PLUS
			this.move();
			//#endif
			let distance = Math.ceil(Math.sqrt(this.jx * this.jx + this.jy * this.jy));
			// 判断方位信息
			let obj = {
				angle: '', // 方向
				size: this.josize,
				distance: distance,
			};
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
		}
	},
	onReady() {
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
			console.log(res);
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
		moverStart(event) {
			event.preventDefault();
			console.log(event);
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
		},
		//计算圆于直线的交点
		getPoint(cx, cy, r, stx, sty, edx, edy) {
			var k = (edy - sty) / (edx - stx); // 触碰位置 xy 与圆半径的差之后的比例 也就是圆心距离手指触碰y与x的比例
			var b = edy - k * edx; // 手指触摸的位置 减去 比例 乘以手指触摸的x位置
			var x1, y1, x2, y2; //定义坐标点
			var c = cx * cx + (b - cy) * (b - cy) - r * r; // 圆心坐标相乘 加上
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

<style></style>
