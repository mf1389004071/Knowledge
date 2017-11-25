<template>
	<div id="import">
		<h2>新文本导入编辑</h2>
		<!-- <el-form ref="form" :model="form" :rules="rules">
			<el-form-item class="button">
				<el-button @click="resetForm('form')">清空所有操作</el-button>
			    <el-button type="primary" @click="submitForm('form')">保存到数据库</el-button>
			</el-form-item>
			<el-form-item prop="title">
			    <el-input class="title" v-model="form.title" placeholder="点击输入法律文本名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-col :span="6">
					<el-form-item prop="case_cause">
					    <el-select v-model="form.case_cause" placeholder="点击选择法律文本案由">
					       	<el-option
					       		v-for="item in caseOptions"
					       		:key="item.value"
					       		:label="item.label"
					       		:value="item.value">
					       	</el-option>
					    </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item prop="type">
					    <el-select v-model="form.type" placeholder="点击选择法律文本类型">
					       <el-option
					       		v-for="item in typeOptions"
					       		:key="item.value"
					       		:label="item.label"
					       		:value="item.value">
					       	</el-option>
					    </el-select>
					</el-form-item>
				</el-col>
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
				<el-col :span="6">
					<el-form-item prop="num" class="num">
						<el-input v-model.number="form.num" placeholder="输入法律文本条目数量"></el-input><span>条</span>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item class="content" prop="content">
			    <el-input type="textarea" placeholder="点击输入法律文本详细内容" v-model="form.content"></el-input>
			</el-form-item>
		</el-form> -->
		<div class="choose">
			<router-link to="/manage/import/law">
				<img src="../../assets/manage/law.png" height="262" width="244" alt="">
			</router-link>
			<i></i>
			<router-link to="/manage/import/case">
				<img src="../../assets/manage/case.png" height="262" width="244" alt="">
			</router-link>
		</div>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
  export default {
    data() {
      return {
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
        		{required:true,message:"请输入法律文本名称",reigger:'blur'}
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
        areaOptions:[]
      }
    },
    mounted(){
    	const params = {
    		is_checked : false,
    	}
    	this.getCause(params);
    	this.getType(params);
    	this.getArea(params);
    },
    methods: {
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
      	},
      	// 获取案由列表
		getCause(myparams){
			var _this = this;
			axios.get(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/source/cause/list',{params:myparams})
			     .then(function(res){
			     	_this.caseOptions=[];
			     	res.data.data.map(function(elem, index) {
			     		_this.caseOptions.push({
			     			value : elem._id,
			     			label : elem.name
			     		})
			     	})
			     }).catch(function(res){
	    		 	console.log(res);
	    		 });
		},
		// 获取文本类型
		getType(myparams){
			var _this = this;

			axios.get(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/source/type/list',{params:myparams})
			     .then(function(res){
			     	_this.typeOptions = [];
			     	res.data.data.map(function(elem, index) {
			     		_this.typeOptions.push({
			     			value : elem._id,
			     			label : elem.name
			     		})
			     	})
			     }).catch(function(res){
	    		 	console.log(res);
	    		 });
		},
		// 获取范围
		getArea(myparams){
			var _this = this;
			axios.get(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/source/area/list',{params:myparams})
			     .then(function(res){
			     	_this.areaOptions.data = [];
			     	res.data.data.map(function(elem, index) {
			     		_this.areaOptions.push({
			     			value : elem,
			     			label : elem
			     		})
			     	})
			     }).catch(function(res){
	    		 	console.log(res);
	    		 });
		},
    }
  }
</script>

<style lang="less" scoped>
	#import{
		position: relative;
		h2{
				font-size: 20px;
				color: #016de0;
				padding-left: 550px;
				height: 81px;
				line-height: 81px;
				background: #f6f6f6;
				font-weight: normal;
			}
		.choose{
			width: 1180px;
			display: flex;
			justify-content:space-around;
			padding-top: 100px;
			i{
				height: 262px;
				width: 1px;
				background: #e7f3ff;
			}
			img{
				cursor: pointer;
			}
		}
		.el-form{
			position: absolute;
			top: 24px;
			left: 66px;
			width: 1100px;
			.button{
				text-align: right;
			}
			.el-form-item{
				& + .el-form-item{
					padding-top: 20px;
					margin-bottom: 0;
					font-size: 14px;
					color: #919eae;
				}
				.title{
					input{
						border: 1px solid #37be29;
					}

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
					textarea{
						resize:none;
						height: 676px;
					}
				}
			}
		}

	}

</style>
