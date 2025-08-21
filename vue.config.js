/*
 * @Author:
 * @Date: 2024-09-19 15:12:58
<<<<<<< HEAD
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-07-31 23:01:11
=======
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-02-27 08:39:08
>>>>>>> 18523955daa5807c571b18738ec472debc5d225a
 * @Description:
 * @FilePath: /Vue2Component/vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')
const localServe='http://127.0.0.1:9000'
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8081 || process.env.PORT,
    proxy: {
<<<<<<< HEAD
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
=======
      '/api': {
        target: localServe, // 后端服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': '' // 重写路径，删除 /api 前缀
        },
      }
    }
>>>>>>> 18523955daa5807c571b18738ec472debc5d225a
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
        data: `@import "~@/style/variables.scss";`,
      },
    },
  },
})
