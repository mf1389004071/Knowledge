<template>
	<div id="add_pop">
		<div class="pop_box">
			<h2>{{Info.name}}内容添加列表<i @click="hide"></i></h2>
			<el-table :data="addlist" border style="width:1180px;">
			    <el-table-column
			      :label="Info.name+'名称'">
			      <template scope="scope">
			      	<el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
			      </template>
			    </el-table-column>
			    <el-table-column
			      :label="Info.name+'属性'">
			      <template scope="scope">
			      	<el-select v-model="scope.row.attr" placeholder="请选择">
				        <el-option
				          v-for="item in options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				        </el-option>
				    </el-select>
			      </template>
			    </el-table-column>
			    <el-table-column label="操作">
			      <template scope="scope">
			        <el-button
			          size="small"
			          @click="save(scope.$index, scope.row)">保存
			        </el-button>
			        <el-button
			          size="small"
			          @click.native.prevent="coll(scope.row,scope.$index,true)">口语化
			        </el-button>
			        <el-button
			          size="small"
			          type="danger"
			          @click="clear(scope.$index,addlist)">删除</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			<div class="add">
				<i @click="addList"></i>点击按钮添加更多{{Info.name}}列表
			</div>
			<p class="button">
				<el-button @click="saveAll">保存全部内容</el-button>
			</p>
		</div>
		<colloquial ref="coll"></colloquial>

	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
import Colloquial from '../common/Colloquial'
	export default{
		data(){
			return {
				pop_show:false,
				addlist:[
					{
    					name : '',
						attr : '',
						synonyms : [],
						colloquial : [],
    				}
				],
				options:[],


			}
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
		components:{
	    	'colloquial':Colloquial
	    },
		mounted(){
			this.getProperty();

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
			getProperty(){
				axios.get(this.$store.state.url1 + '/api/nlp/label/property')
					 .then((res) => {
					 	this.options = res.data.data.map(row => {
					 		return {
					 			label:row.name,
                  				value:row._id
					 		}
					 	})
					 }).catch((err) => {
					 	console.log('err')
					 })
			},
			// 添加列表
			addList(){
				this.addlist.push({
					name : '',
					attr : '',
					synonyms : [],
					colloquial : [],
				})
			},
			// 保存全部
			saveAll(){
				const params = [];
				this.addlist.map((elem, index) => {
					params.push({
    					name:elem.name,
    					property:elem.attr,
    					case_cause:this.Info.case_cause,
    					colloquial:elem.colloquial,
    					synonyms:elem.synonyms,
    				})
				})

				axios.post(this.$store.state.url1 + '/api/nlp/label/entity/list?axios=1',{'entities':JSON.stringify(params)})
    				.then((res) => {
    					if(res.data.data.length){
    						this.$message.success('保存实体成功');
					        this.addlist = [{
								name : '',
								attr : '',
								synonyms : [],
								colloquial : [],
							}];
							this.$parent.getEntityName();
					        this.hide();
    					}
    				}).catch((err) => {
    					console.log('err')
    				})

			},
			// 保存单项
			save(index,row){
				if(row.attr && row.name){
					const params = [{
						name:row.name,
    					property:row.attr,
    					case_cause:this.Info.case_cause,
    					colloquial:row.colloquial,
    					synonyms:row.synonyms,
					}];
					axios.post(this.$store.state.url1 + '/api/nlp/label/entity/list?axios=1',{'entities':JSON.stringify(params)})
	    				.then((res) => {
	    					if(res.data.data.length){
	    						this.$message.success('保存实体成功');
						        this.addlist.splice(index,1);
	    					}
	    				}).catch((err) =>{
	    					console.log('err')
	    				})

				}
			},
			// 取消添加该项
			clear(index,rows){
    			rows.splice(index,1);
    		},
    		// 取消操作
    		hide(){
    			this.$emit('hide');
    			this.$parent.getEntityName();
    			this.addlist = [{
    				name : '',
					attr : '',
					synonyms : [],
					colloquial : [],
    			}]
    		},
		}
	}
</script>

<style lang="less" scoped>
	#add_pop{
		.cell{
			.el-input,.el-select{
				width: 100%;
			}
			button{
				font-size: 0;
				width: 21px;
				height: 21px;
				background: url('../../assets/save.png') no-repeat center;
				border: none;
				&:nth-child(2){
					width: 24px;
					height: 21px;
					background: url('../../assets/colloquial.png') no-repeat center;
				}
				&:last-child{
					width: 24px;
					height: 24px;
					background-image: url('../../assets/close.png');
				}
			}
		}
	}
	
</style>
