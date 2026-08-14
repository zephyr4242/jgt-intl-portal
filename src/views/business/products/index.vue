<template>
  <d2-container class="fund-products-shell">
    <template slot="header">
      <div class="fund-page-header">
        <strong>{{ $t('navProducts') }}</strong>
      </div>
    </template>

    <div class="fund-products-page">
      <div class="fund-category-bar">
        <el-tabs v-model="activeType" class="fund-type-tabs" @tab-click="changeType">
          <el-tab-pane
            v-for="tab in typeTabs"
            :key="tab.value || 'ALL'"
            :name="tab.value"
            :label="tab.label"
          />
        </el-tabs>
        <div class="fund-currency-switch">
          <span class="filter-label">{{ $t('productsCurrencySwitch') }}：</span>
          <el-radio-group v-model="filters.currency" size="mini" @change="changeCurrency">
            <el-radio-button
              v-for="item in currencySegments"
              :key="item.value || 'ALL'"
              :label="item.value"
            >{{ item.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-form class="fund-filter-panel" inline size="mini" @submit.native.prevent="search">
        <el-form-item :label="$t('productsSearchPh')">
            <el-input
              v-model.trim="filters.keyword"
              clearable
              :placeholder="$t('productsSearchPh')"
              @keyup.enter.native="search"
              @clear="search"
            />
        </el-form-item>
        <el-form-item :label="$t('productsColRegion')">
          <el-select v-model="filters.region" clearable :placeholder="$t('productsRegionAll')" @change="search">
              <el-option v-for="item in regionOptions" :key="item.value || 'ALL'" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('productsColRisk')">
          <el-select v-model="filters.riskLevel" clearable :placeholder="$t('productsRiskAll')" @change="search">
            <el-option v-for="item in riskOptions" :key="item.value || 'ALL'" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="filter-buttons">
          <el-button type="primary" @click="search">{{ $t('commonSearch') }}</el-button>
          <el-button @click="resetFilters">{{ $t('commonReset') }}</el-button>
        </el-form-item>
      </el-form>

      <div class="selected-row">
        <div class="selected-summary">
          <strong>{{ $t('commonSelected') }}：</strong>
          <template v-if="selectedFilters.length">
            <el-tag
              v-for="item in selectedFilters"
              :key="item.key"
              size="mini"
              closable
              @close="chooseFilter(item.key, '')"
            >{{ item.label }}</el-tag>
          </template>
          <span v-else>{{ $t('commonNone') }}</span>
        </div>
        <div class="list-actions">
          <span>{{ $t('productsCurrencyScope') }}：{{ activeCurrencyLabel }}</span>
        </div>
      </div>

      <div v-if="state === 'error'" class="fund-page-state">
        <i class="el-icon-warning-outline" />
        <p>{{ $t('productsLoadFailed') }}</p>
        <el-button type="primary" plain size="small" @click="loadProducts">{{ $t('commonRetry') }}</el-button>
      </div>

      <el-table
        v-else
        v-loading="state === 'loading'"
        :data="products"
        class="fund-data-table"
        border
        stripe
        size="mini"
      >
        <el-table-column :label="$t('productsColName')" min-width="200">
          <template slot-scope="{ row }">
            <el-button type="text" class="fund-name-link" @click="goTrade(row)">{{ localized(row.name) }}</el-button>
            <span class="fund-code">{{ row.fundCode }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('productsColNav')" width="100" align="center">
          <template slot-scope="{ row }">
            <strong class="nav-value">{{ row.nav == null ? '--' : row.nav }}</strong>
            <span class="cell-minor">{{ row.navDate || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('productsColType')" width="118" align="center">
          <template slot-scope="{ row }">{{ $t(`fundType.${row.fundType}`) }}</template>
        </el-table-column>
        <el-table-column :label="$t('productsColRegion')" width="125" align="center">
          <template slot-scope="{ row }">{{ $t(`fundRegion.${row.region}`) }}</template>
        </el-table-column>
        <el-table-column :label="$t('productsColManager')" min-width="185">
          <template slot-scope="{ row }">{{ localized(row.managerName) }}</template>
        </el-table-column>
        <el-table-column prop="currency" :label="$t('productsColCurrency')" width="76" align="center" />
        <el-table-column prop="riskLevel" :label="$t('productsColRisk')" width="72" align="center" />
        <el-table-column :label="$t('productsColMinInvest')" width="138" align="right">
          <template slot-scope="{ row }">
            {{ row.minimumSubscription == null ? '--' : formatNumber(row.minimumSubscription) }}
            <span v-if="row.minimumSubscription != null" class="cell-currency">{{ row.currency }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('productsColAction')" width="105" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" class="trade-link" @click="goTrade(row)">{{ $t('productsTradeBtn') }}</el-button>
          </template>
        </el-table-column>
        <template slot="empty"><div class="fund-empty">{{ $t('productsEmpty') }}</div></template>
      </el-table>

      <div v-if="state !== 'error' && total > 0" class="fund-pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          @current-change="changePage"
          @size-change="changePageSize"
        />
      </div>
    </div>
  </d2-container>
</template>

<script>
import { products } from '@/services/intl'

export default {
  name: 'products',
  data () {
    return {
      state: 'idle',
      products: [],
      page: 1,
      pageSize: 20,
      total: 0,
      requestSequence: 0,
      activeType: 'ALL',
      filters: { keyword: '', fundType: '', region: '', currency: '', riskLevel: '' },
      fundTypes: ['MONEY_MARKET', 'BOND', 'MULTI_ASSET', 'EQUITY'],
      regions: ['GLOBAL', 'APAC', 'HONG_KONG', 'EMERGING_MARKETS'],
      currencies: ['HKD', 'USD'],
      risks: ['R1', 'R2', 'R3', 'R4', 'R5']
    }
  },
  computed: {
    typeTabs () {
      return [
        { value: 'ALL', label: this.$t('productsTypeAll') },
        ...this.fundTypes.map(value => ({ value, label: this.$t(`fundType.${value}`) }))
      ]
    },
    currencySegments () {
      return [
        { value: '', label: this.$t('productsCurrencyOverall'), code: this.$t('productsCurrencyAllCode') },
        { value: 'HKD', label: this.$t('productsCurrencyHKD'), code: 'HKD' },
        { value: 'USD', label: this.$t('productsCurrencyUSD'), code: 'USD' }
      ]
    },
    activeCurrencyLabel () {
      const selected = this.currencySegments.find(item => item.value === this.filters.currency)
      return selected ? `${selected.label} · ${selected.code}` : this.$t('productsCurrencyOverall')
    },
    regionOptions () {
      return [{ value: '', label: this.$t('productsRegionAll') }, ...this.regions.map(value => ({ value, label: this.$t(`fundRegion.${value}`) }))]
    },
    riskOptions () {
      return [{ value: '', label: this.$t('productsRiskAll') }, ...this.risks.map(value => ({ value, label: value }))]
    },
    selectedFilters () {
      const selected = []
      if (this.filters.keyword) selected.push({ key: 'keyword', label: this.filters.keyword })
      if (this.filters.currency) selected.push({ key: 'currency', label: this.filters.currency })
      if (this.filters.region) selected.push({ key: 'region', label: this.$t(`fundRegion.${this.filters.region}`) })
      if (this.filters.riskLevel) selected.push({ key: 'riskLevel', label: this.filters.riskLevel })
      return selected
    }
  },
  watch: {
    '$route.query.q': {
      immediate: true,
      handler (value) {
        if (value != null) this.filters.keyword = String(value)
      }
    },
    '$locale' () { this.loadProducts() }
  },
  created () { this.loadProducts() },
  methods: {
    localized (value) {
      if (!value || typeof value !== 'object') return value || this.$t('commonNotAvailable')
      return value[this.$locale] || this.$t('commonNotAvailable')
    },
    formatNumber (value) {
      const number = Number(value)
      return Number.isFinite(number) ? number.toLocaleString() : value
    },
    async loadProducts () {
      const requestSequence = ++this.requestSequence
      this.state = 'loading'
      try {
        const query = {
          ...this.filters,
          currency: String(this.filters.currency || '').toUpperCase(),
          fundType: this.activeType === 'ALL' ? this.filters.fundType : this.activeType,
          page: this.page,
          pageSize: this.pageSize,
          locale: this.$locale
        }
        const result = await products.list(query)
        if (requestSequence !== this.requestSequence) return
        this.products = result.items
        this.total = result.total
        this.state = this.products.length ? 'success' : 'empty'
      } catch (error) {
        if (requestSequence !== this.requestSequence) return
        this.products = []
        this.total = 0
        this.state = 'error'
      }
    },
    changeType () {
      this.filters.fundType = ''
      this.page = 1
      this.loadProducts()
    },
    chooseFilter (key, value) {
      this.filters[key] = value
      this.search()
    },
    changeCurrency (value) {
      this.filters.currency = String(value || '').toUpperCase()
      this.search()
    },
    search () {
      this.page = 1
      this.loadProducts()
    },
    resetFilters () {
      this.activeType = 'ALL'
      this.filters = { keyword: '', fundType: '', region: '', currency: '', riskLevel: '' }
      this.search()
    },
    changePage (page) {
      this.page = page
      this.loadProducts()
    },
    changePageSize (pageSize) {
      this.page = 1
      this.pageSize = pageSize
      this.loadProducts()
    },
    goTrade (product) {
      this.$router.push({ path: '/trade-info/aggregation/index', query: { fundId: product.fundId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.fund-page-header { min-height: 30px; }
.fund-page-header strong { font-size: 16px; font-weight: 600; line-height: 30px; }
.fund-products-page { width: 100%; }
.fund-category-bar { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; border-bottom: 1px solid; @include borderColor(A13); }
.fund-type-tabs { flex: 1; min-width: 0; }
.fund-type-tabs ::v-deep .el-tabs__header { margin-bottom: 0; }
.fund-type-tabs ::v-deep .el-tabs__nav-wrap { padding-left: 16px; }
.fund-currency-switch { display: flex; align-items: center; min-height: 40px; padding-right: 16px; white-space: nowrap; }
.fund-currency-switch ::v-deep .el-radio-button__inner { min-width: 80px; height: 28px; padding: 7px 14px; border-radius: 0; font-size: 12px; line-height: 12px; }
.filter-label { margin-right: 8px; font-size: 12px; }
.fund-filter-panel { padding: 12px 16px 0; border-bottom: 1px solid; @include borderColor(A13); }
.fund-filter-panel ::v-deep .el-form-item { margin-bottom: 12px; }
.fund-filter-panel ::v-deep .el-form-item__label { color: inherit; font-size: 12px; }
.fund-filter-panel ::v-deep .el-input { width: 240px; }
.fund-filter-panel ::v-deep .el-select .el-input { width: 180px; }
.selected-row { display: flex; align-items: center; justify-content: space-between; min-height: 42px; padding: 0 16px; border-bottom: 1px solid; @include borderColor(A13); font-size: 12px; }
.selected-summary { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.selected-summary ::v-deep .el-tag { border-radius: 0; }
.list-actions { opacity: .72; }
.fund-data-table { width: 100%; font-size: 12px; }
.fund-data-table ::v-deep th.el-table__cell { height: 40px; padding: 6px 0; font-weight: 500; }
.fund-data-table ::v-deep td.el-table__cell { height: 46px; padding: 6px 0; }
.fund-name-link { display: block; max-width: 100%; overflow: hidden; padding: 0; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.fund-code, .cell-minor { display: block; margin-top: 2px; opacity: .62; font-size: 11px; }
.nav-value { font-size: 15px; font-style: italic; }
.cell-currency { opacity: .62; font-size: 11px; }
.fund-empty, .fund-page-state { padding: 48px 20px; text-align: center; }
.fund-page-state i { font-size: 28px; }
.fund-pagination { display: flex; justify-content: flex-end; padding: 14px 8px; }
@media (max-width: 1000px) {
  .fund-category-bar { display: block; }
  .fund-currency-switch { padding: 8px 16px; }
}
</style>
