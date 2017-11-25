<template>
	<div class="adminCommon group">
		<search @add="add" :info="searchInfo"></search>
		<dl class="main-list">
			<dt>
				<span>用户名称</span>
				<span>所在小组</span>
				<span>用户角色</span>
				<span>应用个数</span>
			</dt>
			<dl v-for="item in memberList" @click="showDetail(item.username)">
				<span>{{item.name}}</span>
				<span>{{item.group}}</span>
				<span>{{item.role=='admin'?'组长':item.role=='normal'?'组员':'/'}}</span>
				<span>{{item.appsNum}}</span>
			</dl>
		</dl>
		<el-dialog @close="closeAddDialog" size="small" :visible.sync="dialogAddVisible" :show-close="false">
			<div slot="title" class="dialog-header">
				<span>用户姓名</span>
				<span>所在小组</span>
				<span>用户角色</span>
			</div>
			<ul >
				<li v-for="item in addList">
					<span>
						<el-select v-model="item.user" filterable remote placeholder="请选择组长" :remote-method="remoteMembers" :loading="loading.memberOptions" @change="changeMember">
					        <el-option v-for="item in memberOptions" :label="item.label" :value="item.value"></el-option>
					    </el-select>
					</span>
					<span>
						<el-select v-model="item.group" filterable allow-create placeholder="请选择">
					        <el-option
					          v-for="item in groupOptions"
					          :key="item.value"
					          :label="item.label"
					          :value="item.value">
					        </el-option>
					    </el-select>
					</span>
					<span>
						<el-select v-model="item.role" filterable allow-create placeholder="请选择">
					        <el-option
					          v-for="item in roleOptions"
					          :key="item.value"
					          :label="item.label"
					          :value="item.value">
					        </el-option>
					    </el-select>
					</span>
				</li>
				<!-- <li>
					<span>
						<el-input placeholder="请输入内容"></el-input>
					</span>
					<span>
						<el-select filterable allow-create placeholder="请选择">
					        <el-option
					          v-for="item in groupOptions"
					          :key="item.value"
					          :label="item.label"
					          :value="item.value">
					        </el-option>
					    </el-select>
					</span>
					<span>
						<el-select filterable allow-create placeholder="请选择">
					        <el-option
					          v-for="item in roleOptions"
					          :key="item.value"
					          :label="item.label"
					          :value="item.value">
					        </el-option>
					    </el-select>
					</span>
				</li> -->
				<li class="add">
					<span @click="addAddList">继续增加</span>
				</li>
			</ul>
			<div slot="footer" class="dialog-footer">
				<el-button class="grey" @click="dialogAddVisible = false;">取 消</el-button>
				<el-button type="primary" @click="saveAdd">保 存</el-button>
			</div>
		</el-dialog>

		<el-dialog title="用户详细列表" size="tiny" :visible.sync="dialogEditVisible">
			<el-form :model="memberDetail" label-width="80px">
				<p><label>用户姓名</label><span>{{memberDetail.name}}</span></p>
				<el-form-item label="所在小组">
					<!-- <el-input v-if="editing" v-model="groupDetail.name"></el-input> -->
				    <span v-if="!editing" class="editable">{{memberDetail.group?memberDetail.group.name:''}}</span>
				    <el-select v-if="editing" v-model="memberDetail.group.id" filterable placeholder="请选择应用归属小组" @change="changeGroup">
				      <el-option v-for="item in groupOptions" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="用户角色">
					<!-- <el-input v-if="editing" v-model="groupDetail.name"></el-input> -->
				    <span v-if="!editing" class="editable">{{memberDetail.role?memberDetail.role.name:''}}</span>
				    <el-select v-if="editing" v-model="memberDetail.role.id" filterable placeholder="请选择用户角色" @change="">
				      <el-option v-for="item in roleOptions" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<!-- <el-form-item label="所在小组">
				    <span v-if="!editing" class="editable">{{groupDetail.leadersList}}</span>
				    <div v-if="editing">
				    	<el-tag
						  :key="tag"
						  v-for="tag in groupDetail.leaders"
						  :closable="true"
						  :close-transition="false"
						  @close="handleClose(tag,'edit')"
						>
						{{tag.name}}
						</el-tag>
						<el-select class="select-leader" v-model="form.members" filterable remote placeholder="请选择组长" :remote-method="remoteMembers" :loading="loading.memberOptions" @change="selectEdit">
					        <el-option v-for="item in memberOptions" :label="item.label" :value="item.value"></el-option>
					    </el-select>
				    </div>
				    
				</el-form-item> -->
				<p><label>应用</label><span>{{memberDetail.apps}}</span></p>
				<p><label>小组组长</label><span>{{memberDetail.leadersList}}</span></p>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<template v-if="!editing">
					<el-button @click="" class="grey">删除用户</el-button>
					<el-button type="primary" @click="editing = true;">修 改</el-button>
				</template>
				<el-button v-if="editing" type="primary" @click="saveEdit">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import axios from '../../../js/axios-api.js'
	import search from '../common/search/search'
	var debounce = require('debounce');
	export default{
		data(){
			return {
				keyword:'',
				memberList:[],
				dialogAddVisible:false,
				dialogEditVisible:false,
				editing:false,
				addList:[
					{
						user:'',
						group:'',
						role:''
					}
				],
				groupOptions:[],
				roleOptions:[
					{
						label:"组长",
						value:"admin"
					},
					{
						label:"组员",
						value:"normal"
					},
				],
				memberDetail:{},
				searchInfo:{
					placeholder:"选择用户",
					addholder:"新增用户"
				},
				loading:{
					memberOptions:false,
				},
				memberOptions:[],
			}
		},
		components:{search},
		mounted(){
			this.getMemberList();
			this.getGroupOptions();
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      	return JSON.parse(this.user.config.data).username
		    }
		},
		methods:{
			addAddList(){
				this.addList.push({
					user:'',
					group:'',
					role:''
				})
			},
			closeAddDialog(){
				this.addList = [{
					user:'',
					group:'',
					role:''
				}];
			},
			saveAdd(){
				let addList = [];
				this.addList.map(row => {
					if(row.group && row.role && row.user){
						addList.push({
							user_id:row.user,
							group_id:row.group,
							role_type:row.role
						});
					}
				})
				const params = {
					user_name:this.username,
					user_group_role:JSON.stringify(addList)
				};
				axios.post(this.$store.state.url1 + '/api/nlp/personal/create/user/group/role/list?axios=1',params)
					.then(res => {
						this.getMemberList();
						this.$message.success("添加成功！");
						this.dialogAddVisible = false;
					})
			},
			changeMember(val){
				if(val){
					this.memberOptions = [];
				}
			},
			remoteMembers:debounce(function(query){
				console.log(query)
				if(query !== ''){
					this.loading.memberOptions = true;
					this.getMemberByName(query);
				}else{
					this.memberOptions = [];
				}
			},250),
			getMemberByName(username){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/user/list?username=' + username)
					.then((res) => {
						this.memberOptions = [];
						this.loading.memberOptions = false;
						res.data.data.map(row => {
							this.memberOptions.push({
								value:row._id,
								label:row.real_name
							})
						});
					})
			},
			saveEdit(){
				const params = {
					user_name:this.username,
					user_id:this.memberDetail._id,
					group_id:this.memberDetail.group.id,
					role_type:this.memberDetail.role.id
				};
				axios.put(this.$store.state.url1 + '/api/nlp/personal/group/user/role?axios=1',params)
					.then(res => {
						if(res.data.code == 0){
							this.editing = false;
							this.dialogEditVisible = false;
							this.getMemberList();
							this.$message.success("修改成功！");
						}
					})
			},
			changeGroup(val){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/group?ids=' + JSON.stringify([val]))
					.then(res => {
						res.data.data.map(row => {
							let leaders = [];
							row.leaders.map(item => {
								leaders.push(item.real_name);
							})
							this.memberDetail.leadersList = leaders.join("、");
						})
					})
			},
			getGroupOptions(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/group/list')
					.then((res) => {
						res.data.data.map(row => {
							this.groupOptions.push({
								label:row.name,
								value:row._id
							})
						})
					})
			},
			handleIconClick(ev) {
		      console.log(ev);
		    },
		    add(){
		    	this.dialogAddVisible = true;
		    },
		    getMemberList(){
		    	this.memberList = [];
		    	axios.get(this.$store.state.url1 + '/api/nlp/personal/user/roles')
		    		.then((res) => {
		    			console.log(res)
		    			res.data.data.map(row => {
		    				this.memberList.push({
			    				name:row.real_name,
			    				group:row.group.group_id?row.group.group_name:'/',
			    				role:row.group.group_id?row.group.role_type:'/',
			    				appsNum:row.apps.length,
			    				username:row.username,
			    			})
		    			})
		    			console.log(this.memberList)
		    			
		    		})
		    },
		    showDetail(username){
		   		axios.get(this.$store.state.url1 + '/api/nlp/personal/user/role?user_name=' + username)
		   			.then((res) => {
		   				const row = res.data.data;
		   				console.log(row);
		   					let apps = [];
		   					let group = {};
		   					let role = {};
		   					let leadersList = [];
		   					if(row.group.group_id){
		   						group = {
		   							name:row.group.group_name,
		   							id:row.group.group_id
		   						};
		   						role = {
		   							name:row.group.role_type == 'admin'?'组长':'组员',
		   							id:row.group.role_type
		   						}
		   					}else{
		   						group = {
		   							name:'/',
		   							id:''
		   						};
		   						role = {
		   							name:'/',
		   							id:''
		   						}
		   					}
		   					if(row.group.leaders){
		   						row.group.leaders.map( item => {
			   						leadersList.push(item.real_name);
			   					});
		   					}else{
		   						leadersList = [];
		   					}
		   					
		   					row.apps.map(item => {
		   						apps.push(item.app_name);
		   					})
		   					this.memberDetail = {
		   						name:row.real_name,
		   						group:group,
		   						role:role,
		   						leadersList:leadersList.join("、"),
		   						apps:apps.join("、"),
		   						_id:row.user_id,
		   					}
		   				console.log(res,'888');
		   				console.log(this.memberDetail)
		   			})
		    	this.dialogEditVisible = true;
		    }
		}
	}
</script>

<style lang="less">
	@import '../common/common.less';
	@import './member.less';
	// .el-dialog__headerbtn{
	// 	display: none !important; 
	// }
</style>