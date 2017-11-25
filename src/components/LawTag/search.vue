<template>
	<div class="header_search_lawtexttag">
		<div class="search_box">
			<div class="select clearfloat" v-for="(searchItem,index) in search">
				<span>{{searchItem.title}}</span>
				<el-select :class="searchItem.tag" v-model="searchItem.value" clearable filterable remote :disabled="searchItem.disabled" :placeholder="searchItem.msg" @change="select(searchItem.value,searchItem.tag)" :remote-method="remoteOptions">
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
		        		title:'一级分类',
		        		msg:'点击选择一级分类',
		        		tag:'top-category',
		        		value:'',
		        		disabled:false,
		        		data:[]
		        	},
		        	{
		        		title:'二级分类',
		        		msg:'点击选择二级分类',
		        		tag:'sub-category',
		        		value:'',
		        		disabled:false,
		        		data:[]
		        	},
		        	{
		        		title:'法律',
		        		msg:'点击选择法律',
		        		tag:'title',
		        		value:'',
		        		disabled:false,
		        		data:[]
		        	},
		        	{
		        		title:'条目',
		        		msg:'点击选择条目',
		        		tag:'num',
		        		value:'',
		        		disabled:false,
		        		data:[]
		        	},
		        ],
		        searchParams:{},
		        content:{},
		        page:0,
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
	    	this.getTopCategory();
	    },
		methods:{
			remoteOptions(query){
				console.log(query,'777');
			},
	    	select(val,tag){
				// var _this = this;
				// this.searchParams[tag] = el;
				// this.$emit('change',this.searchParams);
				this.content = this.$parent.content = {};
				this.$parent.disabled = {
					prevPage:false,
					nextPage:false
				};
				switch(tag){
					case 'top-category':
						let el;
						this.search[0].data.filter(row => {
							if(row.value === val)
								el = row;
						});
						this.search[1].data = [];
						this.search[1].value = '';
						if(el.children.length === 0){
							this.search[1].disabled = true;
							this.getTitleOptions({category_id:val});
						}else{
							this.search[1].disabled = false;
							el.children.map(row => {
								this.search[1].data.push({
									value:row.id,
									label:row.topic
								})
							});
						}
						break;
					case 'sub-category':
						this.getTitleOptions({category_id:val});
						break;
					case 'title':
						this.getLawNum(val);
						break;
					case 'num':
						this.content = this.$parent.content = this.search[3].data.find(row => row.value === val);
						this.page = this.search[3].data.indexOf(this.content);
						this.$parent.getAllChains();
						if(this.page == 0){
							this.$parent.disabled.prevPage = true;
						}else if(this.page == this.search[3].data.length - 1){
							this.$parent.disabled.nextPage = true;
						}
					default:
						break;
				}
	    	},
	    	getOptions(val){
	    		console.log(val,'tag')
	    		// var _this = this;
	    		// const params = {
	    		// 	case_cause:this.searchParams.case_cause?this.searchParams.case_cause : '',
	    		// 	type_id:this.searchParams.type_id?this.searchParams.type_id : '',
	    		// 	apply_area:this.searchParams.apply_area?this.searchParams.apply_area : '',
	    		// 	title:this.searchParams.title?this.searchParams.title:'',
	    		// };
	    		// axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/search',{params:params})
	    		// 	 .then((res) => {
	    		// 	 	_this.search[0].data = [];
	    		// 	 	_this.search[1].data = [];
	    		// 	 	_this.search[2].data = [];
	    		// 	 	_this.search[3].data = [];

	    		// 	 	// 案由
	    		// 	 	res.data.data.case_causes.map(function(elem, index) {
				   //   		_this.search[0].data.push({
				   //   			value : elem._id,
				   //   			label : elem.name
				   //   		})
				   //   	})
	    		// 	 	// 文本类型
	    		// 	 	res.data.data.types.map(function(elem, index) {
				   //   		_this.search[1].data.push({
				   //   			value : elem._id,
				   //   			label : elem.name
				   //   		})
				   //   	})
	    		// 	 	//范围
	    		// 	 	res.data.data.areas.map(function(elem, index) {
				   //   		_this.search[2].data.push({
				   //   			value : elem,
				   //   			label : elem
				   //   		})
				   //   	})
				   //   	// 法条
				   //   	res.data.data.titles.map(function(elem, index) {
				   //   		_this.search[3].data.push({
				   //   			value : elem.title,
				   //   			label : elem.title
				   //   		})
				   //   	})
	    		// 	 })
	    		// 	 .catch((res) => {
	    		// 	 	console.log('err');
	    		// 	 })
	    		
	    	},
	    	getTitleOptions(params){
	    		axios.get(this.$store.state.TagUrl + '/api/codes',{params})
	    			.then(res => {
	    				this.search[2].disabled = false;
	    				this.search[2].value = '';
	    				this.search[2].data = [];
	    				if(res.data.data.length == 0){
	    					this.search[2].disabled = true;
	    					this.search[3] = Object.assign(this.search[3],{disabled:true,value:'',data:[]});
	    					console.log(this.search[3],'dsf---------------')
	    				}
	    				res.data.data.map(row => {
	    					this.search[2].data.push({
	    						value:row.id,
	    						label:row.topic
	    					})
	    				});
	    			});
	    	},
	    	getTopCategory(){
	    		axios.get(this.$store.state.TagUrl + '/api/tag/law_system/tree')
	    			.then(res => {
	    				console.log(res.data.data[0],'top-------------');
	    				this.search[0].data = [];
	    				res.data.data[0].children.map(row => {
	    					this.search[0].data.push({
	    						value:row.id,
	    						label:row.topic,
	    						children:row.children
	    					})
	    				});
	    			})
	    	},
	    	getLawNum(source_id){
	    		this.search[3].value = '';
	    		const params = {
	    			source_id:source_id,
	    			page_size:10000
	    		}
	    		axios.get(this.$store.state.TagUrl + '/api/laws',{params})
	    			.then(res => {
	    				this.search[3].disabled = false;
	    				this.search[3].data = [];
	    				if (res.data.data.length == 0)
	    					this.search[3].disabled = true;
	    				res.data.data.map(row => {
	    					this.search[3].data.push({
	    						value:row.id,
	    						label:row.topic,
	    						content:row.data.content
	    					});
	    				});
	    			})
	    	},
		}
	}
</script>

<style lang="less">
.header_search_lawtexttag{
	height: 82px;
	background: #F6F6F6;
	.search_box{
		width: 80%;
		margin: 0 auto;
		display: flex;
		justify-content:space-between;
	}
	.select{
		width: 16%;
		height: 34px;
		line-height: 34px;
		border: 1px solid #2281E9;
		background: #fff;
		margin-top: 24px;
		min-width: 260px;
		span{
			display: inline-block;
			float: left;
			font-size: 14px;
			color:#3D3D3D;
			width: 30%;
			height: 100%;
			padding: 0;
			text-align: center;
			border-right: 1px solid #2281E9;
		}
		.el-select{
			float: left;
			width: 69%;
			height: 100%;
			min-width: 154px;
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
