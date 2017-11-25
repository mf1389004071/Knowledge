<template>
	<div id="riskAss">
		<div class="graph_box">
	      <div class="bread">
	        <el-breadcrumb separator="/">
	          <el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
	          <el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
	          <el-breadcrumb-item><span style="color: red">风险提示</span></el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	  </div>
    <div class="header">
        <header>
          <span><i class="icon-menu"></i>风险标签列表</span>
          <div class="search_box">
            <el-input v-model="value.keyword" placeholder="点击输入搜索内容" @change="changeTag" @keyup.native.enter="getRiskList();show.detail=false;"></el-input>
            <i class="icon-search" @click="getRiskList();show.detail=false;"></i>
          </div>
        </header>
    </div>

    <dl class="tag-list" v-if="!show.detail">
      <dt>
        <!-- <el-select v-model="value.tagList" clearable placeholder="标签名称">
          <el-option
            v-for="item in options.tagList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <span class="tag-name">风险名称</span>
        <span class="tag-desc">风险说明</span>
      </dt>
      <dd v-for="item in riskTagList" @click="toggleDetail();getRiskDetail(item);">
        <span class="tag_name">{{item.zh_name}}</span>
        <span class="tag_desc">{{item.description}}</span>
      </dd>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
          :page-size="pager.page_size"
          layout="prev, pager, next, sizes, jumper"
          :total="pager.total">
        </el-pagination>
      </div>
    </dl>

    <section class="tag-detail" v-if="show.detail">
      <div class="detail_top">
        <span @click="toggleDetail"><i class="icon-back"></i>返回标签列表</span>
        <h3>标签风险详情</h3>
      </div>
      <div class="detail_content">
        <div class="tag">
          <span>{{riskDetail.zh_name}}</span>
          <i class="icon-edit" v-if="!show.edit" @click="toggleEdit();"></i>
          <i class="icon-save" v-else @click="toggleEdit();saveDesc();"></i>
        </div>
        <textarea v-model="riskDetail.description" id="tag-edit" :readonly="readonly">
        </textarea>
      </div>
      <div class="detail_actions">
        <!-- 标签列表 -->
        <dl class="tags">
          <dt>
            <el-select v-model="value.falv" @change="selectFalv" clearable placeholder="标签列表">
              <el-option
                v-for="item in options.falv"
                :key="item.id"
                :label="item.zh_name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input
              placeholder="搜索"
              icon="search"
              v-model="value.tag"
              :on-icon-click="searchTags"
              @change="changeTags"
              @keyup.native.enter="searchTags"
              >
            </el-input>
          </dt>
          <dd v-loading="loading.tag">
            <p v-for="item in list.tags" @click="addItem(item)">{{item.name}}</p>
          </dd>
        </dl>

        <div class="actions">
          <div class="list-item" v-for="(item,index) in handleList.data">
            <span v-if="item.category === 'tag'" class="tag">{{item.name}}</span>
            <i v-if="item.category === 'rel'" class="label and">{{item.en_name?'':item.name}}</i>
            <div class="tip">
              <span @click="editItem(item.category,index)" v-if="item.category === 'tag'">修改</span>
              <span @click="delItem(index,handleList.data)">删除</span>
            </div>
            <!-- <span class="tag">借贷双方约定利率</span>
            <i class="label and"></i>
            <div class="tip">
              <span @click="editItem(item.category,index)">修改</span>
              <span @click="delItem(index,handleList.data)">删除</span>
            </div> -->
          </div>
          <div class="tag-desc">
            <textarea placeholder="点击输入文本" v-model="handleList.description">
              
            </textarea>
          </div>
          <p style="text-align:right;">
            <el-button class="save" @click="saveTagChain">保存</el-button>
          </p>
        </div>
      </div>
      <section class="tagsline">
        <header>
          <nav class="left">
            <span class="tab1 on" @click="toggleTab('tab1')"><i class="icon_tab1"></i>组合标签列表</span>
            <span class="tab2" @click="toggleTab('tab2')"><i class="icon_tab2"></i>查看标签链图谱</span>
          </nav>
          <nav class="right"><i class="icon_handle"></i>操作</nav>
        </header>
        <div v-if="tabs.tab1">
          <ul class="tagsline-list" v-loading="loading.list">
            <li v-for="(item,index) in list.chains">
              <div class="list">
                <div class="left">
                  <template  v-for="(list,index) in item.chain_linked">
                    <span v-if="index % 2 === 0" class="tag">{{list.name}}</span>
                    <i v-if="index % 2 === 1" :class="['label',list.en_name?list.en_name:'re_line']">{{list.en_name?'':list.name}}</i>
                  </template>
                  
                </div>
                <div class="right">
                  <!-- <span class="edit" @click="edit(item)">修改</span> -->
                  <span class="copy" @click="copy(item)">复制</span>
                  <span class="del" @click="delList(item.graph_id,item._id,index)">删除</span>
                </div>
              </div>
              <p class="edit-info">
                {{item.description}}
              </p>
            </li>
          </ul>

        </div>
        
        <div v-if="tabs.tab2" id="tab2" v-loading="loading.list">
          <create v-if="loading.graph" :list="graphChainList" :visible="true" :editable='false'></create>
        </div>
      </section>
    </section>
	</div>
