<template>
  <div class="input-password-box">
    <el-dialog ref="tcPwdDialog" title="交易密码" width="600px" :visible.sync="inputPwdVisible" :before-close="closeDialog">
      <div class="inputPwd">
        <el-form :model="form" style="padding:0">
          <el-form-item prop="password">
            <el-input
              ref="passwordRef"
              :type="inputTypeIsPassword ? 'password' : 'text'"
              @keyup.enter.native="confirm"
              placeholder="请输入授权/交易密码"
              maxlength="16"
              v-model="form.password"
            >
              <span slot="suffix" class="input-password-eye">
                <i :class="[inputTypeIsPassword ? 'iconfont-biyan1' : 'iconfont-yanjing']" @click="toggleInputType"/>
              </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-show="tradeErrorCount >= 3">
            <el-input @keyup.enter.native="confirm" maxlength="6" v-model="form.code" placeholder="请输入验证码"></el-input>
            <el-button type="text" class="sendCode" @click="sendCode" :disabled="disabledSendCode">{{sendCodeTxt}}</el-button>
          </el-form-item>
          <el-link type="primary" class="inputPwd-forget" @click="forgetPwdVisible = true" :underline="false">忘记密码?</el-link>
          <!-- <el-button type="text" class="inputPwd-forget" @click="forgetPwdVisible = true">忘记密码?</el-button> -->
        </el-form>
      </div>
      <slot/>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="confirm" :loading="loading" :disabled="!!confirmCountdown">{{ confirmCountdown ? `${confirmCountdown}s` : '确 定' }}</el-button>
        <el-button size="medium" @click="closeDialog" type="primary" plain>取 消</el-button>
      </span>
    </el-dialog>
    <forget-pwd v-model="forgetPwdVisible" pwdType="1"></forget-pwd>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { sendAuthCode, validateAuthCode } from '@/api/intl/legacy/bus-jgt-account'
