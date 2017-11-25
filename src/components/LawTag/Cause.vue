<template>
    <div id="LawTagCause">
    	<div class="graph_box">
    		<div class="bread">
    			<el-breadcrumb separator="/">
    				<el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
    				<el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
    				<el-breadcrumb-item><span style="color: red">案由识别图</span></el-breadcrumb-item>
    			</el-breadcrumb>
    		</div>
    	</div>
        <div class="search_boxx">
           <div class="heading">
                <div class="filter">
                    <div class="select cause">
			           	<el-select v-model="params.case" :loading="loading.para" clearable remote filterable placeholder="案由" :remote-method="loadCases" @change="loadcaseInfo();select()">
			           		<el-option
				           		v-for="item in caseList"
				           		:key = "item.id"
				           		:label="item.name"
				           		:value = "item.id">
				           	</el-option>
			           </el-select>
			           <i class="el-icon-search"></i>
		            </div>
	                <div class="select caseInfo">
			           	<el-select v-model="params.caseInfo" :loading="loading.caseInfo" clearable filterable placeholder="裁判文书" @change="loadParas();select()">
			           		<el-option
				           		v-for="item in caseInfoList"
				           		:key = "item.id"
				           		:label="item.name"
				           		:value = "item.id">
				           	</el-option>
			           </el-select>
		            </div>
		            <div class="select para">
		               <el-select v-model="params.para" clearable filterable placeholder="段落" @change="getContent();select()">
			           		<el-option
				           		v-for="item in paraList"
				           		:key = "item.para_tag"
				           		:label="item.para_tag_name"
				           		:value = "item.para_tag">
				           	</el-option>
			           </el-select>
		            </div>
		        </div>
		        <div class="btn">
		           <el-button id="show" @click="caseShow"> 查看文本</el-button>
		           <el-button id="hide" @click="caseHide"> 隐藏文本</el-button>
		        </div>
           </div>
           <transition name="slide-fade">
           <div class="result" v-show="caseInfoShow" v-loading="loading.para">
	           	<textarea readonly>{{caseInfo.content}}</textarea>
	           	<div class="paging">
	           	   <el-button type="success" @click="prevPara" :disabled="caseInfo.index==0">上一段</el-button>
	           	   <el-button type="success" @click="nextPara" :disabled="caseInfo.index>=paraList.length-1">下一段</el-button>
	           	</div>
           </div>
           </transition>
        </div>

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
        	<div class="line">
        	    <el-button id="unselected">待选案由</el-button>
        	</div>
        	<div class="line ishover">
        		<el-button id="selected">{{List.case_cause.name}}</el-button>
        		<div class="tip" v-if="List.case_cause.name">
        			<span @click="editCause">修改</span>
        			<span @click="editCause">删除</span>
        		</div>
        	</div>
        </div>
        <el-button class="save" @click="construct">保存</el-button>

        <div class="list_box">
  	        <div class="list tag">
	      	    <div class="title">
	      	    	<div class="search">
	      	    		<span class="span">
	      	    			<el-select v-model="law" slot="prepend" clearable placeholder="法律分类" @change="loadTags">
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
		      				<div class="item" @click="list(item)" :title="item.name" v-text="(item.name.length > 20) ? (item.name.substring(0, 20) + '...') : item.name"></div>
	      				</template>
	      			</div>
  			        <div class="bottom">
	      			    <el-button type="text" @click="page('tagList','prev')" :disabled="tagList.page==1">
	      			       <i class="el-icon-arrow-left"></i>
	      			    </el-button>
	      			    <span class="span">
	      			    	{{tagList.page}} / {{tagList.max_page}} 页
	      			    </span>
	      			    <span class="span">
	      			        前往 <el-input  class="number" v-model="tagList.page" @change="loadTags" :min="1" :max="tagList.max_page"></el-input> 页
	      			    </span>
	      			    <el-button type="text" @click="page('tagList','!prev')" :disabled="tagList.has_more==false">
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
		      			    	<span></span>
		      			    </div>
	      			    </template>
	      			</div>
	      			<div class="bottom">
	      			</div>
	      	    </div>
	      	</div>

	      	<div class="list case_cause">
	      	    <div class="title">
		      		<div class="search">
				      	<span class="span">选择案由</span>
				      	<el-input placeholder="请输入内容搜索案由" v-model="causeList.value" @change="tagList.page = 1;loadCauses()" icon="search">
		      		    </el-input>
		      		</div>
	      		</div>
	      		<div class="content">
	      			<div class="items" v-loading="loading.case">
	      			    <template  v-for="(item,index) in causeList.data">
	      			    	<div class="item" @click="list(item)" :title="item.name">{{item.name}}</div>
	      			    </template>
	      			</div>
	      			<div class="bottom">
	      			    <el-button type="text" @click="page('causeList','prev')" :disabled="causeList.page==1">
	      			       <i class="el-icon-arrow-left"></i>
	      			    </el-button>
	      			    <span class="span">
	      			    	{{causeList.page}} / {{causeList.max_page}} 页
	      			    </span>
	      			    <span class="span">
	      			        前往 <el-input  class="number" v-model="causeList.page" @change="loadCauses" :min="1" :max="causeList.max_page"></el-input> 页
	      			    </span>
	      			    <el-button type="text" @click="page('causeList','!prev')" :disabled="causeList.has_more==false">
	      			       <i class="el-icon-arrow-right"></i>
	      			    </el-button>
	      			</div>
	      	    </div>
      	    </div>
        </div>

	    <div id="bottom">
	        <div class="recommend" v-loading="loading.recommend">
	            <div class="heading">
	            	<span slot="label"><i class="p1"></i> 推荐标签链</span>
	            	<el-button id="close" @click="recommendShow=!recommendShow">
	            		<i class="el-icon-caret-left" v-if="!recommendShow"></i>
	            		<i class="el-icon-caret-bottom" v-if="recommendShow"></i>
	            	</el-button>
	            </div>
	            <span>操作</span>
	            <transition name="slide-fade">
	            <div class="content" v-show="recommendShow">
	            	<ul>
	            	<li class="clearfloat" v-for="(chain,index) in recommendList">
	            			<div class="content">
	            				<div class="left">
	            					<el-tooltip placement="top" v-for="item in chain.data">
	            						<div slot="content">{{item.name}}</div>
	            						<el-button v-if="item.category == 'tag'" v-text="item.name"></el-button>
	            						<span v-if="item.category == 'relation'" id="text">{{item.name}}</span>
	            						<!-- <span :id="item.en_name"></span> -->
	            						{{item}}
	            					</el-tooltip>
	            					<el-tooltip placement="top">
	            						<div slot="content">{{chain.case_cause.name}}</div>
	            						<el-button class="case" v-if="chain.case_cause" v-text="chain.case_cause.name"></el-button>
	            						<el-button class="case"  v-if="!chain.case_cause">待选案由</el-button>
	            						{{chain.case_cause}}
	            					</el-tooltip>
	            				</div>
	            				<div class="right">
	            				    <span @click="bind(chain)" class="bind">绑定</span>
	            					<span @click="copy(chain)" class="copy">复制</span>
	            					<span @click="clear(chain,index)" class="del">删除</span>
	            				</div>
	            			</div>
	            			<p>
	            				<span>编辑人：{{chain.owner}}</span>
	            				<span>最后编辑时间：{{chain.time.substring(0,19)}}</span>
	            			</p>
	            		</li>
	            	</ul>
	            </div>
	            </transition>
	        </div>

		    <div class="main_bottom" v-loading="loading.chains">
		        <el-tabs type="border-card" @tab-click="tabClick" active-name="1">
		    		<el-tab-pane name="1">
		    			<span slot="label"><i class="p1"></i> 已完成标签链</span>
		    			<ul>
		    				<li class="clearfloat" v-for="(chain,index) in chains">
		    				   <div class="content">
			    					<div class="left">
			    						<el-tooltip placement="top" v-for="item in chain.data">
			    							<div slot="content">{{item.name}}</div>
			    							<el-button v-if="item.category == 'tag'" v-text="item.name"></el-button>
	            						    <span v-if="item.category == 'relation'" id="text">{{item.name}}</span>
			    							{{item}}
			    						</el-tooltip>
			    						<el-tooltip placement="top">
			    							<div slot="content">{{chain.case_cause.name}}</div>
			    							<el-button class="case" v-if="chain.case_cause" v-text="chain.case_cause.name"></el-button>
			    							{{chain.case_cause}}
			    						</el-tooltip>
			    					</div>
			    					<div class="right">
			    						<span @click="bind(chain)" class="bind">绑定</span>
			    						<span @click="copy(chain)" class="copy">复制</span>
			    						<span @click="clear(chain,index)" class="del">删除</span>
			    					</div>
			    			    </div>
		    					<p>
		    						<span>编辑人：{{chain.owner}}</span>
		    						<span>最后编辑时间：{{chain.time.substring(0,19)}}</span>
		    					</p>
		    				</li>
		    			</ul>
		    			<div class="pagination">
	    				<el-pagination
		    				@size-change="handleSizeChange"
		    				@current-change="handleCurrentChange"
		    				:current-page="chainList.page"
		    				:page-sizes="[1,5,10,15]"
		    				:page-size="chainList.pageSize"
		    				layout="prev, pager, next, sizes, jumper"
		    				:total="chainList.total">
		    			</el-pagination>
	    			</div>
		    		</el-tab-pane>
		    		<el-tab-pane name="2">
		    			<span slot="label"><i class="p2"></i> 查看标签链图谱</span>
		    			<div v-loading="loading.graph">
			    			<div id="chain-graph" v-if="shouldGraphShow">
			    				<create :list="graphChainList" :visible="true" :editable="false"></create>
			    			</div>
			    		</div>
		    		</el-tab-pane>
		    	</el-tabs>
		    	<span>操作</span>
		    	<span class="filter">
		    		<el-select v-model="filteredCause"  clearable filterable placeholder="全部案由" @change="init();">
			    		<el-option
			    			v-for="item in case_options"
			    			:key="item.id"
			    			:label="item.name"
			    			:value="item.id">
			    		</el-option>
			    	</el-select>
		    	</span>
		    </div>
	    </div>

	    <el-dialog :modal-append-to-body="false" :visible.sync="shouldBindShow" id="bind">
	    	<bind :list="selectedChain" :content="caseInfo.content" @cancelBind="cancelBind" @construct="construct"></bind>
	    </el-dialog>

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
import bind from './bind.vue';
import Create from '../Search/Create.vue';
var debounce = require('debounce');
export default{
	components: {bind,Create},
	data(){
		return{
			graphID:'c3eab98ecd0b0d827eabe92c7c5aec1c',
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
			causeList:{
				value:'',
				data:[],
				pageSize: 10,
				max_page: 1,
				page: 1,
				has_more: false
			},
			List:{
				id:'',
				desc:'',
				case_cause:{},
				data:[]
			},
            chains:[],
            chainList:{
            	pageSize:10,
            	page:1,
            	total:999
            },
			//修改标签或关系的index
	        editItemIndex:-1,
	        filteredCause:'',
	        case_options:[],
	        loading:{
	        	tag:false,
	        	case:false,
	        	caseInfo:false,
	        	para:false,
	        	chains:false,
	        	recommend:false,
	        	graph:false,
	        },
	        law:'',
	        law_categories:[],
	        params:{
	        	case:'',
	        	caseInfo:'',
	        	para:''
	        },
	        caseList:[],
	        caseInfoList:[],
	        paraList:[],
	        caseInfo:{
	        	index:0,
	        	content:''
	        },
	        caseInfoShow:false,
	        recommendShow:false,
	        shouldBindShow: false,
	        shouldGraphShow:false,
	        selectedChain:{},
	        recommendList:[],
	        addRelationshipName: '',
	        addRelationshipDialog: false,
	        addRelationshipDialogModal: false,
	        graphChainList:[],
		}
	},
	mounted(){
		//加载标签链
		this.init();
		//加载案由筛选标签链
		this.initfilter();
		//加载tags
		this.loadTags();
		//加载relations
		this.loadRelations();
		//加载案由
		this.loadCauses();
		//加载法律分类筛选标签
		this.loadlaws();
	},
	computed:{
		username(){
			return JSON.parse(this.user.config.data).username;
		}
	},
	methods:{
		handleSizeChange(val){
			this.chainList.pageSize = val;
			this.init();
		},
		//标签链翻页
		handleCurrentChange(val){
			this.chainList.page = val;
			this.init();
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
		//获取图的已有标签链
		init(){
			// var params = {
			// 	cause_id: this.params.case ? this.params.case : '',
			// 	case_info_id:this.params.caseInfo ? this.params.caseInfo : '',
			// 	para_id: (this.params.caseInfo & this.params.para) ? this.params.para : '',
			// 	page_size: this.chainList.pageSize,
			// 	page: this.chainList.page
			// };
			var params = {
				cause_id: this.filteredCause ? this.filteredCause : '', //案由筛选标签链
				page_size: this.chainList.pageSize ? this.chainList.pageSize : 10,
				page: this.chainList.page ? this.chainList.page : 1,
			};
			this.loading.chains = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains',{params:params}).then((res) =>{
			  	if (res.data.code == 0) {
			  		this.chainList.total = res.data.pager.total;
			  		this.chains = [];
				  	res.data.data.forEach((chain) =>{
				  		var data = [];
				  		var len = chain.chain_linked.length;
				  		var cause= '' ;
				  		for(var i=0; i<len-1; i++){
				  			var elem = chain.chain_linked[i];
				  			data.push({
				  				id: elem.id,
				  				name: elem.name,
				  				en_name: elem.en_name ? elem.en_name : '',
				  				category: (i%2 == 0) ? 'tag' : 'relation'
				  			})
				  		}
				  		cause = chain.chain_linked[len-1];
				  		this.chains.push({
				  			id: chain._id,
				  			case_cause: cause,
				  			data: data,
				  			owner: chain.maintain[1].user_name,
			  				time: chain.maintain[1].operation_time,
				  		});
				  	})
				  	console.log(this.chains);
				  	this.loading.chains = false;
			 	}else{
			 		this.$message.error(res.data.msg);
			 		this.loading.chains = false;
			 		return;
			 	}
			  })
		},
		//切换到知识图谱界面,开始加载图谱
		tabClick(tab){
			if(tab.name==2){
				this.initgraph();
			}
		},
		//获取知识图谱
		initgraph(){
			var params = {
				page_size:50
			};
			this.loading.graph = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains',{params:params}).then((res) =>{
			  	if (res.data.code == 0) {
			  		res.data.data.forEach((chain) => {
			  			var graphData = {};
			  			var len = chain.chain_linked.length;
			  			for (var i = 0; i < len; i++) {
			  				var elem = chain.chain_linked[i];
			  				graphData = {
			  					name: elem.name,
			  					colloquial: elem.colloquial,
			  					property: elem.property,
			  					case_cause: elem.case_cause,
			  					category: (i % 2 == 0) ? 'tag' : 'relation',
			  					_id: elem.id,
			  					key: elem.id,
			  					synonyms: elem.synonyms,
			  					type: elem.type,
			  				};
			  				var graphListData = {
			  					id: chain._id,
			  					key: graphData._id,
			  					params: graphData,
			  					text: graphData.name,
			  				};
			  				if (graphData.category == 'relation') {
			  					graphListData.from = chain.chain_linked[i - 1].id;
			  					graphListData.to = chain.chain_linked[i + 1].id;
			  				}
			  				var hasExisted=false;
			  				this.graphChainList.forEach((item)=>{
			  					if(graphListData.params.category=='tag'){
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
			  		this.loading.graph = false;
			  		this.shouldGraphShow = true;
			  	}else{
			  		this.$message.error(res.data.msg);
			  		return;
			  	}
			});
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
			 				en_name:rel.en_name,
			 				category:"relation"
			 			})
			 		})
			 	}else{
			 		this.$message.error(res.data.msg);
			 		return;
			 	}
			 }).catch((err) =>{
			 	// this.$message.error('加载关系错误');
			 })
		},
		//获取所有tags
		loadTags(){
		    var params = {
		    	keyword: this.tagList.value ? this.tagList.value: '',
		    	law_type: this.law ? this.law : '',
		    	page_size: this.tagList.pageSize,
		    	page: this.tagList.page,
		    };
		    this.loading.tag = true;
		    axios.get(this.$store.state.TagUrl+'/api/tag/tags',{params:params})
		      .then((res) =>{
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
		      }).catch((err) =>{
		          // this.$message.error('加载标签错误');
		     })
		},
		//获取所有cause
		loadCauses(){
			var params = {
				keyword: this.causeList.value ? this.causeList.value : '',
				page_size: this.causeList.pageSize,
		    	page: this.causeList.page,
			};
			this.loading.case = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/causes',{params:params})
			  .then((res) =>{
			  	this.causeList.has_more = res.data.pager.has_more;
			  	this.causeList.max_page = res.data.pager.max_page;
			  	this.causeList.data = [];
			  	res.data.data.forEach((elem) =>{
			  		this.causeList.data.push({
			  			id: elem.id,
			  			name: elem.zh_name,
			  			category:'case_cause'
			  		})
			  	})
			  	this.loading.case = false;
			  }).catch((err) =>{
			  	// this.$message.error('加载案由错误');
			  })
		},
		//加载法律分类
		loadlaws(){
			axios.get(this.$store.state.TagUrl+'/api/tag/law_categorys').then((res) =>{
				if(res.data.code == 0){
					this.law_categories = res.data.data;
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		//选择案由之后开始加载裁判文书和段落，裁判文书数量太多
		select(){
			if(!this.params.case){
				this.params.caseInfo = '';
				this.params.para = '';
				this.paraList = [];
				this.caseInfo.content = '';
			}
			if(!this.params.caseInfo){
				this.params.para = '';
				this.paraList = [];
				this.caseInfo.content = '';
			}
			//开始加载推荐标签链
			this.recommend();
		},
		//加载案由筛选文书
		// loadCases(){
		// 	var params = {
		// 		keyword: this.params.case ? this.params.case : '',
		// 		page_size: 1600
		// 	};
		// 	axios.get(this.$store.state.TagUrl+'/api/tag/causes',{params:params}).then((res) => {
		// 		this.caseList = [];
		// 		if(res.data.code == 0){
		// 			res.data.data.forEach((elem) =>{
		// 				this.caseList.push({
		// 					id: elem.id,
		// 					name: elem.zh_name,
		// 				})
		// 			})
		// 		}else{
		// 			this.$message.error(res.data.msg);
		// 		}
		// 	});
		// },
		//输入关键词之后开始加载案由,案由数量太多
		loadCases: debounce(function (query) {
			if (query !== '') {
				var params = {
					keyword: query,
					page_size: 100,
				};
				this.loading.para = true;
				axios.get(this.$store.state.TagUrl+'/api/tag/causes',{params:params}).then((res) => {
					this.caseList = [];
					if(res.data.code == 0){
						res.data.data.forEach((elem) =>{
							this.caseList.push({
								id: elem.id,
								name: elem.zh_name,
							})
						})
						this.loading.para = false;
					}else{
						this.$message.error(res.data.msg);
						this.loading.para = false;
					}
				});
			} else {
				this.caseList = [];
			}
		}, 250),
		//加载裁判文书
		loadcaseInfo(){
			var params = {};
			if(this.caseList.length){
				this.caseList.forEach((elem) =>{
					if(elem.id == this.params.case){
						params = {keyword: elem.name, page_size:1000};
					}
				})
			}
			this.loading.para = true;
			this.loading.caseInfo = true;
			axios.get(this.$store.state.TagUrl+'/api/case_infos',{params:params}).then((res) =>{
				if(res.data.code == 0){
					this.caseInfoList = res.data.data;
					this.loading.para = false;
					this.loading.caseInfo = false;
				}else{
					this.$message.error(res.data.msg);
					this.loading.para = false;
					this.loading.caseInfo = false;
				}
			}).catch((err) =>{
				// this.$message.error('加载法律文书错误');
			})
		},
		//加载裁判文书段落
		loadParas(){
			var param = this.params.caseInfo ? this.params.caseInfo : '';
			this.loading.para = true;
			axios.get(this.$store.state.TagUrl+'/api/case_infos/'+param+'/paras').then((res) =>{
				if(res.data.code == 0){
					this.paraList = res.data.data;
					this.loading.para = false;
				}else{
					this.$message.error(res.data.msg);
					this.loading.para = false;
				}
			}).catch((err) =>{
				// this.$message.error('加载法律文书错误');
			})
		},
		//显示裁判文书段落
		getContent(){
			this.paraList.forEach((para,index) =>{
				if(this.params.para == para.para_tag){
					this.caseInfo.index = index;
					this.caseInfo.content = para.content;
				}
			})
			this.recommend();
		},
		//裁判文书段落翻页
		prevPara(){
			this.caseInfo.index--;
			this.params.para = this.paraList[this.caseInfo.index].para_tag;
		},
		nextPara(){
			this.caseInfo.index++;
			this.params.para = this.paraList[this.caseInfo.index].para_tag;
		},
		//展示裁判文书
		caseShow(){
			this.caseInfoShow = true;
			$('.save').css('top', '480px');
		},
		//隐藏裁判文书
		caseHide(){
			this.caseInfoShow = false;
			$('.save').css('top', '200px');
			$('.save').css('transition','all .2s .1s ease');
		},
		//加载已建标签链的案由分类筛选
		initfilter(){
			this.loading.chains = true;
			var params = {
				page_size: this.chainList.total
			};
			axios.get(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains',{params:params}).then((res) =>{
			  	if (res.data.code == 0) {
			  		this.case_options = [];
			  		res.data.data.forEach((chain) =>{
			  			var len = chain.chain_linked.length;
			  			var cause = chain.chain_linked[len-1];
			  			var size = this.case_options.length;
			  			if(size >0){
			  				for(var i=0;i<size;i++){
			  					var item = this.case_options[i];
					  			var temp = JSON.stringify(item);
					  			var target = JSON.stringify(cause);
					  			if(temp == target){
					  				this.case_options.splice(i,1);
					  			}else{
					  				continue;
					  			}
					  		}
			  			}
				  		this.case_options.push(cause);
			  		})
			  		this.loading.chains = false;
			  		console.log(this.case_options);
			  	}else{
			  		this.$message.error(res.data.msg);
			 		this.loading.chains = false;
			 		return;
			  	}
			});
		},
		//根据裁判文书推荐标签链
		recommend(){
			var tags = [];
			if(this.List){
				this.List.data.forEach((elem) =>{
					tags.push(elem.id);
				})
			}
			var params = {
				graph_id : this.graphID,
				tag_ids: tags.length ? JSON.stringify(tags) : '',
				cause_id: this.params.case ? this.params.case : '',
				case_info_id: this.params.caseInfo ? this.params.caseInfo : '',
				para_id : (this.params.caseInfo & this.params.para) ? this.params.para : ''
			};
			this.loading.recommend = true;
			axios.get(this.$store.state.TagUrl+'/api/tag/chains/recommend',{params:params}).then((res) =>{
				if (res.data.code == 0) {
			  		this.recommendList = [];
				  	res.data.data.forEach((chain) =>{
				  		var data = [];
				  		var len = chain.chain_linked.length;
				  		var cause= '' ;
				  		for(var i=0; i<len-1; i++){
				  			var elem = chain.chain_linked[i];
				  			data.push({
				  				id: elem.id,
				  				name: elem.name,
				  				en_name: elem.en_name ? elem.en_name : '',
				  				category: (i%2 == 0) ? 'tag' : 'relation'
				  			})
				  		}
				  		cause = chain.chain_linked[len-1];
				  		this.recommendList.push({
				  			id: chain._id,
				  			case_cause: cause,
				  			data: data,
				  			owner: chain.maintain ? chain.maintain[1].user_name : '未知',
			  				time: chain.maintain ? chain.maintain[1].operation_time : chain.create_date,
				  		});
				  	})
				  	this.loading.recommend = false;
			 	}else{
			 		this.$message.error(res.data.msg);
			 		this.loading.recommend = false;
			 		return;
			 	}
			})
		},
		//标签、案由列表翻页
		page(type,el){
			if(type == 'tagList'){
				el == 'prev' ? this.tagList.page-- : this.tagList.page++;
				this.loadTags();
			}
			if(type == 'causeList'){
				el == 'prev' ? this.causeList.page-- : this.causeList.page++;
				this.loadCauses();
			}
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
				if(item.category == 'relation' && (this.List.data.length + 1) % 2 == 0){
					this.List.data.push(item);
					$('.last-span').css('display', 'none');
					$('.tag').removeClass('dark');
					$('.relation').addClass('dark');
				}
				if(item.category == 'tag' && (this.List.data.length + 1) % 2 == 1){
					this.List.data.push(item);
					$('.last-button').css('display', 'none');
					$('.relation').removeClass('dark');
					$('.tag').addClass('dark')
				}
				if(item.category == 'case_cause'){
					this.List.case_cause = item;
					$('#unselected').css('display','none');
					$('#selected').css('display','block');
				}
			}
			this.recommend();
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
		// 修改案由
		editCause(){
			this.List.case_cause = {};
			$('#selected').css('display','none');
			$('#unselected').css('display','block');
		},

		//保存新建标签链,绑定法律文书
		construct(){
			var length = this.List.data.length;
			var data = [];
			var source = "";
			this.List.data.forEach((elem) =>{
				data.push(elem.id);
			})
			data.push(this.List.case_cause.id);
			//绑定法律文书
			if(this.params.caseInfo){
				source = JSON.stringify({
					type: "para",
					case_info_id: this.params.caseInfo,
					para_id: this.params.para
				});
			}
			//判断标签链的格式是否标准
			if((length-2)%2==0 && this.List.case_cause){
				//保存新建标签链
				axios.post(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains?axios=1',{
					chain_linked: JSON.stringify(data),
					source: source
				}).then((res) =>{
					if (res.data.code == 0) {
						this.$message.success('保存成功');
						this.init();
						this.initfilter();
					}else{
						this.$message.error(res.data.msg);
						return;
					}
				})
				this.List = {
					id:'',
					case_cause:'',
					data:[]
				};
				$('.relation').removeClass('dark');
				$('.tag').removeClass('dark');
				$('.last-button').css('display','block');
				$('.last-span').css('display','block');
				$('#selected').css('display','none');
				$('#unselected').css('display','block');
			}else{
				this.$message.warning('标签链格式不正确，无法保存！');
			}
		},

		//绑定法律文书,保存标签链
		bind(chain){
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			this.selectedChain = chain;
			this.shouldBindShow = true;
		},
		//绑定法律文书,关闭弹窗
		cancelBind(){
			this.shouldBindShow = false;
		},
		// 复制标签链
		copy(chain){
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			this.List = JSON.parse(JSON.stringify(chain));
			this.List.id = null;
			$('.last-span,.last-button').css('display', 'none');
	    	$('.list').removeClass('dark');
			$('#unselected').css('display','none');
			$('#selected').css('display','block');
		},
		// 删除标签链
		clear(chain,index){
			this.$confirm('此操作将删除图中该标签链, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				axios.delete(this.$store.state.TagUrl+'/api/tag/graphs/'+this.graphID+'/chains/'+chain.id).then((res) =>{
					if (res.data.code == 0) {
						this.$message.success('删除成功');
						this.init();
						this.initfilter();
					}else{
						this.$message.error(res.data.msg);
						return;
					}
				})
			}).catch(() => {
				this.$message.info("已取消删除");
			});

		}
	}
}
</script>