</template>

<script>
	import axios from '../../js/axios-api.js';
  import Create from '../Search/Create.vue';
  export default{
    data(){
      return{
        value:{
          keyword:'',
          tagList:'',
          falv:'',
          tag:''
        },
        tabs:{
          tab1:true,
          tab2:false,
        },
        readonly:true,
        options:{
          tagList:[

          ],
          falv:[]
        },
        list:{
          tags:[],
          chains:[],
        },
        riskTagList:[],
        loading:{
          tag:false,
          list:false,
          graph:false,
        },
        graphChainList:[],
        handleList:{
          id:'',
          data:[],
        },
        editItemIndex:-1,
        show:{
          detail:false,
          edit:false,
        },
        riskDetail:{},
        params:{
          tags:{
            law_type:'',
            keyword:'',
            page_size:100
          },
        },
        graph_id:'980ca9b41632ec7964d49137f8ca1c3b',
        currentPage: 1,
        pager:{}
      }
    },
    components: {Create},
    mounted(){
      this.getRiskList();
      this.getFalvOptions();
      this.getTagsList(this.params.tags);
    },
    methods:{
      changeTag(val){
        if(val == ''){
          this.getRiskList();
        }
        console.log(val,'7777')
      },
      // 分页
      handleSizeChange(val){
        this.pager.page_size = val;

        this.getRiskList();
      },
      handleCurrentChange(val){
        this.pager.page = val;
        this.getRiskList();
      },
      // 获取某个风险标签的组合链
      getAllChains(id){
        const params = {
          graph_id:this.graph_id,
          tag_id:id,
          pager_flag:true,
        }
        console.log(params,'4444444444')
        axios.get(this.$store.state.TagUrl + '/api/tag/chains',{params})
             .then(res => {
              if(res.data.code === 0){
                this.graphChainList = [];
                if(res.data.data.length === 0){
                  this.list.chains = [];
                }else{

                  res.data.data.map(list => {
                    list.chain_linked.map((row,index) => {
                      const category = index % 2 === 0 ? "tag" : "rel";
                      this.$set(row,"category",category);
                    });

                    var graphData = {};
                    var len = list.chain_linked.length;
                    for (var i = 0; i < len; i++) {
                      var elem = list.chain_linked[i];
                      graphData = {
                        name: elem.name,
                        category: elem.category=="rel"?"relation":elem.category,
                        _id: elem.id,
                        key: elem.id,
                      }
                      var graphListData = {
                        id: list._id,
                        key: graphData._id,
                        text: graphData.name,
                        params: graphData,
                      };
                      if (graphData.category == 'relation') {
                        graphListData.from = list.chain_linked[i - 1].id;
                        graphListData.to = list.chain_linked[i + 1].id;
                      }
                      var hasExisted=false;
                      this.graphChainList.forEach((item)=>{
                        if(graphListData.params.category=='entity'||graphListData.params.category=='tag'){
                          if(item.key==graphListData.key){
                            hasExisted=true;
                          }
                        }else{
                          if(item.from==graphListData.from&&item.key==graphListData.key&&item.to==graphListData.to){
                            hasExisted=true;
                          }
                        }
                      });
                      if(!hasExisted){
                        this.graphChainList.push(graphListData);
                      }
                    }

                  })
                  this.list.chains = res.data.data;
                }
                this.loading.graph=true;
              }else{
                this.$message.error(res.data.msg);
              }
              console.log(res,';;;;;;')
             }).catch(err => {
              this.$message.warning('getAllChains出错！');
             })
      },
      // 修改风险标签的描述
      saveDesc(){
        const params = {
          description:this.riskDetail.description
        }
        axios.put(this.$store.state.TagUrl + this.riskDetail.url + '?axios=1',params)
             .then(res => {
                if(res.data.code === 0){
                  this.$message.success("修改成功！");
                }else{
                  this.$message.error(res.data.msg);
                }
             }).catch(err => {
              this.$message.warning("saveDesc错误!");
             })
      },
      // 获取风险列表
      getRiskList(){
        const params = {
          law_type:'eabf5ee5fa1955b3c3c3429a6fa96434',
          keyword:this.value.keyword,
          page:this.pager.page?this.pager.page:1,
          page_size:this.pager.page_size?this.pager.page_size:15
        };
        axios.get(this.$store.state.TagUrl + '/api/tag/tags',{params})
             .then(res => {
              if(res.data.code === 0){
                this.riskTagList = res.data.data.map(item => {
                  return{
                    zh_name:item.zh_name,
                    description:item.description,
                    url:item.url,
                    id:item.id
                  }
                });
                this.pager = res.data.pager;
              }else{
                this.$message.error(res.data.msg);
              }

             })
      },
      // 获取风险标签详细内容
      getRiskDetail(item){
        axios.get(this.$store.state.TagUrl + item.url)
             .then(res => {
              this.riskDetail = Object.assign(res.data.data,{"url":item.url});

             });
        this.getAllChains(item.id);
      },
      // 获取标签分类
      getFalvOptions(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_categorys')
           .then(res => {
            this.options.falv = res.data.data;
           })
      },
      // 获取标签列表
      getTagsList(params){
        this.loading.tag = true;
        axios.get(this.$store.state.TagUrl + '/api/tag/tags',{params})
          .then(res => {
            this.list.tags = res.data.data.map(item => {
              return {
                name:item.zh_name,
                id:item.id,
                category:'tag'
              }
            });
            this.loading.tag = false;
            console.log(this.list.tags)
          })
      },
      toggleEdit(){
        this.show.edit = !this.show.edit;
        this.readonly = !this.readonly;
        if (!this.readonly) {
          $('#tag-edit').focus();
        }
      },
      toggleDetail(url){
        this.show.detail = !this.show.detail;
        this.handleList.data = [];
        this.tabs = {
            tab1:true,
            tab2:false,
          };
      },
      toggleTab(classname){
        $('.' + classname).addClass('on').siblings().removeClass('on');
        this.tabs = {
          tab1:false,
          tab2:false
        }
        this.tabs[classname] = true;
      },
      copy(list){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.handleList.data = list.chain_linked.slice(0);

        console.log(this.handleList.data,'00000');
      },
      edit(list){
        this.handleList.data = list.chain_linked.slice(0);
        this.handleList.id = list._id;
        this.handleList.description = list.description;
      },
      delList(graphId,chainId,index){

        this.$confirm('此操作将永久删除该标签链, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.delete(this.$store.state.TagUrl + '/api/tag/graphs/' + graphId + '/chains/' + chainId)
           .then(res => {
            if(res.data.code === 0){
              this.$message.success("删除成功！");
              this.list.chains.splice(index,1);
            }
           })
          }).catch(() => {
            this.$message.info('已取消删除!');          
          });
        
      },

      // 保存组合标签链
      saveTagChain(){
        let chain_linked = [];
        this.handleList.data.map(elem => {
          chain_linked.push(elem.id)
        });
        chain_linked.push('a2e5803e0e73cc844da9f1b1b6cb6724');
        chain_linked.push(this.riskDetail.id);
        const params = {
          chain_linked:JSON.stringify(chain_linked),
          description:this.handleList.description
        }
        axios.post(this.$store.state.TagUrl + '/api/tag/graphs/'+this.graph_id+'/chains?axios=1',params)
             .then(res => {
              if(res.data.code === 0){
                this.handleList.data = [];
                this.handleList.description = '';
                this.$message.success("保存成功！");
                this.getAllChains(this.riskDetail.id);
              }else{
                this.$message.error(res.data.msg);
              }
             }).catch(err => {
              this.$message.warning("saveTagChain出错！");
             })
      },
      editItem(category,index){
        this.editItemIndex = index;
        $('.list-item').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
        $('.list-item').eq(index).siblings().removeClass('hover').find('.tip span').removeClass('hover');

      },
      delItem(index,list){
        list.splice(index);
        $('.list').removeClass('dark');
        if(index % 2 == 0){
          $('.rels').addClass('dark');
        }else{
          $('.tags').addClass('dark');
        }
      },
      selectFalv(val){
        this.params.tags.law_type = val;
        this.getTagsList(this.params.tags);
      },
      searchTags(){
        this.params.tags.keyword = this.value.tag;
        this.getTagsList(this.params.tags);
      },
      changeTags(val){
        if(val == ''){
            this.params.tags.keyword = '';
            this.getTagsList(this.params.tags);
          }
      },
      addItem(item){
        if(this.editItemIndex != -1 ){
          var index = this.editItemIndex;
          // $('.'+this.handleList.data[index].category + 's').removeClass('dark').siblings().removeClass('dark');
          if(this.handleList.data[index].category == item.category){
            this.$set(this.handleList.data, index, item);
            $('.list-item').eq(index).removeClass('hover').find('.tip span').removeClass('hover');
            this.editItemIndex = -1;
          }
        }else{

          if(this.handleList.data.length % 2 == 0){
            this.handleList.data.push(item);
          }else{
            this.handleList.data.push({
              category:'rel',
              id:'728c78eee1f2fc8be0d2f44fb85066c1',
            },item);
          }

        }
      },
    }
  }
