<!--
 * @Author:
 * @Date: 2025-01-02 15:09:17
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-15 15:11:49
 * @Description:
 * @FilePath: \vue2-project\src\Layout\index.vue
-->
<template>
  <div class="layout" :class="{ 'full-height': !showMenu }">
    <router-view></router-view>
  </div>
</template>

<script>
import { config } from '../../config/index'
export default {
  name: 'Layout',

  data() {
    return {
      showMenu: config.showMenu
    }
  },

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.layout {
  height: calc(100vh - 50px);
  overflow: hidden;

  &.full-height {
    height: 100vh;

    & > div {
      height: 100vh;
    }
  }

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
