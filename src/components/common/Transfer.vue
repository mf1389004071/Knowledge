<template>
	<div class="box">
		<div id="transfer">
			<div class="transfer">
				<h2>实体内容识别与添加</h2>
				<div class="transfer_main">
					<div class="left">
						<h3>备选实体</h3>
						<el-checkbox-group v-model="datas[0].value" @change="handelIndex">
						    <el-checkbox v-for="item in datas[0].data" :label="item.key" :key="item.key"></el-checkbox>
						</el-checkbox-group>
					</div>
					<el-button @click="addAction">添加</el-button>
					<div class="right">
						<h3>已有实体</h3>
						<el-checkbox-group v-model="newArr">
						    <el-checkbox v-for="item in newArr" :label="item.name" :key="item.name"></el-checkbox>
						</el-checkbox-group>
					</div>
				</div>

				<div class="mask" v-show="pop_show || pop_show2 || pop_show3"></div>
				<div class="popup" v-show="pop_show">
					<el-table :data="addList" border style="width:1180px;">
					    <el-table-column
					      label="实体">
					      <template scope="scope">
					      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
					      </template>
					    </el-table-column>
					    <el-table-column
					      label="实体类型">
					      <template scope="scope">
					      	<el-select v-model="scope.row.type" placeholder="请选择">
						        <el-option
						          v-for="item in entity_options"
						          :key="item.value"
						          :label="item.label"
						          :value="item.value">
						        </el-option>
						    </el-select>
					      </template>
					    </el-table-column>
					    <el-table-column
					      label="实体属性">
					       <template scope="scope">
					      	<el-input v-model="scope.row.attr" placeholder="请输入内容"></el-input>
					      </template>
					    </el-table-column>
					    <el-table-column label="操作">
					      <template scope="scope">
					        <el-button
					          size="small"
					          @click.native.prevent="save(scope.$index,addList)">保存
					        </el-button>
					        <el-button
					          size="small"
					          @click.native.prevent="coll">口语化
					        </el-button>
					        <el-button
					          size="small"
					          type="danger"
					          @click="clear(scope.$index,addList)">删除</el-button>
					      </template>
					    </el-table-column>

					</el-table>
					<p>
						<el-button @click="cancel">取消添加</el-button>
						<el-button @click="add">保存添加内容</el-button>
					</p>
				</div>
			</div>
			<div id="relation" class="transfer">
				<h2>关系内容识别与添加</h2>
				<div class="transfer_main">
					<div class="left">
						<h3>备选关系</h3>
						<el-checkbox-group v-model="datas[1].value" @change="handelIndex2">
						    <el-checkbox v-for="item in datas[1].data" :label="item.key" :key="item.key"></el-checkbox>
						</el-checkbox-group>
					</div>
					<el-button @click="addAction2">添加</el-button>
					<div class="right">
						<h3>已有关系</h3>
						<el-checkbox-group v-model="newArr2">
						    <el-checkbox v-for="item in newArr2" :label="item.name" :key="item.name"></el-checkbox>
						</el-checkbox-group>
					</div>
				</div>

				<div class="popup" v-show="pop_show2">
					<el-table :data="addList2" border style="width:1180px;">
					    <el-table-column
					      label="关系名称">
					      <template scope="scope">
					      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
					      </template>
					    </el-table-column>
					    <el-table-column
					      label="关系类型">
					      <template scope="scope">
					      	<el-select v-model="scope.row.type" placeholder="请选择">
						        <el-option
						          v-for="item in relation_options"
						          :key="item.value"
						          :label="item.label"
						          :value="item.value">
						        </el-option>
						    </el-select>
					      </template>
					    </el-table-column>
					    <el-table-column
					      label="关系属性">
					       <template scope="scope">
					      	<el-input v-model="scope.row.attr" placeholder="请输入内容"></el-input>
					      </template>
					    </el-table-column>
					    <el-table-column label="操作">
					      <template scope="scope">
					        <el-button
					          size="small"
					          @click.native.prevent="save2(scope.$index,addList2)">保存
					        </el-button>
					        <el-button
					          size="small"
					          @click.native.prevent="coll">口语化
					        </el-button>
					        <el-button
					          size="small"
					          type="danger"
					          @click="clear2(scope.$index,addList2)">删除</el-button>
					      </template>
					    </el-table-column>

					</el-table>
					<p>
						<el-button @click="cancel2">取消添加</el-button>
						<el-button @click="add2">保存添加内容</el-button>
					</p>
				</div>
			</div>
		</div>
		<p>
			<el-button plain @click="saveAll(false)">保存修改</el-button>
			<el-button @click="saveAllTo">保存修改并跳转到图谱构建</el-button>
		</p>

		<colloquial ref="coll"></colloquial>
	</div>


