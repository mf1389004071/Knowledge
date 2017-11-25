<template>
  <el-tabs v-model="activeName" type="border-card" style="min-height: 700px">
    <el-tab-pane label="标签问题/答案" name="first">
      <div class="tagTitle">当前标签： {{tagData.zh_name}}</div>
      <div class="containerQandA">
        <div v-for="(item, index) in QandAList" class="QandAContainer">
          <div class="QandA" v-if="item.showQandA">
            <div class="question">
              <i></i>
              <span>{{item.question}}</span>
            </div>
            <div class="answer">
              {{item.answer}}
            </div>
          </div>
          <div class="EditQandA" v-else>
            <el-form ref="form" :model="item" label-width="120px">
              <el-form-item label="问题">
                <el-input v-model="item.question"></el-input>
              </el-form-item>
              <el-form-item label="答案">
                <el-input type="textarea" v-model="item.answer"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="QandAoperate">
            <el-button @click="editQandA(index)">编辑</el-button>
            <el-button @click="saveEditQandA(index)">保存</el-button>
          </div>
        </div>
      </div>
      <div class="addNewQandA">
        <i @click="addNewQandA"></i>
      </div>
    </el-tab-pane>
    <el-tab-pane label="标签链问题/答案" name="second">
      <div class="tagChainListQandA" v-if="tagData.zh_name">
        <div class="tagTitle">当前标签： {{tagData.zh_name}}</div>
        <div class="main_bottom_QandA">
          <el-tabs v-if="chains.length > 0" style="margin: 20px auto">
              <ul>
                <li class="clearfloat" v-for="(chain,index) in chains">
                  <div class="content">
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
                  <p>
                    <span>编辑人：{{chain.owner}}</span>
                    <span>最后编辑时间：{{chain.time.substring(0,19)}}</span>
                  </p>
                  <div class="chainQandA">
                    <div class="containerQandA">
                      <div v-for="(item, index) in chainQandAList" class="QandAContainer">
                        <div class="QandA" v-if="item.showQandA">
                          <div class="question">
                            <i></i>
                            <span>{{item.question}}</span>
                          </div>
                          <div class="answer">
                            {{item.answer}}
                          </div>
                        </div>
                        <div class="EditQandA" v-else>
                          <el-form ref="form" :model="item" label-width="120px">
                            <el-form-item label="问题">
                              <el-input v-model="item.question"></el-input>
                            </el-form-item>
                            <el-form-item label="答案">
                              <el-input type="textarea" v-model="item.answer"></el-input>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div class="QandAoperate">
                          <el-button @click="editQandAChain(index)">编辑</el-button>
                          <el-button @click="saveEditQandAChain(index)">保存</el-button>
                        </div>
                      </div>
                    </div>
                    <div class="addNewQandA">
                      <i @click="addNewQandAChain"></i>
                    </div>
                  </div>
                </li>
              </ul>
          </el-tabs>
        </div>
      </div>
      <div v-else class="no_tag_chain_icon"><i></i></div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import axios from '../../../js/axios-api.js';
  export default {
    data() {
      return {
        chains: [],
        graphType: [],
        QandAEditData: {
          question: '',
          answer: ''
        },
        activeName: 'first',
        QandAList:[{
          question: 'lcx是不是特别无聊！',
          answer: '是的，这个问题毫无意义好吗',
          showQandA: true
        },{
          question: 'lcx是不是特别无聊！',
          answer: '是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗',
          showQandA: true
        },{
          question: 'lcx是不是特别无聊！',
          answer: 'lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！，lcx是不是特别无聊！',
          showQandA: true
        },
        ],
        chainQandAList:[{
          question: 'lcx是不是特别无聊！',
          answer: '是的，这个问题毫无意义好吗',
          showQandA: true
        },{
          question: 'lcx是不是特别无聊！',
          answer: '是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗，是的，这个问题毫无意义好吗',
          showQandA: true
        }]
      };
    },
    methods: {
      addNewQandA(){
        const temp = {
          question: '',
          answer: '',
          showQandA: false
        };
        this.QandAList.push(temp);
      },
      addNewQandAChain(){
        const temp = {
          question: '',
          answer: '',
          showQandA: false
        };
        this.chainQandAList.push(temp);
      },
      editQandA(val){
        this.QandAList[val].showQandA = false;
      },
      editQandAChain(val){
        this.chainQandAList[val].showQandA = false;
      },
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
        axios.get(this.$store.state.TagUrl+'/api/tag/chains?tag_id=' + this.tagData.id)
          .then((res) =>{
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
            }
          }).catch((err) =>{
          this.$message.error(err);
        })
      },
      saveEditQandA(val){
        this.QandAList[val].showQandA = true;
      },
      saveEditQandAChain(val){
        this.chainQandAList[val].showQandA = true;
      },
    },
    computed: {
      tagData() {
        return this.$store.state.tagData.dataTag || {};
      }
    },
    watch: {
      tagData: function () {
        this.init();
      }
    },
    mounted(){
      this.getAllGraphs();
    }
  };
</script>
<style lang="less">
  .containerQandA{
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 2px dotted #ccc;
    .QandAContainer{
      width: 95%;
      background: #F8F8F8;
      border: 1px solid #aaa;
      margin: 20px auto;
      .QandA{
        display: inline-block;
        width: 80%;
        border-right: 1px solid #ddd;
        min-height: 100px;
        .question{
          height: 40px;
          line-height: 40px;
          text-align: left;
          >i{
            display: inline-block;
            position: relative;
            margin-top: 10px;
            margin-left: 20px;
            width: 30px;
            height: 30px;
            background: url('../../../assets/lawtag/lawtagfix/question.png') center no-repeat;
          }
          >span{
            display: inline-block;
            margin-left: 30px;
            font-size: 16px;
            margin-top: -10px;
            color: #1d2c3c;
          }
        }
        .answer{
          width: 90%;
          margin: 20px auto;
          font-size: 14px;
          line-height: 26px;
          word-break: break-all;
        }
      }
      .QandAoperate{
        display: inline-block;
        width: 18%;
        >button{
          display: block;
          float: right;
          margin: 10px 20px 20px 0px;
        }
      }
      .EditQandA{
        display: inline-block;
        width: 80%;
        border-right: 1px solid #ddd;
        .el-form-item{
          margin-top: 20px;
          .el-input{
            width: 80%;
            margin-left: 10px;
          }
          .el-textarea{
            width: 80%;
            min-height: 160px;
            >textarea{
              width: 99%;
              border-radius: 5px;
              background: #fff;
              min-height: 160px;
            }
          }
        }

      }
    }

  }
  .addNewQandA{
    >i{
      display: block;
      width: 116px;
      height: 36px;
      background: url('../../../assets/lawtag/lawtagfix/newQA.png') no-repeat center;
      margin: 20px auto;
    }
  }
  .tagChainListQandA{
    .main_bottom_QandA{
      .el-tabs{
        .el-tabs__content{
          >ul{
            >li{
              min-height: 100px;
              .content{
                margin-bottom: 20px;
              }
              >p{
                font-size: 14px;
                >span {
                  display: inline-block;
                  margin-right: 40px;
                }
              }
              .chainQandA{
                width: 95%;
                min-height: 300px;
                border: 1px solid #aaa;
                margin: 20px auto;
              }
            }
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
      background: url('../../../assets/no_tag.png') no-repeat center;
    }
  }
</style>
