<template>
  <div class="notext" id="notext" v-loading.body.lock="fullscreenLoading">
    <div class="nowTag"><span>当前标签：</span><p>{{tagData.zh_name}}</p>
    </div>
    <search :option="caseCause" @select="select" style="background: #D4DFEB; margin-top: -10px"></search>
    <div class="main">
      <div class="main_top">
        <div class="line_box">
          <div class="line ishover" v-for="(item,index) in List">
            <el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
            <span v-if="item.category == 'relation'">{{item.name}}</span>
            <div class="tip">
              <span @click="editItem(item.category,index)">修改</span>
              <span @click="delItem(index,List)">删除</span>
            </div>
          </div>
          <div class="line">
            <el-button class="last-button">待选实体</el-button>
          </div>
          <div class="line">
            <span class="last-span">待选关系</span>
          </div>
        </div>

        <el-button class="save" @click="save">保存</el-button>
      </div>
      <div class="main_center">
        <div class="list_box">
          <div class="list entity">
            <div class="left">
              <div class="entprop">
                <h2>属性列表<i @click="addEntProp" class="el-icon-plus addEnt"></i></h2>
                <ul>
                  <li v-for="(item,index) in entity.properties" @click="getEntityName(item._id,index)">
                    {{item.name}}
                  </li>
                </ul>
                <p>
                  <i @click="add('entity')"></i>
                </p>
              </div>
              <div class="entname">
                <h2>
                  <span v-show="!searchShow1"><i @click="searchShow1 = true"></i>实体名称</span>
                  <p v-show="searchShow1">
                    <!-- <input type="text" v-model="keyword" placeholder="请输入内容" @change.native="searchEntity(keyword)"> -->
                    <str-input @search="searchEntity" @reload="reloadEn" ref="search_en"></str-input>
                    <i @click="searchShow1 = false;$refs.search_en.input='';getEntityName();">关闭</i>
                  </p>

                </h2>

                <ul v-loading="en_loading">
                  <li v-for="(item,index) in entity.name" @click="list(item,'entity');recommendRe(item._id)">{{item.name}}</li>
                </ul>
              </div>
            </div>
            <div class="right">
              <h2>实体类型</h2>
              <ul>
                <li v-for="(item,index) in entity.type" @click="chooseEntityType(item,index)">{{item.name}}</li>
              </ul>
            </div>
          </div>
          <div class="list relation">
            <div class="title">
              <span v-show='!searchShow2'><i @click="searchShow2 = true;"></i>关系内容</span>
              <p v-show='searchShow2'>
                <str-input @search="searchRelation" @reload="reloadRe" ref="search_re"></str-input>
                <i @click="searchShow2 = false;$refs.search_re.input='';getRelation(params.case_cause);">关闭</i>
              </p>
              <span>关系类型</span>
              <span>关系属性</span>
            </div>
            <ul v-loading="re_loading">
              <li v-for="item in relations" @click="list(item,'relation')">
                <span>{{item.name}}</span>
                <span>{{item.type_name}}</span>
                <span>{{item.property?item.property :'/'}}</span>
              </li>
            </ul>
            <p>
              <i @click="add('relation')"></i>
            </p>
          </div>
        </div>
      </div>
      <div class="main_bottom">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="当前标签下的链" name="1">
            <div class="tab_content">
              <div class="tab1" v-loading="chain_loading">
                <ul>
                  <li class="clearfloat" v-for="(list,index) in tagChainList">
                    <div class="content">
                      <div class="left">
                        <el-tooltip placement="top" v-for="item in list.data">
                          <div slot="content">类型：{{item.type_name}}<br/>属性：{{item.properties}}</div>
                          <el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
                          <span v-if="item.category == 'relation'">{{item.name}}</span>
                          {{item}}
                        </el-tooltip>
                      </div>
                      <div class="right">
                        <span @click="edit(list)" class="edit">修改</span>
                        <span @click="copy(list)" class="copy">复制</span>
                        <span @click="clear(list.id,index)" class="del">删除</span>
                      </div>
                    </div>
                    <p>
                      <span>编辑人：{{list.owner?list.owner:'南京擎盾'}}</span>
                      <span>最后编辑时间：{{list.time.substr(0,10)}}</span>
                    </p>
                  </li>
                </ul>
              </div>
              <div class="tab2">

              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="当前案由下的链" name="2">
            <div class="tab_content">
              <div class="tab1" v-loading="chain_loading">
                <ul>
                  <li class="clearfloat" v-for="(list,index) in chainList">
                    <div class="content">
                      <div class="left">
                        <el-tooltip placement="top" v-for="item in list.data">
                          <div slot="content">类型：{{item.type_name}}<br/>属性：{{item.properties}}</div>
                          <el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
                          <span v-if="item.category == 'relation'">{{item.name}}</span>
                          {{item}}
                        </el-tooltip>
                      </div>
                      <div class="right">
                        <span @click="edit(list)" class="edit">修改</span>
                        <span @click="copy(list)" class="copy">复制</span>
                        <span @click="clear(list.id,index)" class="del">删除</span>
                      </div>
                    </div>
                    <p>
                      <span>编辑人：{{list.owner?list.owner:'南京擎盾'}}</span>
                      <span>最后编辑时间：{{list.time.substr(0,10)}}</span>
                    </p>
                  </li>
                </ul>
              </div>
              <div class="tab2">

              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <div class="top" v-show="topShow" @click="needToTop"></div>

    <div>
      <div class="mask" v-show="popshow || popshow2"></div>
      <popup v-show="popshow" @hide="popshow=false" :info="addInfo"></popup>
      <popup-entity v-show="popshow2" @hide="popshow2=false" :info="addInfo"></popup-entity>
    </div>

    <el-dialog
      title="添加实体属性"
      v-model="dialogVisible"
      size="tiny">
      <el-input v-model="newentprop" placeholder="请输入实体属性"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEntProp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from '../../js/axios-api.js';
  import search from '../Structure/SearchItem';
  import Popup from '../Structure/Popup2'
  import Popup2 from '../Structure/Popup3'
  import Strinput from '../Structure/input'
  export default {
    data () {
      return {
        chainTag : {
        id: '',
        table: 'label_chain',
        graph_type: '51722bf44f6d9fb60ef7beb466286b43',
        chain_rules: [],
        rules:[]
      },
        // 标签数据
//        tagData: {},
        activeName: '1',
        newentprop:'',
        dialogVisible:false,
        fullscreenLoading:true,
        re_loading:false,
        en_loading:false,
        chain_loading:false,
        keyword:'',
        searchShow1:false,
        searchShow2:false,
        popshow:false,
        popshow2:false,
        editList:[],
        addInfo:{
          // title:'实体内容添加列表',
          // name:'实体名称',
          // type:'实体类型',
          // attr:'实体属性',
          // typeOption:[]
        },
        relation_options:[],
        caseCause:{
          options:[],
          tag:'case_cause',
          title:'案由选择',
          msg:'点击选择案由'
        },
        topShow:true,
        paraTag: {},
        entity:{
          properties:[],
          type:[],
          name:[],
          typeSelect:{}
        },
        relations:{

        },
        params:{
          case_cause:'',
          name:'',
          property:'',
        },
        List:[
          // {
          //  name:"疾病",
          //  type:"类型",
          //  properties:"属性",
          //  category:"entity"
          // },
          // {
          //  name:"并且",
          //  type:"类型",
          //  properties:"属性",
          //  category:"relation"
          // },
        ],
        TagDataFromSearch:{},
        listId:'',
        listOwner:'',
        editItemIndex:-1,
        chainList:[],
        tagChainList: []
      }
    },
    components:{
      'search' : search,
      'popup' : Popup,
      'popup-entity' : Popup2,
      'str-input' : Strinput
    },
    computed:{
      user:function(){
        return this.$store.state.user;
      },
      tagData() {
          return this.$store.state.tagData.dataTag || {};
      },
      username(){
        return JSON.parse(this.user.config.data).username
      }
    },
    mounted(){
      this.getTagChainList();
      this.getEntityType();
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 3000);
      this.$nextTick(function () {
        window.addEventListener('scroll', () => {
          const curHeight = document.body.scrollTop || document.documentElement.scrollTop;
          if (curHeight > 800) {
            this.topShow = true;
          } else {
            this.topShow = false;
          }
        });
      });
    },
    methods:{
      saveEntProp(){
        const params = {
          name:this.newentprop
        }
        axios.post(this.$store.state.url1 + '/api/nlp/label/property?axios=1',params)
          .then(res => {
            console.log(res,111);
          })
      },
      addEntProp(){
        this.dialogVisible = true;
      },
      copy(list){
        this.List = list.data.slice(0);
        $('.last-span,.last-button').css('display', 'none');
        $('.list').removeClass('dark');
      },
      reloadRe(val){
        if(!val){
          this.getRelation(this.params.case_cause);
        }
      },
      reloadEn(val){
        if(!val){
          this.getEntityName();
        }
      },
      // 搜索关系
      searchRelation(keyword){
        this.re_loading = true;
        const params = {
          case_cause:this.params.case_cause,
          name:keyword
        }
        axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list?pager_flag=false',{params:params})
          .then((res) => {
            this.re_loading = false;
            if(!res.data.data.length){
              this.$message.warning('没有该项记录！')
            }else{
              this.relations = [];
              res.data.data.map(row => {
                this.relations.push({
                  _id:row._id,
                  name:row.name,
                  property:row.property,
                  type:row.type,
                  type_name:row.type_name
                })
              })
            }
          }).catch((res) => {
          console.log('err2')
        })
      },
      // 搜索实体
      searchEntity(keyword){
        this.en_loading = true;
        const params = {
          case_cause:this.params.case_cause,
          name:keyword
        }
        axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list?pager_flag=false',{params:params})
          .then((res) => {
            this.en_loading = false;
            this.entity.name = [];
            res.data.data.map(row => {
              this.entity.name.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type
              })
            })
          }).catch((res) => {
          console.log('er2r')
        })

      },
      // 推荐关系
      recommendRe(id){
        const params = {
          entity_id : id,
          case_cause : this.params.case_cause
        };
        axios.get(this.$store.state.url1 + '/api/nlp/label/relation/recommend',{params:params})
          .then((res) => {
            let recommend = [];
            res.data.recommend_relations.map(row => {
              recommend.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type,
                type_name:row.type_name
              })
            })
            this.relations = recommend.concat(this.relations);
          }).catch((err) => {
          console.log(err)
        })
      },
      // 修改知识链
      edit(tagData){
          console.log('传过来的标签', tagData);
      },
      // 删除知识链
      clear(id,index){
        this.$confirm('此操作将永久删除该知识链, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(this.$store.state.url1 + '/api/nlp/label/chain/list?user_name='+this.username+'&ids=' + JSON.stringify([id]))
            .then((res) => {
              if(res.data.code == 0){
                this.$message.success("删除成功!");
                this.chainList.splice(index,1);
              }else{
                this.$message.warning(res.data.msg);
              }
            }).catch((res) => {
            console.log('err111')
          });
        }).catch(() => {
          this.$message.info("已取消删除！");
        });
      },
      dataFormat(){
        let params = {
          knowledge_linked:[],
          case_cause:this.params.case_cause,
          user_name:this.username,
          app_id:'596c626a331fdb4418fb2d43'
        };
        this.List.map((elem, index) => {
          params.knowledge_linked.push({
            _id:elem._id,
            name:elem.name,
            type:elem.type,
            property:elem.property
          });
        });
        return params;
      },
      save(){
        let params = this.dataFormat();
        params.knowledge_linked = JSON.stringify(params.knowledge_linked);
        var length = this.List.length;
        if(this.listId){
          params.id = this.listId;
          this.listId = '';
          if(this.List[length - 1].category == "entity"){
            axios.put(this.$store.state.url1 + '/api/nlp/label/chain?axios=1',params)
              .then((res) => {
                if(res.data.code == 1){
                  this.$confirm('你无权修改此链, 是否申请修改?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    const params2 = {
                      from_user:this.username,
                      to_user:this.listOwner,
                      type:'change',
                      chain_id:params.id,
                      knowledge_linked:params.knowledge_linked
                    }
                    axios.post(this.$store.state.MessageUrl + '/api/nlp/personal/message?axios=1',params2)
                      .then((res) => {
                        console.log(res)
                      })
                  }).catch(() => {
                    this.$message.info("已取消修改");
                  });
                }else{
                  this.List = [];
                  this.getChainList();
                  this.saveTagChains();
                  $('.last-span,.last-button').css('display', 'block');
                  $('.entity').removeClass('dark').siblings().addClass('dark');
                }
              }).catch((res) => {
              console.log(res)
            })
          }else{
            this.$message.warning('知识链格式不正确，无法保存！');
          }
        }else{
          if(this.List[length - 1].category == "entity"){
            axios.post(this.$store.state.url1 + '/api/nlp/label/chain?axios=1',params)
              .then((res) => {
                if(res.data.code == 0){
                  this.List = [];
                  this.saveTagChains(res.data.data.chain_id);
                  this.getChainList();
                  this.$message.success("保存成功！");
                  $('.last-span,.last-button').css('display', 'block');
                  $('.entity').removeClass('dark').siblings().addClass('dark');
                }else{
                  this.$message.warning(res.data.msg);
                }

              }).catch((res) => {
              console.log(res)
            })
          }else{
            this.$message.warning('知识链格式不正确，无法保存！');
          }
        }
      },
      editItem(category,index){
        this.editItemIndex = index;
        $('.ishover').eq(index).addClass('hover').find('.tip span:first-child').addClass('hover');
        $('.ishover').eq(index).siblings().removeClass('hover').find('.tip span:first-child').removeClass('hover');
        $('.'+category).removeClass('dark').siblings().addClass('dark');
      },
      delItem(index,list){
        list.splice(index);
        $('.list').removeClass('dark');
        if(index % 2 == 0){
          $('.relation').addClass('dark');
        }else{
          $('.entity').addClass('dark');
        }
        if(index == 0){
          $('.last-button').css('display', 'block');
          $('.last-span').css('display', 'block');
        }
      },
      list(item,category){
        item.category = category;
        if(category == 'entity'){
          if(!this.typeSelect){
            this.$message.error('请选择实体类型！')
          }else{
            item.type = this.typeSelect.type_id;
            item.type_name = this.typeSelect.type_name;
          }
        }
        if(this.editItemIndex != -1 ){
          var index = this.editItemIndex;
          this.typeSelect = false;
          $('.'+this.List[index].category).removeClass('dark').siblings().removeClass('dark');
          if(this.List[index].category == category){
            this.$set(this.List, index, item);
            $('.ishover').eq(index).removeClass('hover');
            this.editItemIndex = -1;
            if(this.List.length % 2 == 0){
              $('.entity').removeClass('dark');
              $('.relation').addClass('dark');
            }else{
              $('.relation').removeClass('dark');
              $('.entity').addClass('dark');
            }
          }
        }else{
          if(category == 'relation' && (this.List.length + 1) % 2 == 0){
            this.List.push(item);
            $('.last-span').css('display', 'none');
            $('.entity').removeClass('dark');
            $('.relation').addClass('dark');
          }
          if(category == 'entity' && (this.List.length + 1) % 2 == 1 && this.typeSelect){
            this.List.push(item);
            this.typeSelect = false;
            $('.right li').removeClass('on');
            $('.last-button').css('display', 'none');
            $('.relation').removeClass('dark');
            $('.entity').addClass('dark')
          }
        }
      },
      chooseEntityType(item,index){
        $('.right li:eq('+index+')').addClass('on').siblings().removeClass('on');
        this.typeSelect = {
          type_id:item._id,
          type_name:item.name
        }
      },
      add(tag){
        if(tag == 'entity'){
          this.popshow2 = true;
          $('.entprop li,.right li').removeClass('on');

          this.addInfo = {
            name:'实体',
            tag:'entity',
            case_cause:this.params.case_cause,
            properties:this.entity.properties.map(row => {
              return {
                label:row.name,
                value:row._id
              }
            })
          }
        }else if(tag == 'relation'){
          this.popshow = true;
          this.getRelationOptions();
          this.addInfo = {
            name:'关系',
            tag:'relation',
            options:this.relation_options,
            case_cause:this.params.case_cause
          }
        }else{
          console.log('没有tag')
        }
      },
      //获取关系选项
      getRelationOptions(){
        this.relation_options = [];
        axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/type')
          .then((res) => {
            res.data.data.map((elem, index) => {
              this.relation_options.push({
                value : elem._id,
                label : elem.name
              })
            })
          }).catch((res) => {
          console.log(res)
        })
      },
      //获取知识链
      getChainList(){
        axios.get(this.$store.state.url1 + '/api/nlp/label/chain/list?case_cause=' + this.params.case_cause)
          .then((res) => {
            this.chainList = [];
            res.data.data.map((elem,index) => {
              const data = [];
              elem.knowledge_linked.map(function(item, i) {
                data.push({
                  name : item.name,
                  type : item.type,
                  type_name : item.type_name,
                  property : item.property,
                  properties : item.property_name,
                  category : i % 2 == 0 ? "entity" : "relation",
                  _id : item._id,
                })
              })
              this.chainList.push({
                id : elem._id, //知识链id
                // 知识链关键字
                name: elem.name,
                // 类型
                type_name: elem.type_name,
//                owner : elem.maintain[elem.maintain.length-1].user_name,
                owner:elem.user_zh_name,
                time : elem.write_date,
                data : data
              });
            });
          }).catch((res) => {
          console.log('err4',res);
        })
      },
      // 去重
      arrayUnique(array){
        let n = [];
        for(let i = 0; i < array.length; i+=1){
          if (n.indexOf(array[i]) == -1){
            n.push(array[i]);
          }
        }
        return n;
      },
      //获取标签下的知识链
      getTagChainList(){
        let params = [];
        console.log(this.tagData);
        if(this.tagData && this.tagData.extracts.length > 0){
          let list = this.tagData.extracts;
          console.log('list', list);
          list.map(item => {
            params.push(item.id);
          });
          params = this.arrayUnique(params);
          params = JSON.stringify(params);
          axios.get(this.$store.state.url1+'/api/nlp/label/chain?ids='+params).then((res) => {
            this.tagChainList = [];
            res.data.data.map((elem) => {
              const data = [];
              elem.knowledge_linked.map(function (item, i) {
                data.push({
                  name: item.name,
                  type: item.type,
                  type_name: item.type_name,
                  property: item.property,
                  properties: item.property_name,
                  category: i % 2 == 0 ? "entity" : "relation",
                  _id: item._id,
                })
              });
              this.tagChainList.push({
                id: elem._id, //知识链id
                // 知识链关键字
                name: elem.name,
                // 类型
                type_name: elem.type_name,
//                owner : elem.maintain[elem.maintain.length-1].user_name,
                owner: elem.user_zh_name,
                time: elem.write_date,
                data: data
              });
            })
          }).catch((res) => {
            console.log('err4666');
          })
        }
      },
      saveTagChains(id){
        if(id){
          let tagParams =this.tagData.extracts;
          this.chainTag.id = id;
          tagParams.push(this.chainTag);
          tagParams = this.arrayUnique(tagParams);
          const param = {
            extracts: JSON.stringify(tagParams)
          };
          axios.put(this.$store.state.TagUrl + this.tagData.url + '?axios=1', param)
            .then((res) => {
              if(res.data.code === 0){
                this.$message.success('保存链到标签成功！');
              }else{
                this.$message.warning(res.data.msg);
              }
              this.getTagChainList();
            }).catch((err555) => {
            console.log(err555)
          });
        }
      },
      //获取关系
      getRelation(val){
        this.re_loading = true;
        axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list?case_cause=' + val)
          .then((res) => {
            this.re_loading = false;
            this.relations = [];
            res.data.data.map(row => {
              this.relations.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type,
                type_name:row.type_name
              })
            })
          }).catch((res) => {
          console.log('err')
        })
      },
      // 根据实体属性获取实体名
      getEntityName(id,index){
        this.en_loading = true;
        $('.entprop li:eq('+index+')').addClass('on').siblings().removeClass('on');
        this.params.property = id;
        axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list?pager_flag=false',{params:this.params})
          .then((res) => {
            this.en_loading = false;
            this.entity.name=[];
            res.data.data.map(row => {
              this.entity.name.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type
              })
            })
          }).catch((res) => {
          console.log('err')
        })
      },
      //根据案由获取实体名
      getEntityNameByCasecause(val){
        axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list?pager_flag=false&case_cause=' + val)
          .then((res) => {
            this.entity.name=[];
            res.data.data.map(row => {
              this.entity.name.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type
              })
            })
          }).catch((res) => {
          console.log(res)
        })
      },
      select(val){
        this.params.case_cause = val;
        if(!this.$store.state.transferList){
          this.List = [];
          $('.last-span').css('display', 'block');
          $('.last-button').css('display', 'block');
          $('.relation').removeClass('dark');
          $('.entity').removeClass('dark');
        }


        // 获取实体属性列表
        axios.get(this.$store.state.url1 + '/api/nlp/label/property')
          .then((res) => {
            this.entity.properties=[];
            res.data.data.map(row => {
              this.entity.properties.push({
                name:row.name,
                _id:row._id
              })
            })
          }).catch((err) => {
          console.log('err')
        })
        //获取实体名
        this.getEntityNameByCasecause(val);
        // 获取关系内容
        axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list?case_cause=' + val)
          .then((res) => {
            this.relations = [];
            res.data.data.map(row => {
              this.relations.push({
                _id:row._id,
                name:row.name,
                property:row.property,
                type:row.type,
                type_name:row.type_name
              })
            })
          }).catch((res) => {
          console.log('err')
        });
        // 获取知识链
        this.getChainList();
        this.getTagChainList();
      },
      // 返回顶部
      needToTop(e) {
        const timer = setInterval(() => {
          const toTop = document.body.scrollTop || document.documentElement.scrollTop;
          // 设置速度，用等式而不用具体数值是为了产生缓动效果；
          const speed = Math.ceil(toTop / 5);
          // 作差，产生缓动效果；
          document.body.scrollTop = toTop - speed;
          document.documentElement.scrollTop = toTop - speed;
          // 判断是否抵达顶部，若是，停止计时器；
          if (toTop == 0) {
            clearInterval(timer);
          }
        }, 50);
      },
      // 案由列表
      getCaseCause(){
        var _this = this;
        axios.get(this.$store.state.url1 + '/api/nlp/label/entity/case/causes')
          .then((res) => {
            this.caseCause.options = [];
            res.data.data.map((elem, index) => {
              this.caseCause.options.push({
                value:elem._id,
                label:elem.name
              })
            })
          }).catch((err) => {
          console.log(err)
        })
      },
      // 实体类型
      getEntityType(){
        axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/type')
          .then((res) => {
            this.entity.type = [];
            res.data.data.map(row => {
              this.entity.type.push({
                name:row.name,
                _id:row._id
              })
            })
          }).catch((res) => {
          console.log('err')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .main{
    width: 1145px;
    .main_top{
      position: relative;
      padding-top: 36px;
      .line{
        position: relative;
        display: inline-block;
        margin-bottom: 15px;
        button{
          background: #1278E7;
          font-size: 16px;
          color: #fff;
          min-width: 84px;
          &.last-button{
            color: #ACACAC;
            font-size: 14px;
            background: #F6F6F6;
            border:1px dotted #D2D2D2;
          }
        }
        &.ishover:hover,&.hover{
          button{
            background: #F60062;
            font-size: 20px;
            border-color: #F60062;
          }
          .tip{
            opacity: 1;
          }
          > span{
            color: #F60062;
            border:2px solid #F60062;
            padding:9px 10px;
            top: 0;
            min-width: 60px;
          }
        }
        > span{
          border-bottom: 1px solid #37BE29;
          display: inline-block;
          color: #37BE29;
          font-size: 16px;
          padding: 2px 5px;
          position: relative;
          top: -6px;
          cursor: pointer;
          text-align: center;
          &.last-span{
            color:#ACACAC;
            font-size: 14px;
            border-color: #ACACAC;
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
      .save{
        position: absolute;
        right: 0;
        bottom: -20px;
        background: url('../../assets/structure/save.png') no-repeat center #e6e6e6;
        font-size: 0;
        width: 95px;
        height: 43px;
      }
    }
    .main_center{
      .list_box{
        margin-top: 40px;
        display: flex;
        justify-content:space-between;
        .list{
          width: 555px;
          height: 512px;
          text-align: center;
          border:1px solid #E2E2E2;
          overflow: hidden;
          &.dark{
            position: relative;
            &::after{
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0,0,0,.5);
              width: 100%;
              height: 100%;
            }
          }
          .title{
            background: #2281E9;
            font-size: 18px;
            color: #fff;
            height: 51px;
            line-height: 51px;
            font-weight: normal;
            display: flex;
            justify-content:space-around;
            > span{
              position: relative;
              flex:1;
              > i{
                position: absolute;
                width: 22px;
                height: 22px;
                top: 14px;
                left: 17px;
                cursor:pointer;
                background:url('../../assets/structure/re_search.png') no-repeat center;
              }
            }
            > p{
              position: relative;
              display: inline-block;
              flex:1;
              margin-left: 10px;
              > input{
                width: 149px;
                height: 26px;
                line-height: 26px;
                border: 0 none;
                border-radius: 30px;
                outline: none;
                font-size: 16px;
                color:#575d64;
                padding: 2px 13px;
              }
              > i{
                font-size: 0;
                position: absolute;
                width: 22px;
                height: 22px;
                background: url('../../assets/structure/clear.png') no-repeat center;
                top: 14px;
                right:7px;
                cursor: pointer;
              }
            }
          }
          ul{
            overflow-y: auto;
            height: 408px;
          }
          li{
            height: 49px;
            line-height: 49px;
            font-size: 16px;
            color: #293D52;
            cursor: pointer;
            display: flex;
            justify-content:space-around;
            border:1px solid transparent;
            &:hover{
              border-color: #2281e9;
              color:#2281e9;
            }
            span{
              width: 150px;
            }
            &:nth-child(even){
              background: #F5F5F5
            }
            &:nth-child(odd){
              background: #fff;
            }
            &:last-child{
              i{
                display: block;
                width: 100%;
                height: 100%;
                background: url('../../assets/r3/addEn.png') no-repeat center;
                cursor: pointer;
              }
            }
          }
          > p{
            height: 51px;
            line-height: 51px;
            i{
              display: block;
              width: 100%;
              height: 100%;
              background: url('../../assets/r3/addEn.png') no-repeat center;
              cursor: pointer;
            }
          }
          &.relation{
            .title{
              background: #37BE29;
            }
            li:hover{
              border-color: #37BE29;
              color:#37BE29;
            }
            >p i{
              background-image: url('../../assets/r3/addRe.png');
            }
          }
        }
        .entity{
          border:none;
          display: flex;
          justify-content:space-between;
          h2{
            height: 51px;
            line-height: 51px;
            font-size: 18px;
            color:#fff;
            background: #005ABC;
            font-weight: normal;
            > span{
              position: relative;
              > i{
                position: absolute;
                width: 22px;
                height: 22px;
                top: -2px;
                left: -41px;
                cursor:pointer;
                background:url('../../assets/structure/en_search.png') no-repeat center;
              }
            }
            > p{
              position: relative;
              display: inline-block;
              // > input{
              //   width: 149px;
              //   height: 26px;
              //   line-height: 26px;
              //   border: 0 none;
              //   border-radius: 30px;
              //   outline: none;
              //   font-size: 16px;
              //   color:#575d64;
              //   padding: 2px 13px;
              // }
              > i{
                font-size: 0;
                position: absolute;
                width: 22px;
                height: 22px;
                background: url('../../assets/structure/clear.png') no-repeat center;
                top: 14px;
                right:5px;
                cursor: pointer;
              }
            }

          }
          .left{
            width: 387px;
            display: flex;
            justify-content:space-between;
            border:1px solid #E2E2E2;
            .entprop{
              width: 159px;
              background: #2A7DD7;
              .addEnt{
                margin-left: 5px;
                cursor: pointer;
              }
              ul{
                height: 408px;
                // overflow: visible;
                li{
                  background: #2A7DD7;
                  color:#fff;
                  border:none;
                  height: 50px;
                  line-height: 50px;
                  margin-bottom: 1px;
                  &.on,&:hover{
                    background: -webkit-linear-gradient(left, #2281E9, #5ADAFF);
                    background:    -moz-linear-gradient(right, #2281E9, #5ADAFF);
                    background:     -ms-linear-gradient(right, #2281E9, #5ADAFF);
                    background:      -o-linear-gradient(right, #2281E9, #5ADAFF);
                    background:         linear-gradient(to right, #2281E9, #5ADAFF);
                    position: relative;
                    // &::after{
                    //   content:'';
                    //   position: absolute;
                    //   width: 18px;
                    //   height: 18px;
                    //   background: #58D4FF;
                    //   right: -9px;
                    //   top: 17px;
                    //   -webkit-transform: rotate(45deg);
                    //      -moz-transform: rotate(45deg);
                    //       -ms-transform: rotate(45deg);
                    //        -o-transform: rotate(45deg);
                    //           transform: rotate(45deg);
                    // }
                  }
                }
              }
              > p{
                height: 51px;
                line-height: 51px;
                i{
                  display: block;
                  background: url('../../assets/structure/addRe.png') no-repeat center;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
              }
            }
            .entname{
              width: 228px;
              h2{
                background: #2281E9;
              }
              ul{
                height: 460px;
                li{
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;

                }
              }
            }
          }
          .right{
            width: 162px;
            border:1px solid #E2E2E2;

            ul{
              height: 460px;
            }
            li{
              &.on{
                border-color: #2281e9;
                color: #2281e9;
              }
            }
          }
        }
      }
    }
    .main_bottom{
      margin-top: 36px;
      .tab_header{
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content:space-between;
        background: #C7CED6;
        ul{
          li{
            display: inline-block;
            font-size: 18px;
            color:#6A6F73;
            width: 207px;
            text-indent: 74px;
            position: relative;
            cursor: pointer;
            i{
              position: absolute;
              left: 38px;
              width: 24px;
              height: 100%;
              background: url('../../assets/r3/p1_1.png') no-repeat center;
              &.tab2{
                background-image: url('../../assets/r3/p2_1.png');
              }
            }
            &.on{
              color: #016FE7;
              .tab1{
                background-image: url('../../assets/r3/p1_2.png');
              }
              .tab2{
                background-image: url('../../assets/r3/p2_2.png');
              }
            }
          }
        }
        span{
          font-size: 16px;
          color: #004DA1;
          width: 193px;
          border-left: 1px solid #006DE3;
          text-align: center;
        }
      }
      .tab_content{
        .tab1{
          ul{
            padding-top: 7px;
            li{
              margin-bottom: 18px;
              border: 1px solid #E2E2E2;
              background: #F8F8F8;

              .content{
                display: flex;
                justify-content:space-between;
                padding: 35px 0;
                .left{
                  width: 972px;
                  padding-left: 15px;

                  border-right: 1px solid #C7CED6;
                  line-height: 112px;
                  button{
                    background: #1278E7;
                    font-size: 16px;
                    color: #fff;
                    margin-bottom: 40px;
                  }
                  > span{
                    border-bottom: 1px solid #37BE29;
                    color: #37BE29;
                    font-size: 16px;
                    padding: 2px 5px;
                    position: relative;
                    top: -6px;
                    cursor:pointer;
                  }
                }
                .right{
                  width: 193px;
                  display: flex;
                  justify-content:space-around;
                  height: 112px;
                  line-height: 112px;
                  text-align: center;
                  span{
                    display: inline-block;
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
                      background: url('../../assets/delete.png') no-repeat center;
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
                font-size: 16px;
                color:#7B8895;
                span{
                  margin: 0 18px;
                }
              }
            }
          }
        }
      }
    }
  }
  .srtnotext_search{
    display: inline-block;
    width: 40%;
    float: right;
  }
  .nowTag{
    width: 60%;
    display: inline-block;
    background: #D4DFEB;
    margin-top: -10px;
    height: 82px;
    >span{
      display: inline-block;
      width: 90px;
      height: 82px;
      margin-left: 20px;
      line-height: 82px;
      font-size: 16px;
      font-weight: 600;
      color: #666;
    }
    >p{
      display: inline-block;
      height: 82px;
      line-height: 82px;
      font-size: 16px;
      font-weight: 600;
      color: #666;
    }
  }
  .top{
    display: inline-block;
    position: fixed;
    width: 49px;
    height: 49px;
    background: url('../../assets/structure/top.png') no-repeat center;
    bottom: 14px;
    // left: 1535px;
    left:1300px;
    cursor: pointer;
  }
  .sider-open .top{
    left: 1535px;
  }

</style>

