<template>
  <div id="search">
    <div class="will searched">
      <div class="search_box">
        <el-select v-model="keywords" :loading="loading.search" remote multiple filterable
                   :remote-method="remoteOptions" placeholder="请输入关键词"
                   :multiple-limit="3"
                   @change="isSearch?function() {
                     console.log('aaaa')
                     return
                   }:search()">
          <el-option-group
            v-for="group in searchOptions"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
        <i @click="search"></i>
      </div>
      <div class="sidebar" v-if="!isSearch">
        <ul>
          <li class="on" @click="showList = false;editable=false;toggle(0)"><i></i>知识图谱</li>
          <li @click="showList = false;editable=true;toggle(1)"><i></i>编辑模式</li>
          <li @click="chanList"><i></i>查看知识文本</li>
        </ul>
      </div>
    </div>
    <hotBox style="display: none" :selectedLoc="selectedLoc" :curNodePosition="curNodePosition"
            @cmdHandler="cmdHandler"></hotBox>
    <!-- 图谱 -->
    <!--<div id="main" v-show="!showList">-->
    <!---->
    <!--</div>-->
    <div id="main" v-for="(div,index) in divs" v-show="!showList" v-loading="loading.card">
      <div :id="div" style="background-color: whitesmoke; border: solid 1px black; width: 100%; height: 800px"></div>
      <div :id="div + '-overview'"
           style="background-color: whitesmoke;border: 1px grey solid;width: 20%; height: 20%;position: absolute;bottom:0px;right: 0;z-index: 100"></div>
    </div>

    <!-- 知识链 -->
    <div class="chanlist" v-show="showList">
      <dl>
        <dt>知识链列表</dt>
        <dd v-for="list in chainList" @click="showText(list)">
          <template v-for="item in list.data">
            <el-button v-if="item.category == 'entity' || item.category == 'tag'">{{item.name}}</el-button>
            <span v-if="item.category == 'relation'">{{item.name}}</span>
          </template>
        </dd>
      </dl>
    </div>
    <el-dialog title="替换" @close="closeModify" :modal-append-to-body="false" v-model="shouldReplaceShow">
      <el-form label-width="80px" class="form_box">
        <el-form-item label="选择实体" v-if="curNode.category=='entity'">
          <el-select v-model="replaceNode" :loading="loading.entity" filterable remote placeholder="请选择实体"
                     :remote-method="remoteEntities">
            <el-option
              v-for="item in options_e"
              :key="item"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择关系" v-if="curNode.category=='relation'">
          <el-select v-model="replaceNode" :loading="loading.relation" filterable remote placeholder="请选择关系"
                     :remote-method="remoteRelations">
            <el-option
              v-for="item in options_r"
              :key="item"
              :label="item.type_name+':'+item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <chains :selected-chains="nodeChainList" @check="check" @checkAll="checkAll">
      </chains>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shouldReplaceShow = false">取 消</el-button>
        <el-button type="primary" @click="replaceNodeData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" @close="closeModify" :modal-append-to-body="false" v-model="shouldEditorShow">
      <el-form label-width="80px" class="form_box" :model="curNode">
        <el-form-item label="名称">
          <el-input v-model="curNode.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" v-if="curNode.category=='relation'">
          <el-select v-model="curNode.type" placeholder="请选择类型" width="320px">
            <el-option
              v-for="item in type_r"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" v-if="curNode.category=='entity'">
          <el-select v-model="curNode.type" placeholder="请选择类型" width="320px" :disabled="true">
            <el-option
              v-for="item in type_e"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性">
          <el-select v-model="curNode.property" placeholder="请选择属性">
            <el-option
              v-for="item in properties"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案由">
          <el-select v-model="curNode.case_cause" placeholder="请选择案由">
            <el-option
              v-for="item in caseCauses"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="口语化">
          <el-input v-model="curNode.colloquial" placeholder="请输入口语化"></el-input>
        </el-form-item>
        <el-form-item label="同义词">
          <el-input v-model="curNode.synonyms" placeholder="请输入同义词"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shouldEditorShow = false">取 消</el-button>
        <el-button type="primary" @click="modifyNodeData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增" @close="closeAdd" :modal-append-to-body="false" v-model="shouldAddShow">
      <el-tabs v-model="addNodeActiveName" type="border-card" v-show="addMode==1">
        <el-tab-pane label="选择关系" name="0">
          <el-form label-width="80px" class="form_box">
            <el-form-item label="已有关系">
              <el-select v-model="newRelation" :loading="loading.relation" filterable remote placeholder="请选择关系"
                         :remote-method="remoteRelations">
                <el-option
                  v-for="item in options_r"
                  :key="item"
                  :label="item.type_name+':'+item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="自定义关系" name="1">
          <el-form label-width="80px" class="form_box">
            <el-form-item label="关系类型">
              <el-select v-model="newRelation.type" placeholder="请选择关系类型" width="320px">
                <el-option
                  v-for="item in type_r"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关系名称">
              <el-input v-model="newRelation.name" placeholder="请输入关系名称"></el-input>
            </el-form-item>
            <el-form-item label="关系属性">
              <el-input v-model="newRelation.property_name" placeholder="请输入关系属性"></el-input>
            </el-form-item>
            <el-form-item label="案由">
              <el-select v-model="newRelation.case_cause" placeholder="请选择案由">
                <el-option
                  v-for="item in caseCauses"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="口语化">
              <el-input v-model="newRelation.colloquial" placeholder="请输入口语化"></el-input>
            </el-form-item>
            <el-form-item label="同义词">
              <el-input v-model="newRelation.synonyms" placeholder="请输入同义词"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="addNodeActiveName" type="border-card" v-show="addMode==2">
        <el-tab-pane label="选择实体">
          <el-form label-width="80px" class="form_box">
            <el-form-item label="已有实体" name=0>
              <el-select v-model="newEntity" :loading="loading.entity" filterable remote placeholder="请选择实体"
                         :remote-method="remoteEntities">
                <el-option
                  v-for="item in options_e"
                  :key="item"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实体类型">
              <el-select v-model="newEntity.type" placeholder="请选择实体类型" width="320px">
                <el-option
                  v-for="item in type_e"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="自定义实体" name=1>
          <el-form label-width="80px" class="form_box">
            <el-form-item label="实体类型">
              <el-select v-model="newEntity.type" placeholder="请选择实体类型" width="320px">
                <el-option
                  v-for="item in type_e"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实体名称">
              <el-input v-model="newEntity.name" placeholder="请输入实体名称"></el-input>
            </el-form-item>
            <el-form-item label="实体属性">
              <el-select v-model="newEntity.property" placeholder="请选择实体属性">
                <el-option
                  v-for="item in properties"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案由">
              <el-select v-model="newEntity.case_cause" placeholder="请选择案由">
                <el-option
                  v-for="item in caseCauses"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="口语化">
              <el-input v-model="newEntity.colloquial" placeholder="请输入口语化"></el-input>
            </el-form-item>
            <el-form-item label="同义词">
              <el-input v-model="newEntity.synonyms" placeholder="请输入同义词"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <chains :selected-chains="nodeChainList" @check="check" v-show="addMode==0" @checkAll="checkAll">
      </chains>
      <div slot="footer" class="dialog-footer" v-show="addMode!=2">
        <el-button @click="shouldAddShow = false">取 消</el-button>
        <el-button type="primary" v-if="addMode==1" @click="pre">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-show="addMode==2">
        <el-button type="primary" @click="pre">上一步</el-button>
        <el-button type="success" @click="addNodeAndRelation">完成</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除" :modal-append-to-body="false" v-model="shouldDelShow">
      <chains :selected-chains="nodeChainList" @check="check" @checkAll="checkAll">
      </chains>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shouldDelShow=false">取消</el-button>
        <el-button type="success" @click="deleteSelection()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增链" :modal-append-to-body="false" size="large" custom-class="link-dialog" closeOnPressEscape=""
               v-model="shouldAddLinkShow">
      <create :editable="false" :list="selections" :visible="shouldAddLinkShow"></create>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import axios from 'axios'
  import Chain from './Chain.vue';
  import Create from './Create.vue';
  import HotBox from './HotBox.vue'
  import go from 'gojs'

  var debounce = require('debounce');
  const defaultNewRelation = {
    name: '',
    type: '',
    case_cause: '',
    property: '',
    _id: '',
    colloquial: '',
    synonyms: ''
  };
  const defaultNewEntity = {
    name: '',
    type: '',
    case_cause: '',
    property: '',
    _id: '',
    colloquial: '',
    synonyms: ''
  };
  export default {
    data() {
      return {
        divs: [],
        showList: false,
        chainList: [],
        options: [],
        value: '',
        keywords: '',
        links: [],
        data: [],
        listId: [],
        myDiagram: {},
        myOverview: {},
        nodeDataArray: [],
        linkDataArray: [],
        loading: {
          card: false,
          search: false,
          relation: false,
          entity: false
        },
        searchOptions: [],
        shouldEditorShow: false,
        shouldAddShow: false,
        shouldDelShow: false,
        shouldReplaceShow: false,
        hasChosenAll: false,//是否全选
        curNode: {},
        selections: [],
        replaceNode: {},
        fromNode: {},
        diagram: '',
        nodeIndex: '',
        addNodeActiveName: '0',
        addMode: 0,
        options_r: [],
        options_e: [],
        type_r: [],
        type_e: [],
        properties: [],
        caseCauses: [],
        baseInstance: null,
        tagInstance: null,
        newRelation: Object.assign({}, defaultNewRelation),
        newEntity: Object.assign({}, defaultNewEntity),
        nodeChainList: [],
        selectChainList: [],
        editable: false,
        shouldAddLinkShow: false,
        selectedLoc: {},
        curNodePosition: {},
        searchSize: 50,
        highlightChain: []
      }
    },
    props: {isSearch: Boolean, searchType: String, list: Array},
    components: {
      'chains': Chain,
      'create': Create,
      'hotBox': HotBox
    },
    mounted: function () {
      this.baseInstance = axios.create({
        timeout: 100000,
        baseURL: this.$store.state.url1 + '/api/nlp/',
        params: {
          access_token: localStorage.access_token
        },
      });
      this.baseInstance.interceptors.response.use((res) => {
        // Do something with response data
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
          return Promise.reject(res);
        } else {
          if (res.config.method != 'get') {
            this.$message({
              message: '操作已保存',
              type: 'success'
            });
          }
          return res;
        }
      }, function (error) {
        // Do something with response error
        return Promise.reject(error);
      });
      this.tagInstance = axios.create({
        timeout: 100000,
        baseURL: this.$store.state.TagUrl + '/api/',
        params: {
          access_token: localStorage.access_token
        },
      });
      this.tagInstance.interceptors.response.use((res) => {
        // Do something with response data
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
          return Promise.reject(res);
        } else {
          if (res.config.method != 'get') {
            this.$message({
              message: '操作已保存',
              type: 'success'
            });
          }
          return res;
        }
      }, function (error) {
        // Do something with response error
        return Promise.reject(error);
      });
      this.loadTypes();
      this.loadProperties();
      this.loadCaseCause();

      if (this.list) {
        this.nodeDataArray.length = 0;
        this.linkDataArray.length = 0;
        this.list.forEach((item, index) => {
          if ((item.params.category == 'entity') || (item.params.category == 'tag')) {
            this.nodeDataArray.push(item);
          } else {
            this.linkDataArray.push(item);
          }
        });
        console.log(11, this.linkDataArray, this.nodeDataArray)
        this.init();
      }
    },
    computed: {
      user: function () {
        return this.$store.state.user;
      },
      username() {
        return JSON.parse(this.user.config.data).username
      },
    },
    methods: {
      loadProperties() {
        this.baseInstance.get('/label/property')
          .then((res) => {
            this.properties = res.data.data;
          });
      },
      loadCaseCause() {
        this.baseInstance.get('/knowledge/cause/type')
          .then((res) => {
            this.caseCauses = res.data.data;
          });
      },
      loadTypes() {
        this.baseInstance.get('/knowledge/relation/type')
          .then((res) => {
            this.type_r = res.data.data;
          });
        this.baseInstance.get('/knowledge/entity/type')
          .then((res) => {
            this.type_e = res.data.data;
          });
      },
      remoteRelations: debounce(function (query) {
        if (query !== '') {
          this.loading.relation = true;
          this.baseInstance.get('/label/relation/list?pager_flag=true&&name=' + query)
            .then((res) => {
              this.loading.relation = false;
              this.options_r = [];
              if (res.data.data) {
                res.data.data.forEach((r) => {
                  if (r.colloquial) {
                    r.colloquial = r.colloquial.join(',');
                  }
                  if (r.synonyms) {
                    r.synonyms = r.synonyms.join(',');
                  }
                  this.options_r.push(r);
                })
              }
            });
        } else {
          this.options_r = [];
        }
      }, 250),
      remoteEntities: debounce(function (query) {
        if (query !== '') {
          this.loading.entity = true;
          this.baseInstance.get('/label/entity/list?pager_flag=true&&name=' + query)
            .then((res) => {
              this.loading.entity = false;
              this.options_e = [];
              if (res.data.data) {
                res.data.data.forEach((e) => {
                  if (e.colloquial) {
                    e.colloquial = e.colloquial.join(',');
                  }
                  if (e.synonyms) {
                    e.synonyms = e.synonyms.join(',');
                  }
                  if (!e.type) {
                    e.type = '';
                  }
                  this.options_e.push(e);
                })
              }
              console.log(this.options_e)
            });
        } else {
          this.options_e = [];
        }
      }, 250),
      closeModify() {
      },
      closeAdd() {
        this.newRelation = Object.assign({}, defaultNewRelation);
        this.newEntity = Object.assign({}, defaultNewEntity);
        this.addMode = 0;
      },
      pre() {
        this.addMode--;
      },
      next() {
        this.addMode++;
      },
      resetNode(node) {
        var data = Object.assign({}, this.curNode);
        if (!$.isEmptyObject(this.replaceNode)) {
          data = Object.assign({}, this.replaceNode);
        }
        data.category = 'entity';
        this.myDiagram.startTransaction("modify node data");
        this.myDiagram.model.setDataProperty(node, "key", data._id);
        this.myDiagram.model.setDataProperty(node, "text", data.name);
        this.myDiagram.model.setDataProperty(node, "params", data);
        this.myDiagram.commitTransaction("modify node data");
        this.shouldEditorShow = false;
      },
      resetLink(link) {
        var data = Object.assign({}, this.curNode);
        if (!$.isEmptyObject(this.replaceNode)) {
          data = Object.assign({}, this.replaceNode);
        }
        data.category = 'relation';
        this.myDiagram.startTransaction("modify link data");
        this.myDiagram.model.setDataProperty(link, "key", data._id);
        this.myDiagram.model.setDataProperty(link, "text", data.name);
        this.myDiagram.model.setDataProperty(link, "params", data);
        this.myDiagram.commitTransaction("modify link data");
        this.shouldEditorShow = false;
      },
      modifyNodeData() {
        //修改属性
        this.caseCauses.forEach((c) => {
          if (c._id == this.curNode.case_cause) {
            this.curNode.case_cause = c.name;
          }
        });

        var update_info = Object.assign({}, this.curNode);
        if (update_info.colloquial) {
          update_info.colloquial = JSON.stringify(this.formatAddData(update_info.colloquial));
        }
        if (update_info.synonyms) {
          update_info.synonyms = JSON.stringify(this.formatAddData(update_info.synonyms));
        }
        delete update_info._id;
        delete update_info.chain_belong;
        if (this.curNode.category == 'entity') {
          this.properties.forEach((p) => {
            if (p._id == this.curNode.property) {
              this.curNode.property = p.name;
            }
          });
          this.baseInstance.put('/label/entity?axios=1', Object.assign({
            user_name: this.username,
            id: this.curNode._id
          }, update_info)).then((res) => {
            this.shouldEditorShow = false;
            this.resetChainList(() => {
              for (var i = 0; i < this.nodeDataArray.length; i++) {
                var n = this.nodeDataArray[i];
                if (n.key == this.curNode._id) {
                  this.resetNode(n);
                }
              }
            });
          });
        } else {
          this.baseInstance.put('/label/relation?axios=1', Object.assign({
            user_name: this.username,
            id: this.curNode._id
          }, update_info)).then((res) => {

            this.resetChainList(() => {
              for (var i = 0; i < this.linkDataArray.length; i++) {
                var l = this.linkDataArray[i];
                if (l.key == this.curNode._id) {
                  this.resetLink(l);
                }
              }
            })
          });
        }
      },
      replaceNodeData() {
        //替换节点
        if ($.isEmptyObject(this.replaceNode)) {
          this.$message({
            type: 'warning',
            message: '请选择节点'
          });
          return;
        }
        if (this.selectChainList.length == 0) {
          this.$message({
            type: 'warning',
            message: '至少选择一条链'
          });
          return;
        }
        this.selectChainList.forEach(chain_id => {
          var knowledge_linked = [];
          var case_cause = "";
          this.chainList.forEach(list => {
            if (list.id == chain_id) {
              case_cause = list.case_cause;
              list.data.forEach(node => {
                if (node.id == this.replaceNode._id) {
                  knowledge_linked.push({
                    _id: this.replaceNode._id,
                    name: this.replaceNode.name,
                    type: this.replaceNode.type,
                    property: this.replaceNode.property
                  });
                } else {
                  knowledge_linked.push({
                    _id: node.id,
                    name: node.name,
                    type: node.type,
                    property: node.property
                  })
                }
              });
            }
          });
          this.baseInstance.put('/label/chain?axios=1', {
            user_name: this.username,
            id: chain_id,
            case_cause: case_cause,
            knowledge_linked: JSON.stringify(knowledge_linked)
          }).then((res) => {
            this.shouldReplaceShow = false;
            if (this.curNode.category == 'entity') {
              this.replaceNode.category = 'entity';
              this.resetChainList(() => {
                for (var i = 0; i < this.nodeDataArray.length; i++) {
                  var n = this.nodeDataArray[i];
                  if (n.key == this.curNode._id) {
                    this.resetNode(n);
                  }
                }
                this.replaceNode = {};
              });
            } else {
              this.replaceNode.category = 'relation';
              this.resetChainList(() => {
                for (var i = 0; i < this.linkDataArray.length; i++) {
                  var l = this.linkDataArray[i];
                  if (l.key == this.curNode._id && l.from == this.curNode.startId && l.to == this.curNode.endId) {
                    this.resetLink(l);
                  }
                }
                this.replaceNode = {};
              })
            }
          });

        });
      },
      addNodeAndRelationToLink() {
        if (!this.newRelation._id || !this.newEntity._id) {
          this.$message({
            message: '未填写实体或关系',
            type: 'error'
          });
          return;
        }
        console.log(this.newRelation);
        this.selectChainList.forEach(chain_id => {
          var knowledge_linked = [];
          var case_cause = "";
          var isTail = false;
          var isHead = false;
          this.chainList.forEach(list => {
            if (list.id == chain_id) {
              case_cause = list.case_cause;
              list.data.forEach((node, index) => {
                if (node.id == this.fromNode._id) {
                  if (index == 0) {
                    //在头结点增加
                    isHead = true;
                    knowledge_linked.push({
                      _id: this.newEntity._id,
                      name: this.newEntity.name,
                      type: this.newEntity.type,
                      property: this.newEntity.property
                    }, {
                      _id: this.newRelation._id,
                      name: this.newRelation.name,
                      type: this.newRelation.type,
                      property: this.newRelation.property
                    })
                  } else if (index == list.data.length - 1) {
                    //在尾结点增加
                    isTail = true;
                    knowledge_linked.push({
                      _id: this.newRelation._id,
                      name: this.newRelation.name,
                      type: this.newRelation.type,
                      property: this.newRelation.property
                    }, {
                      _id: this.newEntity._id,
                      name: this.newEntity.name,
                      type: this.newEntity.type,
                      property: this.newEntity.property
                    })
                  }
                }
                knowledge_linked.push({
                  _id: node.id,
                  name: node.name,
                  type: node.type,
                  property: node.property
                })
              });
            }
          });
          this.baseInstance.put('/label/chain?axios=1', {
            user_name: this.username,
            id: chain_id,
            case_cause: case_cause,
            knowledge_linked: JSON.stringify(knowledge_linked)
          }).then((res) => {
            this.resetChainList(() => {
              var newNode = this.newEntity;
              var newRelation = this.newRelation;
              var nodeIndex = this.nodeIndex;
              var diagram = this.myDiagram;
              newNode.category = 'entity';
              newRelation.category = 'relation';
              diagram.startTransaction("Add State");

              // get the node data for which the user clicked the button
              var fromData = this.nodeDataArray[nodeIndex];
              // create a new "State" data object, positioned off to the right of the adorned Node
              var toData = {
                key: newNode._id,
                text: newNode.name,
                params: newNode,
                color: 'rgb(222,155,249)'
              };
              var i = -1;
              this.nodeDataArray.forEach((node, index) => {
                if (node.key == toData.key) {
                  i = index;
                }
              });
              if (i != -1) {
                toData = this.nodeDataArray[i];
              }
              var model = diagram.model;
              if (i == -1) {
                var p = diagram.findNodeForData(fromData).location.copy();
                p.x += 200;
                toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
                // add the new node data to the model
                model.addNodeData(toData);
              }
              // create a link data from the old node data to the new node data
              if (this.hasChosenAll) {
                //如果全选了，就不是头尾节点了
                this.myDiagram.startTransaction("modify node data");
                this.myDiagram.model.setDataProperty(fromData, "color", "rgb(104,189,246)");
                this.myDiagram.commitTransaction("modify node data");
              }
              if (isHead) {
                var linkdata = {
                  from: model.getKeyForNodeData(toData),  // or just: fromData.id
                  to: model.getKeyForNodeData(fromData),
                  key: newRelation._id,
                  text: newRelation.name,
                  params: newRelation
                };
                // and add the link data to the model
                model.addLinkData(linkdata);
              }
              if (isTail) {
                linkdata = {
                  from: model.getKeyForNodeData(fromData),  // or just: fromData.id
                  to: model.getKeyForNodeData(toData),
                  key: newRelation._id,
                  text: newRelation.name,
                  params: newRelation
                };
                // and add the link data to the model
                model.addLinkData(linkdata);
              }

              // select the new Node
              if (i == -1) {
                var newnode = diagram.findNodeForData(toData);
                diagram.select(newnode);
              }

              diagram.commitTransaction("Add State");

              if (i == -1) {
                // if the new node is off-screen, scroll the diagram to show the new node
                diagram.scrollToRect(newnode.actualBounds);
              }
              this.shouldAddShow = false;
              this.addMode = 0;
            });
          });
        });
      },
      addNodeAndRelation() {
        if (this.selectChainList.length == 0) {
          this.$message({
            type: 'warning',
            message: '至少选择一条链'
          });
          return;
        }
        if (!this.newRelation._id) {
          var data = Object.assign({}, this.newRelation);
          data.colloquial = JSON.stringify(this.formatAddData(this.newRelation.colloquial));
          data.synonyms = JSON.stringify(this.formatAddData(this.newRelation.synonyms));
          data.user_name = this.$store.state.user.data.data.real_name;
          this.baseInstance.post('/label/relation?axios=1', data).then((res) => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            var mongoId = res.data.data.id;
            this.newRelation._id = mongoId;
            this.caseCauses.forEach((c) => {
              if (c._id == this.newRelation.case_cause) {
                this.newRelation.case_cause = c.name;
              }
            });
            if (!this.newEntity._id) {
              var data = Object.assign({}, this.newEntity);
              data.colloquial = JSON.stringify(this.formatAddData(this.newEntity.colloquial));
              data.synonyms = JSON.stringify(this.formatAddData(this.newEntity.synonyms));
              data.user_name = this.$store.state.user.data.data.real_name;
              this.baseInstance.post('/label/entity?axios=1', data).then((res) => {
                var mongoId = res.data.data.id;
                this.newEntity._id = mongoId;
                this.caseCauses.forEach((c) => {
                  if (c._id == this.newEntity.case_cause) {
                    this.newEntity.case_cause = c.name;
                  }
                });
                this.properties.forEach((p) => {
                  if (p._id == this.newEntity.property) {
                    this.newEntity.property = p.name;
                  }
                });
                this.addNodeAndRelationToLink();
              });
            } else {
              this.addNodeAndRelationToLink();
            }
          });
        } else {
          if (!this.newEntity._id) {
            var data = Object.assign({}, this.newEntity);
            data.colloquial = JSON.stringify(this.formatAddData(this.newEntity.colloquial));
            data.synonyms = JSON.stringify(this.formatAddData(this.newEntity.synonyms));
            data.user_name = this.$store.state.user.data.data.real_name;
            this.baseInstance.post('/label/entity?axios=1', data).then((res) => {
              var mongoId = res.data.data.id;
              this.newEntity._id = mongoId;
              this.caseCauses.forEach((c) => {
                if (c._id == this.newEntity.case_cause) {
                  this.newEntity.case_cause = c.name;
                }
              });
              this.properties.forEach((p) => {
                if (p._id == this.newEntity.property) {
                  this.newEntity.property = p.name;
                }
              });
              this.addNodeAndRelationToLink();
            });
          } else {
            this.addNodeAndRelationToLink();
          }
        }
      },
      deleteSelection() {
        if (this.selectChainList.length == 0) {
          this.$message({
            type: 'warning',
            message: '至少选择一条链'
          });
          return;
        }
        this.selectChainList.forEach(chain_id => {
          var knowledge_linked = [];
          var case_cause = "";
          this.chainList.forEach(list => {
            if (list.id == chain_id) {
              case_cause = list.case_cause;
              list.data.forEach((node, index) => {
                var shouldRelationDeleted = false;
                if ((index == 1 && list.data[index - 1].id == this.curNode._id) || (index == list.data.length - 2 && list.data[index + 1].id == this.curNode._id)) {
                  shouldRelationDeleted = true;
                }
                if (node.id != this.curNode._id && !shouldRelationDeleted) {
                  knowledge_linked.push({
                    _id: node.id,
                    name: node.name,
                    type: node.type,
                    property: node.property
                  })
                }
              });
            }
          });
          this.baseInstance.put('/label/chain?axios=1', {
            user_name: this.username,
            id: chain_id,
            case_cause: case_cause,
            knowledge_linked: JSON.stringify(knowledge_linked)
          }).then((res) => {
            this.resetChainList(() => {
              var hasNode = false;
              this.chainList.forEach((list) => {
                list.data.forEach((node) => {
                  if (node.id == this.curNode._id) {
                    hasNode = true;
                  }
                })
              });
              if (this.hasChosenAll && !hasNode) {
                //如果全删了就从图上删除
                this.myDiagram.allowDelete = true;
                var cmd = this.myDiagram.commandHandler;
                if (cmd.canDeleteSelection()) {
                  cmd.deleteSelection();
                }
              }
              this.shouldDelShow = false;
            });
          });
        });
      },
      addNode(fromNode) {
        this.fromNode = fromNode;
        this.nodeDataArray.forEach((node) => {
          if (node.text === this.fromNode.name) {
            this.nodeIndex = this.nodeDataArray.indexOf(node);
          }
        });
        var position = this.getPosition(this.fromNode._id);
        this.shouldAddShow = position.isHead || position.isTail && this.editable;
        if (this.shouldAddShow === false) {
          if (this.editable) {
            this.$message({
              type: 'warning',
              message: '只能操作红色节点'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '请进入编辑模式进行修改'
            });
          }
        }
        this.newRelation.case_cause = this.fromNode.case_cause;
        this.nodeChainList = this.getChainListContainsTarget(this.fromNode._id, true);
      },
      addLink() {
        this.shouldAddLinkShow = false;
      },
      check(data) {
        this.selectChainList = data;
      },
      checkAll(val) {
        this.hasChosenAll = val;
      },
      showContextMenu(obj, diagram, tool) {

        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;

        var cxElement = document.getElementById("hotBox");
        // Now show the whole context menu element
        cxElement.style.display = "block";
        // we don't bother overriding positionContextMenu, we just do it here:
        // var mousePt = diagram.lastInput.viewPoint;
        // cxElement.style.left = mousePt.x + "px";
        // cxElement.style.top = 135 + mousePt.y + "px";
        cxElement.style.left = event.clientX + "px";
        cxElement.style.top = event.clientY + "px";
      },
      init() {
        var div = "div" + this.divs.length.toString();
        this.divs.push(div);
        this.$nextTick(() => {
          var $ = go.GraphObject.make;  // for conciseness in defining templates
          var $this = this;
          var cxElement = document.getElementById("hotBox");

          // Since we have only one main element, we don't have to declare a hide method,
          // we can set mainElement and GoJS will hide it automatically
          var myContextMenu = $(go.HTMLInfo, {
            show: this.showContextMenu,
            mainElement: cxElement
          });
          // We don't want the div acting as a context menu to have a (browser) context menu!
          cxElement.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
          }, false);
          this.myDiagram =
            $(go.Diagram, div,  // must name or refer to the DIV HTML element
              {
                // an initial automatic zoom-to-fit
                initialAutoScale: go.Diagram.Uniform,
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                allowDelete: false,
                // support double-click in background creating a new node
//                "clickCreatingTool.archetypeNodeData": {text: "new node"},
                // enable undo & redo
                "undoManager.isEnabled": true,
//                maxSelectionCount: 1,
                layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                  {defaultSpringLength: 30, defaultElectricalCharge: 100}),
                "toolManager.hoverDelay": 200,
                // do an extra layout at the end of a move
                "SelectionMoved": function (e) {
                  if (!$this.editable) {
                    e.diagram.layout.invalidateLayout();
                  }
                }
              });

          this.myDiagram.toolManager.dragSelectingTool.isEnabled = false;
          this.myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
            var data = {};
            if (e.subject.from) {
              data = {startId: e.subject.from, endId: e.subject.to};
            }
            $this.curNode = Object.assign(data, e.subject.params);
          });
          this.myDiagram.addDiagramListener("ObjectDoubleClicked", function (e) {
            var data = {};
            if (e.subject.from) {
              data = {startId: e.subject.from, endId: e.subject.to};
            }
            $this.curNode = Object.assign(data, e.subject.params);
            if ($this.editable) {
              $this.shouldEditorShow = true;
            } else {
              if (e.subject.params.category == 'relation') {
                return;
              }
              var params = {};
              var url = '';
              var instance = null;
              switch (e.subject.params.category) {
                case 'entity':
                  url = "label/three_tuple"
                  params = {ent_id: e.subject.params._id};
                  instance = $this.baseInstance;
                  break;
                case 'tag':
                  url = "tag/three_tuple"
                  params = {tag_id: e.subject.params._id}
                  instance = $this.tagInstance;
                  break;
                default:
                  break;
              }
              instance.get(url, {params: params}).then((res) => {
                console.log(res.data)
                var triples = res.data.data;
                $this.myDiagram.startTransaction("add State");
                triples.forEach((triple) => {
                  if (triple.length === 3) {
                    var model = $this.myDiagram.model;
                    var obj = triple[0];
                    if (triple[0]._id === e.subject.params._id) {
                      obj = triple[2];
                    }
                    var linkdata = {
                      from: triple[0]._id,  // or just: fromData.id
                      to: triple[2]._id,
                      key: triple[1]._id,
                      text: triple[1].name,
                      params: triple[1]
                    };
                    if (obj.colloquial) {
                      obj.colloquial = obj.colloquial.join(',');
                    }
                    if (obj.synonyms) {
                      obj.synonyms = obj.synonyms.join(',');
                    }
                    obj.category = e.subject.params.category;
                    var hasExist = false;
                    for (var i = 0; i < $this.nodeDataArray.length; i++) {
                      if ($this.nodeDataArray[i].key === obj._id) {
                        hasExist = true;
                        $this.myDiagram.findNodeForKey(obj._id).opacity = 1;
                      }
                    }
                    if (!hasExist) {
                      // and add the link data to the model
                      model.addNodeData({
                        key: obj._id,
                        text: obj.name,
                        params: obj,
                      })
                      console.log('addNode')
                    }

                    hasExist = false;
                    for (var i = 0; i < $this.linkDataArray.length; i++) {
                      if ($this.linkDataArray[i].from === linkdata.from && $this.linkDataArray[i].to === linkdata.to && $this.linkDataArray[i].text === linkdata.text) {
                        hasExist = true;
                        $this.myDiagram.findLinkForData($this.linkDataArray[i]).opacity = 1;
                      }
                    }
                    if (!hasExist) {
                      model.addLinkData(linkdata);
                      console.log("addLink")
                    }
                  }
                });
                $this.myDiagram.commitTransaction("add State");
              })
            }
          });
          this.myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
            $this.nodeDataArray.forEach(({key}) => {
              var node = $this.myDiagram.findNodeForKey(key);
              node.opacity = 1;
            });

            $this.linkDataArray.forEach((data) => {
              var link = $this.myDiagram.findLinkForData(data);
              link.opacity = 1;
            });
          });
          //close the mouse right click menu
          this.myDiagram.addDiagramListener("ChangedSelection", function () {
            // console.log($this.myDiagram.selection);
            $this.selections = [];
            $this.myDiagram.nodes.each((node) => {
              node.opacity = 0.1;
            });
            $this.myDiagram.links.each((link) => {
              link.opacity = 0.1;
            });
            $this.myDiagram.selection.each((s) => {
              $this.selections.push(s.data);
              var part = $this.myDiagram.findNodeForKey(s.data.key);
              if (part != null) {
                var nodes = part.findNodesConnected();
                while (nodes.next()) {
                  var child = nodes.value;
//                  if (child.isSelected) {
//                    var betweenLinks = part.findLinksBetween(child);
//                    while (betweenLinks.next()) {
//                      var tem = betweenLinks.value;
//                    }
//                  }
                  child.opacity = 1;
                }
                var links = part.findLinksConnected();
                while (links.next()) {
                  var child = links.value;
                  child.opacity = 1;
                }
                part.opacity = 1;
              }
            });
          });
          //mouse right click
          this.myDiagram.addDiagramListener("ObjectContextClicked", function (e) {
            var data = {};
            if (e.subject.from) {
              data = {startId: e.subject.from, endId: e.subject.to};
            }
            $this.curNode = Object.assign(data, e.subject.params);
            // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            // console.log(scrollTop);
            $this.curNodePosition = $this.getPosition($this.curNode._id);

            $this.nodeDataArray.forEach((n) => {
              if (n.params._id == $this.curNode._id) {
                var location = $this.myDiagram.findNodeForData(n).location;
                var x = location.x;
                var y = location.y;
                $this.selectedLoc = Object.assign({x, y});
              }
            });

            $this.nodeChainList = $this.getChainListContainsTarget($this.curNode._id, false)
          });
          this.myDiagram.commandHandler.doKeyDown = this.shotCut;
          var temColor = '';
          // define the Node template
          this.myDiagram.nodeTemplate =
            $(go.Node, "Auto", {zOrder: 200},
//              {resizable: true},
              {contextMenu: myContextMenu},
              {
                mouseEnter: function (e, node) {
                  node.elt(0).strokeWidth = 0;
                  temColor = node.elt(0).fill;
                  node.elt(0).fill = "rgb(109,206,158)";
                },
                mouseLeave: function (e, node) {
                  node.elt(0).strokeWidth = 2
                  node.elt(0).fill = temColor;
                }
              },
              // define the node's outer shape, which will surround the TextBlock
              $(go.Shape, new go.Binding("figure", "params", function (params) {
                  if (params.category == 'tag') {
                    return 'RoundedRectangle';
                  } else {
                    return 'Circle';
                  }
                }),
                new go.Binding("fill", "color"),
                {
                  parameter1: 20,  // the corner has a large radius
                  stretch: go.GraphObject.Fill,
                  minSize: new go.Size(85, 85),
                  maxSize: new go.Size(85, 85),
                  fill: $(go.Brush, "Radial", {0: "rgb(104,189,246)", 1: "rgb(104,189,246)"}),
                  stroke: "rgb(92,168,219)",
                  strokeWidth: 2,
                  portId: "",  // this Shape is the Node's port, not the whole Node
                  fromLinkable: false, fromLinkableSelfNode: false,
                  toLinkable: false, toLinkableSelfNode: false,
                  cursor: "pointer"
                },
                new go.Binding("text").makeTwoWay(),
                new go.Binding("params").makeTwoWay(),
              ),
              $(go.TextBlock,
                {
                  font: "9pt helvetica, arial, sans-serif",
                  editable: false,  // editing the text automatically updates the model data
                  stroke: "rgb(255,255,255)",
                },
                new go.Binding("text", "text", function (text) {
                  return text.length > 4 ? (text.substring(0, 4) + '...') : text;
                }).makeTwoWay(),
                new go.Binding("params").makeTwoWay())
            );

          // unlike the normal selection Adornment, this one includes a Button
