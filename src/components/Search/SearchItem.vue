<template>
	<div class="select clearfloat">
		<span>案由选择</span>
		<el-select v-model="value8" allow-create filterable placeholder="请选择">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		 </el-select>
	</div>
</template>

<script>
	export default{

	}
</script>

<style lang="less">
	.select{
		width: 296px;
		height: 34px;
		line-height: 34px;
		border: 1px solid #2281E9;
		background: #fff;
		span{
			display: inline-block;
			float: left;
			font-size: 16px;
			color:#3D3D3D;
			width: 91px;
			height: 100%;
			border-right: 1px solid #2281E9;
		}
		.el-select{
			float: left;
			width: 204px;
			height: 100%;
			.el-input{
				height: 100%;
			}
		}
		.el-input__inner{
			border: none;
			height: 100%;
		}
		.el-select .el-input .el-input__icon{
			color: #2F86E3;
			font-size: 14px;
		}
	}
</style>