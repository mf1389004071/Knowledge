<template>
	<div class="home">
		<div class="header">
			<div>
				<p class="head_portrait">
					<img src="../../assets/home/user.png" height="156" width="156" alt="">
					<i class="icon grouper"></i>
				</p>
				<p class="base_info">
					<span><i class="icon user_icon"></i>{{user.data.data.real_name}}</span>
					<span>
						<i class="icon group_icon"></i>
						{{groupName}}
					</span>
					<span class="app_select" @mouseover="toggle('true')">
						<!-- <i class="icon app_icon"></i> -->
						{{app_select}}
						<ul @mouseout="toggle('false')">
							<li :class="{on:item.app_name == app_select}" v-for="(item,index) in appOptions" @click="chooseApp(item,index)">{{item.app_name}}</li>
						</ul>
						<!-- <i class="icon app_icon2"></i> -->
					</span>
					<span class="modify" @click="modify_pass = true;$router.push('/home');"><i class="icon password_icon"></i><em>密码修改</em></span>
				</p>
			</div>
		</div>
		<div class="tab" v-if="!modify_pass">
			<ul class="header clearfloat">
				<li>
					<router-link to="/home/logging">工作记录</router-link>
				</li>
				<li>
					<router-link to="/home/history">消息记录</router-link>
				</li>
				<li v-if="role_type == 'admin'">
					<router-link to="/home/application">应用管理</router-link>
				</li>
				<li v-if="role_type == 'admin'">
					<router-link to="/home/member">成员管理</router-link>
				</li>
			</ul>
			<router-view>

			</router-view>
		</div>
		<div class="modify" v-if="modify_pass">
			<div class="top">
				<span><i class="icon password_icon"></i>密码修改</span>
				<span @click="modify_pass = false;$router.push('/home/logging');"><i class="icon back"></i>退出</span>
			</div>
			<div class="form">
				<h3>系统登录密码修改</h3>
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item label="旧密码" prop="oldPass" class="oldpass">
						<el-input v-model="form.oldPass" type="password" placeholder="旧密码"></el-input>
						<i class="success_icon"></i>
					</el-form-item>
				  	<el-form-item label="密码" prop="pass" class="pass">
				    	<el-input type="password" v-model="form.pass" placeholder="新密码、仅限6-18位数字、字母"></el-input>
				    	<i class="success_icon"></i>
				    </el-form-item>
				    <el-form-item label="确认密码" prop="checkPass" class="checkpass">
				    	<el-input type="password" v-model="form.checkPass" placeholder="确认新密码">
				    	</el-input>
				    	<i class="success_icon"></i>
				    </el-form-item>
				    <el-form-item>
				    	<el-button type="primary" @click="submitForm('form')">确认更改密码</el-button>
				  	</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{

		data(){
		    var checkOldPass = (rule,value,callback) => {
		    	$('.oldpass .success_icon').css('display', 'none');
		    	const oldPass = JSON.parse(this.user.config.data).password;
		    	if(value === '' || value !== oldPass){
		    		callback(new Error('请输入密码'));
		    	}else{
		    		callback();
		    		$('.oldpass .success_icon').css('display', 'block');
		    	}
		    };
		    var validatePass = (rule, value, callback) => {
		    	$('.pass .success_icon').css('display', 'none');
		        if (value === '') {
		            callback(new Error('请输入密码'));
		        } else if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value) == false) {
		        	callback(new Error('密码格式不对'))
		        	console.log(value)
		        }else{
		          if (this.form.checkPass !== '') {
		            this.$refs.form.validateField('checkPass');
		          }
		          callback();
		          $('.pass .success_icon').css('display', 'block');
		        }
		    };
		    var validatePass2 = (rule, value, callback) => {
		    	$('.checkpass .success_icon').css('display', 'none');
		        if (value === '') {
		          callback(new Error('请再次输入密码'));
		        } else if (value !== this.form.pass) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		          $('.checkpass .success_icon').css('display', 'block');
		        }
		    };
			return {
				modify_pass:false,
				form:{
					oldPass:'',
					pass:'',
					checkPass:'',
				},
		        rules: {
		        	oldPass: [
		            	{ validator: checkOldPass}
		          	],
		          	pass: [
		            	{ validator: validatePass}
		          	],
		          	checkPass: [
		            	{ validator: validatePass2}
		          	],
		        },
		        //用户所在组
		        groupName:'',
		        appOptions:[],
		        app_select:'',
		        role_type:'',
			}
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      return JSON.parse(this.user.config.data).username
		    },
		},
		mounted(){
			this.$nextTick(() => {
				this.getGroup();
			})
      		
		},
		methods:{
			// show(){
			// 	$('.app_select > ul').css('display', 'block');
			// },
			chooseApp(app,index){
				this.app_select = app.app_name;
				localStorage.app_id = app.app_id;

			},
			toggle(open){
				if(open == 'true'){
					$('.app_select > ul').css('display', 'block');
				}else{
					$('.app_select > ul').css('display', 'none');
				}
			},
			getGroup(){
        		axios.get(this.$store.state.url1 + '/api/nlp/personal/user/role?user_name='+this.username)
          			.then((res) => {
          				console.log(res,'888')
          				this.groupName = res.data.data.group.group_name;
          				this.role_type = res.data.data.group.role_type;
          				localStorage.groupId = res.data.data.group.group_id;
          				res.data.data.apps.map(row => {
          					this.appOptions.push({
          						app_id:row.app_id,
          						app_name:row.app_name
          					})
          				})
          				this.app_select = this.appOptions[0].app_name;
          				if(!localStorage.app_id){
          					this.app_select = this.appOptions[0].app_name;
          					localStorage.app_id = this.appOptions[0].app_id;
          				}else{
          					this.appOptions.filter(row => {
          						if(row.app_id == localStorage.app_id){
          							this.app_select = row.app_name;
          						}
          					})
          				}
            		// this.$store.state.group_id = '5969de92331fdb72ce6a2e33';
          		})
			},
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	const params = {
		          		old_password : this.form.oldPass,
		          		new_password : this.form.pass,
		          		username : this.username
		          	}
		            axios.put(this.$store.state.LoginUrl + '/api/user/password?axios=1',params)
		            	 .then((res) => {
		            	 	console.log(res);
		            	 })
		          } else {
		            return false;
		          }
		        });
		      },
		      resetForm(formName) {
		        this.$refs[formName].resetFields();
		      },
		},
	}