//          this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
//            $(go.Adornment, "Spot",
//              $(go.Panel, "Auto",
//                $(go.Shape, {fill: null, stroke: "rgb(92,168,219)", strokeWidth: 2}),
//                $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
//              ),
//              // the button to create a "next" node, at the top-right corner
//              $("Button",
//                {
//                  alignment: go.Spot.TopRight,
//                  click: addNode
//                },
//                $(go.Shape, "PlusLine", {width: 6, height: 6})
//              ), // end button
//            ); // end Adornment

          this.myDiagram.nodeTemplate.toolTip =
            $(go.Adornment, "Auto",
              $(go.Shape, {fill: "#f5f5f5"}),
              $(go.TextBlock, {
                  margin: 4,
                  font: "11pt helvetica, arial, sans-serif"
                },
                new go.Binding("text", "params", nodeInfo))
            );
          // replace the default Link template in the linkTemplateMap
          this.myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
              {contextMenu: myContextMenu}, {zOrder: 0},
              {
                mouseEnter: function (e, node) {
                  node.elt(0).strokeWidth = 3;
                  node.elt(0).stroke = "rgb(109,206,158)";
                  node.elt(1).stroke = "rgb(109,206,158)";
                  node.elt(1).fill = "rgb(109,206,158)";
                  node.elt(2).elt(1).stroke = "rgb(109,206,158)";
                },
                mouseLeave: function (e, node) {
                  node.elt(0).strokeWidth = 1.5;
                  node.elt(0).stroke = "rgb(165,171,182)";
                  node.elt(1).stroke = "rgb(165,171,182)";
                  node.elt(1).fill = "rgb(165,171,182)";
                  node.elt(2).elt(1).stroke = "rgb(165,171,182)";
                }
              },
              {
                curve: go.Link.Bezier, adjusting: go.Link.Stretch,
//                reshapable: false, relinkableFrom: false, relinkableTo: false,
                toShortLength: 3
              },
