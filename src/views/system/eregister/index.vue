<template>
  <div class="eregister-page">
    <JgtHeader class="eregister-header" />
    <div class="eregister-content">
      <div class="eregister-toolbar">
        <jgt-lang-switch theme="dark" />
      </div>
      <div class="eregister-inner">
        <h1 class="page-title">{{ $t('registerTitle') }}</h1>
        <p class="page-sub">{{ $t('registerSub') }}</p>

        <div class="card">
        <div v-if="application" class="register-result">
          <i class="el-icon-time register-result__icon"></i>
          <h2>{{ $t('registerPendingTitle') }}</h2>
          <p>{{ $t('registerPendingDesc') }}</p>
          <p class="register-result__id">{{ $t('registerApplicationId') }}：{{ application.applicationId }}</p>
          <p>{{ $t('registerContactTip') }}：{{ $t('intlContactEmail') }}</p>
          <button type="button" class="btn-submit" @click="goLogin">{{ $t('registerBackLogin') }}</button>
        </div>
        <template v-else>
        <div v-if="errorMsg" class="alert-warn">{{ errorMsg }}</div>

        <form autocomplete="off" @submit.prevent="handleRegister">
          <!-- 干扰浏览器：勿将注册页识别为登录表单并回填 -->
          <input type="text" name="intl-reg-username-trap" autocomplete="username" tabindex="-1" aria-hidden="true" class="autofill-trap">
          <input type="password" name="intl-reg-password-trap" autocomplete="current-password" tabindex="-1" aria-hidden="true" class="autofill-trap">

          <div class="fg">
            <label class="fl">{{ $t('registerCompany') }}<span class="req">*</span></label>
            <input
              v-model.trim="form.companyName"
              class="fi"
              name="intl-reg-company"
              autocomplete="organization"
              required
              :placeholder="$t('registerCompanyPh')"
            >
          </div>
          <div class="frow">
            <div class="fg">
              <label class="fl">{{ $t('registerContact') }}<span class="req">*</span></label>
              <input
                v-model.trim="form.contactName"
                class="fi"
                name="intl-reg-contact"
                autocomplete="name"
                required
                :placeholder="$t('registerContactPh')"
              >
            </div>
            <div class="fg">
              <label class="fl">{{ $t('registerPhone') }}<span class="req">*</span></label>
              <input
                v-model.trim="form.phone"
                class="fi"
                name="intl-reg-phone"
                autocomplete="tel"
                required
                :placeholder="$t('registerPhonePh')"
              >
            </div>
          </div>
          <div class="fg">
            <label class="fl">{{ $t('registerEmail') }}<span class="req">*</span></label>
            <input
              v-model.trim="form.email"
              class="fi"
              type="text"
              name="intl-reg-email"
              autocomplete="off"
              required
              :readonly="emailReadonly"
              :placeholder="$t('registerEmailPh')"
              @focus="emailReadonly = false"
            >
          </div>
          <div class="frow">
            <div class="fg">
              <label class="fl">{{ $t('registerPassword') }}<span class="req">*</span></label>
              <input
                v-model="form.password"
                class="fi"
                type="password"
                name="intl-reg-pwd"
                autocomplete="new-password"
                required
                minlength="8"
                maxlength="16"
                :readonly="pwdReadonly"
                :placeholder="$t('registerPasswordPh')"
                @focus="pwdReadonly = false"
              >
            </div>
            <div class="fg">
              <label class="fl">{{ $t('registerPasswordConfirm') }}<span class="req">*</span></label>
              <input
                v-model="form.passwordConfirm"
                class="fi"
                type="password"
                name="intl-reg-pwd2"
                autocomplete="new-password"
                required
                :readonly="pwd2Readonly"
                :placeholder="$t('registerPasswordConfirmPh')"
                @focus="pwd2Readonly = false"
              >
            </div>
          </div>
          <p class="pwd-hint">{{ $t('registerPasswordRule') }}</p>
          <button type="submit" class="btn-submit" :disabled="loading">{{ $t('registerBtn') }}</button>
        </form>

        <p class="to-login">
          {{ $t('registerHasAccount') }}
          <a href="javascript:;" @click.prevent="goLogin">{{ $t('registerGoLogin') }}</a>
        </p>
        </template>
        </div>
      </div>
    </div>
    <JgtFooter class="eregister-footer" />
  </div>
</template>

<script>
import { auth } from '@/services/intl'
import util from '@/libs/util'
import JgtLangSwitch from '@/components/jgt-lang-switch'
import JgtHeader from '@/components/d2-container/components/jgt-header'

