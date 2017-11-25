<template>
	<div id="recognition">
		<!--<search :isChecked="this.$store.state.checked" ref="search"></search>-->
		<div class="main">
			<div class="main_top clearfloat">
				<p>
					<el-button @click="check">识别文本知识</el-button>
				</p>
			</div>
			<div class="main_bottom">
				<transfer :datas="datas[0]"></transfer>
				<transfer :datas="datas[1]"></transfer>
			</div>

			<p>
				<el-button @click="skip">跳转到图谱构建</el-button>
			</p>
		</div>

	</div>
</template>

<script>
	import Search from '../common/search'
	import Transfer from './Transfer'
	// import Transfer from '../common/Transfer'
	import axios from '../../js/axios-api.js';
	export default{
		data() {
	      return {
	        datas:[
	        	{
	        		title : "实体",//主标题
	        		tag:'entity',
	        		data: [],
	        		options:[],
	        		add:[]
	        	},
	        	{
	        		title : "关系",
	        		tag:'relation',
	        		data: [],
	        		options:[],
	        		add:[]
	        	}
	        ],
	      }
	    },
	    computed : {
	    	title(){
	    		return this.$store.state.search.all;
	    	},
			user(){
		        return this.$store.state.user;
		    }
	    },
	    mounted(){
	    	var _this = this;
        	this.$store.commit("setChecked",false);
        	this.getRelationType();
        	this.getEntityType();
        	this.$nextTick(()=>{
        		console.log(this.user,'222')
        	})
	    },
	    components:{
	    	'search':Search,
	    	'transfer':Transfer,
	    },
	    methods:{
	    	skip(){
	    		this.$router.push('/main/structure');
	    	},
	  		check(){
	  			var _this = this;
	  			let entity_list = [];
	  			let relation_list = [];
	  			const params = {
					id : this.$store.state.search.content_id
				};
				axios.post(this.$store.state.url1 + '/api/nlp/knowledge/source/check?axios=1',params)
		    		 .then((res) => {
			    		res.data.data.entity_list.map(row => {
			    			entity_list.push({
			    				key:row,
			    				type:'',
			    				attr:''
			    			})
			    		});
			    		res.data.data.relation_list.map(row => {
			    			relation_list.push({
			    				key:row,
			    				type:'',
			    				attr:''
			    			})
			    		});
			    		this.datas[0].data = entity_list;
			    		this.datas[1].data = relation_list;
		    		 }).catch((res) => {
		    		 	console.log('lll',res);
		    		 });
	  		},
	  		// 实体类型
	  		getEntityType(){
	  			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/type')
				 .then((res) => {
				 	res.data.data.map((elem, index) => {
				 		this.datas[0].options.push({
				 			value : elem._id,
				 			label : elem.name
				 		});
				 	});
				 }).catch((res) => {
				 	console.log(res)
				 })
	  		},
	  		// 关系类型
	  		getRelationType(){
	  			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/type')
				 .then((res) => {
				 	res.data.data.map((elem, index) => {
				 		this.datas[1].options.push({
				 			value : elem._id,
				 			label : elem.name
				 		})
				 	})
				 }).catch((res) => {
				 	console.log(res)
				 })
	  		}
	    },

	}
</script>

<style lang="less">
	#recognition{
		.main{
			width: 80%;
			margin: 0 auto;
			.main_top{
				margin-top: 117px;

				p{
					float: right;
					margin-top: 26px;
					button{
						display: inline-block;
						width: 95px;
						height: 34px;
						padding: 10px 0;
						border-color: #CFCFCF;
						border-radius: 2px;
						background: #E7E7E7;
						margin-left: 47px;
						font-size: 16px;
						color: #484B4D;
						&:last-child{
							background: #2281E9;
							border-color: #2281E9;
							color: #fff;
							width: 156px;
						}
					}
				}
			}
			.main_bottom{
				margin-top: 37px;
				display: flex;
				justify-content:space-between;
			}
			> p{
				margin-top: 41px;
				text-align: right;
				button{
					height: 37px;
					border-radius: 2px;
					font-size: 16px;
					width: 200px;
					background: #2281E9;
					color:#fff;
				}
			}


		}

	}
	.el-table{
		background: #fff;
	}

</style>
