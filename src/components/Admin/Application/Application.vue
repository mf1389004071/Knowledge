<template>
	<div class="adminCommon app">
		<search @add="add" :info="searchInfo" @search="searchApp"></search>
		<ul class="app-list">
			<li v-for="item in appList" @click="showDetail(item._id)">
				<span>
					<img :src="item.img_url" height="69" width="68" alt="">
				</span>
				<p>{{item.name}}</p>
			</li>
		</ul>
		
		<el-dialog title="增加新应用" size="tiny" :visible.sync="dialogAddVisible">
			<el-form :model="form" label-width="80px">
				<el-form-item label="应用头像">
					<el-upload
					  class="avatar-uploader"
					  action="http://180.96.11.69:8500/api/image/list"
					  ref="upload"
					  :auto-upload="false"
					  :show-file-list="false"
					  :on-change="change"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img :src="src" height="69" width="68" class="avatar">
					</el-upload>
				</el-form-item>
				<el-form-item label="应用名称">
				    <el-input v-model="form.name" placeholder="输入应用名称"></el-input>
				</el-form-item>
				<el-form-item label="英文标识">
				    <el-input v-model="form.encode" placeholder="输入应用英文标识"></el-input>
				</el-form-item>
				<el-form-item label="应用简介">
					<el-input type="textarea" cols="30" rows="5" placeholder="输入应用简介" v-model="form.desc"></el-input>
				</el-form-item>
				<el-form-item label="归属小组">
					<el-select v-model="form.group" filterable placeholder="请选择应用归属小组">
				      <el-option v-for="item in groupOptions" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitUpload" v-loading="loading.add">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog class="edit" title="应用详细信息" size="tiny" :visible.sync="dialogEditVisible">
			<el-form :model="editform" label-width="100px">
				<el-form-item label="应用图标">
				    <img v-if="!editing" :src="editform.img_url" height="69" width="68" alt="">
				    <el-upload
					  class="avatar-uploader"
					  action="http://180.96.11.69:8500/api/image/list"
					  ref="uploadT"
					  v-if="editing"
					  :auto-upload="false"
					  :show-file-list="false"
					  :on-change="changeT"
					  :on-success="handleAvatarSuccessT"
					  :before-upload="beforeAvatarUploadT">
					  <img :src="src" height="69" width="68" class="avatar">
					</el-upload>
				</el-form-item>
				<el-form-item label="应用名称">
				    <span v-if="!editing">{{editform.name}}</span>
				    <el-input v-if="editing" v-model="editform.name"></el-input>
				   <!--  <div v-if="editing" style="margin-left:12px;">
				    	<el-tag
						  :key="tag"
						  v-for="tag in groupDetail.leaders"
						  :closable="true"
						  :close-transition="false"
						  @close="handleClose(tag)"
						>
						{{tag.name}}
						</el-tag>
						<el-select class="select-leader" v-model="" filterable remote placeholder="请选择组长" :remote-method="remoteMembers" :loading="loading.memberOptions" @change="select">
					        <el-option v-for="item in memberOptions" :label="item.label" :value="item.value"></el-option>
					    </el-select>
				    </div> -->
				</el-form-item>
				<el-form-item label="应用简介">
					<span v-if="!editing">{{editform.desc}}</span>
					<el-input v-if="editing" type="textarea" cols="30" rows="5" placeholder="输入应用简介" v-model="editform.desc"></el-input>
				</el-form-item>
				<el-form-item label="归属小组">
					<span v-if="!editing">{{editform.group?editform.group.name:''}}</span>
					<el-select v-if="editing" v-model="editform.group.id" filterable placeholder="请选择应用归属小组" @change="changeGroup">
				      <el-option v-for="item in groupOptions" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="应用成员">
					<span v-if="!editing" class="member">{{editform.membersList}}</span>
					<div v-if="editing">
				    	<el-tag
						  :key="tag"
						  v-for="tag in editform.members"
						  :closable="true"
						  :close-transition="false"
						  @close="handleClose(tag,'edit')"
						>
						{{tag.name}}
						</el-tag>
						<el-select class="select-leader" v-model="form.members" filterable remote placeholder="请选择成员" :remote-method="remoteMembers" :loading="loading.memberOptions" @change="selectEdit">
					        <el-option v-for="item in memberOptions" :label="item.label" :value="item.value"></el-option>
					    </el-select>
				    </div>
				</el-form-item>
				<p class="text"><label>应用创建人</label><span>{{editform.creater}}</span></p>
				<p class="text"><label>当前组长</label><span>{{editform.leaders}}</span></p>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<template v-if="!editing">
					<el-button @click="delApp" class="grey">删除应用</el-button>
					<el-button type="primary" @click="editing = true;">修 改</el-button>
				</template>
				<el-button v-if="editing" type="primary" @click="submitUploadT" v-loading="loading.edit">保 存</el-button>
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
				searchInfo:{
					placeholder:"选择应用",
					addholder:"新增应用"
				},
				appList:[],
				dialogEditVisible:false,
				dialogAddVisible:false,
				editing:false,
				src:'',
				editform:{},
				form:{
					name:'',
					encode:'',
					desc:'',
					group:'',
					src:'',
					members:'',
				},
				loading:{
					add:false,
					memberOptions:false,
					edit:false,
				},
				groupOptions:[],
				memberOptions:[],
			}
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      	return JSON.parse(this.user.config.data).username
		    }
		},
		components:{search},
		mounted(){
			this.getAppList();
			this.getGroupOptions();
		},
		methods:{
			delApp(){
				const params = {
					ids:JSON.stringify([this.editform._id]),
					user_name:this.username,
					group_id:this.editform.group.id
				}
				console.log(params);
				// dialogEditVisible = false
				this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	axios.delete(this.$store.state.url1 + '/api/nlp/personal/app/list?axios=1',{params})
						.then((res) => {
							this.getAppList();
							this.dialogEditVisible = false;
							this.$message.success("删除成功！");
						})
				}).catch(() => {
					this.$message.info("已取消删除");
				})
				
			},
			searchApp(key){
				const params = {
					name:key
				};
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/list',{params})
					.then(res => {
						this.appList = [];
						res.data.data.map(row => {
							this.appList.push({
								name:row.name,
								img_url:'http://180.96.11.69:8500'+row.img_url,
								_id:row._id,
							})
						})
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
							this.editform.leaders = leaders.join("、");
						})
					})
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
			handleClose(item,tag){
				console.log(tag,'tag')
				if(tag == 'edit'){
					this.editform.members.splice(this.editform.members.indexOf(item), 1);
				}else if(tag == 'add'){
					// this.form.leaders.splice(this.form.leaders.indexOf(item),1);
				}
				
			},
			selectEdit(val){
				if(val){
					let item = {};
					item = this.memberOptions.find((item) => {
						return item.value === val;
					});
					this.editform.members.unshift({
						name:item.label,
						_id:item.value
					});
				}
				this.form.members = '';
			},
			saveEdit(tag){
				const params = {
					_id:this.editform._id,
					user_name:this.username,
					name:this.editform.name,
					description:this.editform.desc,
					img_url:tag?this.src:'',
					group_id:this.editform.group.id
				}
				const params2 = {
					user_name:this.username,
					previous_user_ids:JSON.stringify(this.editform.oldMemberList),
					current_user_ids:JSON.stringify(this.editform.members.map(row => row._id)),
					app_id:this.editform._id
				}
				Promise.all([axios.put(this.$store.state.url1 + '/api/nlp/personal/app?axios=1',params),axios.post(this.$store.state.url1 + '/api/nlp/personal/update/app/user?axios=1',params2)])
					.then(res => {
						this.loading.edit = false;
						this.getAppList();
						this.editing = false;
						this.dialogEditVisible = false;
						this.$message.success("修改成功！");
					})
			},
			submitUploadT(){
				this.$refs.uploadT.submit();
				if(!this.loading.edit){
					this.saveEdit(false);
				}
			},
			handleAvatarSuccessT(response,file,fileList){
				if(response.code == 0){
					this.src = response.data[0].file_path;
					this.saveEdit(true);
				}
			},
			beforeAvatarUploadT(file){
				console.log('66666666')
				console.log(file);
				this.loading.edit = true;
			},
			changeT(file,fileList){
				console.log(4444444444)
				console.log(file,333)
				console.log(fileList,'666');
				this.src = file.url;

			},
			save(){
				const params = {
					user_name:this.username,
					group_id:this.form.group,
					name:this.form.name,
					id:this.form.encode,
					description:this.form.desc,
					img_url:this.src,
				}
				console.log(params,'params');
				axios.post(this.$store.state.url1 + '/api/nlp/personal/app?axios=1',params)
					.then((res) => {
						this.getAppList();
						this.loading.add = false;
						this.dialogAddVisible = false;
						this.$message.success("保存成功！");
					})
			},
			submitUpload(){
				console.log('00000000');
				
				this.$refs.upload.submit();
				if(!this.loading.add){
					this.save();
				}
			},
			handleAvatarSuccess(response,file,fileList){
				if(response.code == 0){
					// this.form.src = response.data[0].file_path;
					this.src = response.data[0].file_path;
					this.save();
				}
			},
			beforeAvatarUpload(file){
				console.log('66666666')
				console.log(file);
				this.loading.add = true;
			},
			change(file,fileList){
				console.log(4444444444)
				console.log(file,333)
				console.log(fileList,'666');
				this.src = file.url;

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
		    	this.src = '';
		    },
		    getAppList(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/list')
					.then((res) => {
						this.appList = [];
						res.data.data.map(row => {
							this.appList.push({
								name:row.name,
								img_url:'http://180.96.11.69:8500'+row.img_url,
								_id:row._id,
							})
						})
					})
			},
			showDetail(id){
				this.dialogEditVisible = true;
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app?ids=' + JSON.stringify([id]))
					.then((res) => {
						res.data.data.map(row => {
							let group = {};
							let members = [];
							let membersList = [];
							let oldMemberList = [];
							let leaders = [];
							if(row.group._id){
								group = {
									name:row.group.name,
									id:row.group._id
								};
								row.group.leaders.map(leader => {
									leaders.push(leader.real_name);
								})
							}else{
								group = {
									name:'/',
									id:''
								};
								leaders = [];
							}
							row.members.map(member => {
								members.push({
									name:member.real_name,
									_id:member.user_id
								});
								membersList.push(member.real_name);
								oldMemberList.push(member.user_id);
							})
							this.editform = Object.assign({},{
								name:row.name,
								desc:row.description,
								group:group,
								members:members,
								membersList:membersList.join("、"),
								oldMemberList:oldMemberList,
								creater:row.creater,
								leaders:leaders.join("、"),
								_id:row._id,
								img_url:'http://180.96.11.69:8500' + row.img_url,
							});
							this.src = this.editform.img_url;
						})
						// res2.data.data.map(row => {
						// 	this.app = Object.assign({},{
						// 		name:row.name,
						// 		desc:row.description,
						// 		_id:row._id,
						// 		encode:row.id,
						// 		img_url:row.img_url,
						// 		time:row.write_date.substring(0,10),
						// 		member:member
						// 	}); 
						// 	this.src = 'http://180.96.11.69:8500' + this.app.img_url;
						// })
						console.log(res,'res')
						console.log(this.editform,'66')
					});
				
				
			},
		}
	}
</script>

<style lang="less">
	@import '../common/common.less';
	@import './app.less';
</style>