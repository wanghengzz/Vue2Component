<!--
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-15 15:10:01
 * @Description:
 * @FilePath: \vue2-project\src\App.vue
-->
<template>
  <div id="app">
    <nav v-if="showMenu">
      <router-link v-for="item in routerList" :to="item.path" :key="item.path">{{ item.meta.title||item.name }}</router-link>
    </nav>
    <router-view />
  </div>
</template>
<script>
import { getRouter } from './router'
import { config } from '../config/index'
export default {
  name: 'App',
  data() {
    return {
      showMenu: config.showMenu
    }
  },
  computed: {
    routerList() {
      return getRouter()[0].children
    }
  },
  mounted() {
    console.log(getRouter())
  }
}
</script>
<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  height: 50px;
  background-color: $headerBgColor;
  padding: 0 20px;
  a:hover {
    color: $hoverColor;
    text-decoration: underline;
  }
}
#app {
  height: 100vh;
}
</style>
