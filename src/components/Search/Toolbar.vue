<template>
   <div id="Tool" @mousedown="dragTool">
     <el-card id="ToolBar">
       <div slot="header" class="clearfix">
         <span>工具栏</span>
       </div>
       <el-collapse v-model="active.activeName" accordion>
          <el-collapse-item title="实体/关系属性" name="0">
            <el-tabs v-model="active.activeTabName" tyep="border-card">
               <el-tab-pane label="编辑" name="0">
                 <el-form :model="curNode" label-width="70px" label-position="left" v-show="curNode.category=='entity'">
                    <el-form-item label="实体名称">
                      <el-input v-model="curNode.name" placeholder="请输入实体名称" @change="modify"></el-input>
                    </el-form-item>
                    <el-form-item label="实体类型">
                      <el-select v-model="curNode.type_name" placeholder="请选择实体类型" @change="modify">
                         <el-option
                           v-for="item in type_e"
                           :key="item._id"
                           :label="item.name"
                           :value="item">
                         </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="实体属性">
                      <el-select v-model="curNode.property_name" placeholder="请选择实体属性" @change="modify">
                        <el-option
                          v-for="item in properties"
                          :key="item._id"
                          :label="item.name"
                          :value="item._id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="实体案由">
                      <el-select v-model="curNode.case_cause_name" placeholder="请选择案由" @change="modify">
                        <el-option
                          v-for="item in caseCauses"
                          :key="item._id"
                          :label="item.name"
                          :value="item._id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="口语化">
                      <el-input v-model="curNode.colloquial" placeholder="请输入口语化，用逗号隔开"></el-input>
                    </el-form-item>
                    <el-form-item label="同义词">
                      <el-input v-model="curNode.synonyms" placeholder="请输入同义词，用逗号隔开"></el-input>
                    </el-form-item>
                  </el-form>

                  <el-form :model="curNode" label-width="70px" label-position="left" v-show="curNode.category=='relation'">
                    <el-form-item label="关系名称">
                      <el-input v-model="curNode.name" placeholder="请输入关系名称" @change="modify"></el-input>
                    </el-form-item>
                    <el-form-item label="关系类型">
                      <el-select v-model="curNode.type_name" placeholder="请选择关系类型" @change="modify">
                         <el-option
                           v-for="item in type_r"
                           :key="item._id"
                           :label="item.name"
                           :value="item">
                         </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="关系属性">
                      <el-input v-model="curNode.property_name" placeholder="请输入关系属性" @change="modify"></el-input>
                    </el-form-item>
                    <el-form-item label="关系案由">
                      <el-select v-model="curNode.case_cause_name" placeholder="请选择案由" @change="modify">
                        <el-option
                          v-for="item in caseCauses"
                          :key="item._id"
                          :label="item.name"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="口语化">
                      <el-input v-model="curNode.colloquial" placeholder="请输入口语化，用逗号隔开"></el-input>
                    </el-form-item>
                    <el-form-item label="同义词">
                      <el-input v-model="curNode.synonyms" placeholder="请输入同义词，用逗号隔开"></el-input>
                    </el-form-item>
                  </el-form>
               </el-tab-pane>
               <el-tab-pane label="替换" name="1">
                 <el-form>
                  <el-form-item label="选择实体" v-show="curNode.category=='entity'">
                    <el-select v-model="entityToReplace" :loading="loading.entity" filterable remote placeholder="请选择实体" :remote-method="remoteEntities" @change="replaceEntity">
                      <el-option
                        v-for="item in options_e"
                        :key="item._id"
                        :label="item.name"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="选择关系" v-show="curNode.category=='relation'">
                    <el-select v-model="relationToReplace" :loading="loading.relation" filterable remote placeholder="请选择关系" :remote-method="remoteRelations" @change="replaceRelation">
                      <el-option
                        v-for="item in options_r"
                        :key="item._id"
                        :label="item.type_name+':'+item.name"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
               </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
          <el-collapse-item title="常用实体" name="1">
            <el-form>
              <el-form-item label="选择实体">
                <el-select v-model="newEntity" :loading="loading.AddEntity" filterable remote placeholder="请选择实体" :remote-method="AddRemoteEntities"  @change="addEntity">
                  <el-option
                    v-for="item in AddOptions_e"
                    :key="item._id"
                    :label="item.type+':'+item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="palettezone">
              <!-- <div v-for="(entity,index) in entities" :model="entities">
                <div class="draggable" draggable="true">{{entity.name}}</div>
              </div> -->
              <div class="ishover" v-for="(entity,index) in entities" :model="entities">
                <el-button type="text" class="draggable" draggable="true">{{entity.name}}</el-button>
                <span class="el-icon-close tip" @click="remove(index)" title="移除该实体"></span>
              </div>
            </div>
          </el-collapse-item>
       </el-collapse>
      </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  var debounce = require('debounce');
  export default{
    props:['curNode','active'],
    data(){
      return{
        dragged:null,
        draggedObj:{
          key:'',
          text:'',
          params:{}
        },
        baseInstance: null,
        type_e:[],
        type_r:[],
        properties:[],
        caseCauses:[],
        loading: {
          relation: false,
          entity: false,
          AddEntity:false
        },
        entityToReplace:{},
        relationToReplace:{},
        newEntity:{},
        options_r:[],
        options_e:[],
        AddOptions_e:[],
        entities:[
           {  create_time: "2017-06-26 14:33:10.031371",
              name: "一方转移财产",
              colloquial: '',
              property: "事实",
             category:'entity',
              version: 1.1,
              case_cause: "离婚纠纷",
              _id: "594a35d44ef728153c772ee2",
              synonyms: '',
              type: "行为实体",
           },
           {  create_time: "2017-06-26 14:33:10.031371",
              name: "请求分割共同财产",
              colloquial: '',
              property: "诉讼请求",
             category:'entity',
              version: 1.1,
              case_cause: "离婚纠纷",
              _id: "594a35e44ef728153c7734c6",
              synonyms: '',
              type: "抽象实体",
           },
           { create_time: "2017-07-31 13:51:21.150099",
              name: "基层人民法院",
              colloquial: '',
              property: "",
              category:'entity',
              version: 1.1,
              case_cause: "",
              _id: "5971c524f75d0929c7e8969c",
              synonyms: '',
              type: "人物实体",
           },
        ],
      }
    },
    methods:{
      init(){
        var $this = this;

        // This event should only fire on the drag targets.
        // Instead of finding every drag target,
        // we can add the event to the document and disregard
        // all elements that are not of class "draggable"
        document.addEventListener("dragstart", function(event) {
          if (event.target.className !== "el-button draggable el-button--text") return;
          // Some data must be set to allow drag
          event.dataTransfer.setData("text","");
          // store a reference to the dragged element
          $this.dragged = event.target;
          $this.entities.forEach((entity) => {
            if(entity.name == $this.dragged.textContent){
              $this.draggedObj ={
                key:entity._id,
                text:entity.name,
                params:entity
              }
            }
          });
          // Objects during drag will have a red border
          event.target.style.border = "2px solid rgb(104,189,246)";
          console.log("dragstart");
        }, false);

        // This event resets styles after a drag has completed (successfully or not)
        document.addEventListener("dragend", function(event) {
          // reset the border of the dragged element
          $this.dragged.style.border = "";
        }, false);

      },
      dragTool(event){
        var $this = document.getElementById("Tool");

        // var mouseX,mouseY,
        //     offsetX = $this.offsetWidth,
        //     offsetY = $this.offsetHeight;

        //   document.onmousemove = function(e){
        //     mouseX = e.pageX + offsetX;
        //     mouseY = e.pageY + offsetY;

        //     $this.css({
        //       'right':mouseX + 'px',
        //       'top':mouseY +'px'
        //     })
        //   };

        //   document.onmouseup = function(){
        //     document.onmousemove = null;
        //     document.ommouseup = null;
        //   }
      },
      modify(){

        this.$emit('modifyData',this.curNode);
      },
      loadProperties(){
        this.baseInstance.get('/label/property')
          .then((res) => {
            this.properties = res.data.data;
          }).catch((err) => {
          this.$message({
            type: 'error',
            message: '网络错误！'
          })
        });
      },
      loadCaseCause(){
        this.baseInstance.get('/knowledge/cause/type')
          .then((res) => {
            this.caseCauses = res.data.data;
          }).catch((err) => {
          this.$message({
            type: 'error',
            message: '网络错误！'
          })
        });
      },
      loadTypes(){
        this.baseInstance.get('/knowledge/relation/type')
          .then((res) => {
            this.type_r = res.data.data;
          }).catch((err) => {
          this.$message({
            type: 'error',
            message: '网络错误！'
          })
        });
        this.baseInstance.get('/knowledge/entity/type')
          .then((res) => {
            this.type_e = res.data.data;
          }).catch((err) => {
          this.$message({
            type: 'error',
            message: '网络错误！'
          })
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
            }).catch((err) => {
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
                  this.options_e.push(e);
                })
              }
            }).catch((err) => {
          });
        } else {
          this.options_e = [];
        }
      }, 250),
      AddRemoteEntities: debounce(function (query) {
        if (query !== '') {
          this.loading.AddEntity = true;
          this.baseInstance.get('/label/entity/list?pager_flag=true&&name=' + query)
            .then((res) => {
              this.loading.AddEntity = false;
              this.AddOptions_e = [];
              if (res.data.data) {
                res.data.data.forEach((e) => {
                  if (e.colloquial) {
                    e.colloquial = e.colloquial.join(',');
                  }
                  if (e.synonyms) {
                    e.synonyms = e.synonyms.join(',');
                  }
                  this.AddOptions_e.push(e);
                })
              }
            }).catch((err) => {
          });
        } else {
          this.Addoptions_e = [];
        }
      }, 250),

      addEntity(){
        this.entities.push(this.newEntity);
      },

      remove(index){
        this.entities.splice(index, 1);
      },

      replaceEntity(){
        // this.curNode = this.entityToReplace;
        this.$emit('replaceData',this.entityToReplace);
        console.log("replace entity");
      },

      replaceRelation(){
        // this.curNode = this.relationToReplace;
        this.$emit('replaceData',this.relationToReplace);
        console.log("replace relation");
      }

    },
    mounted(){
      this.baseInstance = axios.create({
        timeout: 100000,
        baseURL: this.$store.state.url1 + '/api/nlp/',
        params: {
          access_token: localStorage.access_token
        },
      });
      this.init();
      this.loadTypes();
      this.loadProperties();
      this.loadCaseCause();
    },
    watch:{
      'draggedObj'(val){
        this.$emit('drag', val);
      },
    }
  }
