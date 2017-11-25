<template>
	<header>
		<h2><i></i>法律知识图谱后台管理中心</h2>
		<ul>
			<li class="info">信息</li>
			<li class="user">
				<el-dropdown trigger="click" @command="handleCommand">
			      <img src="../../../../assets/admin/common/userface.png" height="45" width="45" class="avator el-dropdown-link">
			      <el-dropdown-menu slot="dropdown" style="border:none;">
			        <el-dropdown-item>{{user.data.data.real_name}}</el-dropdown-item>
			        <el-dropdown-item command="logout">退出</el-dropdown-item>
			      </el-dropdown-menu>
			    </el-dropdown>
			</li>
		</ul>
	</header>
</template>

<script>
	import axios from '../../../../js/axios-api.js'
	export default{
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      	return JSON.parse(this.user.config.data).username
		    }
		},
		mounted(){
			console.log(this.user)
		},
		methods:{
			handleCommand(command){
				if(command == 'logout'){
					this.Logout();
				}
			},
			Logout(){
				axios.post(this.$store.state.LoginUrl + '/api/user/signout?axios=1')
					.then((res) => {
						// 对象清空
						this.$store.state.user = '';
						localStorage.groupId = '';
						localStorage.removeItem("access_token")
						console.log(localStorage.access_token,'logout')
						if(!localStorage.remember){
							localStorage.clear();
						}
					})
				this.$router.push('/');
			},
		}
	}
</script>

<style lang="less" scoped>
	@import './header.less';

</style>