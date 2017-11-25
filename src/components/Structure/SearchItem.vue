<template>
	<div class="srtnotext_search">
		<div class="search_box">
			<div class="select clearfloat">
				<span>{{option.title}}</span>
				<el-select v-model="value" filterable :placeholder="option.msg" @change="select">
				    <el-option
				      v-for="item in options"
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
		data () {
			return {
				value:'',
				options:[],
			}
		},
		props:{
			option:Object
		},
		computed(){

		},
		mounted(){
			this.getCaseCause();
		},
		methods : {
		    getCaseCause(){
		      	axios.get(this.$store.state.url1 + '/api/nlp/label/entity/case/causes')
		           .then((res) => {
		              	this.options = [];
		              	res.data.data.map((elem, index) => {
		                	this.options.push({
		                  		value:elem._id,
		                  		label:elem.name
		                	})
		              	})
		           }).then((res) => {
		           		if(this.$store.state.transferList){
		           			this.value = this.$store.state.transferList.case_cause;
		           			this.$store.state.transferList = Object.assign({});
		           		}else{
		           			this.value = this.options[0].value;
		           		}
		           }).catch((err) => {
		              console.log(err)
		           })
		    },
			select(val){
				this.$emit('select',val);
			}
		}
	}
</script>
<style lang="less">
	.select{
		width: 298px;
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
			width: 65%;
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
	.srtnotext_search{
		height: 82px;
		background: #F6F6F6;
		.search_box{
			width: 80%;
			margin: 0 auto;
			display: flex;
			justify-content:space-between;
			.select{
				margin-top: 24px;
			}
		}
	}
</style>
