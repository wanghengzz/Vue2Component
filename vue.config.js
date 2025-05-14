/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-02-27 08:39:08
 * @Description:
 * @FilePath: \vue2-project\vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
const localServe='http://127.0.0.1:9000'
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8081 || process.env.PORT,
    proxy: {
      '/api': {
        target: localServe, // 后端服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': '' // 重写路径，删除 /api 前缀
        },
      }
    }
  },
  // 配置打包路径
  outputDir: 'dist',
  // 配置打包文件夹名称
  assetsDir: 'static',
  // 配置打包文件夹名称
  publicPath: '/',
  // 配置打包文件夹名称
  indexPath: 'index.html',
  // 配置打包文件夹名称
  filenameHashing: true,
  // 配置打包文件夹名称
  runtimeCompiler: true,
  // 配置打包文件夹名称
  productionSourceMap: false,
  // 配置打包文件夹名称
  css: {
    loaderOptions: {
      // 不同 sass-loader 版本对应关键字， v8-: data   v8: prependData   v10+: additionalData
      scss: {
        data: `@import "~@/style/variables.scss";`
      }
    }
  }
})
