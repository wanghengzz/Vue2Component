<!--
 * @Author:
 * @Date: 2025-01-03 14:46:07
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-09 14:22:57
 * @Description:
 * @FilePath: \vue2-project\src\views\NestPage\index.vue
-->
<template>
  <div>
    <div class="flex-1">
      <h1>NestPage</h1>
      <router-link to="/nestPage/pageOne">PageOne</router-link>
      <router-link to="/nestPage/pageTwo">PageTwo</router-link>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NestPage',

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
a {
  display: inline-block;
  color: #000;
  text-decoration: none;
  margin-right: 10px;
}
</style>
