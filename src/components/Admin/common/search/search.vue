<template>
	<div class="clearfloat main-header">
		<el-row style="width:320px;float:right;" class="main-top">
			<el-col :span="14">
				<el-input
				  :placeholder="info.placeholder"
				  icon="search"
				  class="common-search"
				  v-model="keyword"
				  @keyup.enter.native="handleIconClick"
				  :on-icon-click="handleIconClick">
				</el-input>
			</el-col>
			<el-col :span="8" style="margin-left:20px;">
				<span class="add" @click="add">{{info.addholder}}</span>
			</el-col>
		</el-row>
	</div>
	
</template>

<script>
	export default{
		data(){
			return {
				keyword:'',
			}
		},
		props:["info"],
		mounted(){

		},
		methods:{
			handleIconClick(){
				this.$emit("search",this.keyword)
			},
			add(){
				this.$emit("add");
			}
		}
	}
</script>

<style lang="less">
	.main-top{
		input{
			border: 0 none;
			background: #e1e3e8;
			border-radius: 36px;
		}
		.add{
			height: 36px;
			display: inline-block;
			line-height: 36px;
			background: #9aa2b2;
			width: 100%;
			border-radius: 36px;
			text-align: center;
			font-size: 16px;
			color:#ffffff;
			cursor: pointer;
			&::before{
				content:'';
				display: inline-block;
				width: 15px;
				height: 15px;
				background: url('../../../../assets/admin/common/add.png') no-repeat center;
				vertical-align: middle;
				margin-right: 10px;

			}
		}
	}

</style>