<style lang="less">
.el-select-dropdown{
	max-width:560px;
}
#LawTagCause{
	width:94%;
	margin-left:5%;
	margin-right:1%;
	position:relative;
	input::-webkit-input-placeholder { /* WebKit browsers */
		color:#fff;
		font-size:16px;
		padding-left:5px;
	}
	input:-moz-placeholder {  /* Mozilla Firefox 4 to 18 */
		color:#fff;
		font-size:16px;
		padding-left:5px;
	}
	input::-moz-placeholder {  /* Mozilla Firefox 19+  */
		color:#fff;
		font-size:16px;
		padding-left:5px;
	}
	input:-ms-input-placeholder { /* Internet Explorer 10+ */
		color:#fff;
		font-size:16px;
		padding-left:5px;
	}
	.el-button{
		white-space:initial;
		line-height:initial;
	}
	.graph_box {
		width: 100%;
		margin-left:-2%;
		padding-right:5%;
		height: 40px;
		background: #ddd;
		.bread{
			width: 92%;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			margin:48px auto;
			>.el-breadcrumb{
				height: 40px;
				line-height: 40px;
			}
		}
	}
	.search_boxx{
  		width:100%;
  		margin:auto;
  		margin-top:1%;
  		.heading{
  			height:56px;
  			width:100%;
  			background:#D9E2EB;
  			.filter{
  				width:65%;
  				position:absolute;
  				margin-top:10px;
  				float:left;
  				left:10px;
  				display: flex;
  				justify-content: space-between;
  				.select{
  					width: 30%;
  					height: 90%;
  					.el-select{
  						width:100%;
  						height:100%;
  						input::-webkit-input-placeholder { /* WebKit browsers */
  							color: #2F86E3;
  						}
  						input:-moz-placeholder {  /* Mozilla Firefox 4 to 18 */
  							color: #2F86E3;
  						}
  						input::-moz-placeholder {  /* Mozilla Firefox 19+  */
  							color: #2F86E3;
  						}
  						input:-ms-input-placeholder { /* Internet Explorer 10+ */
  							color: #2F86E3;
  						}
  					}
  				}
  				.cause{
  					.el-select{
  						width:90%;
  					}
  					i{
  						color:#2F86E3;
  					}
  				}
  			}
  			.btn{
  				width:25%;
  				margin-top:10px;
  				margin-right:2%;
  				float:right;
  				display:flex;
  				justify-content:space-between;
  				.el-button{
  					height:36px;
  					line-height:inherit;
  					width: 240px;
  					padding: 0 5px;
  					border-radius:20px;
  					font-size:16px;
  					color:#95AFCD;
  					span{
  						padding-left:20px;
  					}
  				}
  				#show{
  					background: #fff url('../../assets/lawtag/text_show.png') no-repeat 20px;
  				}
  				#hide{
  					background: #fff url('../../assets/lawtag/text_hide.png') no-repeat 20px;
  				}
  			}
  		}
  		.result{
  			height:280px;
  			width:100%;
  			background:#F8F8F8;
			textarea {
				margin-top:20px;
  				margin-left:2%;
				width: 95%;
				height: 196px;
				resize: none;
				border-color: #4078B3;
				color: #000;
				font-size: 16px;
				line-height: 26px;
				padding: 10px 22px;
				overflow-y: scroll;
			}
			.paging{
				float:right;
				margin-right:2%;
				margin-top: 10px;
				.el-button{
					height:36px;
  					line-height:inherit;
  					width:90px;
  					border-radius:0;
  					margin:0 10px;
				}
			}
  		}
  	}
	.list_box{
		width:100%;
		margin-top: 40px;
		display: flex;
		justify-content:space-between;
		.list{
			width:30%;
			/* height:460px; */
			height:550px;
			margin-left:1%;
			margin-right:1%;
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
					height: 570px;
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
				}
			}
			.search{
				width:98%;
				/* height:45px; */
				height:80%;
				margin-top:5px;
				padding-right:25px;
				line-height:45px;
				display: flex;
				justify-content:space-around;
				.span{
					width:35%;
					height:94%;
					font-size:18px;
					line-height:45px;
					text-align:center;
					.el-select{
						height:95%;
						.el-input{
							width:100%;
							height:98%;
							border:none;
							.el-input__inner{
								font-size:18px;
							}
							i{
								top:58%;
							}
							.is-show-close{
								top:35px;
							}
						}
					}
				}
				.el-input{
					width:60%;
					height:32px;
					.el-input__icon{
						line-height:inherit;
					}
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
				/* height:425px; */
				height:515px;
				.items{
					/* height:380px; */
					height:470px;
					.item{
						height:45px;
						line-height: 45px;
						font-size: 16px;
						cursor: pointer;
						display: flex;
						justify-content:space-around;
						white-space:initial;
						span{
							max-width:120px;
							text-align:center;
						}
					}
					.even{
						background:#F5F5F5;
					}
				}
				.bottom{
					display:flex;
					justify-content:space-between;
					padding:0 10px;
					.el-button{
						text-align:center;
						width:40px;
						height:40px;
						border-radius:30px;
						margin-top:5px;
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
				.title{
					background:#2282E9;
				}
				.search{
					.el-input{
						.el-input__inner{
							background:#0053AF;
						}
					}
					.span{
						background:#2282E9;
						input::-webkit-input-placeholder { /* WebKit browsers */
							font-size:18px;
							padding-left:0;
						}
						input:-moz-placeholder {  /* Mozilla Firefox 4 to 18 */
							font-size:18px;
							padding-left:0;
						}
						input::-moz-placeholder {  /* Mozilla Firefox 19+  */
							font-size:18px;
							padding-left:0;
						}
						input:-ms-input-placeholder { /* Internet Explorer 10+ */
							font-size:18px;
							padding-left:0;
						}
						.el-input__inner{
							background:#2282E9;
						}
					}
				}
				.content{
					border:1px solid #2282E9;
					border-top:0;
					.items{
					   /* overflow-y:scroll; */
					   .item{
					   	color:#2282E9;
					   	border-bottom:2px solid #9DC7F4;
					   	&:hover{
					   		color:#fff;
					   		background:#67A6ED;
					   	}
					   }
					}
					.bottom{
						.span{
							.el-input__inner{
								color: #20a0ff;
							}
						}
					}
				}
			}
			&.relation{
				.title{
					background:#2282E9;
					span{
						cursor:pointer;
					}
				}
				.content{
				   border:1px solid #2282E9;
				   border-top:0;
				   overflow-y:scroll;
				}
				.item{
					color:#2282E9;
					border-bottom:2px solid #9DC7F4;
					span{
						width:100%;
						height:45px;
					}
					&:hover{
						color:#fff;
						background:#67A6ED;
					}
				}
			}
			&.case_cause{
				.title{
					background: #F7BA2A;
				}
				.search{
					.span{
						color:#fff;
						background:#F7BA2A;
					}
					.el-input{
						.el-input__inner{
							background:#C58800;
						}
					}
				}
				.content{
					border:1px solid #F7BA2A;
					border-top:0;
					.items{
						/* overflow-y:scroll; */
						.item{
							color:#F7BA2A;
							border-bottom:2px solid #FADC8F;
							&:hover{
								color:#FFF;
								background:#EBC766;
							}
						}
					}
					.bottom{
						.el-button{
							color: #F7BA2A;
						}
						.span{
							color: #F7BA2A;
							.el-input__inner{
								color: #F7BA2A;
							}
						}
					}
				}
			}
		}
	}
	.save{
		position:absolute;
		right:2%;
		top:200px;
		border:0;
		background: url('../../assets/layer/save.png') no-repeat center;
		font-size: 0;
		width: 95px;
		height: 40px;
		&:hover{
			background: url('../../assets/layer/save_hover.png') no-repeat center;
		}
	}
	.line_box{
		margin-top:60px;
		width:80%;
		margin-left:1%;
		.line{
			position: relative;
			display: inline-block;
			margin-top:20px;
			margin-bottom: 25px;
			button{
				background:#fff;
				color: #1278E7;
				border-radius:5px;
				border: 1px solid #1278E7;
				font-size: 16px;
				&.last-button{
					color: #ACACAC;
					font-size: 14px;
					background: #F6F6F6;
					border:1px dotted #D2D2D2;
				}
			}
			#unselected{
				color: #ACACAC;
				font-size: 14px;
				background: #F6F6F6;
				border:1px dotted #D2D2D2;
			}
			#selected{
				display:none;
				font-size: 16px;
				background:#fff;
				color:#F7BA2A;
				border:1px solid #F7BA2A;
				border-radius:5px;
				margin-left:-17px;
			}
			&.ishover:hover,&.hover{
				button{
					background: #67A6ED;
					color:#fff;
					font-size: 18px;
					border-color: #67A6ED;
					min-width: 150px;
				}
				#selected{
					background: #FADC8F;
					color:#fff;
					font-size: 18px;
					border-color: #FADC8F;
					min-width: 150px;
				}
				.tip{
					opacity: 1;
				}
				> span{
					color: #37BE29;
					border-radius:5px;
					border:1px solid #37BE29;
					padding: 9px 20px;
					margin:0 3px;
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
				background: url('../../assets/lawtag/or.png') no-repeat center;
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

	#bottom{
		width:98%;
		margin:auto;
		margin-top: 80px;
		position:relative;
		.recommend{
			width:98%;
			& > span{
				position: absolute;
				top: 0;
				right: 2%;
				display: block;
				width: 22%;
				height: 45px;
				line-height: 45px;
				text-align: center;
				color:#004DA1;
				font-size: 16px;
				background: #C7CED6;
			}
			.heading{
				height:45px;
				padding-left:30px;
				width: 76%;
				background: #C7CED6;
				> span{
					font-size: 18px;
				    line-height:48px;
					color: #0370E9;
					position: relative;
					padding-left: 40px;
					i{
						display: inline-block;
						position: absolute;
						top:-2px;
						left: 0;
						width: 24px;
						height: 24px;
						background: url('../../assets/lawtag/recommend.png') no-repeat center;
					}
				}
				.el-button{
					float:right;
					height:32px;
					width:48px;
					font-size:16px;
					margin-top:6px;
					background: #C7CED6;
					color: #0370E9;
					border:0;
				}
			}
			.content{
				margin-top:25px;
				ul{
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
							.left{
								width: 81.3%;
								float: left;
								padding-left: 15px;
								button{
									background:#fff;
									color: #1278E7;
									border-radius:5px;
									border: 1px solid #1278E7;
									font-size: 16px;
									margin-bottom: 40px;
								}
								.case{
									color: #F7BA2A;
									border: 1px solid #F7BA2A;
									margin-left:-5px;
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
								width: 18%;
								float: right;
								height: 112px;
								line-height:42px;
								text-align: center;
								display: flex;
								justify-content:space-around;
								span{
									width: 24px;
									height: 100%;
									font-size: 0;
									cursor: pointer;
									&.bind{
										background: url('../../assets/lawtag/bind.png') no-repeat center;
										&:hover{
											background-image: url('../../assets/lawtag/bind_hover.png');
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
							margin-top: 29px;
						}
					}
				}
			}
		}
		.main_bottom{
			width: 98%;
			float: left;
			margin-top:20px;
			position: absolute;
			& > span{
				position: absolute;
				top: 0;
				right: 0;
				display: block;
				width: 21%;
				height: 42px;
				line-height: 42px;
				text-align: center;
				color:#004DA1;
				/* border-left: 1px solid #004DA1; */
				font-size: 16px;
			}
			.filter{
				position:absolute;
				top:0;
				right:20%;
				display:block;
				width:19%;
				height:42px;
				line-height:42px;
				text-align:center;
				color:#004DA1;
				font-size:16px;
				.el-select{
					position:absolute;
					right:0;
					width:90%;
					margin-right:10%;
					height: 42px;
					padding-right:5px;
					line-height: 42px;
					background: #C7CED6;
					input::-webkit-input-placeholder { /* WebKit browsers */
						color:#0370E9;
					}
					input:-moz-placeholder {  /* Mozilla Firefox 4 to 18 */
						color:#0370E9;
					}
					input::-moz-placeholder {  /* Mozilla Firefox 19+  */
						color:#0370E9;
					}
					input:-ms-input-placeholder { /* Internet Explorer 10+ */
						color:#0370E9;
					}
					.el-input__inner{
						border-radius:0;
					}
					.el-input__icon{
						font-size:16px;
						&:hover{
						   color: #0370E9;
						}
					}
				}
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
								.left{
									width: 79.3%;
									float: left;
									padding-left: 15px;
									/* border-right: 1px solid #1278E7; */
									button{
										background:#fff;
										color: #1278E7;
										border-radius:5px;
										border: 1px solid #1278E7;
										font-size: 16px;
										margin-bottom: 40px;
									}
									.case{
										color: #F7BA2A;
										border: 1px solid #F7BA2A;
										margin-left:-5px;
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
									line-height:42px;
									text-align: center;
									display: flex;
									justify-content:space-around;
									span{
										width: 24px;
										height: 100%;
										font-size: 0;
										cursor: pointer;
										&.bind{
											background: url('../../assets/lawtag/bind.png') no-repeat center;
											&:hover{
												background-image: url('../../assets/lawtag/bind_hover.png');
											}
										}
										/* &.edit{
											background: url('../../assets/layer/edit.png') no-repeat center;
											&:hover{
												background-image: url('../../assets/layer/edit_hover.png');
											}
										} */
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
					#chain-graph {
						width: 100%;
						height: 800px;
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
	}
	#bind{
		.el-dialog__headerbtn{
			display:none;
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
	.slide-fade-enter-active {
      transition: all .3s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateY(10px);
      opacity: 0;
    }
}
</style>
