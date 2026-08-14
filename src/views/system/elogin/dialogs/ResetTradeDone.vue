<template>
  <el-dialog title="设置成功" :visible.sync="show" @close="close" width="600px" custom-class="reset-done">

    <div class="jgt-tc">
      <i class="iconfont-xinxiqueren reset-done-icon"></i>
      <p>您的交易/授权密码已设置成功,请重新登录</p>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="confirm">重新登录</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResetTradeDone',
  data () {
    return {
      show: false
    }
  },
  methods: {
    confirm () {
      location.reload()
    },
    close () {
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
