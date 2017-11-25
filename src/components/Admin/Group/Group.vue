<template>
	<div class="adminCommon" id="group">
		<search @add="add" @search="searchGroup" :info="searchInfo"></search>
		<dl class="main-list">
			<dt>
				<span>小组名称</span>
				<span>组长姓名</span>
				<span>成员人数</span>
				<span>应用个数</span>
				<span>建组日期</span>
			</dt>
			<dl v-for="item in groupList" @click="showDetail(item._id)">
				<span>{{item.name}}</span>
				<span>{{item.leaders.join("、")}}</span>
				<span>{{item.membersNum}}</span>
				<span>{{item.appsNum}}</span>
				<span>{{item.createTime}}</span>
			</dl>
		</dl>

		<el-dialog title="法律知识图谱组" size="tiny" :visible.sync="dialogAddVisible">
			<el-form :model="form" label-width="80px">
				<el-form-item label="小组名称">
				    <el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="英文标识">
				    <el-input v-model="form.encode"></el-input>
				</el-form-item>
				<el-form-item label="小组组长">
				    <!-- <el-select v-model="form.region" placeholder="请选择成员">
				      <el-option label="区域一" value="shanghai"></el-option>
				      <el-option label="区域二" value="beijing"></el-option>
				    </el-select> -->
				    <div>
				    	<el-tag
						  :key="tag"
						  v-for="tag in form.leaders"
						  :closable="true"
						  :close-transition="false"
						  @close="handleClose(tag,'add')"
						>
						{{tag.name}}
						</el-tag>
						<el-select class="select-leader" v-model="form.members" filterable remote placeholder="请选择组长" :remote-method="remoteMembers" :loading="loading.memberOptions" @change="selectAdd">
					        <el-option v-for="item in memberOptions" :label="item.label" :value="item.value"></el-option>
					    </el-select>
				    </div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save" :loading="loading.save">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="法律知识图谱组" size="tiny" :visible.sync="dialogEditVisible">
			<el-form :model="groupDetail" label-width="80px">
				<el-form-item label="小组名称">
					<el-input v-if="editing" v-model="groupDetail.name"></el-input>
				    <span v-if="!editing" class="editable">{{groupDetail.name}}</span>
				</el-form-item>
				<el-form-item label="小组组长">
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
				    
				</el-form-item>
				<p><label>小组成员</label><span>{{groupDetail.members}}</span></p>
				<p><label>建组日期</label><span>{{groupDetail.createTime}}</span></p>
				<p><label>小组应用</label><span>{{groupDetail.apps}}</span></p>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<template v-if="!editing">
					<el-button @click="delGroup" class="grey">删除小组</el-button>
					<el-button type="primary" @click="editing = true;">修 改</el-button>
				</template>
				<el-button v-if="editing" type="primary" @click="saveEdit" :loading="loading.saveEdit">保 存</el-button>
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
				form:{
					name:'',
					members:'',
					encode:'',
					leaders:[]
				},
				loading:{
					memberOptions:false,
					save:false,
					saveEdit:false,
				},
				dialogAddVisible:false,
				dialogEditVisible:false,
				editing:false,
				groupList:[],
				groupDetail:{},
				memberOptions:[],
				searchInfo:{
					placeholder:"选择小组",
					addholder:"新增组"
				},
			}
		},
		components:{search},
		mounted(){
			this.getGroupList();
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
			searchGroup(key){
				const params = {
					name:key
				}
				this.groupList = [];
				axios.get(this.$store.state.url1 + '/api/nlp/personal/group/list',{params})
					.then((res) => {
						res.data.data.map(row => {
							let leaders = [];
							row.leaders.forEach((item) => {
								leaders.push(item.real_name)
							});
							this.groupList.push({
								name:row.name,
								membersNum:row.numbers,
								appsNum:row.apps,
								createTime:row.create_date.substring(0,10),
								leaders:leaders,
								_id:row._id
							})
						})
					})
			},
			delGroup(){
				const params = {
					ids:JSON.stringify([this.groupDetail._id]),
					user_name:this.username,
				}
				this.$confirm('此操作将永久删除该小组, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	axios.delete(this.$store.state.url1 + '/api/nlp/personal/group/list?axios=1',{params})
						.then((res) => {
							this.getGroupList();
							this.dialogEditVisible = false;
							this.$message.success("删除成功！");
						})
				}).catch(() => {
					this.$message.info("已取消删除");
				})
				
			},
			saveEdit(){
				this.loading.saveEdit = true;
				console.log(this.groupDetail,'detail');
				const params = {
					_id:this.groupDetail._id,
					user_name:this.username,
					name:this.groupDetail.name
				};
				const params2 = {
					group_id:this.groupDetail._id,
					previous_user_ids:JSON.stringify(this.groupDetail.oldLeaders),
					current_user_ids:JSON.stringify(this.groupDetail.leaders.map(row => row._id)),
					user_name:this.username,
				};
				Promise.all([axios.put(this.$store.state.url1 + '/api/nlp/personal/group?axios=1',params),axios.post(this.$store.state.url1 + '/api/nlp/personal/update/group/leader?axios=1',params2)])
					.then((res) => {
						this.loading.saveEdit = false;
						this.dialogEditVisible = false;
						this.editing = false;
						this.getGroupList();
						this.$message.success("修改成功！");
					});

			},
			save(){
				console.log(this.form,'save')
				this.dialogAddVisible = false;
				this.loading.save = true;
				const params = {
					user_name:this.username,
					name:this.form.name,
					id:this.form.encode
				};
				axios.post(this.$store.state.url1 + '/api/nlp/personal/group?axios=1',params)
					.then((res) => {
						const groupId = res.data.data.id;
						if(this.form.leaders.length){
							const params2 = {
								previous_user_ids:JSON.stringify([]),
								current_user_ids:JSON.stringify(this.form.leaders.map(row => row._id)),
								group_id:groupId,
								user_name:this.username
							}
							axios.post(this.$store.state.url1 + '/api/nlp/personal/update/group/leader?axios=1',params2)
								.then((res2) => {
									this.loading.save = false;
								})
						}else{
							this.loading.save = false;

						}
						this.form = Object.assign({},{
							name:'',
							members:'',
							encode:'',
							leaders:[]
						})
						this.$message.success("保存成功！");
						this.getGroupList();
					})
			},
			handleClose(item,tag){
				console.log(tag,'tag')
				if(tag == 'edit'){
					this.groupDetail.leaders.splice(this.groupDetail.leaders.indexOf(item), 1);
				}else if(tag == 'add'){
					this.form.leaders.splice(this.form.leaders.indexOf(item),1);
				}
				
			},
			selectEdit(val){
				if(val){
					let item = {};
					item = this.memberOptions.find((item) => {
						return item.value === val;
					});
					this.groupDetail.leaders.unshift({
						name:item.label,
						_id:item.value
					});
				}
				this.form.members = '';
			},
			selectAdd(val){
				if(val){
					let item = {};
					item = this.memberOptions.find((item) => {
						return item.value === val;
					});
					this.form.leaders.unshift({
						name:item.label,
						_id:item.value
					});
				}
				this.form.members = '';
				console.log(this.form.leaders)
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
						console.log(this.memberOptions,'222')
					})
			},
			getGroupList(){
				this.groupList = [];
				axios.get(this.$store.state.url1 + '/api/nlp/personal/group/list')
					.then((res) => {
						console.log(res)
						res.data.data.map(row => {
							let leaders = [];
							row.leaders.forEach((item) => {
								// leaders.push({
								// 	name:item.real_name,
								// 	_id:item._id
								// })
								leaders.push(item.real_name)
							});
							this.groupList.push({
								name:row.name,
								membersNum:row.numbers,
								appsNum:row.apps,
								createTime:row.create_date.substring(0,10),
								leaders:leaders,
								_id:row._id
							})
						})
					})
			},
			handleIconClick(ev) {
		      console.log(ev);
		    },
		    add(){
		    	this.dialogAddVisible = true;
		    	console.log(1111)
		    },
		    // 根据groupid获取小组的详细信息
		    showDetail(id){
		    	console.log(id);
		   		axios.get(this.$store.state.url1 + '/api/nlp/personal/group?ids=' + JSON.stringify([id]))
		   			.then((res) => {
		   				res.data.data.map(row => {
		   					let leaders = [];
		   					let leadersList = [];
		   					let oldLeaders=[];
		   					let members = [];
		   					let apps = [];
		   					row.leaders.map( item => {
		   						leaders.push({
		   							name:item.real_name,
		   							_id:item._id
		   						});
		   						leadersList.push(item.real_name);
		   						oldLeaders.push(item._id);
		   					});
		   					row.numbers.map(item => {
		   						members.push(item.real_name);
		   					});
		   					row.apps.map(item => {
		   						apps.push(item.name);
		   					})
		   					this.groupDetail = {
		   						name:row.name,
		   						leaders:leaders,
		   						leadersList:leadersList.join("、"),
		   						members:members.join("；"),
		   						createTime:row.create_date.substring(0,10),
		   						apps:apps.join("、"),
		   						oldLeaders:oldLeaders,
		   						_id:row._id,
		   					}
		   				})
		   				console.log(res,'888')
		   			})
		    	this.dialogEditVisible = true;
		    }
		}
	}
</script>

<style lang="less">
	@import '../common/common.less';
	@import './group.less';
</style>