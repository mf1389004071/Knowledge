<template>
  <div id="LawTagMaintain">
	  	<div class="line_box">
	  		<div class="line ishover" v-for="(item,index) in List.data">
	  			<el-button v-if="item.category == 'tag'">{{item.name}}</el-button>
	  			<span v-if="item.category == 'relation'">{{item.name}}</span>
	  			<!-- <el-button :id="item.en_name" v-if="item.category == 'relation'"></el-button> -->
	  			<div class="tip">
	  				<span @click="editItem(index)">修改</span>
	  				<span @click="delItem(index)">删除</span>
	  			</div>
	  		</div>
	  		<div class="line">
	  			<el-button class="last-button">待选标签</el-button>
	  		</div>
	  		<div class="line">
	  			<span class="last-span">待选关系</span>
	  		</div>
	  		<el-button class="save" @click="construct">保存</el-button>
	  	</div>

        <div class="list_box">
            <div class="list tag">
                <div class="title">
	      	    	<div class="search">
	      	    		<span class="span">
	      	    			<el-select v-model="law" slot="prepend" :loading="loading.law" clearable placeholder="法律分类">
	      	    			    <el-option 
	      	    			        v-for="item in law_categories"
	      	    			        :key = "item.id"
	      	    			        :label="item.zh_name"
	      	    			        :value = "item.id">
	      	    			    </el-option>
	      	    			</el-select>
	      	    		</span>
	      	    		<el-input placeholder="请输入内容搜索标签" v-model="tagList.value" @change="tagList.page = 1;loadTags()" icon="search">
	      	    		</el-input>
	      	    	</div>
	      		</div>
	            <div class="content">
	                <div class="items" v-loading="loading.tag">
		                <template  v-for="(item,index) in tagList.data">
		                	<div class="item" @click="list(item)" :title="item.name" v-text="(item.name.length > 24) ? (item.name.substring(0, 24) + '...') : item.name"></div>
		                </template>
	                </div>
	                <div class="bottom">
		      			<el-button type="text" @click="page('prev')" :disabled="tagList.page==1">
	      			       <i class="el-icon-arrow-left"></i>
	      			    </el-button>
	      			    <span class="span">
	      			    	{{tagList.page}} / {{tagList.max_page}} 页
	      			    </span>
	      			    <span class="span">
	      			        前往 <el-input  class="number" v-model="tagList.page" @change="loadTags" :min="1" :max="tagList.max_page"></el-input> 页
	      			    </span>
	      			    <el-button type="text" @click="page('!prev')" :disabled="tagList.has_more==false">
	      			       <i class="el-icon-arrow-right"></i>
	      			    </el-button>
	      		    </div>
	            </div>
            </div>

	        <div class="list relation">
	            <div class="title">
  	                <span @click="addRelationship">添加关系</span>
  	                <span>选择关系</span>
  	                <span><i class="el-icon-search"></i></span>
  	            </div>
	            <div class="content">
	                <div class="items">
		                <template  v-for="(item,index) in relationList.data">
		                   <div class="item" @click="list(item)">
		                        <span></span>
		                        <span>{{item.name}}</span>
		                        <!-- <span :id="item.en_name"></span> -->
			                   	<span></span>
		                   </div>
		                </template>
	                </div>
	                <div class="bottom">
	                </div>
	            </div>
	        </div>
        </div>
	    <div class="main_bottom">

	    	<el-tabs type="border-card">
	    		<el-tab-pane>
	    			<span slot="label"><i class="p1"></i> 已完成标签链</span>
	    			<ul v-loading="loading.chains">
	    				<li class="clearfloat" v-for="chain in chains">
	    				    <div class="content">
		    					<div class="left">
		    						<el-tooltip placement="top" v-for="(item,index) in chain.data">
		    							<div slot="content">{{item.name}}</div>
		    							<el-button v-if="index%2==0" v-text="item.name"></el-button>
		    							<span v-if="index%2!=0" id="text">{{item.name}}</span>
		    							<!-- <span :id="item.en_name"></span> -->
		    							{{item}}
		    						</el-tooltip>
		    					</div>
		    					<div class="right">
		    						<!-- <span @click="edit(chain)" class="edit">修改</span> -->
		    						<span @click="copy(chain)" class="copy">复制</span>
		    						<span @click="clear(chain)" class="del">删除</span>
		    					</div>
	    					</div>
	    					<p>
	    						<span>编辑人：{{chain.owner?chain.owner:'南京擎盾'}}</span>
	    						<span>最后编辑时间：{{chain.time.substring(0,19)}}</span>
	    					</p>
	    				</li>
	    			</ul>
	    			<div class="pagination">
	    				<el-pagination
		    				@size-change="handleSizeChange"
		    				@current-change="handleCurrentChange"
		    				:current-page="chainList.page"
		    				:page-sizes="[5,10,15]"
		    				:page-size="chainList.pageSize"
		    				layout="prev, pager, next, sizes, jumper"
		    				:total="chainList.total">
		    			</el-pagination>
	    			</div>
	    		</el-tab-pane>
	    		<el-tab-pane>
	    			<span slot="label"><i class="p2"></i> 查看标签链图谱</span>
	    			<div>
	    				111
	    			</div>
	    		</el-tab-pane>
	    	</el-tabs>
	    	<span>操作</span>
	    </div>

	    <el-dialog
		    class="addRelation"
		    title="新建关系"
		    :modal="addRelationshipDialogModal"
		    v-model="addRelationshipDialog"
		    size="tiny">
		    <span>关系名称</span>
		    <el-input v-model="addRelationshipName" placeholder="请输入关系名称"></el-input>
		    <div slot="footer" class="dialog-footer">
		    	<el-button @click="addRelationshipDialog = false">取 消</el-button>
		    	<el-button type="primary" @click="concernAddRelationship">确 定</el-button>
		    </div>
		</el-dialog>

    </div>
