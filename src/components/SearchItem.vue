<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    class="form-container"
    :label-position="labelPosition"
  >
    <el-form-item
      v-for="item in formConfig"
      :key="item.field"
      :label="item.label"
      :prop="item.field"
      :label-width="zeroLabelWidth.includes(item.type) ? '0px' : (item.labelWidth || '80px')"
      :class="[`col-${item.col || 3}`, { 'full-width': item.fullWidth }]"
    >
      <!-- 文本域 -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model="formData[item.field]"
        type="textarea"
        :rows="item.rows || 3"
        :size="item.size || 'mini'"
        :placeholder="item.placeholder || '请输入'"
        :disabled="item.disabled"
        :clearable="item.clearable || true"
        @input="handleChange(item.field)"
      />

      <!-- 下拉选择框 -->
      <el-select
        v-else-if="item.type === 'select'"
        v-model="formData[item.field]"
        :placeholder="item.placeholder || '请选择'"
        :disabled="item.disabled"
        :multiple="item.multiple || false"
        :size="item.size || 'mini'"
        :clearable="item.clearable || true"
        @change="handleChange(item.field)"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 单选框组 -->
      <el-radio-group
        v-else-if="item.type === 'radio'"
        v-model="formData[item.field]"
        :disabled="item.disabled"
        :size="item.size || 'mini'"
        @change="handleChange(item.field)"
      >
        <el-radio
          v-for="option in item.options"
          :key="option.value"
          :label="option.value"
        >
          {{ option.label }}
        </el-radio>
      </el-radio-group>

      <!-- 复选框组 -->
      <el-checkbox-group
        v-else-if="item.type === 'checkbox'"
        v-model="formData[item.field]"
        :disabled="item.disabled"
        :size="item.size || 'mini'"
        @change="handleChange(item.field)"
      >
        <el-checkbox
          v-for="option in item.options"
          :key="option.value"
          :label="option.value"
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 开关 -->
      <el-switch
        v-else-if="item.type === 'switch'"
        v-model="formData[item.field]"
        :disabled="item.disabled"
        :size="item.size || 'mini'"
        @change="handleChange(item.field)"
      />

      <!-- 日期选择 -->
      <el-date-picker
        v-else-if="item.type === 'date'"
        v-model="formData[item.field]"
        type="date"
        :disabled="item.disabled"
        :size="item.size || 'mini'"
        @change="handleChange(item.field)"
      />

      <!-- 时间选择 -->
      <el-time-picker
        v-else-if="item.type === 'time'"
        v-model="formData[item.field]"
        :disabled="item.disabled"
        :size="item.size || 'mini'"
        :clearable="item.clearable || true"
        @change="handleChange(item.field)"
      />

      <!-- 模糊搜索 -->
      <el-autocomplete
        v-else-if="item.type === 'autocomplete'"
        v-model="formData[item.field]"
        :size="item.size || 'mini'"
        :placeholder="item.placeholder || '请输入'"
        :fetch-suggestions="item.fetchSuggestions || defaultFetchSuggestions"
        @select="item.handleSelect || defaultHandleSelect"
        :trigger-on-focus="false"
        :clearable="item.clearable || true"
        :value-key="item.valueKey || 'value'"
      >
        <template #default="row">
          <div v-if="Array.isArray(item.labelKey)">{{ item.labelKey.map(key => row.item[key]).join(' ') }}</div>
          <div v-else>{{ row.item[item.labelKey || 'label'] || row.item[item.valueKey || 'value'] }}</div>
        </template>
      </el-autocomplete>

      <slot v-else-if="item.type === 'slot'" :name="item.slotName"></slot>

      <div v-else-if="item.type === 'contentTitle'" class="title-container">{{ item.title }}</div>

       <!-- 文本输入框 -->
      <el-input
        v-else
        v-model="formData[item.field]"
        :type="item.inputType || 'text'"
        :size="item.size || 'mini'"
        :placeholder="item.placeholder || '请输入'"
        :disabled="item.disabled"
        :clearable="item.clearable || true"
        @input="handleChange(item.field,item.reg)"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FormItem',

  props: {
    formConfig: {
      type: Array,
      default: () => [],
    },
    initialValues: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    zeroLabelWidth: {
      type: Array,
      default: () => ['contentTitle'],
    },
    labelPosition: {
      type: String,
      default: 'right',
      validator: value => ['left', 'right', 'top'].includes(value)
    },
  },

  data() {
    return {
      rules: {}, // 用于存储验证规则
    }
  },

  created() {
    this.initFormRules()
    console.log(this.formData);
  },

  methods: {
    initFormRules() {
      this.formConfig.forEach((item) => {
        if (item.rules) {
          this.$set(this.rules, item.field, item.rules)
        }
      })
    },

    handleChange(field,reg) {
      if(reg){
        this.formData[field] = this.formData[field].replace(reg, '')
      }
      this.$emit('change',this.formData)
    },

    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(this.formData)
          } else {
            reject('表单填写不完整!')
          }
        })
      })
    },

    resetForm() {
      this.$refs.form.resetFields()
    },

    getFormData() {
      return this.formData
    },

    defaultFetchSuggestions(query, callback) {
      callback([
        { value: '未设置', label: '未设置' },
      ])
    },

    defaultHandleSelect() {
      // 默认的选择处理函数
      this.$emit('change',this.formData)
    },
    defaultHandleSearchLast() {
      // 默认的搜索处理函数
    },
  },
}
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .el-input,
  .el-select,
  .el-date-picker,
  .el-time-picker,
  .el-autocomplete {
    width: 100%;
  }
}
.form-container .el-form-item {
  margin-bottom: 10px;
  width: 50%;
}
.form-container .el-form-item.col-1 {
  width: 100%;
}
.form-container .el-form-item.col-2 {
  width: 50%;
}
.form-container .el-form-item.col-3 {
  width: 33.333%;
}
.form-container .el-form-item.col-4 {
  width: 25%;
}
.form-container .el-form-item.col-5 {
  width: 20%;
}
.form-container .el-form-item.col-6 {
  width: 16.666%;
}
.form-container .el-form-item.col-7 {
  width: 14.285%;
}
.form-container .el-form-item.full-width {
  width: 100%;
}
.title-container {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
}
</style>
