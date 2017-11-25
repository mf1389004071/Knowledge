<template>
  <div class="tagDetail">
    <i class="saveNewTag"  @click="concernEditTag"></i>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="新建标签基本信息" name="1">
        <div class="tagDetailBuild">
          <el-form :label-position="labelPosition" label-width="100px" :model="newTagData" :rules="addTagrules" ref="newTagData">
            <el-form-item label="标签名称" prop="zh_name">
              <el-input v-model="newTagData.zh_name" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="法律文本">
              <el-tag
                :key="item.id"
                :closable="true"
                :close-transition="false"
                @close="handleCloseLaws(item.topic)"
                v-for="item in newTagData.laws"
              >
                {{item.value}}
              </el-tag>
              <el-select
                style="width: 80%"
                v-model="inputKeyWordsOfLaws"
                placeholder="请输入关键字搜索法律文本"
                filterable
                remote
                :remote-method="getFalvOptions"
                @change="selectLaws"
              ><el-option
                v-for="item in lawWithKeywords"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法律分类">
              <el-select
                v-model="value2"
                filterable
                @change="selectLawCategory"
                placeholder="请选择法律分类">
                <el-option
                  v-for="item in lawCategory"
                  :key="item.id"
                  :label="item.zh_name"
                  :value="item.zh_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提取方法">
              <el-select
                v-model="value3"
                filterable
                @change="selectType"
                placeholder="请选择提取方法类">
                <el-option
                  v-for="item in getMethods"
                  :key="item.id"
                  :label="item.zh_name"
                  :value="item.zh_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签案由">
              <el-tag
                :key="item.id"
                :closable="true"
                :close-transition="false"
                @close="handleCloseCauses(item)"
                v-for="item in detailTagCause"
                style="margin: 10px;"
              >
                {{item.name}}
              </el-tag>
              <el-select
                style="width: 200px; display: block"
                v-model="inputKeyWordsOfCauses"
                placeholder="请输入关键字搜索案由"
                filterable
                remote
                :remote-method="getFalvOptions2"
                @change="selectCauses"
              ><el-option
                v-for="item in getCasesWithKeywords"
                :key="item.id"
                :label="item.zh_name"
                :value="item.zh_name">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词">
              <el-tag
                :key="key"
                v-for="key in newTagData.keywords"
                :closable="true"
                :close-transition="false"
                @close="handleClose(key)"
              >
                {{key}}
              </el-tag>
              <el-input
                class="input-new-tag"
                style="width: 200px"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加关键字</el-button>
            </el-form-item>
            <el-form-item label="标签描述">
              <el-input placeholder="请输入标签描述..." v-model="newTagData.description" style="height: 40px; width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="口语化描述">
              <el-input v-model="newTagData.colloquial_description" style="width: 80%"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="新建标签规则" name="2">
        <div class="noRules" v-if="!newTagData.rules || newTagData.rules.length == 0">
          <div>暂无规则</div>
        </div>
        <div v-else v-for="(elem,index) in newTagData.rules" style="border-bottom: 1px dashed #666">
          <span>规则{{index+1}}</span>
          <div v-for="item in elem">
            <div class="tagRules" v-if="item.id == 'doc_type'"><span>文书类型</span><p>{{item.value}}</p></div>
            <div class="tagRules" v-if="item.id == 'sentence'"><span>句式</span><p>{{item.value}}</p></div>
            <div class="tagRules" v-if="item.id == 'para'"><span>段落</span><p>{{item.value}}</p></div>
          </div>
        </div>
        <i class="addRules" @click="addRuleDialog = true"></i>
        <i class="tagRulesEdit"></i>
      </el-collapse-item>

    </el-collapse>
    <el-dialog class="tree-dialog" title="法律文本树" v-model="rulesTreeVisible">
      <div class="tree">
        <my-tree ref="treeChild"></my-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rulesTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConcern">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="rule-dialog" :modal="editTagDialogModal" title="标签新增规则" v-model="addRuleDialog">
      <el-form :model="addRulesTemp">
        <el-form-item label="文书类型" :label-width="editTagLabelWidth">
          <el-select
            v-model="value4"
            @change="selectDoctype"
            clearable
          >
            <el-option
              v-for="item in getDocType"
              :key="item._id"
              :label="item.zh_name"
              :value="item.zh_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="段落" :label-width="editTagLabelWidth">
          <el-select
            v-model="value5"
            @change="selectParams"
            clearable
          >
            <el-option
              v-for="item in getDocParas"
              :key="item._id"
              :label="item.zh_name"
              :value="item.zh_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="句式" :label-width="editTagLabelWidth">
          <el-input v-model="addRulesSetences" style="width: 300px" @change="getInputRules"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTagDialog = false">取 消</el-button>
        <el-button type="primary" @click="concernAddRules">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from '../../js/axios-api.js';
  import myTree from '../LawTag/treeNode.vue';
  export default {
    data() {
      return {
        labelPosition: 'right',
        dialogVisible: false,
        detailTagCause: [],
        //新建标签需要的一些变量
        activeNames: ['1'],
        // 法律体系相关
        inputKeyWordsOfLaws: '',
        lawWithKeywords: [],
        // 添加规则弹窗的状态
        addRuleDialog: false,
        addRulesTempArray:[],
        addRulesTemp:{
          id: '',
          value: '',
          name: ''
        },
        addTagrules: {
          zh_name: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
          ]
        },
        getDocType: [],
        getDocParas: [],
        addRulesSetences: '',
        // 筛选标签列表的参数
        refreshParams: {},
        // 关键字
        inputVisible: false,
        inputValue: '',
        tagKeywords: [],
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        // 所有标签
        tags: [],
        // 法律分类
        lawCategory: [],
        // 提取方法
        getMethods: [],
        // 案由
        getCases: [],
        input5: '',
        // 搜索标签的关键字
        tableState: 1,
        nameProp:[{
          required: true
        }],
        inputKeyWords: '',
        currentPage: 1,
        smallPage: true,
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
        totalTags: 0,
        inputKeyWordsOfCauses: '',
        getCasesWithKeywords: [],
        keepZhName: '',
        newTagId: '',
        // 编辑标签信息的弹窗
        editTagDialog: false,
        editTagDialogModal: false,
        editTagLabelWidth: '120px',
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
          rules: []
        },
        input:'',
        rulesValue: '',
        rulesTreeVisible: false,
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
      }
    },
    components:{
      myTree
    },
    methods:{
      // 基本数据方法
      getAllDocTypes(){
        axios.get(this.$store.state.TagUrl + '/api/tag/doc_types').then((method) => {
          this.getDocType = method.data.data;
        })
      },
      getAllParams(){
        axios.get(this.$store.state.TagUrl + '/api/tag/paras').then((method) => {
          this.getDocParas = method.data.data;
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
      getAllLawCategorys(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_categorys').then((res) => {
          this.lawCategory = res.data.data;
        })
      },
      getAllMethods(){
        axios.get(this.$store.state.TagUrl + '/api/tag/extract_methods').then((method) => {
          this.getMethods = method.data.data;
        })
      },
      // 添加标签基本信息的方法
      concernEditTag(){
        let temp = [];
        this.newTagData.laws.map((item) => {
          temp.push(item.id);
        });
        this.keepZhName = this.newTagData.zh_name;
        const params = {
          colloquial_description: this.newTagData.colloquial_description,
          zh_name: this.newTagData.zh_name,
          description: this.newTagData.description,
          law_type: this.newTagData.law_type.id,
          extract_type: this.newTagData.extract_type.id,
          keywords: JSON.stringify(this.newTagData.keywords),
          laws: JSON.stringify(temp),
          extracts: JSON.stringify(this.newTagData.extracts),
        };
        axios.post(this.$store.state.TagUrl + '/api/tag/tags?axios=1', params)
          .then((res) => {
            if (res.data.code === 2){
              this.$message.warning(res.data.msg);
            } else if(res.data.code === 0){
              this.$message.success('成功新建标签！', res);
              // 精确查找刚刚新建的标签
              axios.get(this.$store.state.TagUrl + '/api/tag/tags?zh_name=' + this.keepZhName).then(res => {
                if(res.data.code === 0){
                  this.newTagId = res.data.data[0].id;
                  console.log(this.newTagId);
                }else{
                  this.$message.error(res.data.msg);
                }

              })
            }
          }).catch((err) => {
          console.log(err)
        });
        this.value2 = '';
        this.value3 = '';
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
      getFalvOptions(val){
        this.inputKeyWordsOfLaws = val;
        axios.get(this.$store.state.TagUrl + '/api/codes?page_size=100&keyword='+ this.inputKeyWordsOfLaws).then((laws) => {
          let data = laws.data.data;
          this.lawWithKeywords = [];
          data.map((item) => {
            let temp = {
              id: '',
              value: '',
            }
            temp.id = item.id;
            temp.value = item.topic;
            this.lawWithKeywords.push(temp);
          })
        })
      },
      getFalvOptions2(val){
        this.inputKeyWordsOfCauses = val;
        axios.get(this.$store.state.TagUrl + '/api/tag/causes?page_size=50&keyword=' + this.inputKeyWordsOfCauses).then((cases) => {
          let data = cases.data.data;
          this.getCasesWithKeywords = data;
        });
        this.inputKeyWordsOfCauses = '';
      },
      handleConcern(){
        const selectNode = this.$refs.treeChild.getSelectNode();
        const ruleTemp = {
          id: selectNode.id,
          name: selectNode.topic
        };
        this.newTagData.laws.push(ruleTemp);
        this.rulesTreeVisible = false;
      },
      handleClose(tag) {
        this.newTagData.keywords.splice(this.newTagData.keywords.indexOf(tag), 1);
      },
      handleCloseLaws(law) {
        const temp = this.newTagData.laws;
        for(let i = 0; i < temp.length; i+=1){
          if(temp[i].topic === law ){
            this.newTagData.laws.splice(i, 1);
          }
        }

      },
      handleCloseCauses(item){
        console.log(item);
        const deleteid = item.id;
        console.log(this.detailData.id);
        const params = {
          cause_ids: JSON.stringify([item.id])
        };
        axios.delete(this.$store.state.TagUrl + '/api/tag/tags/'+ this.detailData.id + '/causes?axios=1', {params}).then(res => {
          if(res.data.code === 0){
            this.$message.success('删除案由成功!');
            const length = this.detailData.causes.length;
            for (let i = 0; i < length; i += 1){
              if(this.detailData.causes[i].id === deleteid){
                this.detailData.causes.splice(i,1);
              }
            }
            this.detailData.causes.map(item => {
              if(item.id === deleteid){

              }
            })
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.newTagData.keywords.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      selectCauses(val){
        if(val){
          const temp = {
            id: '',
            name: ''
          };
          this.getCasesWithKeywords.map(item => {
            if(item.zh_name === val){
              temp.id = item.id;
              temp.name = item.zh_name;
              this.detailTagCause.push(temp);
            }
          });
        }
      },
      selectLaws(val){
        if(val){
          this.inputKeyWordsOfLaws = val;
          axios.get(this.$store.state.TagUrl + '/api/codes?page_size=100&keyword='+ this.inputKeyWordsOfLaws).then((laws) => {
            let data = laws.data.data;
            this.lawWithKeywords = [];
            data.map((item) => {
              let temp = {
                id: '',
                value: '',
              }
              temp.id = item.id;
              temp.value = item.topic;
              this.lawWithKeywords.push(temp);
            })
          });
          this.lawWithKeywords.map(item => {
            if(item.id === val){
              this.newTagData.laws.push(item);
            }
          });
        }
      },
      selectLawCategory(val){
        this.lawCategory.map(item => {
          if(item.zh_name === val){
            this.newTagData.law_type.name = val;
            this.newTagData.law_type.id = item.id;
          }
        });
        console.log('4444', this.newTagData.law_type);
      },
      selectType(val){
        if(val === '推理型'){
          this.newTagData.extract_type.id = 'fbf0c871e3fdfda675825bcf135a467e';
        } else if (val === '解析型'){
          this.newTagData.extract_type.id = 'fe0d69f67d547f3e6c760f55746af5bb';
        } else if( val === '标注型'){
          this.newTagData.extract_type.id = '69f5e892091f86e841ee422f7d2b7c0f';
        }
        this.newTagData.extract_type.name = val;
        let obj = {};
        obj = this.getMethods.find((item) => {
          return item.extract_type === val;
        });
      },
      // 添加规则的方法
      concernAddRules(){
        const params = {
          para: '',
          sentence: '',
          doc_type: ''
        };
        let paramArr = [];
        this.addRulesTempArray = this.addRulesTempArray.splice(0, 3);
        let arr = [];
        arr.push(this.addRulesTempArray);
        this.newTagData.rules.push(this.addRulesTempArray);
        if(this.newTagData.rules)
          arr = arr.concat(this.newTagData.rules);
        for(let i = 0; i < arr.length; i ++){
          let te = arr[i];
          for(let j = 0; j < te.length; j ++){
            if(te[j].id === 'doc_type')
              params.doc_type = te[j].value;
            if(te[j].id === 'para')
              params.para = te[j].value;
            if (te[j].id === 'sentence')
              params.sentence = te[j].value;
          }
          paramArr.push(params);
        }
        this.addRulesTempArray = [];
        let param = {
          rules: JSON.stringify(paramArr)
        };
        axios.put(this.$store.state.TagUrl + this.newTagData.url + '?axios=1', param)
          .then((res) => {
            this.$message.success('修改成功！', res);
          }).catch((err) => {
          console.log(err)
        });
        param = [];
        this.addRuleDialog = false;

      },
      getInputRules(val){
        this.addRulesTemp.value = this.addRulesSetences;
        this.addRulesTemp.name = this.addRulesSetences;
        this.addRulesTemp.id = 'sentence';
        this.addRulesTempArray.push(this.addRulesTemp);
      },
      selectDoctype(val){
        const doctype = {
          id : 'doc_type',
          name: val,
          value: val
        }
        this.addRulesTempArray.push(doctype);
      },
      selectParams(val){
        const paras = {
          id : 'para',
          name: val,
          value: val
        }
        this.addRulesTempArray.push(paras);
      },
    },
    mounted(){
      this.getAllLawCategorys();
      this.getAllMethods();
      this.getAllDocTypes();
      this.getAllParams();
    },
    watch: {
      inputKeyWords: function () {
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.tableData = this.dealData(tags.data.data);
        })
      },
      newTagId: function () {
        console.log(this.detailTagCause);
        let ids = [];
        this.detailTagCause.map(item => {
          ids.push(item.id);
        });
        const params = {
          cause_ids: JSON.stringify(ids)
        };
        axios.post(this.$store.state.TagUrl + '/api/tag/tags/' + this.newTagId+ '/causes?axios=1', params).then(res => {
          if(res.data.code === 0) {
            this.$message.success('添加标签成功！');
            setTimeout(function () {
              this.dialogVisible = false;
              location.reload();
            }, 1000);
          }else{
            this.$message.error(res.data.msg);
          }
        });
      }
    }
  }
</script>
<style lang="less">
  .tagDetail{
    position: relative;
    margin-top: 0px;
    .tagDetailTitle{
      height: 55px;
      line-height: 55px;
      background-color: #d3dae3;
      position: relative;
      text-align: center;
      .saveDetails{
        display: block;
        width: 28px;
        height: 28px;
        background: url('../../assets/lawtag/save.png') no-repeat center;
        position: absolute;
        top:15px;
        right: 35px;
        &:hover{
          cursor: pointer;
        }
      }
      >span{
        display: inline-block;
        font-size: 18px;
        color: #fff;
        font-weight: bold;
        margin: 1px auto;
      }
    }
    .el-collapse{
      .el-collapse-item{
        .noRules{
          >div{
            font-size: 14px;
            color: #666;
            font-weight: 600;
            text-align: center;
            margin: 10px auto;
            border-bottom: 1px dashed #666;
          }
        }
        .addRules{
          display: block;
          width: 116px;
          height: 36px;
          background: url('../../assets/lawtag/rules.png') center no-repeat;
          margin: 10px auto;
          &:hover{
            cursor: pointer;
          }
        }
        .el-collapse-item__header{
          height: 50px;
          font-weight: 600;
          color: #666;
          background: #e5eaf0!important;
          >i{
            width: 28px;
            height: 28px;
            float: right;
            margin-top: 10px;
            margin-right: 30px;
            background: url('../../assets/lawtag/open.png') no-repeat center;
            &::before{
              content: none;
            }
          }
        }
        .el-collapse-item__wrap{
          .el-collapse-item__content{
            .tagDetailBuild{
              margin-bottom: 10px;
              border-bottom: 1px dashed #999;
              position: relative;
              .tagRulesTitle{
                display: block;
                font-size: 18px;
                font-weight: 600;
                color: #999;
                margin-left: 50%;
                margin-top: 10px;
                margin-bottom: 10px;
              }
              .el-form{
                width: 75%;
                margin: 0px auto;
                .el-form-item{
                  >label{
                    color: #999;
                  }
                  .el-form-item__content{
                    .el-button{
                      margin: 10px auto;
                    }
                  }
                }
              }
            }
            .tagRules{
              width: 100%;
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              margin-bottom: 20px;
              >span{
                font-weight: 600;
                display: inline-block;
                width: 28%;
                float: left;
                text-align: right;
                color: #999;
              }
              >p{
                display: inline-block;
                font-weight: 500;
                margin-left: 42px;
                width: 65%;
                float: left;
                text-align: left;
                color: #666;
                max-width: 500px;
              }
            }
          }
        }
      }
    }
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
    .tree-dialog{
      .el-dialog{
        top: 5%!important;
        width: 80%;
        height: 85%;
        .el-dialog__body{
          width: 100%;
          height: 88%;
          .tree{
            height: 100%;
          }
        }
      }
    }
    .rule-dialog{
      .el-dialog{
        top: 20%!important;
        width: 30%;
        height: 30%;
        .el-dialog__body{
          width: 100%;
          height: 60%;
        }
      }
    }
  }
</style>
