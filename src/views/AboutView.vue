<!--
<template>
  <div class="flex-y">
    <div >
      <FilterButtons :buttonGroup="buttonGroup" :multiple="true" :maxVisible="5" @change="handleChange" />
    </div>
    <div class=" flex-1">
      <common-table :table-data="tableData" :show-selection="true" :show-index="true" :columns="columns" :total="total"
        @selection-change="onSelectionChange" @size-change="onSizeChange" @current-change="onCurrentChange"
        @cell-change="onCellChange">
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

</style> -->
<template>
  <div class="about-view">
    <h2>环境配置示例</h2>

    <!-- 表单验证示例 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="0">
      <SmartFormItem label="姓名" prop="name">
        <el-input v-model="form.name" />
      </SmartFormItem>

      <SmartFormItem label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select>
      </SmartFormItem>

      <el-button @click="submit">提交</el-button>
    </el-form>

    <!-- API调用示例 -->
    <div class="api-example">
      <h3>API调用示例</h3>
      <el-button @click="testApi">测试API调用</el-button>
      <el-button @click="testLogin">测试登录</el-button>
      <el-button @click="testUpload">测试文件上传</el-button>

      <div v-if="apiResult" class="api-result">
        <h4>API调用结果：</h4>
        <pre>{{ apiResult }}</pre>
      </div>
    </div>

    <!-- 环境信息显示 -->
    <div class="env-info">
      <h3>当前环境信息</h3>
      <p><strong>环境：</strong>{{ currentEnv }}</p>
      <p><strong>API地址：</strong>{{ apiBaseUrl }}</p>
      <p><strong>Node环境：</strong>{{ nodeEnv }}</p>
    </div>
  </div>
</template>

<script>
import { userApi, dataApi, fileApi } from '@/api'
import { getApiConfig } from '@/config/api'

export default {
  data() {
    return {
      form: {
        name: '',
        gender: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
        gender: [{ required: true, message: '请选择性别' }]
      },
      apiResult: null,
      currentEnv: process.env.NODE_ENV,
      apiBaseUrl: getApiConfig().baseURL,
      nodeEnv: process.env.NODE_ENV
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('提交成功');
        }
      });
    },

    async testApi() {
      try {
        this.apiResult = '正在调用API...';
        const result = await dataApi.getDataList({ page: 1, size: 10 });
        this.apiResult = JSON.stringify(result, null, 2);
        this.$message.success('API调用成功');
      } catch (error) {
        this.apiResult = `API调用失败: ${error.message}`;
        this.$message.error('API调用失败');
      }
    },

    async testLogin() {
      try {
        this.apiResult = '正在测试登录...';
        const result = await userApi.login({
          username: 'test',
          password: '123456'
        });
        this.apiResult = JSON.stringify(result, null, 2);
        this.$message.success('登录测试成功');
      } catch (error) {
        this.apiResult = `登录测试失败: ${error.message}`;
        this.$message.error('登录测试失败');
      }
    },

    async testUpload() {
      try {
        // 创建一个测试文件
        const testFile = new File(['测试文件内容'], 'test.txt', { type: 'text/plain' });
        this.apiResult = '正在测试文件上传...';
        const result = await fileApi.uploadFile(testFile, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('上传进度:', percentCompleted);
        });
        this.apiResult = JSON.stringify(result, null, 2);
        this.$message.success('文件上传测试成功');
      } catch (error) {
        this.apiResult = `文件上传测试失败: ${error.message}`;
        this.$message.error('文件上传测试失败');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.about-view {
  padding: 20px;

  h2 {
    color: #333;
    margin-bottom: 20px;
  }

  .api-example {
    margin-top: 30px;

    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    .el-button {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .api-result {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;

      h4 {
        margin-top: 0;
        color: #333;
      }

      pre {
        background: #fff;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 12px;
      }
    }
  }

  .env-info {
    margin-top: 30px;

    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    p {
      margin: 8px 0;
      color: #333;

      strong {
        color: #409eff;
      }
    }
  }
}
</style>
