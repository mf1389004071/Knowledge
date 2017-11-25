<template>
	<div class="list_box">
      	<div class="title">
	        <span v-for="item in erList.title">{{item}}</span>
	        <span>操作</span>
      	</div>
      	<ul class="addlist">
	        <li v-for="(item,index) in addList">
	          <span>
	            <el-input v-model="item.name" placeholder="请输入内容"></el-input>
	          </span>
	          <span v-if="$parent.type == 2">
	            <el-select v-model="item.attr" filterable placeholder="请选择">
	                  <el-option
	                    v-for="item in erList.propOptions"
	                    :key="item.value"
	                    :label="item.label"
	                    :value="item.value">
	                  </el-option>
	            </el-select>
	          </span>
	          <span v-if="$parent.type == 3">
	            <el-select v-model="item.type" filterable allow-create placeholder="请选择">
	                  <el-option
	                    v-for="item in erList.typeOptions"
	                    :key="item.value"
	                    :label="item.label"
	                    :value="item.value">
	                  </el-option>
	            </el-select>
	          </span>
	          <span v-if="$parent.type == 3">
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
        	<template v-for="(item,index) in erList.List">
	          	<li class="show" v-if="!item.edit && !editall">
		            <span>{{item.name}}</span>
		            <!-- <span>{{options[options.findIndex(row => row.value == item.typeId)].label}}</span> -->
		            <span v-if="$parent.type == 3">{{item.type}}</span>
		            <span>{{item.propertyName}}</span>
		            <span>
		              <i @click="editOne(index, true)">修改</i>
		              <i @click="del(item)">删除</i>
		            </span>
	         	</li>
		        <li class="edit" v-if="item.edit || editall">
		            <span>
		              <el-input v-model="item.name" placeholder="请输入内容"></el-input>
		            </span>
		            <span v-if="$parent.type == 3">
		              <el-select v-model="item.typeId" filterable allow-create placeholder="请选择">
		                    <el-option
		                      v-for="item in erList.typeOptions"
		                      :key="item.value"
		                      :label="item.label"
		                      :value="item.value">
		                    </el-option>
		                </el-select>
		            </span>
		            <span v-if="$parent.type == 2">
		              	<el-select v-model="item.property" filterable placeholder="请选择">
			                  <el-option
			                    v-for="item in erList.propOptions"
			                    :key="item.value"
			                    :label="item.label"
			                    :value="item.value">
			                  </el-option>
			            </el-select>
		            </span>
		            <span v-if="$parent.type == 3">
		              <el-input v-model="item.propertyName" placeholder="请输入内容"></el-input>
		            </span>
		            <span>
		              <i @click="saveEdit(index,item)">保存</i>
		              <i @click="coll(item,index,false)">口语化</i>
		              <i @click="editOne(index, false)">取消</i>
		            </span>
		        </li>
        	</template>
      	</ul>
      	<colloquial ref="coll"></colloquial>
      	<div class="pagination">
	        <el-pagination
	          @size-change="handleSizeChange"
	          @current-change="handleCurrentChange"
	          :current-page="params.page"
	          :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
	          :page-size="params.page_size"
	          layout="prev, pager, next, sizes, jumper"
	          :total="params.total">
	        </el-pagination>
	    </div>
    </div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Colloquial from '../common/Colloquial'
	export default{
		data(){
			return {
				editList:[],
				pop_show:false,
				// options:this.$parent.typeOption,
				// property_options:this.$parent.propOption,
				// List:this.$parent.erList,
				entity_options:[],
		        entityList:[],
    			addList:[
    				{
    					name : '',
						type : '',
						attr : '',
						synonyms : [],
						colloquial : [],
    				}
    			],
    			editall:false,
    			add_show:false,
    			disabled:true,
    			typeShow:false,
    			type:2,

			}
		},
		props:{
			erList:{

			}
		},
		components:{
	    	'colloquial':Colloquial
	    },
	    mounted(){
	    },
	    computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      	return JSON.parse(this.user.config.data).username
		    },
		    params(){
		    	return this.$parent.params;
		    }
		},
		methods:{


   			handleSizeChange(val){
		      this.$parent.params.page_size = val;
		      if(this.$parent.type == 2){
				this.$parent.getEntity();
		      }else if(this.$parent.type == 3){
		      	this.$parent.getRelation();
		      }
		      
		    },
		    handleCurrentChange(val){
		      this.$parent.params.page = val;
		      if(this.$parent.type == 2){
				this.$parent.getEntity();
		      }else if(this.$parent.type == 3){
		      	this.$parent.getRelation();
		      }
		    },
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
			editOne(index, open){
				const obj = Object.assign(this.erList.List[index], {edit: open});
              	this.$set(this.erList.List, index, obj);
			},
			
			// 保存单个修改
			saveEdit(index,item){
				let params = {};
				if(this.$parent.type == 2 && item.name && item.property){
					params = {
						id:item.id,
						property:item.property,
						name:item.name,
						user_name:this.username,
						case_cause:this.$parent.params.case_cause,
    					colloquial:JSON.stringify(item.colloquial),
    					synonyms:JSON.stringify(item.synonyms),
					}
					axios.put(this.$store.state.url1 + '/api/nlp/label/entity?axios=1',params)
						.then((res) => {
							this.editOne(index,false);
							this.$message.success('修改成功');
						}).catch((err) => {
							console.log('err')
						})
				}else if(this.$parent.type == 3 && item.name && item.propertyName && item.typeId){
					params = {
						id:item.id,
						type:item.typeId,
						property:item.propertyName,
						name:item.name,
						user_name:this.username,
						case_cause:this.$parent.params.case_cause,
    					colloquial:JSON.stringify(item.colloquial),
    					synonyms:JSON.stringify(item.synonyms),
					}
					axios.put(this.$store.state.url1 + '/api/nlp/label/relation?axios=1',params)
						.then((res) => {
							this.editOne(index,false);
							this.$message.success('修改成功');
						}).catch((err) => {
							console.log('err')
						})
				}

			},
			
			// 删除单个实体或关系
			del(item){
				var _this = this;
				// console.log(this.List.indexOf(item));

				if(this.$parent.type == 2){
					// 实体
					this.$confirm('此操作将永久删除该实体, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
						axios.delete(this.$store.state.url1 + '/api/nlp/label/entity/list?user_name='+this.username+'&ids=' + JSON.stringify([item.id]))
							 .then((res) => {
							 	this.$message({
					            	type: 'success',
					            	message: '删除成功!'
					          	});

							 	this.erList.List.splice(this.erList.List.indexOf(item),1);
							 }).catch((res) => {
							 	console.log('err')
							 })
			        }).catch(() => {
			          	this.$message({
			            	type: 'info',
			            	message: '已取消删除'
			          	});
			        });
				}else if(this.$parent.type == 3){
					// 关系
					this.$confirm('此操作将永久删除该实体, 是否继续?', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
							axios.delete(this.$store.state.url1 + '/api/nlp/label/relation/list?user_name='+this.username+'&ids=' + JSON.stringify([item.id]))
								 .then((res) => {
								 	this.$message({
						            	type: 'success',
						            	message: '删除成功!'
						          	});

								 	this.erList.List.splice(this.erList.List.indexOf(item),1);
								 }).catch((res) => {
								 	console.log('err')
								 })
				        }).catch(() => {
				          	this.$message({
				            	type: 'info',
				            	message: '已取消删除'
				          	});
				        });
				}else{
					console.log('没有此type')
				}
			},
			// 单个添加
			save(index,row){
				let params = [];
				if(this.$parent.type == 2 && row.attr && row.name){
					params = [{
						name:row.name,
    					property:row.attr,
    					case_cause:this.$parent.params.case_cause,
    					colloquial:row.colloquial,
    					synonyms:row.synonyms,
    					user_name:this.username,
					}];
					axios.post(this.$store.state.url1 + '/api/nlp/label/entity/list?axios=1',{'entities':JSON.stringify(params)})
	    				.then((res) => {
	    					if(res.data.code == 0){
						        this.$message.success("保存实体成功")
						        this.addList.splice(index,1);
						        this.$parent.getEntity();
	    					}else{
	    						this.$message.error(res.data.msg);
	    					}
	    				}).catch((res) => {
	    					console.log('err')
	    				})
				}else
				if(this.$parent.type == 3 && row.attr && row.name && row.type){
					params = [{
						name:row.name,
    					property:row.attr,
    					type:row.type,
    					case_cause:this.$parent.params.case_cause,
    					colloquial:row.colloquial,
    					synonyms:row.synonyms,
    					user_name:this.username,
					}];
					axios.post(this.$store.state.url1 + '/api/nlp/label/relation/list?axios=1',{'relations':JSON.stringify(params)})
	    				.then((res) => {
	    					if(res.data.data.length){
	    						this.$notify({
						          title: '成功',
						          message: '保存实体成功',
						          type: 'success',
						          offset:100
						        });
						        this.addList.splice(index,1);
	    					}
	    					this.$parent.getRelation();
					    }).catch((res) => {
	    					console.log('err')
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


		}
	}
</script>

<style lang="less" scoped>
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
	.pagination{
		.el-pagination{
			width: 80%;
			margin-left: 0;
			margin: 50px auto;
		}
	}
</style>
