<template>
	<div id="add_pop">
		<div class="pop_box">
			<h2>{{Info.name}}内容添加列表<i @click="hide"></i></h2>
			<div class="content">
				<textarea-content></textarea-content>
			</div>
			<el-table :data="addlist" border style="width:1180px;">
			    <el-table-column
			      :label="Info.name+'名称'">
			      <template scope="scope">
			      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
			      </template>
			    </el-table-column>
			    <el-table-column
			      :label="Info.name+'类型'">
			      <template scope="scope">
			      	<el-select v-model="scope.row.type" placeholder="请选择">
				        <el-option
				          v-for="item in Info.options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				    </el-select>
			      </template>
			    </el-table-column>
			    <el-table-column
			      :label="Info.name+'属性'">
			       <template scope="scope">
			      	<el-input v-model="scope.row.attr" placeholder="请输入内容"></el-input>
			      </template>
			    </el-table-column>
			    <el-table-column label="操作">
			      <template scope="scope">
			        <el-button
			          size="small"
			          @click="save(scope.$index, scope.row)">保存
			        </el-button>
			        <el-button
			          size="small"
			          @click.native.prevent="coll(scope.row,scope.$index,true)">口语化
			        </el-button>
			        <el-button
			          size="small"
			          type="danger"
			          @click="clear(scope.$index,addlist)">删除</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="add">
				<i @click="addList"></i>点击按钮添加更多{{Info.name}}列表
			</div>
			<p class="button">
				<el-button @click="saveAll">保存全部内容</el-button>
			</p>
		</div>

		<colloquial ref="coll"></colloquial>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
import textareaContent from '../common/textareaContent'
import Colloquial from './Colloquial'
	export default{
		data(){
			return {
				pop_show:false,
				addlist:[
					{
    					name : '',
						type : '',
						attr : '',
						synonyms : [],
						colloquial : [],
    				}
				],
				options:[]
				// Info:[]

			}
		},
		components:{
	    	'textarea-content':textareaContent,
	    	'colloquial':Colloquial
	    },
		props:{
			info:{
				type:Object
			}
		},
		computed:{
			Info(){
				return this.info;
			},
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      return JSON.parse(this.user.config.data).username
		    }
		},
		mounted(){
		},
		methods:{
			coll(item,index,add){
				this.$refs.coll.show = true;
				console.log(item,'item')
				this.$refs.coll.item = {
					item:item,
					index:index,
					add:add,
					synonyms:item.synonyms,
					colloquial:item.colloquial
				};
			},
			addList(){
				this.addlist.push({
					name : '',
					type : '',
					attr : '',
					synonyms : [],
					colloquial : [],
				})
			},
			saveAll(){
				const params = [];
				this.addlist.map((elem, index) => {
					params.push({
    					name:elem.name,
    					type:elem.type,
    					property:elem.attr,
    					source_id:this.$store.state.search.content_id,
    					colloquial:elem.colloquial,
    					synonyms:elem.synonyms,
    				})
				});
				if(this.Info.tag == 'entity'){
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params),'user_name':this.username})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存实体成功');
							        $('.check').click();
							        this.addlist = [{
										name : '',
										type : '',
										attr : '',
										synonyms : [],
										colloquial : [],
									}]

		    					}
		    				}).catch((res) => {

		    				})
				}else{
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功');
							        $('.check').click();
							        this.addlist = [{
										name : '',
										type : '',
										attr : '',
										synonyms : [],
										colloquial : [],
									}]
		    					}
		    				}).catch((res) => {

		    				})
				}

				this.hide();

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
					if(this.Info.tag == 'entity'){
						axios.post(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params),'user_name':this.username})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功');
							        this.addlist.splice(index,1);
		    					}
		    				}).catch((res) => {

		    				})
					}else{
						axios.post(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功');
							        this.addlist.splice(index,1);
		    					}
		    				}).catch((res) => {

		    				})
					}

				}
			},
			clear(index,rows){
    			rows.splice(index,1);

    		},
    		hide2(){
    			this.pop_show = false;
    		},
    		hide(){
    			this.$emit('hide');
    			this.addlist = [{
    				name : '',
					type : '',
					attr : '',
					synonyms : [],
					colloquial : [],
    			}]
    			$('.check').click();
    		},
		}
	}
</script>

<style lang="less" scoped>
	#add_pop{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index:101;
		text-align: center;
		margin-left: -56px;
		.pop_box{
			text-align: left;
			vertical-align: middle;
			width: 1178px;
			display: inline-block;
			background: #fff;
			border: 1px solid #2e82e3;
			h2{
				height: 64px;
				line-height: 64px;
				background: #2e82e3;
				color: #fff;
				font-size: 18px;
				font-weight: normal;
				padding: 0 30px;
				position: relative;
				i{
					position: absolute;
					right: 26px;
					width: 36px;
					height: 100%;
					background: url('../../assets/structure/close.png') no-repeat center;
					cursor: pointer;
				}
			}
			.content{
				text-align: center;
				padding: 5px 5px 20px;
				textarea{
				    width: 100%;
				    height: 110px;
				    resize: none;
				    border-color: #4078B4;
				    color: #000;
				    font-size: 16px;
				    line-height: 26px;
				    margin-left: 0;
				}
			}
			.el-table{
				&::after, &::before{
					background:none;
				}

				.el-table__body{
					td{
						height: 100%;
						border-color: #fff;
						.cell{
							.el-input,.el-select{
								width: 100%;
							}

							button{
								font-size: 0;
								width: 21px;
								height: 21px;
								background: url('../../assets/save.png') no-repeat center;
								border: none;
								&:nth-child(2){
									width: 24px;
									height: 21px;
									background: url('../../assets/colloquial.png') no-repeat center;
	    						}
								&:last-child{
									width: 24px;
									height: 24px;
									background-image: url('../../assets/close.png');
								}
							}
						}

					}
				}
			}
			.add{
				height: 60px;
				line-height: 60px;
				background: #f5f5f5;
				text-align: center;
				font-size: 14px;
				color:#a6aaae;
				i{
					display: inline-block;
					width: 30px;
					height: 30px;
					vertical-align: middle;
					cursor:pointer;
					margin-right: 4px;
					background: url('../../assets/maintenance/add.png') no-repeat center;
				}
			}
			.button{
				text-align: center;
				padding: 24px 0;
				button{
					background: #2281e9;
					padding: 10px 28px;
					border: none;
					color: #fff;
				}
			}

		}
		&:after{
			content: "";
		    display: inline-block;
		    height: 100%;
		    width: 0;
		    vertical-align: middle;
		}
	}


</style>
<style lang='less'>
	#add_pop{
		.el-table{
				th{
					text-align: center;
					font-weight: normal;
					> .cell{
						background: #2282e9;
						color:#fff;
						line-height: 51px;
					}
				}
				.el-table__header{
					margin-top: -1px;
					font-size: 18px;

				}
				.el-table__body-wrapper{
					max-height: 430px;
					overflow-x: hidden;
					overflow-y: auto;
				}
				.el-table__body{
					td{
						height: 100%;
						border-color: #fff;
						.cell{
							margin-top: 2px;
							margin-bottom: 4px;
							padding: 0 2px;
							text-align: center;
							display:flex;
							justify-content:space-around;
							.el-input,.el-select{
								.el-input__icon{
									color:#2181e8;
								}
								.el-input__inner{
									border-color: #5b9fe8;
									text-align: center;
									color:#2181e8;
								}
							}
						}

					}
				}
			}
	}
</style>
