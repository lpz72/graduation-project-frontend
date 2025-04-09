const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
devServer: {
  historyApiFallback: true, // 关键配置
},
transpileDependencies: true,
lintOnSave: "warning",
});