</script>

<style lang="less">
  #Tool{
    position:absolute;
    z-index:99;
    top:20px;
    right:0;
    height:100%;
    width:360px;
      #ToolBar{
        margin-right:10px;
        height:100%;
        width:350px;
        font-size:16px;
        .clearfix:before,
        .clearfix:after {
          display: table;
          content: "";
        }
        .clearfix:after {
          clear: both
        }
        .el-collapse{
            position:absolute;
            width:350px;
            left:1px;
            right:9px;
            top:60px;
            .el-collapse-item__header{
              background-color:#EEF1F6;
              font-size:14px;
            }
            .palettezone {
              width:300px;
              height:100%;
              background: #EEF1F6;
              padding:10px;
              margin:20px 10px 0 0;
              .ishover{
                .draggable {
                  font: normal 16px sans-serif;
                  width: 200px;
                  margin: 10px 10px 10px 40px;
                  height: 36px;
                  text-align: center;
                  line-height: 1;
                  background: white;
                  cursor: move;
                }
                .tip{
                  opacity: 0;
                  color: #EEF1F6;
                  cursor: pointer;
                  margin-left:-12%;
                  font-size:6px;
                  &:hover{
                    color:#20a0ff;
                  }
                }
                &:hover{
                  .tip{
                    opacity:1;
                  }
                }
              }
            }
            .el-form{
              padding-top:10px;
              .el-form-item__label{
                font-size:14px;
              }
              .el-form-item__content{
                font-size:14px;
                .el-select{
                  width:100%;
                }
                .el-input{
                  width:100%;
                }
              }
            }
            .footer{
              float:right;
            }
        }
      }
    .slide-fade-enter-active {
      transition: all .3s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    {
      transform: translateX(10px);
      opacity: 0;
    }
  }
</style>
