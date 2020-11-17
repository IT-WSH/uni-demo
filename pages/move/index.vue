<template>
	<div class="move" @touchmove.prevent>
		<my-move @getObj="getObj" :bl="bl" :isstart="!!isStart"></my-move>
	</div>
	
</template>

<script>
	import myMove from './components/myMove.vue'
export default {
	data() {
		return {
			bl: 150, // 摇杆大全直径 (px)
			isStart: '', // 是否启动创建
		};
	},
	components:{
		myMove
	},
	onReady() {
		
	},
	methods: {
		getObj(res) {
			console.log('输出返回结果',res);
		}
	}
};
</script>

<style>
	.move {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 300rpx;
		background-color: #ffffff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
