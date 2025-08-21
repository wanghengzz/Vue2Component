<template>
  <el-form-item :prop="prop" :rules="rules" class="smart-form-item" :show-message="false" >
    <el-tooltip v-if="errorMessage" :content="errorMessage" placement="top-start" effect="dark"
      :visible="showTooltip" popper-class="smart-error-tooltip">
      <div class="input-wrapper" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <label v-if="label" class="smart-label">{{ label }}</label>
        <slot />
      </div>
    </el-tooltip>

    <!-- 无错误则不包裹 tooltip -->
    <div v-else class="input-wrapper">
      <label v-if="label" class="smart-label">{{ label }}</label>
      <slot />
    </div>
  </el-form-item>
</template>

<script>
export default {
  name: 'SmartFormItem',
  props: {
    label: String,
    prop: String,
    rules: [Object, Array]
  },
  inject: ['elForm'], // 注入 el-form 实例
  data() {
    return {
      showTooltip: false
    };
  },
  computed: {
    errorMessage() {
      const formItem = this.elForm.fields.find(f => f.prop === this.prop);
      return formItem && formItem.validateMessage ? formItem.validateMessage : '';
    }
  }
};
</script>

<style scoped>
.smart-form-item {
  position: relative;
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
}

.smart-label {
  position: absolute;
  top: -8px;
  left: 10px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #999;
  z-index: 1;
}
</style>


