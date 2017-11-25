import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../js/axios-api.js'

Vue.use(Vuex,axios);
const obj = {
	dev: ['http://192.168.11.88:9140', ],
	production: ['http://180.96.11.69:8500', 'http://180.96.11.73:8121', 'http://180.96.11.73:9010', 'http://180.96.11.73:7012'],
	testing: ['http://192.168.11.88:8120', 'http://192.168.11.88:7013', 'http://192.168.11.88:8121', 'http://192.168.11.88:9010']
}

let url1 = '';
let LoginUrl = '';
let TokenUrl = '';
let MessageUrl = '';
let TagUrl = '';
const env=process.env.NODE_ENV;
switch (env){
  case 'testing':
    //测试
    url1 ='http://192.168.11.88:8120';
    LoginUrl ='http://192.168.11.88:7012';
    TokenUrl ='http://192.168.11.88:9140';
    MessageUrl = 'http://192.168.11.88:8121';
    TagUrl = 'http://192.168.11.88:8122';
    break;
  case 'development':
    //本地
    url1 = 'http://192.168.11.88:9140';
    LoginUrl = 'http://192.168.11.88:7012';
    // TokenUrl = 'http://192.168.11.88:9010';
    TokenUrl = 'http://180.96.11.73:9010';
    MessageUrl = 'http://192.168.11.88:8121';
    TagUrl = 'http://192.168.11.88:8122';
    break;
  case 'production':
    //线上
    url1 = 'http://180.96.11.69:8500';
    LoginUrl = 'http://180.96.11.73:7012';
    TokenUrl = 'http://180.96.11.73:9010';
    MessageUrl = 'http://180.96.11.73:8121';
    TagUrl = 'http://180.96.11.73:8122';
    break;
}

const state = {
  TagUrl: TagUrl,
	url1:url1,
	LoginUrl:LoginUrl,
	TokenUrl:TokenUrl,
	MessageUrl:MessageUrl,
	search:{
		source_type:'',
		apply_area:'',
		content:'',
		content_show:false,
		title:'',  //法条
		second_level:'', //条目
		cause_id:'', //案由id
		type:'',//知识文本类型id
		page_size:1,
		is_checked:'',
		page:1,
		has_more:false,
		total:'',
		content_id:'',
		all:[],

	},
	//用户个人信息
	user:{},
	checked:false,
	entity_list:[],
	relation_list:[],
	case_cause:[],
	type:[],
	law_item:[],
	item:[],
	range:[],
	manageItem:{},
  // 标签
  tagData: {},
  // 图的id
  graph_item: {},
	noText:{
		transferList:{
			// List:[],
			// ListId:''
		}
	},
	//属于哪个组
	group_id:'',
	message:{
		length:0,
		data:[]
	},
	role_type:''
}

const mutations = {
	message(state,user){
		const params = {
			to_user:user
		}
		// setInterval(()=>{
		// 	axios.get(state.MessageUrl + '/api/nlp/personal/message/list',{params})
		// 		.then((res) => {
		// 			const length = res.data.data.filter(row => row.read == false).length;
		// 			let data=[];
		// 			res.data.data.map((row,index) => {
		// 				data.push({
		// 					//是否已读
		// 					read:row.read,
		// 					//申请人
		// 					applyPeople:row.from_user_name,
		// 					//消息类型
		// 					type:row.type,
		// 					//消息事件
		// 					time:row.write_date,
		// 					//消息id
		// 					_id:row._id
		// 				})
		// 				if(row.type == 'change'){
		// 					// data[index] = Object.assign(data[index],{
		// 					// 	// 原链
		// 					// 	oldChainList:row.chain.knowledge_linked,
		// 					// 	// 新链
		// 					// 	newChainList:row.knowledge_linked,
		// 					// })
		// 				}else if(row.type == 'remind'){
		// 					data[index] = Object.assign(data[index],{
		// 						content:row.content
		// 					})
		// 				}

		// 			})
		// 			state.message = {
		// 				length:length,
		// 				data:data
		// 			}
		// 		})
		// 	}, 3000);

	},
	search(state){
		var _this = this;
		const params = {
			// 案由
			case_cause:state.search.case_cause?state.search.case_cause:'',
			// 文本类型
			type:state.search.type?state.search.type:'',
			// 法条
			title:state.search.title?state.search.title:'',
			// 条目
			num:state.search.num?state.search.num:'',

			// 范围
			apply_area:state.search.apply_area?state.search.apply_area:'',
			// 是否识别过
			is_checked:state.search.is_checked?state.search.is_checked:false,
			page_size:state.search.page_size,
			page:state.search.page,

		};
		axios.get(state.url1 + '/api/nlp/knowledge/source/list',{params:params})
    		 .then(function(res){
    		 	state.search.content = res.data.data[0].content;
    		 	state.search.total = res.data.pager.total;
    		 	state.search.has_more = res.data.pager.has_more;
    		 	state.search.content_id = res.data.data[0]._id;
    		 }).catch(function(res){
    		 	state.search.content = '没有数据';
    		 })

	},
	check(state){
		var _this = this;
		const params = {
			id : state.search.content_id
		}
		console.log(params);
		axios.post(state.urls[state.url_index] + '/api/nlp/knowledge/source/check?axios=1',params)
    		 .then(function(res){
    		 	state.entity_list = res.data.data.entity_list;
    		 	state.relation_list = res.data.data.relation_list.filter(function(item){return item != ''});
    		 	console.log("list: " + state.entity_list);
    		 	for (var i = 0; i <= state.entity_list.length - 1; i++) {
	    			state.entity_list[i] = {
	    				key:state.entity_list[i],
	    				type:'',
	    				attr:''
	    			}
	    		}
	    		console.log(555, state.entity_list);
	    		for (var i = 0; i <= state.relation_list.length - 1; i++) {
	    			state.relation_list[i] = {
	    				key:state.relation_list[i],
	    				type:'',
	    				attr:''
	    			}
	    		}
    		 }).catch(function(res){
    		 	console.log('lll',res);
    		 })
	},
  setChecked(state,isChecked){
    state.checked=isChecked;
  }
}
export default new Vuex.Store({
	state,
	mutations
})
