<template>
	<div class="com-footer" id="vFooter">
		<div class="footer_li" v-for="(item, index) in getFooterDate" :key="index" :class="{active: index == footerIndex}" @click.stop="footerClick(index,item)">
			<div class="footer_li_img">
				<block v-if="item.iconType == 'font'">
					<text class="footerfont" v-if="index != footerIndex" :class="[item.icon]"></text>
					<text class="footerfont" v-if="index == footerIndex" :class="[item.iconSelect]" :style="'color:'+getColor"></text>
				</block>
				<block v-else>
					<img class="icon" v-if="index != footerIndex" :src="item.icon" />
					<img class="icon" v-if="index == footerIndex" :src="item.iconSelect" />
				</block>
			</div>
			<div class="footer_li_text" :style="{color: footerIndex == index ? (item.colorSelect || '#FF5855' ) : (item.color || '#999999') }">{{item.title}}</div>
		</div>
	</div>
</template>
<style scoped lang="stylus">
	@import '../../common/styl/public.styl';
	@import './footer.styl';
</style>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
    data () {
        return {
			
        }
    },
	computed: {
		...mapState({
			theme: 'iots'
		}),
		...mapGetters({
			getFooterDate: 'getFooterDate', // 底部配置数据 详情见vuex
			getColor: 'getColor' // 主题颜色
		})
	},
	props: {
		footerIndex: {
			type: Number,
			default: 0
		}
	},
    methods: {
        // 底部栏图标点击事件
        footerClick (indexs,item) {
			let urls = item.href;
			this.$openPage({
				name: urls
			})
        }
    }
 }
</script>
