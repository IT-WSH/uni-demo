const buUrl = ''; // 配置图片路径
const color = "#999999"; // 未选中字体颜色
const selectedColor = "#333333"; // 选中字体颜色


let home_no = buUrl + 'home_no.png';
let home = buUrl + 'home.png';

let shop_no = buUrl + 'shop_no.png';
let shop = buUrl + 'shop.png';

let member_no = buUrl + 'member_no.png';
let member = buUrl + 'member.png';

export default [{
		"type": 0,
		"title": "首页",
		"href": "move",
		"color": color,
		"colorSelect": selectedColor,
		"iconType": "image",
		"icon": home_no,
		"iconSelect": home
	},
	{
		"type": 0,
		"title": "虚拟摇杆",
		"href": "move",
		"color": color,
		"colorSelect": '#cc984f',
		"iconType": "image",
		"icon": shop_no,
		"iconSelect": shop
	},
	{
		"type": 0,
		"title": "我的",
		"href": "move",
		"color": color,
		"colorSelect": '#B1B8EA',
		"iconType": "image",
		"icon": member_no,
		"iconSelect": member
	}
]
/**
const result = {
	"type": "0",
	"title": "配置标题 ",
	"href": "封装路由的名称",
	"color": "默认字体颜色 默认",
	"colorSelect":"选中字体颜色",
	"iconType": "font==>字体图标className image==>图标为图片类型 (不填默认字体图标className)",
	"icon": "默认图标",
	"theme": "1 无标题大图标样式 0 带标题普通图标样式" ,
	"iconSelect": "选中显示图标"
} */
