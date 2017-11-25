<template>
  <div class="tagMaintain">
    <div class="tagMaintainTitle">
      <span>标签图谱</span>
    </div>
    <div class="tagfix_left">
      <div class="searchGroup">
        <div class="search_box2">
          <el-input v-model="inputKeyWords" placeholder="请输入关键字搜索标签"></el-input>
          <i @click="search"></i>
        </div>
        <div class="selectCaseTitle" @click="rulesTreeVisible = true">
          <span>法律框架</span>
        </div>
        <div class="selectCase">
          <el-select
            style="width: 100%"
            v-model="inputKeyWordsOfLaws"
            placeholder="请输入关键字搜索法律文本"
            filterable
            clearable
            remote
            :remote-method="getFalvOptions"
            @change="selectLaws"
          ><el-option
            v-for="item in lawWithKeywords"
            :key="item.id"
            :label="item.value"
            :value="item.value">
          </el-option>
          </el-select>
        </div>
      </div>
      <div class="tagListLeft">
        <el-table
          :data="tagListData"
          style="width: 100%; max-height: 680px; height: auto"
          border
          :empty-text="no_data_text"
          @row-click="clickRow"
        >
          <el-table-column
            prop="zh_name"
            label="标签名"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="tagListRight">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane label="基本信息" name="first">
            <tag-message></tag-message>
          </el-tab-pane>
          <el-tab-pane label="标签链" name="second">
            <tag-chain></tag-chain>
          </el-tab-pane>
          <el-tab-pane label="关联法条" name="third">关联法条</el-tab-pane>
          <el-tab-pane label="关联案例" name="fourth">关联案例</el-tab-pane>
          <el-tab-pane label="问题/答案" name="fifth">
            <answer></answer>
          </el-tab-pane>
          <el-tab-pane label="司法观点&法学文献" name="sixth">司法观点&法学文献</el-tab-pane>
          <el-tab-pane label="微信文章" name="seventh">微信文章</el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <el-dialog :modal="treeModal" title="法律文本树" v-model="rulesTreeVisible">
      <div class="tree">
        <my-tree></my-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rulesTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="rulesTreeVisible = false">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>
<script>
  import myTree from './treeNode.vue'
  import axios from '../../js/axios-api.js';
  import TagChain from './tagFixComponents/TagChain.vue';
  import TagMessage from './tagFixComponents/TagMessage.vue';
  import Answer from './tagFixComponents/Answer.vue';

  export default {
    data() {
      return {
        no_data_text: '数据加载中...',
        lawWithKeywords: [],
        inputKeyWordsOfLaws: '',
        // 标签图类型
        graphType: [],
        graphTypeValue: '',
        //标签组合
        chains: [],
        graphID:'',
        graphKeyWord: '',
        // 搜索标签的关键字
        inputKeyWords: '',
        treeModal: false,
        rulesTreeVisible: false,
        activeNames: ['1'],
        lawSelectValue: '',
        inputCaseKeyWord: '',
        select: '',
        getCases: [],
        tagListData: [],
        getLaws: [],
        graphName: '',
        activeName: 'first'
      }
    },
    components: {
      myTree,
      TagChain,
      TagMessage,
      Answer
    },
    methods:{
      clickRow(val){
        this.$store.state.tagData = {
          dataTag: val
        };
      },
      handleClickTab(tab, event){
      },
      search(){
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = this.pager.max_page * this.pager.page_size;
          this.tags = tags.data.data;
          for (let i = 0; i < this.tags.length; i++) {
            if (!this.tags[i].laws) {
              this.tags[i].laws = ['--'];
            }
            if (!this.tags[i].law_type || !this.tags[i].law_type.name) {
              this.tags[i].law_type = {
                id: '',
                name: ''
              }
            }
            if (!this.tags[i].extract_type || !this.tags[i].extract_type.name) {
              this.tags[i].extract_type = {
                id: '',
                name: ''
              }
            }
            if (this.tags[i].keywords.length === 0) {
              this.tags[i].keywords = ['--'];
            }
            if (!this.tags[i].description) {
              this.tags[i].description = '--';
            }
          }
          this.tableData = this.tags;
        })
      },
      // 标签
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
      getAllTags(){
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?page_size=100').then((tags) => {
          this.tagListData = this.dealData(tags.data.data);
        })
      },
      // 法律
      getAllLaws(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_systems?page_size=100').then((cases) => {
          this.getCases = cases.data.data;
        })
      },
      getFalvOptions(val){
        this.inputKeyWordsOfLaws = val;
        axios.get(this.$store.state.TagUrl + '/api/codes?page_size=50&keyword='+ this.inputKeyWordsOfLaws).then((laws) => {
          let data = laws.data.data;
          this.lawWithKeywords = [];
          data.map((item) => {
            let temp = {
              id: '',
              value: '',
            }
            this.law_id = item.id;
            temp.id = item.id;
            temp.value = item.topic;
            this.lawWithKeywords.push(temp);
          })
        });
      },
      selectLaws(val){
        let law_id = '';
        this.lawWithKeywords.map(item => {
          if(val === item.value){
            law_id = item.id;
          }
        });
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?law_id=' + law_id).then(res => {
          if(res.data.code === 0){
            this.tagListData = this.dealData(res.data.data);
          }else{
            this.$message.error(res.data.msg);
          }
        });
      },
    },
    mounted(){
      this.getAllTags();
      this.getAllLaws();
    },
    watch: {
      inputKeyWords: function () {
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.tags = tags.data.data;
          for (let i = 0; i < this.tags.length; i++) {
            if (!this.tags[i].laws) {
              this.tags[i].laws = ['--'];
            }
            if (!this.tags[i].law_type || !this.tags[i].law_type.name) {
              this.tags[i].law_type = {
                id: '',
                name: ''
              }
            }
            if (!this.tags[i].extract_type || !this.tags[i].extract_type.name) {
              this.tags[i].extract_type = {
                id: '',
                name: ''
              }
            }
            if (this.tags[i].keywords.length === 0) {
              this.tags[i].keywords = ['--'];
            }
            if (!this.tags[i].description) {
              this.tags[i].description = '--';
            }
          }
          this.tagListData = this.tags;
        })
      },
    }
  }
