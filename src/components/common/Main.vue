<template>
  <div>
    <div class="main-search">
      <search ref="search"></search>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import Search from './search'
  export default {
    components:{
      'search':Search,
    }
  }
</script>
<style lang="less" scoped>
  #header_search .search_box{
    width: 80%;
    margin: 0 auto;
  }
</style>
