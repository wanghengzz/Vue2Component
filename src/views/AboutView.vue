<!--
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-15 17:17:21
 * @Description:
 * @FilePath: \vue2-project\src\views\AboutView.vue
-->
<template>
  <div class="flex-y">
    <div class="filter-buttons">
      <FilterButtons :buttonGroup="buttonGroup" :multiple="true" :maxVisible="5" @change="handleChange" />
    </div>
    <div class="table-container flex-1">
      <common-table :table-data="tableData" :show-selection="true" :show-index="true" :columns="columns" :total="total"
        @selection-change="onSelectionChange" @size-change="onSizeChange" @current-change="onCurrentChange"
        @cell-change="onCellChange">
        <!-- 自定义列模板 -->
        <template #operation="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView',

  data() {
    return {
      buttonGroup: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '已读',
          value: 'read',
        },
        {
          label: '未读',
          value: 'unread',
        },
        {
          label: '已删除',
          value: 'deleted',
        },
        {
          label: '已收藏',
          value: 'collected',
        },
        {
          label: '已收藏2',
          value: 'collected2',
        },
        {
          label: '已收藏3',
          value: 'collected3',
        },
      ],
      tableData: [
        {
          id: 1,
          name: '父级1',
          date:'',
          children: [
            {
              id: 2,
              name: '子级1-1'
            }
          ]
        },
        {
          id: 3,
          name: '父级2',
          status: 1,
          date: '2025-01-01',
          isActive: true,
          enum: 1,
        }
      ],
      columns: [
        {
          prop: 'name',
          label: '名称',
        },
        {
          prop: 'enum',
          label: '枚举',
          type: 'enum',
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]
        },
        {
          prop: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]
        },
        {
          prop: 'date',
          label: '日期',
          type: 'date',
          dateType: 'datetime'
        },
        {
          prop: 'isActive',
          label: '是否激活',
          type: 'switch'
        },
        {
          prop: 'operation',
          label: '操作',
          type: 'slot',
          slotName: 'operation',
        }
      ],
      total: 0,
    }
  },

  mounted() {},

  methods: {
    handleChange(value) {
      console.log(value)
    },
    onSelectionChange(selection) {
      console.log(selection)
    },
    onSizeChange(size) {
      console.log(size)
    },
    onCurrentChange(current) {
      console.log(current)
    },
    handleEdit(row) {
      console.log('编辑行:', row);
      // 在这里添加编辑逻辑
    },
    handleDelete(row) {
      console.log('删除行:', row);
      // 在这里添加删除逻辑
    },
    onCellChange(value) {
      console.log(value);
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
