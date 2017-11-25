<template>
  <div class="tree-container">

    <el-collapse v-model="activeNames" @change="collapseChange" accordion>
        <el-collapse-item 
          v-for="(tree,index) in lawSystemTree"
          :name="index" :title="tree.topic">
          <div :id="'tag-mind' + index" class="treeheight" @click="handleClicks(index)"></div>
        </el-collapse-item>
    </el-collapse>
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
        mind: [],
        activeNames:'0',
        treeModal: false,
        checkTagDialog: false,
        addTagDialog: false,
        dialogTagName: '',
        newRules: '',
        lawSystemTree: [],
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
      handleClicks(index){
        const selectNode = this.mind[index].get_selected_node();
        this.click = selectNode;
      },
      collapseChange(val){
        this.$nextTick(() => {
          this.showTree(val,this.lawSystemTree[val])
        })
      },
      getTreeData(){
        axios.get(this.$store.state.TagUrl + '/api/tag/cause/tree').then((res) => {
          this.lawSystemTree = res.data.data;
          this.lawSystemTree.map((row,index) => {
              this.$nextTick(() => {
                this.showTree(index,row);
              })
          })
        })
      },
      getTreeLaw(id){
        axios.get(this.$store.state.TagUrl + '/api/codes?id=' + id)
             .then(res => {
                this.laws = res.data.data;
             }).catch(res => {
              console.log('获取法律树有错误');
             })
      },
      showTree(index,data) {
        if (!this.mind[index]) {
          const options = {
            container: 'tag-mind'+index,
            editable: true,
            theme: 'belizehole',
            mode:'side',
            default_event_handle:{
                  // enable_mousedown_handle:true,
                  // enable_click_handle:true,
                enable_dblclick_handle:false
            },
          };
          this.mind[index] = new jsMind(options);
        }
        if(!data){
          this.mind[index].show();
          return;
        }
        let mind = {
          meta: {},
          layout: {
            hspace: 30,          // 节点之间的水平间距
            vspace: 10,          // 节点之间的垂直间距
            pspace: 3           // 节点收缩/展开控制器的尺寸
          },
          format: 'node_tree',
          data: data
        };
        this.mind[index].show(mind);
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
        console.log('newRules', this.newRules);
        if(mindData.topic === selectNode.topic){
          console.log('根节点添加子法条');
          mindData.children.push(newRule);
          console.log('修改后的数据', mindData);
        }
      },
      // getNextLevelRules(){
      //   const selectNodes = this.mind.get_selected_node();
      //   const selectNodeIds = selectNodes.id;
      //   console.log('----------------------------------------------------------------', selectNodeIds);
      //   axios.get(this.$store.state.TagUrl + '/api/codes').then((res) => {
      //     this.lawsData = res.data.data[0];
      //     console.log('法律', this.lawsData);
      //     const childrenData = this.lawSystemTree.children;
      //     for(let i = 0;i<childrenData.length;i++){
      //       if(selectNodeIds === childrenData[i].id){
      //         childrenData[i].children.push(res.data.data);
      //       }else{
      //         const childChildrenData = childrenData[i].children;
      //         for(let j = 0; j<childChildrenData.length;j+=1){
      //           if(selectNodeIds === childChildrenData[j].id){
      //             childChildrenData[i].children.push(res.data.data);
      //           }
      //         }

      //       }
      //     }
      //     this.showTree();
      //   })
      // }
    }
  };
</script>
<style lang="less" scoped>
  .tree-container{
    height: 100%;
    overflow-y: auto;
    .treeheight{
      display: inline-block;
      width: 100%;
      height: 500px;
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
