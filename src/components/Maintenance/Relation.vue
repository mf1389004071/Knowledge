<template>
	<div id="relation">
		<!-- 头部搜索框 -->
		<search :isChecked="true"></search>

		<div class="main">
			<!-- 文本内容 -->
			<div class="text-content clearfloat">
				<p>
					<el-button @click="getRelation">显示文本知识</el-button>
				</p>
			</div>

			<div class="main_center clearfloat">
				<!-- 按钮组 -->
				<p>
					<el-button @click="add_show = true;editall = false;" v-show="!add_show">添加关系</el-button>
					<el-button class="first" @click="add" v-show="add_show">完成添加</el-button>
					<el-button @click="editAll" v-show="!editall">编辑全部关系</el-button>
					<el-button class="first" @click="saveEditAll" v-show="editall">保存全部关系</el-button>
					<el-button @click="delAll">删除全部关系</el-button>
				</p>

				<!-- 列表组 -->
				<div class="list_box">
					<div class="title">
						<span>关系名称</span>
						<span>关系类型</span>
						<span>关系属性</span>
						<span>操作</span>
					</div>
					<ul class="addlist" v-show="add_show">
						<li v-for="(item,index) in addList">
							<span>
								<el-input v-model="item.name" placeholder="请输入内容"></el-input>
							</span>
							<span>
								<el-select v-model="item.type" filterable allow-create placeholder="请选择">
							        <el-option
							          v-for="item in relation_options"
							          :key="item.value"
							          :label="item.label"
							          :value="item.value">
							        </el-option>
							    </el-select>
							</span>
							<span>
								<el-input v-model="item.attr" placeholder="请输入内容"></el-input>
							</span>
							<span>
								<i @click="save(index, item)">保存</i>
								<i @click="coll(item,index,true)">口语化</i>
								<i @click="clear(index,addList)">删除</i>
							</span>
						</li>
						<li class="addBtn">
							<i @click="addlist"></i>
							点击按钮增加更多实体列表
						</li>
					</ul>
					<ul class="edit_show">
						<template v-for="(item,index) in editList">
							<li class="show" v-if="!item.edit && !editall">
								<span>{{item.name}}</span>
								<span>{{relation_options[relation_options.findIndex(row => row.value == item.typeId)].label}}</span>
								<span>{{item.properties}}</span>
								<span>
									<i @click="editOne(index, true)">修改</i>
									<i @click="del(item.id)">删除</i>
								</span>
							</li>
							<li class="edit" v-if="item.edit || editall">
								<span>
									<el-input v-model="item.name" placeholder="请输入内容"></el-input>
								</span>
								<span>
									<el-select v-model="item.typeId" filterable allow-create placeholder="请选择">
								        <el-option
								          v-for="item in relation_options"
								          :key="item.value"
								          :label="item.label"
								          :value="item.value">
								        </el-option>
								    </el-select>
								</span>
								<span>
									<el-input v-model="item.properties" placeholder="请输入内容"></el-input>
								</span>
								<span>
									<i @click="saveEdit(index,item)">保存</i>
									<i @click="coll(item,index,false)">口语化</i>
									<i @click="editOne(index, false)">取消</i>
								</span>
							</li>
						</template>

					</ul>
				</div>
			</div>
		</div>

		<colloquial ref="coll"></colloquial>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Search from '../common/search'
