<template>
  <d2-container class="biz-shell">
    <template slot="header">
      <div class="biz-header"><div class="biz-header__title">{{ $t(pageTitleKey) }}</div></div>
    </template>
    <div class="biz-page" v-loading="loading">
      <el-alert v-if="error" type="error" :title="$t(error.messageKey || 'errors.queryFailed')" show-icon>
        <el-button size="mini" @click="load">{{ $t('commonRetry') }}</el-button>
      </el-alert>
      <section v-else-if="profile && section === 'permission'" class="biz-card profile-card">
        <div class="biz-card__hd">{{ $t('personalProfileSection') }}</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="$t('personalName')">{{ profileName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('personalEmail')">{{ profile.email }}</el-descriptions-item>
          <el-descriptions-item :label="$t('personalMobile')">{{ profile.mobileMasked || $t('commonUnavailable') }}</el-descriptions-item>
          <el-descriptions-item :label="$t('langLabel')">
            <jgt-lang-switch show-label @change="saveLocale" />
            <span v-if="savingLocale" class="saving">{{ $t('commonSaving') }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <div class="actions"><el-button type="danger" plain @click="logout">{{ $t('personalLogout') }}</el-button></div>
      </section>
      <section v-else-if="profile && section === 'password'" class="biz-card password-card">
        <div class="password-column">
          <div class="profile-line"><span class="profile-label">{{ $t('personalName') }}：</span><strong>{{ profileName }}</strong></div>
          <div class="profile-line"><span class="profile-label">{{ $t('personalMobile') }}：</span><strong>{{ profile.mobileMasked || $t('commonUnavailable') }}</strong></div>
          <div class="profile-line password-line">
            <span class="profile-label">{{ $t('personalTradePassword') }}：</span>
            <el-button size="mini" plain @click="passwordNotice">{{ $t('personalChangeTradePassword') }}</el-button>
          </div>
        </div>
        <div class="password-column">
          <div class="profile-line"><span class="profile-label">{{ $t('personalOperatorId') }}：</span><strong>{{ profile.operatorId }}</strong></div>
          <div class="profile-line"><span class="profile-label">{{ $t('personalCertificateNo') }}：</span><strong>{{ profile.certificateNoMasked || $t('commonUnavailable') }}</strong></div>
          <div class="profile-line password-line">
            <span class="profile-label">{{ $t('personalLoginPassword') }}：</span>
            <el-button size="mini" plain @click="passwordNotice">{{ $t('personalChangeLoginPassword') }}</el-button>
          </div>
        </div>
      </section>
      <section v-else-if="profile" class="biz-card records-card">
        <el-table :data="[]" border>
          <template v-if="section === 'documents'">
            <el-table-column prop="name" :label="$t('personalDocumentName')" />
            <el-table-column prop="createdAt" :label="$t('personalCreatedAt')" width="190" />
            <el-table-column prop="status" :label="$t('commonStatus')" width="140" />
          </template>
          <template v-else>
            <el-table-column prop="loggedAt" :label="$t('personalLoginTime')" width="190" />
            <el-table-column prop="method" :label="$t('personalLoginMethod')" />
            <el-table-column prop="result" :label="$t('personalLoginResult')" width="140" />
          </template>
          <template slot="empty"><div class="records-empty">{{ $t('commonNoData') }}</div></template>
        </el-table>
      </section>
    </div>
  </d2-container>
</template>

<script>
import { accounts } from '@/services/intl'
import JgtLangSwitch from '@/components/jgt-lang-switch'

export default {
  name: 'IntlPersonalCenter',
  components: { JgtLangSwitch },
  data () { return { profile: null, loading: false, savingLocale: false, error: null, savedLocale: null } },
  computed: {
    section () { return (this.$route.meta && this.$route.meta.personalSection) || 'permission' },
    pageTitleKey () { return (this.$route.meta && this.$route.meta.titleKey) || 'personalCenterTitle' },
    profileName () {
      const values = this.profile && this.profile.nameI18n
      return (values && (values[this.$locale] || values['zh-Hans'])) || (this.profile && this.profile.name) || this.$t('commonUnavailable')
    }
  },
  created () { this.load() },
  methods: {
    async load () {
      this.loading = true; this.error = null; this.profile = null
      try { this.profile = await accounts.getOperatorProfile(); this.savedLocale = this.profile.locale } catch (error) { this.error = error } finally { this.loading = false }
    },
    async saveLocale (locale) {
      this.savingLocale = true
      try {
        this.profile = await accounts.updateLocale(locale)
        this.savedLocale = locale
        this.$message.success(this.$t('personalLocaleSaved'))
      } catch (error) {
        await this.$store.dispatch('d2admin/locale/set', this.savedLocale)
        this.$message.error(this.$t(error.messageKey || 'errors.saveFailed'))
      } finally { this.savingLocale = false }
    },
    passwordNotice () {
      this.$message.info(this.$t('personalPasswordFrontendNotice'))
    },
    async logout () {
      try {
        await this.$confirm(this.$t('personalLogoutConfirm'), this.$t('commonConfirm'), { type: 'warning' })
        await this.$store.dispatch('d2admin/account/logout', { confirm: false })
      } catch (error) {
        // Cancellation keeps the current session unchanged.
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
.profile-card { max-width: none; margin: 0 16px 16px; }
.profile-card ::v-deep .el-descriptions { max-width: 900px; padding: 0; }
.profile-card ::v-deep .el-descriptions-item__label { width: 160px; font-size: 12px; font-weight: 500; }
.profile-card ::v-deep .el-descriptions-item__content { font-size: 12px; }
.actions { max-width: 900px; padding: 16px 0 0; text-align: right; }
.actions ::v-deep .el-button { border-radius: 0; }
.saving { margin-left: 12px; @include color(A17); }
.password-card { display: grid; grid-template-columns: 1fr 1fr; min-height: 210px; margin: 0; padding: 24px; gap: 48px; }
.password-column { display: flex; flex-direction: column; }
.profile-line { display: grid; grid-template-columns: 120px 1fr; align-items: center; min-height: 37px; font-size: 12px; line-height: 37px; }
.profile-label { display: inline-block; width: 120px; font-weight: 500; }
.profile-line > strong { font-weight: 400; }
.password-line ::v-deep .el-button { width: max-content; border-radius: 0; background: transparent; }
.records-card { margin: 0; padding: 0; }
.records-empty { padding: 36px 0; opacity: .64; }
</style>
