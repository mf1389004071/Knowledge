<template>
	<div class="select clearfloat">
		<span>{{text.title}}</span>
		<el-select v-model="value" allow-create filterable :placeholder="text.msg" @change="select;getOptions(text.tag,text.value)">
		    <el-option
		      v-for="item in text.data"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		 </el-select>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data () {
			return {
				value:'',
				title:[],
				isChecked:false,

			}
		},
		props:{
			text:{
				type : Object
			},
			options:{
				type : Array
			},
		},
		computed(){

		},
		mounted(){
			this.getOptions(this.text.tag,'');
		},
		methods : {
			getOptions(tag,value){
	    		var _this = this;
	    		const params = {
	    			case_cause:this.searchParams.case_cause?this.searchParams.case_cause : '',
	    			type_id:this.searchParams.type?this.searchParams.type : '',
	    			apply_area:this.searchParams.apply_area?this.searchParams.apply_area : '',
	    			title:this.searchParams.title?this.searchParams.title:'',
	    			is_checked:this.isChecked,
	    		};
	    		params[tag] = value;
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/search',{params:params})
	    			 .then((res) => {
	    			 	_this.text.data = [];
	    			 	// 案由
	    			 	if(tag == 'case_cause'){
	    			 		res.data.data.case_causes.map(function(elem, index) {
					     		_this.text.data.push({
					     			value : elem._id,
					     			label : elem.name
					     		})
					     	})
	    			 	}

	    			 	// 文本类型
	    			 	if(tag == 'type'){
	    			 		res.data.data.types.map(function(elem, index) {
					     		_this.text.data.push({
					     			value : elem._id,
					     			label : elem.name
					     		})
					     	})
	    			 	}

	    			 	//范围
	    			 	if(tag == 'apply_area'){
	    			 		res.data.data.areas.map(function(elem, index) {
					     		_this.text.data.push({
					     			value : elem,
					     			label : elem
					     		})
					     	})
	    			 	}

				     	// 法条
				     	if(tag == 'title'){
				     		res.data.data.titles.map(function(elem, index) {
					     		_this.text.data.push({
					     			value : elem.title,
					     			label : elem.title
					     		})
					     	})
				     	}

	    			 	// 条目
	    			 	if(tag == 'num'){
	    			 		res.data.data.nums.map(function(elem, index) {
					     		_this.text.data.push({
					     			value : elem.num,
					     			label : elem.name
					     		})
					     	})
	    			 	}


	    			 })
	    			 .catch((res) => {
	    			 	console.log('err');
	    			 })
	    	},
			selectNext() {
              this.value = this.text.data[this.text.data.findIndex(row => row.value === this.value) + 1].value;
			},
			select (tag,el) {
				var _this = this;
				const tag = this.text.tag;
				this.$store.state.search[tag] = el;
				this.$store.commit('search');


				if(this.$store.state.search.case_cause || this.$store.state.search.type){
		    		const params = {
		    			cause_id : this.$store.state.search.case_cause?this.$store.state.search.case_cause : '',
		    			type_id : this.$store.state.search.type?this.$store.state.search.type : '',
		    			apply_area : this.$store.state.search.apply_area?this.$store.state.search.apply_area : ''
		    		}
		    		axios.get(_this.$store.state.url1 + '/api/nlp/knowledge/source/title',{params:params})
		    			.then(function(res){
		    				res.data.data.map((item) => {
		    					_this.title.push({value:item.title,label:item.title})
		    				})
		    			}).catch(function(err){
		    				console.log('err5')
		    		})
					if(this.title){
						this.$store.state.search.all = this.title;
					}else{
						this.$store.state.search.all = [];
					}
				}
			}
		}
	}
</script>

<style lang="less">
	.select{
		width: 216px;
		height: 34px;
		line-height: 34px;
		border: 1px solid #2281E9;
		background: #fff;
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
			width: 154px;
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
</style>
