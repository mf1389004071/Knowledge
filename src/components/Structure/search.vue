<template>
  <div id="header_search">
    <div class="search_box">
      <div class="select clearfloat" v-for="(searchItem,index) in search">
        <span>{{searchItem.title}}</span>
        <el-select :class="searchItem.tag" v-model="searchItem.value" :loading="loading" clearable filterable :placeholder="searchItem.msg"
                   @change="select(searchItem.value,searchItem.tag);getOptions(searchItem.tag)">
          <el-option
            v-for="item in searchItem.data"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="search_result">
      <div>
        <textarea name="" id="" readonly>{{this.$store.state.search.content}}</textarea>
      </div>
      <el-button type="primary" @click="prevPage">上一页</el-button>
      <el-button type="primary" @click="nextPage">下一页</el-button>
    </div>
  </div>
</template>

<script>
  import axios from '../../js/axios-api.js';
  export default{
    data(){
      return {
        search: [
          {
            title: '案由',
            msg: '点击选择案由',
            tag: 'case_cause',
            value: '',
            data: []
          },
          {
            title: '类型',
            msg: '点击选择类型',
            tag: 'type',
            value: '',
            data: []
          },
          {
            title: '范围',
            msg: '点击选择范围',
            tag: 'apply_area',
            value: '',
            data: []
          },
          {
            title: '法条',
            msg: '点击选择法条',
            tag: 'title',
            value: '',
            data: []
          },
          {
            title: '条目',
            msg: '点击选择条目',
            tag: 'num',
            value: '',
            data: []
          },
        ],
        loading:false,
        searchParams: {},
        // 法条详细
        titleList: []
      }
    },
    props: {
      isChecked: {
        type: Boolean
      },
      all: {
        type: Number
      },
      type: {
        type: String
      },
    },
    mounted(){
      console.log(localStorage.access_token,'777777')
      if (this.type == 'title') {
        this.search = this.search.slice(0, 4);
      }

      if (this.$store.state.search.content_show) {
        this.search[0].value = this.$store.state.search.case_cause;
        this.search[1].value = this.$store.state.search.type;
        this.search[2].value = this.$store.state.search.apply_area;
        this.search[3].value = this.$store.state.search.title;
        this.search[4].value = this.$store.state.search.num;
      }
      this.getOptions();
    },
    methods: {
      prevPage(){
        console.log(this.$store.state.search.page);
        if (this.$store.state.search.page > 1) {
          this.$store.state.search.page--;
          console.log(this.$store.state.search.page);
          this.$store.commit('search');
        }
      },
      nextPage(){
        if (this.$store.state.search.page < this.$store.state.search.total) {
          this.$store.state.search.page++;
          console.log(this.$store.state.search.page);
          this.$store.commit('search');
        } else if (this.$store.state.search.num) {
          this.selectNext();
        }
      },
      selectNext() {
        const index = this.search[4].data.findIndex(row => row.value === this.search[4].value);
        if (index < this.search[4].data.length - 1) {
          this.search[4].value = this.search[4].data[this.search[4].data.findIndex(row => row.value === this.search[4].value) + 1].value;
        } else {
          return;
        }

      },
      select(el, tag){
        var _this = this;
        this.$store.state.search.page = 1;
        if (!this.$store.state.search.content_show) {

          this.searchParams[tag] = el;
          this.searchParams.page = 1;

          this.$store.state.search.is_checked = this.$store.state.checked;

          this.$store.state.search[tag] = this.searchParams[tag];
          if (tag == 'case_cause' || tag == 'type' || tag == 'apply_area') {
            this.search[3].value = '';
            this.search[4].value = '';
          }
          if (tag == 'title') {
            this.search[4].value = '';
          }
          if (tag == 'num') {
            this.$store.state.search.page = 1;
          }
          if (this.search[3].value) {
            this.$nextTick(() => {
              this.$store.commit('search');
            })
          }

        } else {
          this.$store.state.search.content_show = false;
          const params = {
            source_id: this.$store.state.search.content_id
          }
          alert(axios);
          axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/list', {params:params})
            .then((res) => {

              this.$store.state.search.case_cause = res.data.data[0].case_cause;
              this.$store.state.search.type = res.data.data[0].type;
              this.$store.state.search.title = res.data.data[0].title;
              this.$store.state.search.num = res.data.data[0].num;
              this.$store.state.search.content = res.data.data[0].content;
              $('.title .el-input__inner').val(this.$store.state.search.title);
              $('.num .el-input__inner').val(this.$store.state.search.num);

            }).catch((res) => {
            this.$store.state.search.content = '没有数据';
          })
        }
      },
      getOptions(){
        var _this = this;
        this.loading=true;
        const params = {
          case_cause: this.searchParams.case_cause ? this.searchParams.case_cause : '',
          type_id: this.searchParams.type ? this.searchParams.type : '',
          apply_area: this.searchParams.apply_area ? this.searchParams.apply_area : '',
          title: this.searchParams.title ? this.searchParams.title : '',
          is_checked: this.$store.state.checked
        };
        axios.get(this.$store.state.url1 + '/api/nlp/knowledge/source/search', {params: params})
          .then((res) => {
            this.loading = false;
            this.search[0].data = [];
            this.search[1].data = [];
            this.search[2].data = [];
            this.search[3].data = [];
            this.search[4].data = [];

            // 案由
            res.data.data.case_causes.map( (elem, index) => {
              this.search[0].data.push({
                value: elem._id,
                label: elem.name
              })
            })
            // 文本类型
            res.data.data.types.map( (elem, index) => {
              this.search[1].data.push({
                value: elem._id,
                label: elem.name
              })
            })
            //范围
            res.data.data.areas.map( (elem, index) => {
              this.search[2].data.push({
                value: elem,
                label: elem
              })
            })
            // 法条
            res.data.data.titles.map( (elem, index) => {
              this.search[3].data.push({
                value: elem.title,
                label: elem.title
              })
            })

            // 条目
            res.data.data.nums.map( (elem, index) => {
              this.search[4].data.push({
                value: elem.num,
                label: elem.name
              })
            })


          })
          .catch((res) => {
            console.log('err');
          })
      },
    }
  }
</script>

<style lang="less" scoped>
  #header_search {
    height: 82px;
    background: #F6F6F6;
    .select:first-child {
    }
    .search_box {
      width: 85%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
    }
    .search_result {
      width: 80%;
      margin: 30px auto;
      button{
        width: 100px;
        padding: 10px 0;
        border-color: #2281E9;
        border-radius: 2px;
        background: #2281E9;
        font-size: 16px;
        color: #fff;
      }
    }
    textarea {
      width: 100%;
      height: 110px;
      resize: none;
      border-color: #4078B4;
      color: #000;
      font-size: 16px;
      line-height: 26px;
      padding: 10px 22px;
      margin-left: 0;
    }
    .select {
      width: 246px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #2281E9;
      background: #fff;
      margin-top: 24px;
      span {
        display: inline-block;
        float: left;
        font-size: 14px;
        color: #3D3D3D;
        // width: 91px;
        padding: 0 18px 0 15px;
        height: 100%;
        border-right: 1px solid #2281E9;
      }
      .el-select {
        float: left;
        width: 65%;
        height: 100%;
        .el-input {
          height: 100%;
          font-size: 14px;
        }
      }
      .el-input__inner {
        border: none;
        height: 100%;
        color: #006fe6;
      }
      .el-select .el-input .el-input__icon {
        color: #2F86E3;
        font-size: 14px;
      }
    }
  }
</style>
