<template>
	<div class="logging">
		<ul class="list" :loading="loading">
	        <li v-for="(item,index) in loggings">
	          	<div class="content">
		            <span v-for="list in item.knowledge_links" :class="{'entity':list.tag == 'entity','relation':list.tag == 'relation'}">{{list.name}}</span>

		            <!-- <i class="open"></i> -->
		            <i v-show="item.source" class="toggle close" @click="toggle(index,item)"></i>
		        </div>
	          	
		        <div v-if="item.source && item.source_open && item.peration_type!='delete'" class="article">
		        	<h3>{{item.source_info.title}}&nbsp;{{item.source_info.second_level}}</h3>
		        	<p>
		        		{{item.source_info.content}}
		        	</p>
		        </div>
	          	<p class="info">
	          		<span>最后编辑时间：{{item.write_date}}</span>
	          	</p>
	        </li> 
	    </ul>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				loggings:[],
				li:[],
				loading:false,
			}
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },

		},
		mounted(){
			this.$nextTick(() => {
				this.getLogs();
			})
			
		},
		methods:{
			toggle(index,item){
				$('.toggle:eq('+index+')').toggleClass('close').toggleClass('open');
				if(item.source_open){
					item.source_open = false;
				}else{
					item.source_open = true;
				}
			},
			getLogs(){
				this.loading = true;
				axios.get(this.$store.state.url1 + '/api/nlp/personal/workRecord?username=' + this.user.data.data.username)
					.then((res) => {
						this.loading = false;
						let loggings = [];
						res.data.data.map((row,index) => {
							console.log(row)
							loggings[index] = {
								// 最后编辑时间
								write_date : row.write_date.substring(0,10),
								// 操作类型
								operation_type : row.maintain.operation_type,
								// 有无文本
								source : row.sources ? true : false,
								// source_info : row.knowledge_sources ? row.knowledge_sources[0] : [],
								source_open:true,
							};

							loggings[index].knowledge_links = [];
							if(loggings[index].operation_type == 'delete'){
								loggings[index].source = false;
							}
							if(loggings[index].source){
								// 知识链
								loggings[index].source_info = row.knowledge_sources[0];
								row._knowledge_linked.map((item,item_index) => {
									if(item_index % 2 == 0){
										item.tag = 'entity';
									}else{
										item.tag = 'relation';
									}
									loggings[index].knowledge_links.push(item)
								})
							}else{
								// 无文本知识链
								loggings[index].source_info = [];

								row.knowledge_linked.map((item,item_index) => {
									if(item_index % 2 == 0){
										item.tag = 'entity';
									}else{
										item.tag = 'relation';
									}
									loggings[index].knowledge_links.push(item)
								})
							}
						})
						this.loggings = loggings;
						console.log(this.loggings)
					})

			}
		}
	}
</script>

<style lang="less" scoped>
	.logging{
		ul{
			li{
				margin-top: 17px;
				border: 1px solid #E2E2E2;
				background: #FAFAFA;
				.content{
					line-height: 82px;
					font-size: 16px;
					padding:0 26px;
					padding-right: 60px;
					position: relative;
					.entity{
						display: inline-block;
						line-height: 37px;
						color:#fff;
						background: #1278E7;
						padding: 0 12px;
						border-radius: 5px;
					}
					.relation{
						border-bottom: 1px solid #37BE29;
			            color: #37BE29;			            
			            padding: 2px 10px;
			            position: relative;
			            top: -10px;
					}
					> i{
						position: absolute;
						width: 30px;
						height: 30px;
						top: 26px;
						right: 24px;
						cursor: pointer;
						&.open{
							background: url('../../assets/home/open.png') no-repeat center;
						}
						&.close{
							background: url('../../assets/home/close.png') no-repeat center;
						}
					}
				}
				.article{
					border-top: 1px dotted #D2D2D2;
					padding: 25px;
					font-size: 16px;
					h3{
						color:#016DE0;
						font-size: 16px;
						font-weight: normal;
						margin-bottom: 16px;
					}
					p{
						line-height: 26px;
						color:#052241;
						padding-left: 6px;
					}
				}
				.info{
					border-top: 1px dotted #D2D2D2;
					font-size: 14px;
					color:#7B8895;
					line-height: 46px;
					padding: 0 27px;
				}
			}
		}
	}
</style>