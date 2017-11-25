<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="标签组合" name="1">
      <div class="tagChainSelect">
        <el-input v-model="keyword" placeholder="输入关键字搜索标签链"></el-input>
        <el-select
          v-model="graphTypeValue"
          filterable
          clearable
          placeholder="选择标签图"
          style="width: 200px"
          @change="selectGraphType"
        >
          <el-option
            v-for="item in graphType"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="tagChainList" v-if="tagData.zh_name">
        <div class="tagChainListTitle">
          <span>当前选中标签</span>
          <p>{{tagData.zh_name}}</p>
        </div>
        <div class="main_bottom">
          <el-tabs type="border-card" v-if="chains.length > 0">
            <el-tab-pane>
              <ul>
                <li class="clearfloat" v-for="(chain,index) in chains">
                  <div class="content">
                    <div class="left1">
                      <el-tooltip placement="top" v-for="item in chain.data">
                        <div slot="content">{{item.name}}</div>
                        <el-button v-if="item.category == 'tag'" v-text="item.name"></el-button>
                        <span v-if="item.category == 'relation'" id="text">{{item.name}}</span>
                        {{item}}
                      </el-tooltip>
                      <el-tooltip placement="top">
                        <div slot="content">{{chain.case_cause.name}}</div>
                        <el-button class="case" v-if="chain.case_cause" v-text="chain.case_cause.name"></el-button>
                        {{chain.case_cause}}
                      </el-tooltip>
                    </div>
                    <div class="right">
                      <span @click="copy(chain)" class="copy">复制</span>
                      <span @click="clear(chain,index)" class="del">删除</span>
                    </div>
                  </div>
                  <p>
                    <span>编辑人：{{chain.owner}}</span>
                    <span>最后编辑时间：{{chain.time.substring(0,19)}}</span>
                  </p>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
          <div v-else class="no_tag_chain_icon"><i></i></div>
        </div>
      </div>
      <div v-else class="no-tag"><i></i></div>
    </el-collapse-item>
    <el-collapse-item title="解析内容列表" name="2" >
      <div>解析内容列表</div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
  import axios from '../../../js/axios-api.js';
  export default {
    data() {
      return {
        // 标签图类型
        graphType: [],
        graphTypeValue: '',
        //标签组合
        chains: [],
        graphID:'',
        keyword: '',
        graphKeyWord: [],
        tagID: '',
        activeNames: ['1'],
        graphName: '',
      }
    },
    methods: {
      selectGraphType(val){
        this.graphType.map(item => {
          if(val === item.name){
            this.graphID = item.id;
            this.graphName = item.name;
            this.init();
          } else if(val === ''){
            this.graphID = '';
            this.graphName = '';
            this.init();
          }
        })
      },
      // 标签图
      getAllGraphs(){
        axios.get(this.$store.state.TagUrl + '/api/tag/graphs').then(graphs => {
          const temp = graphs.data.data;
          temp.map(item => {
            const tempGraph = {
              name: '',
              id : ''
            }
            tempGraph.name = item.name;
            tempGraph.id = item.id;
            this.graphType.push(tempGraph);
          })
        })
      },
      init(){
        //获取图的已有标签链
        const key = JSON.stringify(this.graphKeyWord);
        axios.get(this.$store.state.TagUrl+'/api/tag/chains?graph_id='+ this.graphID + '&keyword='+ key + '&tag_id=' + this.tagID)
          .then((res) =>{
            console.log(this.graphKeyWord);
            if (res.data.code == 0) {
              this.chains = [];
              res.data.data.forEach((chain) =>{
                var data = [];
                var len = chain.chain_linked.length;
                var length = chain.maintain.length;
                for(var i=0; i<len-1; i++){
                  var elem = chain.chain_linked[i];
                  data.push({
                    id: elem.id,
                    name: elem.name,
                    en_name: elem.en_name ? elem.en_name : '',
                    category: (i%2 == 0) ? 'tag' : 'relation'
                  })
                }
                let graph_name = '';
                this.graphType.map(item => {
                  if(item.id === chain.graph_id){
                    graph_name = item.name;
                  }
                });
                var cause = chain.chain_linked[len-1];
                this.chains.push({
                  id: chain._id,
                  desc: chain.chain_statement,
                  case_cause: cause,
                  data: data,
                  owner:chain.maintain[length-1].user_name,
                  graph_name: graph_name,
                  time:chain.maintain[length-1].operation_time
                });
              })
            }else{
              this.$message.error(res.data.msg);
              return;
            }
          }).catch((err) =>{
          // this.$message.error('加载标签链错误');
        })
      },
      clear(chain, index){
        let deleteGraphId = '';
        this.graphType.map(item => {
          if(item.name === chain.graph_name){
            deleteGraphId = item.id;
          }
          axios.delete(this.$store.state.TagUrl+'/api/tag/graphs/'+deleteGraphId+'/chains/'+chain.id).then((res) =>{
            if (res.data.code === 0) {
              this.$message.success('删除成功');
              this.init();
            }else{
              this.$message.error(res.data.msg);
              return;
            }
          })
        })
      }
    },
    mounted(){
      this.getAllGraphs();
    },
    watch: {
      keyword: function () {
        const temp = this.keyword.split(' ');
        this.graphKeyWord = temp;
        this.init();
      },
      tagData: function () {
        this.tagID = this.tagData.id;
        this.init();
      }
    },
    computed: {
      tagData() {
        return this.$store.state.tagData.dataTag || {};
      }
    }
  }
</script>
<style>
  #text{
    position: relative;
    color: #37BE29;
    font-size: 16px;
    top: -10px;
    padding: 2px 12px;
    width:initial;
    border-bottom: 1px solid #37BE29;
    text-align:center;
  }
</style>
