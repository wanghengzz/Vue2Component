<!--
 * @Author:
 * @Date: 2025-01-06 09:37:07
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-06 14:52:19
 * @Description:
 * @FilePath: \vue2-project\src\components\Table\commonTable.vue
-->
<template>
  <div class="common-table">
    <el-table
      ref="elTable"
      :data="tableData"
      :border="border"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      :row-key="rowKey"
      :tree-props="{
        children: childrenKey,
        hasChildren: 'hasChildren',
      }"
    >
      <!-- 复选框列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="55"
        fixed="left"
        align="center"
      ></el-table-column>
      <!-- 动态列 -->
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align || 'center'"
        :fixed="item.fixed || 'left'"
      >
        <template slot-scope="scope">
          <!-- 根据type显示不同的表单元素 -->
          <template v-if="item.type">
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="scope.row[item.prop]"
              :size="item.size || 'mini'"
              :clearable="item.clearable || true"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              @change="(val) => handleValueChange(val, scope.row, item)"
            />

            <!-- 下拉框 -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="scope.row[item.prop]"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :multiple="item.multiple || false"
              :size="item.size || 'mini'"
              :clearable="item.clearable || true"
              @change="(val) => handleValueChange(val, scope.row, item)"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="scope.row[item.prop]"
              :type="item.dateType || 'date'"
              :placeholder="item.placeholder || '请选择日期'"
              :disabled="item.disabled"
              :value-format="item.valueFormat || 'yyyy-MM-dd'"
              :size="item.size || 'mini'"
              :clearable="item.clearable || true"
              @change="(val) => handleValueChange(val, scope.row, item)"
            />

            <!-- 开关 -->
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="scope.row[item.prop]"
              :disabled="item.disabled"
              :size="item.size || 'mini'"
              :active-value="item.activeValue || 1"
              :inactive-value="item.inactiveValue || 0"
              @change="(val) => handleValueChange(val, scope.row, item)"
            />

            <!-- 枚举 -->
            <span v-else-if="item.type === 'enum'">
              <span v-if="item.options && item.options.length > 0">
                {{
                  item.options.find(
                    (option) =>
                      option[item.valueKey || 'value'] === scope.row[item.prop]
                  )?.[item.labelKey || 'label']
                }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </span>

            <!-- 自定义插槽 -->
            <slot
              v-else-if="item.type === 'slot'"
              :name="item.slotName"
              :row="scope.row"
            ></slot>
          </template>
          <!-- 默认文本显示 -->
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="showPagination"
      class="pagination"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'commonTable',

  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 是否显示复选框
    showSelection: {
      type: Boolean,
      default: false,
    },
    // 是否显示序号
    showIndex: {
      type: Boolean,
      default: true,
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true,
    },
    // 表格高度
    height: {
      type: [String, Number],
      default: 'auto',
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 每页显示条数选项
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 添加新的 prop
    rowKey: {
      type: String,
      default: 'id',
    },
    // 添加自定义 children 属性名
    childrenKey: {
      type: String,
      default: 'children',
    },
  },

  data() {
    return {
      currentPage: 1,
      selectedRows: [],
      firstColumn: '', // 存储第一列的 prop
    }
  },

  created() {
    // 获取第一列的 prop
    if (this.columns.length > 0) {
      this.firstColumn = this.columns[0].prop
    }
  },

  methods: {
    // 选择项改变
    handleSelectionChange(selection) {
      this.selectedRows = selection
      this.$emit('selection-change', selection)
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    // 添加展开/收起方法
    toggleExpand(row) {
      this.$refs.elTable.toggleRowExpansion(row)
      this.$set(row, 'expanded', !row.expanded)
    },
    // 添加值变化处理方法
    handleValueChange(value, row, column) {
      this.$emit('cell-change', {
        value,
        row,
        prop: column.prop,
        type: column.type,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.common-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
    // 设置表格行高
  }
  .pagination {
    // margin-top: 10px;
    text-align: right;
    flex-shrink: 0;
  }
  .el-icon-arrow-right {
    cursor: pointer;
    transition: transform 0.3s;
    margin-right: 5px;

    &.expanded {
      transform: rotate(90deg);
    }
  }
}
::v-deep .el-table .el-table__cell {
  height: 30px !important;
}
</style>
