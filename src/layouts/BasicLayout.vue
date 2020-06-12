<template>
	<div @contextmenu.prevent="">
		<a-layout :class="['layout', device]">
			<!-- SideMenu -->
			<a-drawer
				v-if="isMobile()"
				placement="left"
				:wrapClassName="`drawer-sider ${navTheme}`"
				:closable="false"
				:visible="collapsed"
				@close="drawerClose"
			>
				<side-menu
					mode="inline"
					:menus="menus"
					:theme="navTheme"
					:collapsed="false"
					:collapsible="true"
					@menuSelect="menuSelect"
				></side-menu>
			</a-drawer>

			<side-menu
				v-else-if="isSideMenu()"
				mode="inline"
				style="position: fixed; top: 0; left: 0; z-index:999;"
				:menus="menus"
				:theme="navTheme"
				:asyncWidth="contentPaddingLeft"
				:collapsed="collapsed"
				:collapsible="true"
			></side-menu>

			<a-layout
				:class="[layoutMode, `content-width-${contentWidth}`]"
				:style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
			>
				<!-- layout header -->
				<div 
					:style="{ paddingLeft: contentPaddingLeft} "
					class="fixed-header"
				>
					<global-header
						:mode="layoutMode"
						:menus="menus"
						:theme="navTheme"
						:collapsed="collapsed"
						:device="device"
						@toggle="toggle"
					/>
				</div>

				<!-- layout content -->
				<a-layout-content
					:style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '55px' }"
				>
					<multi-tab v-if="multiTab"></multi-tab>
					<transition name="page-transition">
					<route-view/>
					</transition>
				</a-layout-content>

				<!-- <a-layout-footer>
					<global-footer />
				</a-layout-footer> -->

				<!-- Setting Drawer (show in development mode) -->
				<setting-drawer v-if="!production"></setting-drawer>
			</a-layout>
		</a-layout>

		<watermark />
		<ball></ball>
	</div>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'
import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { asyncRouterMap } from '@/router/router.config.js' // 去掉权限时添加
import Watermark from '@/components/Watermark'
import ball from '@/components/Ball/ball'

export default {
	name: 'BasicLayout',
	mixins: [mixin, mixinDevice],
	components: {
		RouteView,
		SideMenu,
		GlobalHeader,
		GlobalFooter,
		SettingDrawer,
		Watermark,
		ball
	},
	data() {
		return {
		production: config.production,
		collapsed: false,
		menus: [],
		maxMenuW: '16rem',
		minMenuW: '6rem',
		}
	},
	computed: {
		...mapState({
			// 动态主路由
			mainMenu: state => state.permission.addRouters,
			user :  state => state.user
		}),
		contentPaddingLeft() {
			// 移动端没有左侧栏，返回 0
			if (this.isMobile()) {
				return '0'
			}

			// console.log(this.$store.state.app.sidebar)
			// 收缩情况返回 6rem
			if (!this.sidebarOpened || !this.$store.state.app.sidebar) {
				return this.minMenuW
			}

			// 正常情况返回 16rem
			return this.maxMenuW
		}
	},
	watch: {
		sidebarOpened(val) {
		this.collapsed = !val
		}
	},
	created() {
		this.menus = asyncRouterMap.find(item => item.path === '/').children
		// this.menus = this.mainMenu.find(item => item.path === '/').children
		this.collapsed = !this.sidebarOpened
	},
	mounted() {
		const userAgent = navigator.userAgent
		if (userAgent.indexOf('Edge') > -1) {
		this.$nextTick(() => {
				this.collapsed = !this.collapsed
				setTimeout(() => {
					this.collapsed = !this.collapsed
				}, 45)
		})
		}
	},
	methods: {
		...mapActions(['setSidebar']),
		toggle() {
			this.collapsed = !this.collapsed
			this.setSidebar(!this.collapsed)
			triggerWindowResizeEvent()
		},
		// paddingCalc() {
		//   let left = ''
		//   if (this.sidebarOpened) {
		//     left = this.isDesktop() ? this.maxMenuW : this.minMenuW
		//   } else {
		//     left = (this.isMobile() && '0') || ((this.fixSidebar && this.minMenuW) || '0')
		//   }
		//   return left
		// },
		menuSelect() {},
		drawerClose() {
		this.collapsed = false
		}
	}
}
</script>

<style lang="less">
@import url('../styles/index.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.fixed-header{
	position: fixed;
	top:0;
	right:0;
	width:100%;
	z-index:998;
}

</style>
