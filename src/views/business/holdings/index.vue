<template>
  <d2-container class="biz-shell">
    <template slot="header"><div class="biz-header"><div class="biz-header__title">{{ $t('holdingsTitle') }}</div></div></template>
    <div class="biz-page">
      <p class="biz-sub">{{ $t('holdingsDescription') }}</p>

      <el-form inline class="filters" @submit.native.prevent="search">
        <el-form-item :label="$t('accountTradeAccount')">
          <el-input v-model.trim="query.tradeAccountId" clearable :placeholder="$t('commonAll')" />
        </el-form-item>
        <el-form-item :label="$t('commonKeyword')">
          <el-input v-model.trim="query.keyword" clearable :placeholder="$t('holdingsKeywordPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('commonCurrency')">
          <el-select v-model="query.currency" clearable :placeholder="$t('commonAll')">
            <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="search">{{ $t('commonSearch') }}</el-button>
        <el-button @click="reset">{{ $t('commonReset') }}</el-button>
      </el-form>

      <el-alert v-if="error" type="error" :title="$t(error.messageKey || 'errors.queryFailed')" show-icon>
        <el-button size="mini" @click="load">{{ $t('commonRetry') }}</el-button>
      </el-alert>

      <div v-if="!error" class="currency-groups" v-loading="loading">
        <section v-for="group in groups" :key="group.currency" class="biz-card currency-group">
          <div class="biz-card__hd group-header">
            <span>{{ group.currency }}</span>
            <span>{{ $t('holdingsCurrencySubtotal') }}: {{ formatDecimal(group.marketValue) }} {{ group.currency }}</span>
          </div>
          <el-table :data="group.items" stripe size="small" class="biz-table">
            <el-table-column prop="fundCode" :label="$t('commonFundCode')" min-width="100" />
            <el-table-column :label="$t('commonFundName')" min-width="190">
              <template slot-scope="{ row }">{{ localize(row.fundName) }}</template>
            </el-table-column>
            <el-table-column prop="shares" :label="$t('holdingsShares')" min-width="120" />
            <el-table-column prop="availableShares" :label="$t('holdingsAvailableShares')" min-width="130" />
            <el-table-column :label="$t('holdingsNav')" min-width="100">
              <template slot-scope="{ row }">{{ empty(row.nav) }}</template>
            </el-table-column>
            <el-table-column :label="$t('holdingsNavDate')" min-width="110">
              <template slot-scope="{ row }">{{ empty(row.navDate) }}</template>
            </el-table-column>
            <el-table-column :label="$t('holdingsMarketValue')" min-width="130">
              <template slot-scope="{ row }">{{ empty(row.marketValue) }}</template>
            </el-table-column>
            <el-table-column :label="$t('holdingsCost')" min-width="120">
              <template slot-scope="{ row }">{{ empty(row.cost) }}</template>
            </el-table-column>
            <el-table-column :label="$t('holdingsProfitLoss')" min-width="120">
              <template slot-scope="{ row }">
                <span :class="profitClass(row.profitLoss)">{{ signed(row.profitLoss) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('holdingsProfitLossRate')" min-width="110">
              <template slot-scope="{ row }">
                <span :class="profitClass(row.profitLossRate)">{{ percent(row.profitLossRate) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <div v-if="!loading && groups.length === 0" class="biz-empty">{{ $t('commonNoData') }}</div>
      </div>
      <p class="biz-tip">{{ $t('holdingsNoCrossCurrencyTotal') }}</p>
    </div>
  </d2-container>
</template>

<script>
import { holdings } from '@/services/intl'

export default {
  name: 'IntlHoldings',
  data () {
    return {
      loading: false,
      error: null,
      items: [],
      query: { tradeAccountId: '', keyword: '', currency: '', page: 1, pageSize: 100 }
    }
  },
  computed: {
    currencies () {
      return [...new Set(this.items.map(item => item.currency).filter(Boolean))]
    },
    groups () {
      return this.items.reduce((groups, item) => {
        let group = groups.find(entry => entry.currency === item.currency)
        if (!group) {
          group = { currency: item.currency || '-', items: [], marketValue: '0' }
          groups.push(group)
        }
        group.items.push(item)
        group.marketValue = this.addDecimals(group.marketValue, item.marketValue)
        return groups
      }, [])
    }
  },
  created () { this.load() },
  methods: {
    async load () {
      this.loading = true
      this.error = null
      this.items = []
      try {
        const result = await holdings.list({ ...this.query, locale: this.$locale })
        this.items = result.items
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    search () { this.query.page = 1; this.load() },
    reset () { this.query = { tradeAccountId: '', keyword: '', currency: '', page: 1, pageSize: 100 }; this.load() },
    localize (value) {
      if (!value || typeof value !== 'object') return value || this.$t('commonUnavailable')
      const key = this.$locale === 'zh-Hant' ? 'zhHant' : this.$locale === 'en' ? 'en' : 'zhHans'
      return value[key] || value[this.$locale] || this.$t('commonUnavailable')
    },
    empty (value) { return value == null || value === '' ? this.$t('commonUnavailable') : value },
    profitClass (value) { return Number(value) < 0 ? 'loss' : Number(value) > 0 ? 'profit' : '' },
    signed (value) { return value == null ? this.$t('commonUnavailable') : `${Number(value) > 0 ? '+' : ''}${value}` },
    percent (value) { return value == null ? this.$t('commonUnavailable') : `${Number(value) > 0 ? '+' : ''}${value}%` },
    addDecimals (left, right) {
      if (right == null || right === '') return left
      const a = String(left || '0').split('.')
      const b = String(right).split('.')
      const decimals = Math.max((a[1] || '').length, (b[1] || '').length)
      const first = `${a[0]}${(a[1] || '').padEnd(decimals, '0')}`.replace(/^0+(?=\d)/, '')
      const second = `${b[0]}${(b[1] || '').padEnd(decimals, '0')}`.replace(/^0+(?=\d)/, '')
      let carry = 0
      let sum = ''
      for (let ai = first.length - 1, bi = second.length - 1; ai >= 0 || bi >= 0 || carry; ai--, bi--) {
        const digit = Number(first[ai] || 0) + Number(second[bi] || 0) + carry
        sum = `${digit % 10}${sum}`
        carry = Math.floor(digit / 10)
      }
      if (!decimals) return sum
      return `${sum.slice(0, -decimals) || '0'}.${sum.slice(-decimals).padStart(decimals, '0')}`
    },
    formatDecimal (value) {
      const parts = String(value || '0').split('.')
      return `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${parts[1] ? `.${parts[1]}` : ''}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
.currency-group { margin-bottom: 18px; }
.group-header { display: flex; justify-content: space-between; }
.profit { @include color(A19); font-weight: 600; }
.loss { @include color(A20); font-weight: 600; }
</style>
<style lang="scss">@import '../styles/biz-table.scss';</style>
