<!--
 * @Author:
 * @Date: 2024-12-31 10:21:18
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-09 13:39:21
 * @Description:
 * @FilePath: \vue2-project\src\components\SearchTop\SearchContainer.vue
-->
<template>
  <div class="SearchContainer">
    <div class="SearchFrom">
      <SearchItem :formConfig="formConfig" ref="searchForm" v-on="$listeners" :formData="formData">
        <template v-for="(index, name) in $scopedSlots" v-slot:[name]="slotProps">
          <slot :name="name" v-bind="{ slotProps }"></slot>
        </template>
      </SearchItem>
    </div>
    <div class="SearchButton">
      <SearchButton :customButtons="customButtons" v-on="$listeners" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchContainer',
  components: {
  },
  data() {
    return {
    }
  },
  props: {
    customButtons: {
      type: Array,
      default: () => []
    },
    formConfig: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    handleChange(formData) {
      this.$emit('change', formData)
    }
  },
  mounted() {
    console.log(this.$scopedSlots)
  }
}
</script>
<style scoped lang="scss">
.SearchContainer {
  width: 100%;
  // height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .SearchFrom {
    flex: 8;
  }
  .SearchButton {
    flex: 2;
    // 换行后也对齐
    justify-content: flex-end;
  }
}
</style>
