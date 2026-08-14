<template>
  <d2-container class="workbench-shell">
    <template slot="header">
      <div class="workbench__page-title">
        <span>{{ $t('wbTitle') }}</span>
        <el-button type="text" class="workbench__link" @click="goAssets">{{ $t('wbViewAssets') }}</el-button>
      </div>
    </template>
    <div class="workbench">
      <div class="workbench__header">
        <i class="el-icon-user-solid" />
        <p class="workbench__welcome">
          {{ $t('wbWelcome') }}，<strong>{{ displayName }}</strong>
          <span v-if="displayOrg" class="workbench__org">（{{ displayOrg }}）</span>
        </p>
      </div>

      <div v-if="!isPI" class="workbench__pi-alert">
        <i class="el-icon-warning" />
        <span>{{ $t('wbPiAlert') }}</span>
      </div>

      <div v-if="loading" class="workbench__alert">{{ $t('commonLoading') }}</div>
      <div v-else-if="error" class="workbench__alert">
        <span>{{ $t(error) }}</span>
        <el-button type="text" @click="refreshStats">{{ $t('commonRetry') }}</el-button>
      </div>

      <div class="workbench__stats">
        <div class="stat-card">
          <div class="stat-card__label">{{ $t('wbStatPi') }}</div>
          <div class="stat-card__value" :class="{ 'is-danger': !isPI }">{{ $t(isPI ? 'wbPiCertified' : 'wbPiUncertified') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">{{ $t('wbStatPending') }}</div>
          <div class="stat-card__value is-danger">{{ summary.pendingInstructionCount || 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">{{ $t('wbStatLedgers') }}</div>
          <div class="stat-card__value">{{ summary.inquiryCount || 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">{{ $t('wbStatRegTime') }}</div>
          <div class="stat-card__value is-date">{{ formatDate(userInfo.registeredAt || summary.asOf) }}</div>
        </div>
      </div>

      <h2 class="workbench__section-title">{{ $t('wbQuickEntry') }}</h2>
      <div class="workbench__qlinks">
        <div
          v-for="item in quickLinks"
          :key="item.path"
          class="qlink-card"
          :class="{ 'is-dim': item.requirePI && !isPI }"
          @click="goQuick(item)"
        >
          <div class="qlink-card__icon"><d2-icon :name="item.icon" /></div>
          <div>
            <div class="qlink-card__title">{{ $t(item.titleKey) }}</div>
            <div class="qlink-card__desc">{{ $t(item.descKey) }}</div>
          </div>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { mapState } from 'vuex'
import { dashboard } from '@/services/intl'

export default {
  name: 'home',
  data () {
    return {
      loading: false,
      error: '',
      summary: {},
      quickLinks: [
        { path: '/fund/product/list', titleKey: 'navProducts', descKey: 'wbLinkProductsDesc', icon: 'th-large' },
        { path: '/trade-info/aggregation/index', titleKey: 'navTrade', descKey: 'wbLinkTradeDesc', icon: 'exchange' },
        { path: '/account/trade-records', titleKey: 'navTransactions', descKey: 'wbLinkTradeConfirmDesc', icon: 'list-alt' },
        { path: '/account/my-assets', titleKey: 'navHoldings', descKey: 'wbLinkHoldingsDesc', icon: 'bar-chart' },
        { path: '/account/bill', titleKey: 'navStatements', descKey: 'wbLinkStatementsDesc', icon: 'file-pdf-o' },
        { path: '/account/list', titleKey: 'navAccountInfo', descKey: 'wbLinkAccountDesc', icon: 'building-o' }
      ]
    }
  },
  computed: {
    ...mapState('d2admin/user', {
      userInfo: state => state.info || {}
    }),
    displayName () {
      return this.userInfo.operatorName || this.userInfo.email || '-'
    },
    displayOrg () {
      return this.userInfo.companyName ||
        (this.userInfo.userLoginOrg && this.userInfo.userLoginOrg.orgName) ||
        ''
    },
    isPI () {
      return this.userInfo.pi === true || this.userInfo.professionalInvestorStatus === 'APPROVED'
    }
  },
  created () {
    this.refreshStats()
  },
  activated () {
    this.refreshStats()
  },
  methods: {
    async refreshStats () {
      this.loading = true
      this.error = ''
      try {
        this.summary = await dashboard.getSummary()
      } catch (e) {
        this.summary = {}
        this.error = (e && e.messageKey) || 'errorSystem'
      } finally {
        this.loading = false
      }
    },
    formatDate (raw) {
      if (!raw) return '-'
      const d = new Date(raw)
      return Number.isNaN(d.getTime())
        ? '-'
        : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    goQuick (item) {
      this.$router.push(item.path)
    },
    goAssets () {
      this.$router.push('/account/my-assets')
    }
  }
}
</script>

<style lang="scss" scoped>
.workbench { min-height: 640px; padding-bottom: 28px; @include backgroundColor(A1); }
.workbench__page-title { display: flex; justify-content: space-between; align-items: center; min-height: 30px; }
.workbench__link { @include color(A10, 1); font-size: 14px; font-weight: 400 !important; }
.workbench__header { display: flex; align-items: center; gap: 8px; min-height: 45px; padding: 0 16px; border-bottom: 1px solid; @include borderColor(A13); @include backgroundColor(A2); }
.workbench__header > i { @include color(A10); font-size: 18px; }
.workbench__welcome { margin: 0; @include color(A15); font-size: 14px; font-weight: 400; }
.workbench__welcome strong { font-weight: 500; }
.workbench__org { @include color(A17); }
.workbench__pi-alert { display: flex; align-items: center; gap: 10px; margin: 12px 16px 0; padding: 10px 12px; @include color(A15); border-left: 3px solid; @include borderColor(A18); @include backgroundColor(A22); font-size: 12px; }
.workbench__pi-alert i { @include color(A15); }
.workbench__alert { display: flex; align-items: center; gap: 10px; margin: 12px 16px; padding: 9px 12px; @include color(A15); border-left: 3px solid; @include borderColor(A10); @include backgroundColor(A10O1); font-size: 12px; }
.workbench__stats { display: grid; grid-template-columns: repeat(4, 1fr); margin: 18px 16px 24px; border: 1px solid; @include borderColor(A13); }
.stat-card { min-height: 92px; padding: 15px 20px; border-right: 1px solid; @include borderColor(A13); @include backgroundColor(A2); }
.stat-card:last-child { border-right: 0; }
.stat-card__label { margin-bottom: 10px; @include color(A17); font-size: 14px; font-weight: 400; }
.stat-card__value { @include color(A10); font-size: 24px; font-weight: 500; line-height: 1.2; font-variant-numeric: tabular-nums; }
.stat-card__value.is-danger { @include color(A20); }
.stat-card__value.is-date { font-size: 17px; }
.workbench__section-title { margin: 0 16px; padding: 10px 12px; @include color(A6); @include backgroundColor(A14); font-size: 14px; font-weight: 500; }
.workbench__qlinks { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0 16px; border-left: 1px solid; border-right: 1px solid; @include borderColor(A13); }
.qlink-card { display: flex; align-items: center; gap: 14px; min-height: 82px; padding: 12px 18px; border-right: 1px solid; border-bottom: 1px solid; @include borderColor(A13); @include backgroundColor(A2); cursor: pointer; transition: background .15s ease, color .15s ease; }
.qlink-card:nth-child(3n) { border-right: 0; }
.qlink-card:hover { @include backgroundColor(A2h); }
.qlink-card.is-dim { opacity: .65; }
.qlink-card__icon { width: 32px; @include color(A10); font-size: 22px; text-align: center; }
.qlink-card__title { margin-bottom: 4px; @include color(A15); font-size: 16px; font-weight: 400; line-height: 22px; }
.qlink-card__desc { @include color(A17); font-size: 14px; font-weight: 400; line-height: 20px; }
@media (max-width: 1100px) { .workbench__qlinks { grid-template-columns: repeat(2, 1fr); } .qlink-card:nth-child(3n) { border-right: 1px solid; @include borderColor(A13); } .qlink-card:nth-child(2n) { border-right: 0; } }
@media (max-width: 900px) { .workbench__stats { grid-template-columns: repeat(2, 1fr); } .workbench__qlinks { grid-template-columns: 1fr; } .qlink-card { border-right: 0 !important; } }
@media (max-width: 620px) { .workbench__stats { grid-template-columns: 1fr; } .stat-card { border-right: 0; border-bottom: 1px solid; @include borderColor(A13); } }
</style>
