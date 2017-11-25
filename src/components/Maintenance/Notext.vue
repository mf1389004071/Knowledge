<template>
  <div class="maintenance_notext">
    <search :option="caseCause" @select="select"></search>
    <div class="main" v-if="type == 1">
      <div class="header">
        <h2>法律知识链列表</h2>
        <span>操作</span>
      </div>
      <ul class="list" v-loading="chain_loading">
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
              <span @click="edit(list,list.id)">修改</span>
              <span @click="clear(list.id,index)">删除</span>
            </div>
          </div>
          <p>
            <span>编辑人：{{list.owner?list.owner:'南京擎盾'}}</span>
            <span>最后编辑时间：{{list.time.substr(0,10)}}</span>
          </p>
        </li>
      </ul>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
          :page-size="params.page_size"
          layout="prev, pager, next, sizes, jumper"
          :total="params.total">
        </el-pagination>
      </div>
    </div>

    <div class="main" v-if="type != 1">
       <no-er ref="er" :erList="erList" v-loading="er_loading"></no-er>
       <!-- <no-er ref="er" v-show="type == 3"></no-er> -->
    </div>



    <div>
      <div class="mask" v-show="popshow1 || popshow2"></div>
      <edit-select v-show="popshow1" @hide="popshow1=false" :info="editList"></edit-select>
      <edit-list v-show="popshow2" @hide="popshow2=false"></edit-list>
    </div>
  </div>
</template>

