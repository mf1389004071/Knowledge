<template>
  <div class="tagMessage">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="法律标签基本信息" name="1">
        <div class="tagDetailTitleContainer" v-if="tagData.zh_name && tagData.zh_name !== ''">
          <div><span>标签名称</span><p>{{tagData.zh_name ? tagData.zh_name : ''}}</p></div>
          <div><span>法律分类</span><p>{{tagData.law_type.name ? tagData.law_type.name: ''}}</p></div>
          <div><span>提取方法</span><p>{{tagData.extract_type.name ? tagData.extract_type.name : ''}}</p></div>
          <div><span>标签描述</span><p>{{tagData.description ? tagData.description : ''}}</p></div>
          <div><span>口语化描述</span><p>{{tagData.colloquial_description ? tagData.colloquial_description : ''}}</p></div>
          <div><span>案由</span><p><el-tag v-for="item in tagData.causes" :key="item">{{item.name}}</el-tag></p></div>
          <div><span>关键词</span><p><el-tag v-for="tag in tagData.keywords" :key="tag">{{tag}}</el-tag></p></div>
          <div><span>法律文本</span><p><el-tag v-for="law in tagData.laws" :key="law">{{law.name}}</el-tag></p></div>
        </div>
        <div class="no_tag_chain_icon" v-else>
          <i></i>
        </div>
      </el-collapse-item>
      <el-collapse-item title="法律标签规则列表" name="2">
        <div class="noRules" v-if="!tagData.rules || tagData.rules.length == 0">
          <div>暂无规则</div>
        </div>
        <div v-else v-for="(elem,index) in tagData.rules" style="border-bottom: 1px dashed #666">
          <span>规则{{index+1}}</span>
          <div v-for="item in elem">
            <div class="tagRules" v-if="item.id == 'doc_type'"><span>文书类型</span><p>{{item.value}}</p></div>
            <div class="tagRules" v-if="item.id == 'sentence'"><span>句式</span><p>{{item.value}}</p></div>
            <div class="tagRules" v-if="item.id == 'para'"><span>段落</span><p>{{item.value}}</p></div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeNames: ['1']
      }
    },
    computed: {
      tagData() {
        return this.$store.state.tagData.dataTag || {};
      }
    },
    updated(){

    }
  }
</script>
<style lang="less">
  .tagMessage{
    .el-collapse{
      .el-collapse-item{
        .noRules{
          >div{
            font-size: 14px;
            color: #666;
            font-weight: 600;
            text-align: center;
            margin: 10px auto;
            border-bottom: 1px dashed #666;
          }
        }
        .addRules{
          display: block;
          width: 116px;
          height: 36px;
          background: url('../../../assets/lawtag/rules.png') center no-repeat;
          margin: 10px auto;
          &:hover{
            cursor: pointer;
          }
        }
        .el-collapse-item__header{
          height: 50px;
          font-weight: 600;
          color: #666;
          background: #e5eaf0!important;
          >i{
            width: 28px;
            height: 28px;
            float: right;
            margin-top: 10px;
            margin-right: 30px;
            background: url('../../../assets/lawtag/open.png') no-repeat center;
            &::before{
              content: none;
            }
          }
        }
        .el-collapse-item__wrap{
          .el-collapse-item__content{
            .tagDetailTitleContainer{
              >div{
                margin: 10px auto;
                >span{
                  display: inline-block;
                  vertical-align: top;
                  width: 30%;
                  height: 100%;
                  font-size: 16px;
                  color: #666;
                  text-align: right;
                  margin-right: 50px;
                }
                >p{
                  display: inline-block;
                  width: 60%;
                  font-size: 16px;
                  color: #666;
                  font-weight: 600;
                  .el-tag{
                    margin-left: 0px;
                    margin-right: 12px;
                  }
                  .tagDetailEdit{
                    display: block;
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    top:170px;
                    right: 25px;
                    background: url('../../../assets/lawtag/edit.png') center no-repeat;
                  }
                }
              }
            }
            .tagRules{
              width: 100%;
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              margin-bottom: 20px;
              >span{
                font-weight: 600;
                display: inline-block;
                width: 28%;
                float: left;
                text-align: right;
                color: #999;
              }
              >p{
                display: inline-block;
                font-weight: 500;
                margin-left: 42px;
                width: 65%;
                float: left;
                text-align: left;
                color: #666;
                max-width: 500px;
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
  }
</style>