</template>

<script>
import axios from '../../js/axios-api.js';
import Colloquial from '../common/Colloquial'
	export default{
		data() {
    		return {
    			newArr:[],
    			newArr2:[],
    			entity_options:[],
    			relation_options:[],
    			addList:[],
    			addList2:[],
    			pop_show:false,
    			pop_show2:false,
    			pop_show3:false,
    			add_list:[],
    		}
    	},
    	props:{
    		datas : {
    			type : Array
    		},
    	},
    	components:{
	    	'colloquial':Colloquial
	    },
    	methods : {
    		coll(){
				this.$refs.coll.show = true;
			},
    		saveAll(skip){
    			console.log('添加：',this.newArr,this.newArr2);
    			// console.log('look',this.$store.state.search.content_id);
    			const params=[];
    			const params2=[];
    			var _this = this;
    			this.newArr2.map(function(elem, index) {
    				params2.push({
    					name:elem.name,
    					type:elem.type,
    					property:elem.attr,
    					source_id:_this.$store.state.search.content_id
    				})
    			})
    			this.newArr.map(function(elem, index) {
    				params.push({
    					name:elem.name,
    					type:elem.type,
    					property:elem.attr,
    					source_id:_this.$store.state.search.content_id
    				})
    			})
    			Promise.all([axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{"relations":JSON.stringify(params2)}),axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params)})])
    				   .then((res) => {
	    					_this.$notify({
						          title: '成功',
						          message: '保存成功',
						          type: 'success',
						          offset:100
						        });

	    					console.log(res);
	    					if(skip){
	    						this.$router.push('/main/structure');
	    					}
    				   })


    		},
    		saveAllTo(){
    			this.saveAll(true);
    			this.$store.state.search.content_show = true;
    		},
    		cancel(){
    			this.addList = [];
				this.datas[0].value = [];
				this.pop_show = false;
    		},
    		cancel2(){
    			this.addList2 = [];
				this.datas[1].value = [];
				this.pop_show2 = false;
    		},
    		addAction(){
    			if(this.$store.state.search.content_id && this.$store.state.search.content){
    				this.pop_show = true;
	    			if(!this.datas[0].value.length){
	    				this.addList.push({
	    					name : '',
							type : '',
							attr : ''
	    				})
	    			}
    			}
    		},
    		addAction2(){
    			if(this.$store.state.search.content_id && this.$store.state.search.content){
    				this.pop_show2 = true;
	    			if(!this.datas[1].value.length){
	    				this.addList2.push({
	    					name : '',
							type : '',
							attr : ''
	    				})
	    			}
    			}

    		},
    		save(index,rows){
    			if(rows[index].name && rows[index].type && rows[index].attr){
    				this.newArr.push(rows[index]);
    				rows.splice(index,1);
    				if(!rows.length){
						this.addList = [];
						this.datas[0].value = [];
						this.pop_show = false;
					}
    			}

			},
			save2(index,rows){
				if(rows[index].name && rows[index].type && rows[index].attr){
					this.newArr2.push(rows[index]);
					rows.splice(index,1);
					if(!rows.length){
						this.addList2 = [];
						this.datas[1].value = [];
						this.pop_show2 = false;
					}
				}
			},
    		handelIndex(value){
				console.log(value);
				var _this = this;
				console.log(this.datas[0].value)
				this.addList=[];
				value.map(function(elem, index) {
					_this.addList.push({
						name : elem,
						type : '',
						attr : ''
					})
					// return this.add_list;
				})
				// console.log('111',this.addList);
			},
			handelIndex2(value){
				console.log(value);
				var _this = this;
				console.log(this.datas[1].value)
				this.addList2=[];
				value.map(function(elem, index) {
					_this.addList2.push({
						name : elem,
						type : '',
						attr : ''
					})
					// console.log('11',elem)
					// return this.add_list;
				})
				// console.log('111',this.addList2)
			},
    		clear(index,rows){
    			rows.splice(index,1);
    			if(!rows.length){
					this.addList = [];
					this.datas.value = [];
					this.pop_show = false;
				}
    		},
    		clear2(index,rows){
    			rows.splice(index,1);
    			if(!rows.length){
					this.addList2 = [];
					this.datas[1].value = [];
					this.pop_show2 = false;
				}
    		},
    		add() {
    			console.log(this.addList)
    			var _this = this;
    			this.addList.map(function(elem, index) {
    				console.log(elem);
    				if(elem.attr && elem.name && elem.type){
    					_this.newArr.push(elem);
    				}
    			})
    			console.log(this.newArr);
    			this.addList = [];
    			this.datas[0].value = [];
    			this.pop_show = false;
    		},
    		add2() {
    			console.log(this.addList2)
    			var _this = this;
    			this.addList2.map(function(elem, index) {
    				if(elem.attr && elem.name && elem.type){
    					_this.newArr2.push(elem);
    				}
    			})
    			console.log(this.newArr2);
    			this.addList2 = [];
    			this.datas[1].value = [];
    			this.pop_show2 = false;
    		},
    	},
    	mounted() {
    		var _this = this;
			axios.get(_this.$store.state.url1 + '/api/nlp/knowledge/entity/type')
				 .then(function(res){
				 	res.data.data.map(function(elem, index) {
				 		_this.entity_options.push({
				 			value : elem._id,
				 			label : elem.name
				 		})
				 		// console.log(elem,index)
				 		return _this.entity_options;
				 	})
				 	// console.log(res.data.data);
				 }).catch(function(res){
				 	console.log(res)
				 })
			console.log('实体：',this.entity_options)
			axios.get(_this.$store.state.url1 + '/api/nlp/knowledge/relation/type')
				 .then(function(res){
				 	res.data.data.map(function(elem, index) {
				 		_this.relation_options.push({
				 			value : elem._id,
				 			label : elem.name
				 		})
				 		// console.log(elem,index)
				 		return _this.relation_options;
				 	})
				 	// console.log(res.data.data);
				 }).catch(function(res){
				 	console.log(res)
				 })
    	}
	}

