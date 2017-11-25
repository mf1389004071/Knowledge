<template>
	<div id="relation" class="transfer">
		<h2>关系内容识别与添加</h2>
		<div class="left">
			<h3>备选关系</h3>
			<el-checkbox-group v-model="datas.value" @change="handelIndex">
			    <el-checkbox v-for="item in datas.data" :label="item.key" :key="item.key"></el-checkbox>
			</el-checkbox-group>
		</div>
		<el-button @click="addAction">添加</el-button>
		<div class="right">
			<h3>已有关系</h3>
			<el-checkbox-group v-model="newArr">
			    <el-checkbox v-for="item in newArr" :label="item.name" :key="item.name"></el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="mask" v-show="pop_show"></div>
		<div class="popup" v-show="pop_show">
			<el-table :data="addList" border style="width:1180px;">
			    <el-table-column
			      label="关系名称">
			      <template scope="scope">
			      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="关系类型">
			      <template scope="scope">
			      	<el-select v-model="scope.row.type" placeholder="请选择">
				        <el-option
				          v-for="item in relation_options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				    </el-select>
			      </template>
			    </el-table-column>
			    <el-table-column
			      label="关系属性">
			       <template scope="scope">
			      	<el-input v-model="scope.row.attr" placeholder="请输入内容"></el-input>
			      </template>
			    </el-table-column>
			    <el-table-column label="操作">
			      <template scope="scope">
			        <el-button
			          size="small"
			          @click.native.prevent="save(scope.$index,addList)">保存</el-button>
			        <el-button
			          size="small"
			          type="danger"
			          @click="clear(scope.$index,addList)">删除</el-button>
			      </template>
			    </el-table-column>

			</el-table>
			<p>
				<el-button @click="cancel">取消添加</el-button>
				<el-button @click="add">保存添加内容</el-button>
			</p>
		</div>
	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	export default{
		data() {
    		return {
    			newArr:[],
    			relation_options:[],
    			addList:[],
    			pop_show:false,
    		}
    	},
    	props:{
    		datas : {
    			type : Object
    		},
    	},
    	components:{
    	},
    	methods : {
    		cancel(){
    			this.addList = [];
				this.datas.value = [];
				this.pop_show = false;
    		},
    		addAction(){
    			console.log(this.datas.value)
    			if(this.datas.value.length){
    				this.pop_show = true;
    			}

    		},
    		save(index,rows){
				this.newArr.push(rows[index]);
				var i = index;
				var _this = this;
				rows.splice(index,1);

				console.log(this.newArr);
				console.log(index,rows);
				if(!rows.length){
					this.addList = [];
					this.datas.value = [];
					this.pop_show = false;
				}
				// const params = {
    // 				name : this.newArr[0].name,
    // 				type : this.newArr[0].type,
    // 				properties : '[]',
    // 				sources:'["'+this.$store.state.search.content_id+'"]'
    // 			}
				// axios.post('http://192.168.0.88:9140/api/nlp/knowledge/entity?axios=1',params)
    // 				.then(function(res){
    // 					console.log(res)
    // 				}).catch(function(res){

    // 				})

			},
    		handelIndex(value){
				console.log(value);
				var _this = this;
				console.log(this.datas.value)
				this.addList=[];
				value.map(function(elem, index) {
					_this.addList.push({
						name : elem,
						type : '',
						attr : ''
					})
				})
			},
    		clear(index,rows){
    			rows.splice(index,1);
    			if(!rows.length){
					this.addList = [];
					this.datas.value = [];
					this.pop_show = false;
				}
    		},
    		add() {
    			console.log(this.addList)
    			var _this = this;
    			this.addList.map(function(elem, index) {
    				_this.newArr.push(elem);
    			})
    			console.log(this.newArr);
    			this.addList = [];
    			this.datas.value = [];
    			this.pop_show = false;
    		},
    	},
    	mounted() {
    		console.log('datas :',this.datas);
    		var _this = this;
			axios.get('http://192.168.0.88:9140/api/nlp/knowledge/relation/type')
				 .then(function(res){
				 	res.data.data.map(function(elem, index) {
				 		_this.relation_options.push({
				 			value : elem._id,
				 			label : elem.name
				 		})
				 		// console.log(elem,index)
				 		return _this.relation_options;
				 	})
				 	// console.log(res.data.data);
				 }).catch(function(res){
				 	console.log(res)
				 })
    	}
	}

</script>

<style lang="less" scoped>
#relation{
	h2{
		background: #37BE29;
	}
	h3{
		color: #37BE29;
	}

}
</style>
