const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname,'src')  
      }
    }
  },
  // 配置代理跨域
  devServer: {
    proxy: {
      "/im": {
        target: "http://127.0.0.1:8082"
      }
    }
  }
})
