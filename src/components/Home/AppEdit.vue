<template>
	<transition name="fade">
		<div class="appItem" v-show="show">
			<div class="app-header">
				<span @click="show = false;$parent.getAppList();editshow = false;">返回列表</span>
				<h3>法律知识图标应用</h3>
				<ul v-if="!editshow">
					<li class="del" @click="del">删除应用</li>
					<li class="edit" @click="editshow = true;">修改</li>
				</ul>
				<ul v-if="editshow">
					<li class="close" @click="editshow = false;">取消</li>
					<li class="save" v-loading="loading" @click="submitUpload">保存</li>
				</ul>
			</div>
			<div class="app-content">
				<ul class="baseInfo" v-if="!editshow">
					<li>
						<img :src="`http://180.96.11.69:8500${app.img_url}`" height="69" width="68" alt="">
						<h4>{{app.name}}</h4>
					</li>
					<li>
						<span>应用英文标识</span>
						<p>{{app.encode}}</p>
					</li>
					<li>
						<span>应用简介</span>
						<p>{{app.desc}}</p>
					</li>
					<li>
						<span>创建时间</span>
						<p>{{app.time}}</p>
					</li>
					<li>
						<span>应用成员</span>
						<p>{{app.member?app.member.join("; "):''}}</p>
					</li>
				</ul>
				<ul class="editInfo" v-if="editshow">
					<li>
						<el-upload
						  class="avatar-uploader"
						  action="http://180.96.11.69:8500/api/image/list"
						  ref="upload"
						  :auto-upload="false"
						  :show-file-list="false"
						  :on-change="change"
						  :on-success="handleAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img :src="src" height="69" width="68" class="avatar">

						</el-upload>
						<input type="text" v-model="app.name">
					</li>
					<li>
						<span>应用英文标识</span>
						<p>{{app.encode}}</p>
					</li>
					<li>
						<span>应用简介</span>
						<p>
							<textarea v-model="app.desc" name="" id="" cols="30" rows="10"></textarea>
						</p>
					</li>
					<li>
						<span>创建时间</span>
						<p>{{app.time}}</p>
					</li>
					<li>
						<span>应用成员</span>
						<!-- <p>{{app.member.length?app.member.splice(";"):''}}</p>                                                    -->
					</li>
				</ul>
			</div>
		</div>
	</transition>

</template>

<script>
	import axios from '../../js/axios-api.js'
	export default{
		data(){
			return{
				show:false,
				editshow:false,
				src:'',
				// src:'',
				loading:false,
				app:{}

			}
		},
		props:{
		},
		mounted(){

		},
		methods:{
			del(){
				console.log(this.app._id,'33');
				const params = {
					group_id:this.$parent.groupId,
					user_name:this.$parent.username,
					ids:JSON.stringify([this.app._id])
				}
				this.$confirm('此操作将永久删除该知识链, 是否继续?', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		          }).then(() => {
		          		axios.delete(this.$store.state.url1 + '/api/nlp/personal/app/list?axios=1',{params})
							.then((res) => {
								this.$parent.getAppList();
								this.show = false;
								console.log(res);
							})
		          }).catch(() => {
		              this.$message.info("已取消删除");
		          });

			},
			showDetail(id){
				this.show = true;
				console.log(id);
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/user/role/list?app_id=' + id)
					.then((res) => {
						 let member = [] ;
						 res.data.data.map(row => {
						 	member.push(row.real_name)
						 })
						axios.get(this.$store.state.url1 + '/api/nlp/personal/app?ids=' + JSON.stringify([id]))
							.then((res2) => {
								res2.data.data.map(row => {
									this.app = Object.assign({},{
										name:row.name,
										desc:row.description,
										_id:row._id,
										encode:row.id,
										img_url:row.img_url,
										time:row.write_date.substring(0,10),
										member:member
									});
									this.src = 'http://180.96.11.69:8500' + this.app.img_url;
								})

								console.log(this.app,'66')
							});
					})


			},
			handleAvatarSuccess(response,file,fileList){
				console.log(response,file,fileList);

				if(response.code == 0){
					this.app.img_url = response.data[0].file_path;
					this.save();
				}
			},
			beforeAvatarUpload(file){
				console.log('66666666')
				console.log(file);
				this.loading = true;
			},
			change(file,fileList){
				console.log(4444444444)
				console.log(file,333)
				console.log(fileList,'666');
				this.src=file.url;

			},
			submitUpload(){
				console.log('00000000');

				this.$refs.upload.submit();
				if(!this.loading){
					this.loading = true;
					this.save();
				}
			},
			save(){
				const params = {
					user_name:this.$parent.username,
					_id:this.app._id,
					name:this.app.name,
					description:this.app.desc,
					img_url:this.app.img_url,
				}
				console.log(params,'7777777777777777')
				axios.put(this.$store.state.url1 + '/api/nlp/personal/app?axios=1',params)
					.then((res) => {
						if(res.data.code == 0){
							this.$parent.getAppList();
							this.show = false;
							this.loading = false;
						}else{
							this.$message.error(res.data.msg);
						}

						console.log('put结果',res);
					})
			}
		}
	}
