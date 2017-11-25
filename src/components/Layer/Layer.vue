<template>
	<div class="layer">
		<div class="graph_box">
	      <div class="bread">
	        <el-breadcrumb separator="/">
	          <el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
	          <el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
	          <el-breadcrumb-item><span style="color: red">概念层次图</span></el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </div>
		<header>
			<div>
				<span class="anyou" @click="dialogVisible = true;">法律</span>
				<el-cascader
				    :options="options.falv"
				    class="cascader"
				    v-model="selectedOptions"
				    filterable
				    @active-item-change="handleItemChange"
				    :props="props"
				    :before-filter="filter"
				    :show-all-levels="false"
				    @change="handleChange">
				</el-cascader>
			</div>
			<div>
				<span class="anyou"  @click="dialog.caseTree = true;">案由</span>
				<el-select
					v-model="value.anyou"
					placeholder="请选择案由"
					filterable
					remote
					:remote-method="getAnyouOptions"
					@change="selectAnyou"
					>
				    <el-option
				      v-for="item in options.anyou"
				      :key="item.id"
				      :label="item.zh_name"
				      :value="item.id">
				    </el-option>
				</el-select>
			</div>
			<p>
				<el-tag
				  :key="tag"
				  v-for="tag in keyword.falv"
				  :closable="true"
				  :close-transition="false"
				  @close="handleClose(tag,'falv')"
				>
					{{tag.zh_name}}
				</el-tag>
			</p>
			<p>
				<el-tag
				  :key="tag"
				  v-for="tag in keyword.anyou"
				  :closable="true"
				  :close-transition="false"
				  @close="handleClose(tag,'anyou')"
				>
					{{tag.zh_name}}
				</el-tag>
			</p>


		</header>

		<section>
			<!-- <nav>
				<el-input
				  placeholder="请选择标签"
				  icon="search"
				  v-model="value.tag"
				  @click.native.enter="searchTag"
				  :on-icon-click="searchTag">
				</el-input>
				<div class="tags">
					<el-tag
					  v-for="tag in tags"
					  :key="tag.name"
					  :closable="true"
					  type="primary"
					  @click.native="add_tagnode(tag)"
					>
					{{tag.topic}}
					</el-tag>
				</div>

			</nav> -->
			<nav>
				<ul class="actionBtn">
					<li>
						<el-button class="action-addnewtree" @click="addNewTree">新建层次图</el-button>
					</li>
					<li>
						<el-button class="action-addchild" @click="addChild">添加子节点</el-button>
						<el-button class="action-addbrother" @click="addBrother">添加同级节点</el-button>
						<el-button class="action-removenode" @click="removeNode">删除节点</el-button>
					</li>
					<li>
						<el-button class="action-cutnode" @click="cutNode">剪切节点</el-button>
						<el-button class="action-pastenode" @click="pasteNode">粘贴节点</el-button>
					</li>
					<li>
						<el-button class="action-print" @click="screenShot">截图保存</el-button>
					</li>
				</ul>
				<p class="relation">
					<strong>关系说明：</strong>
					<el-tag
					  v-for="tag in relations"
					  :style="{backgroundColor:tag.color}"
					>{{tag.name}}</el-tag>
				</p>
			</nav>
			<el-collapse v-model="activeNames" @change="collapseChange" v-loading="loading.tree" accordion>
				<el-collapse-item
					v-for="(tree,index) in tagsTreeData"
					:name="index" :title="tree.topic">
					<i class="icon-close" @click="delTree(tree)"></i>
					<div :id="'tagTree' + index" class="tagTree" @contextmenu.prevent="rightTip(index,$event)" @click="handleClicks(index)"></div>
				</el-collapse-item>
			</el-collapse>

		</section>



		<el-dialog
		  title="法律树"
		  :visible.sync="dialogVisible"
		  :modal-append-to-body="false"
		  size="full"
		  class="dialog-full"
		  >
		  <div class="tree">
	        <tree-node ref="falv"></tree-node>
	      </div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="okFalv">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog
		  title="案由树"
		  :visible.sync="dialog.caseTree"
		  :modal-append-to-body="false"
		  size="full"
		  class="dialog-full"
		  >
		  <div class="tree">
	        <case-causetree ref="case"></case-causetree>
	      </div>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialog.caseTree = false">取 消</el-button>
		    <el-button type="primary" @click="okCase">确 定</el-button>
		  </div>
		</el-dialog>

		<el-dialog
		  title="增加子标签"
		  :visible.sync="dialog.addChild"
		  :modal-append-to-body="false"
		  class="addChild"
		  size="tiny">
		  	<div>
		  		<p class="relation">
		  			<span>关系选择：</span>
		  			<el-button
		  				v-for="(item,index) in relations"
		  				:class="item.en_name"
		  				@click="selectRelation(item)"
		  			>{{item.name}}</el-button>
		  		</p>
		  		<el-select
				    v-model="value.tag"
				    filterable
				    remote
				    placeholder="请输入标签"
				    :remote-method="remoteTags"
				    @change="selectTag"
				    :loading="loading.tag">
				    <el-option
				      v-for="item in options.tag"
				      :key="item.id"
				      :label="item.zh_name"
				      :value="item.id">
				    </el-option>
				</el-select>
				<div class="tags">
					<el-tag
					  :key="tag"
					  v-for="tag in keyword.tag"
					  :closable="true"
					  :close-transition="false"
					  :style="{backgroundColor:typeTheme}"
					  @close="handleClose(tag,'tag')"
					>
						{{tag.zh_name}}
					</el-tag>
				</div>

		  	</div>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog.addChild = false;cancelDialog();">取 消</el-button>
		    <el-button type="primary" @click="actionAddTagNodes">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="增加同级标签"
		  :visible.sync="dialog.addBrother"
		  :modal-append-to-body="false"
		  class="addChild"
		  size="tiny">
		  	<div>
		  		<p class="relation">
		  			<span>关系选择：</span>
		  			<el-button
		  				v-for="(item,index) in relations"
		  				:class="item.en_name"
		  				@click="selectRelation(item)"
		  			>{{item.name}}</el-button>
		  		</p>
		  		<el-select
				    v-model="value.tag"
				    filterable
				    remote
				    placeholder="搜索标签"
				    :remote-method="remoteTags"
				    @change="selectTag"
				    :loading="loading.tag">
				    <el-option
				      v-for="item in options.tag"
				      :key="item.id"
				      :label="item.zh_name"
				      :value="item.id">
				    </el-option>
				</el-select>
				<div class="tags">
					<el-tag
					  :key="tag"
					  v-for="tag in keyword.tag"
					  :closable="true"
					  :close-transition="false"
					  :style="{backgroundColor:typeTheme}"
					  @close="handleClose(tag,'tag')"
					>
						{{tag.zh_name}}
					</el-tag>
				</div>

		  	</div>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog.addBrother = false;cancelDialog();">取 消</el-button>
		    <el-button type="primary" @click="actionAddBrotherNodes">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="选择关系"
		  :visible.sync="dialog.selectRel"
		  :modal-append-to-body="false"
		  class="addChild"
		  size="tiny">
		  	<div>
		  		<p class="relation">
		  			<span>关系选择：</span>
		  			<el-button
		  				v-for="(item,index) in relations"
		  				:class="item.en_name"
		  				@click="selectRelation(item)"
		  			>{{item.name}}</el-button>
		  		</p>
		  	</div>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog.selectRel = false;cancelDialog();">取 消</el-button>
		    <el-button type="primary" @click="actionMoveNodes">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="新增概念层次图"
		  :visible.sync="dialog.addNewTree"
		  :modal-append-to-body="false"
		  class="addChild"
		  size="tiny">
		  	<div>
		  		<el-select
				    v-model="value.root"
				    filterable
				    remote
				    placeholder="请选择根节点"
				    :remote-method="remoteTags"
				    @change="selectRoot"
				    :loading="loading.tag">
				    <el-option
				      v-for="item in options.tag"
				      :key="item.id"
				      :label="item.zh_name"
				      :value="item.id">
				    </el-option>
				</el-select>
		  	</div>

		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog.addNewTree = false;value.root = '';">取 消</el-button>
		    <el-button type="primary" @click="actionAddNewTree">确 定</el-button>
		  </span>
		</el-dialog>

		<div class="contextMenu" id="myMenu">
			<ul>
		        <li id="addChild">添加子节点</li>
		        <li id="addBrother">添加同级节点</li>
		        <li id="removeNode">删除节点</li>
		        <li id="cutNode">剪切</li>
		        <li id="pasteNode">粘贴</li>
		    </ul>
		</div>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	import treeNode from './treeNode.vue';
	import caseCausetree from './treeNode2.vue';
	import 'jsmind';
  	import 'jsmind/jsmind.css';
  	import 'jsmind/jsmind.screenshot.js';

	export default{
		data(){
			return {
				url:'',
				activeNames:'0',
				root:{
					show:false,
					msg:''
				},
				loading:{
					tag:false,
					root:false,
					tree:false,
				},
				tagsTreeData:[],
				dialogVisible:false,
				dialog:{
					addChild:false,
					addNewTree:false,
					addBrother:false,
					caseTree:false,
					selectRel:false,
				},
				options:{
					falv:[],
					anyou:[],
					tag:[]
				},
		        props:{
		        	value:'id',
		        	label:'topic',
		        	children:'children',
		        },
		        value:{
		        	falv:'',
		        	anyou:'',
		        	tag:'',
		        	root:'',
		        	treeName:'',
		        },
		        keyword:{
		        	falv:[],
		        	anyou:[],
		        	tag:[],
		        },
		        selectedOptions: [],
		        mind:[],
		        tags: [],
		        relations:[],
		        typeTheme:'',
		        click:{
		        	index:null,
		        	node:null
		        },
		        move:{
		        	sub_id:'',
		        	parent_id:'',
		        },
		        graphId:'',
		        rel_id:'',
			}
		},
		components:{
			treeNode,
			caseCausetree
		},
		mounted(){
			this.getUrl();
			this.rightMenu();
			this.getTreeData();
		},
		watch:{
		},
		methods: {
			cancelDialog(){
				$('.relation button').css({
					'border-color': '#c4c4c4',
					 color: '#1f2d3d'
				});
				this.rel_id = '';
				this.typeTheme = '';
                this.keyword.tag = [];
			},
			rightMenu(){
				this.$nextTick(_ => {
					let menu = $('<div id="jqContextMenu"></div>')
               				.hide()
               				.css({ position: 'absolute', zIndex: '500' })
               				.appendTo('body')
               				.bind('click', function(e) {
                   				e.stopPropagation();
               				});
	               	let content = $('#myMenu').find('ul:first').clone(true);
	               	menu.html(content);
				})
			},
			rightTip(index,e){
				let menu = $("#jqContextMenu");
				let vm = this;
				const selectNode = this.mind[index].get_selected_node();
		        this.click = Object.assign({},{
		        	index:index,
		        	node:selectNode
		        });
		        if(!!selectNode){
		        	let left = e.pageX;
					let top = e.pageY;
		        	$("#jqContextMenu").css({
		        		'left': left + 'px',
		        		'top': top + 'px'
		        	}).show();
		        	menu.find('li').bind('click',function(e){
		        		menu.hide();
		        		const name = this.id;
		        		vm[name]();
		        	})
		        }
		  		$(document).one('click', () => {
		  			menu.hide();
		  		});

			},
			actionMoveNodes(){
				const params = {
					parent_id:this.move.parent_id,
					sub_ids:JSON.stringify([this.move.sub_id]),
					graph_id:this.graphId,
					rel_id:this.rel_id
				};
				this.addNodes(params);
			},
			pasteNode(){
				if(!this.move.sub_id){
					this.$message.warning("请先复制要粘贴的子节点！");
					return false;
				}
				const node = this.click.node;
				if(node){
					this.dialog.selectRel = true;
					this.move.parent_id = node.id;
				}else{
					this.$message.warning("请选择要粘贴的父节点！");
				}
			},
			cutNode(){
				const node = this.click.node;
				if(!!node){
					this.move.sub_id = node.id;
					this.mind[this.click.index].remove_node(node.id);
					this.click = {};
				}else{
					this.$message.warning("请选择要剪切的节点！");
				}
			},
			getRelsList(){
				axios.get(this.$store.state.TagUrl + this.url)
					 .then(res => {
					 	this.relations = res.data.data.rels;
					 })
			},
			okCase(){
				const item = this.$refs.case.click;
				if(item){
					this.keyword.anyou.unshift({
						id:item.id,
						zh_name:item.topic
					});
					this.dialog.caseTree = false;
					this.search();
				}else{
					this.$message.warning("请选择一个案由！");
				}
			},
			okFalv(){
				const item = this.$refs.falv.click;
				if(item){
					this.keyword.falv.unshift({
						id:item.id,
						zh_name:item.topic
					});
					this.dialogVisible = false;
					this.search();
				}else{
					this.$message.warning("请选择一个法律或法条！");
				}
			},
			addBrother(){
				const node = this.click.node;
	            if(!!node && !node.isroot){
	            	this.dialog.addBrother = true;

	            }else{
	            	this.$message.warning("请先选择一个非根节点！");
	            }
			},
			actionAddBrotherNodes(){
				if(!this.rel_id){
					this.$message.warning("请选择一个关系！");
					return false;
				}
				const node = this.click.node;
				const sub_ids = this.keyword.tag.map(item => item.id)
				const params = {
					parent_id:node.parent.id,
					sub_ids:JSON.stringify(sub_ids),
					graph_id:this.graphId,
					rel_id:this.rel_id
				};
				this.addNodes(params);

			},
			removeNode(){
				const node = this.click.node;
				if(!node){
					this.$message.warning("请选择一个节点！");
					return;
				}
				if(node.isroot){
					this.$message.warning("不能移除根节点！");
					return;
				}
				this.deleteNode(node.id);

			},
			deleteNode(id){
				this.$confirm("确定删除该节点吗？",'提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(() => {
					axios.delete(this.$store.state.TagUrl + '/api/tag/tag/tree?axios=1&id=' + id)
					.then(res => {
						if(res.data.code === 0){
							this.$message.success("删除成功！");
							this.search();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message.info("已取消删除");
				})

			},
			delTree(tree){
				this.deleteNode(tree.id);
			},
			collapseChange(val){
				this.$nextTick(() => {
		          this.showTree(val,this.tagsTreeData[val])
		        })
			},
			actionAddNewTree(){
				if(this.value.root){
					let item = {};
					item = this.options.tag.find(item => item.id === this.value.root);
					const index = this.tagsTreeData.length;

					const data = {
						id:item.id,
						topic:item.zh_name
					};

					this.tagsTreeData.unshift(data);
					axios.post(this.$store.state.TagUrl + '/api/tag/tag/tree?axios=1&id=' + item.id).then((res) => {
						if(res.data.code == 0){
							this.$message.success("新增成功！");
							this.getTagsTree();
							this.dialog.addNewTree = false;
							this.value.root = '';
						}else if(res.data.code === 2){
							this.root.show = true;
						}
					}).catch(err => {
						this.$message.error("新增子图有错误！");
					})
				}
			},
			addNewTree(){
				this.dialog.addNewTree = true;
				this.value.root = '';

			},
			moveNode(){
				const selected_node = this.mind.get_selected_node();

			},
			selectRelation(item){
				this.rel_id = item.id;
				this.typeTheme = item.color;
				$("." + item.en_name).css({
					'border-color': item.color,
					color: item.color
				}).siblings().css({
					'border-color': '#c4c4c4',
					 color: '#1f2d3d'
				});
			},
			screenShot(){
				const selected_node = this.click.node;
				this.mind[this.click.index].screenshot.shootDownload();
			},
			actionAddTagNodes(){
				if(!this.rel_id){
					this.$message.warning("请选择一个关系！");
					return false;
				}
				const selected_node = this.click.node;
				const sub_ids = this.keyword.tag.map(item => item.id);
				const params = {
					parent_id:selected_node.id,
					sub_ids:JSON.stringify(sub_ids),
					graph_id:this.graphId,
					rel_id:this.rel_id
				};
				this.addNodes(params);

			},
			addNodes(params){

				axios.put(this.$store.state.TagUrl + '/api/tag/tag/tree?axios=1',params)
					.then(res => {
						if(res.data.code === 0){

							this.rel_id = '';
							this.typeTheme = '';
							$('.relation button').css({
								'border-color': '#c4c4c4',
								 color: '#1f2d3d'
							});
							this.search();
							this.keyword.tag = [];
							if(this.dialog.addChild){
								this.dialog.addChild = false;
							}else if(this.dialog.addBrother){
								this.dialog.addBrother = false;
							}else if(this.dialog.selectRel){
								this.dialog.selectRel = false;
							}
							this.$message.success("添加成功！");

						}
					})
			},
			selectRoot(val){

			},
			selectTag(val){
				if(val){
					let item = {};
					item = this.options.tag.find(item => item.id === val);
					item.typeTheme = this.typeTheme;
					this.keyword.tag.unshift(item);
				}
				this.value.tag = '';
			},
			remoteTags(query){
				if(query !== ''){
					this.getTags(query);
				}else{
					this.getTags();
				}
			},
			addChild(){
				this.keyword.tag = [];
				this.value.tag = '';
				const selected_node = this.click.node;
				if(!selected_node){this.$message.warning("请先选择一个父节点");return;}
				this.dialog.addChild = true;
			},

			handleClicks(index) {
				$("#jqContextMenu").hide();
		        const selectNode = this.mind[index].get_selected_node();
		        this.click = Object.assign({},{
		        	index:index,
		        	node:selectNode
		        })
		    },
			showTree(index,data){
				if (!this.mind[index]) {
					const options = {
					    container: 'tagTree'+index,
					    editable: true,
					    theme: 'mytheme',
					    mode:'side',
					    shortcut:{
					    	handles:{
					    		'myaddChild':(jm,e) => {
					    			var selected_node = jm.get_selected_node();
					    			if(!!selected_node && !selected_node.isroot){
					    				this.dialog.addChild = true;
					    			}
					    		},
					    		'myaddBrother':(jm,e) => {
					    			var selected_node = jm.get_selected_node();
					    			if(!!selected_node && !selected_node.isroot){
					    				this.dialog.addBrother = true;
					    			}
					    		},
					    		'mydelNodes':(jm,e) => {
					    			var selected_node = jm.get_selected_node();
						            if(!!selected_node && !selected_node.isroot){
						                this.deleteNode(selected_node.id);
						            }
					    		},
					    		'cutNodes':(jm,e) => {
					    			if(e.ctrlKey){
					    				this.cutNode();
					    			}
					    		},
					    		'pasteNodes':(jm,e) => {
					    			if(e.ctrlKey){
					    				this.pasteNode();
					    			}
					    		}
					    	},
					    	mapping:{
					    		myaddChild : 45,
					    		myaddBrother : 13,
					    		mydelNodes : 46,
					    		cutNodes: 88,
					    		pasteNodes: 86,
					    	}
					    },
					    default_event_handle:{
				            // enable_mousedown_handle:true,
				            // enable_click_handle:true,
				            enable_dblclick_handle:false
				        },
					};
					this.mind[index] = new jsMind(options);
		        }
		        if(!data){
		        	this.mind[index].show();
		        	return;
		        }
		        let mind = {
		        	meta: {
		        		name:data.topic
		        	},
		            layout: {
		            	hspace: 30,          // 节点之间的水平间距
		            	vspace: 10,          // 节点之间的垂直间距
		            	pspace: 3           // 节点收缩/展开控制器的尺寸
		          	},
		          	format: 'node_tree',
		          	data: data
		        };
		        this.mind[index].show(mind);
			},

			getUrl(){
				axios.get(this.$store.state.TagUrl + '/api/tag/graphs')
					.then(res => {
						const item = res.data.data.find(item => item.name == '概念层次标签图');
						this.url = item.url;
						this.graphId = item.id;
						this.getRelsList();
						this.search();
					})
			},
			search(){
				this.loading.tree = true;
				const params = {
					cause_ids:JSON.stringify(this.keyword.anyou.map(row => {return row.id})),
					law_ids:JSON.stringify(this.keyword.falv.map(row => {return row.id}))
				}
				this.getTags();
				this.getTagsTree(params);
			},
			getTags(keyword){
				const params = {
					use_type:'list',
					keyword:keyword,
					page_size:100,
				};
				this.loading.tag = true;
				axios.get(this.$store.state.TagUrl + '/api/tag/tag/tree',{params})
					.then(res => {
						this.options.tag = res.data.data;
						this.loading.tag = false;
					}).catch(err => {
						this.$message.error("获取标签节点错误！");
					})
			},
			getTagsTree(params){
				axios.get(this.$store.state.TagUrl + '/api/tag/tag/tree?use_type=tree&border=1',{params})
					 .then(res => {
					 	if(res.data.data.length == 0){
					 		this.$message.warning("没有数据！");
					 		this.tagsTreeData = [];
					 	}else{
					 		this.tagsTreeData = res.data.data;
					 	}
					 	this.tagsTreeData.map((row,index) => {
					 		this.$nextTick(_ => {
					 			this.showTree(index,row);
					 		})
					 	});
						this.loading.tree = false;

					 }).catch(err => {
					 	this.$message.error("获取标签树错误！");
					 })
			},
			selectFalv(val){
				if(val){
					let item = {};
					item = this.options.falv.find(item => item.id === val);
					this.keyword.falv.unshift({zh_name:item.topic,id:item.id});
				}
				this.value.falv = '';
			},
			getTreeData(){
		        axios.get(this.$store.state.TagUrl + '/api/tag/law_system/tree').then((res) => {
		          this.options.falv = res.data.data[0].children;
		        })
		    },
			selectAnyou(val){
				if(val){
					let item = {};
					item = this.options.anyou.find(item => item.id === val);
					this.keyword.anyou.unshift(item);
					this.search();
				}
				this.value.anyou = '';
			},
			getAnyouOptions(val){
				axios.get(this.$store.state.TagUrl + '/api/tag/causes?keyword='+val)
					.then(res => {
						this.options.anyou = res.data.data;
					})
			},
			filter(value){
		        console.log(value,'444')
			},
			getTreeOptons(){
				axios.get(this.$store.state.TagUrl + '/api/tag/law_system/tree')
					.then((res) => {
						this.options.falv = res.data.data;
					})
			},
			handleClose(tag,type){
				if(type == 'falv'){
					this.keyword.falv.splice(this.keyword.falv.indexOf(tag),1);
					this.search();
				}else if(type == 'anyou'){
					this.keyword.anyou.splice(this.keyword.anyou.indexOf(tag),1);
					this.search();
				}else if(type == 'tag'){
					this.keyword.tag.splice(this.keyword.tag.indexOf(tag),1);
				}
			},

	      	handleItemChange(val){
	      		let id = null;
	      		let index = this.options.falv.indexOf(this.options.falv.find(row => row.id == val[0]));
	      		const firstLevel = this.options.falv[index];
	      		let index2 = val[1]?firstLevel.children.indexOf(firstLevel.children.find(row => row.id == val[1])):null;

	      		if(val.length == 1){
	      			if(firstLevel.children.length == 0){
	      				id = val[0];
	      				this.getNextLevel(id,index,null);
	      			}
	      		}else if(val.length == 2){
	      			id = val[1];
	      			this.getNextLevel(id,index,index2);

	      		}else if(val.length == 3){

	      		}

	      	},
	      	handleChange(val){
	      		const index = this.options.falv.indexOf(this.options.falv.find(row => row.id == val[0]));
	      		const firstLevel = this.options.falv[index];
	      		const index2 = firstLevel.children.indexOf(firstLevel.children.find(row => row.id == val[1]));
	      		const secLevel = firstLevel.children[index2].children;
	      		let item = {};
	      		item = secLevel.find(row => row.id == val[2]);
	      		this.keyword.falv.unshift({zh_name:item.topic,id:item.id});
	      		this.search();

	      	},
	      	getNextLevel(id,index,index2){
	      		axios.get(this.$store.state.TagUrl + '/api/codes?category_id=' + id)
	      			.then(res => {
	      				if(index2 == null){
	      					if(res.data.data.length == 0){
		      					this.options.falv[index].children = [{topic:'没有数据',disabled:true}];
		      				}
	      				}else{
	      					if(res.data.data.length == 0){
	      						this.options.falv[index].children[index2].children = [{topic:'没有数据',disabled:true}];
	      					}else{
		      					this.options.falv[index].children[index2].children = res.data.data.map(row => {
		      						return {
		      							id:row.id,
		      							topic:row.topic
		      						}
		      					})
	      					}
	      				}

	      			})
	      	}
	    }
	}
</script>

<style lang="less" scoped>
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
	header{
		padding: 24px 0;
		background: #f6f6f6;
		padding-left: 65px;
		> div{
			height: 36px;
			line-height: 36px;
			display: inline-block;
			margin-right: 20px;
			border:1px solid #2281e9;
			width: 20%;
			// min-width: 553px;
			background: #fff;
			margin-bottom: 20px;
			.anyou{
				display: inline-block;
				width: 16%;
				text-align: center;
				font-size: 16px;
				color:#3d3d3d;
				box-sizing: border-box;
				border-right: 1px solid #2281e9;
			}
		}
		> p{
			line-height: 38px;
			> .title{
				font-size: 16px;
			}
		}
		> .search{
			margin-top: 10px;
		}
	}
	.tree{
		height: 500px;
	}
	.layer{
		> section{
			padding: 20px 60px;
			> nav{
				display: flex;
				justify-content:space-between;
				.actionBtn{
					display: flex;
					li + li{
						margin-left: 10px;
					}
					li{
						button{
							border:0 none;
							font-size: 12px;
							padding-left: 25px;
							&:hover{
								color:#fff;
							}
						}
						.action-addchild{
							background: url('../../assets/layer/addnode.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/addnode_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-addnewtree{
							background: url('../../assets/layer/addtree.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/addtree_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-addbrother{
							background: url('../../assets/layer/addbrother.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/addbrother_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-removenode{
							background: url('../../assets/layer/delnode.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/delnode_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-cutnode{
							background: url('../../assets/layer/cut.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/cut_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-pastenode{
							background: url('../../assets/layer/paste.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/paste_hover.png') no-repeat 5px center #2281e9;
							}
						}
						.action-print{
							background: url('../../assets/layer/printscreen.png') no-repeat 5px center;
							&:hover{
								background: url('../../assets/layer/printscreen_hover.png') no-repeat 5px center #2281e9;
							}
						}
					}
				}
				.relation{
					strong{
						font-size: 14px;
					}
				}
			}
			.el-collapse{
				margin-top: 10px;
			}

		}
		.addChild{
			.tags{
				margin-top: 20px;
				margin-left: -12px;
				.el-tag{
					margin-bottom: 10px;
				}
			}
			.relation{
				margin-bottom: 20px;
			}
		}
	}
	.success{
		&:hover{
			background: #fff;
		    border-color: #11b95c;
		    color: #11b95c;
		    outline: 0;
		}
	}
	.el-button.is-plain{

	}
	.el-collapse-item__content{
		position: relative;
		.icon-close{
			float: right;
			width: 24px;
			height: 24px;
			cursor: pointer;
			background: url('../../assets/close.png') no-repeat center;
		}
	}
	.contextMenu{
		display: none;
	}
	#jqContextMenu{
		ul{
			background: #fff;
			border:1px solid #999;
			line-height: 15px;
			width: 100px;
			li{
				cursor: pointer;
				padding: 5px;
				&:hover{
            		background: #b6bdd2;
				}
			}
		}
	}
</style>
<style lang="less">
	.layer{
		header{
			.cascader{
				width: 80%;
				.el-input{
					width: 100%;
				}
			}
			.el-input{
				width: 65%;
				input{
					border:0 none;
				}
			}
		}
		.tagTree{

			min-height: 700px;
			.jsmind-inner{
				min-height: 700px;
			}
		}
		.addChild{
			.el-dialog__body{
				padding: 25px 20px !important;
			}
		}
		.dialog-full{
			width: 90%;
			margin: 48px auto 0;
			.el-dialog__body{
				height: 90%;
				.tree{
					height: 100%;
				}
			}
		}
	}
</style>