</script>

<style lang="less" scoped>
	.graph_box {
      width: 100%;
      height: 40px;
      background: #ddd;
      .bread{
        width: 80%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        margin: 0px auto;
        >.el-breadcrumb{
          height: 40px;
          line-height: 40px;
        }
      }
    }
  .header{
    height: 78px;
    line-height: 78px;
    background: #d9e1eb;
    header{
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content:space-between;
      align-items: center;
      span{
        font-size: 18px;
        color:#052241;
        .icon-menu{
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url('../../assets/manage/menu.png') no-repeat center;
          vertical-align: middle;
          margin-right: 10px;
          cursor: pointer;
        }
      }
      .search_box{
        width: 30%;
        height: 36px;
        display: flex;
        justify-content:space-between;
        align-items: center;
        box-sizing: border-box;
        border:1px solid #2281e9;
        background: #fff;
        .el-input{
          input{
            // border:none !important;
          }
        }
        .icon-search{
          width: 44px;
          height: 26px;
          background: url('../../assets/search.png') no-repeat center;
          margin-left: 2px;
          border-left: 1px solid #2281e9;
          cursor: pointer;
        }
      }

    }
  }
  .tag-list{
    width: 80%;
    margin: 0 auto;
    font-size: 16px;
    color:#052241;
    dt{
      line-height: 63px;
      background: #eff1f6;
      display: flex;
      justify-content:space-between;
      .el-select{
        width: 20%;
      }
      .tag-name{
        width: 20%;
        text-align: center;
        border-right: 1px solid #dbdfe6;
        box-sizing: border-box;
      }  
      .tag-desc{
        flex:1;
        text-align: center;
      }
    }
    dd{
      line-height: 63px;
      display: flex;
      justify-content:space-between;
      padding: 11px 0 10px;
      border:1px solid #fff;
      cursor: pointer;
      position: relative;
      
      &:hover{
        border-color: #bccbdb;
        box-shadow: 0 0 5px 0px #bccbdb;
        z-index: 1;
      }
      &:nth-of-type(odd){
        background: #fcfcfc;
      }
      &:nth-of-type(even){
        background: #f8f8f8;
      }
      span{
        text-align: center;
        height: 43px;
        line-height: 43px;
      }
      .tag_name{
        width: 20%;
        border-right: 1px solid #e1e5e9;
        box-sizing: border-box;
      }
      .tag_desc{
        flex:1;
        padding: 0 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .tag-detail{
    width: 80%;
    margin: 1px auto;
    .detail_top{
      display: flex;
      justify-content:space-between;
      line-height: 63px;
      background: #eff1f6;
      color:#545454;
      font-size: 16px;
      span{
        width: 145px;
        height: 34px;
        background: #fff;
        align-self:center;
        text-align: center;
        border-radius: 3px;
        line-height: 34px;
        margin-left: 20px;
        cursor: pointer;
        .icon-back{
          display: inline-block;
          width: 8px;
          height: 16px;
          background: url('../../assets/home/app_back.png') no-repeat center;
          vertical-align: middle;
          margin-right: 16px;

        }
      }
      h3{
        font-size: 16px;
        color:#545454;
        flex:1;
        text-align: center;
      }
    }
    .detail_content{
      padding: 18px 86px;
      background: #eff1f6;
      margin-top: 6px;
      .tag{
        position: relative;
        height: 48px;
        line-height: 48px;
        span{
          background: #fff;
          display: inline-block;
          height: 34px;
          line-height: 34px;
          border:1px solid #1278e7;
          font-size: 16px;
          color:#0069dc;
          border-radius: 3px;
          padding: 0px 16px;
        }
        .icon-edit{
          position: absolute;
          width: 28px;
          height: 28px;
          background: url('../../assets/lawtag/edit.png') no-repeat center;
          right: 0;
          top: 0;
          cursor: pointer;
        }
        .icon-save{
          position: absolute;
          width: 28px;
          height: 28px;
          background: url('../../assets/lawtag/save.png') no-repeat center;
          right: 0;
          top: 0;
          cursor: pointer;
        }
      }
      textarea{
        border:0 none;
        width: 100%;
        background: transparent;
        font-size: 16px;
        color:#545454;
        line-height: 24px;
        height: 88px;
        padding-top: 10px;
        margin-left: 0;
        padding-left: 0;
        padding-right: 34px;
      }
    }
    .detail_actions{
      display: flex;
      justify-content:space-between;
      margin-top: 20px;
      // 标签列表
      .tags{
        width: 33%;
        border:1px solid #2281e9;
        dt{
          display: flex;
          justify-content:space-between;
          line-height: 52px;
          background: #2281e9;
        }
        dd{
          height: 460px;
          overflow-y: auto;
          margin-bottom: -1px;
          p{
            line-height: 51px;
            color:#006de5;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #2281e9;
            cursor: pointer;
            &:hover{
              background: #67a6ec;
              color: #fff;
            }
          }
        }
      }
      .actions{
        width: 60%;
        margin-top: 36px;
        .list-item{
          position: relative;
          display: inline-block;
          .tag{
            padding: 0 10px;
            line-height: 36px;
            display: inline-block;
            border:1px solid #1278e7;
            border-radius: 3px;
            margin-bottom: 10px;
            font-size: 16px;
            color:#1278e7;
            text-align: center;
            cursor: pointer;
            
          }
          .label{
            margin: 0 20px;
            width: 25px;
            height: 22px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            font-size: 0;
            cursor: pointer;
            background-position: center;
            background-repeat: no-repeat;
            // 且
            &.and{
              background-image: url('../../assets/common/and.png');
            }
            // 属于
            &.belongto{
              background-image: url('../../assets/common/belongto.png');
            }
            // 是
            &.equal{
              background-image: url('../../assets/common/equal.png');
            }
            // 相关
            &.related{
              background-image: url('../../assets/common/related.png');
            }
            // 推导
            &.infer{
              background-image: url('../../assets/common/infer.png');
            }
            // 或
            &.or{
              background-image: url('../../assets/common/or.png');
            }
          }
          &:hover,&.hover{
            .tag{
              font-size: 20px;
              border-color: #F60062;
              min-width: 150px;
            }
            .tip{
              opacity: 1;
            }
            .label{
              color: #F60062;
              border:2px solid #F60062;
              padding:9px 10px;
              top: 0;
              min-width: 60px;
            }
          }
          .tip{
            position: absolute;
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 100%;
            bottom:100%;
            left: 0;
            border-color: #000;
            opacity: 0;
            span{
              display: inline-block;
              width: 30px;
              height: 30px;
              margin: 0 5px;
              cursor: pointer;
              background: url('../../assets/r3/edit.png') no-repeat center;
              font-size: 0;
              &:hover,&.hover{
                background-image: url('../../assets/r3/edit2.png');
              }
              &:last-child{
                background-image: url('../../assets/r3/delete.png');
                &:hover,&.hover{
                  background-image: url('../../assets/r3/delete2.png');
                }
              }
            }
          }
          
        }
        .tag-desc{
          margin: 50px 0 35px;
          textarea{
            width: 100%;
            height: 218px;
            margin-left: 0;
            background: #f8f8f8;
            line-height: 24px;
          }
        }
        .save{
          margin-left: 20px;
          width: 79px;
          height: 36px;
          background: url('../../assets/layer/save.png') no-repeat center;
          font-size: 0;
          border: 0 none;
          &:hover{
            background-image: url('../../assets/layer/save_hover.png');
          }
        }
      }
    }
    .tagsline{
      margin-top: 20px;
      header{
        line-height: 50px;
        background: #e7ebf0;
        display: flex;
        justify-content:space-between;
        nav{
          font-size: 18px;
          &.left{
            span{
              display: inline-block;
              height: 100%;
              padding: 0 16px 0 40px;
              cursor: pointer;
              border-right: 1px solid transparent;
              &.on{
                border-right: 1px solid #016FE7;
                color:#016fe7;
                .icon_tab1{
                        background-image: url('../../assets/r3/p1_2.png');
                      }
                      .icon_tab2{
                        background-image: url('../../assets/r3/p2_2.png');
                      }
              }
              i{
                      display: inline-block;
                      width: 24px;
                      height: 100%;
                      vertical-align: middle;
                      margin-right: 16px;
                      background: url('../../assets/r3/p1_1.png') no-repeat center;
                      &.icon_tab2{
                        background-image: url('../../assets/r3/p2_1.png');
                      }
                    }
            }
          }
          &.right{
            color:#6e7175;
            width: 20%;
            text-align: center;
            border-left: 1px solid #c3cad2;
          }
        }
      }
      ul{
        li{
          margin-top: 20px;
          border-bottom: 1px dashed #dcdcdc;
          .list{
            display: flex;
            justify-content:space-between;
            align-items:center;
            padding: 30px 0;
            .left{
              margin-left: 40px;
            }
            .right{
              margin-left: 20px;
              width: 20%;
              text-align: center;
              border-left: 1px solid #e0e4e8;
              span{
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: inline-block;
                margin: 0 20px;
                font-size: 0;
                background-repeat: no-repeat;
                background-position: center;
                &.edit{
                  background-image:url('../../assets/layer/edit.png');
                  &:hover{
                    background-image: url('../../assets/layer/edit_hover.png');
                  } 
                }
                &.copy{
                  background-image:url('../../assets/layer/copy.png'); 
                  &:hover{
                    background-image: url('../../assets/layer/copy_hover.png');
                  } 
                }
                &.del{
                  background-image: url('../../assets/layer/delete.png');
                  &:hover{
                    background-image: url('../../assets/layer/del_hover.png');
                  } 
                }
              }
            }
          }
          .edit-info{
            font-size: 14px;
            color:#6d7468;
            // line-height: 48px;
            margin-left: 40px;
            margin-bottom: 38px;
          }
          
        }
      }
      .tag{
        padding: 0 10px;
        line-height: 36px;
        display: inline-block;
        border:1px solid #1278e7;
        border-radius: 3px;
        margin-bottom: 10px;
        font-size: 16px;
        color:#1278e7;
        text-align: center;
        cursor: pointer;
        
      }
      .label{
        margin: 0 20px;
        width: 25px;
        height: 22px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        font-size: 0;
        cursor: pointer;
        background-position: center;
        background-repeat: no-repeat;
        // 且
        &.and{
          background-image: url('../../assets/common/and.png');
        }
        // 属于
        &.belongto{
          background-image: url('../../assets/common/belongto.png');
        }
        // 是
        &.equal{
          background-image: url('../../assets/common/equal.png');
        }
        // 相关
        &.related{
          background-image: url('../../assets/common/related.png');
        }
        // 推导
        &.infer{
          background-image: url('../../assets/common/infer.png');
        }
        // 或
        &.or{
          background-image: url('../../assets/common/or.png');
        }
      }
      #tab2{
        position: relative;
        height: 800px;
      }
      .pagination{
        margin: 20px 0;
        .el-pagination{
          width: 100%;
          margin-left: 0;
        }
      }
    }
  }
</style>
<style lang="less">
  #riskAss{
    .header{
      .el-input__inner{
        border:0 none;
        height: 32px;
      }
    }
    .tag-list{
      dt{
        .el-select{
          border-right: 1px solid #dbdfe6;
          .el-input__inner{
            border:0 none;
            color:#052241;
            font-size: 16px;
            background: transparent;
            text-align: center;
          }
          input::-webkit-input-placeholder { /* WebKit browsers*/
            color:#052241;
          }
          input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
            color:#052241;
          }
          input::-moz-placeholder {  /* Mozilla Firefox 19+*/
            color:#052241;
          }
          input:-ms-input-placeholder { /* Internet Explorer 10+*/
            color:#052241;
          }
          .el-input__icon{
            margin-right: 110px;
            color:#2f86e3;
          }
        }
        
      }
      .pagination{
        margin-top: 20px;
        .el-pagination{
          width: 100%;
        }
      }
        
    }
    .detail_actions{
      // 标签列表
      .tags{
        .el-input__inner{
          border:0 none;
        }
        .el-select{
          .el-input{
            .el-input__inner{
              background: transparent;
              text-align: right;
              font-size: 18px;
              color:#fff;
            }
            input::-webkit-input-placeholder { /* WebKit browsers*/
            color:#fff;
            }
            input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
              color:#fff;
            }
            input::-moz-placeholder {  /* Mozilla Firefox 19+*/
              color:#fff;
            }
            input:-ms-input-placeholder { /* Internet Explorer 10+*/
              color:#fff;
            }
            .el-input__icon{
              color:#daecff;
            }
          }
        }
        dt > .el-input{
          margin: 0 15px;
          .el-input__inner{
              background: #0053ae;
              border-radius: 30px;
              color: #fff;
              font-size: 14px;
              padding-left: 15px;
          }
        }
      }
    }
  }
</style>