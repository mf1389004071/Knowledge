<template>
	<div>
		<div class="popup">
			<div class="pop_box">
				<h2>请选择需要修改的内容？<i @click="hide"></i></h2>
				<div class="choose">
					<div @click="tag('entity')">
						<img src="../../assets/maintenance/entity.png" height="119" width="119" alt="">
						<p>修改实体</p>
					</div>
					<div @click="tag('relation')">
						<img src="../../assets/maintenance/relation.png" height="119" width="119" alt="">
						<p>修改关系</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {


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
			tag(tag){
				var list = {};
				list.data= this.Info.data.filter(row => row.category == tag);
				// let list = [];
				// this.$parent.editList.data.map((elem, index) => {
				// 	if(elem.category == tag){
				// 		list.push(elem);
				// 	}
				// });
				// this.$parent.editList.data = list;
				// this.$parent.popshow2 = true;
				// this.hide();

			},
			hide(){
				this.$emit('hide')
			}
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
		width: 666px;
		margin: 364px 0 0 494px;
		.pop_box{
			text-align: left;
			width: 664px;
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
	.choose{
		padding: 59px 140px;
		display: flex;
		justify-content:space-between;
		text-align: center;
		font-size: 18px;
		color:#606060;
		> div{
			cursor: pointer;
		}
		img{
			margin-bottom: 10px;
		}
	}
</style>
