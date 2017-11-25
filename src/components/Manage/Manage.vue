<template>
	<div id="manage">
		<search @change="getInfo"></search>
		<div class="list">
			<ul>
				<li v-for="item in title">
					<p class="list_header" @click="redirect(item)">
						<i></i>
						{{item.title}}
						<em :class="[item.unchecked_num?'editing':'edited']"></em>
					</p>
					<p class="list_body">
						<span>总共文本:{{item.count}}条</span>
						<span>已编辑:{{item.checked_num}}条</span>
						<span>未编辑:<em class="highlight">{{item.unchecked_num}}</em>条</span>
						<span>负责人:{{item.checked?item.checked:'张文秀'}}</span>
						<span>最后编辑日期:{{item.write_date.substr(0,10)}}</span>
					</p>
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
import axios from '../../js/axios-api.js';
	import Search from './search'
	import manageItem from '../Manage/ManageItem'

	export default{
		data() {
	      return {
	      	title:[]

	      }
	    },
	    mounted(){
	    	var _this = this;
	    	const params = {
	    		case_cause:'',
	    		is_checked:'',
	    		apply_area:'',
	    		type_id:''
	    	}
	    	axios.get(_this.$store.state.url1 + '/api/nlp/knowledge/source/title',params)
	    		.then(function(res){
	    			_this.title = res.data.data;
	    		}).catch(function(res){
	    			console.log('err')
	    		})

	    },
		components:{
	    	'search':Search,
	    	'manage-item':manageItem
	    },
	    methods:{
	    	getInfo(params){
	    		console.log(params);
	    		axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/title',{params:params})
		    		.then((res) => {
		    			this.title = res.data.data;
		    		}).catch(function(err){
		    			console.log('err')
		    		})
	    	},
	    	getTitleList(titleList){
	    		this.title = titleList;
	    	},
	    	redirect(item){
	    		var _this = this;
	    		this.$store.state.manageItem = Object.assign({},item);
	    		// const params = {
	    		// 	title:item.title
	    		// }
	    		// axios.get(_this.$store.state.url1 + '/api/nlp/knowledge/source/list',params)
	    		// 	 .then(function(res){
	    		// 	 	console.log(res)
	    		// 	 }).catch(function(res){
	    		// 	 	console.log('err')
	    		// 	 })
	    		this.$router.push('/manage/manage/item/'+item.title);
	    	}
	    }
	}
</script>

<style lang="less">
#manage{
	.list{
		margin: 0px auto;
		width: 80%;
		li{
			margin-top: 19px;
			border:1px solid #E7E7E7;
			background: #FAFAFA;
			height: 126px;
			.list_header{
				height: 71px;
				line-height: 71px;
				border-bottom: 1px dotted #D0D0D0;
				font-size: 18px;
				color:#016DE0;
				padding-left: 20px;
				position: relative;
				cursor: pointer;
				i{
					display: inline-block;
					width: 22px;
					height: 22px;
					vertical-align: middle;
					margin-right: 18px;
					background: url('../../assets/manage/logo.png') no-repeat;
				}
				em{
					position: absolute;
					display: block;
					width: 65px;
					height: 37px;
					top: 12px;
					right: 0;
					// 编辑中
					&.editing{
						background: url('../../assets/manage/warning.png') no-repeat center;
					}
					// 完成
					&.edited{
						background: url('../../assets/manage/success.png') no-repeat center;
					}
				}
			}
			.list_body{
				height: 54px;
				line-height: 54px;
				padding-left: 20px;
				font-size: 16px;
				color:#7B8895;
				span{
					& + span{
						margin-left: 42px;
					}
					.highlight{
						color: #F00C72;
					}
				}
			}
		}
	}
}


</style>
