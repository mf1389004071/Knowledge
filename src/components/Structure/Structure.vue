<template>
	<div id="structure">
		<div class="main">
			<div class="main_top clearfloat">
				<p>
					<el-button class="check" @click="init();">显示内容</el-button>
				</p>
			</div>

			<div class="main_center">
				<div class="line_box">
					<div class="line ishover" v-for="(item,index) in List">
						<el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
						<span v-if="item.category == 'relation'">{{item.name}}</span>
						<div class="tip">
							<span @click="editItem(item.category,index)">修改</span>
							<span @click="delItem(index,List)">删除</span>
						</div>
					</div>
					<div class="line">
						<el-button class="last-button">待选实体</el-button>
					</div>
					<div class="line">
						<span class="last-span">待选关系</span>
					</div>
				</div>

				<el-button class="save" @click="save">保存</el-button>

				<div class="list_box">
					<div class="list entity">
						<div class="title"><span>实体内容</span><span>实体类型</span><span>实体属性</span></div>
						<ul>
							<li v-for="(item,index) in entityList" @click="list(item)">
								<span>{{item.name}}</span>
								<span>{{item.type}}</span>
								<span>{{item.properties}}</span>
							</li>
						</ul>
						<p>
							<i @click="add('entity')"></i>
						</p>
					</div>
					<div class="list relation">
						<div class="title">
							<span>关系内容</span>
							<span>关系类型</span>
							<span>关系属性</span>
						</div>
						<ul>
							<li v-for="item in relationList" @click="list(item)">
								<span>{{item.name}}</span>
								<span>{{item.type}}</span>
								<span>{{item.properties}}</span>
							</li>
						</ul>
						<p>
							<i @click="add('relation')"></i>
						</p>
					</div>
				</div>
			</div>

			<div class="main_bottom">
				<el-tabs type="border-card" @tab-click="tabClick" active-name="1">
				  <el-tab-pane name="1">
				    <span slot="label"><i class="p1"></i> 已完成知识链</span>
				    <ul>
				    	<li class="clearfloat" v-for="list in chainList">
				    		<div class="left">
								<el-tooltip placement="top" v-for="item in list.data">
								  <div slot="content">类型：{{item.type}}<br/>属性：{{item.properties}}</div>
								  <el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
								  <span v-if="item.category == 'relation'">{{item.name}}</span>
								  {{item}}
								</el-tooltip>
				    		</div>
				    		<div class="right">
				    			<span @click="edit(list,list.id)" class="edit">修改</span>
				    			<span @click="copy(list)" class="copy">复制</span>
				    			<span @click="clear(list.id,index)" class="del">删除</span>
				    		</div>
				    	</li>

				    </ul>
				  </el-tab-pane>
				  <el-tab-pane name="2">
				    <span slot="label"><i class="p2"></i> 查看知识链图谱</span>
				    <div v-if="graphShow&&tabClicked" id="chain-graph">
			            <create :list="graphChainList" :visible="true" :editable="false"></create>
			        </div>
				  </el-tab-pane>
				</el-tabs>
				<span>操作</span>
			</div>
		</div>
		<div>
			<div class="mask" v-show="popshow"></div>
			<popup v-show="popshow" @hide="popshow=false" :info="addInfo"></popup>
		</div>

	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Search from './search.vue';
