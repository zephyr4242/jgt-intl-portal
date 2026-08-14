<template>
  <d2-container class="biz-shell">
    <div class="biz-page" v-loading="loading">
      <h1 class="biz-title">{{ $t('tcTitle') }}</h1>
      <p class="biz-sub">{{ $t('tcSub') }}</p>

      <div class="biz-stats">
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('tcStatTotal') }}</div>
          <div class="biz-stat__val">{{ trades.length }}</div>
        </div>
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('tcStatPending') }}</div>
          <div class="biz-stat__val is-danger">{{ pendingCount }}</div>
        </div>
        <div class="biz-stat">
          <div class="biz-stat__lbl">{{ $t('tcStatConfirmed') }}</div>
          <div class="biz-stat__val is-ok">{{ confirmedCount }}</div>
        </div>
      </div>

      <div v-if="!trades.length" class="biz-empty">
        <div class="biz-empty__ico">📋</div>
        <p>{{ $t('tcEmpty') }}</p>
        <el-button type="primary" class="biz-primary-btn" @click="$router.push('/trade-info/aggregation/index')">
          {{ $t('tcGoTrade') }}
        </el-button>
      </div>

      <div v-else class="biz-card">
        <div class="biz-card__hd">{{ $t('tcListTitle') }}</div>
        <el-table
          :data="displayTrades"
          stripe
          size="small"
          class="biz-table"
          style="width: 100%"
        >
          <el-table-column prop="id" :label="$t('tcColId')" min-width="130">
            <template slot-scope="{ row }">
              <span class="mono">{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tcColTime')" min-width="168">
            <template slot-scope="{ row }">{{ formatTime(row.submittedAt) }}</template>
          </el-table-column>
          <el-table-column :label="$t('tcColFund')" min-width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="fund-name">{{ fundName(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tcColDirection')" width="90">
            <template slot-scope="{ row }">
              <span :class="isRedeem(row) ? 'dir-redeem' : 'dir-sub'">
                {{ directionText(row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tcColAmount')" min-width="110">
            <template slot-scope="{ row }">
              <strong>{{ formatAmount(row.amount) }}</strong>
            </template>
          </el-table-column>
          <el-table-column prop="currency" :label="$t('tcColCurrency')" width="72" />
          <el-table-column :label="$t('tcColStatus')" width="110">
            <template slot-scope="{ row }">
              <span class="tag" :class="statusClass(row)">
                {{ statusText(row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tcColExpected')" min-width="110">
            <template slot-scope="{ row }">{{ row.expectedDays }} {{ $t('tcDays') }}</template>
          </el-table-column>
          <el-table-column :label="$t('tcColConfirmDate')" min-width="110">
            <template slot-scope="{ row }">{{ row.confirmDate || '-' }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="biz-tip">
        <span>💡</span>
        <span>{{ $t('tcTip') }}</span>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { fetchTrades } from '@/libs/intl-biz'

export default {
  name: 'tradeConfirm',
  data () {
    return { trades: [], timer: null, loading: false }
  },
  computed: {
    pendingCount () {
      return this.trades.filter(t => this.isPending(t)).length
    },
    confirmedCount () {
      return this.trades.filter(t => this.isSuccess(t)).length
    },
    displayTrades () {
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return this.trades
    }
  },
  watch: {
    '$locale' () {
      this.refresh()
    }
  },
  created () {
    this.refresh()
    this.timer = setInterval(() => this.refresh(), 2000)
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  },
  activated () {
    this.refresh()
  },
  methods: {
    async refresh () {
      try {
        this.trades = await fetchTrades(this.$locale)
      } catch (e) {
        // keep last list
      }
    },
    fundName (row) {
      return row.fundName || row.fundId || row.fundCode || '-'
    },
    isRedeem (row) {
      return row.directionCode === '1' || row.direction === '赎回' || row.direction === '贖回'
    },
    isPending (row) {
      return row.statusCode === '9' || row.status === '待确认' || row.status === '待確認' || row.status === 'Pending'
    },
    isSuccess (row) {
      return row.statusCode === '1' || row.status === '确认成功' || row.status === '確認成功' || row.status === 'Confirmed'
    },
    isFail (row) {
      return row.statusCode === '0' || row.status === '确认失败' || row.status === '確認失敗' || row.status === 'Failed'
    },
    isPartial (row) {
      return row.statusCode === '2' || row.status === '部分确认' || row.status === '部分確認' || row.status === 'Partially Confirmed'
    },
    directionText (row) {
      return this.isRedeem(row) ? this.$t('tradeDirRedeem') : this.$t('tradeDirSubscribe')
    },
    statusText (row) {
      if (this.isSuccess(row)) return this.$t('tcStatusSuccess')
      if (this.isPartial(row)) return this.$t('tcStatusPartial')
      if (this.isFail(row)) return this.$t('tcStatusFail')
      return this.$t('tcStatusPending')
    },
    statusClass (row) {
      if (this.isSuccess(row)) return 'tag-ok'
      if (this.isPartial(row)) return 'tag-ok'
      if (this.isFail(row)) return 'tag-pending'
      return 'tag-pending'
    },
    formatAmount (val) {
      const n = Number(val)
      return Number.isNaN(n) ? val : n.toLocaleString()
    },
    formatTime (iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return iso
      return d.toLocaleString(this.$locale === 'en' ? 'en-US' : 'zh-CN')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';

.dir-sub { color: #c41e3a; font-weight: 500; }
.dir-redeem { color: #0958d9; font-weight: 500; }
.fund-name { font-weight: 500; color: #1a2d4a; }

.biz-primary-btn {
  margin-top: 12px;
  background: #c41e3a !important;
  border-color: #c41e3a !important;
}
</style>

<style lang="scss">
@import '../styles/biz-table.scss';
</style>
