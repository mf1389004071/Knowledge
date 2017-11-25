<template>
  <div id="chain">
    <!-- <dl>
        <dt><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></dt>
        <dd v-for="chain in selectedChains">
           <el-checkbox v-model="checkedChains" :key="chain.id" @change="handleCheckAllChange"></el-checkbox>
           <template v-for="item in chain.data">
             <el-button v-if="item.category == 'entity'">{{item.name}}</el-button>
             <span v-if="item.category == 'relation'">{{item.name}}</span>
           </template>
        </dd>
    </dl> -->
    <dl>
      <dt>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </dt>
      <dd v-for="chain in selectedChains">
        <el-checkbox v-model="checkedChains" :label="chain.id" @change="handleCheckedChainsChange">
          <template v-for="(item,index) in chain.data">
            <el-button size="small" v-if="item.category == 'entity'">{{item.name.length > 7 ? item.name.substring(0, 7) + '...' : item.name}}</el-button>
            <el-button type="text" v-if="item.category == 'relation'">{{item.name.length > 3 ? item.name.substring(0, 3) + '...' : item.name}}</el-button>
            <br v-if="(index+1)%6==0"/>
          </template>
        </el-checkbox>
      </dd>
    </dl>
  </div>
</template>

<script>
  export default{
    props: ['selectedChains'],
    data(){
      return {
        checkAll: false,
        isIndeterminate: true,
        checkedChains: []
      };
    },
    methods: {
      handleCheckAllChange(event) {
        let chainsOptionsId = [];
        for (var key in this.selectedChains) {
          chainsOptionsId.push(this.selectedChains[key].id);
        }
        this.checkedChains = event.target.checked ? chainsOptionsId : [];
        this.isIndeterminate = false;
      },
      handleCheckedChainsChange() {
        let checkedCount = this.checkedChains.length;
        this.checkAll = checkedCount === this.selectedChains.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectedChains.length;
      },
    },
    mounted(){

    },
    watch: {
      'checkedChains'(val){
        this.$emit('check', val);
      },
      'checkAll'(val){
        this.$emit('checkAll', val);
      }
    }
  }
</script>

<style lang="less">
  #chain {
    height: 100%;
    width: 580px;
    background: #fff;
    padding: 25px;
    dl {
      width: 580px;
      display: block;
      padding-bottom: 25px;
      dd {
        display: block;
        line-height: 10px;
        margin: 20px 0 20px 10px;
        position: relative;
        .el-checkbox__label {
          display: -webkit-box;
          margin-left: 20px;
          .el-button--small {
            width: 120px;
            font-size: 12px;
            margin-bottom: 10px;
            &:hover {
              border-color: #bfcbd9;
            }
          }
          .el-button--text {
            width: 54px;
            border-bottom: 1px solid #37BE29;
            color: #37BE29;
            font-size: 12px;
            padding: 2px 5px;
            position: relative;
            top: -6px;
          }
        }
      }
    }
  }
</style>
