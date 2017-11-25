<template>
	<div class="srtnotext_search mainten">
		<div class="search_box">
			<!-- 案由 -->
			<div class="select clearfloat left">
				<span>{{option.title}}</span>
				<el-select
					v-model="value"
					@change="select"
					filterable
					:placeholder="option.msg"
					>
				    <el-option
				      v-for="item in options"
				      :key="item.label"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
			</div>
			<div class="clearfloat right">
				<!-- 搜索类型 -->
				<div class="select">
					<el-select
						v-model="value3"
						@change="selectType"
						placeholder="点击选择类型"
						>
					    <el-option
					      v-for="item in options3"
					      :key="item.label"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<!-- 搜索关键字 -->
				<div class="select search">
					<el-select v-model="value2" v-loading="loading" remote multiple filterable :remote-method="remoteOptions" placeholder="请选择" @change="search">
					    <el-option-group
					      v-for="group in options2"
					      :key="group.label"
					      :label="group.label">
					      <el-option
					        v-for="item in group.options"
					        :key="item.value"
					        :label="item.label"
					        :value="item.value">
					      </el-option>
					    </el-option-group>
					</el-select>
					<i @click="search">搜索</i>
				</div>
			</div>

			<!-- <div class="select search" v-if="type != 1">
				<el-select v-model="value2" :loading="loading" remote filterable :remote-method="remoteOptions" placeholder="请选择" @change="search">
				    <el-option-group
				      v-for="group in options2"
				      :key="group.label"
				      :label="group.label">
				      <el-option
				        v-for="item in group.options"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-option-group>
				</el-select>
				<i @click="search">搜索</i>
			</div>	 -->
		</div>
	</div>

</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data () {
			return {
				value:'',
				value2:[],
				value3:1,
				options:[],
			    options2:[],
			    options3:[
			    	{
			    		label:'知识链',
			    		value:1
			    	},
			    	{
			    		label:'实体',
			    		value:2
			    	},
			    	{
			    		label:'关系',
			    		value:3
			    	}
			    ],
			    loading : false,
			    type:1,
			    case_cause:'',

			}
		},
		props:{
			option:Object
		},
		computed(){

		},
		beforeMount(){
			this.getCaseCause();
		},
		mounted(){
			// this.value = '593e0e0df75d09105ecf4a9a';

		},
		methods : {
			// 搜索类型
			selectType(val){
				this.type = this.$parent.type = val;
				this.$parent.params.page = 1;
				this.$parent.params.page_size = 0;
				if(this.value2.length){
					this.value2 = [];
				}
				if(val == 1){
					// 知识链
					this.$parent.getChainList();
				}else if(val == 2){
					// 实体
					this.$parent.erList.title = ['实体名称','实体属性'];
					this.$parent.getEntityProp();
					this.$parent.getEntity();
				}else if(val == 3){
					// 关系
					this.$parent.erList.title = ['关系名称','关系类型','关系属性'];
					this.$parent.getRelation();
					this.$parent.getRelationOption();
				}
			},
			getCaseCause(){
		      axios.get(this.$store.state.url1 + '/api/nlp/label/chain/cause/list')
		           .then((res) => {
		              this.options = [];
		              res.data.data.map((elem, index) => {
		                this.options.push({
		                  value:elem._id,
		                  label:elem.name
		                })
		              })
		           }).then((res) => {
		           		this.value = this.options[0].value;
		           }).catch((err) => {
		              console.log(err)
		           })
		    },
			remoteOptions(query){
				if(query !== ''){
					this.loading = true;
			        const params = {
			        	name:query,
			        	case_cause:this.value,
			        }
			        let options = [];
			        if(this.type == 1){
			        	Promise.all([axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list',{params:params}),axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list',{params:params})])
						 .then((res) => {
						 	this.loading = false;
						 	this.options2 = [];
						 	res.filter((row,index) => {
						 		let label = index == 0 ? '实体名称' : '关系名称';
						 		if(row.data.data.length){
						 			options = row.data.data.map(item => item.name);
						 			this.options2.push({
						 				label:label,
						 				options:$.unique(options).map(option => {
							 				return {value:option,label:option}
							 			})
						 			})
						 		}
						 	})
						 }).catch((err) => {
						 	console.log('err')
						 });
						}else if(this.type == 2){
							axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list',{params:params})
								 .then((res) => {
								 	this.loading = false;
								 	this.options2 = [];
								 	if(res.data.data.length){
								 		options = res.data.data.map(item => item.name);
								 		this.options2.push({
								 			label:'实体名称',
								 			options:$.unique(options).map(option => {
									 			return {value:option,label:option}
									 		})
								 		})
								 	}
								})
						}else if(this.type == 3){
							axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list',{params:params})
								 .then((res) => {
								 	this.loading = false;
								 	this.options2 = [];
								 	if(res.data.data.length){
								 		options = res.data.data.map(item => item.name);
								 		this.options2.push({
								 			label:'实体名称',
								 			options:$.unique(options).map(option => {
									 			return {value:option,label:option}
									 		})
								 		})
								 	}
								})
						}else{
							console.log('没有该类型')
						}

				}else{
					this.options2 = [];
				}
			},
			select(val){
				this.case_cause = val;
				this.$parent.params.key_word = '';
				if(this.value2.length){
					this.value2 = [];
				}
				this.$emit('select',val,this.type);
			},
			search(){
				let params = {};
				if(this.type == 1){
					this.$parent.params.key_word = JSON.stringify(this.value2);
					params = {
						case_cause:this.value,
						page_size:10,
						page:1,
						key_word:JSON.stringify(this.value2)
					}
					this.$parent.getChainList(params);
				}else if(this.type == 2){
					params = {
						case_cause:this.value,
						page_size:10,
						name:this.value2[0]
					}
					this.$parent.getEntity(params);
				}else if(this.type == 3){
					params = {
						case_cause:this.value,
						page_size:10,
						name:this.value2[0]
					}
					this.$parent.getRelation(params);
				}else{
					console.log('没有type')
				}

			},

		}
	}
</script>
<style lang="less" scoped>
	.srtnotext_search{
		width: 100%;
		.search_box{
			.right{
				width: 70%;
				min-width: 845px;
				.select{
					float: left;
					width: 20%;
					line-height: 36px;
					height: 36px;
					box-sizing: border-box;
					.el-select{
						width: 100%;
						height: 33px;
					}
					&.search{
						width: 80%;
						margin-left: -1px;
						.el-select{
							width: 90%;
							> .el-input{
								.el-input__icon{
									display: none;
								}
								.el-input__inner{
									height: 33px !important;
								}
							}
							.el-select__tags{
								span{
									border: none;
									padding: 0 5px;
								}
							}
						}
						> i{
							font-size: 0;
							display: inline-block;
							width: 9%;
							min-width: 66px;
							height: 26px;
							background: url('../../assets/maintenance/search.png') no-repeat center;
							border-left: 1px solid #2281E9;
							cursor: pointer;
						}
					}
				}

			}
      .left{
        width: 20%;
        min-width: 289px;
        border:1px solid #2281E9;
        border-radius: 0;
        > span{
          width: 15%;
          min-width: 60px;
        }
        .el-select{
          width: 65%;
          min-width: 160px;
          .el-input{
            width: 100%;
            display: inline-block;
          }
        }
      }
		}
	}
</style>

<style lang="less">
	.mainten{
		.search{
			.el-input{
				input{
					height: 33px !important;
				}
			}
		}
	}
</style>