import Colloquial from './Colloquial'
	export default{
		data(){
			return {
				add_show:false,
				pop_show:false,
    			relation_options:[],
    			editList:[],
    			addList:[
    				{
    					name : '',
						type : '',
						attr : '',
						synonyms : [],
						colloquial : [],
    				}
    			],
    			// content:this.$store.state.search.content,
    			editall:false,
    			disabled:true,
    			editObj:{},
			}
		},
		components:{
	    	'search':Search,
	    	'colloquial':Colloquial
	    },
	    mounted(){
	    	var _this = this;
        	this.$store.commit("setChecked",true);
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
	    },
	    computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      return JSON.parse(this.user.config.data).username
		    }
		},
		methods:{
			coll(item,index,add){
				this.$refs.coll.show = true;
				this.$refs.coll.item = {
					item:item,
					index:index,
					add:add,
					synonyms:item.synonyms,
					colloquial:item.colloquial
				};
			},
			delAll(){
				var _this = this;
				if(this.$store.state.search.content){
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	const ids = [];
				        	this.editList.map((elem, index) => {
				        		ids.push(elem.id)
				        	})
				        	axios.delete(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?user_name='+this.username+'&source_id='+ _this.$store.state.search.content_id +'&ids=' + JSON.stringify(ids))
								 .then((res) => {
						          	this.$message.success('删除成功!');
								 	_this.getRelation();
								 }).catch((res) => {
								 	console.log('err')
								 })
				        }).catch(() => {
				          this.$message.info('已取消删除!');
				        });

				}else{
					this.$message.info('请选择法条!');
				}
			},
			add(){
				var _this = this;
				const params = [];
				if(this.addList.length){
					this.addList.map((elem, index) => {
						params.push({
							name:elem.name,
							type:elem.type,
							property:elem.attr,
							source_id:this.$store.state.search.content_id
						})
					})
					axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
	    				 .then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功!');
							        this.add_show = false;
							        this.addList = [];
							        this.getRelation();
							        this.disabled= false;

		    					}else{
		    						this.$message.error(res.data.msg);
		    					}

	    				}).catch((err) => {
	    					console.log(err)
	    				})
    			}else{
    				this.add_show = false;
    				this.disabled= false;
    			}
			},
			editOne(index, open){
				if(this.editall)
					this.editall = false;
				const obj = Object.assign(this.editList[index], {edit: open});
              	this.$set(this.editList, index, obj);
			},
			editAll(){
				this.editall = true;
				this.add_show = false;
				this.disabled = true;
				this.editList.map(row => row.edit = true);
			},
			saveEdit(index,item){
				const params = {
					id:item.id,
					type:item.typeId,
					property:item.properties,
					name:item.name,
					user_name:this.username,
					source_id:this.$store.state.search.content_id,
					colloquial:JSON.stringify(item.colloquial),
    				synonyms:JSON.stringify(item.synonyms),
				}
				axios.put(this.$store.state.url1 + '/api/nlp/knowledge/relation?axios=1',params)
					.then((res) => {
						this.$message.success('修改成功！');
						this.editOne(index,false);
					}).catch(function(res){
						console.log('err')
					})
			},
			saveEditAll(){
				const params = [];
				this.editList.filter(row => row.edit).map((elem, index) => {
					elem.edit = false;
					params.push({
						_id:elem.id,
						name:elem.name,
    					type:elem.typeId,
    					property:elem.properties,
    					source_id:this.$store.state.search.content_id,
    					colloquial:elem.colloquial,
    					synonyms:elem.synonyms,
					})
				});
				axios.put(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
    					.then((res) => {
    						this.$message.success('保存关系成功');
	    					this.getRelation();
	    					this.editall = false;
    						this.disabled = false;
	    				}).catch((err) => {
	    					console.log('err')
	    				})
			},
			clearEdit(index,rows){
				rows.splice(index,1);
			},
			del(id){
				var _this = this;

				this.$confirm('此操作将永久删除该关系, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
			        	axios.delete(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?user_name='+this.username+'&source_id='+ this.$store.state.search.content_id +'&ids=' + JSON.stringify([id]))
							 .then((res) => {
					          	this.$message.success('删除成功');
							 	this.editList.splice(index,1);
							 }).catch((res) => {
							 	console.log('err')
							 })
			        }).catch(() => {
			          	this.$message.info('已取消删除');
			        });
			},
			save(index,row){
				var _this = this;
				if(row.attr && row.name && row.type){
					const params = [{
						name:row.name,
    					type:row.type,
    					property:row.attr,
    					source_id:this.$store.state.search.content_id,
    					colloquial:row.colloquial,
    					synonyms:row.synonyms,
					}];
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
    					.then((res) => {
	    					if(res.data.data.length){
	    						this.$message.success('保存实体成功')
						        this.addList.splice(index,1);
	    					}
	    					this.getRelation();
    				}).catch(function(res){

    				})
				}
			},
			clear(index,rows){
    			rows.splice(index,1);
    		},
			addlist(){
				this.addList.push({
					name : '',
					type : '',
					attr : '',
					synonyms : [],
					colloquial : [],
				})
			},
			// 获取关系
	    	getRelation(){
	    		this.disabled= false;
	    		if(this.$store.state.search.content_id){
	    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/source?source_id='+this.$store.state.search.content_id)
			    	     .then((res) => {
			    	     	this.editList = [];
			    	     	res.data.data.map((elem, index) => {
			    	     		this.editList.push({
			    	     			name:elem.name,  //实体名
			    	     			properties:elem.property,//实体属性
			    	     			type:elem.type_name,//实体类型id
			    	     			typeId:elem.type,
			    	     			colloquial:elem.colloquial,
                    				synonyms:elem.synonyms,
			    	     			category:'relation',
			    	     			id:elem._id
			    	     		})
			    	     	})
			    	     }).catch((err) => {
			    	     	console.log(err);
			    	     })
	    		}
	    	},

		}
	}
