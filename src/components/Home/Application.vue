<template>
	<div class="app">
		<ul>
			<li v-for="item in appList" @click.stop="showDetail(item)">
				<img :src="item.img_url" height="69" width="68" alt="">
				<p>{{item.name}}</p>
			</li>
			<li @click.stop="showAdd">
				<img src="../../assets/home/add_app.png" height="69" width="68" alt="">
			</li>
		</ul>
		<app-edit ref="appItem"></app-edit>
		<app-add ref="appAdd"></app-add>
	</div>
</template>

<script>
	import AppEdit from './AppEdit';
	import AppAdd from './AppAdd';
	import axios from '../../js/axios-api';
	export default {
		components:{AppEdit,AppAdd},
		data(){
			return {
				appList:[],
				selectApp:{},
			}
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		        return JSON.parse(this.user.config.data).username
		    },
		    groupId(){
		    	return localStorage.groupId;
		    }
		},
		created(){
			this.getAppList();
		},
		mounted(){
			
		},
		methods:{
			showDetail(appItem){
				// axios.get(this.$store.state.url1 + '/api/nlp/personal/app/user/role/list?app_id=' + appItem._id)
				// 	.then((res) => {
				// 		res.data.data.map(row => {
				// 			this.$refs.appItem.member.push(row.real_name)
				// 		});

				// 	})
					this.$refs.appItem.showDetail(appItem._id);
				
				
			},
			showAdd(){
				this.$refs.appAdd.showAdd();
			},
			getAppList(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/list?group_id=' + this.groupId)
					.then((res) => {
						this.appList = [];
						res.data.data.map(row => {
							this.appList.push({
								name:row.name,
								img_url:'http://180.96.11.69:8500'+row.img_url,
								_id:row._id,
							})
						})
						console.log(res,'777')
					})
			}
		}
	}
</script>

<style lang="less" scoped>
	.app{
		position: relative;
		padding-top: 52px;
	}
	ul{
		li{
			display: inline-block;
			width: 148px;
			height: 148px;
			background: #fff;
			border:1px solid #d9d9d9;
			text-align: center;
			line-height: 148px;
			position: relative;
			border-radius: 6px;
			cursor: pointer;
			margin-right: 80px;
			margin-bottom: 56px;
			&:hover{
				background: #f0f0f0;
			}
			img{
				vertical-align: middle;
				border-radius: 3px;
			}
			p{
				position: absolute;
				display: inline-block;
				left: 0;
				bottom: -50px;
				width: 150px;
				text-align: center;
				font-size: 16px;
				color:#091140;
				line-height: 50px;
			}
		}
	}
</style>