</script>

<style lang="less">
#transfer{
	display: flex;
	justify-content:space-between;
	width: 90%;
}
	.transfer{
		width: 443px;
		.transfer_main{
			display: flex;
			justify-content:space-between;
			> .el-button{
				margin: 0 24px;
				width: 46px;
				height: 46px;
				background: url('../../assets/add.png') no-repeat;
				border:none;
				font-size: 0;
				align-self: center;
			}
		}
		&#relation{
			h2{
				background: #37BE29;
			}
			h3{
				color:#37BE29;
			}
		}
		h2{
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			background:#2281E9;
			text-align: center;
			font-weight: normal;
			color: #fff;
		}
		.el-transfer-panel{
			width: 230px;
			text-align: left;
			&:last-child{
				.el-checkbox__input{
					display: none;
					&.is-checked + .el-checkbox__label{
						color:#444A51 !important;
					}
				}
				.el-checkbox__label{
					color:#444A51 !important;
				}
			}
			.el-checkbox__inner::after{
				width: 5px;
				height: 8px;
				left: 4px;
				border:1px solid #006ADF;
				border-left: 0;
    			border-top: 0;
			}
			.el-transfer-panel__header{
				height: 57px;
				line-height: 57px;
				background: #F2F2F2;
				color:#006BE0;
				font-size: 18px;
				height: 100%;
			}
			.el-transfer-panel__body{
				height: 324px;
				.el-transfer-panel__list{
					padding: 0;
					height: 324px;
				}
				.el-transfer-panel__item{
					height: 53px;
					line-height: 53px;
					border-bottom: 1px solid #d3cfd0;
					.el-checkbox__input{
						top: 21px;
						.el-checkbox__inner{
							width: 16px;
							height: 16px;
							border-color: #aaa;
						}
						&.is-checked{
							.el-checkbox__inner{
								background: #fff;
								border-color: #2281E9;
							}
							&+.el-checkbox__label{
								color: #006BE1;
							}
						}
					}
					.el-checkbox__label{
						font-size: 16px;
						color: #444A51;
					}
				}
			}

		}
		.el-transfer__buttons{
			padding: 0 28px;
			width: 46px;
			height: 46px;
			background: url('../../assets/add.png') no-repeat center;
			cursor:pointer;
			.el-button{
				display: none;
			}
		}
		> span{
			display: block;

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


	}


	.el-transfer-panel .el-transfer-panel__footer{
		display: none;
	}

	.el-transfer{
		.el-transfer-panel{
			.el-transfer-panel__header{
				text-align: center;
				font-size: 18px;
				color: #006BE0;
				padding-left: 0;
			}
		}

		.el-transfer-panel__body{
			padding-bottom: 0;
		}
	}

	.transfer {
		border: 1px solid #E2E2E2;
		height: 433px;
		.left,.right{
			display: inline-block;
			width: 230px;
			height: 382px;
			border-right: 1px solid #E2E2E2;
			h3{
				height: 57px;
				line-height: 57px;
				color: #006BE0;
				font-size: 18px;
				font-weight: normal;
				background: #F2F2F2;
				padding-left: 70px;
				border-bottom: 1px solid #D2CFCF;
			}
			.el-checkbox-group{
				height: 324px;
				overflow-y: auto;
				.el-checkbox{
					display: block;
					height: 53px;
					line-height: 53px;
					border-bottom: 1px solid #D2CFCF;
					margin-left: 0;
					position: relative;
					.el-checkbox__label{
						position: absolute;
						left: 70px;
						font-size: 16px;
						color: #444A51;
					}
					.el-checkbox__input{
						margin-left: 25px;
						.el-checkbox__inner{
							border-radius: 3px;
							border-color: #AAA;
						}
						&.is-checked{
							.el-checkbox__inner{
								background: #fff;
								border-color: #006ADF;
							}
							& + .el-checkbox__label{
								color: #006BE1;
							}
						}
						.el-checkbox__inner::after{
							width: 5px;
							height: 10px;
							left: 5px;
							border:1px solid #006ADF;
							border-left: 0;
			    			border-top: 0;
						}
					}
				}
			}
		}

		.right{
			display: inline-block;
			width: 230px;
			height: 382px;
			border-left: 1px solid #E2E2E2;
			border-right: none;
			.el-checkbox__inner{
				display: none;
			}
			.el-checkbox__input.is-checked + .el-checkbox__label{
				color: #444A51 !important;
			}
		}
	}
	.popup{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			margin: 290px 0 0 335px;
			width: 1180px;
			height: auto;
			background: #fff;
			border:1px solid #0070e8;
			z-index: 111;
			.el-table{
				&::after, &::before{
					background:none;
				}
				th{
					height: 51px;
					line-height: 51px;
					text-align: center;
					background: #fff;
					border-bottom: none;
					font-weight: normal;
					> .cell{
						background: #2282e9;
						color:#fff;
						line-height: 51px;
						padding: 0;
					}
				}
				.el-table__header{
					margin-top: -1px;
					font-size: 18px;

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
	    					display: flex;
	    					justify-content:space-around;
	    					.el-input,.el-select{
	    						width: 100%;
	    						.el-input__icon{
	    							color:#2181e8;
	    						}
	    						.el-input__inner{
	    							border-color: #5b9fe8;
	    							text-align: center;
	    							color:#2181e8;
	    						}
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
	    							// margin-left: 68px;
	    						}
	    					}
	    				}

	    			}
				}
			}
			> p{
				margin-top: 80px;
				margin-bottom: 38px;
				text-align: center;
				.el-button{
					height: 33px;
					background: #e7e7e7;
					font-size: 16px;
					color: #484B4D;
					padding: 8px 18px;
					border-radius: 2px;
				}
				.el-button+.el-button{
					margin-left: 65px;
					background: #2281E9;
					color:#fff;
				}
			}
		}
</style>