//              new go.Binding("points").makeTwoWay(),
              new go.Binding("curviness"),
              $(go.Shape,  // the link shape
                new go.Binding("params").makeTwoWay(),
                new go.Binding("from").makeTwoWay(),
                new go.Binding("to").makeTwoWay(),
                {
                  strokeWidth: 1.5,
                  stroke: "rgb(165,171,182)"
                }),
              $(go.Shape,  // the arrowhead
                {
                  toArrow: "standard",
                  stroke: "rgb(165,171,182)", fill: "rgb(165,171,182)"
                }),
              $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                  {
                    fill: $(go.Brush, "Radial",
                      {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                    stroke: null
                  }),
                $(go.TextBlock, "",  // the label text
                  {
                    textAlign: "center",
                    font: "9pt helvetica, arial, sans-serif",
                    margin: 4,
                    stroke: "rgb(165,171,182)",
                    editable: false  // enable in-place editing
                  },
                  // editing the text automatically updates the model data
                  new go.Binding("params").makeTwoWay(),
                  new go.Binding("from").makeTwoWay(),
                  new go.Binding("to").makeTwoWay(),
                  new go.Binding("text").makeTwoWay())
              )
            );

          function nodeInfo(params) {
            var info = "名称:" + params.name;
            if (params.type_name) {
              info += "\n" + "类型:" + params.type_name;
            }
            if (params.case_cause_name) {
              info += "\n" + "案由:" + params.case_cause_name;
            }
            if (params.property_name) {
              info += "\n" + "属性:" + params.property_name;
            }
            return info;
          }


          function addNode(e, obj) {
            var adornment = obj.part;
            $this.fromNode = adornment.adornedPart.data.params;
            $this.nodeDataArray.forEach((node) => {
              if (node.text === $this.fromNode.name) {
                $this.nodeIndex = $this.nodeDataArray.indexOf(node);
              }
            });
            var position = $this.getPosition($this.fromNode._id);
            $this.shouldAddShow = (position.isHead || position.isTail) && $this.editable;
            if ($this.shouldAddShow === false) {
              if ($this.editable) {
                $this.$message({
                  type: 'warning',
                  message: '只能操作红色节点'
                });
              } else {
                $this.$message({
                  type: 'warning',
                  message: '请进入编辑模式进行修改'
                });
              }
            }
            $this.newRelation.case_cause = $this.fromNode.case_cause;
            $this.nodeChainList = $this.getChainListContainsTarget($this.fromNode._id, true)
          }

          this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
          // Overview
          this.myOverview =
            $(go.Overview, div + '-overview',  // the HTML DIV element for the Overview
              {observed: this.myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan
        });
        // This variation on ForceDirectedLayout does not move any selected Nodes
        // but does move all other nodes (vertexes).
        function ContinuousForceDirectedLayout() {
          go.ForceDirectedLayout.call(this);
          this._isObserving = false;
        }

        go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

        /** @override */
        ContinuousForceDirectedLayout.prototype.isFixed = function (v) {
          return v.node.isSelected;
        };

        // optimization: reuse the ForceDirectedNetwork rather than re-create it each time
        /** @override */
        ContinuousForceDirectedLayout.prototype.doLayout = function (coll) {
          if (!this._isObserving) {
            this._isObserving = true;
            // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
            // so we need to track structural model changes to discard the saved network.
            var lay = this;
            this.diagram.addModelChangedListener(function (e) {
              // modelChanges include a few cases that we don't actually care about, such as
              // "nodeCategory" or "linkToPortId", but we'll go ahead and recreate the network anyway.
              // Also clear the network when replacing the model.
              if (e.modelChange !== "" || (e.change === go.ChangedEvent.Transaction && e.propertyName === "StartingFirstTransaction")) {
                lay.network = null;
              }
            });
          }
          var net = this.network;
          if (net === null) {  // the first time, just create the network as normal
            this.network = net = this.makeNetwork(coll);
          } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
            this.diagram.nodes.each(function (n) {
              var v = net.findVertex(n);
              if (v !== null) v.bounds = n.actualBounds;
            });
          }
          // now perform the normal layout
          go.ForceDirectedLayout.prototype.doLayout.call(this, coll);
          // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
          // here we remember it for next time
          this.network = net;
        }
        // end ContinuousForceDirectedLayout

      },
      getPosition(nodeId) {
        var position = {
          isHead: false,
          isTail: false
        };
        this.chainList.forEach((list) => {
          for (var i in list.data) {
            if (list.data[i].id === nodeId) {
              if (i == 0) {
                position.isHead = true;
              }
              if (i == list.data.length - 1) {
                position.isTail = true
              }
            }
          }
        });
        return position;
      },
      getPositionInLink(nodeId, linkId) {
        for (var j in this.chainList) {
          var list = this.chainList[j];
          if (list.id === linkId) {
            for (var i in list.data) {
              if (list.data[i].id === nodeId) {
                if (i == 0) {
                  return 'head';
                }
                if (i == list.data.length - 1) {
                  return 'tail';
                }
              }
            }
          }
        }
        return 'head';
      },
      getChainListContainsTarget(targetId, isHeadOrTail) {
        //获取包含这个节点的链
        var tem = [];
        this.chainList.forEach((list) => {
          for (var i in list.data) {
            if (list.data[i].id === targetId) {
              if (isHeadOrTail) {
                if (i == 0 || i == list.data.length - 1) {
                  if (tem.indexOf(list.id) < 0) {
                    tem.push(list);
                  }
                }
              } else {
                if (tem.indexOf(list.id) < 0) {
                  tem.push(list);
                }
              }
            }
          }
        });
        return tem;
      },
      formatAddData(data) {
        if (!data) {
          return [];
        }
        var colloquial = [];
        var tem = data.split(/,|，/);
        tem.forEach((t) => {
          if (t != '') {
            colloquial.push(t);
          }
        });
        return colloquial;
      },
      toggle(i) {
        $('.searched .sidebar li:eq(' + i + ')').addClass('on').siblings().removeClass('on');
        switch (i) {
          case 0:
            this.$message({
              type: 'info',
              message: '进入展示模式'
            });
            break;
          case 1:
            this.$message({
              type: 'info',
              message: '进入编辑模式'
            });
            break;
          default:
            break;
        }
      },
      showText(list) {
        this.toggle(0);
        this.showList = false;
        this.highlightChain = list.data;
      },
      chanList() {
        this.showList = true;
      },
      remoteOptions(query) {
        if (query !== '') {
          this.loading.search = true;
          let options = [];
          const params = {
            name: query,
            case_cause: '',
          };
          var types = [{name: 'entity', label: '实体名称'}, {name: 'tag', label: '标签'}, {name: 'relation', label: '关系名称'}];
          var request = [
            this.baseInstance.get('/label/entity/list', {params: params}),
            this.tagInstance.get("/tag/tags", {params: {keyword: query}}),
            this.baseInstance.get('/label/relation/list', {params: params})
          ];
          if (this.searchType == 'tag') {
            types.splice(0, 1);
            types.splice(1, 1);
            request.splice(0, 1);
            request.splice(1, 1);
          }
          Promise.all(request)
            .then((res) => {
              this.loading.search = false;
              this.searchOptions = [];
              res.filter((row, index) => {
                let label = types[index].label;
                if (row.data.data.length) {
                  if (types[index].name == 'tag') {
                    //标签
                    options = row.data.data.map(item => item.zh_name);
                  } else {
                    options = row.data.data.map(item => item.name);
                  }
                  this.searchOptions.push({
                    label: label,
                    options: $.unique(options).map(option => {
                      return {value: option, label: option}
                    })
                  })
                }
              })
            });
        } else {
          this.searchOptions = [];
        }
      },
      search() {
        var _this = this;
        this.nodeDataArray.length = 0;
        this.linkDataArray.length = 0;
        this.divs = [];
        this.$children[0].visible = false;
        var types = ['entity', 'tag']
        var request = [
          this.baseInstance.get('/label/chain/list?case_cause&page=1&page_size=' + this.searchSize + '&pager_flag=true&key_word=' + JSON.stringify(this.keywords)),
          this.tagInstance.get('/tag/chains?page=1&page_size=' + this.searchSize + '&pager_flag=true&keyword=' + JSON.stringify(this.keywords))];
        console.log(13124124124, this.searchType)
        if (this.searchType == 'tag') {
          request.splice(0, 1);
          types.splice(0, 1)
        }
        Promise.all(request)
          .then((response) => {
              this.$children[0].visible = true;
              response.filter((res, resultIndex) => {
                for (var key in res.data.data) {
                  var elem = null;
                  if (types[resultIndex] == 'entity') {
                    elem = res.data.data[key].knowledge_linked;
                  } else {
                    elem = res.data.data[key].chain_linked.map((item) => {
                      item._id = item.id;
                      return item;
                    });
                  }
                  for (var index = 0; index < elem.length; index++) {
                    var obj = elem[index];
                    if (obj.colloquial) {
                      obj.colloquial = obj.colloquial.join(',');
                    }
                    if (obj.synonyms) {
                      obj.synonyms = obj.synonyms.join(',');
                    }
                    if (index % 2 === 0) {
                      obj.category = types[resultIndex];
                      var hasExist = false;
                      for (var i = 0; i < this.nodeDataArray.length; i++) {
                        if (this.nodeDataArray[i].key === obj._id) {
                          if (index === 0 || index === elem.length - 1) {
                            //头尾节点换个色
                            this.nodeDataArray.splice(i, 1, Object.assign({color: 'rgb(251,149,175)'}, this.nodeDataArray[i]));
                          }
                          hasExist = true;
                        }
                      }
                      if (!hasExist) {
                        if (index === 0 || index === elem.length - 1) {
                          //头尾节点换个色
                          this.nodeDataArray.push({
                            key: obj._id,
                            text: obj.name,
                            params: obj,
                            color: 'rgb(251,149,175)'
                          });
                        } else {
                          this.nodeDataArray.push({
                            key: obj._id,
                            text: obj.name,
                            params: obj,
                          });
                        }
                      }
                    } else {
                      obj.category = 'relation';
                      var hasExist = false;
                      for (var i in this.linkDataArray) {
                        var link = this.linkDataArray[i];
                        if (link.text === obj.name && link.from == elem[index - 1]._id && link.to == elem[index + 1]._id) {
                          hasExist = true;
                        }
                      }
                      if (!hasExist) {
                        this.linkDataArray.push({
                          from: elem[index - 1]._id,
                          to: elem[index + 1]._id,
                          text: obj.name,
                          key: obj._id,
                          params: obj,
                        });
                      }
                    }
                  }

                }
                _this.chainList = [];
                for (key in res.data.data) {
                  const data = [];
                  let chain_id = res.data.data[key]._id;
                  var elem = null;
                  if (types[resultIndex] == 'entity') {
                    elem = res.data.data[key].knowledge_linked;
                  } else {
                    elem = res.data.data[key].chain_linked;
                  }
                  elem.forEach((item) => {
                    data.push({
                      name: item.name,
                      type: item.type,
                      property: item.property,
                      category: elem.indexOf(item) % 2 == 0 ? "entity" : "relation",
                      id: item._id
                    })
                  });
                  _this.chainList.push({
                    id: chain_id, //知识链id
                    data: data,
                    case_cause: res.data.data[key].case_cause
                  });
                }
//            console.log(this.option)
              });
              this.init();
            }
          );
      },
      resetChainList(then) {
        this.baseInstance.get('/label/chain/list?case_cause&page=1&page_size=' + this.searchSize + '&pager_flag=true&key_word=' + JSON.stringify(this.keywords))
          .then((res) => {
            this.chainList = [];
            for (var key in res.data.data) {
              const data = [];
              let chain_id = res.data.data[key]._id;
              var elem = res.data.data[key].knowledge_linked;
              elem.forEach((item) => {
                data.push({
                  name: item.name,
                  type: item.type,
                  properties: item.property,
                  category: elem.indexOf(item) % 2 == 0 ? "entity" : "relation",
                  id: item._id
                })
              });
              this.chainList.push({
                id: chain_id, //知识链id
                data: data
              });
            }
            if (then) {
              then();
            }
          });
      },
      shotCut() {
        if (this.shouldAddLinkShow || this.shouldDelShow || this.shouldAddShow || this.shouldEditorShow) {
          return;
        }
        var e = this.myDiagram.lastInput;
        var cmd = this.myDiagram.commandHandler;
        switch (e.key.charCodeAt()) {
          case 68:
          case 66:
            //删除
            if (this.selections.length > 1) {
              this.$message({
                type: 'warning',
                message: '只支持单选'
              });
              return;
            }
            var position = this.getPosition(this.curNode._id);
            if (position.isHead || position.isTail) {
              this.nodeChainList = this.getChainListContainsTarget(this.curNode._id, true);
              if (this.editable) {
                this.shouldDelShow = true;
              } else {
                this.$message({
                  type: 'warning',
                  message: '请进入编辑模式进行修改'
                });
              }
            } else {
              this.$message({
                type: 'warning',
                message: '只能操作红色节点'
              });
            }
            break;
          case 13:
            //回车
            this.shouldAddLinkShow = true;
            break;
          default:
            go.CommandHandler.prototype.doKeyDown.call(cmd);
            break;
        }
      },

      //右键菜单相关操作
      cmdHandler(operation) {
        //多选新建知识链
        if (operation == "新建知识链") {
          this.shouldAddLinkShow = true;
        }
        //新增
        if (operation == "新增") {
          this.addNode(this.curNode);
        }
        //编辑
        if (operation == "编辑") {
          if (this.editable) {
            this.shouldEditorShow = true;
          } else {
            this.$message({
              type: 'warning',
              message: '请进入编辑模式进行修改'
            });
          }
        }
        //替换
        if (operation == "替换") {
          if (this.editable) {
            this.shouldReplaceShow = true;
          } else {
            this.$message({
              type: 'warning',
              message: '请进入编辑模式进行修改'
            });
          }
        }
        //删除
        if (operation == "删除") {
          if (this.selections.length > 1) {
            this.$message({
              type: 'warning',
              message: '只支持单选'
            });
            return;
          }
          var position = this.getPosition(this.curNode._id);
          if (position.isHead || position.isTail) {
            this.nodeChainList = this.getChainListContainsTarget(this.curNode._id, true);
            if (this.editable) {
              this.shouldDelShow = true;
            } else {
              this.$message({
                type: 'warning',
                message: '请进入编辑模式进行修改'
              });
            }
          } else {
            this.$message({
              type: 'warning',
              message: '只能操作红色节点'
            });
          }
        }
      },
    },
    watch: {
      'editable'(val) {
        if (val) {
          this.searchSize = 20;
        } else {
          this.searchSize = 500;
        }
      },
      'highlightChain'(val) {
        if (val) {
          this.myDiagram.clearSelection();
          this.myDiagram.nodes.each((node) => {
            node.opacity = 0.1;
          });
          this.myDiagram.links.each((link) => {
            link.opacity = 0.1;
          });
          val.forEach((n, index) => {
            if (n.category == 'entity' || n.category == 'tag') {
              var node = this.myDiagram.findNodeForKey(n.id);
              node.opacity = 1
              node.isSelected = true;
            } else {
              this.linkDataArray.forEach((link) => {
                if (link.from == val[index - 1].id && link.to == val[index + 1].id) {
                  var node = this.myDiagram.findLinkForData(link);
                  node.opacity = 1
                  node.isSelected = true;
                }
              })
            }
          });
        }
      }
    }
  }

