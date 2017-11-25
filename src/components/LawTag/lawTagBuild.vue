<template>
  <div class="buildTagContainer">
    <build-tag></build-tag>
  </div>
</template>
<script>
  import buildTag from '../common/buildTag.vue';
  export default {
    components: {
      buildTag
    }
  }
</script>
<style lang="less">
  .buildTagContainer{
    margin-top: -10px;
  }
</style>
