<template>
  <div class="intl-login">
    <header class="intl-login__topbar">
      <div class="intl-login__topbar-inner">
        <nav class="intl-login__top-links" aria-label="Service links">
          <span><i class="el-icon-phone" />400-820-5369（{{ $t('loginServiceHours') }}）</span>
          <a href="https://www.jigoutong.com/products/" target="_blank" rel="noopener">{{ $t('loginAbout') }}</a>
          <a href="https://www.jigoutong.com/career/#contact" target="_blank" rel="noopener">{{ $t('loginContact') }}</a>
          <a href="https://www.jiyufund.com.cn/static/about/certificate" target="_blank" rel="noopener">{{ $t('loginQualification') }}</a>
          <a href="javascript:;">{{ $t('loginMaterials') }}</a>
          <a href="javascript:;">{{ $t('loginClientDownload') }}</a>
        </nav>
        <div class="intl-login__languages" aria-label="Language">
          <button type="button" :class="{ 'is-active': $locale === 'zh-Hant' }" @click="setLocale('zh-Hant')">繁</button><span>|</span>
          <button type="button" :class="{ 'is-active': $locale === 'zh-Hans' }" @click="setLocale('zh-Hans')">简</button><span>|</span>
          <button type="button" :class="{ 'is-active': $locale === 'en' }" @click="setLocale('en')">EN</button>
        </div>
      </div>
    </header>

    <main class="intl-login__main">
      <section class="intl-login__brand-copy">
        <div class="intl-login__brand">
          <span class="intl-login__brand-fund-logo">
            <img src="@/assets/images/common/logo.png" :alt="$t('loginBrandLeft')">
          </span>
          <span class="intl-login__brand-divider">|</span>
          <img class="intl-login__brand-intl" src="@/assets/images/common/jiyu-international-sidebar-logo.png" :alt="$t('portalShortName')">
        </div>
        <h1>{{ $t('loginSloganMain') }}</h1>
        <p>{{ $t('loginSloganSub') }}</p>
      </section>
      <login-form />
    </main>

    <footer class="intl-login__footer">
      <div class="intl-login__footer-inner">
        <ul class="intl-login__contact-list">
          <li><i class="el-icon-location-outline" />{{ $t('loginHongKongAddress') }}</li>
          <li><i class="el-icon-phone-outline" />{{ $t('loginHotline') }}：400-820-5369（{{ $t('loginServiceHours') }}）</li>
          <li><i class="el-icon-message" />{{ $t('loginServiceEmail') }}：Service@jiyufund.com.cn</li>
        </ul>
        <div class="intl-login__footer-links">
          <ul>
            <li class="is-title">{{ $t('loginAboutJiyu') }}</li>
            <li>{{ $t('loginAbout') }}</li>
            <li>{{ $t('loginContact') }}</li>
            <li>{{ $t('loginQualification') }}</li>
            <li>{{ $t('loginPersonnelQualification') }}</li>
            <li>{{ $t('loginComplaint') }}</li>
          </ul>
          <ul>
            <li class="is-title">{{ $t('loginImportantNotice') }}</li>
            <li>{{ $t('loginSafetyGuide') }}</li>
            <li>{{ $t('loginLegalNotice') }}</li>
            <li>{{ $t('loginLaws') }}</li>
            <li>{{ $t('loginRiskNotice') }}</li>
            <li>{{ $t('loginMaterials') }}</li>
          </ul>
          <ul>
            <li class="is-title">{{ $t('loginInvestorNotice') }}</li>
            <li>{{ $t('loginInvestorRights') }}</li>
            <li>{{ $t('loginInvestorEducation') }}</li>
            <li>{{ $t('loginSuitabilityRules') }}</li>
            <li>{{ $t('loginSuitabilityColumn') }}</li>
            <li>{{ $t('loginFundRiskRules') }}</li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import LoginForm from '@/views/system/elogin/LoginForm'

export default {
  name: 'elogin',
  components: { LoginForm },
  methods: {
    setLocale (locale) {
      this.$store.dispatch('d2admin/locale/set', locale)
    }
  }
}
</script>

<style lang="scss" scoped>
.intl-login {
  position: relative;
  min-width: 1180px;
  min-height: 760px;
  height: 100vh;
  overflow: hidden;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(18, 23, 28, .19), rgba(18, 23, 28, .07)),
    url("~@/assets/images/login-global-bg.png") no-repeat center center / cover;
}

.intl-login__topbar {
  height: 38px;
  color: rgba(255, 255, 255, .72);
  background: rgba(30, 32, 34, .9);
}

.intl-login__topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1200px, calc(100% - 80px));
  height: 100%;
  margin: 0 auto;
}

.intl-login__top-links { display: flex; align-items: center; gap: 34px; font-size: 13px; }
.intl-login__top-links a { color: inherit; text-decoration: none; }
.intl-login__top-links a:hover { color: #dbb477; }
.intl-login__top-links i { margin-right: 9px; }

.intl-login__languages { display: flex; align-items: center; gap: 9px; color: #aaa; }
.intl-login__languages button { padding: 0; border: 0; color: inherit; background: none; cursor: pointer; }
.intl-login__languages button:hover,
.intl-login__languages button.is-active { color: #d4aa6e; }

.intl-login__main {
  display: flex;
  justify-content: space-between;
  width: min(1200px, calc(100% - 80px));
  margin: 70px auto 0;
}

.intl-login__brand-copy { padding-top: 4px; text-shadow: 0 2px 12px rgba(0, 0, 0, .25); }
.intl-login__brand { display: flex; align-items: center; height: 48px; }
.intl-login__brand-fund-logo {
  display: block;
  width: 180px;
  height: 41px;
  overflow: hidden;
  flex: 0 0 180px;
}
.intl-login__brand-fund-logo img {
  display: block;
  width: 301px;
  height: 41px;
  max-width: none;
}
.intl-login__brand-divider { margin: 0 10px; color: #e2bd82; font-size: 31px; font-weight: 300; }
.intl-login__brand-intl { width: 171px; height: auto; }
.intl-login__brand-copy h1 { margin: 38px 0 0; font-size: 30px; font-weight: 400; letter-spacing: 2px; }
.intl-login__brand-copy p { margin: 21px 0 0; font-size: 16px; }

.intl-login__footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 180px;
  background: rgba(24, 25, 25, .8);
}

.intl-login__footer-inner {
  display: flex;
  justify-content: space-between;
  width: min(1200px, calc(100% - 80px));
  height: 100%;
  margin: 0 auto;
  padding: 25px 0;
  box-sizing: border-box;
}

.intl-login__contact-list { margin: 0; padding: 0; list-style: none; font-size: 13px; line-height: 32px; }
.intl-login__contact-list i { width: 25px; color: rgba(255, 255, 255, .7); }
.intl-login__footer-links { display: flex; gap: 54px; }
.intl-login__footer-links ul { width: 112px; margin: 0; padding: 0; list-style: none; color: rgba(255, 255, 255, .76); font-size: 12px; line-height: 25px; }
.intl-login__footer-links ul:last-child { width: 172px; }
.intl-login__footer-links li.is-title { color: #fff; font-weight: 600; }

@media (max-height: 840px) {
  .intl-login__main { margin-top: 45px; }
  .intl-login__footer { height: 155px; }
  .intl-login__footer-inner { padding-top: 14px; }
  .intl-login__footer-links ul { line-height: 22px; }
}
</style>

<style lang="scss">
.intl-login .login-card {
  width: 380px;
  padding: 28px;
  align-self: flex-start;
  border: 0;
  background: rgba(42, 42, 43, .84);
}
</style>
