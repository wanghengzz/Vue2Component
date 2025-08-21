<!--
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-08-21 20:55:03
 * @Description:
 * @FilePath: /Vue2Component/src/views/HomeView.vue
-->
<template>
  <div class="home">
    <!-- 查询条件 -->
    <SearchContainer
      :customButtons="customButtons"
      :formConfig="formConfig"
      @save="save"
      @search="search"
      @reset="reset"
      :formData="formData"
      ref="searchContainer"
      @change="handleChange"
    >
      <template #address>
        <el-input
          placeholder="请输入地址"
          size="mini"
          v-model="formData.address"
        ></el-input>
      </template>
    </SearchContainer>
    <!-- 弹窗 -->
    <el-button @click="dialogVisible = true" size="small">弹窗</el-button>
    <CommonDialog
      v-model="dialogVisible"
      title="提示"
      width="40%"
      @confirm="confirm"
      @close="close"
    >
      <SearchItem
        :formConfig="formConfig"
        ref="searchForm"
        :formData="formData"
      >
        <template #address>
          <el-input
            placeholder="请输入地址"
            size="mini"
            v-model="formData.address"
          ></el-input>
        </template>
      </SearchItem>
    </CommonDialog>

    <slotComp>
      <template #slotComp="slotProps">
        <div v-for="item in slotProps.bookList" :key="item.name">
          <div>{{ item.name }}</div>
          <div>{{ item.label }}</div>
        </div>
      </template>
      <template #slotComp2>
        <div>123</div>
      </template>
      <template #slotComp3>
        <div>123</div>
      </template>
    </slotComp>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      customButtons: [
        {
          text: '导出',
          type: 'primary',
          size: 'small',
          icon: 'el-icon-download',
          clickFun: async() => {
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(this)
            console.log('导出')
          },
        },
        {
          text: '保存',
          type: 'primary',
          size: 'small',
          icon: 'el-icon-download',
          funName: 'save',
        },
      ],
      formConfig: [
        {
          field: 'name',
          label: '姓名',
          type: 'input',
          placeholder: '请输入姓名',
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            {
              min: 2,
              max: 5,
              message: '长度在 2 到 5 个字符',
              trigger: 'blur',
            },
          ],
          reg: this.$defaultSet.regList.name,
        },
        {
          field: 'gender',
          label: '性别',
          type: 'select',
          options: this.$store.getters.enume.sex || [],
          rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
        },
        {
          field: 'address',
          label: '地址',
          type: 'slot',
          slotName: 'address',
        },
        {
          field: 'industry',
          label: '职业',
          type: 'select',
          options: this.$store.getters.enume.industry || [],
          multiple: true,
        },
        {
          field: 'height',
          label: '身高',
          type: 'autocomplete',
          valueKey: 'enumeValue',
          labelKey: ['enumeValue', 'enumeLabel'], // 下拉展示多个属性字段
          fetchSuggestions: (query, callback) => {
            let list = [
              {
                value: '170',
                label: '170',
                enumeValue: '170000',
                enumeLabel: '170cm',
              },
              {
                value: '171',
                label: '171',
                enumeValue: '171000',
                enumeLabel: '171cm',
              },
              {
                value: '172',
                label: '172',
                enumeValue: '172000',
                enumeLabel: '172cm',
              },
            ]
            callback(list)
          },
          handleSelect: (item) => {
            console.log(item)
          },
        },
        {
          field: 'weight',
          label: '体重',
          type: 'autocomplete',
          // valueKey: 'enumeValue',
          // labelKey: 'enumeLabel', // 下拉展示单个属性字段
          fetchSuggestions: (query, callback) => {
            let list = [
              {
                value: '170',
                label: '170',
                enumeValue: '170000',
                enumeLabel: '170kg',
              },
              {
                value: '171',
                label: '171',
                enumeValue: '171000',
                enumeLabel: '171kg',
              },
              {
                value: '172',
                label: '172',
                enumeValue: '172000',
                enumeLabel: '172kg',
              },
            ]
            callback(list)
          },
          handleSelect: (item) => {
            console.log(item)
          },
        },
        {
          title: '标题',
          type: 'contentTitle',
          fullWidth: true,
        },
      ],
      formData: {
        name: '',
        gender: '',
        address: '',
        sex: '',
        height: '',
        weight: '',
      },
      // 弹窗
      dialogVisible: false,
    }
  },
  methods: {
    save(btn) {
      console.log(btn)
    },
    search() {
      console.log('search', this.formData)
    },
    handleChange(formData, field) {
      console.log('handleChange', formData, field)
    },
    reset() {
      console.log('reset')
    },
    async confirm() {
      try {
        let res = await this.$refs.searchForm.validate()
        if (res) {
          this.$confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'custom-message-box',
          })
            .then(() => {
              this.dialogVisible = false
              this.$refs.searchForm.resetForm()
              console.log('确定')
            })
            .catch(() => {
              console.log('取消')
            })
        }
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      this.dialogVisible = false
      this.$refs.searchForm.resetForm()
      console.log('close')
    },
  },
  mounted() {
  },
}
</script>
<style lang="scss" scoped>
// 弹窗容器
.el-message-box__wrapper {
  position: fixed !important;
  z-index: 9999 !important;
}
</style>
