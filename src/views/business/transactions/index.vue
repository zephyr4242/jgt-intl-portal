<template>
  <d2-container class="biz-shell">
    <template slot="header"><div class="biz-header"><div class="biz-header__title">{{ $t('transactionsTitle') }}</div></div></template>
    <div class="biz-page">
      <p class="biz-sub">{{ $t('transactionsDescription') }}</p>

      <el-form inline class="filters">
        <el-form-item :label="$t('accountTradeAccount')"><el-input v-model.trim="query.tradeAccountId" clearable /></el-form-item>
        <el-form-item :label="$t('commonFund')"><el-input v-model.trim="query.fundId" clearable /></el-form-item>
        <el-form-item :label="$t('transactionsSide')">
          <el-select v-model="query.side" clearable :placeholder="$t('commonAll')">
            <el-option :label="$t('tradeDirSubscribe')" value="SUBSCRIBE" />
            <el-option :label="$t('tradeDirRedeem')" value="REDEEM" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('commonStatus')">
          <el-select v-model="query.status" clearable :placeholder="$t('commonAll')">
            <el-option v-for="status in statuses" :key="status" :label="$t(`tradeStatus.${status}`)" :value="status" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('transactionsSubmittedAt')">
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
          <el-table-column prop="instructionId" :label="$t('transactionsInstructionId')" min-width="150" />
          <el-table-column prop="tradeAccountId" :label="$t('accountTradeAccount')" min-width="130" />
          <el-table-column prop="fundCode" :label="$t('commonFundCode')" min-width="100" />
          <el-table-column :label="$t('commonFundName')" min-width="180">
            <template slot-scope="{ row }">{{ row.fundName ? localize(row.fundName) : row.fundCode }}</template>
          </el-table-column>
          <el-table-column :label="$t('transactionsSide')" width="90">
            <template slot-scope="{ row }">{{ $t(row.side === 'REDEEM' ? 'tradeDirRedeem' : 'tradeDirSubscribe') }}</template>
          </el-table-column>
          <el-table-column :label="$t('transactionsValue')" min-width="120">
            <template slot-scope="{ row }">{{ row.value }} {{ row.valueType === 'AMOUNT' ? row.currency : $t('transactionsSharesUnit') }}</template>
          </el-table-column>
          <el-table-column :label="$t('commonStatus')" min-width="140">
            <template slot-scope="{ row }"><span class="tag" :class="statusClass(row.status)">{{ $t(`tradeStatus.${row.status}`) }}</span></template>
          </el-table-column>
          <el-table-column prop="submittedAt" :label="$t('transactionsSubmittedAt')" min-width="170" />
          <el-table-column prop="updatedAt" :label="$t('transactionsUpdatedAt')" min-width="170" />
          <el-table-column :label="$t('transactionsReason')" min-width="180">
            <template slot-scope="{ row }">{{ row.reasonMessageKey ? $t(row.reasonMessageKey) : $t('commonUnavailable') }}</template>
          </el-table-column>
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
      <p class="biz-tip">{{ $t('transactionsNotExecutionTip') }}</p>
    </div>
  </d2-container>
</template>

<script>
import { trades } from '@/services/intl'

export default {
  name: 'IntlTransactions',
  data () {
    return {
      statuses: ['ACCEPTED', 'MANUAL_PENDING', 'PROCESSING', 'CONFIRMED', 'PARTIALLY_CONFIRMED', 'FAILED', 'CANCELLED', 'UNKNOWN'],
      query: { tradeAccountId: '', fundId: '', side: '', status: '', page: 1, pageSize: 20 },
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
      this.loading = true
      this.error = null
      this.items = []
      this.total = 0
      try {
        const result = await trades.list({
          ...this.query,
          submittedFrom: this.dateRange && this.dateRange[0],
          submittedTo: this.dateRange && this.dateRange[1] ? `${this.dateRange[1]}T23:59:59.999Z` : '',
          locale: this.$locale
        })
        this.items = result.items
        this.total = result.total
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    search () { this.query.page = 1; this.load() },
    reset () {
      this.query = { tradeAccountId: '', fundId: '', side: '', status: '', page: 1, pageSize: 20 }
      this.dateRange = []
      this.load()
    },
    localize (value) {
      if (!value || typeof value !== 'object') return value || this.$t('commonUnavailable')
      const key = this.$locale === 'zh-Hant' ? 'zhHant' : this.$locale === 'en' ? 'en' : 'zhHans'
      return value[key] || value[this.$locale] || this.$t('commonUnavailable')
    },
    statusClass (status) {
      if (status === 'CONFIRMED') return 'tag-ok'
      if (['FAILED', 'CANCELLED', 'UNKNOWN'].includes(status)) return 'tag-danger'
      return 'tag-pending'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
.tag-danger { @include backgroundColor(A18O1); @include color(A20); }
.el-pagination { padding: 16px; text-align: right; }
</style>
<style lang="scss">@import '../styles/biz-table.scss';</style>