import Popup from '../Structure/Popup';
import Create from '../Search/Create.vue';
	export default{
		data() {
	      return {
	      	entity_options:[],
			relation_options:[],
	        searchParams:{},
	        entityList:[],
	        relationList:[],
	        graphShow:false,
	        graphChainList:[],
	        List:[
	        ],
	        // 知识链id
	        listId:'',
	        listOwner:'',
	        //修改实体或关系的index
	        editItemIndex:-1,
	        chainList:[],
	        content:'',
	        popshow:false,
	        addInfo:{},
	        loading:true,
	        params:{
	        	page:1,
	        	page_size:10
	        },
	        tabClicked:false
	      }
	    },
	    components:{
	    	'search':Search,
	    	'popup':Popup,
	    	'create':Create
	    },
	    computed:{
	    	user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		    	return JSON.parse(this.user.config.data).username;
		    },
		    app_id(){
		    	return localStorage.app_id;
		    }
	    },
	    mounted(){
	    	if(this.$store.state.search.content_show && this.$store.state.search.content_id){
		    		this.init();
	    	}
	    	this.$store.commit("setChecked",true);
	    },
	    methods:{
		    tabClick(tab){
		        this.tabClicked = tab.name==2;
		    },
		    init(){
		    	this.getEntity();
		    	this.getRelation();
		    	this.getChainList();
		    	this.graphShow = false;
		    },
	    	handleSizeChange(val){
		      this.params.page_size = val;
		      this.getChainList();
		    },
		    handleCurrentChange(val){
		      this.params.page = val;
		      this.getChainList();
		    },
	    	copy(list){
	    		this.List = list.data.slice(0);
	    		$('.last-span,.last-button').css('display', 'none');
	    		$('.list').removeClass('dark');
	    	},
	    	list(item){
	    		if(this.editItemIndex != -1 ){
	    				var index = this.editItemIndex;
	    				$('.'+this.List[index].category).removeClass('dark').siblings().removeClass('dark');
	    				if(this.List[index].category == item.category){
		    				this.$set(this.List, index, item);
		    				$('.ishover').eq(index).removeClass('hover');
		    				this.editItemIndex = -1;
		    				if(this.List.length % 2 == 0){
		    					$('.entity').removeClass('dark');
								$('.relation').addClass('dark');
		    				}else{
		    					$('.relation').removeClass('dark');
								$('.entity').addClass('dark');
		    				}

		    			}
	    			}else{
	    				if(item.category == 'relation' && (this.List.length + 1) % 2 == 0){
							this.List.push(item);
							$('.last-span').css('display', 'none');
							$('.entity').removeClass('dark');
							$('.relation').addClass('dark');
			    		}
			    		if(item.category == 'entity' && (this.List.length + 1) % 2 == 1){
			    			this.List.push(item);
			    			$('.last-button').css('display', 'none');
			    			$('.relation').removeClass('dark');
			    			$('.entity').addClass('dark')
			    		}
	    			}
	    	},
	    	// 添加实体或关系
	    	add(tag){

	    		if(this.$store.state.search.content_id && this.$store.state.search.content){
	    			this.popshow = true;
	    			if(tag == 'entity'){
	    				this.getEntityOptions();
	    				this.addInfo = {
				      		name:'实体',
				        	tag:'entity',
				        	options:this.entity_options
	    				}
	    			}
	    			if(tag == 'relation'){
	    				this.getRelationOptions();
	    				this.addInfo = {
				        	name:'关系',
				        	tag:'relation',
				        	options:this.relation_options
	    				}
	    			}
	    		}

	    	},
	    	// 删除链中的实体或关系
	    	delItem(index,list){
	    		list.splice(index);
	    		$('.list').removeClass('dark');
	    		if(index % 2 == 0){
	    			$('.relation').addClass('dark');
	    		}else{
	    			$('.entity').addClass('dark');
	    		}
	    		if(index == 0){
	    			$('.last-button').css('display', 'block');
	    			$('.last-span').css('display', 'block');
	    		}

	    	},
	    	// 修改单个实体或关系
	    	editItem(category,index){
	    		this.editItemIndex = index;
	    		$('.ishover').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
	    		$('.ishover').eq(index).siblings().removeClass('hover').find('.tip span:first-child').removeClass('hover');
	    		$('.'+category).removeClass('dark').siblings().addClass('dark');
	    	},
	    	// 修改知识链
	    	edit(list,id){
	    		this.List = list.data.slice(0);
	    		this.listId = list.id;
	    		this.listOwner = list.owner;
	    		$('.last-span,.last-button').css('display', 'none');
	    		$('.list').removeClass('dark');
	    	},
	    	// 删除知识链
	    	clear(id,index){
	    		var _this = this;
	    		this.$confirm('此操作将永久删除该知识链, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
			        	axios.delete(this.$store.state.url1 + '/api/nlp/knowledge/chain/list?source_id='+this.$store.state.search.content_id+'&ids=' + JSON.stringify([id]) + '&user_name=' + this.username)
			        		 .then((res) => {
					          	this.$message.success("删除成功！");
					          	this.chainList.splice(index,1);
			        		 }).catch((res) => {
			        		 	console.log('err')
			        		 });
			        }).catch(() => {
			          	this.$message.info("已取消删除");
			        });


	    	},
	    	// 保存知识链
	    	save(){
	    		let params = {
		    			knowledge_linked:[],
		    			user_name:this.username,
		    			source_id:this.$store.state.search.content_id,
		    			app_id:this.app_id
		    		};
	    		this.List.map((elem, index) => {
	    			params.knowledge_linked.push(elem.id);
	    		});
	    		params.knowledge_linked = JSON.stringify(params.knowledge_linked);

	    		var length = this.List.length;

	    		if(this.listId){
		    		params.id = this.listId;
		    		this.listId = '';
		    		if(this.List[length - 1].category == "entity"){
		    			axios.put(this.$store.state.url1 + '/api/nlp/knowledge/chain?axios=1',params)
		    			 	.then((res) => {
		    			 		if(res.data.code == 0){
		    			 			this.List = [];
			    			 		this.listId = '';
			    			 		this.getChainList();
			    			 		this.$message.success("修改成功！");
			    			 		$('.last-span,.last-button').css('display', 'block');
			    			 		$('.entity').removeClass('dark').siblings().addClass('dark');
		    			 		}else{
		    			 			this.$confirm('你无权修改此链, 是否申请修改?','提示',{
		    			 				confirmButtonText: '确定',
				                    	cancelButtonText: '取消',
				                    	type: 'warning'
		    			 			}).then(() => {
		    			 				const params2 = {
					                      from_user:this.username,
					                      to_user:this.listOwner,
					                      type:'change',
					                      chain_id:params.id,
					                      knowledge_linked:params.knowledge_linked
					                    }
					                    axios.post(this.$store.state.MessageUrl + '/api/nlp/personal/message?axios=1',params2)
					                        .then((res) => {
					                          console.log(res)
					                        })
					                  }).catch(() => {
					                    this.$message.info("已取消修改");
					                  });
		    			 		}
		    			 	}).catch((res) => {
		    			 		console.log('err')
		    				})
		    		}else{
		    			this.$message.warning('知识链格式不正确，无法保存！');
		    		}
		    	}else{
		    		if(this.List[length - 1].category == "entity"){
		    			axios.post(this.$store.state.url1 + '/api/nlp/knowledge/chain?axios=1',params)
		    			 	.then((res) => {
		    			 		if(res.data.code == 0){
		    			 			this.List = [];
			    			 		this.getChainList();
			    			 		this.$message.success("保存成功！");
			    			 		$('.last-span,.last-button').css('display', 'block');
			    			 		$('.entity').removeClass('dark').siblings().addClass('dark');
		    			 		}else{
		    			 			this.$message.warning(res.data.msg)
		    			 		}
		    			 	}).catch((res) => {
		    			 		console.log('err')
		    				})

		    		}else{
		    			this.$message.warning('知识链格式不正确，无法保存！');
		    		}
	    		}
	    	},
	    	


	    	// 获取实体
	    	getEntity(){
	    		if(this.$store.state.search.content_id){
	    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/source?source_id='+this.$store.state.search.content_id)
			    	     .then((res) => {
			    	     	this.entityList = [];
			    	     	res.data.data.map((elem, index) => {
			    	     		this.entityList.push({
			    	     			name:elem.name,  //实体名
			    	     			properties:elem.property,//实体属性
			    	     			type:elem.type_name,//实体类型id
			    	     			category:'entity',
			    	     			id:elem._id
			    	     		})
			    	     	})
			    	     }).catch((err) => {
			    	     	console.log(err);
			    	     })
	    		}

	    
	    	},
	    	// 获取关系
	    	getRelation(){
	    		if(this.$store.state.search.content_id){
	    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/source?source_id='+this.$store.state.search.content_id)
			    	     .then((res) => {
			    	     	this.relationList = [];
			    	     	res.data.data.map((elem, index) => {
			    	     		this.relationList.push({
			    	     			name:elem.name,  //实体名
			    	     			properties:elem.property,//实体属性
			    	     			type:elem.type_name,//实体类型id
			    	     			category:'relation',
			    	     			id:elem._id
			    	     		})
			    	     	})
			    	     }).catch((err) => {
			    	     	console.log(err);
			    	     })
	    		}

	    	 
	    	},
	    	select(el,tag){
	    		var _this = this;
	    		this.searchParams[tag] = el;
	    		const params = this.searchParams;
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/list',{params:params})
		    		 .then((res) => {
		    		 	this.$store.state.search.content = res.data.data[0].content;
		    		 	this.$store.state.search.content_id = res.data.data[0]._id;
		    		 }).catch((res) => {
		    		 	this.$store.state.search.content = '没有数据';
		    		 })
	    	},
	    	getChainList(){
	    		const params = {
	    			source_id:this.$store.state.search.content_id,
	    			// page:this.params.page?this.params.page:1,
	    			// page_size:this.params.page_size?this.params.page_size:10,
	    		}
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/chain/source',{params:params})
	    			 .then((res) => {
	    			 	this.chainList = [];
	    			 	this.graphChainList = [];
	    			 	// this.params.total = res.data.pager.total;
	    			 	res.data.data.map((chain,index) => {
	    			 		const data = [];
	    			 		chain._knowledge_linked.map(function(item, i) {
	    			 			data.push({
	    			 				name : item.name,
	    			 				type : item.type_name,
	    			 				properties : item.property,
	    			 				category : i % 2 == 0 ? "entity" : "relation",
	    			 				id : item._id
	    			 			})
	    			 		})
	    			 		this.chainList.push({
	    			 			id : chain._id, //知识链id
	    			 			owner : chain.maintain[chain.maintain.length-1].user_name,
	    			 			data : data
	    			 		});

	    			 		var graphData = {};
			                var len = chain._knowledge_linked.length;
			                for (var i = 0; i < len; i++) {
			                  var elem = chain._knowledge_linked[i];
			                  graphData = {
			                    name: elem.name,
			                    colloquial: elem.colloquial,
			                    property: elem.property,
			                    category: (i % 2 == 0) ? 'entity' : 'relation',
			                    _id: elem._id,
			                    key: elem._id,
			                    synonyms: elem.synonyms,
			                    type: elem.type,
			                  }
			                  var graphListData = {
			                    id: chain._id,
			                    key: graphData._id,
			                    params: graphData,
			                    text: graphData.name,
			                  };
			                  if (graphData.category == 'relation') {
			                    graphListData.from = chain._knowledge_linked[i - 1]._id;
			                    graphListData.to = chain._knowledge_linked[i + 1]._id;
			                  }
			                  var hasExisted=false;
			                  this.graphChainList.forEach((item)=>{
			                    if(graphListData.params.category=='entity'){
			                      if(item.key==graphListData.key){
			                        hasExisted=true;
			                      }
			                    }else{
			                      if(item.from==graphListData.from&&item.key==graphListData.key&&item.to==graphListData.to){
			                        hasExisted=true;
			                      }
			                    }
			                  });
			                  if(!hasExisted){
			                    this.graphChainList.push(graphListData);
			                  }
			                }

	    			 	})
	    			 	this.graphShow = true;
	    			 }).catch((res) => {
	    			 	console.log('err');
	    			 })
	    	},
	    	getEntityOptions(){
    			this.entity_options = [];
    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/type')
					 .then((res) => {
					 	res.data.data.map((elem, index) => {
					 		this.entity_options.push({
					 			value : elem._id,
					 			label : elem.name
					 		})
					 	})
					 }).catch((res) => {
					 	console.log(res)
					 })
    		},
    		getRelationOptions(){
    			this.relation_options = [];
    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/type')
					 .then((res) => {
					 	res.data.data.map((elem, index) => {
					 		this.relation_options.push({
					 			value : elem._id,
					 			label : elem.name
					 		})
					 	})
					 }).catch((res) => {
					 	console.log(res)
					 })
    		}
	    }
	}
