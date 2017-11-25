<template>
	<div class="login">
		<h1><img src="../../assets/login/logo.png" height="62" width="208" alt=""></h1>
		<div class="main">
			<div class="header">
				<img src="../../assets/login/logo2.png" height="53" width="208" alt="">
			</div>
			<el-form>
				<el-form-item label="用户名" class="text-input username">
					<el-input v-model="form.username" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" class="text-input password">
					<el-input type="password" @keyup.enter.native="submit('form')" v-model="form.password" placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item class="remember">
					<el-checkbox v-model="form.remember">记住密码</el-checkbox>
				</el-form-item>
				<el-form-item class="submit">
					<el-button @click="submit('form')" :loading="loading">登&nbsp;录</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div id="particles-js"></div>
	</div>
</template>

<script>
	import ParticlesJS from 'particles.js'
	import axios from 'axios';
	import axiosTo from '../../js/axios-api.js'
	
	export default {
		data(){
			return {
				form:{
					username:'',
					password:'',
					remember:true,
				},
				loading:false,
				role_type:'',
			}
		},
		mounted(){
			if(localStorage.user){
				let user = JSON.parse(localStorage.user);
				this.form.username = JSON.parse(user.config.data).username;
				if(localStorage.remember == 'true'){
					this.form.password = JSON.parse(user.config.data).password;
				}else{
					this.form.password = '';
					this.form.remember = false;
				}
			}
			
			particlesJS('particles-js', {
		      particles: {
		      number: {
		          value: 20,
		          density: {
		              enable: !0,
		              value_area: 1E3
		          }
		      },
		      color: {
		          value: "random"
		      },
		      shape: {
		          type: "circle",
		          stroke: {
		              width: 0,
		              color: "#000000"
		          },
		          polygon: {
		              nb_sides: 5
		          },
		          // image: {
		          //     src: "img/github.svg",
		          //     width: 100,
		          //     height: 100
		          // }
		      },
		      opacity: {
		          value: .5,
		          random: !1,
		          anim: {
		              enable: !1,
		              speed: 1,
		              opacity_min: .1,
		              sync: !1
		          }
		      },
		      size: {
		          value: 10,
		          random: !0,
		          anim: {
		              enable: !1,
		              speed: 180,
		              size_min: .1,
		              sync: !1
		          }
		      },
		      line_linked: {
		          enable: !0,
		          distance: 650,
		          color: "#cfcfcf",
		          opacity: .26,
		          width: 1
		      },
		      move: {
		          enable: !0,
		          speed: 2,
		          direction: "none",
		          random: !0,
		          straight: !1,
		          out_mode: "out",
		          bounce: !1,
		          attract: {
		              enable: !1,
		              rotateX: 600,
		              rotateY: 1200
		          }
		      }
		    },
		    interactivity: {
		      detect_on: "canvas",
		      events: {
		          onhover: {
		              enable: !1,
		              mode: "repulse"
		          },
		          onclick: {
		              enable: !1,
		              mode: "push"
		          },
		          resize: !0
		      },
		      modes: {
		          grab: {
		              distance: 400,
		              line_linked: {
		                  opacity: 1
		              }
		          },
		          bubble: {
		              distance: 400,
		              size: 40,
		              duration: 2,
		              opacity: 8,
		              speed: 3
		          },
		          repulse: {
		              distance: 200,
		              duration: .4
		          },
		          push: {
		              particles_nb: 4
		          },
		          remove: {
		              particles_nb: 2
		          }
		      }
		    },
		    retina_detect: true
		    })
		},

		watch:{
			'form.remember':function(val){
				localStorage.remember = val;
			}
		},
    	methods:{
    		submit(formName) {
    			this.loading = true;
    			const params = {
    				username:this[formName].username,
    				password:this[formName].password
    			}
		        axios.post(this.$store.state.LoginUrl + '/api/user/signin?axios=1',params)
		        	.then((res) => {
		        		
		        		if(res.status == 200 && res.data.code == 0){
		        			localStorage.user = JSON.stringify(res);
		        			localStorage.remember = this[formName].remember;
		        			this.$store.state.user = res;
		        			this.getCode(params.username);
		        			
		        		}else{
		        			this.$message.error(res.data.msg);
		        		}
		        	}).catch((err) => {
		        		console.log('err')
		        	})
		    },
		    getCode(username){
		    	axios.get(this.$store.state.TokenUrl + '/auth/code?client_id=nlp&username='+username)
		    		.then((res) => {
		    			this.getToken(res.data);
		    		})
		    },
		    getToken(code){
		    	axios.get(this.$store.state.url1 + '/api/nlp/personal/token?code='+code)
		    		.then((res) => {
		    			let access_token = res.data.data.access_token;
		    			// localStorage.access_token = res.data.data.access_token;
		    			localStorage.setItem("access_token",access_token);
		    			
		    			if(localStorage.access_token && localStorage.access_token != 'undefined'){
		    				console.log("access_token", localStorage.access_token);
		    				this.getRole();
		    				// this.$router.push('/index');
		    			}
		    		})
		    },
		    getRole(){
		    	const username = this.form.username;
		    	const params = {"user_name":username}
				axiosTo.get(this.$store.state.url1 + '/api/nlp/personal/user/role', {params:params})
					.then((res) => {
						// console.log(res);
						this.loading = false;
						this.role_type = res.data.data.group.role_type;
						if(this.role_type == "superuser"){
							this.$router.push('/admin');
						}else{
							this.$router.push('/index');
						}
					})
		    }

    	}
 	}
