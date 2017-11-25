<template>
  <div id="LawTagMaintain">
    <div class="graph_box">
      <div class="bread">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
          <el-breadcrumb-item><span style="color: red">{{graph_item.name ? graph_item.name : '暂无图'}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="line_box">
      <div class="line ishover" v-for="(item,index) in List.data">
        <el-button v-if="item.category == 'tag'">{{item.name}}</el-button>
        <span v-if="item.category == 'relation'">{{item.name}}</span>
        <div class="tip">
          <span @click="editItem(index)">修改</span>
          <span @click="delItem(index)">删除</span>
        </div>
      </div>
      <div class="line">
        <el-button class="last-button">待选标签</el-button>
      </div>
      <div class="line">
        <span class="last-span">待选关系</span>
      </div>
      <el-button class="save" @click="construct">保存</el-button>
    </div>
    <div class="list_box">
      <div class="list tag">
        <div class="title">
          <div class="search">
	      	    		<span class="span">
	      	    			<el-select v-model="law" slot="prepend" :loading="loading.law" clearable placeholder="法律分类">
	      	    			    <el-option
                          v-for="item in law_categories"
                          :key="item.id"
                          :label="item.zh_name"
                          :value="item.id">
	      	    			    </el-option>
	      	    			</el-select>
	      	    		</span>
            <el-input placeholder="请输入内容搜索标签" v-model="tagList.value" @change="tagList.page = 1;loadTags()"
                      icon="search">
            </el-input>
          </div>
        </div>
        <div class="content">
          <div class="items" v-loading="loading.tag">
            <template v-for="(item,index) in tagList.data">
              <div class="item" @click="list(item)" :title="item.name"
                   v-text="(item.name.length > 24) ? (item.name.substring(0, 24) + '...') : item.name">
              </div>
            </template>
          </div>
          <i class="add"></i>
          <div class="bottom">
            <el-button type="text" @click="page('prev')" :disabled="tagList.page==1">
              <i class="el-icon-arrow-left"></i>
            </el-button>
            <span class="span">
	      			    	{{tagList.page}} / {{tagList.max_page}} 页
	      			    </span>
            <span class="span">
	      			        前往 <el-input class="number" v-model="tagList.page" @change="loadTags" :min="1"
                                   :max="tagList.max_page"></el-input> 页
	      			    </span>
            <el-button type="text" @click="page('!prev')" :disabled="tagList.has_more==false">
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="list relation">
        <div class="title">
          <p @click="addRelationship">添加关系</p>
          <span>选择关系</span>
          <span><i class="el-icon-search"></i></span>
        </div>
        <div class="content">
          <div class="items">
            <template v-for="(item,index) in relationList.data">
              <div class="item" @click="list(item)">
                <span></span>
                <span>{{item.name}}</span>
                <span></span>
              </div>
            </template>
          </div>
          <div class="bottom">
          </div>
        </div>
      </div>
    </div>
    <div class="main_bottom">
      <el-tabs type="border-card" @tab-click="tabClick" active-name="1">
        <el-tab-pane name="1">
          <span slot="label"><i class="p1"></i> 已完成标签链</span>
          <ul v-loading="loading.chains">
            <li class="clearfloat" v-for="chain in chains">
              <div class="content">
                <div class="left">
                  <el-tooltip placement="top" v-for="(item,index) in chain.data">
                    <div slot="content">{{item.name}}</div>
                    <el-button v-if="index%2==0" v-text="item.name"></el-button>
                    <span v-if="index%2!=0" id="text">{{item.name}}</span>
                    <!-- <span v-if="item.en_name" :id="item.en_name"></span> -->
                    {{item}}
                  </el-tooltip>
                </div>
                <div class="right">
                  <!-- <span @click="edit(chain)" class="edit">修改</span> -->
                  <span @click="copy(chain)" class="copy">复制</span>
                  <span @click="clear(chain)" class="del">删除</span>
                </div>
              </div>
              <p>
                <span>编辑人：{{chain.owner ? chain.owner : '南京擎盾'}}</span>
                <span>最后编辑时间：{{chain.time.substring(0, 19)}}</span>
              </p>
            </li>
          </ul>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="chainList.page"
              :page-sizes="[5,8,10,12,15]"
              :page-size="chainList.pageSize"
              layout="prev, pager, next, sizes, jumper"
              :total="chainList.total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="p2"></i> 查看标签链图谱</span>
          <div v-if="loadings" id="chain-graph">
            <search :list="graphChainList" :isSearch="true" :search-type="'tag'"></search>
          </div>
        </el-tab-pane>
        <div v-loading.body="loading.graph"></div>
      </el-tabs>
      <span>操作</span>
    </div>
    <el-dialog
      class="addRelation"
      title="新建关系"
      :modal="addRelationshipDialogModal"
      v-model="addRelationshipDialog"
      size="tiny">
      <span>关系名称</span>
      <el-input v-model="addRelationshipName" placeholder="请输入关系名称"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRelationshipDialog = false">取 消</el-button>
        <el-button type="primary" @click="concernAddRelationship">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios'
  import Chain from '../Search/Chain.vue';
  import Search from '../Search/Search.vue';
  import HotBox from '../Search/HotBox.vue'
  import go from 'gojs'

  export default {
    data() {
      return {
        addRelationshipName: '',
        keywords: '',
        addRelationshipDialog: false,
        addRelationshipDialogModal: false,
        tagList: {
          value: '',
          data: [],
          pageSize: 10,
          max_page: 1,
          page: 1,
          has_more: false
        },
        graph_id: '',
        relationList: {
          value: '',
          data: []
        },
        List: {
          id: '',
          desc: '',
          data: []
        },
        chains: [],
        chainList: {
          page: 1,
          pageSize: 5,
          total: 5,
          data: [],
        },
        //修改标签或关系的index
        editItemIndex: -1,
        filteredCause: '',
        loading: {
          law: false,
          graph: false,
          tag: false,
          chains: false,
          card: false,
          search: false,
          relation: false,
          entity: false
        },
        loadings: false,
        law: '',
        law_categories: [],
        graphChainList: [],
        searchOptions: [],
        nodeDataArray: [],
        linkDataArray: [],
        baseInstance: null,
        tagInstance: null,
        searchSize: 50
      }
    },
    components: {Search},
    computed: {
      username() {
        return JSON.parse(this.user.config.data).username;
      },
      graph_item() {
        return JSON.parse(sessionStorage.getItem("graph_item")).graph_now || {};
      },
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
      this.pageChains();
      this.loadlaws();
      this.loadTags();
      this.loadRelations();
    },
    watch: {
      'law'(val) {
        console.log('-----', val);
        if (val === 'acbfd39fb22ba188859994e6fc69999e') {
          this.loadTagsCauses();
        }
        this.loadTags();
      },
      graph_item() {
        console.log(this.graph_item);
        if(!graph_item){
          this.$router.go(-1);
        }
      }
    },
    methods: {
      tabClick(tab) {
        if (tab.name == 2) {
          this.loading.graph = true;
          this.init();
        }
      },
      // 添加关系
      concernAddRelationship() {
        const params = {
          rel_name: this.addRelationshipName
        }
        axios.post(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_item.id + '/relationships?axios=1', params).then(res => {
          if (res.data.code === 0) {
            this.$message.success('成功新建关系！');
            this.loadRelations();
          } else {
            this.$message.error(res.data.msg);
            setTimeout(function () {
              this.$router.push('/commongraph');
            }, 1000);
          }
        });
        this.addRelationshipDialog = false;
      },
      addRelationship() {
        this.addRelationshipDialog = true;
      },
      handleSizeChange(val) {
        this.chainList.pageSize = val;
        this.pageChains();
      },
      handleCurrentChange(val) {
        this.chainList.page = val;
        this.pageChains();
      },
      pageChains() {
        var params = {
          page_size: this.chainList.pageSize,
          page: this.chainList.page
        };
        this.loading.chains = true;
        this.graph_id = this.graph_item.id;
        axios.get(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_id + '/chains', {params: params})
          .then((res) => {
            if (res.data.code === 0) {
              this.chainList.total = res.data.pager.total;
              this.chains = [];
              res.data.data.forEach((chain) => {
                var data = [];
                var len = chain.chain_linked.length;
                var length = chain.maintain.length;
                for (var i = 0; i < len; i++) {
                  var elem = chain.chain_linked[i];
                  data.push({
                    id: elem.id,
                    name: elem.name,
                    en_name: elem.en_name ? elem.en_name : '',
                    category: (i % 2 === 0) ? 'tag' : 'relation'
                  })
                }
                this.chains.push({
                  id: chain._id,
                  desc: chain.chain_statement,
                  data: data,
                  owner: chain.maintain[length - 1].user_name,
                  time: chain.maintain[length - 1].operation_time
                });
              })
              this.loading.chains = false;
              console.log(this.chains);
            } else {
              this.$message.error(res.data.msg);
              return;
            }
          }).catch((err) => {
          // this.$message.error('标签链翻页错误');
        })
      },
      init() {
        //获取图的已有标签链
        this.graph_id = this.graph_item.id;
        axios.get(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_id + '/chains?page_size=100')
          .then((res) => {
            if (res.data.code == 0) {
              // this.chains = [];
              res.data.data.forEach((chain) => {
                // var data = [];
                var graphData = {};
                var len = chain.chain_linked.length;
                for (var i = 0; i < len; i++) {
                  var elem = chain.chain_linked[i];
                  // data.push({
                  //   id: elem.id,
                  //   name: elem.name,
                  //   en_name: elem.en_name ? elem.en_name : '',
                  //   category: (i % 2 == 0) ? 'tag' : 'relation'
                  // })
                  graphData = {
                    name: elem.name,
                    colloquial: elem.colloquial,
                    property: elem.property,
                    case_cause: elem.case_cause,
                    category: (i % 2 == 0) ? 'tag' : 'relation',
                    _id: elem.id,
                    key: elem.id,
                    synonyms: elem.synonyms,
                    type: elem.type,
                  }
                  var graphListData = {
                    id: chain._id,
                    key: graphData._id,
                    params: graphData,
                    text: graphData.name,
                  };
                  if (graphData.category == 'relation') {
                    graphListData.from = chain.chain_linked[i - 1].id;
                    graphListData.to = chain.chain_linked[i + 1].id;
                  }
                  var hasExisted = false;
                  this.graphChainList.forEach((item) => {
                    if (graphListData.params.category == 'entity') {
                      if (item.key == graphListData.key) {
                        hasExisted = true;
                      }
                    } else {
                      if (item.from == graphListData.from && item.key == graphListData.key && item.to == graphListData.to) {
                        hasExisted = true;
                      }
                    }
                  });
                  if (!hasExisted) {
                    this.graphChainList.push(graphListData);
                  }
                }
                // this.chains.push({
                //   id: chain._id,
                //   desc: chain.chain_statement,
                //   data: data,
                //   owner: chain.maintain[1].user_name,
                //   time: chain.maintain[1].operation_time
                // });

                // this.chainList.data = this.chains.slice(0, this.chainList.pageSize);
              })
            } else {
              setTimeout(function () {
                this.$router.push('/commongraph');
              }, 1000);
              return;
            }
            this.loadings = true;
            this.loading.graph = false;
          }).catch((err) => {
          // this.$message.error('加载标签链错误');
        });
      },
      //获取图的所有关系
      loadRelations() {
        axios.get(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_id)
          .then((res) => {
            if (res.data.code == 0) {
              this.relationList.data = [];
              res.data.data.rels.forEach((rel) => {
                this.relationList.data.push({
                  id: rel.id,
                  name: rel.name,
                  en_name: rel.en_name,
                  category: "relation"
                })
              })
            } else {
              this.$message.error(res.data.msg);
              return;
            }
          }).catch((err) => {
          this.$message.error('加载关系错误');
          setTimeout(function () {
            this.$router.push('/commongraph');
          }, 1000);
        })
      },
      // 选择案由获得标签
      loadTagsCauses() {

      },
      //获取所有tags
      loadTags() {
        var params = {
          keyword: this.tagList.value ? this.tagList.value : '',
          law_type: this.law ? this.law : '',
          page_size: this.tagList.pageSize,
          page: this.tagList.page,
        };
        this.loading.tag = true;
        axios.get(this.$store.state.TagUrl + '/api/tag/tags', {params: params}).then((res) => {
          if (res.data.code == 0) {
            this.tagList.has_more = res.data.pager.has_more;
            this.tagList.max_page = res.data.pager.max_page;
            this.tagList.data = [];
            res.data.data.forEach((elem) => {
              this.tagList.data.push({
                id: elem.id,
                name: elem.zh_name,
                category: 'tag'
              });
            });
            this.loading.tag = false;
          } else {
            this.$message.error(res.data.msg);
            this.loading.tag = false;
            return;
          }
        }).catch((err) => {
          // this.$message.error('加载标签错误');
        })
      },
      //加载法律分类
      loadlaws() {
        this.loading.law = true;
        axios.get(this.$store.state.TagUrl + '/api/tag/law_categorys').then((res) => {
          if (res.data.code == 0) {
            this.loading.law = false;
            this.law_categories = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      page(el) {
        el == 'prev' ? this.tagList.page-- : this.tagList.page++;
        this.loadTags();
      },
      //建标签链
      list(item) {
        if (this.editItemIndex != -1) {
          var index = this.editItemIndex;
          $('.' + this.List.data[index].category).removeClass('dark').siblings().removeClass('dark');
          if (this.List.data[index].category == item.category) {
            this.$set(this.List.data, index, item);
            $('.ishover').eq(index).removeClass('hover');
            this.editItemIndex = -1;
            if (this.List.data.length % 2 == 0) {
              $('.tag').removeClass('dark');
              $('.relation').addClass('dark');
            } else {
              $('.relation').removeClass('dark');
              $('.tag').addClass('dark');
            }

          }
        } else {
          var len = this.List.data.length;
          if (item.category == 'relation' && (len + 1) % 2 == 0) {
            this.List.data.push(item);
            $('.last-span').css('display', 'none');
            $('.tag').removeClass('dark');
            $('.relation').addClass('dark');
          }
          if (item.category == 'tag' && (len + 1) % 2 == 1) {
            this.List.data.push(item);
            $('.last-button').css('display', 'none');
            $('.relation').removeClass('dark');
            $('.tag').addClass('dark')
          }
        }
      },
      // 删除链中的标签或关系
      delItem(index) {
        this.List.data.splice(index);
        $('.list').removeClass('dark');
        if (index % 2 == 0) {
          $('.relation').addClass('dark');
        } else {
          $('.tag').addClass('dark');
        }
        if (index == 0) {
          $('.last-button').css('display', 'block');
          $('.last-span').css('display', 'block');
        }

      },
      // 修改单个标签或关系
      editItem(index) {
        this.editItemIndex = index;
        $('.ishover').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
        $('.ishover').eq(index).siblings().removeClass('hover').find('.tip span:first-child').removeClass('hover');
        if (index % 2 == 0) {
          $('.tag').removeClass('dark');
          $('.relation').addClass('dark');
        } else {
          $('.relation').removeClass('dark');
          $('.tag').addClass('dark');
        }
      },
      //保存新建标签链
      construct() {
        var length = this.List.data.length;
        var data = [];
        this.List.data.forEach((elem) => {
          data.push(elem.id);
        });
        //判断标签链的格式是否标准
        if ((length - 1) % 2 == 0) {
          axios.post(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_id + '/chains?axios=1', {
            chain_linked: JSON.stringify(data),
            // user_name:this.username
          }).then((res) => {
            if (res.data.code == 0) {
              this.$message.success('保存成功');
              this.init();
              this.pageChains();
            } else {
              this.$message.error(res.data.msg);
              return;
            }
          })
          this.List = {
            id: '',
            data: []
          };
          $('.relation').removeClass('dark');
          $('.tag').removeClass('dark');
          $('.last-button').css('display', 'block');
          $('.last-span').css('display', 'block');
        } else {
          this.$message.warning('标签链应以标签结尾，无法保存！');
        }
      },
      // 修改标签链
      edit(chain) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.List = JSON.parse(JSON.stringify(chain));
        $('.last-span,.last-button').css('display', 'none');
        $('.list').removeClass('dark');
      },
      // 复制标签链
      copy(chain) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.List = JSON.parse(JSON.stringify(chain));
        this.List.id = null;
        $('.last-span,.last-button').css('display', 'none');
        $('#unselected').css('display', 'none');
        $('#selected').css('display', 'block');
      },
      // 删除标签链
      clear(chain) {
        this.$confirm('此操作将删除图中该标签链, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(this.$store.state.TagUrl + '/api/tag/graphs/' + this.graph_id + '/chains/' + chain.id).then((res) => {
            if (res.data.code == 0) {
              this.$message.success('删除成功');
              this.init();
              this.pageChains();
            } else {
              this.$message.error(res.data.msg);
              return;
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除");
        });

      },
      search() {
        var _this = this;
        this.nodeDataArray.length = 0;
        this.linkDataArray.length = 0;
        this.divs = [];
        this.$children[0].visible = false;
        Promise.all([
          this.baseInstance.get('/label/chain/list?case_cause&page=1&page_size=' + this.searchSize + '&pager_flag=true&key_word=' + JSON.stringify(this.keywords)),
          this.tagInstance.get('/tag/chains?page=1&page_size=' + this.searchSize + '&pager_flag=true&keyword=' + JSON.stringify(this.keywords))])
          .then((response) => {
              this.$children[0].visible = true;
              response.filter((res, resultIndex) => {
                for (var key in res.data.data) {
                  var elem = null;
                  if (resultIndex == 0) {
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
                      obj.category = resultIndex == 0 ? 'entity' : 'tag';
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
                this.chainList = [];
                for (key in res.data.data) {
                  const data = [];
                  let chain_id = res.data.data[key]._id;
                  var elem = null;
                  if (resultIndex == 0) {
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
                  this.chainList.push({
                    id: chain_id, //知识链id
                    data: data,
                    case_cause: res.data.data[key].case_cause
                  });
                }
              });
              this.init();
            }
          );
      },
      remoteOptions(query) {
        if (query !== '') {
          this.loading.search = true;
          let options = [];
          const params = {
            name: query,
            case_cause: '',
          };
          Promise.all([
            this.baseInstance.get('/label/entity/list', {params: params}),
            this.tagInstance.get("/tag/tags", {params: {keyword: query}}),
            this.baseInstance.get('/label/relation/list', {params: params})
          ])
            .then((res) => {
              this.loading.search = false;
              this.searchOptions = [];
              res.filter((row, index) => {
                let label = index == 0 ? '实体名称' : (index == 1 ? '标签' : '关系名称');
                if (row.data.data.length) {
                  if (index == 1) {
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
    }
  }
</script>

<style lang="less">

  #LawTagMaintain {
    .el-button {
      /* max-width:200px; */
      white-space: initial;
      line-height: initial;
    }
    .list_box {
      width: 80%;
      margin: auto;
      margin-top: 2%;
      display: flex;
      justify-content: space-between;
      .list {
        width: 45%;
        /* height: 490px; */
        height: 600px;
        text-align: center;
        &.dark {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, .5);
            width: 100%;
            height: 572px;
          }
        }
        .title {
          width: 100%;
          height: 55px;
          line-height: 55px;
          font-size: 18px;
          display: flex;
          justify-content: space-around;
          p {
            display: inline-block;
            max-width: 120px;
            color: #fff;
            &:hover {
              cursor: pointer;
            }
          }
          span {
            max-width: 120px;
            color: #fff;
            i {
              font-size: 20px;
              /* width:60px; */
            }
          }
        }
        .search {
          width: 98%;
          height: 70%;
          margin-top: 7px;
          line-height: 45px;
          padding-right: 25px;
          display: flex;
          justify-content: space-around;
          .span {
            width: 30%;
            height: 95%;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            .el-select {
              height: 98%;
              margin-top: 2%;
              .el-input {
                width: 100%;
                height: 98%;
                line-height: 40px;
                border: none;
                .el-input__inner {
                  height: 32px;
                  font-size: 18px;
                }
                .el-input__icon {
                  top: 60%;
                }
                .is-show-close{
                  top:35px;
                }
              }
            }
          }
          .el-input {
            width: 60%;
            height: 32px;
            border-radius: 0;
            .el-input__inner {
              color: #fff;
              font-size: 16px;
              height: 100%;
              border: 0;
              border-radius: 20px;
            }
          }
        }
        .content {
          height: 86%;
          border: 1px solid #2282E9;
          border-top: 0;
          .items {
            /* height: 86%; */
            height: 90%;
            /* overflow-y: scroll; */
            .item {
              height: 45px;
              line-height: 45px;
              font-size: 16px;
              color: #2282E9;
              cursor: pointer;
              display: flex;
              justify-content: space-around;
              border-bottom: 2px solid #9DC7F4;
              white-space: initial;
              &:hover {
                color: #fff;
                background: #67A6ED;
              }
            }
            .even {
              background: #F5F5F5;
            }
          }
          /*.add{*/
          /*display: block;*/
          /*width: 40px;*/
          /*height: 40px;*/
          /*background: url('../../assets/relation/add.png') center no-repeat;*/
          /*}*/
          .bottom {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px;
            .el-button {
              text-align: center;
              width: 40px;
              height: 40px;
              border-radius: 30px;
              margin-top: 5px;
              &:hover {
                background: #f5f5f5;
              }
            }
            .span {
              color: #20a0ff;
              line-height: 45px;
              border: 0;
              padding: 0 5px;
              font-size: 14px;
              .number {
                width: 44px;
                height: 20px;
                border: none;
                .el-input__inner {
                  width: 40px;
                  height: 20px;
                  color: #20a0ff;
                  padding: 0;
                  border-radius: 0;
                  text-align: center;
                  &:hover {
                    background: #F5F5F5
                  }
                }
              }
            }
          }
        }
        &.tag {
          input::-webkit-input-placeholder { /* WebKit browsers */
            color: #fff;
            font-size: 18px;
            padding-left: 2px;
          }
          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #fff;
            font-size: 18px;
            padding-left: 2px;
          }
          input::-moz-placeholder { /* Mozilla Firefox 19+  */
            color: #fff;
            font-size: 18px;
            padding-left: 2px;
          }
          input:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #fff;
            font-size: 18px;
            padding-left: 2px;
          }
          .title {
            background: #2282E9;
          }
          .search {
            .el-input {
              .el-input__inner {
                background: #0053AF;
              }
              .el-input__icon {
                line-height: inherit;
              }
            }
            .span {
              background: #2282E9;
              .el-input__inner {
                background: #2282E9;
              }
            }
          }
        }
        &.relation {
          .title {
            background: #2282E9;
          }
          .content {
            overflow-y: scroll;
          }
          .item {
            span {
              width: 25%;
              height: 45px;
            }
          }
          .is-disabled {
            color: #bfcbd9;
          }
        }
      }
    }
    .line_box {
      width: 80%;
      margin-top: 60px;
      margin-left: 10%;
      .save {
        background: #fff;
        border: none;
        position: absolute;
        right: 10%;
        top: 130px;
        background: url('../../assets/lawtag/save1.png') no-repeat center;
        font-size: 0;
        width: 95px;
        height: 45px;
        &:hover {
          background: url('../../assets/lawtag/save2.png') no-repeat center;
        }
      }
      .line {
        position: relative;
        display: inline-block;
        margin-top: 20px;
        margin-bottom: 25px;
        button {
          background: #fff;
          color: #1278E7;
          border-radius: 5px;
          border: 1px solid #1278E7;
          font-size: 16px;
          &.last-button {
            color: #ACACAC;
            font-size: 14px;
            background: #F6F6F6;
            border: 1px dotted #D2D2D2;
          }
        }
        &.ishover:hover, &.hover {
          button {
            background: #67A6ED;
            color: #fff;
            font-size: 18px;
            border-color: #67A6ED;
            min-width: 150px;
          }
          .tip {
            opacity: 1;
          }
          > span {
            color: #37BE29;
            border-radius:5px;
            border:1px solid #37BE29;
            padding: 9px 20px;
            margin:0 3px;
            top: 0;
            min-width: 60px;
          }
        }
        > span {
          border-bottom: 1px solid #37BE29;
          display: inline-block;
          color: #37BE29;
          font-size: 16px;
          padding: 2px 12px;
          position: relative;
          top: -6px;
          cursor: pointer;
          text-align: center;
          &.last-span {
            color: #ACACAC;
            font-size: 14px;
            border-color: #ACACAC;
          }
        }
        .tip {
          position: absolute;
          height: 100%;
          width: 100%;
          text-align: center;
          line-height: 100%;
          bottom: 100%;
          left: 0;
          border-color: #000;
          opacity: 0;
          span {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin: 0 5px;
            cursor: pointer;
            background: url('../../assets/r3/edit.png') no-repeat center;
            font-size: 0;
            &:hover, &.hover {
              background-image: url('../../assets/structure/edit_hover.png');
            }
            &:last-child {
              background-image: url('../../assets/r3/delete.png');
              &:hover, &.hover {
                background-image: url('../../assets/structure/del_hover.png');
              }
            }
          }
        }
      }
    }
    .graph_box {
      width: 100%;
      height: 40px;
      background: #ddd;
      .name {
        width: 80%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        margin: 0 auto;
      }
      .bread {
        width: 80%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        margin: 48px auto;
        > .el-breadcrumb {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .main_bottom {
      width: 80%;
      margin: 80px auto;
      position: relative;
      & > span {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 19%;
        height: 42px;
        line-height: 42px;
        text-align: center;
        color: #004DA1;
        border-left: 1px solid #004DA1;
        font-size: 16px;
      }
      .el-tabs--border-card {
        border: none;
        box-shadow: none;
        .el-tabs__header {
          border: none;
          background: #C7CED6;
          .el-tabs__item {
            font-size: 18px;
            padding-left: 30px;
            > span {
              position: relative;
              padding-left: 36px;
            }
            i {
              display: inline-block;
              position: absolute;
              top: -1px;
              left: 0;
              width: 24px;
              height: 24px;
              background: url('../../assets/r3/p1_1.png') no-repeat center;
              &.p2 {
                background-image: url('../../assets/r3/p2_1.png');
              }
            }
            &.is-active {
              background: #C7CED6;
              color: #016FE7;
              /* border-right-color:#016FE7; */
              .p1 {
                background-image: url('../../assets/r3/p1_2.png');
              }
              .p2 {
                background-image: url('../../assets/r3/p2_2.png');
              }
            }
          }
        }
        .el-tabs__content {
          padding: 50px 0;
          .el-tab-pane > ul {
            li {
              list-style: none;
              min-height: 112px;
              line-height: 112px;
              border: 1px solid #D2D2D2;
              padding: 5px 15px;
              background: #FAFAFA;
              .content {
                display: flex;
                justify-content: space-between;
                padding-left: 10px;
                .left {
                  width: 81%;
                  float: left;
                  button {
                    background: #fff;
                    color: #1278E7;
                    border-radius: 5px;
                    border: 1px solid #1278E7;
                    font-size: 16px;
                    margin-bottom: 40px;
                  }
                  > span {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                  }
                  #text {
                    position: relative;
                    color: #37BE29;
                    font-size: 16px;
                    line-height: initial;
                    top: -10px;
                    padding: 2px 12px;
                    width: initial;
                    border-bottom: 1px solid #37BE29;
                    text-align: center;
                  }
                }
                .right {
                  width: 17.9%;
                  float: right;
                  height: 112px;
                  /* line-height: 112px; */
                  line-height: 42px;
                  text-align: center;
                  display: flex;
                  justify-content: space-around;
                  span {
                    width: 24px;
                    height: 100%;
                    font-size: 0;
                    cursor: pointer;
                    &.edit {
                      background: url('../../assets/change.png') no-repeat center;
                      &:hover {
                        background-image: url('../../assets/structure/edit_hover.png');
                      }
                    }
                    &.copy {
                      background: url('../../assets/structure/copy.png') no-repeat center;
                      &:hover {
                        background-image: url('../../assets/structure/copy_hover.png');
                      }
                    }
                    &.del {
                      background: url('../../assets/r3/delete.png') no-repeat center;
                      &:hover {
                        background-image: url('../../assets/structure/del_hover.png');
                      }
                    }
                  }
                }
              }
              p {
                border-top: 2px dotted #D2D2D2;
                height: 48px;
                line-height: 48px;
                font-size: 14px;
                color: #7B8895;
                span {
                  margin: 0 18px;
                }
              }
              & + li {
                margin-top: 49px;
              }
            }
          }
          .pagination {
            display: inline-block;
            width: 100%;
            height: 100px;
            margin: 30px auto;
          }
        }
      }
    }
    .addRelation {
      top: -10%;
      .el-dialog {
        .el-dialog__body {
          height: 80px;
          > span {
            font-size: 16px;
            color: #666;
            font-weight: 600;
            line-height: 40px;
            margin-left: 20px;
          }
          .el-input {
            display: inline-block;
            width: 50%;
            margin-left: 20px;
          }
        }
      }
    }
    #search_container {
      height: 40px;
      margin: -20px auto;
      line-height: 40px;
      width: 824px;
      border: 2px solid #3F93EC;
      position: relative;
      background: #fff;
      .el-select {
        width: 824px;
        height: 40px;
        .el-select__input {
          font-size: 20px;
          padding-top: 2px;
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
          height: 35px;
          span {
            border: none;
            padding: 0 5px;
            span {
              height: 30px;
              font-size: 20px;
              padding-top: 2px;
            }
          }
        }
      }
      > i {
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        width: 60px;
        height: 35px;
        margin: 2px 0;
        border-left: 1px solid #3f93ec;
        background: url('../../assets/search/search.png') no-repeat center;
        cursor: pointer;
      }
      .el-input {
        display: inline-block;
        height: 35px;
        line-height: 35px;
        width: 700px;
        margin: 2px 0;
        position: absolute;
        .el-input__inner {
          height: 35px;
          border: none;
          font-size: 16px;
          color: #AFAFAF;
        }
      }
    }
    #chain-graph {
      width: 100%;
      height: 800px;
    }
  }
</style>