</script>

<style lang="less" scoped>
#relation{
	// 头部搜索框
	.search_header{
		height: 82px;
		background: #F6F6F6;
		.search_box{
			width: 1180px;
			margin-left: 70px;
			display: flex;
			justify-content:space-between;
		}
		.select{
			width: 216px;
			height: 34px;
			line-height: 34px;
			border: 1px solid #2281E9;
			background: #fff;
			margin-top: 24px;
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
	}

	.main{
    	margin-top: 117px;
		// 文本内容
		.text-content{
			margin-top: 40px;
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
			> p{
				margin-top: 26px;
				margin-bottom: 7px;
				text-align: right;
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
					width: 156px;
					&.first{
						background: #37BE29;
						border-color: #37BE29;
						color: #fff;
						width: 156px;
					}
				}
			}
			.list_box{
				font-size: 16px;
				.title{
					height: 52px;
					line-height: 52px;
					display: flex;
					justify-content:space-between;
					span{
						text-align: center;
						flex:1;
						background: #2281e9;
						color: #fff;
						& + span{
							margin-left: 1px;
						}
					}

				}
				ul{
					li{
						display: flex;
						justify-content:space-between;
						height: 60px;
						line-height: 60px;
						span{
							flex:1;
							padding:2px;
							text-align: center;
							display: flex;
							justify-content:space-around;
							align-items: center;
							.el-input__inner{
								border-radius: 0;
								border-color: #5a9fe8;
								text-align: center;
								font-size: 16px;
								color:#006ee7;
								height: 44px;
							}
							.el-select{
								width: 100%;
								.el-input__icon{
									color:#2281e9;
								}
							}

							> i{
								font-size: 0;
								display: inline-block;
								vertical-align: middle;
								width: 24px;
								height: 100%;
								cursor: pointer;
								background: url('../../assets/save.png') no-repeat center;
								&:nth-child(2){
									background: url('../../assets/colloquial.png') no-repeat center;
	    						}
								&:last-child{
									background: url('../../assets/close.png') no-repeat center;
								}
							}
						}
						&.addBtn{
							background: #f5f5f5;
							text-align: center;
							color:#a6aaae;
							font-size: 14px;
							display: inherit;
							i{
								display: inline-block;
								width: 30px;
								height: 30px;
								cursor: pointer;
								vertical-align: middle;
								background: url('../../assets/maintenance/add.png') no-repeat center;
							}
						}
					}
					&.edit_show{
						li{
							height: 60px;
							line-height: 60px;
							&.show span{
								> i{
									background-image: url('../../assets/change.png');
									& + i{
										background-image: url('../../assets/delete.png');
									}
								}
							}
						}
						li:nth-child(even){
							background: #F5F5F5;
						}
					}
				}
			}
		}

	}
}



</style>
