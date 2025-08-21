/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-07-31 23:01:11
 * @Description:
 * @FilePath: /Vue2Component/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8081 || process.env.PORT,
    proxy: {
      // 代理所有 /api 开头的请求
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 保持 /api 前缀
        },
      },
      // 如果需要代理其他路径，可以添加更多配置
      '/user': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/user': '/user',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      // 不同 sass-loader 版本对应关键字， v8-: data   v8: prependData   v10+: additionalData
      scss: {
        data: `@import "~@/style/variables.scss";`,
      },
    },
  },
})
