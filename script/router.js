import MinRouter from './minRouter'
// 配置路由
const router = new MinRouter({
	routes: [
		{
			"name":"move",
			"path": "pages/move/index",
			"style": {
				"navigationBarTitleText": "虚拟摇杆",
			}
		}
	]
})
export default router
