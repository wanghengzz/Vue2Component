<!--
 * @Author:
 * @Date: 2025-06-23 21:34:35
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-06-23 22:02:19
 * @Description:
 * @FilePath: /Vue2Component/src/components/slot/slotComp.vue
-->
<template>
  <div>
    <!-- slotComp 插槽，传递 bookList -->
    <!-- <slot name="slotComp" :bookList="bookList"></slot> -->
    <!-- 其他插槽，正常渲染 -->
    <!-- <slot name="slotComp2"></slot> -->
    <!-- <slot name="slotComp3"></slot> -->

    <div v-for="(slot, name) in $scopedSlots" :key="name">
      <slot :bookList="bookList" :name="name"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'slotComp',

  data() {
    return {
      bookList: [
        {
          name: 'book1',
          label: 'book1',
        },
        {
          name: 'book2',
          label: 'book2',
        },
        {
          name: 'book3',
          label: 'book3',
        },
      ],
    }
  },

  mounted() {
    console.log(this.$slots, '6666')
    console.log(this.$scopedSlots, '555')
  },

  methods: {},
}
</script>
