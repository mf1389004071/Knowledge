<template>
	<transition name="fade">
		<div class="appAdd" v-show="show">
			<div class="app-header">
				<span @click="show = false;">返回列表</span>
				<h3>添加应用</h3>
				<ul>
					<li class="close" @click="cancel">取消</li>
					<li class="save" @click="submitUpload" v-loading="loading">保存</li>
				</ul>
			</div>
			<div class="app-content">
				<ul class="editInfo">
					<li>
						<span>
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
						</span>
						
						<input type="text" v-model="name" placeholder="输入应用名称">
					</li>
					<li>
						<span>应用英文标识</span>
						<p>
							<input type="text" v-model="encode" placeholder="应用英文标识">
						</p>
					</li>
					<li>
						<span>应用简介</span>
						<p>
							<textarea v-model="desc" name="" id="" cols="30" rows="10" placeholder="输入应用简介"></textarea>
						</p>
					</li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				show:false,
				name:'',
				desc:'',
				src:'',
				img_url:'',
				loading:false,
				upload:false,
				encode:'',
			}
		},
		methods:{
			showAdd(){
				this.show = true;
			},
			cancel(){
				this.show = false;
				this.name = '';
				this.desc = '';
				this.src = '';
				this.encode = '';
				this.img_url = '';
			},
			handleAvatarSuccess(response,file,fileList){
				if(response.code == 0){
					this.img_url = response.data[0].file_path;
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
				if(!this.encode || !this.encode.test(/^[A-Za-z0-9]+$/)){
					this.$message.error("请输入唯一标识，必须为英文字符！");
					return;
				}
				this.$refs.upload.submit();
				if(!this.loading){
					this.save();
				}
			},
			save(){
				this.loading = false;
				const params = {
					user_name:this.$parent.username,
					group_id:this.$parent.groupId,
					name:this.name,
					description:this.desc,
					id:this.encode,
					img_url:this.img_url,
				}
				console.log(params,'777')
				axios.post(this.$store.state.url1 + '/api/nlp/personal/app?axios=1',params)
					.then((res) => {
						this.loading = false;
						if(res.data.code == 0){
							this.$parent.getAppList();
							this.show = false;
							this.name = '';
							this.desc = '';
							this.src = '';
							this.encode = '';
							this.img_url = '';
							this.$message.success("添加成功！");

						}else{
							this.$message.error(res.data.msg);
						}
						
						console.log(res);
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
	.appAdd{
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
			.editInfo{
				> li{
					display: flex;
					jusitify-content:space-between;
					font-size: 16px;
					margin-bottom: 10px;
					&:first-child{
						margin-bottom: 48px;
						padding-left: 20px;
						input{
							height: 42px;
							width: 100%;
							margin-left: 24px;
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
					input{
						width: 100%;
						background: #f6f6f6;
						line-height: 28px;
						outline: 0 none;
						color:#848484;
						box-sizing: border-box;
						padding: 0 20px;
						border:1px solid #bcb8b8;
						&:focus{
							border-color: #5cbb00;
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
						margin-left: 0;
						&:focus{
							border-color: #5cbb00;
						}
					}
					img{
						width: 68px;
						height: 69px;
						vertical-align: middle;
						background: url('../../assets/home/app_img.png') no-repeat center;
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