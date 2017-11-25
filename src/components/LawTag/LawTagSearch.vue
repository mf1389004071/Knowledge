<template>
  <div class="tagSearchContainer">
    <div class="search_box1">
      <el-input v-model="inputKeyWords" placeholder="请输入关键字搜索标签"></el-input>
      <i @click="search"></i>
    </div>
    <div v-show="status === 1">
      <div class="tagListTitle">
        <div class="title">
          <i id="tagListTitleIcon"></i><span>标签列表</span>
          <el-checkbox v-model="show_usual_tag" style="margin-left: 20px">只显示常用标签</el-checkbox>
        </div>
        <div class="preparation">
          <selectComponent :lawCategory="lawCategory" :getMethods="getMethods" :getCases="getCases" @sele="getTagsWithAllParams" :msg="selectPar"></selectComponent>
        </div>
        <div class="law_text">
          <el-select
            style="width: 250px"
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
        <div class="lawTreeSelect">
          <el-cascader
            :options="lawTreeData"
            v-model="lawTreeModel"
            placeholder="请按层级选择法律"
            :show-all-levels="false"
            change-on-select
            expand-trigger="click"
            clearable
          ></el-cascader>
        </div>
      </div>
      <div class="tagListTable">
        <div v-loading.body="loading" id="loading"></div>
        <div class="tableContainer">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="zh_name"
              label="标签名"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="law_type.name"
              label="法律分类"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="extract_type.name"
              label="提取方法"
              min-width="100">
            </el-table-column>
            <el-table-column
              label="法律文本"
              min-width="200">
              <template scope="scope">
                <div
                  v-if="tableLaws.length > 0"
                  style="margin: 5px 5px"
                  v-for="item in tableLaws[scope.$index]"
                  :key="item"
                >
                  <p v-for="ele in item">
                    <span>{{ele.name}}</span>
                  </p>
                    <span>{{item.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="案由"
              min-width="180">
              <template scope="scope">
                <el-tag
                  v-if="tableCauses.length > 0"
                  v-for="item in tableCauses[scope.$index]"
                  style="margin: 5px 5px"
                  type="primary"
                >{{item.name}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="225">
              <template scope="scope" style="width: 210px">
                <el-button @click.native.prevent="handleJump(scope.$index, tableData)" size="small">图谱构建</el-button>
                <el-button @click.native.prevent="handleEdit(scope.$index, tableData)" size="small">编辑</el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" size="small">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="write_date"
              label="最后编辑时间"
              min-width="170"
            >
            </el-table-column>
            <el-table-column
              prop="user_name"
              label="编辑人"
              min-width="90"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationContainer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current_page"
            :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
            :page-size="this.pager.page_size"
            layout="prev, pager, next, sizes, jumper"
            :total="this.totalTags">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-show="status !== 1">
      <div class="tagDetail">
        <div class="tagDetailTitle">
          <i class="returnList" @click="returnList"></i>
          <span>{{this.detailData.tagName}}</span>
          <p @click="jumpToBuild">图谱构建</p>
        </div>
        <div class="subfield">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="法律标签基本信息" name="1">
              <div class="tagDetailTitleContainer">
                <div><span>标签名称</span><p>{{detailData.zh_name ? detailData.zh_name : ''}}</p></div>
                <div><span>法律分类</span><p>{{detailData.law_type.name ? detailData.law_type.name: ''}}</p></div>
                <div><span>提取方法</span><p>{{detailData.extract_type.name ? detailData.extract_type.name : ''}}</p></div>
                <div><span>标签描述</span><p>{{detailData.description ? detailData.description : ''}}</p></div>
                <div><span>口语化描述</span><p>{{detailData.colloquial_description ? detailData.colloquial_description : ''}}</p></div>
                <div><span>案由</span><p><el-tag v-for="item in detailData.causes" :key="item">{{item.name}}</el-tag></p></div>
                <div><span>关键词</span><p><el-tag v-for="tag in detailData.keywords" :key="tag">{{tag}}</el-tag></p></div>
                <div><span>法律文本</span><p><el-tag v-for="law in detailData.laws" :key="law">{{law.name}}</el-tag><i class="tagDetailEdit" @click="editTag"></i></p></div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="法律标签规则列表" name="2">
              <div class="noRules" v-if="!detailData.rules || detailData.rules.length == 0">
                <div>暂无规则</div>
              </div>
              <div v-else v-for="(elem,index) in detailData.rules" style="border-bottom: 1px dashed #666">
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
        </div>
        <div>
          <el-dialog class="detail-dialog" :modal="editTagDialogModal" title="标签详细信息修改" v-model="editTagDialog">
            <el-form :model="detailData">
              <el-form-item label="标签名称" :label-width="editTagLabelWidth">
                <el-input v-model="detailData.zh_name" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="法律文本" :label-width="editTagLabelWidth">
                <el-tag
                  :key="item.id"
                  :closable="true"
                  :close-transition="false"
                  @close="handleCloseLaws(item.topic)"
                  v-for="item in detailData.laws"
                  style="margin: 10px; width: 80%"
                >
                  {{item.name}}
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
                  :value="item.value">
                </el-option>
                </el-select>
                <el-button type="info" size="small" @click="selectFromLawTree">打开法律体系树</el-button>
              </el-form-item>
              <el-form-item label="法律分类" :label-width="editTagLabelWidth">
                <el-cascader
                  expand-trigger="click"
                  :options="lawCategory"
                  v-model="value2"
                  clearable
                  @change="selectLawCategory"
                  change-on-select
                  placeholder="请选择法律分类"
                >
                </el-cascader>
              </el-form-item>
              <el-form-item label="提取方法" :label-width="editTagLabelWidth">
                <el-select
                  v-model="value3"
                  placeholder="请选择提取方法"
                  @change="selectType"
                  clearable
                >
                  <el-option
                    v-for="item in getMethods"
                    :key="item._id"
                    :label="item.zh_name"
                    :value="item.zh_name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签案由" :label-width="editTagLabelWidth">
                <el-tag
                  :key="item.id"
                  :closable="true"
                  :close-transition="false"
                  @close="handleCloseCauses(item)"
                  v-for="item in detailData.causes"
                  style="margin: 10px"
                >
                  {{item.name}}
                </el-tag>
                <el-select
                  style="width: 300px; display: block"
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
              <el-form-item label="关键词" :label-width="editTagLabelWidth">
                <el-tag
                  :key="key"
                  v-for="key in detailData.keywords"
                  :closable="true"
                  :close-transition="false"
                  @close="handleClose(key)"
                >
                  {{key}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="mini"
                  style="width: 200px"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">添加关键字</el-button>
              </el-form-item>
              <el-form-item label="标签描述" :label-width="editTagLabelWidth">
                <el-input v-model="detailData.description" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="口语化描述" :label-width="editTagLabelWidth">
                <el-input v-model="detailData.colloquial_description" style="width: 300px"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editTagDialog = false">取 消</el-button>
              <el-button type="primary" @click="concernEditTag">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog class="rule-dialog" :modal="editTagDialogModal" title="标签新增规则" v-model="addRuleDialog">
            <div class="tagname"><span>当前标签</span><p>{{detailData.zh_name}}</p></div>
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
          <el-dialog class="tree-dialog" title="法律文本树" v-model="lawTreeDialog">
            <div class="tree">
              <my-tree ref="treeChild"></my-tree>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="lawTreeDialog = false">取 消</el-button>
              <el-button type="primary" @click="handleConcern">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from '../../js/axios-api.js';
  import myTree from './treeNode.vue'
  import ElOptionGroup from "../../../node_modules/element-ui/packages/select/src/option-group";
  import selectComponent from './selectComponent.vue'
  export default {
    data() {
      return {
        lawTreeModel: '',
        lawTreeData: [],
        // 是否只显示常用标签
        show_usual_tag: true,
        // 记录当前标签的案由
        detailTagCause: [],
          //全屏loading
        loading: true,
          // 从组件传来的
        selectPar: {},
        // 选择的法律文本
        selectLawRules: '',
        lawWithKeywords: [],
        // 法律体系树的模板
        lawTreeDialog: false,
        // 添加规则弹窗的状态
        addRuleDialog: false,
        addRulesTempArray:[],
        addRulesTemp:{
          id: '',
          value: '',
          name: ''
        },
        getDocType: [],
        tempTagEdit: [],
        getDocParas: [],
        addRulesSetences: '',
        // 筛选标签列表的参数
        refreshParams: {},
        // 关键字
        inputVisible: false,
        inputVisible2: false,
        inputValue2: '',
        // 标签文本
        inputLaws: '',
        inputValue: '',
        tagKeywords: [''],
        // 编辑标签信息的弹窗
        editTagDialog: false,
        editTagDialogModal: false,
        editTagLabelWidth: '120px',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        // 法律分类
        lawCategory: [],
        // 当前页数
        // 总标签数
        totalTags: 0,
        // 提取方法
        getMethods: [],
        // 案由
        getCases: [],
        getCasesWithKeywords: [],
        activeNames: ['1'],
        status: 1,
        // 搜索标签的关键字
        inputKeyWords: '',
        // 搜索法律文本的关键字
        inputKeyWordsOfLaws: '',
        // 搜索案由的关键字
        inputKeyWordsOfCauses: '',
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
        tableKeywords: [],
        tableLaws: [],
        tableCauses: [],
        detailData: {
          causes: [],
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
          zh_name: '',
          id: '',
          extract_type: {
            id: '',
            name: ''
          },
          rules: ['']
        },
        current_page: 1,
        pager: {
          page_size: 15
        },
        law_id: ''
      }
    },
    components: {
      ElOptionGroup,
      myTree,
      selectComponent
    },
    methods: {
      // 基本方法
      getTagsWithAllParams(par){
        this.selectPar = par ? par : this.selectPar;
        const keyword = this.inputKeyWords ? this.inputKeyWords : '';
        const law_id = this.law_id ? this.law_id : '';
        const law_type = this.selectPar.lawCategoryId ? this.selectPar.lawCategoryId : '';
        const extract_type = this.selectPar.getMethodsId ? this.selectPar.getMethodsId : '';
        const cause_id = this.selectPar.getCasesId ? this.selectPar.getCasesId : '';
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?law_type='+law_type
          +'&checked=' + this.show_usual_tag
          +'&extract_type='+extract_type
          +'&keyword=' + keyword
          +'&law_id=' + law_id
          + '&page_size=' + this.pager.page_size
          +'&page=' + this.current_page
          +'&cause_id='+cause_id).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.tableData = this.dealData(tags.data.data);
          console.log('表格数据', this.tableData);
          this.loading = false;
        })
      },
      getAllLawCategorys(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_category/tree').then((res) => {
          if(res.data.code === 0){
            const tempLaw = res.data.data;
            const temp = {
              id: '0',
              value: '--暂无--',
              label: '--暂无--'
            }
            tempLaw.map(item => {
              let tempItem = {
                id: '',
                value: '',
                label: '',
                children: []
              };
              tempItem.id = item.id;
              tempItem.value = item.topic;
              tempItem.label = item.topic;
              if(item.children){
                item.children.map(ele => {
                  let tempChildren = {
                    id: '',
                    value: '',
                    label: '',
                  }
                  tempChildren.id = ele.id;
                  tempChildren.label = ele.topic;
                  tempChildren.value = ele.topic;
                  tempItem.children.push(tempChildren);
                })
              }
              this.lawCategory.push(tempItem);
            })
            this.lawCategory.unshift(temp);
          }else {
            this.$message.error('法律分类接口报错');
          }

        })
      },
      getAllMethods(){
        axios.get(this.$store.state.TagUrl + '/api/tag/extract_methods').then((method) => {
          this.getMethods = method.data.data;
          const temp = {
            id: '0',
            zh_name: '--暂无--'
          }
          this.getMethods.unshift(temp);
        })
      },
      getAllCases(){
        axios.get(this.$store.state.TagUrl + '/api/tag/causes?page_size=2000').then((cases) => {
          if(cases.data.code === 0){
            this.getCases = cases.data.data;
          }else{
            this.$message.error(cases.data.msg);
          }
        })
      },
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
      getLawTreeData(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_system/tree').then((tree) => {
          const treeData = tree.data.data;
          treeData[0].children.map(item => {
            let tempTreeData = {
              value: item.topic,
              label: item.topic,
              id: item.id,
              children: []
            };
            if(item.children && item.children.length > 0){
              item.children.map(ele => {
                let tempChildTreeData = {
                  value: ele.topic,
                  label: ele.topic,
                  id: ele.id,
                  children: []
                }
                if(ele.children && ele.children.length > 0){
                  ele.children.map(child => {
                    let tempGrandSon = {
                      value: child.topic,
                      label: child.topic,
                      id: child.id
                    }
                    tempChildTreeData.children.push(tempGrandSon);
                  })
                }
                tempTreeData.children.push(tempChildTreeData);
              })
            }
            this.lawTreeData.push(tempTreeData);
          });
          console.log('法律体系数据处理后: ', this.lawTreeData);
        })
      },
      // 列表页方法
      changePage(val){
        this.current_page = val;
      },
      deleteRow(index, tableData) {
        axios.delete(this.$store.state.TagUrl + tableData[index].url).then((res) => {
          if(res.data.code === 0){
            this.loading = true;
            this.getTagsWithAllParams();
            this.$message.success('删除成功');
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      handleCurrentChange(val){
        this.current_page = val;
        this.getTagsWithAllParams();
      },
      handleEdit(index, tableData){
        this.detailData = tableData[index];
        this.tagKeywords = this.detailData.keywords;
        this.status = 2;
      },
      handleJump(index, tableData){
        this.detailData = tableData[index];
        this.$store.state.tagData = {
          dataTag: this.detailData
        };
        this.status = 1;
        this.$router.push('/lawtag/lawtagedit');
      },
      handleSizeChange(val){
        this.pager.page_size = val;
        this.getTagsWithAllParams();
      },
      returnList(){
        this.getTagsWithAllParams();
        this.status = 1;
      },
      search(){
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.tableData = this.dealData(tags.data.data);
        })
      },
      // 详情编辑方法
      concernEditTag(){
        let temp = [];
        this.detailData.laws.map((item) => {
          temp.push(item.id);
        });
        const params = {
          colloquial_description: this.detailData.colloquial_description,
          zh_name: this.detailData.zh_name,
          description: this.detailData.description,
          law_type: this.detailData.law_type.id,
          extract_type: this.detailData.extract_type.id,
          keywords: JSON.stringify(this.detailData.keywords),
          laws: JSON.stringify(temp),
          extracts: JSON.stringify(this.detailData.extracts),
        };
        axios.put(this.$store.state.TagUrl + this.detailData.url + '?axios=1', params)
          .then((res) => {
            if(res.data.code === 0){
              this.$message.success('修改成功！', res);
            } else{
              this.$message.warning(res.data.msg);
              this.detailData.laws.splice(0,1);
            }
          }).catch((err) => {
          this.$message.error(err);
        });
        this.value2 = '';
        this.value3 = '';
        this.editTagDialog = false;
      },
      dealData(tags){
        this.tableKeywords = [];
        this.tableLaws = [];
        this.tableCauses = [];
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
          this.tableKeywords.push(tags[i].keywords);
          this.tableLaws.push(tags[i].laws);
          this.tableCauses.push(tags[i].causes);
        }
        return tags;
      },
      editTag(){
        this.editTagDialog = true;
      },
      getFalvOptions2(val){
        this.inputKeyWordsOfCauses = val;
        axios.get(this.$store.state.TagUrl + '/api/tag/causes?page_size=50&keyword=' + this.inputKeyWordsOfCauses).then((cases) => {
          let data = cases.data.data;
          this.getCasesWithKeywords = data;
        });
        this.inputKeyWordsOfCauses = '';
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
        if(this.status !== 1){
          this.inputKeyWordsOfLaws = '';
        }else{
          this.loading = true;
          this.getTagsWithAllParams();
        }
      },
      handleClose(tag) {
        this.detailData.keywords.splice(this.detailData.keywords.indexOf(tag), 1);
      },
      handleCloseCauses(item){
        const deleteid = item.id;
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
      handleCloseLaws(law) {
        const temp = this.detailData.laws;
        for(let i = 0; i < temp.length; i+=1){
          if(temp[i].topic === law ){
            this.detailData.laws.splice(i, 1);
          }
        }

      },
      handleConcern(){
        const selectNode = this.$refs.treeChild.getSelectNode();
        const temp = {
          id: selectNode.id,
          name: selectNode.topic
        };
        this.detailData.laws.push(temp);
        this.lawTreeDialog = false;
      },
      jumpToBuild(){
        this.$store.state.tagData = {
          dataTag: this.detailData
        };
        this.status = 1;
        this.$router.push('/lawtag/lawtagedit');
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
          let ids = [];
          let tempArr = [];
          this.detailTagCause.map(item => {
            ids.push(item.id);
          });
          const params = {
            cause_ids: JSON.stringify(ids)
          };
          axios.post(this.$store.state.TagUrl + this.detailData.url+ '/causes?axios=1', params).then(res => {
            if(res.data.code === 0) {
              this.$message.success('添加案由成功！');
              if(!this.detailData.causes.length){
                this.detailData.causes = [];
                this.detailData.causes.push(temp);
              }else{
                this.detailData.causes.push(temp)
              }
            }else{
              this.$message.error(res.data.msg);
            }
          });
          this.lawWithKeywords = [];
        }
      },
      selectFromLawTree(){
        this.lawTreeDialog = true;
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.detailData.keywords.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      selectLaws(val){
        if(this.status !== 1){
          if(val){
            let temp = {
              id: '',
              name: ''
            };
            this.lawWithKeywords.map(item => {
              if(item.value === val){
                temp.id = item.id;
                temp.name = item.value;
                this.detailData.laws.push(temp);
              }
            });
            this.lawWithKeywords = [];
          }
        }else{
          this.lawWithKeywords.map(item => {
            if(item.value === val){
              this.law_id = item.id;
              this.loading = true;
              this.getTagsWithAllParams();
            }
          });
          if(val === ''){
            this.loading = true;
            this.law_id = '';
            this.getTagsWithAllParams();
          }
        }
      },
      selectLawCategory(val){
        if(val.length === 1){
          this.lawCategory.map(item => {
            if(item.value === val){
              this.detailData.law_type.id = item.id;
              this.detailData.law_type.name = val;
            }
          });
        }else if(val.length === 2){
          if(val[0] === '程序'){
            this.lawCategory[1].children.map(item => {
              if(item.value === val[1]){
                this.detailData.law_type.id = item.id;
                this.detailData.law_type.name = val[1];
              }
            });
          }else if(val[0] === '实体'){
            this.lawCategory[2].children.map(item => {
              if(item.value === val[1]){
                this.detailData.law_type.id = item.id;
                this.detailData.law_type.name = val[1];
              }
            });
          }
        }
      },
      selectType(val){
        this.getMethods.map(item => {
          if(item.zh_name === val){
            this.detailData.extract_type.id = item.id;
            this.detailData.extract_type.name = val;
          }
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 规则添加方法
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
        this.detailData.rules.push(this.addRulesTempArray);
        arr = arr.concat(this.detailData.rules);
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
        axios.put(this.$store.state.TagUrl + this.detailData.url + '?axios=1', param)
          .then((res) => {
            this.$message.success('修改成功！', res);
          }).catch((err) => {
          console.log('err2', err)
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
      this.getAllCases();
      this.getAllDocTypes();
      this.getAllParams();
      this.getTagsWithAllParams();
      this.getLawTreeData();
    },
    watch: {
      inputKeyWords: function () {
        axios.get(this.$store.state.TagUrl + '/api/tag/tags?keyword='+this.inputKeyWords).then((tags) => {
          this.pager = tags.data.pager;
          this.totalTags = tags.data.pager.total;
          this.tableData = this.dealData(tags.data.data);
        });
      }
    }
  }

</script>
<style lang="less">
  .tagSearchContainer{
    width: 99.5%;
    height: 80%;
    .search_box1 {
      height: 55px;
      line-height: 55px;
      margin-top: -10px;
      width: 100%;
      border: 3px solid #0052A9;
      position: relative;
      background: #fff;
      display: flex;
      > i {
        display: inline-block;
        position: absolute;
        right: 0;
        width: 60px;
        height: 41px;
        margin: 7px 0;
        border-left: 1px solid #3f93ec;
        background: url('../../assets/search/search.png') no-repeat center;
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
    .tagListTitle{
      width: 100.5%;
      height: 69px;
      margin-top: 1px;
      background-color: #d4dfeb;
      .title{
        display: inline-block;
        float: left;
        margin-top: 28px;
        margin-left: 30px;
        font-weight: bold;
        color: #0052a9;
        font-size: 16px;
        #tagListTitleIcon{
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 6px;
          background: url('../../assets/lawtag/listIcon.png') center no-repeat;
        }
      }
      .tableContainer{
        margin-right: -6px;
        min-width: 1150px;
        width: 100.5%;
        .el-table{
          display: inline-block;
          color: #5a90ca;
          font-weight: 600;
          width: 100.5%;
          .el-table-column{
            .keywordsClass{
              display: inline-block;
              width: 80%;
              height: 15px;
            }
          }
        }
      }
    }
    .tagListTable{
      width: 100.5%;
      .paginationContainer{
        display: inline-block;
        width: 100%;
        height: 100px;
        margin: 30px auto;
        float: right;
      }
    }
    .preparation{
      display: inline-block;
      float: right;
      margin-right: 30px;
      margin-top: 16px;
    }
    .lawTreeSelect{
      display: inline-block;
      margin-right: 15px;
      margin-top: 17px;
      float: right;
    }
    .law_text{
      display: inline-block;
      float: right;
      margin-right: 15px;
      margin-top: 17px;
    }
    .tagDetail{
      width: 100.5%;
      height: 100%;
      margin-right: -6px;
      margin-top: -61px;
      .tagDetailTitle{
        height: 62px;
        line-height: 62px;
        background-color: #d9e1eb;
        position: relative;
        text-align: center;
        .returnList{
          position: absolute;
          display: inline-block;
          width: 145px;
          height: 34px;
          top:11px;
          left: 30px;
          background: url('../../assets/lawtag/returnList.png') center no-repeat;
          &:hover{
            box-shadow: 1px 1px;
            color: #999;
          }
        }
        >span{
          display: inline-block;
          font-size: 16px;
          color: #0052a9;
          font-weight: bold;
          margin: 1px auto;
        }
        >p{
          display: inline-block;
          float: right;
          font-size: 16px;
          width: 100px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background: #fff;
          border-radius: 5px;
          margin-top: 12px;
          margin-right: 20px;
          &:hover{
            cursor: pointer;
            background: rgba(0,0,0,0.1);
          }
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
              .tagDetailTitleContainer{
                >div{
                  margin: 10px auto;
                  >span{
                    display: inline-block;
                    vertical-align: top;
                    width: 30%;
                    height: 100%;
                    font-size: 16px;
                    color: #666;
                    text-align: right;
                    margin-right: 50px;
                  }
                  >p{
                    display: inline-block;
                    width: 60%;
                    font-size: 16px;
                    color: #666;
                    font-weight: 600;
                    .el-tag{
                      margin-left: 0px;
                      margin-right: 12px;
                    }
                    .tagDetailEdit{
                      display: block;
                      width: 28px;
                      height: 28px;
                      position: absolute;
                      top:170px;
                      right: 25px;
                      background: url('../../assets/lawtag/edit.png') center no-repeat;
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
            .tagname{
              >span{
                display: inline-block;
                width: 10%;
                height: 50px;
                line-height: 50px;
                margin-left: 50px;
              }
              >p{
                display: inline-block;
              }
            }
          }
        }
      }
      .detail-dialog{
        .el-dialog{
          top: 20%!important;
          width: 60%;
          height: 65%;
          .el-dialog__body{
            .el-form{
              .el-form-item{
                .el-form-item__content{
                  .el-tag{
                    margin-left: 0px!important;
                  }
                }
              }
            }
            .tagname{
              >span{
                display: inline-block;
                width: 5%;
                height: 50px;
                line-height: 50px;
                margin-left: 50px;
              }
              >p{
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
  #loading{
    position: absolute;
    width: 100%;
    top: 300px;
  }
</style>
