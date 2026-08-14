<template>
  <div class="login-card">
    <div class="login-card-header">
      <span class="login-card-title">{{ $t('loginCardTitle') }}</span>
      <div class="login-card-actions">
        <button type="button" class="login-card-open" @click="goOpenAccount">
          {{ $t('loginOpenAccount') }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="login-field">
        <span class="login-field-icon">
          <i class="el-icon-user"></i>
        </span>
        <input
          v-model.trim="loginName"
          type="text"
          required
          autocomplete="username"
          :placeholder="$t('loginEmailPlaceholder')"
        >
      </div>

      <div class="login-field">
        <span class="login-field-icon">
          <i class="el-icon-key"></i>
        </span>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          :placeholder="$t('loginPasswordPlaceholder')"
        >
        <button type="button" class="login-forgot" @click="onForgot">
          {{ $t('loginForgot') }}
        </button>
      </div>

      <label class="login-agree">
        <input v-model="agreed" type="checkbox">
        <span>
          {{ $t('loginAgreePrefix') }}
          <a href="javascript:;" @click.prevent="onPolicy">{{ $t('loginPolicy') }}</a>
        </span>
      </label>

      <button type="submit" class="login-submit" :disabled="loading">
        {{ $t('loginBtn') }}
      </button>
      <button type="button" class="login-code-switch" @click="onCodeLogin">
        {{ $t('loginSwitchCode') }}
      </button>
      <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>
    </form>

    <forgot-pwd-dialog ref="forgotPwdDialog" />
  </div>
</template>

<script>
import { auth } from '@/services/intl'
import { establishAuthSession } from '@/libs/intl-auth'
import ForgotPwdDialog from './dialogs/ForgotPwdDialog'

export default {
  name: 'LoginForm',
  components: { ForgotPwdDialog },
  data () {
    return {
      loginName: '',
      password: '',
      agreed: false,
      loading: false,
      errorMsg: ''
    }
  },
  methods: {
    goOpenAccount () {
      this.$router.push({ path: '/eregister' })
    },
    onForgot () {
      this.$refs.forgotPwdDialog.open()
    },
    onPolicy () {
      this.$message.info(this.$t('loginDemoUnavailable'))
    },
    onCodeLogin () {
      this.$message.info(this.$t('loginDemoUnavailable'))
    },
    async handleLogin () {
      this.errorMsg = ''
      if (!this.agreed) {
        this.errorMsg = this.$t('loginErrorAgree')
        return
      }
      this.loading = true
      try {
        const session = await auth.login({ account: this.loginName, password: this.password, loginType: 'PASSWORD' })
        const operator = session.operator || {}
        await establishAuthSession(this.$store, {
          token: session.accessToken || session.token,
          userId: operator.operatorId,
          operatorCode: operator.email,
          operatorName: operator.name,
          mobile: operator.mobile,
          email: operator.email,
          companyName: operator.organizationName
        })
        this.$store.commit('intl/session/set', session)
        const redirect = this.$route.query.redirect
        const safeRedirect = typeof redirect === 'string' && /^\/(?!\/)/.test(redirect)
        this.$router.replace({ path: safeRedirect ? redirect : '/index' })
      } catch (e) {
        this.errorMsg = this.$t((e && e.messageKey) || 'loginErrorInvalid')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  width: 380px;
  max-width: 100%;
  box-sizing: border-box;
  background: rgba(31, 31, 32, .82);
  border: 1px solid rgba(224, 185, 126, .2);
  padding: 28px;
  color: #fff;
}

.login-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  line-height: 32px;
}

.login-card-title {
  font-size: 16px;
  font-weight: 500;
}

.login-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-card-open {
  padding: 5px 12px;
  font-size: 14px;
  color: #e2b77d;
  background: transparent;
  border: 1px solid #c39e6f;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: #e2b77d;
  }
}

.login-error {
  margin: 18px -28px -28px;
  padding: 10px 28px;
  font-size: 13px;
  color: #fff;
  text-align: center;
  background: rgba(182, 71, 68, .95);
}

.login-field {
  position: relative;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, .14);
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 2px;

  input {
    flex: 1;
    height: 40px;
    padding: 0 12px 0 0;
    border: none;
    background: transparent;
    color: #fff;
    font-size: 12px;
    outline: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.45);
    }
  }
}

.login-forgot {
  flex-shrink: 0;
  margin-right: 10px;
  padding: 4px 2px;
  border: 0;
  color: #e2b77d;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;

  &:hover { color: #f2d19e; }
}

.login-field-icon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #a9a9a9;
  background: rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.has-forgot .login-forgot,
.has-code .login-get-code {
  flex-shrink: 0;
  margin-right: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: #ff8a9a;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.login-code-tip {
  margin: -6px 0 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
}

.login-agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 18px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;

  a {
    color: #e2b77d;
  }

  input {
    margin-top: 2px;
  }
}

.login-submit {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 2px;
  background: #c39e6f;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #a7865a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.login-code-switch {
  display: block;
  margin: 18px auto 0;
  padding: 0;
  border: 0;
  color: #e2b77d;
  background: transparent;
  cursor: pointer;
}
</style>
