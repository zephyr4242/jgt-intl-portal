<template>
  <el-dialog title="重置成功" :visible.sync="show" @close="close" width="600px" custom-class="reset-done">
    <div class="jgt-tc">
      <i class="iconfont-xinxiqueren reset-done-icon"></i>
      <p>您的新登录密码已重置成功,请继续设置交易/授权密码</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="close">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResetLoginDone',
  data () {
    return {
      show: false
    }
  },
  methods: {
    close () {
      this.$emit('confirm')
      this.show = false
    }
  }
}
</script>
<style lang="scss" >
.reset-done .reset-done-icon {
  font-size: 60px;
  line-height: 60px;
  width: 60x;
  margin: 20px auto;
  @include color(A10);
  display: inline-block;
}
</style>
