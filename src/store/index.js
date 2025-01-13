/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-02 14:55:04
 * @Description:
 * @FilePath: \vue2-project\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 自动导入 modules 文件夹下的所有模块
const modulesFiles = require.context('./module', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  getters,
})
