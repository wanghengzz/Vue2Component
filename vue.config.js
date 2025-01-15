/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-15 15:28:07
 * @Description:
 * @FilePath: \vue2-project\vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8081 || process.env.PORT,
  },
  css: {
    loaderOptions: {
      // 不同 sass-loader 版本对应关键字， v8-: data   v8: prependData   v10+: additionalData
      scss: {
        data: `@import "~@/style/variables.scss";`
      }
    }
  }
})
