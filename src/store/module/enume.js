/*
 * @Author:
 * @Date: 2025-01-02 14:52:52
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-02 15:08:09
 * @Description:
 * @FilePath: \vue2-project\src\store\module\enume.js
 */
const state = {
  sex: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ],
  age: [
    { label: '18岁以下', value: '18' },
    { label: '18岁以上', value: '18' },
  ],
  education: [
    { label: '小学', value: 'primary' },
    { label: '初中', value: 'middle' },
    { label: '高中', value: 'high' },
    { label: '大学', value: 'university' },
  ],
  maritalStatus: [
    { label: '未婚', value: 'unmarried' },
    { label: '已婚', value: 'married' },
    { label: '离异', value: 'divorced' },
    { label: '丧偶', value: 'widowed' },
  ],
  income: [
    { label: '1000元以下', value: '1000' },
    { label: '1000元以上', value: '1000' },
  ],
  industry: [
    { label: 'IT', value: 'IT' },
    { label: '金融', value: 'finance' },
    { label: '教育', value: 'education' },
    { label: '医疗', value: 'medical' },
  ],
}

const mutations = {
  setEnume(state, key, value) {
    state[key] = value
  },
}

const actions = {
  setEnume(context, key, value) {
    context.commit('setEnume', key, value)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
