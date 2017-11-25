<template>
	<div id="manage_item">
		<div class="header">
			<span @click="$router.back(-1)"><i>返回</i></span>
			<h2>{{data.title?data.title:this.$route.params.title}}</h2>
		</div>
		<div class="info">
			<span>负责人:{{data.checked?data.checked:'张文秀'}}</span>
			<span>编辑开始日期:{{data.write_date?data.write_date.substr(0,10):''}}</span>
			<span>编辑结束日期:{{data.write_date?data.write_date.substr(0,10):''}}</span>
		</div>
		<div class="detail">
			<div class="header clearfloat">
				<span>法律文本列表</span>
				<div class="select clearfloat">
					<span>编辑状态</span>
					<el-select v-model="value" @change="select">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					 </el-select>
				</div>
			</div>
			<div class="body">
				<ul>
					<li v-for="item in info">
						<span class="left">
							<img v-show="!item.is_checked" src="../../assets/manage/no.png" alt="">
							<img v-show="item.is_checked" src="../../assets/manage/ok.png" height="37" width="113" alt="">
							<img @click="showList(item)" class="list" v-show="item.is_checked" src="../../assets/manage/list.png" height="37" width="113" alt="">
						</span>
						<div class="right">
							{{item.content}}
						</div>
					</li>
				</ul>
			</div>
		</div>
		<popup v-show="pop_show" @hide="pop_show = false;"></popup>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
 	import popup from './Popup'

	export default{
		data() {
	      return {
	      	data:{},
	      	value:'',
	      	options:[
	      		{
	      			label:'全部',
	      			value:''
	      		},
	      		{
	      			label:'已编辑',
	      			value:'true'
	      		},
	      		{
	      			label:'未编辑',
	      			value:'false'
	      		}
	      	],
	        info:[],
	        pop_show:false
	      }
	    },
	    components:{
	    	popup
	    },
	    mounted(){
	    	var _this = this;
	    	this.data = Object.assign({},this.$store.state.manageItem);
	    	this.$store.state.manageItem = Object.assign({},this.$store.state.manageItem);


	    	this.getItem();
	    },
	    methods:{
	    	showList(el){
	    		this.pop_show = true;
	    		// console.log('55555',el)
	    	},
	    	select(el){
	    		this.getItem(el);
	    	},
	    	getItem(isCheck){
	    		const params = {
	    			title:this.$route.params.title,
	    			page:1,
	    			is_checked:isCheck?isCheck:'',
	    			// page_size:5
	    		}
	    		console.log(params);
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/list',{params:params})
	    			 .then((res) => {
	    			 	this.info = res.data.data;
	    			 	console.log('1111111',this.info)
	    			 }).catch((res) => {
	    			 	console.log('err')
	    			 })
	    	}
	    }
	}
</script>

<style lang="less">
	#manage_item{
		> .header{
			height: 81px;
			line-height: 81px;
			background: #f6f6f6;
			text-align: center;
			position: relative;
			span{
				position: absolute;
				font-size: 14px;
				color: #3d3d3d;
				top: 0px;
				left: 0px;
				border-right: 1px solid #fff;
				width: 63px;
				height: 100%;
				cursor: pointer;
				i{
					display: block;
					width: 63px;
					height: 24px;
					margin-top: 22px;
					font-style: normal;
					background: url('../../assets/manage/back.png') no-repeat center;
				}
			}
			h2{
				font-size: 20px;
				color: #016de0;
				width: 1180px;
				margin-left: 64px;
				border-left: 1px solid #dadada;
			}
		}
		.info{
			text-align: center;
			height: 40px;
			line-height: 40px;
			font-size: 14px;
			color: #979797;
			width: 1180px;
			span{
				margin: 0 10px;
			}
		}
		.detail{
			width: 1180px;
			background: #f7f7f7;
			margin-left: 64px;
			.header{
				height: 50px;
				line-height: 50px;
				background: #c7ced6;
				> span{
					float: left;
					font-size: 18px;
					color: #052241;
					padding-left: 36px;
					background: url('../../assets/manage/menu.png') no-repeat 11px center;
				}
				.select{
					width: 249px;
					height: 34px;
					line-height: 34px;
					float: right;
					border: 1px solid #2281E9;
					background: #fff;
					margin-top: 6px;
					margin-right: 10px;
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
			.body{
				ul{
					li{
						border-bottom: 2px dotted #d3d4d4;
						padding: 30px 0;
						display: flex;
						span{
							padding: 0 28px 0 40px;
							display: flex;
							flex-direction:column;
							justify-content:space-around;
							img{
								margin: 6px 0;
							}
							.list{
								cursor: pointer;
							}
						}
						div{
							padding: 0 38px;
							border-left: 1px solid #dadde0;
							font-size: 18px;
							color:#052241;
							line-height: 32px;
						}
					}
				}
			}
		}
	}

</style>
