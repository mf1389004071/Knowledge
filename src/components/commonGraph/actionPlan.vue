<template>
	<div>
		<div class="graph_box">
	      <div class="bread">
	        <el-breadcrumb separator="/">
	          <el-breadcrumb-item :to="{ path: '/home/logging' }">首页</el-breadcrumb-item>
	          <el-breadcrumb-item :to="{ path: '/commongraph'}">通用图谱</el-breadcrumb-item>
	          <el-breadcrumb-item><span style="color: red">行动方案</span></el-breadcrumb-item>
	        </el-breadcrumb>
	      </div>
	    </div>
	</div>
</template>

<script>
	
</script>

<style lang="less" scoped>
	.graph_box {
      width: 100%;
      height: 40px;
      background: #ddd;
      .bread{
        width: 80%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        margin: 0px auto;
        >.el-breadcrumb{
          height: 40px;
          line-height: 40px;
        }
      }
    }
</style>