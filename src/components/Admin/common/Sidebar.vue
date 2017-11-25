<template>
	<div class="common-sidebar">
		<h3>南京擎盾</h3>
		<el-menu :default-active="defaultActive" router>
			<el-menu-item index="group">
				<i class="group"></i>
				小组管理
			</el-menu-item>
			<el-menu-item index="member">
				<i class="user"></i>
				用户管理
			</el-menu-item>
			<el-menu-item index="application">
				<i class="app"></i>
				应用管理
			</el-menu-item>
		</el-menu>	
	</div>
</template>

<script>
	export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
		mounted(){
			if(!$(".el-menu > .el-menu-item").first().siblings().hasClass('is-active')){
				$(".el-menu > .el-menu-item").first().addClass('is-active');
			}else{
				$(".el-menu > .el-menu-item").first().removeClass('is-active');
			}
		}
    }
</script>

<style lang="less" scoped>
	@import './sidebar.less';
</style>