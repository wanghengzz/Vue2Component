<!--
 * @Author:
 * @Date: 2025-01-02 09:54:00
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-06 16:45:45
 * @Description:
 * @FilePath: \vue2-project\src\components\FilterButtons\FilterButtons.vue
-->
<template>
  <div class="filter-buttons">
    <!-- 显示可见按钮 -->
    <el-button v-for="item in sortedVisibleButtons" :key="item.value" :class="{ active: isActive(item) }" round
      :size="size" @click="handleClick(item)">
      {{ item.label }}
    </el-button>

    <!-- 气泡显示隐藏的按钮 -->
    <el-popover v-if="hasMoreButtons" placement="bottom" trigger="hover" popper-class="filter-buttons-popover">
      <div class="more-buttons">
        <el-button v-for="item in sortedHiddenButtons" :key="item.value" :class="{ active: isActive(item) }" round
          :size="size" @click="handlePopoverClick(item)">
          {{ item.label }}
        </el-button>
      </div>
      <i class="el-icon-more" slot="reference"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'FilterButtons',

  props: {
    // 是否为多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
    // 按钮选项
    buttonGroup: {
      type: Array,
      default: () => [
        { label: '全部', value: 'all' },
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
    },
    // 全部选项的值
    allValue: {
      type: [String, Number],
      default: 'all',
    },
    // 默认选中值
    defaultSelected: {
      type: [String, Array],
      default: null,
    },
    // 按钮大小
    size: {
      type: String,
      default: 'small',
    },
    maxVisible: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
      selectedValues: this.initSelectedValues(),
      buttonOrder: [], // 存储按钮的自定义顺序
    }
  },

  created() {
    // 初始化按钮顺序
    this.buttonOrder = this.buttonGroup.map(item => item.value)
  },

  computed: {
    sortedVisibleButtons() {
      // 始终保持"全部"按钮在第一位
      const allButton = this.buttonGroup.find(btn => btn.value === this.allValue)
      const otherButtons = this.getSortedButtons().filter(btn => btn.value !== this.allValue)
      return [allButton, ...otherButtons.slice(0, this.maxVisible - 1)]
    },

    sortedHiddenButtons() {
      const allButtons = this.getSortedButtons()
      return allButtons.slice(this.maxVisible)
    },

    hasMoreButtons() {
      return this.buttonGroup.length > this.maxVisible
    }
  },

  methods: {
    initSelectedValues() {
      if (this.defaultSelected) {
        return Array.isArray(this.defaultSelected)
          ? this.defaultSelected
          : [this.defaultSelected]
      }
      return [this.allValue] // 如果没有默认值，则选中"全部"
    },

    isActive(item) {
      return this.selectedValues.includes(item.value)
    },

    handleClick(item) {
      if (this.multiple) {
        this.handleMultipleSelect(item)
      } else {
        this.handleSingleSelect(item)
      }
      this.$emit('change', this.selectedValues)
    },

    handleMultipleSelect(item) {
      if (item.value === this.allValue) {
        // 点击全部，只选中全部
        this.selectedValues = [this.allValue]
      } else {
        const index = this.selectedValues.indexOf(item.value)
        if (index > -1) {
          // 取消选中
          this.selectedValues.splice(index, 1)
          // 如果没有选中项，则选中"全部"
          if (this.selectedValues.length === 0) {
            this.selectedValues = [this.allValue]
          }
        } else {
          // 选中当前项，并移除"全部"
          this.selectedValues = this.selectedValues.filter(
            (v) => v !== this.allValue
          )
          this.selectedValues.push(item.value)
        }

        // 检查是否选中了除"全部"外的所有选项
        const allOptionsExceptAll = this.buttonGroup
          .filter((opt) => opt.value !== this.allValue)
          .map((opt) => opt.value)

        if (
          allOptionsExceptAll.every((value) =>
            this.selectedValues.includes(value)
          )
        ) {
          this.selectedValues = [this.allValue]
        }
      }
    },

    handleSingleSelect(item) {
      if (this.selectedValues.length === 1 && this.selectedValues[0] === item.value) {
        // 如果点击的是已选中的按钮，则选中"全部"
        this.selectedValues = [this.allValue]
      } else {
        // 否则选中点击的按钮
        this.selectedValues = [item.value]
      }
    },

    getSortedButtons() {
      return [...this.buttonGroup].sort((a, b) => {
        const indexA = this.buttonOrder.indexOf(a.value)
        const indexB = this.buttonOrder.indexOf(b.value)
        return indexA - indexB
      })
    },

    handlePopoverClick(item) {
      // 处理气泡中按钮的点击
      const newOrder = [...this.buttonOrder]
      const clickedIndex = newOrder.indexOf(item.value)
      const insertIndex = 1 // "全部"按钮后面的位置

      // 移动点击的按钮到新位置
      newOrder.splice(clickedIndex, 1)
      newOrder.splice(insertIndex, 0, item.value)

      this.buttonOrder = newOrder

      // 处理按钮的选中状态
      this.handleClick(item)
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.more-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

::v-deep .el-button {
  margin-left: 0px;
  &.active {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }

  // 只添加 focus 样式，移除 hover
  &:focus {
    background: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }

  // 保持激活状态的样式
  &.active:focus,
  &.active:hover {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
}
</style>
