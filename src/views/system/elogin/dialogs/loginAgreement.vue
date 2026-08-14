<template>
  <el-dialog title="提示" :visible.sync="show" @close="close" width="400px" custom-class="login-agreement-dialog">

    <div class="jgt-tc">
      <span>我已阅读并同意<el-link type="assist" class="login-form-input-link login-form-private-text" @click="goPolicy">《基煜基金个人信息保护政策》</el-link></span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="confirm">同意并继续</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'LoginAgreement',
  data () {
    return {
      show: false
    }
  },
  methods: {
    confirm () {
      this.$emit('agree', true)
      this.show = false
    },
    close () {
      this.show = false
    },
    // 《隐私政策声明》
    goPolicy () {
      const fileName = window.CONFIG.STATIC_SERVICE.PERSONAL_PRIVACY_FILE_NAME || '基煜基金个人信息保护政策_2023版.pdf'
      window.open(`${this.PDF_DOMAIN}${fileName}`)
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
.login-agreement-dialog {
  a.el-link.el-link--assist.is-underline:hover:after {
    display: none;
  }
  .el-dialog__body {
    padding: 20px 20px 0 20px;
  }
  .jgt-tc {
    text-align: center;
    font-size: 14px;
    @include color(A6);
    line-height: 20px;
    margin-bottom: 20px;
    .login-form-private-text {
      span.el-link--inner {
        @include color(A3);
        font-size: 14px;
        &:hover {
          @include color(A3h);
        }
      }
    }
  }
  .el-dialog__footer {
    padding-top: 0;
  }
}
</style>
