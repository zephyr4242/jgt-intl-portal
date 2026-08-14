import Vue from 'vue'
// markdown 渲染组件
// 只有开发环境会打包进去
if (process.env.VUE_APP_DEMO === 'Y') {
  const DemoBlock = require('../../jgt-ui-demo/demoBlock/demo-block.vue').default
  Vue.component('DemoBlock', DemoBlock)
}