<script>
import axios from '../../js/axios-api.js';
import search from './SearchItem'
import popSeclect from './Popup'
import popEdit from './Popup2'
import pager from './Pager'
import noEr from './NotextER'
export default {
  data () {
    return {
      chain_loading:false,
      er_loading:false,
      popshow:false,
      popshow1:false,
      popshow2:false,
      current_page:1,
      caseCause:{
        options:[],
        tag:'case_cause',
        title:'案由选择',
        msg:'点击选择案由'
      },
      params:{
        case_cause:'',
        page_size:10,
        page:1,
        pager_flag:true,
        // entity:'',
        // relarion:'',
      },
      chainList:[],
      editList:{},
      list:{},
      pager:{},
      editList:{},
      loading:false,
      type:1,
      typeOption:[],
      propOption:[],
      erList:{
        title:[
          // '关系名称',
          // '关系类型',
          // '关系属性'
        ],
        typeOptions:[

        ],
        propOptions:[],
        List:[]
      },

    }
  },
  components:{
    'search' : search,
    'pager' : pager,
    'edit-select' : popSeclect,
    'edit-list' : popEdit,
    'no-er' : noEr,
  },
  computed:{
    user:function(){
        return this.$store.state.user;
    },
    username(){
        return JSON.parse(this.user.config.data).username
    }
  },
  mounted(){
    this.getCaseCause();
  },
  methods:{
    // 实体类型
    getEntityType(){
      axios.get(this.$store.state.url1 + '/api/nlp/knowledge/entity/type')
         .then((res) => {
          res.data.data.map((elem, index) => {
            this.erList.typeOptions.push({
              value : elem._id,
              label : elem.name
            })
          })
         }).catch((res) => {
          console.log('err2')
         })
    },
    // 实体属性列表
    getEntityProp(){
      axios.get(this.$store.state.url1 + '/api/nlp/label/property')
         .then((res) => {
          this.erList.propOptions = [];
          res.data.data.map((elem, index) => {
            this.erList.propOptions.push({
              value : elem._id,
              label : elem.name
            })
          })
         }).catch((res) => {
          console.log('err3')
         })
    },
    // 回到顶部
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
    handleSizeChange(val){
      this.params.page_size = val;
      this.getChainList();
    },
    handleCurrentChange(val){
      this.params.page = val;
      this.getChainList();
    },

    // 修改知识链
    edit(list,id){
      this.$store.state.transferList = {
        list:list,
        case_cause:this.params.case_cause
      };
      this.$router.push('/strnotext');
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
                this.$message.success("删除成功!");
                this.chainList.splice(index,1);
               }).catch(function(res){
                console.log('err')
               });
          }).catch(() => {
              this.$message.info("已取消删除");
          });
    },
    // 获取知识链
    getChainList(){
      this.chain_loading = true;
      const params = {
        case_cause:this.params.case_cause,
        page:this.params.page?this.params.page:1,
        page_size:this.params.page_size?this.params.page_size:10,
        pager_flag:this.params.pager_flag
      }
      axios.get(this.$store.state.url1 + '/api/nlp/label/chain/list',{params:params})
        .then((res) => {
          if(res.data.code == 0){
            this.params.total = res.data.pager.total;
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
                owner: elem.user_zh_name,
                time : elem.write_date,
                data : data
              });
            })

          }else{
            this.$message.error(res.data.msg);
          }
          this.chain_loading = false;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }).catch((res) => {
          this.$message.warning('获取知识链失败！');
        })
    },
    // 获取实体
    getEntity(){
      this.er_loading = true;
      const params = {
        case_cause:this.params.case_cause,
        page:this.params.page?this.params.page:1,
        page_size:this.params.page_size?this.params.page_size:10,
        pager_flag:this.params.pager_flag
      }
      axios.get(this.$store.state.url1 + '/api/nlp/label/entity/list',{params:params})
            .then((res) => {
              if(res.data.code == 0){
                this.params.total = res.data.pager.total;
                this.erList.List = [];
                res.data.data.map((elem, index) => {
                  this.erList.List.push({
                      name:elem.name,  //实体名
                      property:elem.property,//实体属性id
                      propertyName:elem.property_name,//实体属性名
                      colloquial:elem.colloquial,
                      synonyms:elem.synonyms,
                      category:'entity',
                      id:elem._id
                  })
                })
              }else{
                this.$message.error(res.data.msg);
              }
              this.er_loading = false;
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }).catch((err) => {
              this.$message.error('获取实体失败')
            })
    },
    // 获取关系
    getRelation(){
        this.er_loading = true;
        const params = {
          case_cause:this.params.case_cause,
          page:this.params.page?this.params.page:1,
          page_size:this.params.page_size?this.params.page_size:10,
          pager_flag:this.params.pager_flag
        }
        axios.get(this.$store.state.url1 + '/api/nlp/label/relation/list',{params:params})
            .then((res) => {
              this.er_loading = false;
              this.params.total = res.data.pager.total;
              this.erList.List = [];
              res.data.data.map((elem, index) => {
                this.erList.List.push({
                  name:elem.name,  //关系名
                  propertyName:elem.property,//关系属性名
                  type:elem.type_name,//关系类型名
                  typeId:elem.type,//关系类型id
                  colloquial:elem.colloquial,
                  synonyms:elem.synonyms,
                  category:'relation',
                  id:elem._id
                })
              })
            }).catch((err) => {
              console.log('err')
            })
    },
    // 获取关系类型
    getRelationOption(){
      axios.get(this.$store.state.url1 + '/api/nlp/knowledge/relation/type')
           .then((res) => {
            this.erList.typeOptions = [];
            res.data.data.map((elem, index) => {
              this.erList.typeOptions.push({
                value : elem._id,
                label : elem.name
              })
            })
           }).catch((res) => {

           })
    },
    select(val,type){
      this.params.case_cause = val;
      this.params.page = 1;
      if(type == 1){
        // 获取知识链
        this.getChainList();
      }else if(type == 2){
        // 实体
        this.getEntity();
        this.getEntityProp();
      }else if(type == 3){
        // 关系
        this.getRelation();
      }else{
        console.log('没有选择类型')
      }

    },
    // 获取案由列表
    getCaseCause(){
      axios.get(this.$store.state.url1 + '/api/nlp/label/chain/cause/list')
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
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
    width: 80%;
    margin: 0 auto;
    margin-top: 38px;
    .header{
      background: #C7CED6;
      height: 52px;
      line-height: 52px;
      display: flex;
      justify-content:space-between;
      padding: 0 18px;
      font-size: 18px;
      color:#052241;
      h2{
        padding-left: 27px;
        font-weight: normal;
        background: url('../../assets/manage/menu.png') no-repeat left center;
      }
      span{
        font-size: 16px;
        padding-right:50px;
      }
    }
    .list{
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
            flex:1;
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
            display: block;
            height: 112px;
            line-height: 112px;
            text-align: center;
            span{
              display: inline-block;
              width: 24px;
              height: 100%;
              background: url('../../assets/change.png') no-repeat center;
              font-size: 0;
              margin: 0 30px;
              cursor: pointer;
              & + span{
                background-image: url('../../assets/delete.png');
              }
            }
          }
        }
        p{
          border-top: 2px dashed #D2D2D2;
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
  .mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #495563;
    opacity: .8;
    z-index:100;
  }
  .pagination{
    .el-pagination{
      width: 80%;
      margin-left: 0;
      margin: 50px auto;
    }
  }
 
</style>
