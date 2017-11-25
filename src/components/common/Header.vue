<template>
	<div id="header">
    <span class="add-tag-fast-go" @click="buildTag"><i></i>添加标签</span>
    <span class="add-graph-fast-go" @click="buildNewGraph "><i></i>添加应用图</span>
    <span class="merge-tag-fast-go" @click="mergeTag "><i></i>合并标签</span>
		<ul class="clearfloat">
	        <!-- <li><router-link to="/home/logging">{{user.data.data.real_name}}</router-link></li> -->
	        <li @click="$router.push('/admin')">{{role_type}}</li>
	        <li @click="$router.push('/home/history')" class="info">
	        	<el-badge :value="messageLength" class="item">消息</el-badge>
	        </li>
	        <li class="dropdown">
	        	<el-dropdown trigger="click" @command="handleCommand">
			      <span class="el-dropdown-link">
			        <i class="user-icon"></i>
			      </span>
			      <el-dropdown-menu slot="dropdown" class="dropdown_menu">
			        <el-dropdown-item disabled>{{user.data.data.real_name}}</el-dropdown-item>
			        <el-dropdown-item disabled>知识图谱组</el-dropdown-item>
			        <el-dropdown-item disabled divided>知识图谱</el-dropdown-item>
			        <el-dropdown-item disabled>法策</el-dropdown-item>
			        <el-dropdown-item divided command="logging">工作记录</el-dropdown-item>
			        <el-dropdown-item command="history">历史消息</el-dropdown-item>
			        <el-dropdown-item divided>密码修改</el-dropdown-item>
			        <el-dropdown-item command="logout">退出</el-dropdown-item>
			      </el-dropdown-menu>
			    </el-dropdown>
	        </li>
	        <!-- <li @click="Logout">退出</li> -->
      	</ul>
    <el-dialog class="add_tag" :modal="add_tag_dialog" title="添加标签" v-model="build_tag">
      <div style="width: 100%; height: 30px"></div>
      <build-tag></build-tag>
      <div style="width: 100%; height: 30px"></div>
    </el-dialog>
    <el-dialog class="add_graph"
      title="新建自定义图"
      :show-close="false"
      :modal="build_graph_modal"
      :visible.sync="build_graph">
      <el-input v-model="inputGraphName" placeholder="请输入图的名字"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="build_graph = false">取 消</el-button>
        <el-button type="primary" @click="concernAddGraph">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	import buildTag from './buildTag.vue';
	export default{
		data(){
			return {
				role_type:'',
        add_tag_dialog: false,
        build_tag: false,
        build_graph: false,
        build_graph_modal: false,
        inputGraphName: ''
			}
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		        console.log(this.user.config.data);
		      	return JSON.parse(this.user.config.data).username
		    },
		    messageLength:function(){
		    	return this.$store.state.message.length;
		    }
		},
		mounted(){
			this.$nextTick(() => {
				this.getRole();
			})

		},
		methods:{
      buildTag(){
        this.build_tag = true;
      },
      buildNewGraph(){
        this.build_graph = true;
      },
      mergeTag(){
        this.$router.push('/mergetag');
      },
      concernAddGraph(){
        axios.post(this.$store.state.TagUrl + '/api/tag/graphs?name='+this.inputGraphName).then(res => {
          if(res.data.code === 0){
            this.$message.success('成功新建图！');
            this.build_graph = false;
            this.inputGraphName = '';
            location.reload();
          }else{
            this.$message.error(res.data.msg);
            this.inputGraphName = '';
          }
        });

      },
			handleCommand(command) {
		        if(command == 'logout'){
		        	this.Logout();
		        }else if(command == 'history'){
		        	this.$router.push('/home/history');
		        }else if(command == 'logging'){
		        	this.$router.push('/home/logging');
		        }
		    },
			Logout(){
				axios.post(this.$store.state.LoginUrl + '/api/user/signout?axios=1')
					.then((res) => {
						// 对象清空
						this.$store.state.user = '';
						localStorage.groupId = '';
						localStorage.removeItem("access_token")
						if(!localStorage.remember){
							localStorage.clear();
						}
					})
				this.$router.push('/');
			},
			getRole(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/user/role?user_name=' + this.username)
					.then((res) => {
						this.role_type = res.data.data.group.role_type;
					})
			}
		},
    components: {
      buildTag
    }
	}
</script>

<style lang="less">
	#header{
		background: #c7ced6;
		color:#004693;
		height: 48px;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 300;
    .add-tag-fast-go{
      height: 30px;
      width: 120px;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      color: #424f79;
      position: absolute;
      padding-top: 1px;
      left: 55px;
      top: 9px;
      border-radius: 15px;
      &:hover{
        cursor: pointer;
        background: url('../../assets/iconbj.png') center no-repeat;
      }
      >i{
        display: inline-block;
        margin-right: 10px;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        background: url('../../assets/addtag.png') no-repeat center;
      }
    }
    .add-graph-fast-go{
      height: 30px;
      width: 120px;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      color: #424f79;
      position: absolute;
      padding-top: 1px;
      left: 175px;
      top: 9px;
      border-radius: 15px;
      z-index: 3000;
      >i{
        display: inline-block;
        margin-right: 10px;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        background: url('../../assets/add-graph.png') no-repeat center;
      }
      &:hover{
        cursor: pointer;
        background: url('../../assets/iconbj.png') center no-repeat;
      }
    }
    .merge-tag-fast-go{
      height: 30px;
      width: 120px;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      color: #424f79;
      position: absolute;
      padding-top: 1px;
      left: 295px;
      top: 9px;
      border-radius: 15px;
      >i{
        display: inline-block;
        margin-right: 10px;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        background: url('../../assets/merge-tag.png') no-repeat center;
      }

      &:hover{
        cursor: pointer;
        background: url('../../assets/iconbj.png') center no-repeat;
      }
    }
		ul{
			float: right;
			font-size: 16px;
			padding-top: 16px;
			padding-right: 58px;
      position: relative;
      .user-icon{
        display: block;
        position: absolute;
        top: -25px;
        width: 39px;
        height: 39px;
        background: url('../../assets/home/member.png') center no-repeat;
      }
		}
		.info{
			padding: 0 16px;
			margin: 0 16px;
			font-size: 0;
			background: url('../../assets/tixing.png') no-repeat center;
			width: 12px;
			height: 15px;
		}
		li{
			float: left;
			cursor:pointer;
			a{
				color:#014EA1;
				&:hover{
					text-decoration: none;
				}
			}
		}
		.item {
		  margin-top: 0px;
		  sup{
			border:0 none;
			height: 14px;
			line-height: 14px;
			padding: 0 3px;
			right: -5px;
		  }
		}
    .add_tag{
      width: 100%;
      .el-dialog{
        width: 78.5%;
      }
    }
    .add_graph{
      .el-dialog{
        width: 30%;
        min-height: 200px;
        top: 20%;
        .el-dialog__body{
          width: 100%;
          height: 100px;
          .el-input{
            width: 40%;
            margin: 30px;
          }
        }
      }
    }

	}
	.dropdown_menu{
		font-size: 16px;
		width: auto;
		color: #434343;
		top: 42px !important;
		li{
			padding:0 20px;

		}
        .el-dropdown-menu__item--divided:before{
        	margin: 0 -20px;
        }
        .el-dropdown-menu__item.is-disabled{
        	color: inherit;
        }
	}
</style>
