<template>
	<div id="add_pop" class="re_pop">
		<div class="pop_box">
			<div class="title">
		        <span>{{Info.title}}名称</span>
		        <span>{{Info.title}}类型</span>
		        <span>{{Info.title}}属性</span>
		        <span>操作</span>
	      	</div>
	      	<ul class="addlist">
		        <li v-for="(item,index) in Info.addList">
		          <span>
		            <el-input v-model="item.name" placeholder="请输入内容"></el-input>
		          </span>
		          <span>
		            <el-select v-model="item.type" filterable placeholder="请选择">
		                  <el-option
		                    v-for="item in Info.options"
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
		            <!-- <i @click="save(index, item)">保存</i> -->
		            <i @click="coll(item,index,true)">口语化</i>
		            <i @click="clear(index,Info.addList)">删除</i>
		          </span>
		        </li>
	      	</ul>
	      	<p class="addBtn">
	          	<i @click="addList"></i>
	          	点击按钮增加更多{{Info.title}}列表
	        </p>
			<p class="button">
				<el-button @click="cancel">取消添加</el-button>
				<el-button @click="saveAll">保存全部内容</el-button>
			</p>
		</div>

		<colloquial ref="coll"></colloquial>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Colloquial from './Colloquial'
	export default{
		data(){
			return {
				pop_show:false,

			}
		},
		components:{
	    	'colloquial':Colloquial
	    },
		props:{
			Info:{
				type:Object
			}
		},
		computed:{
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
				this.Info.addList.push({
					name : '',
					type : '',
					attr : '',
					synonyms : [],
					colloquial : [],
				})
			},
			cancel(){
				this.hide();
			},

    		add() {
    			var _this = this;
    			this.addList.map(function(elem, index) {
    				if(elem.attr && elem.name && elem.type){
    					_this.newArr.push(elem);
    				}
    			});
    			this.addList = [];
    			this.datas[0].value = [];
    			this.pop_show = false;
    		},
			saveAll(){
				const params = [];
				this.Info.addList.map((elem, index) => {
					this.$parent.newArr.push(elem);
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
		    					}
		    				}).catch((res) => {

		    				})
				}else{
					axios.post(this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params),'user_name':this.username})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功');
							        $('.check').click();
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
    					user_name:this.username,
					}];
					if(this.Info.tag == 'entity'){
						axios.post(this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params)})
		    				.then((res) => {
		    					if(res.data.data.length){
		    						this.$message.success('保存关系成功');
							        this.addlist.splice(index,1);
		    					}
		    				}).catch((res) => {

		    				})
					}else{
						axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params)})
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
    		hide(){
    			this.$parent.value = [];
    			this.$emit('hide')
    			$('.check').click();
    		},
		}
	}
</script>

<style lang="less">
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

	.re_pop{
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
			max-height: 430px;
			overflow-y: auto;
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
						// background: url('../../assets/save.png') no-repeat center;
						&:nth-child(1){
							background: url('../../assets/colloquial.png') no-repeat center;
						}
						&:last-child{
							background: url('../../assets/close.png') no-repeat center;
						}
					}
				}
			}
		}
		.addBtn{
			background: #f5f5f5;
			text-align: center;
			color:#a6aaae;
			font-size: 14px;
			height: 60px;
			line-height: 60px;
			display: inherit;
			width: 100%;
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

</style>