export default {
  name: 'eregister',
  components: {
    JgtLangSwitch,
    JgtHeader,
    JgtFooter: () => import('@/components/d2-container/components/jgt-footer')
  },
  data () {
    return {
      loading: false,
      application: null,
      errorMsg: '',
      emailReadonly: true,
      pwdReadonly: true,
      pwd2Readonly: true,
      form: {
        companyName: '',
        contactName: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  mounted () {
    this.clearAutofill()
    // 浏览器可能异步回填，延迟再清一次
    this.$nextTick(() => {
      this.clearAutofill()
      setTimeout(() => this.clearAutofill(), 300)
    })
  },
  methods: {
    clearAutofill () {
      this.form.email = ''
      this.form.password = ''
      this.form.passwordConfirm = ''
      this.emailReadonly = true
      this.pwdReadonly = true
      this.pwd2Readonly = true
    },
    goLogin () {
      this.$router.push({ path: '/elogin' })
    },
    async handleRegister () {
      this.errorMsg = ''
      if (this.form.password !== this.form.passwordConfirm) {
        this.errorMsg = this.$t('registerPwdMismatch')
        return
      }
      if (!util.ispasswordFormatRight(this.form.password) ||
        this.form.password.length < 8 ||
        this.form.password.length > 16 ||
        /\s/.test(this.form.password)) {
        this.errorMsg = this.$t('registerPasswordRule')
        return
      }
      this.loading = true
      try {
        this.application = await auth.register({
          organizationName: this.form.companyName,
          operatorName: this.form.contactName,
          name: this.form.contactName,
          email: this.form.email,
          mobile: this.form.phone,
          password: this.form.password
        })
      } catch (e) {
        this.errorMsg = this.$t((e && e.messageKey) || 'registerFail')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eregister-page {
  position: relative;
  min-width: 1280px;
  min-height: 100vh;
  box-sizing: border-box;
  background:
    linear-gradient(90deg, rgba(20, 25, 30, .16), rgba(20, 25, 30, .06)),
    url("~@/assets/images/login-global-bg.png") no-repeat center center;
  background-size: cover;
  padding-bottom: 150px;
}

.eregister-content {
  width: 1200px;
  margin: 0 auto;
  padding-top: 28px;
}

.eregister-toolbar {
  max-width: 520px;
  margin: 0 0 10px auto;
  display: flex;
  justify-content: flex-end;
}

.eregister-inner {
  max-width: 520px;
  margin: 0 0 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 8px;
}

.page-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 16px;
}

.card {
  position: relative;
  color: #fff;
  background: rgba(44, 44, 46, 0.88);
  border-radius: 2px;
  border: none;
  box-shadow: none;
  padding: 20px;
}

.register-result {
  padding: 24px 12px;
  text-align: center;
  color: #fff;

  h2 { color: #fff; }
}

.register-result__icon {
  font-size: 42px;
  color: #c4a574;
}

.register-result__id {
  font-family: monospace;
  color: #e2b77d;
}

.fg {
  margin-bottom: 16px;
}

.fl {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.req {
  color: #c41e3a;
}

.fi {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 2px;
  font-size: 14px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;

  &:focus {
    outline: none;
    border-color: #c39e6f;
    box-shadow: none;
  }

  &[readonly] {
    background: rgba(255, 255, 255, 0.16);
    cursor: text;
  }
}

.autofill-trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.frow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pwd-hint {
  margin: -8px 0 12px;
  font-size: 12px;
  color: #c0c0c0;
}

.btn-submit {
  width: 100%;
  padding: 12px 32px;
  background: #c39e6f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #a7865a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.to-login {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #c9c9c9;

  a {
    color: #e2b77d;
  }
}

.alert-warn {
  margin-bottom: 12px;
  padding: 8px 10px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  color: #ad6800;
  font-size: 13px;
  border-radius: 2px;
}

@media (max-width: 760px) {
  .eregister-page { min-width: 0; padding: 24px 16px 210px; }
  .eregister-content { width: auto; padding-top: 0; }
  .eregister-inner, .eregister-toolbar { max-width: none; }
  .eregister-toolbar { margin-top: 0; }
  .frow { grid-template-columns: 1fr; gap: 0; }
  .page-title { font-size: 20px; }
}
</style>

<style lang="scss">
.eregister-page {
  .header-blogroll.eregister-header {
    height: 32px;
    border: none;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    line-height: 32px;
  }

  div.header-blogroll .header-container ul.blogroll-link li {
    color: #fff;
  }

  .jgt-footer.eregister-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.68);

    .jgt-footer-contact,
    .jgt-footer-otherLink li,
    .wangbei .color83,
    .jgt-footer-otherLink:before,
    .jgt-footer-contact .jgt-footer-contact-link {
      color: #fff;
    }
  }

  @media (max-width: 760px) {
    .header-blogroll.eregister-header { display: none; }
  }
}
</style>
