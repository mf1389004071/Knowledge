<template>
	<div class="history">
		<ul>
			<li :class="{'unread':!item.read, 'modify_apply':item.type=='change','system_info':item.type=='remind'}" v-for="(item,index) in message.data">
				<template v-if="item.type == 'change'">
					<h3 @click="toggle(index,'change')">[修改申请]：{{item.applyPeople}}向你申请修改知识链！</h3>
					<em>{{item.time.substring(0,10)}}</em>
					<div class="list">
						<div class="modify_list">
							<span class="apply">申请</span>
							<div class="content">
					            <span :class="{'entity':index%2 == 0,'relation':index%2 == 1}" v-for="(list,index) in item.oldChainList">{{list.name}}</span>
					        </div>
					        <p class="modify"><span>修改为</span></p>
					        <div class="content">
					            <span :class="{'entity_modifyed':index%2 == 0,'relation':index%2 == 1}" v-for="(list,index) in item.newChainList">{{list.name}}</span>
					        </div>
						</div>

				        <div class="article" v-if="item.source">
				        	<h3>
				        		<i class="open"></i>
				        	《最高人民法院关于适用《中华人民共和国婚姻法》若干问题的解释（二）》 第八条
				        	</h3>
				        	<p>
				        		离婚协议中关于财产分割的条款或者当事人因离婚就财产分割达成的协议，对男女双方具有法律约束力。 当事人因履行上述财产分割协议发生纠纷提起诉讼的，人民法院应当受理。
				        	</p>
				        </div>
					</div>
					<p>
						<span class="refuse" @click="reply('refuse',item._id)">拒绝修改</span>
						<span class="agree" @click="reply('agree',item._id)">同意修改</span>
					</p>
				</template>
				<template v-if="item.type == 'remind'">
					<h3 @click="toggle(index,'remind')">[系统消息]：知识链修改申请提醒！</h3>
					<em>{{item.time.substring(0,10)}}</em>
					<div class="list">
				        <p>{{item.applyPeople}}{{item.content}}了您的修改申请。</p>
					</div>
				</template>
			</li>

			<li class="unread system_info">
				<h3>[系统消息]：知识链修改申请提醒！</h3>
				<em>2017-5-12</em>
				<div class="list">
			        <p>张文秀通过了您的修改申请。</p>
				</div>
			</li>

			<li class="read modify_apply">
				<h3>[修改申请]：丁琦向你申请修改知识链！</h3>
				<em>2017-5-12</em>
				<div class="list">
					<div class="content">
			            <span class="entity_modifyed">我是六字实体</span>
			            <span class="relation">我是关系</span>
			            <span class="entity_modifyed">我是六字实体</span>
			            <span class="relation">我是关系</span>
			            <span class="entity_modifyed">我是六字实体</span>
			            <span class="relation">我是关系</span>
			            <span class="entity_modifyed">我是六字实体</span>
			            <span class="relation">我是关系</span>
			            <span class="entity_modifyed">我是六字实体</span>

			            <!-- <i class="open"></i> -->

			        </div>
			        <div class="article">
			        	<h3>
			        		<i class="open"></i>
			        	《最高人民法院关于适用《中华人民共和国婚姻法》若干问题的解释（二）》 第八条
			        	</h3>
			        	<p>
			        		离婚协议中关于财产分割的条款或者当事人因离婚就财产分割达成的协议，对男女双方具有法律约束力。 当事人因履行上述财产分割协议发生纠纷提起诉讼的，人民法院应当受理。
			        	</p>
			        </div>
				</div>
				<p>已确认：同意修改</p>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {

			}
		},
		mounted(){
			this.getLogs();
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		        return JSON.parse(this.user.config.data).username
		    },
		    message:function(){
		    	return this.$store.state.message;
		    }
		},
		methods:{
			toggle(index,type){
				$('.list:eq('+ index +')').toggle();
				$('li > p:eq('+ index +')').toggle();
				console.log(type,'22')
			},
			reply(response,id){
				const params = {
					id:id,
					user_name:this.username,
					response:response
				}
				axios.post(this.$store.state.MessageUrl + '/api/nlp/personal/message/response?axios=1',params)
					.then((res) => {
						console.log(res)
					})
			},
			getLogs(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/workRecord?username='+this.username)
					 .then((res) => {
					 	console.log(res,'7777')
					 })
			}
		}
	}
