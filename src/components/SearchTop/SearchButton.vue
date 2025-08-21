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
        :loading="loadingStatus[index]"
        @click="handleButtonClick(btn,index)"
      >
        {{ btn.text }}
      </el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SearchButton',
  data(){
    return{
      loadingStatus:[]
    }
  },
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
  watch: {
    customButtons:{
      handler(newVal){
        this.loadingStatus = new Array(newVal.length).fill(false)
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleReset() {
      this.$emit('reset')
    },
    async handleButtonClick(btn,index) {
      console.log(this.loadingStatus);

      // 如果定义了具体的函数名，则触发对应的事件
      if (btn.funName) {
        try{
          this.$set(this.loadingStatus, index, true)
          await this.$emit(btn.funName, btn)
        }finally{
          this.$set(this.loadingStatus, index, false)
        }
      } else if (btn.clickFun && typeof btn.clickFun === 'function') {
        // 如果定义了clickFun，则直接执行
        try{
          this.$set(this.loadingStatus, index, true)
          await btn.clickFun(btn)
        }finally{
          this.$set(this.loadingStatus, index, false)
        }
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