</script>

<style lang="less" scoped>
	.fade-enter-active,.fade-leave-active{
		transition:all .4s;
	}
	.fade-enter,.fade-leave-active{
		-webkit-transform: translateX(100%);
		   -moz-transform: translateX(100%);
		    -ms-transform: translateX(100%);
		     -o-transform: translateX(100%);
		        transform: translateX(100%);
		opacity: 0;
	}
	.appItem{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		.app-header{
			display: flex;
			justify-content:space-between;
			padding: 27px 10px 17px 10px;
			border-bottom: 1px solid #e4e4e4;
			> span{
				width: 110px;
				height: 34px;
				line-height: 34px;
				background: #dfdfdf;
				border-radius: 3px;
				text-align: center;
				font-size: 16px;
				color:#545454;
				cursor: pointer;
				&::before{
					content: '';
					display: inline-block;
					width: 8px;
					height: 14px;
					vertical-align: middle;
					margin-right: 12px;
					background: url('../../assets/home/app_back.png') no-repeat center;
				}
			}
			> h3{
				font-size: 18px;
				color:#091140;
				font-weight: normal;
				line-height: 34px;
			}
			> ul{
				display: flex;
				justify-content:space-between;
				font-size: 16px;
				color: #737373;
				line-height: 34px;
				li{
					margin-left: 30px;
					cursor: pointer;
					&::before{
						content: '';
						display: inline-block;
						width: 16px;
						height: 16px;
						background: url('../../assets/home/deletehover.png') no-repeat center;
						vertical-align: middle;
						margin-right: 6px;
					}
					&.del{
						&::before{
							background: url('../../assets/home/delete.png') no-repeat center;
						}
						&:hover{
							&::before{
								background-image: url('../../assets/home/deletehover.png');
							}
						}
					}
					&.edit{
						&::before{
							background: url('../../assets/home/edit.png') no-repeat center;
						}
						&:hover{
							&::before{
								background-image: url('../../assets/home/edithover.png');
							}
						}
					}
					&.close{
						&::before{
							background: url('../../assets/home/close1.png') no-repeat center;
						}
						&:hover{
							&::before{
								background-image: url('../../assets/home/closehover.png');
							}
						}
					}
					&:hover{
						color:#006de3;
					}
					&.save{
						color:#4c9a00;
						&::before{
							background: url('../../assets/home/save.png') no-repeat center;
						}
					}
				}

			}
		}
		.app-content{
			width: 530px;
			margin: 50px auto 0;
			.baseInfo{
				> li{
					display: flex;
					jusitify-content:space-between;
					font-size: 16px;
					margin-bottom: 10px;
					&:first-child{
						margin-bottom: 48px;
						padding-left: 30px;
					}
					img{
						width: 68px;
						height: 69px;
						border-radius: 3px;
					}
					h4{
						flex:1;
						margin-left: 50px;
						font-size: 18px;
						color:#091140;
						font-weight: normal;
						line-height: 69px;
					}
					span{
						color:#989898;
						width: 100px;
						text-align: right;
						line-height: 28px;
					}
					p{
						flex:1;
						margin-left: 23px;
						color:#343434;
						line-height: 28px;
					}
				}
			}
			.editInfo{
				> li{
					display: flex;
					jusitify-content:space-between;
					font-size: 16px;
					margin-bottom: 10px;
					&:first-child{
						margin-bottom: 48px;
						padding-left: 30px;
						input{
							height: 42px;
							width: 100%;
							margin-left: 24px;
							text-indent: 1em;
							margin-top: 12px;
							font-size: 18px;
							color:#848484;
							background: #f6f6f6;
							outline: 0 none;
							border:1px solid #bcb8b8;
							&:focus{
								border-color: #5cbb00;
							}
						}
					}
					textarea{
						width: 100%;
						border:1px solid #bcb8b8;
						background: #f6f6f6;
						box-sizing: border-box;
						line-height: 28px;
						outline: 0 none;
						padding: 0px 20px;
						color:#848484;
						resize:none;
						&:focus{
							border-color: #5cbb00;
						}
					}
					img{
						width: 68px;
						height: 69px;
					}
					span{
						color:#989898;
						width: 100px;
						text-align: right;
						line-height: 28px;
					}
					p{
						flex:1;
						margin-left: 23px;
						color:#343434;
						line-height: 28px;
					}
					.el-input{
						padding-top: 15px;
						margin-left: 24px;
						.el-input__inner:focus {
						    border-color: #000;
						}
					}
				}

			}
		}
	}

</style>
