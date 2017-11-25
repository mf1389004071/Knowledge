<template>
	<div class="re_transfer">
		<div :class="{transfer:true,relation:datas.tag=='relation'}">
			<h2>{{datas.title}}内容识别与添加</h2>
			<div class="transfer_main">
				<div class="left">
					<h3>备选{{datas.title}}</h3>
					<el-checkbox-group v-model="value" @change="handelIndex">
					    <el-checkbox v-for="item in datas.data" :label="item.key" :key="item.key"></el-checkbox>
					</el-checkbox-group>
				</div>
				<el-button @click="addAction">添加</el-button>
				<div class="right">
					<h3>已有{{datas.title}}</h3>
					<ul>
						<li v-for="item in newArr">{{item.name}}</li>
					</ul>
				</div>
			</div>
		</div>

		<div>
			<div class="mask" v-show="pop_show"></div>
			<popup v-show="pop_show" @hide="pop_show=false" :Info="Info"></popup>
		</div>
	</div>

</template>

<script>
	import axios from '../../js/axios-api.js';
	import Popup from './Popup'

	export default{
		data() {
    		return {
    			value:[],
    			Info:{
    				tag:'',
    				title:'',
    				addList:[],
    				options:[],
    			},
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
    			type : Object
    		},
    	},
    	components:{
	    	'popup':Popup
	    },
    	methods : {
    		saveAll(skip){
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
    			this.value = [];

    			this.addList = [];

				this.pop_show = false;
    		},

    		addAction(){
    			if(this.$store.state.search.content_id && this.$store.state.search.content){
 					this.Info.tag = this.datas.tag;
 					this.Info.title = this.datas.title;
 					this.Info.options = this.datas.options;
	    			if(!this.value.length){
	    				this.Info.addList = [{
	    					name : '',
							type : '',
							attr : '',
							synonyms : [],
							colloquial : [],
	    				}]
	    			}
	    			this.pop_show = true;
    			}
    		},
    		handelIndex(value){
				this.Info.addList=[];
				value.map(row => {
					this.Info.addList.push({
						name : row,
						type : '',
						attr : '',
						synonyms : [],
						colloquial : [],
					})
				})
			},
    	},
    	mounted() {
    	}
	}

</script>

<style lang="less">
.re_transfer{
	.transfer{
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

	.transfer {
		border: 1px solid #E2E2E2;
		height: 433px;
		width: 563px;
		h2{
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			background:#2281E9;
			text-align: center;
			font-weight: normal;
			color: #fff;
		}
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
			ul{
				height: 324px;
				overflow-y: auto;
				li{
					height: 53px;
					line-height: 53px;
					border-bottom: 1px solid #D2CFCF;
					padding-left: 70px;
					font-size: 16px;
					color: #444A51;
				}
			}
			.el-checkbox__inner{
				display: none;
			}
			.el-checkbox__input.is-checked + .el-checkbox__label{
				color: #444A51 !important;
			}
		}

		&.relation{
			h2{
				background: #37BE29;
			}
			.left,.right{
				h3{
					color:#37BE29;
				}
				.el-checkbox-group{
					.el-checkbox__input.is-checked{
						.el-checkbox__inner{
							background: #fff;
							border-color: #37be29;
							&::after{
								border:1px solid #37be29;
								border-left: 0;
				    			border-top: 0;
							}
						}
						& + .el-checkbox__label{
							color: #37be29;
						}
					}
					.el-checkbox__input .el-checkbox__inner::after{
							border:1px solid #37be29;
							border-left: 0;
			    			border-top: 0;
						}
				}
			}
		}
	}
}

</style>
