<template>
  <el-dialog title="提示" :visible.sync="show" @close="close" width="500px">
      <div class="jgt-tc">
        您当前使用的浏览器版本过低，可能导致部分功能无法正常使用！

      </div>
      <div class="jgt-tc jgt-fw-bold jgt-mt-20 jgt-mb-20">
        推荐下载最新的浏览器来体验基构通网站
      </div>

      <div style="display: flex;justify-content: space-around;">
        <div>
          <a target="_blank" href="https://www.google.cn/chrome">
            <img src="../../../../assets/images/chrome.jpeg" />
          </a>
          <div>Chrome浏览器</div>
        </div>

        <div>
          <a target="_blank" href="https://www.microsoft.com/zh-cn/edge">
            <img src="../../../../assets/images/edge.jpeg" />
          </a>
          <div>Edge浏览器</div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'LowerVersion',
  data () {
    return {
      show: false
    }
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>

<style>

</style>
