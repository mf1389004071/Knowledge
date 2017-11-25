<template>
  <div class="container">
    <div class="search_box">
      <el-input v-model="inputKeyWords" placeholder="请输入关键字搜索标签"></el-input>
      <i @click="search"></i>
    </div>
    <div class="mergeContainer">
      <div class="tagList">
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="zh_name"
              label="标签名"
              min-width="180">
            </el-table-column>
          </el-table>
        </div>
        <div class="pagnation">
          <el-pagination
            :small="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
            :page-size="this.pager.page_size"
            layout=" total, prev, next, sizes"
            :total="totalTags"
            >
          </el-pagination>
        </div>
      </div>
      <div class="tagMerge">
        <el-table
          :data="selectedData"
          style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="标签名称">
                  <span>{{ props.row.zh_name }}</span>
                </el-form-item>
                <el-form-item label="法律分类">
                  <span>{{ props.row.law_type.name ? props.row.law_type.name : '无' }}</span>
                </el-form-item>
                <el-form-item label="提取方法">
                  <span>{{ props.row.extract_type.name ? props.row.extract_type.name : '无' }}</span>
                </el-form-item>
                <el-form-item label="标签描述">
                  <span>{{ props.row.description ? props.row.description : '无' }}</span>
                </el-form-item>
                <el-form-item label="口语化描述">
                  <span>{{ props.row.colloquial_description ? props.row.colloquial_description : '无' }}</span>
                </el-form-item>
                <el-form-item label="案由">
                  <el-tag
                    v-if="props.row.causes.length > 0"
                    v-for="item in props.row.causes"
                    style="margin: 5px 5px"
                    type="primary"
                  >{{item.name}}
                  </el-tag>
                </el-form-item>
                <el-form-item label="关键字">
                  <el-tag
                    v-if="props.row.keywords.length > 0"
                    v-for="item in props.row.keywords"
                    style="margin: 5px 5px"
                    type="primary"
                  >{{item}}
                  </el-tag>
                </el-form-item>
                <el-form-item label="法律文本">
                  <span>{{ props.row.laws.name }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="标签名称"
            prop="zh_name">
          </el-table-column>
          <el-table-column
            label="法律分类"
            prop="law_type.name">
          </el-table-column>
          <el-table-column
            label="提取方法"
            prop="extract_type.name">
          </el-table-column>
        </el-table>
        <div class="tagDetail">
          <build-tag></build-tag>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        title="提示"
        :show-close="false"
        :visible.sync="dialogVisible"
        size="tiny">
        <span>确定要合并标签吗？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="mergeTagsChains">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import axios from '../../js/axios-api.js';
  import myTree from '../LawTag/treeNode.vue';
  import buildTag from './buildTag.vue';
  export default {
    data() {
      return {
        dialogVisible: false,
        inputKeyWords: '',
        currentPage: 1,
        tableData: [{
          description: '',
          keywords: [''],
          laws: [{
            name: '',
            id: ''
          }],
          law_type: {
            id: '',
            name: ''
          },
          colloquial_description: '',
          causes: [{
            id: '',
            name: ''
          }],
          zh_name: '',
          id: '',
          extract_type: {
            id: '',
            name: ''
          },
          rules: ['']
        }],
        selectedData: [],
        newTagData: {
          description: '',
          keywords: [],
          laws: [],
          law_type: {
            id: '',
            name: ''
          },
          colloquial_description: '',
          causes: [],
          zh_name: '',
          id: '',
          extract_type: {
            id: '',
            name: ''
          },
          rules: ['']
        },
        pager: {},
        totalTags: 0,
        newTagId: ''
      }
    },
    methods: {
      mergeTagsChains(){
        const old_ids = [];
        this.selectedData.map(item => {
          old_ids.push(item.id);
        })
        console.log(old_ids);
        const params = {
          new_id: this.newTagId,
          old_ids: JSON.stringify(old_ids)
        }
        axios.post(this.$store.state.TagUrl + '/api/tag/chains/update?axios=1', params).then(res => {
          console.log(res);
          if(res.data.code === 0){
            this.$message.success('成功合并标签！');
            this.dialogVisible = false;
            location.reload();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      getAllTags(){
        axios.get(this.$store.state.TagUrl + '/api/tag/tags').then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.totalTags = this.pager.max_page * this.pager.page_size;
          this.tags = tags.data.data;
          this.tableData = this.dealData(this.tags);
        })
      },
      dealData(tags){
        for (let i = 0; i < tags.length; i++) {
          if (!tags[i].laws) {
            tags[i].laws = [];
          }
          if (!tags[i].law_type || !tags[i].law_type.name) {
            tags[i].law_type = {
              id: '',
              name: ''
            }
          }
          if (!tags[i].extract_type || !tags[i].extract_type.name) {
            tags[i].extract_type = {
              id: '',
              name: ''
            }
          }
          if (tags[i].keywords.length === 0 || tags[i].keywords[0] === '') {
            tags[i].keywords = [];
          }
          if (!tags[i].description) {
            tags[i].description = '';
          }
          if (!tags[i].colloquial_description) {
            tags[i].colloquial_description = '';
          }
          if (!tags[i].causes) {
            tags[i].causes = [];
          }
        }
        return tags;
      },
      search(){
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.tableData = this.dealData(tags.data.data);
        })
      },
      handleSizeChange(val){
        this.pager.page_size = val;
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?page_size=' + this.pager.page_size).then((tags) => {
          this.tableData = this.dealData(tags.data.data);
        });
      },
      handleCurrentChange(val){
        this.pager.page = val;
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?page=' + this.pager.page).then((tags) => {
          this.tableData = this.dealData(tags.data.data);
        });
      },
      handleSelectionChange(val){
        this.selectedData = val;
      },
    },
    mounted(){
      this.getAllTags();
    },
    components:{
      myTree,
      buildTag
    },
    watch: {
      inputKeyWords: function () {
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.tableData = this.dealData(tags.data.data);
        })
      }
    }
  }
