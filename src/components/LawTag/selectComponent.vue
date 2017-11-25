<template>
  <div class="mainten">
    <div class="clearfloat right">
      <!-- 搜索类型 -->
      <div class="select">
          <el-select
            clearable
            filterable
            v-model="value1"
            @change="selectCases"
            placeholder="请选择案由"
          >
            <el-option
              v-for="item in getCases"
              :key="item.id"
              :label="item.zh_name"
              :value="item.zh_name">
            </el-option>
          </el-select>
        </div>
      <!--法律分类-->
      <div class="select1">
        <el-cascader
          expand-trigger="click"
          :options="lawCategory"
          v-model="value2"
          clearable
          @change="selectLawCategory"
          change-on-select
          :show-all-levels="false"
          placeholder="请选择法律分类"
        >
        </el-cascader>
        <!--<el-select-->
          <!--v-model="value2"-->
          <!--clearable-->
          <!--@change="selectLawCategory"-->
          <!--placeholder="请选择法律分类"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in lawCategory"-->
            <!--:key="item._id"-->
            <!--:label="item.zh_name"-->
            <!--:value="item.zh_name">-->
          <!--</el-option>-->
        <!--</el-select>-->
      </div>
      <div class="select2">
        <el-select
          v-model="value3"
          clearable
          @change="selectType"
          placeholder="请选择提取方法"
        >
          <el-option
            v-for="item in getMethods"
            :key="item._id"
            :label="item.zh_name"
            :value="item.zh_name">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>

</template>

<script type="text/javascript">
  import axios from '../../js/axios-api.js';
  export default{
    data () {
      return {
        value1: '',
        value2: '',
        value3: '',
        loading : false,
        type:1,
        case_cause:'',
        selectPar: {
          lawCategoryId: '',
          getMethodsId: '',
          getCasesId: ''
        }
      }
    },
    props:[
      'lawCategory',
      'getMethods',
      'getCases'
    ],
    methods : {
      // 搜索类型
      selectLawCategory(val){
        console.log(val);
        let obj = {};
        if(val.length === 1){
          obj = this.lawCategory.find((item)=>{
            return item.value === val[0];
          });
        }else if(val.length === 2){
          if(val[0] === '实体'){
            obj = this.lawCategory[2].children.find(item => {
              return item.value === val[1];
            });
          }else if(val[0] === '程序'){
            obj = this.lawCategory[1].children.find(item => {
              return item.value === val[1];
            })
          }
        }
        if(obj){
          this.selectPar.lawCategoryId = obj.id;
        }else{
          this.selectPar.lawCategoryId = '';
        }
        this.$emit('sele',this.selectPar);
      },
      selectType(val){
        let obj = {};
        obj = this.getMethods.find((item)=>{
          return item.zh_name === val;
        });
        if(obj){
          this.selectPar.getMethodsId = obj.id;
        }else{
          this.selectPar.getMethodsId = '';
        }
        this.$emit('sele',this.selectPar);
      },
      selectCases(val){
        let obj = {};
        obj = this.getCases.find((item)=>{
          return item.zh_name === val;
        });
        if(obj){
          this.selectPar.getCasesId = obj.id;
        }else{
          this.selectPar.getCasesId = '';
        }
        this.$emit('sele',this.selectPar);
      }
    }
  }
</script>
<style lang="less" scoped>
  .mainten{
    display: inline-block;
    border-radius: 3px;
    .select{
      float: right;
      border-radius: 5px;
      border: 1px solid #ccc;
      background: #fff;
      width: 150px;
      .el-select{
        width: 130px;
        .el-input__inner{
          color: #999;
        }
        .el-input__icon{
          color: #999;
        }
      }
      &:hover{
        border: 1px solid #666;
      }
    }
    .select1{
      float: right;
      margin-right: 10px;
      border: 1px solid #ddd;
      width: 150px;
      .el-select{
        width: 150px;
        .el-input__inner{
          color: #999;
        }
        .el-input__icon{
          color: #999;
        }
      }
    }
    .select2{
      float: right;
      margin-right: 10px;
      border: 1px solid #ddd;
      width: 150px;
      .el-select{
        width: 150px;
        .el-input__inner{
          color: #999;
        }
        .el-input__icon{
          color: #999;
        }
      }
    }
  }
</style>
