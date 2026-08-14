<template>
  <d2-container class="biz-shell">
    <template slot="header"><div class="biz-header"><div class="biz-header__title">{{ $t('accountInfoTitle') }}</div></div></template>
    <div class="biz-page" v-loading="loading">
      <p class="biz-sub">{{ $t('accountInfoDescription') }}</p>
      <el-alert v-if="error" type="error" :title="$t(error.messageKey || 'errors.queryFailed')" show-icon>
        <el-button size="mini" @click="load">{{ $t('commonRetry') }}</el-button>
      </el-alert>
      <template v-else-if="account">
        <section class="biz-card account-card">
          <div class="biz-card__hd">{{ $t('accountOrganizationSection') }}</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('accountOrganizationName')">{{ localized(account.organizationName, account.organizationNameI18n) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('accountCustomerNo')">{{ empty(account.customerNo) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('commonStatus')">{{ $t(`accountStatus.${account.accountStatus || 'UNKNOWN'}`) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('accountOpenedOn')">{{ empty(account.openedOn) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('accountContactName')">{{ localized(account.contactName, account.contactNameI18n) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('accountContactEmail')">{{ empty(account.contactEmail) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('accountContactMobile')">{{ empty(account.contactMobile) }}</el-descriptions-item>
          </el-descriptions>
        </section>
        <section class="biz-card account-card">
          <div class="biz-card__hd">{{ $t('accountTradeAccountsSection') }}</div>
          <el-table :data="account.tradeAccounts || []" stripe size="small" class="biz-table">
            <el-table-column prop="accountNoMasked" :label="$t('accountNumber')" />
            <el-table-column :label="$t('accountName')"><template slot-scope="{ row }">{{ localized(row.accountName, row.accountNameI18n) }}</template></el-table-column>
            <el-table-column :label="$t('commonStatus')"><template slot-scope="{ row }">{{ $t(`accountStatus.${row.status || 'UNKNOWN'}`) }}</template></el-table-column>
            <el-table-column :label="$t('accountSupportedCurrencies')"><template slot-scope="{ row }">{{ (row.supportedCurrencies || []).join(', ') || $t('commonUnavailable') }}</template></el-table-column>
          </el-table>
        </section>
        <p class="biz-tip">{{ $t('accountReadonlyTip') }}</p>
      </template>
      <div v-else-if="!loading" class="biz-empty">{{ $t('commonNoData') }}</div>
    </div>
  </d2-container>
</template>

<script>
import { accounts } from '@/services/intl'

export default {
  name: 'IntlAccountInfo',
  data () { return { account: null, loading: false, error: null } },
  created () { this.load() },
  methods: {
    async load () {
      this.loading = true; this.error = null; this.account = null
      try { this.account = await accounts.getOrganizationAccount() } catch (error) { this.error = error } finally { this.loading = false }
    },
    empty (value) { return value || this.$t('commonUnavailable') },
    localized (value, values) {
      return (values && (values[this.$locale] || values['zh-Hans'])) || this.empty(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
.account-card { margin: 0 0 16px; }
.account-card ::v-deep .el-descriptions { padding: 0; }
.account-card ::v-deep .el-descriptions-item__label { width: 150px; font-size: 12px; font-weight: 500; }
.account-card ::v-deep .el-descriptions-item__content { font-size: 12px; }
</style>
<style lang="scss">@import '../styles/biz-table.scss';</style>
