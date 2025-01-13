<!--
 * @Author:
 * @Date: 2025-01-02 15:09:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-06 10:24:37
 * @Description:
 * @FilePath: \vue2-project\src\Layout\index.vue
-->
<template>
  <div class="layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Layout',

  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.layout {
  height: calc(100vh - 50px);
  overflow: hidden;
  & > div {
    height: calc(100vh - 50px);
    padding: 10px;
    background-color: $bgColor;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