</script>

<style lang="less">
.home{
	.header{
		height: 152px;
		background: #F6F6F6;
		> div{
			width: 1180px;
			margin-left: 65px;
			height: 156px;
			line-height: 156px;
			position: relative;
			top: 55px;
			font-size: 16px;
			color:#404040;
			p{
				display: inline-block;
			}
			.base_info{
				height: 24px;
				line-height: 24px;
				vertical-align: middle;
				span{
					margin: 0 20px;
					i.icon{
						display: inline-block;
						width: 24px;
						height: 24px;
						background:url('../../assets/home/username.png') no-repeat center;
						vertical-align: middle;
						margin-right: 6px;
						margin-top: -2px;
						&.group_icon{
							background-image: url('../../assets/home/group.png');
						}
						&.password_icon{
							background-image: url('../../assets/home/password.png');
						}
						&.app_icon{
							background-image: url('../../assets/home/app_icon.png');
						}
						&.app_icon2{
							width: 14px;
							height: 14px;
							background-image: url('../../assets/home/toggle_app.png');
						}
					}
					.el-input{
						input{
							border:none;
							height: 30px;
						}
					}
				}
				.app_select{
					position: relative;
					cursor: pointer;
					padding-left: 30px;
					&::before{
						content: '';
						position: absolute;
						width: 24px;
						height: 24px;
						background: url('../../assets/home/app_icon.png') no-repeat center;
						left: 0;
					}
					&::after{
						content: '';
						position: absolute;
						width: 14px;
						height: 100%;
						background: url('../../assets/home/toggle_app.png') no-repeat center;
						right: -20px;
						top: 0px;
					}
					ul{
						position: absolute;
						left: 29px;
						border: 1px solid #d9d9d9;
						background: #fff;
						font-size: 16px;
						color: #404040;
						display: none;
						li{
							line-height: 40px;
							padding: 0 12px;
							border-top: 1px solid #d9d9d9;
							white-space: nowrap;
							margin-top: -1px;
							text-align: center;
							cursor: pointer;
							&.on{
								background:#0771e4;
								color: #fff;
							}
						}
						z-index: 2;
					}
				}
			}
			.head_portrait{
				position: relative;
				img{
					vertical-align: middle;
					border-radius: 50%;
					cursor: pointer;
				}
			}

			.modify{
				cursor: pointer;
				em{
					padding-bottom: 3px;
					border-bottom: 1px solid #8e8e8e;
				}
			}
		}
	}
	.tab{
		width: 1180px;
		margin-left: 65px;
		margin-top: 60px;
		.header{
			height: 58px;
			line-height: 58px;
			background: #F8F8F8;
			border: 1px solid #E2E2E2;
			font-size: 16px;
			li{
				float: left;
				border-right: 1px solid #E2E2E2;
				a{
					color: #848484;
					display: inline-block;
					padding: 0 25px;
					&.router-link-active{
						background: #fff;
						color:#2F86E3;
					}
				}
			}


		}
	}
	> .modify{
		width: 1180px;
		margin-left: 65px;
		margin-top: 86px;
		.top{
			display: flex;
			justify-content:space-between;
			border-bottom: 1px solid #e2e2e2;
			line-height: 24px;
			height: 24px;
			padding-bottom: 5px;
			span:first-child{
				font-size: 16px;
				color:#404040;
			}
			span:last-child{
				font-size: 18px;
				color:#9E9E9E;
				cursor: pointer;
			}
		}
		.form{
			width: 300px;
			margin: 50px auto;
			h3{
				font-size: 18px;
				color:#1D2C3C;
				font-weight: normal;
				text-align: center;
				padding-bottom: 29px;
				border-bottom: 1px solid #e9e9e9;
			}
			form{
				padding-top: 38px;
				.el-form-item{
					position: relative;

					label{
						position: absolute;
						z-index: 2;
						font-size: 0;
						width: 40px;
						height: 43px;
						background: url('../../assets/home/password_icon.png') no-repeat center;
						border-right: 1px dotted #e2e2e2;
					}
					input{
						background: #FAFAFA;
						border-color: #DDDDDD;
						border-radius: 5px;
						height: 43px;
						line-height: 43px;
						padding-left: 55px;
					}
					button{
						background: #1D89FF;
						font-size: 16px;
						color:#fff;
						width: 100%;
						height:43px;
						border:1px solid #1278E7;
						border-radius: 5px;
						margin-top: 12px;
					}
					&.oldpass{
						border-bottom: 1px dotted #ddd;
						.el-form-item__content{
							margin-bottom: 17px;
						}
					}
					.el-form-item__error{
						width: 20px;
						height: 20px;
						background: url('../../assets/home/wrong.png') no-repeat center;
						top: 10px;
						right:-30px;
						left: auto;
						font-size: 0;
					}
				}
			}
		}
	}
}
	.success_icon{
		position: absolute;
		width: 20px;
		height: 20px;
		background: url('../../assets/home/success.png') no-repeat center;
		top: 10px;
		right:-30px;
		display: none;
		-webkit-transition: all .8s ease);
		   -moz-transition: all .8s ease);
		    -ms-transition: all .8s ease);
		     -o-transition: all .8s ease);
		        transition: all .8s ease);
	}

	.icon{
		display: inline-block;
		vertical-align: middle;
		&.password_icon{
			width: 24px;
			height: 24px;
			margin: 0 4px 0 8px;
			background: url('../../assets/home/password.png') no-repeat center;
		}
		&.back{
			width: 16px;
			height: 16px;
			margin: 0 4px 0 8px;
			background: url('../../assets/home/back.png') no-repeat center;
		}
		&.grouper{
			width: 22px;
			height: 26px;
			background: url('../../assets/home/grouper.png') no-repeat center;
			position: absolute;
			right: 12px;
			top: 16px;
		}

	}

</style>
