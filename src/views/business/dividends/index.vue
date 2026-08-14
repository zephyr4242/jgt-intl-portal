<template>
  <d2-container class="biz-shell">
    <template slot="header"><div class="biz-header"><div class="biz-header__title">{{ $t('dividendsTitle') }}</div></div></template>
    <div class="biz-page">
      <p class="biz-sub">{{ $t('dividendsDescription') }}</p>
      <el-form inline class="filters">
        <el-form-item :label="$t('accountTradeAccount')"><el-input v-model.trim="query.tradeAccountId" clearable /></el-form-item>
        <el-form-item :label="$t('commonFund')"><el-input v-model.trim="query.fundId" clearable /></el-form-item>
        <el-form-item :label="$t('commonStatus')">
          <el-select v-model="query.status" clearable :placeholder="$t('commonAll')">
            <el-option v-for="status in statuses" :key="status" :label="$t(`dividendStatus.${status}`)" :value="status" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dividendsExDate')">
          <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="search">{{ $t('commonSearch') }}</el-button>
        <el-button @click="reset">{{ $t('commonReset') }}</el-button>
      </el-form>
      <el-alert v-if="error" type="error" :title="$t(error.messageKey || 'errors.queryFailed')" show-icon>
        <el-button size="mini" @click="load">{{ $t('commonRetry') }}</el-button>
      </el-alert>
      <div v-else class="biz-card" v-loading="loading">
        <el-table :data="items" stripe size="small" class="biz-table">
          <el-table-column prop="fundCode" :label="$t('commonFundCode')" min-width="100" />
          <el-table-column :label="$t('commonFundName')" min-width="190"><template slot-scope="{ row }">{{ localize(row.fundName) }}</template></el-table-column>
          <el-table-column prop="tradeAccountId" :label="$t('accountTradeAccount')" min-width="130" />
          <el-table-column prop="exDividendDate" :label="$t('dividendsExDate')" min-width="110" />
          <el-table-column prop="recordDate" :label="$t('dividendsRecordDate')" min-width="110" />
          <el-table-column :label="$t('dividendsPaymentDate')" min-width="110"><template slot-scope="{ row }">{{ empty(row.paymentDate) }}</template></el-table-column>
          <el-table-column prop="dividendPerUnit" :label="$t('dividendsPerUnit')" min-width="120" />
          <el-table-column prop="eligibleShares" :label="$t('dividendsEligibleShares')" min-width="130" />
          <el-table-column :label="$t('dividendsAmount')" min-width="140"><template slot-scope="{ row }">{{ row.dividendAmount }} {{ row.currency }}</template></el-table-column>
          <el-table-column :label="$t('commonStatus')" min-width="110"><template slot-scope="{ row }">{{ $t(`dividendStatus.${row.status}`) }}</template></el-table-column>
        </el-table>
        <div v-if="!loading && items.length === 0" class="biz-empty">{{ $t('commonNoData') }}</div>
        <el-pagination
          v-if="total > query.pageSize"
          layout="prev, pager, next, total"
          :current-page.sync="query.page"
          :page-size="query.pageSize"
          :total="total"
          @current-change="load"
        />
      </div>
    </div>
  </d2-container>
</template>

<script>
import { dividends } from '@/services/intl'

export default {
  name: 'IntlDividends',
  data () {
    return {
      statuses: ['ANNOUNCED', 'REGISTERED', 'PAYING', 'PAID', 'FAILED', 'UNKNOWN'],
      query: { tradeAccountId: '', fundId: '', status: '', page: 1, pageSize: 20 },
      dateRange: [],
      items: [],
      total: 0,
      loading: false,
      error: null
    }
  },
  created () { this.load() },
  methods: {
    async load () {
      this.loading = true; this.error = null; this.items = []; this.total = 0
      try {
        const result = await dividends.list({ ...this.query, dateFrom: this.dateRange && this.dateRange[0], dateTo: this.dateRange && this.dateRange[1], locale: this.$locale })
        this.items = result.items; this.total = result.total
      } catch (error) { this.error = error } finally { this.loading = false }
    },
    search () { this.query.page = 1; this.load() },
    reset () { this.query = { tradeAccountId: '', fundId: '', status: '', page: 1, pageSize: 20 }; this.dateRange = []; this.load() },
    localize (value) {
      if (!value || typeof value !== 'object') return value || this.$t('commonUnavailable')
      const key = this.$locale === 'zh-Hant' ? 'zhHant' : this.$locale === 'en' ? 'en' : 'zhHans'
      return value[key] || value[this.$locale] || this.$t('commonUnavailable')
    },
    empty (value) { return value || this.$t('commonUnavailable') }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
.el-pagination { padding: 16px; text-align: right; }
</style>
<style lang="scss">@import '../styles/biz-table.scss';</style>