</template>

<script>

import axios from '../../js/axios-api.js';
export default{
	data(){
		return{
			graphID:'914a422e406cb2879da62295a86f4ef5',
			tagList:{
				value:'',
				data:[],
				pageSize:10,
				max_page:1,
				page: 1,
				has_more: false
			},
			relationList:{
				value:'',
				data:[]
			},
			List:{
				id:'',
				desc:'',
				data:[]
			},
	        chains:[],
	        chainList:{
	            page:1,
	            pageSize:10,
	            total:10,
	        },
			//修改标签或关系的index
	        editItemIndex:-1,
	        filteredCause:'',
	        loading:{
	        	law: false,
	        	tag: false,
	        	chains:false
	        },
	        law:'',
	        law_categories:[],
	        addRelationshipName: '',
	        addRelationshipDialog: false,
	        addRelationshipDialogModal: false,
		}
	},
	watch:{
	},
	computed:{
		username(){
			return JSON.parse(this.user.config.data).username;
		}
	},
	mounted(){
		this.init();
		this.loadlaws();
		this.loadTags();
		this.loadRelations();
	},
	watch:{
		'law'(val){
			this.loadTags();
		}
	},
	methods:{
		handleSizeChange(val){
			this.chainList.pageSize = val;
			this.init();
		},
		handleCurrentChange(val){
			this.chainList.page = val;
			this.init();
			console.log(this.loadFlag);
		},
		// 添加关系
		addRelationship() {
			this.addRelationshipDialog = true;
		},
		concernAddRelationship() {
			var params = {
				rel_name: this.addRelationshipName
			}
			axios.post(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graphID + '/relationships?axios=1', params).then(res => {
				if (res.data.code === 0) {
					this.$message.success('成功新建关系！');
					this.loadRelations();
				} else {
					this.$message.error(res.data.msg);
				}
			});
			this.addRelationshipDialog = false;
		},
		init(){
			//获取图的已有标签链
			var params = {
				page_size: this.chainList.pageSize,
				page: this.chainList.page,
			}
			this.loading.chains = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains',{params:params}).then((res) =>{
			  	if (res.data.code == 0) {
			  		this.chainList.total = res.data.pager.total;
			  		this.chains = [];
			  		res.data.data.forEach((chain) =>{
			  			var data = [];
				  		var len = chain.chain_linked.length;
				  		var length = chain.maintain.length;
				  		for(var i=0; i<len; i++){
				  			var elem = chain.chain_linked[i];
				  			data.push({
				  				id: elem.id,
				  				name: elem.name,
				  				en_name:elem.en_name ? elem.en_name : '',
				  				category: (i%2 == 0) ? 'tag' : 'relation'
				  			})
				  		}
			  			this.chains.push({
			  				id: chain._id,
			  				desc: chain.chain_statement,
			  				data: data,
			  				owner:chain.maintain[length-1].user_name,
			  				time:chain.maintain[length-1].operation_time
			  			});
			  		})
			  		this.loading.chains = false;
			 	}else{
			 		this.$message.error(res.data.msg);
			 		this.loading.chains = false;
			 		return;
			 	}
			  }).catch((err) =>{
			  	  // this.$message.error('加载标签链错误');
			  })
		},
		//获取图的所有关系
		loadRelations(){
			axios.get(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID)
			 .then((res) =>{
			 	if (res.data.code == 0) {
			 		this.relationList.data = [];
			 		res.data.data.rels.forEach((rel) =>{
			 			this.relationList.data.push({
			 				id: rel.id,
			 				name: rel.name,
			 				en_name: rel.en_name,
			 				category:"relation"
			 			})
			 		})
			 	}else{
			 		this.$message.error(res.data.msg);
			 		return;
			 	}
			 }).catch((err) =>{
			 	this.$message.error('加载关系错误');
			 })
		},
		//获取所有tags
		loadTags(){
		    var params = {
		    	keyword: this.tagList.value ? this.tagList.value: '',
		    	law_type: this.law ? this.law :'',
		    	page_size: this.tagList.pageSize,
		    	page: this.tagList.page,
		    };
		    this.loading.tag = true;
		    axios.get(this.$store.state.TagUrl+'/api/tag/tags',{params:params}).then((res) =>{
		      	if (res.data.code == 0) {
		      		this.tagList.has_more = res.data.pager.has_more;
		      		this.tagList.max_page = res.data.pager.max_page;
		      		this.tagList.data = [];
		      		res.data.data.forEach((elem) => {
		      			this.tagList.data.push({
		      				id: elem.id,
		      				name: elem.zh_name,
		      				category:'tag'
		      			});
		      		});
		      		this.loading.tag = false;
			 	}else{
			 		this.$message.error(res.data.msg);
		      		this.loading.tag = false;
			 		return;
			 	}
		      }).catch((err) =>{
		          this.$message.error('加载标签错误');
		      })
		},
		//加载法律分类
		loadlaws(){
			this.loading.law = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/law_categorys').then((res) =>{
				if(res.data.code == 0){
					this.loading.law = false;
					this.law_categories = res.data.data;
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		page(el){
			el == 'prev' ? this.tagList.page-- : this.tagList.page++;
			this.loadTags();
		},
		//建标签链
		list(item){
			if(this.editItemIndex != -1 ){
				var index = this.editItemIndex;
				$('.'+this.List.data[index].category).removeClass('dark').siblings().removeClass('dark');
				if(this.List.data[index].category == item.category){
					this.$set(this.List.data, index, item);
					$('.ishover').eq(index).removeClass('hover');
					this.editItemIndex = -1;
					if(this.List.data.length % 2 == 0){
						$('.tag').removeClass('dark');
						$('.relation').addClass('dark');
					}else{
						$('.relation').removeClass('dark');
						$('.tag').addClass('dark');
					}

				}
			}else{
				var len = this.List.data.length;
				if(item.category == 'relation' && (len+ 1) % 2 == 0){
					this.List.data.push(item);
					$('.last-span').css('display', 'none');
					$('.tag').removeClass('dark');
					$('.relation').addClass('dark');
				}
				if(item.category == 'tag' && (len + 1) % 2 == 1){
					this.List.data.push(item);
					$('.last-button').css('display', 'none');
					$('.relation').removeClass('dark');
					$('.tag').addClass('dark')
				}
			}
		},
		// 删除链中的标签或关系
		delItem(index){
			this.List.data.splice(index);
			$('.list').removeClass('dark');
			if(index % 2 == 0){
				$('.relation').addClass('dark');
			}else{
				$('.tag').addClass('dark');
			}
			if(index == 0){
				$('.last-button').css('display', 'block');
				$('.last-span').css('display', 'block');
			}

		},
		// 修改单个标签或关系
		editItem(index){
			this.editItemIndex = index;
			$('.ishover').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
			$('.ishover').eq(index).siblings().removeClass('hover').find('.tip span:first-child').removeClass('hover');
			if(index % 2 ==0){
				$('.tag').removeClass('dark');
				$('.relation').addClass('dark');
			}else{
				$('.relation').removeClass('dark');
				$('.tag').addClass('dark');
			}
		},
		//保存新建标签链
		construct(){
			var length = this.List.data.length;
			var data = [];
			this.List.data.forEach((elem) =>{
				data.push(elem.id);
			})
			//判断标签链的格式是否标准
			if((length-1)%2 ==0){
				axios.post(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains?axios=1',{
					chain_linked: JSON.stringify(data),
				}).then((res) =>{
					if (res.data.code == 0) {
						this.$message.success('保存成功');
						this.init();
					}else{
						this.$message.error(res.data.msg);
						return;
					}
				})
				// axios.post(this.$store.state.TagUrl+'/api/tag/chain?axios=1',{
				// 	chain_linked:JSON.stringify(data),
				// 	graph_id:this.graphID,
				// 	user_name:this.username,
				// 	source_id:''
				// })
				//  .then((res) =>{
				// 	if (res.data.code == 0) {
				// 		axios.post(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains?axios=1',{
				// 			chain_id: res.data.data.chain_id,
				// 			chain_desc: res.data.data.chain_desc
				// 		}).then((res) =>{
				// 			if (res.data.code == 0) {
				// 				this.$message.success('保存成功');
				// 				this.init();
				// 			}else{
				// 				this.$message.error(res.data.msg);
				// 				return;
				// 			}
				// 		})
				// 	}else{
				// 		this.$message.error(res.data.msg);
				// 		return;
				// 	}
				// })
				this.List = {
					id:'',
					data:[]
				};
				$('.relation').removeClass('dark');
				$('.tag').removeClass('dark');
				$('.last-button').css('display','block');
				$('.last-span').css('display','block');
			}else{
				this.$message.warning('推理型标签链应以标签结尾，无法保存！');
			}
		},
		// 修改标签链
		// edit(chain){
		// 	document.body.scrollTop = 0;
		// 	document.documentElement.scrollTop = 0;
		// 	this.List = JSON.parse(JSON.stringify(chain));
		// 	$('.last-span,.last-button').css('display', 'none');
		// 	$('.list').removeClass('dark');
		// },
		// 复制标签链
		copy(chain){
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			this.List = JSON.parse(JSON.stringify(chain));
			this.List.id = null;
			$('.last-span,.last-button').css('display', 'none');
			$('#unselected').css('display','none');
			$('#selected').css('display','block');
		},
		// 删除标签链
		clear(chain){
			this.$confirm('此操作将删除图中该标签链, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				axios.delete(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains/'+chain.id).then((res) =>{
					if (res.data.code == 0) {
						this.$message.success('删除成功');
						this.init();
					}else{
						this.$message.error(res.data.msg);
						return;
					}
				})
			}).catch(() => {
				this.$message.info("已取消删除");
				// this.$message({
				// 	type:'info',
				// 	duration:0
				// })
			});

		}
	}
}
</script>

