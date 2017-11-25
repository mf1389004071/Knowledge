<template>
	<div>
		<div class="popup">
			<div class="pop_box">
				<el-table :data="Info.data" border style="width:1180px;">
				    <el-table-column
				      label="名称">
				      <template scope="scope">
				      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="类型">
				      <template scope="scope">
				      	<el-select v-model="scope.row.type_name" placeholder="请选择">
					        <el-option
					          v-for="item in options"
					          :key="item.value"
					          :label="item.label"
					          :value="item.value">
					        </el-option>
					    </el-select>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="属性">
				       <template scope="scope">
				      	<el-input v-model="scope.row.properties" placeholder="请输入内容"></el-input>
				      </template>
				    </el-table-column>
				</el-table>
				<p class="button">
					<el-button>取消修改</el-button>
					<el-button @click="saveAll">保存修改内容</el-button>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				addlist:[
					{
    					name : '',
						type : '',
						attr : ''
    				}
				],
				options:[],
			}
		},
		components:{
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
		},
		mounted(){
			var _this = this;
		},
		methods:{
			addList(){
				this.addlist.push({
					name : '',
					type : '',
					attr : ''
				})
			},
			saveAll(){
				console.log(this.Info,'5555')
				// const params = [];
				// var _this = this;
				// this.addlist.map(function(elem, index) {
				// 	params.push({
    // 					name:elem.name,
    // 					type:elem.type,
    // 					property:elem.attr,
    // 					source_id:_this.$store.state.search.content_id
    // 				})
				// })
				// if(this.Info.tag == 'entity'){
				// 	axios.post(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params)})
			 //    				.then(function(res){
			 //    					if(res.data.data.length){
			 //    						_this.$notify({
				// 				          title: '成功',
				// 				          message: '保存'+_this.Info.name+'成功',
				// 				          type: 'success',
				// 				          offset:100
				// 				        });
				// 				        $('.check').click();
				// 				        _this.addlist = [{
				// 							name : '',
				// 							type : '',
				// 							attr : ''
				// 						}]

			 //    					}
			 //    				}).catch(function(res){

			 //    				})
				// }else{
				// 	axios.post(_this.$store.state.urls[_this.$store.state.url_index] + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params)})
		  //   				.then(function(res){
		  //   					if(res.data.data.length){
		  //   						_this.$notify({
				// 			          title: '成功',
				// 			          message: '保存'+_this.Info.name+'成功',
				// 			          type: 'success',
				// 			          offset:100
				// 			        });
				// 			        $('.check').click();
				// 			        _this.addlist = [{
				// 						name : '',
				// 						type : '',
				// 						attr : ''
				// 					}]
		  //   					}
		  //   				}).catch(function(res){

		  //   				})
				// }


				// this.hide();

			},
			save(index,row){
				var _this = this;
				if(row.attr && row.name && row.type){
					const params = [{
						name:row.name,
    					type:row.type,
    					property:row.attr,
    					source_id:_this.$store.state.search.content_id
					}];
					if(this.Info.tag == 'entity'){
						axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/entity/list?axios=1',{'entities':JSON.stringify(params)})
		    				.then(function(res){
		    					if(res.data.data.length){
		    						_this.$notify({
							          title: '成功',
							          message: '保存'+_this.Info.name+'成功',
							          type: 'success',
							          offset:100
							        });
							        _this.addlist.splice(index,1);
		    					}
		    				}).catch(function(res){

		    				})
					}else{
						axios.post(_this.$store.state.url1 + '/api/nlp/knowledge/relation/list?axios=1',{'relations':JSON.stringify(params)})
		    				.then(function(res){
		    					if(res.data.data.length){
		    						_this.$notify({
							          title: '成功',
							          message: '保存'+_this.Info.name+'成功',
							          type: 'success',
							          offset:100
							        });
							        _this.addlist.splice(index,1);
		    					}
		    				}).catch(function(res){

		    				})
					}

				}
			},
			clear(index,rows){
    			rows.splice(index,1);

    		},
    		hide(){
    			this.$emit('hide');
    			this.addlist = [{
    				name : '',
					type : '',
					attr : ''
    			}]
    		},
		}
	}
</script>

<style lang="less" scoped>
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
	.popup{
		position: fixed;
		text-align: center;
		z-index: 101;
		.pop_box{
			text-align: left;
			width: 1178px;
			background: #fff;
			border: 1px solid #2e82e3;
			vertical-align: middle;
			display: inline-block;
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
					min-height: 110px;
					height: auto;
					width: 100%;
					resize:none;
					border-color: #4078B4;
					color: #000;
					font-size: 16px;
					line-height: 26px;
					padding: 10px 22px;
					box-sizing: border-box;
				}

			}
			.timeline{
				position: relative;
				margin-top: -10px;
				padding-top: 10px;
				margin-bottom: 10px;
				&::before{
					content:'';
					position: absolute;
					top: 0;
					bottom: 0;
					width: 2px;
					background: #bcbcbc;
					left: 50%;
				}
				li{
					height: 150px;
					position: relative;
					font-size: 16px;
					color: #656b71;
					line-height: 28px;
					span{
						position: absolute;
						right: 50%;
						padding-right: 16px;
						&::after{
							content:'';
							position: absolute;
							// display: block;
							width: 12px;
							height: 12px;
							background: #bcbcbc;
							border-radius: 50%;
							right: -7px;
							top: 7px;
						}
					}

					div{
						position: absolute;
						left: 50%;
						padding-left: 16px;
					}
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
