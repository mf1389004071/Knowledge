<template>
	<div id="recognition">
		<!--<search :isChecked="this.$store.state.checked" ref="search"></search>-->
		<div class="main">
			<div class="main_top clearfloat">
				<p>
					<el-button @click="check">识别文本知识</el-button>
				</p>
			</div>
			<transfer :datas="datas"></transfer>

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
	        		title : "实体内容识别与添加",
	        		titles:['备选实体','已有实体'],
	        		data: [],
	        		value:[],
	        		add:[]
	        	},
	        	{
	        		title : "关系内容识别与添加",
	        		titles:['备选关系','已有关系'],
	        		data: [],
	        		value:[],
	        		add:[]
	        	}
	        ],
	      }
	    },
	    computed : {
	    	title(){
	    		return this.$store.state.search.all;
	    	}
	    },
	    mounted(){
	    	var _this = this;
        	this.$store.commit("setChecked",false);
	    },
	    components:{
	    	'search':Search,
	    	'transfer':Transfer,
	    },
	    methods:{

	  		check(){
	  			var _this = this;
	  			let entity_list = [];
	  			let relation_list = [];
	  			const params = {
					id : this.$store.state.search.content_id
				};
				axios.post(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/source/check?axios=1',params)
		    		 .then(function(res){
		    		 	entity_list = res.data.data.entity_list.filter(item =>
		    		 		!!item.replace(/\s+/g,'') );
		    		 	relation_list = res.data.data.relation_list.filter(item => !!item.replace(/\s+/g,'') );
		    		 	for (var i = 0; i <= entity_list.length - 1; i++) {
			    			entity_list[i] = {
			    				key:entity_list[i],
			    				type:'',
			    				attr:''
			    			}
			    		}
			    		_this.datas[0].data = entity_list;
			    		for (var i = 0; i <= relation_list.length - 1; i++) {
			    			relation_list[i] = {
			    				key:relation_list[i],
			    				type:'',
			    				attr:''
			    			}
			    		}
			    		_this.datas[1].data = relation_list;
		    		 }).catch(function(res){
		    		 	console.log('lll',res);
		    		 });
	  		}
	    },

	}
</script>

<style lang="less">
	#recognition{
		.main{
			width: 1180px;
			margin-left: 70px;
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
			.box{
				padding-top: 37px;
				> p{
					margin-top: 41px;
					text-align: right;
					button{
						height: 37px;
						border-radius: 2px;
						font-size: 16px;
						&:first-child{
							width: 179px;
							background: #E7E7E7;
							color:#484B4D;
						}
						&:last-child{
							width: 239px;
							background: #2281E9;
							color:#fff;
						}
					}
				}
			}

		}
	}
	.el-table{
		background: #fff;
	}

</style>
