<template>
  <div class="input-sendCodeTxt-box">
    <el-dialog title="温馨提示：" width="600px" :visible.sync="inpuSendCodeVisible" :before-close="closeDialog">
      <div class="inpuSendCode-title">您今日所操作的交易笔数已达到上限，请录入动态验证码，确保您的账户安全。</div>
      <div class="inputPwd">
        <el-form :model="form" style="padding:0">
          <el-form-item prop="code">
            <el-input @keyup.enter.native="confirm" maxlength="6" v-model="form.code" placeholder="请输入验证码"></el-input>
            <el-button type="text" class="sendCode" @click="sendCode" :disabled="disabledSendCode">{{sendCodeTxt}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <slot/>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="confirm" :loading="loading" >{{ '确 定' }}</el-button>
        <el-button size="medium" @click="closeDialog" type="primary" plain>取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { sendAuthCode, validateAuthCode } from '@/api/intl/legacy/bus-jgt-account'
export default {
  name: 'inpuSendCode',
  components: {
  },
  props: {
    inpuSendCodeVisible: {
      type: Boolean,
      default: false
    },
    countdown: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  data () {
    return {
      form: {
        code: '',
        key: ''
      },
      loading: false,
      // 验证码相关
      sendCodeTxt: '发送验证码',
      disabledSendCode: false,
      confirm: this.util.debounce(this.confirmRaw, 300),
      timeout: null
    }
  },
  methods: {
    /**
     * 点击确认
     */
    async confirmRaw () {
      if (this.util.isEmpty(this.form.code)) {
        this.$message.error('验证码不能为空')
      } else if (this.util.isEmpty(this.form.key)) {
        this.$message.error('请先获取验证码')
      } else {
        if (this.loading === true) {
          return false
        }
        this.loading = true
        try {
          await validateAuthCode({
            authCode: this.form.code,
            authCodeToken: this.form.key,
            businessCode: '099',
            requestType: '2',
            userName: this.util.cookies.get('uuid') || ''
          })
          this.$emit('submit', true, this.btnReset)
        } catch (error) {

        } finally {
          this.loading = false
        }
      }
    },
    /**
     * 发送验证码
     */
    sendCode () {
      sendAuthCode({
        businessCode: '099',
        requestType: '2',
        userName: this.util.cookies.get('uuid') || ''
      })
        .then(res => {
          this.form.key = res.authCodeToken
          this.disabledSendCode = true
          this.sendCodeTxt = 60
          let time = setInterval(() => {
            this.sendCodeTxt--
            if (this.sendCodeTxt <= 0 || isNaN(this.sendCodeTxt)) {
              this.sendCodeTxt = '发送验证码'
              this.disabledSendCode = false
              clearInterval(time)
            }
          }, 1000)
        })
    },
    /**
     * 按钮置为可点击
     */
    btnReset (res) {
      this.loading = false
      if (res) {
        return true
      } else {
        this.closeDialog()
      }
    },
    /**
     * 关闭弹框
     */
    closeDialog () {
      this.$emit('setDialogVisible', false)
      // 重置表单
      Object.keys(this.form).forEach(key => (this.form[key] = ''))
      this.sendCodeTxt = '发送验证码'
      clearInterval(this.timeout)
    }
  }
}
</script>
<style lang="scss" scoped>
.inputPwd {
  width: 320px;
  margin: auto;
  position: relative;
  .inputPwd-forget {
    position: absolute;
    bottom: -24px;
    right: 0;
    font-size: 12px;
  }
  .sendCode {
    position: absolute;
    left: 325px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
  }
  .input-password-eye {
    line-height: 40px;
    i {
      cursor: pointer;
    }
  }
}
.inpuSendCode-title {
  margin-bottom: 20px;
  text-align: center;
  @include color(A6);
}
</style>
<style lang="scss">
.el-dialog__body{
  .inputPwd{
    .el-form{
      @include backgroundColor(A2)
    }
    // 解决 ie 点不到右侧小眼睛问题
    .el-input__suffix-inner {
      position: relative;
      z-index: 1;
    }
  }
}

</style>
