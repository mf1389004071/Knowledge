<template>
  <div class="tree-container">
    <div id="tag-mind" @click="handleClicks();"></div>
    <!-- <div class="tree-edit">
      <span class="wrapper">
        <el-button type="success" style="margin-left: 10px" @click="checkRules">查看法条</el-button>
        <el-button type="info" @click="addRules">添加子法条</el-button>
        <el-button type="danger" @click="getNextLevelRules">查看法律</el-button>
      </span>
    </div> -->
    <!--查看标签信息-->
    <!-- <el-dialog
      :modal="treeModal"
      title="查看标签信息"
      :visible.sync="checkTagDialog"
      size="tiny"
      :before-close="handleClose">
      <span>{{this.dialogTagName}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkTagDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkTagDialog = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!--添加标签信息-->
    <!-- <el-dialog
      title="在当前法条下添加子法条"
      :visible.sync="addTagDialog"
      size="small"
      :before-close="handleClose">
      <span>当前法条：{{this.dialogTagName}}</span>
      <div class="addRulesDialog">
        <span>新法条内容</span>
        <input
          type="textarea"
          placeholder="请输入内容"
          v-model="newRules" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTagDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewRule">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script type="text/babel">
  import 'jsmind';
  import 'jsmind/jsmind.css';
  import axios from '../../js/axios-api.js';
  const options = {
    container: 'tag-mind',
    editable: true,
    theme: 'danger'
  };
  export default {
    data() {
      return {
        mind: null,
        treeModal: false,
        checkTagDialog: false,
        addTagDialog: false,
        dialogTagName: '',
        newRules: '',
        lawSystemTree: {},
        laws:[],
        click:null,
      };
    },
    watch: {
    },
    mounted(){
      this.getTreeData();
    },
    methods: {
      getTreeData(){
        axios.get(this.$store.state.TagUrl + '/api/tag/law_system/tree').then((res) => {
          this.lawSystemTree = res.data.data[0];
          this.showTree();
        })
      },
      getTreeLaw(id){
        axios.get(this.$store.state.TagUrl + '/api/codes?id=' + id)
             .then(res => {
                this.laws = res.data.data;
             }).catch(res => {
                this.$message.error('获取法律树有错误');
             })
      },
      showTree() {
        if (!this.mind) {
          this.mind = new jsMind(options);
        }
        let mind = {
          meta: {},
          layout: {
            hspace: 30,          // 节点之间的水平间距
            vspace: 10,          // 节点之间的垂直间距
            pspace: 3           // 节点收缩/展开控制器的尺寸
          },
          format: 'node_tree',
          data: this.lawSystemTree
        };
        this.mind.show(mind);
      },
      handleClicks() {
        const selectNode = this.mind.get_selected_node();
        const selectNodeIds = selectNode.id;
        // console.log(selectNode,'22');

        // item_type: 0 --> 分类，1 --> 法律，2 --> 法条
        if(selectNode.children.length == 0 && selectNode.data.data.item_type == 0){
          //获取法律树
          this.click = null;
          axios.get(this.$store.state.TagUrl + '/api/codes?category_id=' + selectNode.id)
             .then(res => {
                selectNode.children = res.data.data;
                const childrenData = this.lawSystemTree.children;
                for(let i = 0;i<childrenData.length;i++){
                  if(selectNodeIds === childrenData[i].id){
                    childrenData[i].children = res.data.data;
                    childrenData[i].expanded = true;
                  }else{
                    const childChildrenData = childrenData[i].children;
                    childrenData[i].expanded = true;
                    for(let j = 0; j<childChildrenData.length;j+=1){
                      if(selectNodeIds === childChildrenData[j].id){
                        childChildrenData[j].children=res.data.data;
                        childChildrenData[j].expanded=true;
                      }
                    }

                  }
                }
                this.showTree();
                
             }).catch(res => {
                console.log('获取法律树有错误');
             })
        }/*else if(selectNode.children.length == 0 && selectNode.data.data.item_type == 1){
          this.click = selectNode;
          axios.get(this.$store.state.TagUrl + '/api/laws?source_id=' + selectNode.id)
               .then(res => {
                console.log(res);
                this.laws = res.data.data;
                const childrenData = this.lawSystemTree.children;
                this.searchParent(selectNodeIds,childrenData,res.data.data);
                this.showTree();
               })
        }*/else{
          this.click = selectNode;
        }
      },
      searchParent(selectNodeIds, childrenData, data){
        let vm = this;
        for(let i = 0;i < childrenData.length;i++){
          if(selectNodeIds === childrenData[i].id){
            childrenData[i].children = data;
            childrenData[i].expanded = true;
          }else{
            if(childrenData[i].children.length !== 0){
              let childChildrenData = childrenData[i].children;
              vm.searchParent(selectNodeIds,childChildrenData,data);
            }
            
          }
        }
      },
      getSelectNode() {
        const selectNode = this.mind.get_selected_node();
        return selectNode;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      checkRules() {
        this.checkTagDialog = true;
        const selectNode = this.mind.get_selected_node();
        this.dialogTagName = selectNode.topic;
      },
      addRules() {
        this.addTagDialog = true;
        const selectNode = this.mind.get_selected_node();
        this.dialogTagName = selectNode.topic;
      },
      addNewRule() {
        this.addTagDialog = false;
        const selectNode = this.mind.get_selected_node();
        this.dialogTagName = selectNode.topic;
        this.mind.add_node(selectNode,Math.random(), this.newRules, '');
        let newRule = {
          'id': Math.random(),
          'topic': this.newRules,
          'direction': 'right',
          'expanded': false
        };
        // console.log('newRules', this.newRules);
        if(mindData.topic === selectNode.topic){
          // console.log('根节点添加子法条');
          mindData.children.push(newRule);
          // console.log('修改后的数据', mindData);
        }
      },
      getNextLevelRules(){
        const selectNodes = this.mind.get_selected_node();
        const selectNodeIds = selectNodes.id;
        axios.get(this.$store.state.TagUrl + '/api/codes').then((res) => {
          this.lawsData = res.data.data[0];
          // console.log('法律', this.lawsData);
          const childrenData = this.lawSystemTree.children;
          for(let i = 0;i<childrenData.length;i++){
            if(selectNodeIds === childrenData[i].id){
              childrenData[i].children.push(res.data.data);
            }else{
              const childChildrenData = childrenData[i].children;
              for(let j = 0; j<childChildrenData.length;j+=1){
                if(selectNodeIds === childChildrenData[j].id){
                  childChildrenData[i].children.push(res.data.data);
                }
              }

            }
          }
          this.showTree();
        })
      }
    }
  };
</script>
<style lang="less" scoped>
  .tree-container{
    height: 100%;
    #tag-mind{
      display: inline-block;
      width: 100%;
      height: 100%;
      >.jsmind-inner{
        height: 400px;
      }
    }
    .tree-edit{
      display: inline-block;
      width: 20%;
      height: 100%;
      float: right;
      >.wrapper{
        height: 100%;
        float: left;
        margin-top: 40px;
        >button{
          display: block;
          margin-top: 20px;
        }
      }
    }
    .el-dialog__wrapper {
      .el-dialog {
        > .el-dialog__body {
          >span{
            font-size: 16px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0px 10px 130px;

          }
          .addRulesDialog {
            >span{
              font-size: 16px;
              font-weight: 600;
              display: block;
              margin: 20px 0px 10px 130px;
            }
            > input {
              border-radius: 5px;
              min-height: 60px;
              width: 50%;
              margin-left: 130px;
              font-size: 16px;
              color: #666;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
</style>