</script>

<style lang="less">

  #search {
    // top: 48px;
    position: relative;
    // bottom: 0;
    // left: 270px;
    // right: 0;
    background: url('../../assets/search/bg.jpg') no-repeat -270px 0 #eff3f4;
    .will {
      padding-top: 53px;
      position: relative;
      &.searched {
        background: #f6f6f6;
        padding: 11px 0;
        .sidebar {
          position: absolute;
          right: 0;
          top: 81px;
          width: 190px;
          z-index: 100;
          ul {
            li {
              height: 46px;
              line-height: 46px;
              font-size: 16px;
              color: #333;
              padding-left: 43px;
              cursor: pointer;
              position: relative;
              background: #f5f7f8;
              border-left: 1px solid #b2d1f1;
              border-right: 1px solid #b2d1f1;
              &.on {
                background: #0a71de;
                color: #fff;
                border-color: #0a71de;
                &:before {
                  content: '';
                  position: absolute;
                  left: -8px;
                  top: 15px;
                  width: 16px;
                  height: 16px;
                  background: #0a71de;
                  -webkit-transform: rotate(45deg);
                  -moz-transform: rotate(45deg);
                  -ms-transform: rotate(45deg);
                  -o-transform: rotate(45deg);
                  transform: rotate(45deg);
                }
              }
              i {
                position: absolute;
                width: 24px;
                height: 100%;
                left: 12px;
              }
              &:first-child {
                border-top: 1px solid #b2d1f1;
              }
              &:nth-child(2) {
                border-top: 1px solid #e8e9ea;
                border-bottom: 1px solid #e8e9ea;
                i {
                  background: url('../../assets/search/result.png') no-repeat center;
                }
                &.on i {
                  background-image: url('../../assets/search/result2.png');
                }
              }
              &:nth-child(3) {
                border-bottom: 1px solid #b2d1f1;
                i {
                  background: url('../../assets/search/result.png') no-repeat center;
                }
                &.on i {
                  background-image: url('../../assets/search/result2.png');
                }
              }
              &:last-child {
                background: #3fbd01;
                color: #fff;
                margin-top: 2px;
                i {
                  background: url('../../assets/search/list.png') no-repeat center;
                }
              }

            }
          }
        }
      }
    }
    .search_box {
      margin: 0px auto;
      height: 55px;
      line-height: 55px;
      width: 824px;
      border: 2px solid #3F93EC;
      position: relative;
      background: #fff;
      display: flex;
      justify-content: space-between;
      .el-select {
        width: 824px;
        .el-select__input {
          font-size: 20px;
          padding-top: 10px;
        }
        > .el-input {
          .el-input__icon {
            display: none;
          }
          .el-input__inner {
            height: 100% !important;
          }
        }
        .el-select__tags {
          height: 45px;
          span {
            border: none;
            padding: 0 5px;
            span {
              height: 36px;
              font-size: 20px;
              padding-top: 7px;
            }
          }
        }
      }
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
        height: 41px;
        line-height: 41px;
        width: 763px;
        margin: 7px 0;
        position: absolute;
        .el-input__inner {
          height: 41px;
          border: none;
          padding: 13px 16px;
          font-size: 16px;
          color: #AFAFAF;
        }
      }
    }
    .form_box {
      margin-left: 50px;
      .el-form-item {
        .el-select {
          width: 320px;
        }
        .el-input {
          width: 320px;
        }
      }
    }
  }

  #main {
    width: 100%;
    height: 100%;

  }

  .chanlist {
    height: 100%;
    background: #fff;
    padding-left: 65px;
    padding-top: 45px;

    dl {
      width: 1180px;
      dt {
        height: 51px;
        line-height: 51px;
        background: #c7ced6;
        color: #016fe7;
        font-size: 18px;
        padding-left: 68px;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          width: 21px;
          height: 100%;
          background: url('../../assets/goujian.png') no-repeat center;
          left: 36px;
        }
      }
      dd {
        height: 40px;
        line-height: 40px;
        padding: 50px 0 50px 14px;
        &:hover {
          border: 1px solid #1278E7;
          cursor: pointer;
        }
        & + dd {
          border-top: 1px dotted #e0e4e9;
        }
        button {
          background: #1278E7;
          font-size: 16px;
          color: #fff;
          margin-bottom: 40px;
          &:hover {
            color: #fff;
            border-color: #bfcbd9;
          }
        }
        > span {
          border-bottom: 1px solid #37BE29;
          color: #37BE29;
          font-size: 16px;
          padding: 2px 5px;
          position: relative;
          top: -6px;
        }
      }
    }
  }

  .link-dialog {
    height: 700px;
  }
</style>