import { fireTradeConfirmLog, getTradeConfirmDialogEl, localTradeConfirmTimeString } from '@/utils/tradeConfirmLog'
export default {
  name: 'inputPwd',
  components: {
    forgetPwd: () => import('@module/password/forgetPwd')
  },
  props: {
    inputPwdVisible: {
      type: Boolean,
      default: false
    },
    countdown: {
      type: Number,
      default: 0
    },
    // 交易场景上下文：用于 JGT_RD08 留痕补齐 businessType/fundCode/fundName 等
    logExtra: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  data () {
    return {
      form: {
        password: '',
        code: '',
        key: ''
      },
      loading: false,
      forgetPwdVisible: false,
      // 验证码相关
      sendCodeTxt: '发送验证码',
      disabledSendCode: false,
      tradeErrorCount: 0,
      confirmCountdown: 0,
      confirm: this.util.debounce(this.confirmRaw, 300),
      timeout: null,
      // 密码输入框type是否为password
      inputTypeIsPassword: true,
      tradeConfirmOpenTime: ''
    }
  },
  methods: {
    buildPwdLogExtra () {
      const loginCustomer = (this.info && this.info.userLoginCustomer) || {}
      const source = this.logExtra || {}
      const normalized = {
        ...source,
        businessType: source.businessType || source.businFlag || undefined,
        fundCode: source.fundCode || source.inFundCode || source.outFundCode || undefined,
        fundName: source.fundName || source.inFundName || source.outFundName || undefined,
        tradeAcco: source.tradeAcco || loginCustomer.tradeAcco || undefined,
        fofundNo: source.fofundNo || loginCustomer.fofundNo || undefined
      }
      const required = ['businessType', 'fundCode', 'fundName', 'tradeAcco', 'fofundNo']
      const missing = required.filter(key => !normalized[key])
      if (missing.length) {
        console.warn('[trade-confirm-log] JGT_RD08 logExtra missing fields', {
          missing,
          popupCode: 'JGT_RD08'
        })
      }
      return normalized
    },
    hasRiskMismatchingPrompt () {
      try {
        const { dialogEl, bodyEl } = this.getPwdDialogDom()
        const container = bodyEl || dialogEl
        if (!container || !container.querySelector) return false
        return !!container.querySelector('.risk-mismatching-container')
      } catch (e) {
        return false
      }
    },
    getPwdDialogDom () {
      try {
        const fromRef = getTradeConfirmDialogEl(this.$refs.tcPwdDialog)
        if (fromRef) {
          const bodyEl = fromRef.querySelector && fromRef.querySelector('.el-dialog__body')
          return { dialogEl: fromRef, bodyEl: bodyEl || undefined }
        }
        const inputRoot = this.$refs && this.$refs.passwordRef && this.$refs.passwordRef.$el
        const dialogEl = inputRoot && inputRoot.closest ? inputRoot.closest('.el-dialog') : null
        const bodyEl = dialogEl && dialogEl.querySelector ? dialogEl.querySelector('.el-dialog__body') : null
        return { dialogEl: dialogEl || undefined, bodyEl: bodyEl || undefined }
      } catch (e) {
        return { dialogEl: undefined, bodyEl: undefined }
      }
    },
    emitPwdConfirmLog (closeTime, capturedDialogEl) {
      try {
        const needCode = Number(this.util.cookies.get('tradeErrorCount')) >= 3
        const dialogEl = capturedDialogEl || this.getPwdDialogDom().dialogEl
        const bodyEl = dialogEl && dialogEl.querySelector ? dialogEl.querySelector('.el-dialog__body') : undefined
        if (!dialogEl) return
        fireTradeConfirmLog(this, {
          _dialogEl: dialogEl,
          _dialogBodyEl: bodyEl,
          popupMeta: { popupCode: 'JGT_RD08', popupName: '交易密码', popupType: 'RT' },
          popupContent: {
            snapshotVersion: 'v1',
            popupBody: needCode
              ? '交易密码与短信验证码校验：用户点击确定提交（不含密码与验证码明文）。'
              : '交易密码校验：用户点击确定提交（不含密码明文）。',
            confirmEvidence: { action: 'CONFIRM', buttonText: '确定', agreeChecked: true, clientClickTime: closeTime }
          },
          popupOpenTime: this.tradeConfirmOpenTime || closeTime,
          popupCloseTime: closeTime,
          popupRemark: 'JGT_RD08：下单前交易密码校验（多次失败时需短信验证码）',
          extra: {
            ...this.buildPwdLogExtra()
          }
        })
      } catch (e) {
        console.warn('[trade-confirm-log]', e)
      }
    },
    /**
     * 点击确认
     */
    async confirmRaw () {
      if (this.confirmCountdown) {
        return
      }
      this.tradeErrorCount = Number(this.util.cookies.get('tradeErrorCount')) || 0
      if (this.util.isEmpty(this.form.password)) {
        this.$message.error('交易密码不能为空')
      } else if (this.form.password?.indexOf('·') !== -1) {
        this.$message.error('密码格式不符合要求')
      } else if (this.tradeErrorCount >= 3 && this.util.isEmpty(this.form.code)) {
        this.$message.error('验证码不能为空')
      } else if (this.tradeErrorCount >= 3 && this.util.isEmpty(this.form.key)) {
        this.$message.error('请先获取验证码')
      } else {
        if (this.loading === true) {
          return false
        }
        this.loading = true
        try {
          this.util.cookies.set('passwordLength', this.form?.password?.length)
        } catch (error) {

        }
        if (this.tradeErrorCount >= 3) {
          const closeTime = localTradeConfirmTimeString()
          const shouldPwdLog = this.hasRiskMismatchingPrompt()
          const tcDialogEl = shouldPwdLog ? getTradeConfirmDialogEl(this.$refs.tcPwdDialog) : null
          try {
            await validateAuthCode({
              authCode: this.form.code,
              authCodeToken: this.form.key,
              businessCode: '099', // 序列号，调用者随机生成
              userName: this.info.operatorCode || this.info.certNo || '',
              mobile: this.util.getRsaCode(this.info.mobile),
              requestType: this.info.operatorCode || this.info.certNo ? '2' : '1'
            })
            this.$emit('submit', this.util.getRsaCode(this.form.password), this.btnReset)
            this.$nextTick(() => {
              if (shouldPwdLog && tcDialogEl) this.emitPwdConfirmLog(closeTime, tcDialogEl)
            })
          } catch (error) {

          } finally {
            this.loading = false
          }
        } else {
          const closeTime = localTradeConfirmTimeString()
          const shouldPwdLog = this.hasRiskMismatchingPrompt()
          const tcDialogEl = shouldPwdLog ? getTradeConfirmDialogEl(this.$refs.tcPwdDialog) : null
          this.$emit('submit', this.util.getRsaCode(this.form.password), this.btnReset)
          this.$nextTick(() => {
            if (shouldPwdLog && tcDialogEl) this.emitPwdConfirmLog(closeTime, tcDialogEl)
          })
        }
      }
    },
    /**
     * 发送验证码
     */
    sendCode () {
      sendAuthCode({
        businessCode: '099', // 序列号，调用者随机生成
        userName: this.info.operatorCode || this.info.certNo || '',
        mobile: this.util.getRsaCode(this.info.mobile),
        requestType: this.info.operatorCode || this.info.certNo ? '2' : '1'
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
        // 清除密码错误次数
        this.util.cookies.set('tradeErrorCount', 0)
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
      this.inputTypeIsPassword = true
      clearInterval(this.timeout)
    },
    /**
     * 切换密码输入框type
     */
    toggleInputType () {
      this.inputTypeIsPassword = !this.inputTypeIsPassword
    }
  },
  watch: {
    inputPwdVisible (newValue) {
      this.tradeErrorCount = Number(this.util.cookies.get('tradeErrorCount')) || 0
      if (newValue) {
        this.tradeConfirmOpenTime = localTradeConfirmTimeString()
        this.$nextTick(() => {
          if (this.$refs.passwordRef) {
            this.$refs.passwordRef.focus()
          }
        })
        if (this.countdown) {
          this.confirmCountdown = this.countdown
          clearInterval(this.timeout)
          this.timeout = setInterval(() => {
            this.confirmCountdown--
            if (this.confirmCountdown <= 0) {
              clearInterval(this.timeout)
            }
          }, 1000)
        } else {
          this.confirmCountdown = 0
        }
      }
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