</script>
<style lang="less">
  .container{
    width: 100%;
    height: 100%;
    .search_box{
      height: 55px;
      line-height: 55px;
      margin-top: 120px;
      width: 89.7%;
      border: 2px solid #b8d0c4;
      position: fixed;
      top: -49px;
      left: 5%;
      background: #fff;
      display: flex;
      > i {
        display: inline-block;
        position: absolute;
        right: 0;
        width: 60px;
        height: 41px;
        margin: 7px 0;
        border-left: 1px solid #b8d0c4;
        background: url('../../assets/search/search3.png') no-repeat center;
        cursor: pointer;
      }
      .el-input {
        display: inline-block;
        height: 55px;
        line-height: 55px;
        position: absolute;
        .el-input__inner {
          border: none!important;
          font-size: 18px!important;
        }
      }
    }
    .mergeContainer{
      width: 90%;
      height: auto;
      min-height: 600px;
      margin: 110px auto 0px;
      .tagList{
        width: 18%;
        height: 90%;
        display: inline-block;
        background: #fff;
        margin: 40px 20px;
      }
      .pagnation{
        width: 100%;
        .el-pagination{
          width: 100%;
          margin-left: -15px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
      .tagMerge{
        width: 75%;
        height: 90%;
        min-height: 600px;
        background: #fff;
        float: right;
        display: inline-block;
        margin: 40px 20px;
        .tagDetail{
          position: relative;
          margin-top: 0px;
          .saveNewTag{
            z-index: 9999;
            display: block;
            position: absolute;
            width: 20px;
            height: 21px;
            top: 65px;
            right: 30px;
            background: url('../../assets/save.png') no-repeat center;
            &:hover{
              cursor: pointer;
            }
          }
        }
      .el-table__expanded-cell{
        >form{
          .el-form-item{
            margin-right: 30px;
            .el-form-item__label{
              font-size: 14px;
              color: #666;
              font-weight: 600;
            }
          }
        }
      }
      }
    }
  }
</style>
