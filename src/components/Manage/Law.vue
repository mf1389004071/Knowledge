<template>
	<div class="import">
		<div class="title">
			<h2>法律法规文本导入编辑</h2>
			<el-select v-model="value" placeholder="点击选择法律文本案由归类">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		</div>
		<!-- <el-form ref="form" :model="form" :rules="rules">
			<el-form-item>
				<el-col :span="6">
					<el-form-item prop="apply_area">
					    <el-select v-model="form.apply_area" placeholder="点击选择全国适用省份">
					       <el-option
					       		v-for="item in areaOptions"
					       		:label="item.label" 
					       		:value="item.value"
								:key="item.value"
					       		>
					       	</el-option>
					    </el-select>
				   	</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item prop="num" class="num">
						<el-input v-model.number="form.num" placeholder="输入法律文本条目数量"></el-input><span>条</span>
					</el-form-item>
				</el-col>
			</el-form-item> 
			<el-form-item prop="title">
			    <el-input class="title" v-model="form.title" placeholder="点击输入法律法规文本名称"></el-input>
			</el-form-item>
			<el-form-item class="content">
			    <el-upload
				  class="upload"
				  drag
				  action="https://jsonplaceholder.typicode.com/posts/"
				  accept="*.txt"
				  :before-upload="beforeUpload"
				  :on-preview="handlePreview"
				  :on-success="handleSuccess"
				  :file-list="fileList"
				  list-type="picture"
		          :on-error="handleError"
		          :on-change="handleChange"
				  >
				  <i class="upload_icon"></i>
				  <div class="el-upload__text">
				  	(点击导入法律法规文本，支持文件格式：.txt)
				  </div>
				</el-upload>
			</el-form-item>
			<el-form-item class="button">
				<el-button @click="resetForm('form')">清空所有操作</el-button>
			    <el-button type="primary" @click="submitForm('form')">保存到数据库</el-button>  
			</el-form-item>
		</el-form> -->

		<div class="sel_box">
			<el-input type="textarea" id="select" @select.native="select" @mousedown.native="mousedown" @mouseup.native="mouseup">
			</el-input>

			<div class="sel">
				选择框
			</div>
		</div>
		
	</div>
</template>

<script>
	 export default {
	 	data() {
      		return {
      			fileList:[],
      			value:'',
      			options:[],
      			form: {
		          title: '',
		          case_cause: '',
		          apply_area:'',
		          type:'',
		          num:'',
		          content: ''
		        },
		        rules:{
		        	title:[
		        		{required:true,message:"请输入法律法规文本名称",reigger:'blur'}
		        	],
		        	case_cause:[
		        		{required:true,message:"请选择法律文本案由",reigger:'blur'}
		        	],
		        	type:[
		        		{required:true,message:"请选择法律文本类型",reigger:'blur'}
		        	],
		        	apply_area:[
		        		{required:true,message:"请选择全国适用省份",reigger:'blur'}
		        	],
		        	num:[
		        		{required:true,message:"请输入法律文本条目数量"},
		        		{type:'number',message:"必须为数字"}
		        	],
		        	content:[
		        		{required:true,message:"请输入法律文本详细内容",reigger:'blur'}
		        	],
		        },
		        caseOptions:[],
		        typeOptions:[],
		        areaOptions:[],
		        mouseX:'',
		        mouseY:'',
		        diffX:'',
		        diffY:''
      		}
      	},
      	methods:{
      		mousedown(e){
      			console.log(e,1)
      		},
      		mouseup(e){
      			console.log(e,2);
      			this.mouseX = e.offsetX;
				this.mouseY = e.offsetY;
      		},
      		select(e){
      			// console.log(e)
      			// console.log(window.getSelection().toString());
      			var select = document.getElementById('select');
      			var userSelection = '';
				var txt = '';
				if (window.getSelection) { //现代浏览器
			        userSelection = window.getSelection();
			        txt = userSelection.toString();
			        console.log(txt)
			    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
			        userSelection = document.selection.createRange();
			        txt = userSelection.text;
			    }

      		},
      		submitForm(formName) {
	      		console.log(this.$refs[formName].model)
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	alert('submit!');
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
      		resetForm(formName){
	      		this.$refs[formName].resetFields();
	      		this.fileList = [];
	      	},
      		handleChange(file,fileList){
      			console.log(file,fileList,'4444')
      			this.fileList = fileList.slice(-1);
      		},
      		handleError(error) {
		        this.$message.error('上传文件出错');
		    },
      		handleSuccess(data){
      			console.log(data,'3333333')
      		},
      		handlePreview(data) {
		        console.log(data,'22222');
		    },
      		beforeUpload(file){
      			const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      			if(type !== 'txt'){
      				this.$message.error('上传文件只能是txt格式！')
      				return false;
      			}	
      		}
      	}
	 }
</script>

<style lang='less'>
	.import{
		position: relative;
		.title{
			position: relative;
			background: #f6f6f6;
			.el-select{
				position: absolute;
				top: 20px;
				left: 940px;
				width: 220px;
				.el-input__inner{
					border-color: #2f86e3;
					border-radius: 0;
					height: 40px;
				}
				&:hover .el-input__inner{
					border-color: #2f86e3;
				}
				.el-input .el-input__icon{
					transform: translateY(-50%) rotateZ(90deg);
					color: #2f86e3;
					&.is-reverse{
						transform: translateY(-50%) rotateZ(180deg);
					}
				}
			}
		}
		h2{
			font-size: 20px;
			color: #016de0;
			height: 81px;
			line-height: 81px;
			font-weight: normal;
			width: 1180px;
			text-align: center;
		}
		
		.el-form{
			position: absolute;
			left: 65px;
			margin-top: 32px;
			width: 1100px;
			.button{
				text-align: right;
			}
			.el-form-item{
				& + .el-form-item{
					font-size: 14px;
					color: #919eae;
				}
				.title{
					
					
				}
				&.num{
					.el-form-item__content{
						display: flex;
						span{
							margin-left: 10px;
							color: #1d2c3c;
							font-size: 16px;
						}
					}
					
					
				}
				&.content{
					.upload{
						width: 100%;
						.el-upload{
							width: 100%;
						}
						.el-upload-dragger{
							width: 100%;
							border: 1px solid #bfcbd9;
							border-radius: 0;
							height: 158px;
							background: #fcfcfc;
							.el-upload__text{
								color:#919eae;
							}
							.upload_icon{
    							line-height: 50px;
    							display: block;
    							width: 100%;
    							margin-top: 45px;
    							margin-bottom: 10px;
    							cursor: pointer;
    							height: 43px;
    							background: url('../../assets/manage/upload.png') no-repeat center;
							}
						}

					}
				}
				&.desc{
					.el-textarea__inner{
						resize:none;
						border-radius: 0;
						height: 108px;
						background: #fcfcfc;
						line-height: 24px;
					}
				}
			}
		}
		.el-input__inner{
			border-radius: 0;
			height: 40px;
			background: #fcfcfc;
		}
		.el-form-item__label{
			font-size: 18px;
			color: #016de0;
		}
	}
	.sel_box{
		position: relative;
	}
	.sel{
		position: absolute;
		top: 0;
		left: 0;
		width: 200px;
		height: 20px;
		background: red;
	}
</style>