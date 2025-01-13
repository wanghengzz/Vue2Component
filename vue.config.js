const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      // 不同 sass-loader 版本对应关键字， v8-: data   v8: prependData   v10+: additionalData
      scss: {
        data: `@import "~@/style/variables.scss";`
      }
    }
  }
})