<style lang="less" scoped>
  
  #LawTagMaintain{
  	width:100%;
    .el-button{
      /* max-width:300px; */
      white-space:initial;
      line-height:initial;
    }
    #and{
    	background: url('../../assets/common/and.png') no-repeat center;
    }
    #related {
    	background: url('../../assets/common/related.png') no-repeat center;
    }
    #equal {
    	background: url('../../assets/common/equal.png') no-repeat center;
    }
    #infer{
    	background: url('../../assets/common/infer.png') no-repeat center;
    }
    #belongto{
    	background: url('../../assets/common/belongto.png') no-repeat center;
    }
    #or{
    	background: url('../../assets/common/or.png') no-repeat center;
    }
    .list_box{
      width: 80%;
      margin: auto;
      margin-top: 6%;
      display: flex;
      justify-content:space-between;
      .list{
        width:45%;
        /* height:490px; */
        height:600px;
        text-align: center;
        &.dark{
          position: relative;
          &::after{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0,0,0,.5);
            width: 100%;
            height: 478px;
          }
        }
        .title{
        	width:100%;
        	height:55px;
        	line-height:55px;
        	font-size: 18px;
        	display: flex;
        	justify-content:space-around;
        	span{
        		max-width:120px;
        		color:#fff;
        		i{
        			font-size:20px;
        			/* width:60px; */
        		}
        	}
        }
        .search{
            width:98%;
            height:70%;
            margin-top:7px;
            line-height:45px;
            padding-right:25px;
            display: flex;
            justify-content:space-around;
            .span{
	            width:30%;
	            height:95%;
	            font-size:18px;
	            line-height:40px;
	            text-align:center;
	            .el-select{
		            height:98%;
		            margin-top:2%;
		              .el-input{
		                width:100%;
		                height:98%;
		                line-height:40px;
		                border:none;
		                .el-input__inner{
		                	height:32px;
		                	font-size:18px;
		                }
		                .el-input__icon{
		                	top:50%;
		                }
		            }
	            }
            }
            .el-input{
            	width:60%;
            	height:32px;
            	border-radius:0;
            	.el-input__inner{
            		color:#fff;
            		font-size:16px;
            		height:100%;
            		border:0;
            		border-radius:20px;
            	}
            }
        }
        .content{
          height: 86%;
          border:1px solid #2282E9;
          border-top:0;
          .items{
            /* height: 86%; */
            height:90%;
            /* overflow-y: scroll; */
            .item{
              height:45px;
              line-height: 45px;
              font-size: 16px;
              color:#2282E9;
              cursor: pointer;
              display: flex;
              justify-content:space-around;
              border-bottom:2px solid #9DC7F4;
              white-space:initial;
              &:hover{
	            color:#fff;
	            background:#67A6ED;
              }
            }
            .even{
              background:#F5F5F5;
            }
          }
          .bottom{
          	display:flex;
          	justify-content:space-between;
          	padding:6px 10px;
          	.el-button{
          		text-align:center;
          		width:40px;
          		height:40px;
          		border-radius:30px;
          		margin-top: 5px;
          		&:hover{
          			background:#f5f5f5;
          		}
          	}
          	.span{
          		color: #20a0ff;
          		line-height:45px;
          		border:0;
          		padding: 0 5px;
          		font-size:14px;
          		.number{
          			width: 44px;
          			height:20px;
          			border: none;
          			.el-input__inner{
          				width: 40px;
          				height: 20px;
          				color: #20a0ff;
          				padding: 0;
          				border-radius:0;
          				text-align:center;
          				&:hover{
          					background:#F5F5F5
          				}
          			}
          		}
          	}
          }
        }
        &.tag{
        	input::-webkit-input-placeholder { /* WebKit browsers */ 
        		color:#fff;
        		font-size:18px;
        		padding-left:2px;
        	}
        	input:-moz-placeholder {  /* Mozilla Firefox 4 to 18 */ 
        		color:#fff;
        		font-size:18px;
        		padding-left:2px;
        	}
        	input::-moz-placeholder {  /* Mozilla Firefox 19+  */
        		color:#fff;
        		font-size:18px;
        		padding-left:2px;
        	}
        	input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
        		color:#fff;
        		font-size:18px;
        		padding-left:2px;
        	} 
        	.title{
        		background:#2282E9;
        	}
        	.search{
        		.el-input{
        			.el-input__icon{
						line-height:inherit;
					}
        			.el-input__inner{
        				background:#0053AF;
        			}
        		}
        		.span{
        			background:#2282E9;
        			.el-input__inner{
        				background:#2282E9;
        			}
        		}
        	}
        }
        &.relation{
        	.title{
        		background:#2282E9;
        	}
        	.content{
        		overflow-y:scroll;
        	}
        	.item{
        		span{
        			width:100%;
        			height:45px;
        		}
                &:hover{
                	#and{
                	    background: url('../../assets/common/and_hover.png') no-repeat center;
                	}
                	#related {
                		background: url('../../assets/common/related_hover.png') no-repeat center;
                	}
                	#equal {
                		background: url('../../assets/common/equal_hover.png') no-repeat center;
                	}
                	#infer{
                		background: url('../../assets/common/infer_hover.png') no-repeat center
                	}
                	#belongto{
                		background: url('../../assets/common/belongto_hover.png') no-repeat center;
                	}
                	#or{
                		background: url('../../assets/lawtag/or_hover.png') no-repeat center;
                	}
                }
        	}
        	.is-disabled{
        		color:#bfcbd9;
        	}
        }
      }
    }
    .line_box{
      width:80%;
      margin-top:100px;
      margin-left:10%;
      .save{
      	background:#fff;
      	border:none;
        position: absolute;
        right:10%;
        background: url('../../assets/layer/save.png') no-repeat center;
        font-size: 0;
        width: 95px;
        height: 45px;
        &:hover{
        	background: url('../../assets/layer/save_hover.png') no-repeat center;
        }
      }
      .line{
        position: relative;
        display: inline-block;
        margin-top:20px;
        margin-bottom: 25px;
        button{
          background:#fff;
          color:#1278E7;
          border-radius:5px;
          border:1px solid #1278E7;
          font-size: 16px;
          &.last-button{
            color: #ACACAC;
            font-size: 14px;
            background: #F6F6F6;
            border:1px dotted #D2D2D2;
          }
        }
        &.ishover:hover,&.hover{
          button{
            background: #67A6ED;
            color:#fff;
            font-size: 18px;
            border-color:#67A6ED;
            min-width: 150px;
          }
          .tip{
            opacity: 1;
          }
          > span{
            color: #67A6ED;
            border:2px solid #67A6ED;
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
          padding: 2px 12px;
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
        #and{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/and.png') no-repeat center;
        }
        #related{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/related.png') no-repeat center;
        }
        #equal{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/equal.png') no-repeat center;
        }
        #infer{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/infer.png') no-repeat center;
        }
        #belongto{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/belongto.png') no-repeat center;
        }
        #or{
        	cursor: pointer;
        	width:45px;
        	height:35px;
        	display: inline-block;
        	border:none;
        	background: url('../../assets/common/or.png') no-repeat center;
        }
        .tip{
          position: absolute;
          height: 80%;
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
              background-image: url('../../assets/structure/edit_hover.png');
            }
            &:last-child{
              background-image: url('../../assets/r3/delete.png');
              &:hover,&.hover{
                background-image: url('../../assets/structure/del_hover.png');
              }
            }
          }
        }
      }
    }

    .main_bottom{
      width:80%;
      margin: auto;
      margin-top:80px;
      position: relative;
      & > span{
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 19%;
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
              /* border-right-color:#016FE7; */
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
              list-style: none;
              min-height: 112px;
              line-height: 112px; 
              border: 1px solid #D2D2D2;
              padding:5px 15px;
              background:#FAFAFA;
              .content{
              	 display: flex;
              	 justify-content:space-between;
              	 padding-left:10px;
              	 .left{
              	 	width: 81%;
              	 	float: left;
              	 	button{
              	 		background:#fff;
              	 		color: #1278E7;
              	 		border-radius:5px;
              	 		border: 1px solid #1278E7;
              	 		font-size: 16px;
              	 		margin-bottom: 40px;
              	 	}
              	 	> span{
              	 		/* position: relative;
              	 		width:45px;
              	 		height:35px;
              	 		top: 8px; */
              	 		display: inline-block;
              	 		cursor:pointer;
              	 	}
              	 	#text{
              	 		position: relative;
              	 		color: #37BE29;
              	 		font-size: 16px;
              	 		line-height:initial;
              	 		top: -10px;
              	 		padding: 2px 12px;
              	 		width:initial;
              	 		border-bottom: 1px solid #37BE29;
              	 		text-align:center;
              	 	} 
              	 }
              	 .right{
              	 	width: 17.9%;
              	 	float: right;
              	 	height: 112px;
              	 	/* line-height: 112px; */
              	 	line-height:42px;
              	 	text-align: center;
              	 	display: flex;
              	 	justify-content:space-around;
              	 	span{
              	 		width: 24px;
              	 		height: 100%;
              	 		font-size: 0;
              	 		cursor: pointer;
              	 		&.edit{
              	 			background: url('../../assets/layer/edit.png') no-repeat center;
              	 			&:hover{
              	 				background-image: url('../../assets/layer/edit_hover.png');
              	 			}
              	 		}
              	 		&.copy{
              	 			background: url('../../assets/layer/copy.png') no-repeat center;
              	 			&:hover{
              	 				background-image: url('../../assets/layer/copy_hover.png');
              	 			}
              	 		}
              	 		&.del{
              	 			background: url('../../assets/layer/delete.png') no-repeat center;
              	 			&:hover{
              	 				background-image: url('../../assets/layer/del_hover.png');
              	 			}
              	 		}
              	 	}
              	 }
              }
              p{
              	border-top: 2px dotted #D2D2D2;
              	height: 48px;
              	line-height: 48px;
              	font-size: 14px;
              	color:#7B8895;
              	span{
              		margin: 0 18px;
              	}
              }
              & + li{
                margin-top: 49px;
              }
            }
        }
	        .pagination{
	          	display: inline-block;
	          	width: 100%;
	            height: 100px;
	          	margin: 30px auto;
	          	.el-pagination{
	          		width:90%;
	          		margin:auto;
	          	}
	        }
        }
      }
    }
    .addRelation {
    	top: -10%;
    	.el-dialog {
    		.el-dialog__body {
    			height: 80px;
    			> span {
    				font-size: 16px;
    				color: #666;
    				font-weight: 600;
    				line-height: 40px;
    				margin-left: 20px;
    			}
    			.el-input {
    				display: inline-block;
    				width: 50%;
    				margin-left: 20px;
    			}
    		}
    	}
    }
  }
</style>

