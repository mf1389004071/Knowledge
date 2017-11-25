<template>
	<div id="header_search">
		<div class="search_box">
			<div class="select clearfloat" v-for="(searchItem,index) in search">
				<span>{{searchItem.title}}</span>
				<el-select :class="searchItem.tag" v-model="searchItem.value" clearable filterable :placeholder="searchItem.msg" @change="select(searchItem.value,searchItem.tag);getOptions(searchItem.tag)">
				    <el-option
				      v-for="item in searchItem.data"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				search:[
		        	{
		        		title:'案由',
		        		msg:'点击选择案由',
		        		tag:'case_cause',
		        		value:'',
		        		data:[]
		        	},
		        	{
		        		title:'类型',
		        		msg:'点击选择类型',
		        		tag:'type_id',
		        		value:'',
		        		data:[]
		        	},
		        	{
		        		title:'范围',
		        		msg:'点击选择范围',
		        		tag:'apply_area',
		        		value:'',
		        		data:[]
		        	},
		        	{
		        		title:'法条',
		        		msg:'点击选择法条',
		        		tag:'title',
		        		value:'',
		        		data:[]
		        	},
		        ],
		        searchParams:{},
		        // 法条详细
		        titleList:[]
			}
		},
		props:{
			isChecked:{
				type:Boolean
			},
			all:{
				type:Number
			},
			type:{
				type:String
			},
		},
		mounted(){

	    	this.getOptions();
	    },
		methods:{
	    	select(el,tag){
				var _this = this;
				this.searchParams[tag] = el;
				this.$emit('change',this.searchParams);
	    	},
	    	getOptions(){
	    		var _this = this;
	    		const params = {
	    			case_cause:this.searchParams.case_cause?this.searchParams.case_cause : '',
	    			type_id:this.searchParams.type_id?this.searchParams.type_id : '',
	    			apply_area:this.searchParams.apply_area?this.searchParams.apply_area : '',
	    			title:this.searchParams.title?this.searchParams.title:'',
	    		};
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/search',{params:params})
	    			 .then((res) => {
	    			 	_this.search[0].data = [];
	    			 	_this.search[1].data = [];
	    			 	_this.search[2].data = [];
	    			 	_this.search[3].data = [];

	    			 	// 案由
	    			 	res.data.data.case_causes.map(function(elem, index) {
				     		_this.search[0].data.push({
				     			value : elem._id,
				     			label : elem.name
				     		})
				     	})
	    			 	// 文本类型
	    			 	res.data.data.types.map(function(elem, index) {
				     		_this.search[1].data.push({
				     			value : elem._id,
				     			label : elem.name
				     		})
				     	})
	    			 	//范围
	    			 	res.data.data.areas.map(function(elem, index) {
				     		_this.search[2].data.push({
				     			value : elem,
				     			label : elem
				     		})
				     	})
				     	// 法条
				     	res.data.data.titles.map(function(elem, index) {
				     		_this.search[3].data.push({
				     			value : elem.title,
				     			label : elem.title
				     		})
				     	})
	    			 })
	    			 .catch((res) => {
	    			 	console.log('err');
	    			 })
	    	},
		}
	}
</script>

<style lang="less">
#header_search{
	height: 82px;
	background: #F6F6F6;
	.search_box{
		width: 80%;
		margin: 0px auto;
		display: flex;
		justify-content:space-between;
	}
	.select{
		height: 34px;
		line-height: 34px;
		border: 1px solid #2281E9;
		background: #fff;
		margin-top: 24px;
		span{
			display: inline-block;
			float: left;
			font-size: 14px;
			color:#3D3D3D;
			// width: 91px;
			padding: 0 18px 0 15px;
			height: 100%;
			border-right: 1px solid #2281E9;
		}
		.el-select{
			float: left;
			height: 100%;
			.el-input{
				height: 100%;
				font-size: 14px;
			}
		}
		.el-input__inner{
			border: none;
			height: 100%;
			color:#006fe6;
		}
		.el-select .el-input .el-input__icon{
			color: #2F86E3;
			font-size: 14px;
		}
	}
}
</style>
