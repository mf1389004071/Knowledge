<template>
  <div class="entity_relation">
    <div class="titlespan">
      <span @click="changeStatus1">实体维护</span>
      <span @click="changeStatus">关系维护</span>
    </div>
    <div id="entity" v-if="status == 1">
      <search :isChecked="true"></search>

      <div class="main">
        <!-- 文本内容 -->
        <div class="text-content clearfloat">
          <p>
            <el-button @click="getEntity">显示文本知识</el-button>
          </p>
        </div>

        <div class="main_center clearfloat">
          <!-- 按钮组 -->
          <p>
            <el-button @click="add_show = true;editall = false;" v-show="!add_show">添加实体</el-button>
            <el-button class="first" @click="add" v-show="add_show">完成添加</el-button>
            <el-button @click="editAll" v-show="!editall">编辑全部实体</el-button>
            <el-button class="first" @click="saveEditAll" v-show="editall">保存全部实体</el-button>
            <el-button @click="delAll">删除全部实体</el-button>
          </p>

          <!-- 列表组 -->
          <div class="list_box">
            <div class="title">
              <span>实体名称</span>
              <span>实体类型</span>
              <span>实体属性</span>
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
                        v-for="item in entity_options"
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
                  <span>{{entity_options[entity_options.findIndex(row => row.value == item.typeId)].label}}</span>
                  <span>{{item.properties}}</span>
                  <span>
									<i @click="editOne(index, true)">修改</i>
									<i @click="del(item.id,index)">删除</i>
								</span>
                </li>
                <li class="edit" v-if="item.edit || editall">
								<span>
									<el-input v-model="item.name" placeholder="请输入内容"></el-input>
								</span>
                  <span>
									<el-select v-model="item.typeId" filterable allow-create placeholder="请选择">
								        <el-option
                          v-for="item in entity_options"
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
        <div class="main_bottom">
        </div>
      </div>

      <colloquial ref="coll"></colloquial>
    </div>
    <div v-if="status == 2">
      <relation></relation>
    </div>
  </div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Search from '../common/search'
import Colloquial from './Colloquial'
import Relation from './Relation';

	export default{
		data(){
			return {
        status: 1,
				pop_show:false,
				entity_options:[],
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
    			editall:false,
    			add_show:false,
    			disabled:true,
			}
		},
		components:{
	    	'search':Search,
	    	'colloquial':Colloquial,
        'relation': Relation
	    },
    mounted(){
        	this.$store.commit("setChecked",true);
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
    computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      return JSON.parse(this.user.config.data).username
		    }
		},
		methods:{
      changeStatus1(){
        console.log('status', this.status);
        this.status = 1;
      },
      changeStatus(){
        console.log('status', this.status);
        this.status = 2;
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
			delAll(){
				var _this = this;
				if(this.$store.state.search.content){
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	const ids = [];
				        	this.relationList.map((elem, index) => {
				        		ids.push(elem.id)
				        	})
				        	axios.delete(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?user_name='+this.username+'source_id='+ this.$store.state.search.content_id +'&ids=' + JSON.stringify(ids))
								 .then((res) => {
								 	this.$message.success('删除成功！');
								 	this.getRelation();
								 }).catch((res) => {
								 	console.log('err')
								 })
				        }).catch((res) => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });
				        });

				}else{
					this.$message.info('请选择法条');
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
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params),'user_name':this.username})
	    				.then((res) => {
	    					if(res.data.data.length){
						        this.$message.success('保存实体成功!');
						        this.add_show = false;
						        this.addList = [];
						        this.getEntity();
						        this.disabled= false;
	    					}else{
	    						this.$message({
	    							type:'error',
	    							message:res.data.msg
	    						})
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
			// 保存单个修改
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
				axios.put(this.$store.state.url1 + '/api/nlp/knowledge/entity?axios=1',params)
					.then((res) => {
						this.$message.success('修改成功！');
						this.editOne(index,false);
					}).catch((err) => {
						console.log('err')
					})
			},
			// 保存全部修改
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
				axios.put(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params),'user_name':this.username})
    				.then((res) => {
						this.$message.success('保存实体成功');

					    this.getEntity();
    					this.editall = false;
    					this.disabled = false;

    				}).catch((err) => {
					    this.getEntity();
    					this.editall = false;
    					this.disabled = false;

					    this.getEntity();
    					this.editall = false;
    					this.disabled = false;

    				}).catch(function(res){

    				})
			},
			clearEdit(index,rows){
				rows.splice(index,1);
			},
			del(id,index){
				this.$confirm('此操作将永久删除该实体, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
						axios.delete(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?user_name='+this.username+'&source_id='+ this.$store.state.search.content_id +'&ids=' + JSON.stringify([id]))
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
			// 单个添加
			save(index,row){
				if(row.attr && row.name && row.type){
					const params = [{
						name:row.name,
    					type:row.type,
    					property:row.attr,
    					source_id:this.$store.state.search.content_id,
    					colloquial:row.colloquial,
    					synonyms:row.synonyms,
					}];
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params),'user_name':this.username})
    				.then((res) => {
    					if(res.data.data.length){
    						this.$message.success('保存实体成功')
					        this.addList.splice(index,1);
    					}
    					this.getEntity();
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
			// 获取实体
	    	getEntity(){
	    		this.disabled = false;
	    		if(this.$store.state.search.content_id){
	    			axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/source?source_id='+this.$store.state.search.content_id)
			    	     .then((res) => {
			    	     	this.editList = [];
			    	     	res.data.data.map((elem, index) => {
			    	     		this.editList.push({
			    	     			name:elem.name,  //实体名
			    	     			properties:elem.property,//实体属性
			    	     			type:elem.type_name,//实体类型id
			    	     			typeId : elem.type,
			    	     			colloquial:elem.colloquial,
                    				synonyms:elem.synonyms,
			    	     			category:'entity',
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
  .entity_relation{
    width: 80%;
    height: auto;
    margin: 48px auto;
    padding-top: 70px;
    .titlespan{
      margin-top: -50px;
      >span{
        display: inline-block;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        padding-left: 20px;
        width: 100px;
        background: #2281E9;
        margin-right: 10px;
        color: #fff;
        &:hover{
          background: rgba(0,0,0,0.1);
          cursor: pointer;
        }
      }
    }
    #entity{
      margin: 0 auto;
      #header_search{
        width: 100%;
        .search_box{
          width: 100% !important;
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
            text-align: right;
            margin-top: 26px;
            margin-bottom: 7px;
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
  }


  .mask{
  	position: fixed;
  	top: 0;
  	bottom: 0;
  	left: 0;
  	right: 0;
  	background: #495563;
  	opacity: .8;
  	z-index:100;
  }
</style>
<style lang="less"> 
  .entity_relation{
    #entity{
      #header_search .search_box{
        width: 100%;
      }
      #header_search .search_result{
        width: 100%;
      }
    }
    #relation{
      #header_search .search_box{
        width: 100%;
      }
      #header_search .search_result{
        width: 100%;
      }
    }
  }
</style>
