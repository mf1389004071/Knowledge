<template>
	<div class="import">
		<div class="title">
			<h2>指导性案例、典型性案例文本导入编辑</h2>
			<el-select v-model="value" placeholder="点击选择案例案由归类">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		</div>
		<el-form ref="form" :model="form" :rules="rules">
			<el-form-item>
				<el-col :span="6">
					<el-form-item prop="num" class="num">
						<el-input v-model.number="form.num" placeholder="输入案例案号"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item> 
			<el-form-item prop="title">
			    <el-input class="title" v-model="form.title" placeholder="点击输入案例文本名称"></el-input>
			</el-form-item>
			<el-form-item prop="desc" label="裁判要旨:" class="desc" label-width="92px">
			    <el-input type="textarea" v-model="form.desc" placeholder="点击输入裁判要旨"></el-input>
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
				  	(点击导入案例文本，支持文件格式：.txt)
				  </div>
				</el-upload>
			</el-form-item>
			<el-form-item class="button">
				<el-button @click="resetForm('form')">清空所有操作</el-button>
			    <el-button type="primary" @click="submitForm('form')">保存到数据库</el-button>  
			</el-form-item>
		</el-form>
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
		          desc:'',
		          content: ''
		        },
		        rules:{
		        	title:[
		        		{required:true,message:"请输入案例文本名称",reigger:'blur'}
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
		        		{required:true,message:"请输入案例案号"},
		        	],
		        	content:[
		        		{required:true,message:"请输入法律文本详细内容",reigger:'blur'}
		        	],
		        },
		        caseOptions:[],
		        typeOptions:[],
		        areaOptions:[]
      		}
      	},
      	methods:{
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

<style lang='less' scoped>
	
</style>