</script>

<style lang="less" scoped>

	.modify_list{
		position: relative;
		margin: 0 12px;
		.apply{
			position: absolute;
			height: 32px;
			line-height: 32px;
			width: 65px;
			background: #EEBA06;
			font-size: 16px;
			color:#fff;
			text-align: center;
			border-radius: 32px;
			top: 26px;
			left: 0px;
		}
	}
	.modify{
		position: relative;
		height: 32px;
		span{
			position: absolute;
			top: 175%;
			display: inline-block;
			width: 65px;
			font-size: 16px;
			line-height: 32px;
			height: 32px;
			border-radius: 32px;
			background: #EEBA06;
			color: #fff;
			text-align: center;
		}

	}
	.content{
		line-height: 82px;
		font-size: 16px;
		padding:0 26px;
		position: relative;
		.entity{
			display: inline-block;
			line-height: 37px;
			color:#fff;
			background: #1278E7;
			padding: 0 12px;
			border-radius: 5px;
		}
		.entity_modifyed{
			display: inline-block;
			line-height: 37px;
			color:#fff;
			background: #00c2a9;
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
		padding: 25px 13px;
		font-size: 16px;
		margin: 0 12px;
		border-top: 1px dotted #D2D2D2;
		h3{
			color:#016DE0;
			font-size: 16px;
			font-weight: normal;
			margin-bottom: 16px;
			i{
				display: inline-block;
				width: 20px;
				height: 20px;
				cursor:pointer;
				vertical-align: middle;
				&.open{
					background: url('../../assets/home/open_20.png') no-repeat center;
				}
				&.close{
					background: url('../../assets/home/close_20.png') no-repeat center;
				}
			}
		}
		p{
			line-height: 26px;
			color:#052241;
			padding-left: 6px;
		}
	}
	li{
		padding-left: 32px;
		padding-bottom: 16px;
		margin: 25px 0;
		position: relative;
		border-bottom: 1px dotted #D2D2D2;
		h3{
			font-size: 16px;
			line-height: 26px;
			cursor: pointer;
			&:hover{
				text-decoration: underline;
			}
		}
		em{
			font-size: 14px;
		}
		.list{
			border: 1px solid #E2E2E2;
			background: #FAFAFA;
			margin-top: 16px;
			// display: none;
		}
		> p{
			// display: none;
		}
	}
	.unread{
		h3{
			color: #585858;
		}
		em{
			color: #7B8895;
		}
		&::before{
			content: '';
			position: absolute;
			width: 14px;
			height: 16px;
			background: url('../../assets/home/info.png') no-repeat center;
			left: 6px;
			top: 4px;
		}
		&.modify_apply{
			.content{
				padding-left: 86px;
			}
			.modify{
				margin: 0;
				width: auto;
			}
			> p{
				margin: 23px 0;
				text-align: center;
				span{
					font-size: 16px;
					margin: 0 52px;
					width: 123px;
					height: 33px;
					line-height: 33px;
					display: inline-block;
					border-radius: 2px;
					cursor: pointer;
					letter-spacing: 2px;
				}
				.refuse{
					border: 1px solid #CFCFCF;
					background: #E7E7E7;
					color:#484B4D;
				}
				.agree{
					background: #2F86E3;
					border: 1px solid #2F86E3;
					color: #fff;
				}
			}
		}
	}

	.system_info{
		color: #585858;
		font-size: 16px;
		p{
			line-height: 26px;
			padding: 12px 24px;
			font-weight: bold;
		}
	}
	.read{
		color:#B6B6B6;
		h3{
			font-weight: normal;
		}
		&.modify_apply{
			> p{
				font-size: 16px;
				margin: 23px 0;
			}
		}
	}

</style>