</script>
<style lang="less">
 .tagMaintain{
   width: 100.5%;
   height: 100%;
   margin-right: -6px;
   margin-top: -10px;
   .tagMaintainTitle{
     height: 55px;
     line-height: 55px;
     background-color: #d3dae3;
     position: relative;
     text-align: center;
     >span{
       display: inline-block;
       font-size: 18px;
       color: #fff;
       font-weight: bold;
       margin: 1px auto;
     }
   }
   .tagfix_left{
     display: inline-block;
     width: 25%;
     margin-top: 10px;
     .searchGroup{
       display: inline-block;
       width: 100%;
       margin: 10px auto;
       .search_box2{
         display: inline-block;
         width: 99%;
         .el-input{
           .el-input__inner{
             border: 1px solid #20acff;
             border-radius: 0px;
           }
         }
       }
       .selectCaseTitle{
         height: 36px;
         margin: 10px auto;
         display: inline-block;
         border: 1px solid #20acff;
         border-right: none;
         background-color: #fbfdff;
         width: 30%;
         >span{
           display: inline-block;
           width: 100%;
           height: 36px;
           font-size: 14px;
           color: #97A8BE;
           line-height: 36px;
           text-align: center;
         }
         &:hover{
           background: rgba(56, 118, 181, 0.2);
           cursor: pointer;
         }
       }
       .selectCase{
         width: 68%;
         display: inline-block;
         margin-left: -3px;
         border: 1px solid #20acff;
         .el-select{
           .el-input{
             >input{
               border: none;
             }
           }
         }
       }
       .selectCaseAndSearch{
         display: inline-block;
         margin-left: 10px;
         border: 1px solid #20acff;
         >span{
           color: #97A8BE;
           font-size: 14px;
           display: inline-block;
           margin: 1px 5px;
         }
         .el-select{
           .el-input{
             .el-input__inner{
               border: none;
               border-radius: 0px;
               border-left: 1px solid #20acff;
             }
           }
         }
       }
     }
     .tagListLeft{
       display: inline-block;
       width: 99%;
     }
   }
   .tagListRight{
     display: inline-block;
     width: 72.7%;
     margin-top: 20px;
     float: right;
     height: 700px;
     .el-collapse{
       .el-collapse-item{
         .el-collapse-item__header{
           height: 40px;
           font-weight: 600;
           color: #666;
           background: #e5eaf0;
           >i{
             width: 28px;
             height: 28px;
             float: right;
             margin-top: 5px;
             margin-right: 20px;
             background: url('../../assets/lawtag/open.png') no-repeat center;
             &::before{
               content: none;
             }
           }
         }
         .el-collapse-item__wrap{
           .el-collapse-item__content{
             width: 100%;
             padding: 0px 0px;
             min-height: 400px;
             height: auto;
             display: block;
             .tagChainSelect{
               width: 100%;
               height: 53px;
               background: #f2f2f2;
               .el-input{
                 width: 20%;
                 height: 35px;
                 margin: 9px 20px 9px 40px;
                 .el-input__inner{
                   border: none;
                   border-radius: 0px;
                 }
               }
               .el-select{
                 .el-input{
                   width: 100%;
                   margin: 9px 0px;
                   width: 200px;
                 }
               }
             }
             .no-tag{
               >i{
                 display: block;
                 width: 178px;
                 height: 202px;
                 margin: 50px auto;
                 background: url('../../assets/no_tag_chain.png') center no-repeat;
               }
             }
             .tagChainList{
               width: 100%;
               padding: 0px 0px;
               min-height: 400px;
               height: auto;
               .tagChainListTitle{
                 >span{
                   width: 100px;
                   height: 36px;
                   line-height: 36px;
                   font-size: 16px;
                   color: #666;
                   margin: 10px 20px 10px 40px;
                   display: inline-block;
                 }
                 >p{
                   display: inline-block;
                   height: 36px;
                   line-height: 36px;
                   font-size: 16px;
                   color: #666;
                   font-weight: 600;

                 }
               }
               .main_bottom{
                 width: 97%;
                 height: auto;
                 margin-left: 15px;
                 .el-tabs--border-card{
                   border:none;
                   box-shadow: none;
                   .el-tabs__header{
                     display: none;
                     .el-tabs__item{
                       font-size: 18px;
                       padding-left: 30px;
                       > span{
                         position: relative;
                         padding-left: 36px;
                       }
                       i{
                         display: inline-block;
                         position: absolute;
                         top:-1px;
                         left: 0;
                         width: 24px;
                         height: 24px;
                         background: url('../../assets/r3/p1_1.png') no-repeat center;
                         &.p2{
                           background-image: url('../../assets/r3/p2_1.png');
                         }
                       }
                       &.is-active{
                         background: #C7CED6;
                         color:#016FE7;
                         /* border-right-color:#016FE7; */
                         .p1{
                           background-image: url('../../assets/r3/p1_2.png');
                         }
                         .p2{
                           background-image: url('../../assets/r3/p2_2.png');
                         }
                       }
                     }
                   }
                   .el-tabs__content{
                     .el-tab-pane > ul{
                       margin-bottom: 50px;
                       li{
                         list-style: none;
                         min-height: 60px;
                         line-height: 60px;
                         border: 1px solid #D2D2D2;
                         padding:5px 15px;
                         background:#FAFAFA;
                         .content{
                           display: flex;
                           justify-content:space-between;
                           .left{
                             width: 79.3%;
                             padding-left: 15px;
                             /* border-right: 1px solid #1278E7; */
                             button{
                               background:#fff;
                               color: #1278E7;
                               border-radius:5px;
                               border: 1px solid #1278E7;
                               font-size: 16px;
                               margin-bottom: 20px;
                             }
                             .case{
                               color: #F7BA2A;
                               border: 1px solid #F7BA2A;
                             }
                             > span{
                               position: relative;
                               width:45px;
                               height:35px;
                               display: inline-block;
                               top: 8px;
                               cursor:pointer;
                             }
                             #and{
                               background: url('../../assets/lawtag/and.png') no-repeat center;
                             }
                             #infer{
                               background: url('../../assets/lawtag/infer.png') no-repeat center;
                             }
                             #belongto{
                               background: url('../../assets/lawtag/belong.png') no-repeat center;
                             }
                             #or{
                               background: url('../../assets/lawtag/or.png') no-repeat center;
                             }
                           }
                           .right{
                             width: 17.9%;
                             height: 112px;
                             line-height:42px;
                             text-align: center;
                             display: flex;
                             justify-content:space-around;
                             span{
                               width: 24px;
                               height: 100%;
                               font-size: 0;
                               cursor: pointer;
                               &.edit{
                                 background: url('../../assets/change.png') no-repeat center;
                                 &:hover{
                                   background-image: url('../../assets/structure/edit_hover.png');
                                 }
                               }
                               &.copy{
                                 background: url('../../assets/structure/copy.png') no-repeat center;
                                 &:hover{
                                   background-image: url('../../assets/structure/copy_hover.png');
                                 }
                               }
                               &.del{
                                 background: url('../../assets/r3/delete.png') no-repeat center;
                                 &:hover{
                                   background-image: url('../../assets/structure/del_hover.png');
                                 }
                               }
                             }
                           }
                         }
                         p{
                           border-top: 2px dotted #D2D2D2;
                           height: 48px;
                           line-height: 48px;
                           font-size: 14px;
                           color:#7B8895;
                           span{
                             margin: 0 18px;
                           }
                         }
                         & + li{
                           margin-top: 49px;
                         }
                       }

                     }
                   }

                 }
                 .no_tag_chain_icon{
                   >i{
                     display: block;
                     width: 178px;
                     height: 202px;
                     margin: 50px auto;
                     background: url('../../assets/no_tag_chain.png') no-repeat center;
                   }
                 }
               }
             }
           }
         }
       }
     }
   }
   .el-dialog__wrapper{
     .el-dialog{
       width: 70%;
       top: 10%;
       height: 80%;
       .el-dialog__body{
         width: 100%;
         height: 80%;
         .tree{
           height: 100%;
         }
       }
     }
   }
 }
</style>
