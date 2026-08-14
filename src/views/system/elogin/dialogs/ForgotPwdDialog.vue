<template>
  <el-dialog
    :title="$t('forgotTitle')"
    :visible.sync="visible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    custom-class="intl-forgot-dialog"
    @closed="onClosed"
  >
    <el-steps :active="activeNum" align-center finish-status="success">
      <el-step :title="$t('forgotStepVerify')" />
      <el-step :title="$t('forgotStepPwd')" />
      <el-step :title="$t('forgotStepDone')" />
    </el-steps>

    <!-- 步骤1：身份验证 -->
    <div v-if="activeNum === 0" class="forgot-body">
      <el-form ref="form" :model="form" :rules="rulesId" label-position="top" size="small">
        <el-form-item :label="$t('forgotName')" prop="name">
          <el-input v-model.trim="form.name" :placeholder="$t('forgotNamePh')" maxlength="64" />
        </el-form-item>
        <el-form-item :label="$t('forgotCompany')" prop="companyName">
          <el-input v-model.trim="form.companyName" :placeholder="$t('forgotCompanyPh')" maxlength="128" />
        </el-form-item>
        <el-form-item :label="$t('forgotMobile')" prop="mobile">
          <el-input v-model.trim="form.mobile" :placeholder="$t('forgotMobilePh')" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('forgotEmail')" prop="email">
          <el-input v-model.trim="form.email" :placeholder="$t('forgotEmailPh')" maxlength="128" />
        </el-form-item>
        <el-form-item :label="$t('forgotAuthCode')" prop="authCode" class="forgot-code-item">
          <el-input
            v-model.trim="form.authCode"
            :placeholder="$t('forgotAuthCodePh')"
            maxlength="6"
            @input="onAuthCodeInput"
          />
          <!-- mousedown.prevent：避免点击发码时验证码框失焦触发「请输入验证码」 -->
          <el-button
            type="text"
            native-type="button"
            class="forgot-send-code"
            :disabled="countdown > 0 || sendingCode"
            @mousedown.native.prevent
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : $t('forgotGetCode') }}
          </el-button>
        </el-form-item>
        <p v-if="codeTip" class="forgot-code-tip">{{ codeTip }}</p>
      </el-form>
    </div>

    <!-- 步骤2：设置新密码 -->
    <div v-else-if="activeNum === 1" class="forgot-body">
      <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-position="top" size="small">
        <el-form-item :label="$t('forgotNewPwd')" prop="newPwd">
          <el-input
            v-model="pwdForm.newPwd"
            type="password"
            show-password
            maxlength="16"
            :placeholder="$t('forgotNewPwdPh')"
          />
        </el-form-item>
        <el-form-item :label="$t('forgotConfirmPwd')" prop="checkPwd">
          <el-input
            v-model="pwdForm.checkPwd"
            type="password"
            show-password
            maxlength="16"
            :placeholder="$t('forgotConfirmPwdPh')"
          />
        </el-form-item>
        <div class="forgot-pwd-tips">
          <div :class="['tip-row', lengthOk ? 'is-ok' : '']">
            <i :class="lengthOk ? 'el-icon-success' : 'el-icon-remove-outline'" />
            <span>{{ $t('forgotPwdRuleLen') }}</span>
          </div>
          <div :class="['tip-row', typeOk ? 'is-ok' : '']">
            <i :class="typeOk ? 'el-icon-success' : 'el-icon-remove-outline'" />
            <span>{{ $t('forgotPwdRuleType') }}</span>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 步骤3：成功 -->
    <div v-else class="forgot-success">
      <div class="forgot-success__title">
        <i class="el-icon-success" />
        {{ $t('forgotSuccessTitle') }}
      </div>
      <p class="forgot-success__desc">{{ $t('forgotSuccessDesc') }}</p>
      <el-button type="primary" class="forgot-relogin" @click="closeAndRelogin">
        {{ $t('forgotRelogin') }}
      </el-button>
    </div>

    <div v-if="activeNum !== 2" slot="footer" class="forgot-footer">
      <el-button type="primary" :loading="submitting" @click="goNext">{{ $t('forgotConfirm') }}</el-button>
      <el-button plain @click="visible = false">{{ $t('forgotCancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  forgotSendCode,
  forgotVerifyCode,
  forgotResetPassword
} from '@/api/intl/login'
import { ensureRsaPublicKey, encryptPassword, isDemoAuthEnabled } from '@/libs/intl-auth'

export default {
  name: 'IntlForgotPwdDialog',
  data () {
    return {
      visible: false,
      activeNum: 0,
      sendingCode: false,
      submitting: false,
      countdown: 0,
      countdownTimer: null,
      codeTip: '',
      form: this.emptyForm(),
      pwdForm: { newPwd: '', checkPwd: '' },
      resetToken: ''
    }
  },
  computed: {
    lengthOk () {
      const len = (this.pwdForm.newPwd || '').length
      return len >= 8 && len <= 16
    },
    typeOk () {
      const v = this.pwdForm.newPwd || ''
      let n = 0
      if (/\d/.test(v)) n++
      if (/[a-z]/.test(v)) n++
      if (/[A-Z]/.test(v)) n++
      if (/[~!@#$%^&*()_+]/.test(v)) n++
      return n >= 2 && !/\s/.test(v)
    },
    rulesId () {
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return {
        name: [{ required: true, message: this.$t('forgotNamePh'), trigger: 'blur' }],
        companyName: [{ required: true, message: this.$t('forgotCompanyPh'), trigger: 'blur' }],
        mobile: [
          { required: true, message: this.$t('forgotMobilePh'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^1\d{10}$/.test(String(value || '').trim())) {
                callback(new Error(this.$t('forgotMobileInvalid')))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: this.$t('forgotEmailPh'), trigger: 'blur' },
          {
            type: 'email',
            message: this.$t('forgotEmailInvalid'),
            trigger: 'blur'
          }
        ],
        // 仅在点「确定」整表校验时检查；勿用 blur，否则点「获取验证码」会误报
        authCode: [
          { required: true, message: this.$t('forgotAuthCodePh'), trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!this.form.authCodeToken) {
                callback(new Error(this.$t('forgotNeedSendCode')))
                return
              }
              if (!/^\d{6}$/.test(String(value || '').trim())) {
                callback(new Error(this.$t('forgotAuthCodeInvalid')))
                return
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      }
    },
    pwdRules () {
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return {
        newPwd: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(this.$t('forgotNewPwdPh')))
                return
              }
              if (!this.lengthOk || !this.typeOk) {
                callback(new Error(this.$t('forgotPwdInvalid')))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        checkPwd: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(this.$t('forgotConfirmPwdPh')))
                return
              }
              if (value !== this.pwdForm.newPwd) {
                callback(new Error(this.$t('forgotPwdMismatch')))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  beforeDestroy () {
    this.clearCountdown()
  },
  methods: {
    emptyForm () {
      return {
        name: '',
        companyName: '',
        mobile: '',
        email: '',
        authCode: '',
        authCodeToken: ''
      }
    },
    open () {
      this.resetState()
      this.visible = true
    },
    resetState () {
      this.activeNum = 0
      this.form = this.emptyForm()
      this.pwdForm = { newPwd: '', checkPwd: '' }
      this.resetToken = ''
      this.codeTip = ''
      this.submitting = false
      this.sendingCode = false
      this.clearCountdown()
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
        this.$refs.pwdForm && this.$refs.pwdForm.clearValidate()
      })
    },
    onClosed () {
      this.resetState()
    },
    onAuthCodeInput () {
      this.form.authCode = String(this.form.authCode || '').replace(/\D/g, '').slice(0, 6)
    },
    clearCountdown () {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      this.countdown = 0
    },
    startCountdown (seconds = 60) {
      this.clearCountdown()
      this.countdown = seconds
      this.countdownTimer = setInterval(() => {
        if (this.countdown <= 1) {
          this.clearCountdown()
        } else {
          this.countdown -= 1
        }
      }, 1000)
    },
    async sendCode () {
      // 发码只校验身份四项，不校验验证码本身
      if (this.$refs.form) {
        this.$refs.form.clearValidate('authCode')
      }
      const fields = ['name', 'companyName', 'mobile', 'email']
      let ok = true
      for (const f of fields) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve, reject) => {
            this.$refs.form.validateField(f, err => (err ? reject(err) : resolve()))
          })
        } catch (e) {
          ok = false
        }
      }
      if (!ok) return

      if (isDemoAuthEnabled()) {
        this.form.authCodeToken = 'demo-forgot-token'
        this.codeTip = this.$t('forgotCodeTipDemo')
        this.startCountdown(60)
        this.$message.success(this.$t('forgotCodeSent'))
        return
      }

      this.sendingCode = true
      try {
        const res = await forgotSendCode({
          name: this.form.name,
          companyName: this.form.companyName,
          mobile: this.form.mobile,
          email: this.form.email
        })
        this.form.authCodeToken = res.authCodeToken
        this.codeTip = res.tip || this.$t('forgotCodeTip', {
          mobile: res.mobileMask || '',
          email: res.emailMask || ''
        })
        this.startCountdown(60)
        this.$message.success(this.$t('forgotCodeSent'))
      } catch (e) {
        // axios 已弹业务错误
      } finally {
        this.sendingCode = false
      }
    },
    goNext () {
      if (this.activeNum === 0) {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          this.submitting = true
          try {
            if (isDemoAuthEnabled()) {
              this.resetToken = 'demo-reset-token'
              this.activeNum = 1
              return
            }
            const res = await forgotVerifyCode({
              authCodeToken: this.form.authCodeToken,
              authCode: this.form.authCode
            })
            this.resetToken = res.resetToken
            this.activeNum = 1
          } catch (e) {
            // axios 已处理
          } finally {
            this.submitting = false
          }
        })
        return
      }
      if (this.activeNum === 1) {
        this.$refs.pwdForm.validate(async valid => {
          if (!valid) return
          this.submitting = true
          try {
            if (isDemoAuthEnabled()) {
              this.activeNum = 2
              return
            }
            await ensureRsaPublicKey()
            await forgotResetPassword({
              resetToken: this.resetToken,
              passwordCipher: encryptPassword(this.pwdForm.newPwd)
            })
            this.activeNum = 2
          } catch (e) {
            // axios 已处理
          } finally {
            this.submitting = false
          }
        })
      }
    },
    closeAndRelogin () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.intl-forgot-dialog.el-dialog {
  border-radius: 4px;

  .el-dialog__header {
    padding: 16px 20px;
    background: #f7f3ee !important;
    border-bottom: 1px solid #e8e8e8;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #1a2d4a;
  }

  .el-dialog__body {
    padding: 20px 24px 8px !important;
    background: #fff !important;
    max-height: none !important;
    overflow: visible !important;

    form {
      padding: 0 !important;
    }
  }

  .el-dialog__footer {
    padding: 12px 20px 20px;
    background: #fff !important;
    border-top: none;
  }

  .el-steps {
    margin-bottom: 20px;
  }

  .el-step__title.is-process,
  .el-step__head.is-process {
    color: #c41e3a;
    border-color: #c41e3a;
  }

  .el-step__head.is-process .el-step__icon {
    background: #c41e3a;
    border-color: #c41e3a;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.forgot-body {
  max-width: 420px;
  margin: 0 auto;
}

.forgot-code-item {
  position: relative;

  ::v-deep .el-input__inner {
    padding-right: 110px;
  }
}

.forgot-send-code {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #c41e3a !important;
  font-size: 13px;
  padding: 0 !important;

  &.is-disabled {
    color: #999 !important;
  }
}

.forgot-code-tip {
  margin: -4px 0 12px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.forgot-pwd-tips {
  margin-top: 4px;
}

.tip-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #999;

  &.is-ok {
    color: #389e0d;
  }
}

.forgot-footer {
  text-align: center;

  .el-button--primary {
    background: #c41e3a !important;
    border-color: #c41e3a !important;
  }

  .el-button--primary.is-plain,
  .el-button.is-plain {
    color: #c41e3a !important;
    border-color: #c41e3a !important;
    background: #fff !important;
  }
}

.forgot-success {
  text-align: center;
  padding: 28px 16px 12px;
}

.forgot-success__title {
  font-size: 18px;
  font-weight: 600;
  color: #389e0d;
  margin-bottom: 16px;

  i {
    margin-right: 6px;
  }
}

.forgot-success__desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 24px;
}

.forgot-relogin {
  background: #c41e3a !important;
  border-color: #c41e3a !important;
  min-width: 140px;
}
</style>
