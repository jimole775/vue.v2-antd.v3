<template>
	<div class="user-wrapper">
		<div class="content-box">
			<h3 style="padding:0 12px;">欢迎您，{{ user.nickName }}</h3>
			<notice-icon class="action" />
		<span
			class="action ant-dropdown-link user-dropdown-menu"
			@click="handleClickLoginout"
		>
			<i class="font_family icon-ic_quit" />
		</span>
		</div>
	</div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { logout } from '@/utils/util.js'
import { mapState,mapActions, mapGetters } from 'vuex'
//elementUI和antdesignUI冲突，按需加载modal功能
import { Modal } from 'ant-design-vue'
export default {
	name: 'UserMenu',
	components: {
		NoticeIcon
	},
	computed: {
		...mapState(['user'])
	},
	methods: {
		...mapActions(['Logout']),
		handleLogout() {
		//localStorage.setItem('token', '') // 退出置为空
		//window.location.replace(process.env.VUE_APP_LOGIN_URL)
		// this.$confirm({
		//   title: '提示',
		//   content: '真的要注销登录吗 ?',
		//   onOk: () => {
		//     return this.Logout({})
		//       .then(() => {
		//         setTimeout(() => {
		//           window.location.reload()
		//         }, 16)
		//       })
		//       .catch(err => {
		//         this.$message.error({
		//           title: '错误',
		//           description: err.message
		//         })
		//       })
		//   },
		//   onCancel() {}
		// })
		},
		handleClickLoginout() {
			Modal.confirm({
				title: '提示！',
				content:'请确认是否需要退出登录?',
				onOk: () => {
					//退出登录，删除缓存后跳转到登录页面
					logout()
				},
				onCancel() {
		
				}
			});
		},
	}
}
</script>
<style lang="less" scoped>
.content-box{
  display:flex;

  .font_family{
	  font-size:30px;
  }
}
</style>
