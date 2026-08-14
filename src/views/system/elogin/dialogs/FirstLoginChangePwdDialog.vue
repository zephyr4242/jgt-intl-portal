<template>
  <el-dialog
    :title="$t('firstLoginTitle')"
    :visible.sync="visible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    custom-class="intl-first-login-pwd-dialog"
    @closed="onClosed"
  >
    <div v-if="tips" class="first-login-warning">
      <i class="el-icon-warning" />
      <span>{{ tips }}</span>
    </div>

    <div class="first-login-body">
      <!-- 干扰浏览器密码管理器：勿把本弹窗识别为登录表单 -->
      <input type="text" name="intl-username-trap" autocomplete="username" tabindex="-1" aria-hidden="true" class="autofill-trap">
      <input type="password" name="intl-password-trap" autocomplete="current-password" tabindex="-1" aria-hidden="true" class="autofill-trap">
      <el-input
        v-model="pwd"
        type="password"
        show-password
        maxlength="16"
        name="intl-new-pwd"
        autocomplete="new-password"
        class="first-login-input"
        :placeholder="$t('firstLoginPwdPh')"
        :readonly="pwdReadonly"
        @focus="pwdReadonly = false"
        @blur="blurCheck"
      />
      <el-input
        v-model="pwd2"
        type="password"
        show-password
        maxlength="16"
        name="intl-new-pwd2"
        autocomplete="new-password"
        class="first-login-input"
        :placeholder="$t('firstLoginPwd2Ph')"
        :readonly="pwd2Readonly"
        @focus="pwd2Readonly = false"
        @blur="blurCheck"
      />
      <div :class="['first-login-tip', lengthOk ? 'is-ok' : '']">
        <i class="el-icon-success" />
        <span>{{ $t('firstLoginPwdRuleLen') }}</span>
      </div>
      <div :class="['first-login-tip', typeOk ? 'is-ok' : '']">
        <i class="el-icon-success" />
        <span>{{ $t('firstLoginPwdRuleType') }}</span>
      </div>
    </div>

    <div slot="footer" class="first-login-footer">
      <el-button type="primary" :loading="loading" @click="confirm">{{ $t('firstLoginConfirm') }}</el-button>
      <el-button plain @click="cancel">{{ $t('firstLoginCancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { firstLoginChangePwd } from '@/api/intl/login'
import { ensureRsaPublicKey, encryptPassword, isDemoAuthEnabled } from '@/libs/intl-auth'

export default {
  name: 'FirstLoginChangePwdDialog',
  data () {
    return {
      visible: false,
      loading: false,
      changePwdToken: '',
      pwd: '',
      pwd2: '',
      tips: '',
      pwdReadonly: true,
      pwd2Readonly: true
    }
  },
  computed: {
    lengthOk () {
      const len = (this.pwd || '').length
      return len >= 8 && len <= 16
    },
    typeOk () {
      const v = this.pwd || ''
      let n = 0
      if (/\d/.test(v)) n++
      if (/[a-z]/.test(v)) n++
      if (/[A-Z]/.test(v)) n++
      if (/[~!@#$%^&*()_+]/.test(v)) n++
      return n >= 2 && !/\s/.test(v)
    }
  },
  methods: {
    /**
     * 打开弹窗；取消等于取消本次登录（不建会话）。
     * @param {string} changePwdToken 后端返回的短期改密令牌
     */
    open (changePwdToken) {
      this.resetState()
      this.changePwdToken = changePwdToken || ''
      this.tips = this.$t('firstLoginTip')
      this.visible = true
      // 打开后再清一次，避免浏览器异步 autofill
      this.$nextTick(() => {
        this.pwd = ''
        this.pwd2 = ''
        this.pwdReadonly = true
        this.pwd2Readonly = true
      })
    },
    resetState () {
      this.loading = false
      this.changePwdToken = ''
      this.pwd = ''
      this.pwd2 = ''
      this.pwdReadonly = true
      this.pwd2Readonly = true
      this.tips = this.$t('firstLoginTip')
    },
    onClosed () {
      this.resetState()
    },
    blurCheck () {
      if (!this.pwd && !this.pwd2) {
        this.tips = this.$t('firstLoginTip')
        return
      }
      this.checkValid()
    },
    checkValid () {
      this.tips = null
      if (!this.pwd) {
        this.tips = this.$t('firstLoginPwdPh')
      } else if (!this.lengthOk) {
        this.tips = this.$t('firstLoginPwdLenErr')
      } else if (!this.typeOk) {
        this.tips = this.$t('firstLoginPwdTypeErr')
      } else if (/\s/.test(this.pwd || '')) {
        this.tips = this.$t('firstLoginPwdSpaceErr')
      } else if (!this.pwd2) {
        this.tips = this.$t('firstLoginPwd2Ph')
      } else if (this.pwd !== this.pwd2) {
        this.tips = this.$t('firstLoginPwdMismatch')
      }
      return this.tips
    },
    async confirm () {
      if (this.checkValid()) return
      if (this.loading) return
      this.loading = true
      try {
        if (isDemoAuthEnabled()) {
          this.$message.success(this.$t('firstLoginSuccess'))
          this.visible = false
          return
        }
        if (!this.changePwdToken) {
          this.tips = this.$t('firstLoginTokenInvalid')
          return
        }
        await ensureRsaPublicKey()
        const passwordCipher = encryptPassword(this.pwd)
        if (!passwordCipher) {
          this.tips = this.$t('loginErrorDecrypt')
          return
        }
        await firstLoginChangePwd({
          changePwdToken: this.changePwdToken,
          passwordCipher
        })
        this.$message.success(this.$t('firstLoginSuccess'))
        this.visible = false
      } catch (e) {
        const msg = (e && e.msg) || (e && e.message)
        if (msg) this.tips = msg
      } finally {
        this.loading = false
      }
    },
    /** 取消本次登录：关弹窗、丢弃令牌，不进系统 */
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.intl-first-login-pwd-dialog.el-dialog {
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
    position: relative;
  }

  .el-dialog__footer {
    padding: 12px 20px 20px;
    background: #fff !important;
    border-top: none;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.first-login-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 0 20px;
  padding: 8px 12px;
  background: #fdf6ec;
  color: #e6a23c;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 2px;

  i {
    font-size: 14px;
  }
}

.first-login-body {
  max-width: 340px;
  margin: 0 auto 8px;
}

.autofill-trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.first-login-input {
  margin-bottom: 16px;
}

.first-login-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #999;

  &.is-ok {
    color: #389e0d;
  }
}

.first-login-footer {
  .el-button--primary {
    background: #c41e3a !important;
    border-color: #c41e3a !important;
  }

  .el-button.is-plain {
    color: #c41e3a !important;
    border-color: #c41e3a !important;
    background: #fff !important;
  }
}
</style>
