<template>
	<div>
		<el-table :data="addlist" border style="width:1180px;">
		    <el-table-column
		      :label="Info.name">
		      <template scope="scope">
		      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
		      </template>
		    </el-table-column>
		    <el-table-column
		      :label="Info.type">
		      <template scope="scope">
		      	<el-select v-model="scope.row.type" placeholder="请选择">
			        <el-option
			          v-for="item in Info.option"
			          :key="item.value"
			          :label="item.label"
			          :value="item.value">
			        </el-option>
			    </el-select>
		      </template>
		    </el-table-column>
		    <el-table-column
		      :label="Info.attr">
		       <template scope="scope">
		      	<el-input v-model="scope.row.attr" placeholder="请输入内容"></el-input>
		      </template>
		    </el-table-column>
		    <el-table-column label="操作">
		      <template scope="scope">
		        <el-button
		          size="small"
		          @click="">保存</el-button>
		        <el-button
		          size="small"
		          type="danger"
		          @click="clear">删除</el-button>
		      </template>
		    </el-table-column>

		</el-table>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				entity_options : [],
				options : [
					{
						value: '3',
          				label: '3'
					}
				],

			}
		},
		props:{
			addlist:{
				type:Array
			},
			Info:{
				type:Object
			}
		},
		mounted(){
			var _this = this;

		},
		methods:{
			clear(){
				this.$emit('isclear');
    		},
		}
	}
</script>

<style lang="less" scoped>

</style>