</script>

<style lang="less">
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}
	.login{
		background: url('../../assets/login/bg.png') no-repeat center;
		background-size:cover;
		width: 100%;
		height: 100%;
		position: relative;
		> h1{
			position: absolute;
			left: 5%;
			top: 46px;
			width: 90%;
			height: 62px;
			img{
				position: absolute;
				// right: 640px;
			}
		}
		.main{
			width: 400px;
			height: 450px;
			margin: 0 auto;
			position: relative;
			background: #212c68;
			border-radius: 8px;
			z-index: 1;
			top: 50%;
			-webkit-transform: translateY(-50%);
			   -moz-transform: translateY(-50%);
			    -ms-transform: translateY(-50%);
			     -o-transform: translateY(-50%);
			        transform: translateY(-50%);
			.header{
				height: 107px;
				line-height: 107px;
				text-align: center;
				img{
					vertical-align: middle;
				}
				border-bottom: 1px solid #323c71;
			}
			form{
				padding: 0 60px;
				.el-form-item{
					position: relative;
					margin-top: 25px;
					&.text-input{
						label{
							position: absolute;
							z-index: 2;
							font-size: 0;
							height: 20px;
							padding-left: 17px;
							overflow: hidden;
							background: url('../../assets/login/user.png') no-repeat center;
							top: 11px;
							left: 22px;
						}
						&.password{
							label{
								background: url('../../assets/login/password.png') no-repeat center;
							}
						}

						.el-input__inner{
							background: #212c68;
							height: 44px;
							border-radius: 44px;
							padding-left: 58px;
							font-size: 16px;
							color:#fff;
						}
					}
					&.remember{
						label{
							margin-left: 28px;
							margin-right: 4px;
							.el-checkbox__inner{
								border-color: #83b2f9;
							}
							.el-checkbox__label{
								font-size: 14px;
								color:#83b2f9;
							}
						}
					}
					&.submit{
						.el-button{
							width: 100%;
							height:44px;
							border-radius: 44px;
							border: 0 none;
							background: #318cd9;
							font-size: 16px;
							color:#fff;
						}
					}
				}
			}
			// form{
			// 	padding: 0 60px;
			// 	p{
			// 		margin-top: 25px;
			// 		position: relative;
			// 		.userName-label,.passWord-label{
			// 			position: absolute;
			// 			width: 0;
			// 			height: 20px;
			// 			padding-left: 17px;
			// 			overflow: hidden;
			// 			background: url('../../assets/login/user.png') no-repeat center;
			// 			top: 10px;
			// 			left: 22px;
			// 		}
			// 		.passWord-label{
			// 			background: url('../../assets/login/password.png') no-repeat center;
			// 		}
			// 		input{
			// 			outline: 0;
			// 		}
			// 		.text-input{
			// 			display: block;
			// 			width: 220px;
			// 			padding: 11px 0;
			// 			background: #212c68;
			// 			border: 1px solid #fff;
			// 			border-radius: 44px;
			// 			padding-left: 58px;
			// 			font-size: 16px;
			// 			color:#fff;
			// 			height: 16px;
			// 		}
			// 		&.checkbox-input{
			// 			margin: 30px 0 50px 0;
			// 			label{
			// 				font-size: 14px;
			// 				color: #83b2f9;
			// 			}
			// 			input{
			// 				display: inline-block;
			// 				vertical-align: middle;
			// 				width: 16px;
			// 				height: 16px;
			// 				margin: -2px 4px 0 23px;
			// 			}
			// 		}
			// 		&.submit-btn{
			// 			input{
			// 				position: absolute;
			// 				width: 280px;
			// 				height: 44px;
			// 				line-height: 44px;
			// 				border: 0 none;
			// 				background: #318cd9;
			// 				font-size:16px;
			// 				color:#fff;
			// 				border-radius: 44px;
			// 				cursor: pointer;
			// 			}
			// 		}
			// 	}
			// }
		}
	}
</style>
