/*
 * @Author:
 * @Date: 2025-01-02 09:50:50
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-02 09:50:59
 * @Description:
 * @FilePath: \vue2-project\src\components\index.js
 */
// 自动扫描当前文件夹下的所有组件
const requireComponent = require.context(
  '.', // 在当前目录下查找
  true, // 查询子目录
  /\.vue$/ // 只匹配以 .vue 结尾的文件
)

export default {
  install(Vue) {
    // 遍历获取到的组件路径
    requireComponent.keys().forEach(fileName => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName)
      // 获取组件的 PascalCase 命名
      const componentName = fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '') // 删除文件扩展名
        .split('-')
        .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1))
        .join('')

      // 全局注册组件
      Vue.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，否则回退到使用模块的根
        componentConfig.default || componentConfig
      )
    })
  }
}
