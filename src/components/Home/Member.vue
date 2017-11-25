<template>
	<div class="member">
		<div class="app_list">
			<el-row :gutter="26" class="selected" style="margin:0;">
				<el-col :span="5" v-for="(item,index) in app_list">
					<span @click="getMember(item.id,index)">
						<img src="../../assets/home/face.png" height="28" width="24" alt="">
						{{item.name}}
					</span>
				</el-col>
			</el-row>
		</div>
		<div class="search">
			<el-select size="large" v-model="allMember.value" remote :loading="options_loading" :remote-method="remoteMethod" @change="handleChange" filterable clearable placeholder="搜索用户">
			    <el-option
			      v-for="item in allMember.options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
			<p class="select-group">
				<span v-for="(item,index) in allGroup" @click="select(item.id,index)">{{item.name}}</span>
			</p>
		</div>
		<div class="member_list" v-loading="member_loading">
			<el-row :gutter="39" class="selected" style="margin:0;">
				<el-col :span="4" v-for="(item,index) in inGroup">
					<span @click="delMember(item,index)">
						<img src="../../assets/home/member.png" height="39" width="39" alt="">
						{{item.name}}
						<i></i>
					</span>
				</el-col>
			</el-row>

			<el-row :gutter="39" class="waiting" style="margin:0;">
				<el-col :span="4" v-for="(item,index) in outGroup">
					<span @click="addMember(item,index)">
						<img src="../../assets/home/member.png" height="39" width="39" alt="">
						{{item.name}}
						<i></i>
					</span>
				</el-col>
			</el-row>
			<el-pagination
			    layout="prev, pager, next"
			    @current-change="changePage"
			    :page-size="pager.page_size"
			    :total="pager.total">
			</el-pagination>
		</div>

		<p class="submit">
			<button @click="save">保存操作</button>
		</p>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
	export default{
		data(){
			return {
				member:[],
				inGroup:[],
				outGroup:[],
				oldMembers:[],
				newMembers:[],
				app_list:[],
				app_id:'',
				member_loading:false,
				options_loading:false,
				allMember:{
					value:'',
					options:[
						
					]
				},
				allMembers:[],
				allGroup:[],
				addList:[],
				pager:{
					total:0,
					page_size:50,
				}
			}
		},
		mounted(){
			this.getAppList();
			this.getGroup();
			
			
		},
		computed:{
		    user:function(){
		        return this.$store.state.user;
		    },
		    username(){
		      return JSON.parse(this.user.config.data).username
		    },
		    groupId(){
		    	return localStorage.groupId;
		    }
		},
		methods:{
			handleChange(val){
				if(val){
					let item = {};
					item = this.allMember.options.find((item) => {
						return item.value === val;
					})
					this.inGroup.unshift({
						name:item.label,
						user_id:item.value
					})
				}
				
			},
			remoteMethod(query){
				if(query !== ''){
					this.options_loading = true;
					this.getMemberByName(query);
				}else{
					this.allMember.value = '';
				}
			},
			save(){
				let user_ids = [];
				this.inGroup.map(row => {
					user_ids.push(row.user_id);
				})
				const params = {
					//当前操作人
					user_name:this.username,
					//需要增加的成员id
					// user_ids:JSON.stringify(user_ids),
					//原成员数组
					previous_user_ids:JSON.stringify(this.oldMembers),
					// 现成员数组
					current_user_ids:JSON.stringify(user_ids),
					// 应用id
					app_id:this.app_id,
				};
				console.log(params);
				axios.post(this.$store.state.url1 + '/api/nlp/personal/update/app/user?axios=1',params)
					.then((res) => {
						console.log(res);
						if(res.data.code == 0){
							this.$message.success("保存成功!");
						}else{
							this.$message.warning(res.data.msg);
						}
					})
			},
			changePage(val){
				// let start = (val - 1) * this.pager.page_size;
				// console.log(this.allMembers.slice(50,50),'77')
				// if(this.allMembers.slice(start).length >= this.pager.page_size){
				// 	this.outGroup = this.allMembers.slice(start,this.pager.page_size);
				// }else{
				// 	this.outGroup = this.allMembers.slice(start);
				// }
				// console.log(this.allMembers.slice(50).length,'77')
				// this.outGroup = this.allMembers.slice(start,50);
				this.getMemberByPage(val);
				console.log(this.outGroup,'88');
			},
			getMemberByPage(page){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/user/list?pager_flag=true&page_size='+this.pager.page_size+'&page='+page)
					.then((res) => {
						console.log(res,'789');
						this.outGroup = [];
						res.data.data.map(row => {
							this.outGroup.push({
								name:row.real_name,
								user_id:row._id
							})
						})
						
						this.outGroup = this.outGroup.filter(row => {
							if(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)) == -1){
								return true;
							}
						});
						this.pager.total = res.data.pager.total;
						console.log(this.outGroup,'22')
						console.log(this.pager.total,'page')
					})
			},
			getMemberByName(username){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/user/list?username=' + username)
					.then((res) => {
						this.allMember.options = [];
						this.options_loading = false;
						res.data.data.map(row => {
							this.allMember.options.push({
								value:row._id,
								label:row.real_name
							})
						})
					})
			},
			select(groupId,index){
				$('.select-group span:eq('+index+')').toggleClass('on');
				if($('.select-group span:eq('+index+')').hasClass('on')){
					//增加
					// axios.get(this.$store.state.url1 + '/api/nlp/personal/group/user/role/list?group_id='+groupId)
					// 	.then((res) => {
					// 		console.log(res,'222')
					// 		const data = [];
					// 		res.data.data.map((row) => {
					// 			data.push({
					// 				name:row.real_name,
					// 				user_id:row.user_id
					// 			})
					// 		});
					// 		this.
					// 		data.forEach(row => {
					// 		// 	console.log(JSON.stringify(row));
					// 		// console.log(JSON.stringify(this.inGroup), 3333);
					// 		// console.log(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)), 666);							
					// 			if(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)) == -1){
					// 				this.addList.push(row);
					// 			}  
								                                                                                                                                                                                                                                                                         
					// 		} );
					// 		console.log(this.addList,'22')
					// 	})
					this.allGroup[index].member.map(row => {
						if(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)) == -1){
							this.inGroup.unshift(row);
						}
						
					});
					this.outGroup = this.outGroup.filter(row => {
						if(JSON.stringify(this.allGroup[index].member).indexOf(JSON.stringify(row)) == -1){
							return true;
						}
					})
				}else{
					//减少
					let data = [];
					this.inGroup = this.inGroup.filter(row => {
						// console.log(JSON.stringify(this.allGroup[index].member),'1');
						// console.log(JSON.stringify(row),'2')
						// console.log(JSON.stringify(this.allGroup[index].member).indexOf(JSON.stringify(row)),'3')
						if(JSON.stringify(this.allGroup[index].member).indexOf(JSON.stringify(row)) == -1){
							return true;
						}
					})
					this.allGroup[index].member.map(row => {
						if(JSON.stringify(this.outGroup).indexOf(JSON.stringify(row)) == -1)
						this.outGroup.push(row);
					})
					
				}
				
			},
			getGroup(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/group/list')
					.then((res) => {
						console.log(res,'777')
						res.data.data.map((row,index) => {
							this.allGroup.push({
								name:row.name,
								id:row._id,
								member:[]
							});

							axios.get(this.$store.state.url1 + '/api/nlp/personal/group/user/role/list?group_id='+row._id)
								.then((res2) => {
									console.log(res2,'888')
									if(res2.data.data){
										res2.data.data.map(row => {
											this.allGroup[index].member.push({
												name:row.real_name,
												user_id:row.user_id
											});
										});
									}
									
									const data = [];
									this.allGroup[index].member.forEach(row => {
										console.log(row,'111');
										console.log(JSON.stringify(row),'222')
										console.log(JSON.stringify(this.inGroup),'444')
										console.log(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)),'333')
										if(JSON.stringify(this.inGroup).indexOf(JSON.stringify(row)) == -1){
											data.push(row);
										} 
									});
									console.log(data,'666')
								})
						})
					})
			},
			getAppList(){
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/list?group_id='+this.groupId)
					.then((res) => {
						if(res.data.data.length){
							res.data.data.map(row => {
								this.app_list.push({
									name:row.name,
									id:row._id
								})
							});
							
						}else{
							$('.member').html('<p style="margin-top:20px;font-size:18px;">你还没有加入应用!</p>')
						}
					}).then(() => {
						this.getMember(this.app_list[0].id,0);
					})
			},
			getMember(app_id,index){
				this.member_loading = true;
				this.app_id = app_id;

				$('.app_list .el-col:eq('+index+')').addClass('on').siblings().removeClass('on');
				const params = {
					app_id : app_id,
				}
				axios.get(this.$store.state.url1 + '/api/nlp/personal/app/user/role/list',{params})
					.then((res) => {
						console.log(res,'888')
						console.log(this.allGroup,'777')
						this.member_loading = false;
						this.inGroup = [];
						this.oldMembers = [];
						// this.outGroup = [];
						res.data.data.map(row => {
							if(row.app_id){
								this.inGroup.push({
									name:row.real_name,
									user_id:row.user_id
								});
								this.oldMembers.push(row.user_id);
							}
						})
						this.getMemberByPage(1);

						// res.data.others.map(row => {
						// 	this.outGroup.push({
						// 		name:row.real_name,
						// 		user_id:row._id
						// 	})
						// });
						this.allGroup.map((row,i) => {
							const data = [];
							row.member.map((member) => {
								// console.log(member,'1');
								// console.log(JSON.stringify(member),2);
								// console.log(JSON.stringify(this.inGroup),'3');
								// console.log(JSON.stringify(this.inGroup).indexOf(JSON.stringify(member)),'4')
								if(JSON.stringify(this.inGroup).indexOf(JSON.stringify(member)) == -1){
									data.push(member);
								}
							});
							if(!data.length){
								$('.select-group span:eq('+i+')').addClass('on');
							}
						});

					})
			},
			delMember(item,index){
				this.inGroup.splice(index,1);
				this.outGroup.push(item);
				// const params = {
				// 	user_name : this.username,
				// 	app_id : this.app_id,
				// 	ids:JSON.stringify([id])
				// }
				// axios.delete(this.$store.state.url1 + '/api/nlp/personal/app/user/role/list',{params:params})
				// 	.then((res) => {
				// 		if(res.data.code == 0){
				// 			this.getMember();
				// 		}else{
				// 			this.$message.error(res.data.msg);
				// 		}
				// 	})
			},
			addMember(item,index){
				this.outGroup.splice(index,1);
				this.inGroup.unshift(item);
				// const params = {
				// 	//当前操作人
				// 	user_name:this.username,
				// 	//需要增加的成员id
				// 	user_id:id,
				// 	// 应用id
				// 	app_id:this.app_id,
				// 	role_id:'596c659d331fdb4418fcaa81'
				// };
				// axios.post(this.$store.state.url1 + '/api/nlp/personal/app/user/role?axios=1',params)
				// 	.then((res) => {
				// 		if(res.data.code == 0){
				// 			this.getMember();
				// 		}else{
				// 			this.$message.error(res.data.msg);
				// 		}
				// 	})
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-row{
		padding: 34px 0px;
		span{
			display: inline-block;
			width: 151px;
			border-radius: 23px;
			background: #F5F5F5;
			padding: 4px 5px;
			font-size: 16px;
			position: relative;
			margin-bottom:28px;
			cursor: pointer;
			img{
				vertical-align: middle;
				margin-right: 8px;
			}
			i{
				position: absolute;
				width: 18px;
				height: 18px;
				top: 14px;
				right: 10px;
			}
		}
	}
	.selected{
		span{
			color:#0E80FB;
			i{
				background: url('../../assets/home/selected.png') no-repeat center;
			}
		}

	}
	.waiting{
		border-top: 1px dotted #D2D2D2;
		span{
			color: #838282;
			i{
				background: url('../../assets/home/waiting.png') no-repeat center;
			}
		}

	}
	.member_list{
		border:1px solid #e2e2e2;
		box-shadow: inset 0px 0px 10px 4px #f5f5f5;
		padding: 0 27px;
	}
	.submit{
		text-align: right;
		margin: 20px 0;
		button{
			background: #006de3;
			color:#fff;
			font-size: 16px;
			line-height: 38px;
			border:0 none;
			padding: 0 24px;
			outline: none;
			border-radius: 2px;
			cursor: pointer;
		}
	}
	.search{
		margin-bottom: 16px;
		.select-group{
			margin-top: 19px;
			span{
				display: inline-block;
				padding: 0px 14px;
				height: 28px;
				line-height: 28px;
				background: #bfbfbf;
				border-radius: 30px;
				color: #fff;
				font-size: 16px;
				margin-right: 12px;
				cursor: pointer;
				&.on{
					background: #006de3;
				}
			}
		}
	}
	.app_list{
		.el-row{
			padding: 37px 0;
			span{
				padding: 9px 30px;
				width: auto;
				font-size: 18px;
				color:#939393;
				background: #dcdcdc;
				
			}

			.el-col.on{
				span{
					background: #006de3;
					box-shadow: 0px 0px 10px 1px #a8cdf5;
					color: #fff;
				}
			}
		}
	}
</style>
