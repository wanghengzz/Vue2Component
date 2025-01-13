<!--
 * @Author:
 * @Date: 2024-12-31 10:29:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-02 09:52:40
 * @Description:
 * @FilePath: \vue2-project\src\components\SearchTop\SearchButton.vue
-->
<!--
 * @Author:
 * @Date: 2024-12-31 10:29:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-12-31 13:21:11
 * @Description:
 * @FilePath: \vue2-project\src\components\SearchTop\SearchButton.vue
-->
<template>
  <div class="search-button">
    <!-- 默认按钮 -->
    <el-button type="primary" @click="handleSearch" :size="defaultSize">查询</el-button>
    <el-button @click="handleReset" :size="defaultSize">重置</el-button>

    <!-- 自定义按钮 -->
    <template>
      <el-button
        v-for="(btn, index) in customButtons"
        :key="index"
        :type="btn.type"
        :size="btn.size"
        :icon="btn.icon"
        @click="handleButtonClick(btn)"
      >
        {{ btn.text }}
      </el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SearchButton',
  props: {
    // 自定义按钮配置
    customButtons: {
      type: Array,
      default: () => [],
    },
    defaultSize: {
      type: String,
      default: 'small',
    },
  },
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleReset() {
      this.$emit('reset')
    },
    handleButtonClick(btn) {
      // 如果定义了具体的函数名，则触发对应的事件
      if (btn.funName) {
        this.$emit(btn.funName, btn)
      } else if (btn.clickFun && typeof btn.clickFun === 'function') {
        // 如果定义了clickFun，则直接执行
        btn.clickFun(btn)
      }
    }
  },
}
</script>

<style scoped>
.search-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 4px;

}
</style>
