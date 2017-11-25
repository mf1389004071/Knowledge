<template>
	<div class="lawtexttag">
		<div class="graph_box">
	      <div class="bread">
	        <el-breadcrumb separator="/">
	          <el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
	          <el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
	          <el-breadcrumb-item><span style="color: red">法律文本标签</span></el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </div>
		<search ref="search"></search>
		<div class="text">
			<div class="text-content">
				{{content.content?content.content:''}}
			</div>
			<p class="button">
				<el-button @click="prevPage" :disabled="disabled.prevPage">上一条</el-button>
				<el-button @click="nextPage" :disabled="disabled.nextPage">下一条</el-button>
			</p>
		</div>
		<section class="handle">
			<div class="handle-list">
				<div class="list-item" v-for="(item,index) in handleList.data">
					<span v-if="item.category === 'tag'" class="tag">{{item.name}}</span>
					<i v-if="item.category === 'rel'" :class="['label',item.en_name?item.en_name:'re_line']">{{item.en_name?'':item.name}}</i>
					<div class="tip">
						<span @click="editItem(item.category,index)">修改</span>
						<span @click="delItem(index,handleList.data)">删除</span>
					</div>
				</div>
<!-- 				
				<span class="tag">年利率24%以下</span>
				<i class="label"> =></i>
				<span class="tag">按约支付利息</span>
				<i class="label"> + </i>
				<span class="tag">年利率24%以下</span> -->
			</div>
			<el-button class="save" @click="saveTagChain">保存</el-button>
		</section>

		<section class="options">
			<div class="tags">
				<div class="select-header">
					<el-select v-model="value.falv" @change="selectFalv" clearable placeholder="法律分类">
					    <el-option
					      v-for="item in options.falv"
					      :key="item.id"
					      :label="item.zh_name"
					      :value="item.id">
					    </el-option>
					</el-select>
					<el-input
					  placeholder="搜索"
					  icon="search"
					  v-model="value.tag"
					  :on-icon-click="searchTags"
					  @change="changeTags"
					  @keyup.native.enter="searchTags"
					  >
					</el-input>
				</div>
				<ul v-loading="loading.tag">
					<li v-for="item in list.tags" class="option-item" @click="addItem(item)">
						{{item.name}}
					</li>
				</ul>
			</div>
			<div class="rels">
				<div class="select-header">
					<span class="add-relation" @click="dialog.addrelation=true;">添加关系</span>
					<span>选择关系</span>
						<!-- <el-select v-model="value.falv" clearable placeholder="选择关系">
						    <el-option
						      v-for="item in options.falv"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
						<el-input
						  placeholder="搜索"
						  icon="search"
						  v-model="value.tag"
						  :on-icon-click="searchTags"
						  >
						</el-input> -->
				</div>
				<ul>
					<li v-for="item in list.rels" class="option-item" @click="addItem(item)">
						<i :class="['label',item.en_name]"></i>{{item.name}}
					</li>
				</ul>
				<!-- <div class="add-rel">
					<p>
						<el-input v-model="value.addtag" placeholder="请输入标签名"></el-input>
					</p>
					
					<i class="icon-add"></i>
				</div> -->
			</div>
			
		</section>

		<section class="tagsline">
			<header>
				<nav class="left">
					<span class="tab1 on" @click="toggleTab('tab1')"><i class="icon_tab1"></i>已完成标签链</span>
					<span class="tab2" @click="toggleTab('tab2')"><i class="icon_tab2"></i>查看标签链图谱</span>
				</nav>
				<nav class="right"><i class="icon_handle"></i>操作</nav>
			</header>
			<div v-if="tabs.tab1">
				<ul class="tagsline-list" v-loading="loading.list">
					<li v-for="(item,index) in list.chains">
						<div class="list">
							<div class="left">
								<template  v-for="(list,index) in item.chain_linked">
									<span v-if="index % 2 === 0" class="tag">{{list.name}}</span>
									<i v-if="index % 2 === 1" :class="['label',list.en_name?list.en_name:'re_line']">{{list.en_name?'':list.name}}</i>
								</template>
								
							</div>
							<div class="right">
								<!-- <span class="edit" @click="edit(item)">修改</span> -->
								<span class="copy" @click="copy(item)">复制</span>
								<span class="del" @click="delList(item.url,index)">删除</span>
							</div>
						</div>
						<p class="edit-info">
							<span>编辑人：{{item.maintain? item.maintain.length == 2 ? item.maintain[1].user_name : item.maintain[2].user_name : '未知'}}</span>
							<span>最后编辑日期：{{item.write_date.substring(0,10)}}</span>
						</p>
					</li>
				</ul>
				<div class="pagination">
		          <el-pagination
		            @size-change="handleSizeChange"
		            @current-change="handleCurrentChange"
		            :current-page="currentPage"
		            :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
		            :page-size="pager.page_size"
		            layout="prev, pager, next, sizes, jumper"
		            :total="pager.total">
		          </el-pagination>
		        </div>
			</div>
			
			<div v-if="tabs.tab2" id="tab2" v-loading="loading.list">
				<create v-if="loading.graph" :list="graphChainList" :visible="true" :editable='false'></create>
			</div>
		</section>

		<el-dialog
		    title="添加关系"
		    class="add-relation-dialog"
		    :visible.sync="dialog.addrelation"
		    :before-close="closeDialogAddRe"
		    @close="clearDialogAddRe"
		    size="tiny">
		    <el-input v-model="value.addrelation" placeholder="请输入关系名称"></el-input>
		    <div slot="footer" class="dialog-footer">
		    	<el-button @click="closeDialogAddRe">取 消</el-button>
		    	<el-button type="primary" @click="actionAddRe">确 定</el-button>
		    </div>
		</el-dialog>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	import search from './search.vue';
	import Create from '../Search/Create.vue';
	export default {
		data() {
			return {
				graphChainList:[],
				current_page: 1,
				// 当前页数
		        currentPage: 1,
		        // 总标签数
		        totalTags: 0,
        		pager: {},
				tabs:{
					tab1:true,
					tab2:false,
				},
				loading:{
					tag:false,
					list:false,
					graph:false
				},
				value:{
					falv:'',
					tag:'',
					addtag:'',
					addrelation:'',
				},
				dialog:{
					addrelation:false,
				},
				options:{
					falv:[],
				},
				params:{
					tags:{
						law_type:'',
						keyword:''
					},
					rels:{

					}
				},
				list:{
					tags:[],
					rels:[],
					chains:[]
				},
				disabled:{
					nextPage:false,
					prevPage:false,
				},
				baseUrl:'',
				handleList:{
					id:'',
					data:[],
				},
				editItemIndex:-1,
				graphId:'',
				content:{},
			}
		},
		components: {search,Create},
		mounted(){
			this.getFalvOptions();
			this.getBaseUrl();
			this.getTagsList(this.params.tags);
		},
		computed:{
	    	user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		    	return JSON.parse(this.user.config.data).username;
		    },
	    },
	    watch:{
	    },
		methods:{
			// 弹出框：增加关系
			actionAddRe() {
				var params = {
					rel_name: this.value.addrelation
				}
				axios.post(this.$store.state.TagUrl + this.baseUrl + '/relationships?axios=1', params).then(res => {
					if (res.data.code === 0) {
						this.dialog.addrelation = false;
						this.$message.success('添加成功！');
						this.getRelsList();
					} else {
						this.$message.error(res.data.msg);
					}
				});
				
			},
			clearDialogAddRe(){
				this.value.addrelation = '';
			},
			closeDialogAddRe(){
				this.dialog.addrelation = false;
			},

			// 分页
			handleSizeChange(val){
		        this.pager.page_size = val;
		        this.getAllChains();
		    },
		    handleCurrentChange(val){
		        this.pager.page = val;
		        this.getAllChains();
		    },
			prevPage(){
				const search = this.$refs.search;
				const page = search.page - 1;
				const length = search.search[3].data.length;
				if(page >= 0){
					const val = search.search[3].data[page].value;
					search.search[3].value = val;
					search.select(val,'num');
				}
				
			},
			nextPage(){
				const search = this.$refs.search;
				const page = search.page + 1;
				const length = search.search[3].data.length;
				if(page < length){
					const val = search.search[3].data[page].value;
					search.search[3].value = val;
					search.select(val,'num');
				}
			},
			editItem(category,index){
	    		this.editItemIndex = index;
	    		$('.list-item').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
	    		$('.list-item').eq(index).siblings().removeClass('hover').find('.tip span').removeClass('hover');
	    		$('.' + category + 's').removeClass('dark').siblings().addClass('dark');
	    	},
	    	delItem(index,list){
	    		list.splice(index);
	    		$('.list').removeClass('dark');
	    		if(index % 2 == 0){
	    			$('.rels').addClass('dark');
	    		}else{
	    			$('.tags').addClass('dark');
	    		}
	    		// if(index == 0){
	    		// 	$('.last-button').css('display', 'block');
	    		// 	$('.last-span').css('display', 'block');
	    		// }
	    	},
			saveTagChain(){
				let chain_linked = [];
				this.handleList.data.map(elem => {
					chain_linked.push(elem.id)
				})
				const params = {
					chain_linked:JSON.stringify(chain_linked),
					source:JSON.stringify({
						source_id:this.content.value,
						type:'law',
					})
				};
				axios.post(this.$store.state.TagUrl + this.baseUrl + '/chains?axios=1',params)
					.then(res => {
						if(res.data.code === 0){
							this.handleList = {
								id:'',
								data:[],
							};
							this.getAllChains();
							$('.options > div').removeClass('dark');
							this.$message.success("保存成功！");
						}else{
							this.$message.error(res.data.msg);
						}
					})
			},
			copy(list){
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				this.handleList.data = list.chain_linked;
				// console.log(list.chain_linked);
			},
			edit(list){
				console.log(list,'list')
	    		// this.List = list.data.slice(0);
	    		// this.listId = list.id;
	    		// this.listOwner = list.owner;
	    		// $('.last-span,.last-button').css('display', 'none');
	    		// $('.list').removeClass('dark');
	    	},
	    	delList(url,index){
	    		this.$confirm('此操作将永久删除该标签链, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          axios.delete(this.$store.state.TagUrl + url)
	    			 .then(res => {
	    			 	if(res.data.code === 0){
	    			 		this.$message.success("删除成功！");
	    			 		this.list.chains.splice(index,1);
	    			 	}
	    			 })
		        }).catch(() => {
		          this.$message.info('已取消删除!');          
		        });
	    		
	    	},
			toggleTab(classname){
				$('.' + classname).addClass('on').siblings().removeClass('on');
				this.tabs = {
					tab1:false,
					tab2:false
				}
				this.tabs[classname] = true;
			},
			addItem(item){
				if(this.editItemIndex != -1 ){
					var index = this.editItemIndex;
					$('.'+this.handleList.data[index].category + 's').removeClass('dark').siblings().removeClass('dark');
					if(this.handleList.data[index].category == item.category){
						this.$set(this.handleList.data, index, item);
						$('.list-item').eq(index).removeClass('hover').find('.tip span').removeClass('hover');
						this.editItemIndex = -1;
						if(this.handleList.data.length % 2 == 0){
							$('.tags').removeClass('dark');
							$('.rels').addClass('dark');
						}else{
							$('.rels').removeClass('dark');
							$('.tags').addClass('dark');
						}

					}
				}else{
					if(item.category == 'rel' && (this.handleList.data.length + 1) % 2 == 0){
						this.handleList.data.push(item);
						$('.' + item.category + 's').addClass('dark').siblings().removeClass('dark');
					}
					if(item.category == 'tag' && (this.handleList.data.length + 1) % 2 == 1){
						this.handleList.data.push(item);
						$('.' + item.category + 's').addClass('dark').siblings().removeClass('dark');
					}
				}
			},
			getBaseUrl(){
				axios.get(this.$store.state.TagUrl + '/api/tag/graphs')
				     .then(res => {
				     	res.data.data.filter(item => {
				     		if(item.name === '法律文本标签图'){
				     			this.baseUrl = item.url;
				     			this.graphId = item.id;
				     		}
				     	});
				     	this.getRelsList();
				     	this.getAllChains();
				     })
			},
			getRelsList(){
				// console.log(this.$store.state.TagUrl + this.baseUrl);
				axios.get(this.$store.state.TagUrl + this.baseUrl)
					 .then(res => {
					 	this.list.rels = res.data.data.rels.map(row => {
					 		return {
					 			id:row.id,
					 			name:row.name,
					 			category:'rel',
					 			en_name:row.en_name
					 		}
					 	});
					 	// console.log(this.list.rels,'rels')
					 })
			},
			selectFalv(val){
				this.params.tags.law_type = val;
				this.getTagsList(this.params.tags);
			},
			searchTags(){
				this.params.tags.keyword = this.value.tag;
				this.getTagsList(this.params.tags);
			},
			changeTags(val){
				if(val == ''){
	    			this.params.tags.keyword = '';
	    			this.getTagsList(this.params.tags);
	    		}
			},
			getTagsList(params){
				this.loading.tag = true;
				axios.get(this.$store.state.TagUrl + '/api/tag/tags',{params})
					.then(res => {
						this.list.tags = res.data.data.map(item => {
							return {
								name:item.zh_name,
								id:item.id,
								category:'tag'
							}
						});
						this.loading.tag = false;
						// console.log(this.list.tags)
					})
			},
			getFalvOptions(){
				axios.get(this.$store.state.TagUrl + '/api/tag/law_categorys')
					 .then(res => {
					 	this.options.falv = res.data.data;
					 })
			},
			getAllChains(){
				const params = {
					source_id:this.content.value?this.content.value:'',
					page:this.pager.page?this.pager.page:1,
					page_size:this.pager.page_size?this.pager.page_size:10
				};
				this.loading.list = true;
				axios.get(this.$store.state.TagUrl + this.baseUrl + '/chains',{params})
					 .then(res => {
					 	if(res.data.data.length == 0){
					 		this.pager = {
					 			total:0,
					 			page:1
					 		};
					 		this.list.chains = [];
					 	}else{
					 		this.pager = res.data.pager;
						 	res.data.data.map(list => {
						 		list.chain_linked.map((row,index) => {
							 		const category = index % 2 === 0 ? "tag" : "rel";
							 		this.$set(row,"category",category);
							 	});

				 				var graphData = {};
				                var len = list.chain_linked.length;
				                for (var i = 0; i < len; i++) {
				                  var elem = list.chain_linked[i];
				                  graphData = {
				                    name: elem.name,
				                    category: elem.category=="rel"?"relation":elem.category,
				                    _id: elem.id,
				                    key: elem.id,
				                  }
				                  var graphListData = {
				                    id: list._id,
				                    key: graphData._id,
				                    text: graphData.name,
				                    params: graphData,
				                  };
				                  if (graphData.category == 'relation') {
				                    graphListData.from = list.chain_linked[i - 1].id;
				                    graphListData.to = list.chain_linked[i + 1].id;
				                  }
				                  var hasExisted=false;
				                  this.graphChainList.forEach((item)=>{
				                    if(graphListData.params.category=='entity'||graphListData.params.category=='tag'){
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
						 	this.list.chains = res.data.data;
					 	}
					 	this.loading.list = false;
					 	this.loading.graph=true;
					 })
			}
		}
	}
</script>

<style lang="less" scoped>
	.lawtexttag{
		.add-relation-dialog{
			.el-input{
				width: 60%;
				margin: 20px;
			}
		}
		.graph_box {
	      width: 100%;
	      height: 40px;
	      background: #ddd;
	      margin-top: 48px;
	      .name {
	        width: 80%;
	        height: 40px;
	        line-height: 40px;
	        font-size: 16px;
	        margin: 0 auto;
	      }
	      .bread{
	        width: 80%;
	        height: 40px;
	        line-height: 40px;
	        font-size: 16px;
	        margin: 0px auto;
	        >.el-breadcrumb{
	          height: 40px;
	          line-height: 40px;
	        }
	      }
	    }
	}
	.text{
		width: 80%;
		margin: 0 auto;
		margin-top: 20px;
		.text-content{
			width: 100%;
			min-height: 150px;
			border: 1px solid #4078b4;
			line-height: 1.5em;
			box-sizing: border-box;
			padding: 10px;
			font-size: 16px;
			color:#000000;
		}
		.button{
			margin-top: 26px;
			text-align: right;
			.el-button{
				background: #e7e7e7;
				font-size: 16px;
				border-radius: 2px;
				margin-left: 40px;
				&:hover,&:focus{
					background: #37be29;
					color:#fff;
					border-color:#37be29;
				}
				&.is-disabled:hover,&.is-disabled:focus{
					    color: #bfcbd9;
					    cursor: not-allowed;
					    background-image: none;
					    background-color: #eef1f6;
					    border-color: #d1dbe5;
				}
			}
		}
	}
	section{
		width: 80%;
		margin: 50px auto;
		&.handle{
			display: flex;
			justify-content:space-between;
			align-items: center;
			.handle-list{
				flex:1;
				.list-item{
					position: relative;
					display: inline-block;
					&:hover,&.hover{
						.tag{
							font-size: 20px;
							border-color: #F60062;
							min-width: 150px;
						}
						.tip{
							opacity: 1;
						}
						.label{
							color: #F60062;
							border:2px solid #F60062;
							padding:9px 10px;
							top: 0;
							min-width: 60px;
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
			}
			.save{
				margin-left: 20px;
				width: 79px;
				height: 36px;
				background: url('../../assets/layer/save.png') no-repeat center;
				font-size: 0;
				border: 0 none;
				&:hover{
					background-image: url('../../assets/layer/save_hover.png');
				}
			}
		}
		&.options{
			display: flex;
			justify-content:space-between;
			> div{
				width: 40%;
				min-width: 320px;
				border:1px solid #2281e9;
				&.dark{
					position: relative;
					&::after{
						content: '';
			            position: absolute;
			            top: 0;
			            left: 0;
			            right:0;
			            bottom:0;
			            background: rgba(0,0,0,.5);
					}
				}
				&.rels{
					ul{
						height: 358px;
					}
					.select-header > span{
						font-size: 18px;
						color:#fff;
						flex: 1;
    					text-align: center;
					}
					.select-header{
						> span{
							font-size: 18px;
							color:#fff;
							flex: 1;
	    					text-align: center;
						}
						.add-relation{
							cursor: pointer;
						}
					}
						
				}
				ul{
					height: 408px;
    				overflow-y: auto;
    				text-align: center;
    				font-size: 16px;
    				color:#006de5;
    				margin-bottom: -1px;
				}
				li{
					line-height: 50px;
					border-bottom: 1px solid #2281e9;
					cursor: pointer;
					&:hover{
						background: #67a6ec;
						color:#fff;
						.infer{
				    		background-image: url('../../assets/common/infer_hover.png');
				    	}
				    	.and{
					    	background-image: url('../../assets/common/and_hover.png');
					    }
					    // 属于
					    .belongto{
					    	background-image: url('../../assets/common/belongto_hover.png');
					    }
					    // 是
					    .equal{
					    	background-image: url('../../assets/common/equal_hover.png');
					    }
					    // 相关
					    .related{
					    	background-image: url('../../assets/common/related_hover.png');
					    }
					    // 或
					    .or{
					    	background-image: url('../../assets/common/or_hover.png');
					    }
					}
				}
				.option-item{
					padding-left: 20px;
				}
				.add-rel{
					text-align: center;
					font-size: 46px;
					background: #cfdae7;
					line-height: 50px;
					height: 50px;
				}
			}
		}
		&.tagsline{
			header{
				line-height: 50px;
				background: #e7ebf0;
				display: flex;
				justify-content:space-between;
				nav{
					font-size: 18px;
					&.left{
						span{
							display: inline-block;
							height: 100%;
							padding: 0 16px 0 40px;
							cursor: pointer;
							border-right: 1px solid transparent;
							&.on{
								border-right: 1px solid #016FE7;
								color:#016fe7;
								.icon_tab1{
					              background-image: url('../../assets/r3/p1_2.png');
					            }
					            .icon_tab2{
					              background-image: url('../../assets/r3/p2_2.png');
					            }
							}
							i{
				              display: inline-block;
				              width: 24px;
				              height: 100%;
				              vertical-align: middle;
				              margin-right: 16px;
				              background: url('../../assets/r3/p1_1.png') no-repeat center;
				              &.icon_tab2{
				                background-image: url('../../assets/r3/p2_1.png');
				              }
				            }
						}
					}
					&.right{
						color:#6e7175;
						width: 20%;
						text-align: center;
						border-left: 1px solid #c3cad2;
					}
				}
			}
			ul{
				li{
					margin-top: 20px;
					border:1px solid #e2e2e2;
					box-shadow: 2px 2px 2px 0px #eee;
					.list{
						display: flex;
						justify-content:space-between;
						align-items:center;
						padding: 30px 0;
						border-bottom: 1px dashed #dcdcdc;
						.left{
							margin-left: 40px;
						}
						.right{
							margin-left: 20px;
							width: 20%;
							text-align: center;
							border-left: 1px solid #e0e4e8;
							span{
								cursor: pointer;
								width: 24px;
								height: 24px;
								display: inline-block;
								margin: 0 20px;
								font-size: 0;
								background-repeat: no-repeat;
								background-position: center;
								&.edit{
									background-image:url('../../assets/layer/edit.png');
									&:hover{
										background-image: url('../../assets/layer/edit_hover.png');
									} 
								}
								&.copy{
									background-image:url('../../assets/layer/copy.png'); 
									&:hover{
										background-image: url('../../assets/layer/copy_hover.png');
									} 
								}
								&.del{
									background-image: url('../../assets/layer/delete.png');
									&:hover{
										background-image: url('../../assets/layer/del_hover.png');
									} 
								}
							}
						}
					}
					.edit-info{
						font-size: 14px;
						color:#b9b9b9;
						line-height: 48px;
						span{
							margin-left: 40px;
						}
					}
					
				}
			}
			#tab2{
				position: relative;
				height: 800px;
			}
			.pagination{
				margin: 20px 0;
				.el-pagination{
					width: 100%;
					margin-left: 0;
				}
			}
		}
	}
	// common
	.tag{
		padding: 0 10px;
		line-height: 36px;
		display: inline-block;
		border:1px solid #1278e7;
		border-radius: 3px;
		margin-bottom: 10px;
		font-size: 16px;
		color:#1278e7;
		text-align: center;
		cursor: pointer;
	}
	.label{
		margin: 0 20px;
		width: 25px;
	    height: 22px;
	    display: inline-block;
	    text-align: center;
	    vertical-align: middle;
	    font-size: 0;
	    cursor: pointer;
	    background-position: center;
	    background-repeat: no-repeat;
	    // 且
	    &.and{
	    	background-image: url('../../assets/common/and.png');
	    }
	    // 属于
	    &.belongto{
	    	background-image: url('../../assets/common/belongto.png');
	    }
	    // 是
	    &.equal{
	    	background-image: url('../../assets/common/equal.png');
	    }
	    // 相关
	    &.related{
	    	background-image: url('../../assets/common/related.png');
	    }
	    // 推导
	    &.infer{
	    	background-image: url('../../assets/common/infer.png');
	    }
	    // 或
	    &.or{
	    	background-image: url('../../assets/common/or.png');
	    }
	}
	.re_line{
	    border-bottom: 1px solid #37BE29;
	    color: #37BE29;
	    font-size: 16px;
	    font-style: normal;
	    width: auto;
	    margin: 0;
	    padding: 2px 12px;
	    position: relative;
	    top: -6px;
	}
	.select-header{
		display: flex;
		justify-content:space-between;
		border-bottom: 1px solid #2281e9;
		background: #2281e9;
		box-sizing: border-box;
		line-height: 50px;
		.el-select{
			// flex:1;
			.el-input{

			}
			.el-input__inner{
				

			}
		}
		> .el-input{
			// flex:1;
			padding: 0 6px;
			box-sizing: border-box;

		}
	}
	.icon_handle{
		display: inline-block;
		width: 16px;
		height: 100%;
		vertical-align: middle;
		background: url('../../assets/common/handle.png') no-repeat center;
		margin-right: 8px;
	}
	.icon-add{
		width: 30px;
		height: 30px;
		display: inline-block;
		background: url('../../assets/layer/addrel.png') no-repeat center;
		cursor: pointer;
	}

</style>
<style lang="less">
	.select-header{
		display: flex;
		justify-content:space-between;
		.el-select{
			.el-input__inner{
				border:0 none;
				color:#fff;
				font-size: 18px;
				background: transparent;
				text-align: center;
			}
			input::-webkit-input-placeholder { /* WebKit browsers*/
	            color:#fff;
	          }
	          input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
	            color:#fff;
	          }
	          input::-moz-placeholder {  /* Mozilla Firefox 19+*/
	            color:#fff;
	          }
	          input:-ms-input-placeholder { /* Internet Explorer 10+*/
	            color:#fff;
	          }
		}
		> .el-input{
			.el-icon-search{
				right:10px;
			}
			.el-input__inner{
				background: #0053ae;
				border:0 none;
				border-radius: 30px;
				color:#fff;
				font-size: 14px;
				padding-left: 15px;
			}
		}
	}
</style>