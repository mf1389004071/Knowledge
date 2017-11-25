<template>
  <div class="srtnotext_search mainten">
    <div class="search_box">
      <!-- 案由 -->
      <div class="select clearfloat">
        <span>{{option.title}}</span>
        <el-select
          v-model="value"
          @change="select"
          filterable
          :placeholder="option.msg"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