</script>

<style lang="less">
#structure{
	.header{
		height: 81px;
		line-height: 81px;
		background: #F6F6F6;
		.search_item{
			height: 36px;
			width: 298px;
			border:1px solid #2281E9;
		}
	}
	.main{
		width: 80%;
		margin: 0 auto;
		.main_top{
			margin-top: 117px;
			margin-bottom: 40px;
			textarea{
				width: 1134px;
				height: 110px;
				resize:none;
				border-color: #4078B4;
				color: #000;
				font-size: 16px;
				line-height: 26px;
				padding: 10px 22px;
			}
			p{
				float: right;
				margin-top: 26px;
				button{
					display: inline-block;
					width: 156px;
					height: 34px;
					padding: 10px 0;
					border-color: #2281E9;
					border-radius: 2px;
					background: #2281E9;
					margin-left: 47px;
					font-size: 16px;
					color: #fff;
				}
			}
		}
		.main_center{
			position: relative;
			.line_box{
				width: 980px;
			}
			.save{
				position: absolute;
				right: 0;
				top: 10px;
				background: url('../../assets/structure/save.png') no-repeat center #e6e6e6;
				font-size: 0;
				width: 95px;
				height: 43px;
			}
			.line{
					position: relative;
					display: inline-block;
					margin-bottom: 45px;
					button{
						background: #1278E7;
						font-size: 16px;
						color: #fff;
						&.last-button{
							color: #ACACAC;
							font-size: 14px;
							background: #F6F6F6;
							border:1px dotted #D2D2D2;
						}
					}
					&.ishover:hover,&.hover{
						button{
							background: #F60062;
							font-size: 20px;
							border-color: #F60062;
							min-width: 150px;
						}
						.tip{
							opacity: 1;
						}
						> span{
							color: #F60062;
							border:2px solid #F60062;
							padding:9px 10px;
							top: 0;
							min-width: 60px;
						}
					}
					> span{
						border-bottom: 1px solid #37BE29;
						display: inline-block;
						color: #37BE29;
						font-size: 16px;
						padding: 2px 5px;
						position: relative;
						top: -6px;
						cursor: pointer;
						text-align: center;
						&.last-span{
							color:#ACACAC;
							font-size: 14px;
							border-color: #ACACAC;
						}
					}
					.tip{
						position: absolute;
						height: 100%;
						width: 100%;
						text-align: center;
						line-height: 100%;
						bottom:100%;
						left: 0;
						border-color: #000;
						opacity: 0;
						span{
							display: inline-block;
							width: 30px;
							height: 30px;
							margin: 0 5px;
							cursor: pointer;
							background: url('../../assets/r3/edit.png') no-repeat center;
							font-size: 0;
							&:hover,&.hover{
								background-image: url('../../assets/r3/edit2.png');
							}
							&:last-child{
								background-image: url('../../assets/r3/delete.png');
								&:hover,&.hover{
									background-image: url('../../assets/r3/delete2.png');
								}
							}
						}
					}
			}

			.list_box{
				margin-top: 40px;
				display: flex;
				justify-content:space-between;
				.list{
					width: 555px;
					height: 408px;
					text-align: center;
					border:1px solid #E2E2E2;
					overflow: hidden;
					&.dark{
						position: relative;
						&::after{
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							background: rgba(0,0,0,.5);
							width: 100%;
							height: 100%;
						}
					}
					.title{
						background: #2281E9;
						font-size: 18px;
						color: #fff;
						height: 51px;
						line-height: 51px;
						font-weight: normal;
						display: flex;
						justify-content:space-around;
					}
					ul{
						overflow-y: auto;
						height: 306px;
					}
					li{
						height: 49px;
						line-height: 49px;
						font-size: 16px;
						color: #293D52;
						cursor: pointer;
						display: flex;
						justify-content:space-around;
						border:1px solid transparent;
						&:hover{
							border-color: #2281e9;
							color:#2281e9;
						}
						span{
							min-width: 150px;
						}
						&:nth-child(even){
							background: #F5F5F5
						}
						&:nth-child(odd){
							background: #fff;
						}
						&:last-child{
							i{
								display: block;
								width: 100%;
								height: 100%;
								background: url('../../assets/r3/addEn.png') no-repeat center;
								cursor: pointer;
							}
						}
					}
					> p{
						height: 51px;
						line-height: 51px;
						i{
							display: block;
							width: 100%;
							height: 100%;
							background: url('../../assets/r3/addEn.png') no-repeat center;
							cursor: pointer;
						}
					}
					&.relation{
						.title{
							background: #37BE29;
						}
						li:hover{
							border-color: #37BE29;
							color:#37BE29;
						}
						>p i{
							background-image: url('../../assets/r3/addRe.png');
						}
					}
				}
				.drag{
					padding-top: 100px;
					.drag_box{
						width: 334px;
						height: 150px;
						border:1px dotted #DCDCDC;
						font-size: 16px;
						> div{
							text-align: center;
							margin-top: 50px;
							p{
								line-height: 40px;
								width: 80px;
								margin: 0 auto;
							}
						}
						.blue{
							color: #006CE3;
						}
						.green{
							color: #37be29;
						}
					}
					> p {
						text-align: center;
						margin-top: 20px;
						button{
							display: inline-block;
							width: 156px;
							height: 34px;
							padding: 10px 0;
							border-color: #2281E9;
							border-radius: 2px;
							background: #2281E9;
							font-size: 16px;
							color: #fff;
						}
					}
				}
			}
		}
		.main_bottom{
			margin-top: 40px;
			position: relative;
			& > span{
				position: absolute;
				top: 0;
				right: 0;
				display: block;
				width: 193px;
				height: 42px;
				line-height: 42px;
				text-align: center;
				color:#004DA1;
				border-left: 1px solid #004DA1;
				font-size: 16px;
			}
			.el-tabs--border-card{
				border:none;
				box-shadow: none;
				.el-tabs__header{
					border:none;
					background: #C7CED6;
					.el-tabs__item{
						font-size: 18px;
						padding-left: 30px;
						> span{
							position: relative;
							padding-left: 36px;
						}
						i{
							display: inline-block;
							position: absolute;
							top:-1px;
							left: 0;
							width: 24px;
							height: 24px;
							background: url('../../assets/r3/p1_1.png') no-repeat center;
							&.p2{
								background-image: url('../../assets/r3/p2_1.png');
							}
						}
						&.is-active{
							background: #C7CED6;
							color:#016FE7;
							border-right-color:#016FE7;
							.p1{
								background-image: url('../../assets/r3/p1_2.png');
							}
							.p2{
								background-image: url('../../assets/r3/p2_2.png');
							}
						}
					}
				}
				.el-tabs__content{
					padding: 50px 0;
					.el-tab-pane > ul{
						li{
							min-height: 112px;
							line-height: 112px;
							.left{
								width: 950px;
								float: left;
								padding-left: 14px;
								button{
									background: #1278E7;
									font-size: 16px;
									color: #fff;
									margin-bottom: 40px;
								}
								> span{
									border-bottom: 1px solid #37BE29;
									color: #37BE29;
									font-size: 16px;
									padding: 2px 5px;
									position: relative;
									top: -6px;
									cursor:pointer;
								}
							}
							.right{
								border-left: 1px solid #C7CED6;
								width: 193px;
								float: right;
								height: 112px;
								line-height: 112px;
								text-align: center;
								display: flex;
								justify-content:space-around;
								span{
									width: 24px;
									height: 100%;
									font-size: 0;
									cursor: pointer;
									&.edit{
										background: url('../../assets/change.png') no-repeat center;
										&:hover{
											background-image: url('../../assets/structure/edit_hover.png');
										}
									}
									&.copy{
										background: url('../../assets/structure/copy.png') no-repeat center;
										&:hover{
											background-image: url('../../assets/structure/copy_hover.png');
										}
									}
									&.del{
										background: url('../../assets/delete.png') no-repeat center;
										&:hover{
											background-image: url('../../assets/structure/del_hover.png');
										}
									}
								}
							}
							& + li{
								border-top: 1px dashed #E0E4E9;
								margin-top: 49px;
								padding-top: 49px;
							}
						}

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
	#chain-graph {
      width: 100%;
      height: 800px;
    }


}
.el-tooltip__popper.is-light{
	border:none !important;
	background: transparent !important;
}

</style>
