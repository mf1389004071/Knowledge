<template>
	<el-row class="admin" style="height:100%; min-width:1400px;">
		<el-col :span="4" :xs="2" :sm="3" style="min-height:100%;background:#001645;">
			<side-bar></side-bar>
		</el-col>
		<el-col :span="20" :xs="22" :sm="21" style="height:100%;overflow:auto;">
			<section>
				<common-header></common-header>
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import SideBar from '../Admin/common/Sidebar';
	import CommonHeader from '../Admin/common/Header/Header'
	export default{
		components:{SideBar,CommonHeader}
	}
</script>

<style lang="less" scoped>
</style>