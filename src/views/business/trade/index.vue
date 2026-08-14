<template>
  <d2-container class="trade-shell">
    <template slot="header"><div class="trade-page-title"><strong>{{ $t('navTrade') }}</strong></div></template>
    <div class="trade-wrap">
      <div class="trade-page">
        <p class="trade-sub">{{ $t('tradeSub') }}</p>

        <div v-if="productsState === 'error'" class="trade-error">
          <p>{{ $t('productsLoadFailed') }}</p>
          <el-button type="primary" plain @click="loadProducts">{{ $t('commonRetry') }}</el-button>
        </div>

        <div v-else class="trade-card" v-loading="productsState === 'loading'">
          <div class="trade-card__hd">
            <span>{{ $t('tradeFormTitle') }}</span>
            <el-radio-group v-model="orderMode" size="mini">
              <el-radio-button label="single">{{ $t('tradeModeSingle') }}</el-radio-button>
              <el-radio-button label="batch">{{ $t('tradeModeBatch') }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="trade-card__bd">
            <el-form v-if="orderMode === 'single'" ref="form" class="single-trade-form" :model="form" :rules="rules" label-position="top" @submit.native.prevent>
              <el-form-item class="grid-half" :label="$t('tradeAccount')">
                <el-input :value="tradeAccountLabel" disabled />
              </el-form-item>
              <el-form-item class="grid-half" :label="$t('tradeDirection')" prop="side">
                <el-select v-model="form.side" class="trade-full" @change="onSideChange">
                  <el-option :label="$t('tradeDirSubscribe')" value="SUBSCRIBE" />
                  <el-option :label="$t('tradeDirRedeem')" value="REDEEM" />
                </el-select>
              </el-form-item>
              <el-form-item class="grid-full" :label="$t('tradeFund')" prop="fundId">
                <el-select v-model="form.fundId" class="trade-full" filterable :placeholder="$t('tradeFundPh')" @change="onFundChange">
                  <el-option
                    v-for="fund in eligibleFunds"
                    :key="fund.fundId"
                    :label="`${fund.fundCode} - ${localized(fund.name)}`"
                    :value="fund.fundId"
                  />
                </el-select>
              </el-form-item>

              <div v-if="selectedFund" class="trade-fund-info grid-full">
                <div>{{ localized(selectedFund.name) }}</div>
                <span>{{ $t('tradeNavLabel') }}: {{ selectedFund.nav == null ? $t('commonNotAvailable') : selectedFund.nav }}</span>
                <span>{{ $t('tradeMinInvestLabel') }}: {{ minimumText }}</span>
                <span v-if="form.side === 'REDEEM'">{{ $t('tradeAvailableShares') }}: {{ availableShares }}</span>
              </div>

              <div class="trade-row grid-full">
                <el-form-item :label="$t(form.side === 'REDEEM' ? 'tradeRedeemShares' : 'tradeSubscribeAmount')" prop="value">
                  <el-input v-model.trim="form.value" inputmode="decimal" :placeholder="$t(form.side === 'REDEEM' ? 'tradeSharesPh' : 'tradeAmountPh')" :disabled="redeemAll" />
                  <el-checkbox v-if="form.side === 'REDEEM'" v-model="redeemAll" :disabled="!canRedeem" @change="toggleRedeemAll">
                    {{ $t('tradeRedeemAll') }}
                  </el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('tradeCurrency')">
                  <el-input :value="form.currency || $t('commonNotAvailable')" disabled />
                </el-form-item>
              </div>

              <el-form-item class="grid-full" :label="$t('tradeRemark')" prop="remark">
                <el-input v-model.trim="form.remark" type="textarea" :rows="3" maxlength="500" show-word-limit :placeholder="$t('tradeRemarkPh')" />
              </el-form-item>

              <div class="trade-hint grid-full">
                <i class="el-icon-time" />
                <span>{{ $t('tradeManualHint') }}</span>
              </div>

              <div v-if="resultUnknown" class="trade-unknown grid-full">
                <strong>{{ $t('tradeResultUnknownTitle') }}</strong>
                <p>{{ $t('tradeResultUnknown') }}</p>
                <el-button type="primary" plain size="small" @click="goTransactions">{{ $t('tradeViewRecords') }}</el-button>
              </div>

              <el-button type="primary" class="trade-submit grid-full" :loading="submitting" :disabled="submitting || resultUnknown || !tradeAccountId" @click="prepareSubmit">
                {{ $t('tradeSubmit') }}
              </el-button>
            </el-form>

            <div v-else class="batch-trade">
              <div class="batch-toolbar">
                <div class="batch-toolbar__copy">
                  <strong>{{ $t('batchTradeTitle') }}</strong>
                  <span>{{ $t('batchTradeDescription', { max: maxBatchRows }) }}</span>
                </div>
                <div class="batch-toolbar__actions">
                  <el-button icon="el-icon-download" plain @click="downloadBatchTemplate">{{ $t('batchDownloadTemplate') }}</el-button>
                  <el-upload
                    :key="batchUploadKey"
                    action="#"
                    accept=".xlsx,.xls"
                    :auto-upload="false"
                    :show-file-list="false"
                    :disabled="batchSubmitting || !tradeAccounts.length"
                    :on-change="handleBatchFile"
                  >
                    <el-button type="primary" icon="el-icon-upload2" :disabled="batchSubmitting || !tradeAccounts.length">
                      {{ $t('batchSelectFile') }}
                    </el-button>
                  </el-upload>
                </div>
              </div>

              <div v-if="!batchRows.length" class="batch-empty">
                <i class="jgt-iconfont iconfont-a-Excelshangchuan3" />
                <div>
                  <strong>{{ $t('batchEmptyTitle') }}</strong>
                  <p>{{ $t('batchEmptyDescription') }}</p>
                </div>
              </div>

              <template v-else>
                <div class="batch-file-bar">
                  <span><i class="el-icon-document" /> {{ batchFileName }}</span>
                  <span>{{ $t('batchTotalRows') }} <strong>{{ batchRows.length }}</strong></span>
                  <span class="is-valid">{{ $t('batchValidRows') }} <strong>{{ batchValidCount }}</strong></span>
                  <span :class="{ 'is-error': batchInvalidCount }">{{ $t('batchInvalidRows') }} <strong>{{ batchInvalidCount }}</strong></span>
                  <el-button type="text" :disabled="batchSubmitting" @click="resetBatch">{{ $t('commonReset') }}</el-button>
                </div>

                <el-table :data="batchRows" border stripe max-height="440" class="batch-table">
                  <el-table-column type="index" :label="$t('batchRowNumber')" width="58" align="center" />
                  <el-table-column prop="tradeAccountLabel" :label="$t('tradeAccount')" min-width="130" show-overflow-tooltip />
                  <el-table-column prop="fundCode" :label="$t('commonFundCode')" width="100" />
                  <el-table-column prop="fundName" :label="$t('commonFundName')" min-width="160" show-overflow-tooltip />
                  <el-table-column :label="$t('tradeDirection')" width="86">
                    <template slot-scope="scope">{{ scope.row.side ? $t(scope.row.side === 'REDEEM' ? 'tradeDirRedeem' : 'tradeDirSubscribe') : scope.row.sideInput }}</template>
                  </el-table-column>
                  <el-table-column prop="value" :label="$t('batchAmountShares')" width="116" align="right" />
                  <el-table-column prop="currency" :label="$t('tradeCurrency')" width="78" align="center" />
                  <el-table-column :label="$t('commonStatus')" min-width="230">
                    <template slot-scope="scope">
                      <span v-if="scope.row.valid" class="batch-status is-valid"><i class="el-icon-success" /> {{ $t('batchRowValid') }}</span>
                      <span v-else class="batch-status is-error"><i class="el-icon-error" /> {{ batchRowErrorText(scope.row) }}</span>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="trade-hint batch-hint">
                  <i class="el-icon-warning-outline" />
                  <span>{{ batchInvalidCount ? $t('batchFixInvalidRows') : $t('batchManualHint') }}</span>
                </div>

                <el-button
                  type="primary"
                  class="trade-submit batch-submit"
                  :loading="batchSubmitting"
                  :disabled="!batchCanSubmit"
                  @click="prepareBatchSubmit"
                >
                  {{ $t('batchSubmit', { count: batchValidCount }) }}
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <trade-confirm-dialog :visible.sync="confirmVisible" :summary="pendingCommand" @confirm="confirmSubmit" />
    <batch-trade-confirm-dialog
      :visible.sync="batchConfirmVisible"
      :total="batchCommands.length"
      :account-count="batchAccountCount"
      :currencies="batchCurrencies"
      @confirm="confirmBatchSubmit"
    />

    <el-dialog :title="$t('tradeAcceptedTitle')" :visible.sync="acceptedVisible" width="500px" append-to-body :close-on-click-modal="false">
      <div class="accepted-message">{{ $t('tradeAcceptedNotice') }}</div>
      <el-descriptions v-if="lastInstruction" :column="1" border size="small">
        <el-descriptions-item :label="$t('tradeColId')">{{ lastInstruction.instructionId }}</el-descriptions-item>
        <el-descriptions-item :label="$t('tradeColStatus')">{{ $t(`tradeStatus.${lastInstruction.status}`) }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer">
        <el-button @click="continueTrade">{{ $t('tradeContinue') }}</el-button>
        <el-button type="primary" @click="goTransactions">{{ $t('tradeViewRecords') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('batchResultTitle')" :visible.sync="batchResultVisible" width="760px" append-to-body :close-on-click-modal="false">
      <div class="batch-result-summary">
        <span>{{ $t('batchOutcomeAccepted') }} <strong>{{ batchOutcomeCounts.ACCEPTED }}</strong></span>
        <span>{{ $t('batchOutcomeUnknown') }} <strong>{{ batchOutcomeCounts.UNKNOWN }}</strong></span>
        <span>{{ $t('batchOutcomeFailed') }} <strong>{{ batchOutcomeCounts.FAILED }}</strong></span>
      </div>
      <div v-if="batchOutcomeCounts.UNKNOWN" class="trade-unknown">
        <strong>{{ $t('tradeResultUnknownTitle') }}</strong>
        <p>{{ $t('batchUnknownNotice') }}</p>
      </div>
      <el-table :data="batchResults" border stripe max-height="360">
        <el-table-column prop="rowNumber" :label="$t('batchExcelRow')" width="86" align="center" />
        <el-table-column prop="command.fundCode" :label="$t('commonFundCode')" width="110" />
        <el-table-column prop="command.value" :label="$t('batchAmountShares')" width="120" align="right" />
        <el-table-column prop="command.currency" :label="$t('tradeCurrency')" width="80" align="center" />
        <el-table-column :label="$t('commonStatus')" min-width="180">
          <template slot-scope="scope"><span :class="['batch-status', batchOutcomeClass(scope.row.outcome)]">{{ batchOutcomeText(scope.row) }}</span></template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="finishBatch">{{ $t('batchStartNew') }}</el-button>
        <el-button type="primary" @click="goTransactions">{{ $t('tradeViewRecords') }}</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
// Use the original repository plugins from source so both features share one
// SheetJS runtime instead of loading two pre-bundled copies on the trade page.
import pluginExport from '@d2-projects/vue-table-export/src/lib'
import pluginImport from '@d2-projects/vue-table-import/src/lib'
import { products, trades, holdings, accounts } from '@/services/intl'
import { MAX_BATCH_TRADE_ROWS, missingBatchTradeHeaders, normalizeBatchTradeRows } from '@/services/intl/batch-trade'
import TradeConfirmDialog from './TradeConfirmDialog'
import BatchTradeConfirmDialog from './BatchTradeConfirmDialog'

Vue.use(pluginExport)
Vue.use(pluginImport)

const POSITIVE_DECIMAL = /^(?:0*[1-9]\d*)(?:\.\d+)?$|^0*\.\d*[1-9]\d*$/

function compareDecimal (left, right) {
  const parse = value => {
    const match = String(value == null ? '' : value).match(/^(\d+)(?:\.(\d+))?$/)
    if (!match) return null
    return { integer: match[1].replace(/^0+(?=\d)/, ''), fraction: (match[2] || '').replace(/0+$/, '') }
  }
  const a = parse(left)
  const b = parse(right)
  if (!a || !b) return null
  if (a.integer.length !== b.integer.length) return a.integer.length > b.integer.length ? 1 : -1
  if (a.integer !== b.integer) return a.integer > b.integer ? 1 : -1
  const length = Math.max(a.fraction.length, b.fraction.length)
  const af = a.fraction.padEnd(length, '0')
  const bf = b.fraction.padEnd(length, '0')
  return af === bf ? 0 : (af > bf ? 1 : -1)
}

export default {
  name: 'trade',
  components: { TradeConfirmDialog, BatchTradeConfirmDialog },
  data () {
    return {
      productsState: 'idle',
      funds: [],
      tradeAccounts: [],
      orderMode: 'single',
      holding: null,
      redeemAll: false,
      submitting: false,
      resultUnknown: false,
      confirmVisible: false,
      acceptedVisible: false,
      pendingCommand: null,
      lastInstruction: null,
      maxBatchRows: MAX_BATCH_TRADE_ROWS,
      batchUploadKey: 0,
      batchFileName: '',
      batchRows: [],
      batchCommands: [],
      batchResults: [],
      batchSubmitting: false,
      batchConfirmVisible: false,
      batchResultVisible: false,
      form: { side: 'SUBSCRIBE', fundId: '', value: '', currency: '', remark: '' }
    }
  },
  computed: {
    ...mapState('d2admin/user', { userInfo: state => state.info || {} }),
    tradeAccountId () {
      const sessionAccounts = this.userInfo.tradeAccounts || []
      return this.userInfo.tradeAccountId || (this.tradeAccounts[0] && this.tradeAccounts[0].tradeAccountId) || (sessionAccounts[0] && sessionAccounts[0].tradeAccountId) || ''
    },
    tradeAccountLabel () {
      const sessionAccounts = this.userInfo.tradeAccounts || []
      const all = this.tradeAccounts.length ? this.tradeAccounts : sessionAccounts
      const account = all.find(item => item.tradeAccountId === this.tradeAccountId)
      return (account && (account.accountNoMasked || account.accountName)) || this.$t('commonNotAvailable')
    },
    eligibleFunds () {
      return this.funds.filter(item => item.tradableSides.includes(this.form.side))
    },
    selectedFund () {
      return this.funds.find(item => item.fundId === this.form.fundId) || null
    },
    availableShares () {
      return this.holding ? this.holding.availableShares : '0'
    },
    canRedeem () {
      return compareDecimal(this.availableShares, '0') > 0
    },
    minimumText () {
      if (!this.selectedFund || this.selectedFund.minimumSubscription == null) return this.$t('commonNotAvailable')
      return `${this.selectedFund.minimumSubscription} ${this.selectedFund.currency}`
    },
    batchValidCount () {
      return this.batchRows.filter(row => row.valid).length
    },
    batchInvalidCount () {
      return this.batchRows.length - this.batchValidCount
    },
    batchCanSubmit () {
      return Boolean(this.batchRows.length && !this.batchInvalidCount && !this.batchSubmitting && !this.batchResults.length)
    },
    batchAccountCount () {
      return new Set(this.batchCommands.map(item => item.command.tradeAccountId)).size
    },
    batchCurrencies () {
      return Array.from(new Set(this.batchCommands.map(item => item.command.currency))).sort()
    },
    batchOutcomeCounts () {
      return this.batchResults.reduce((counts, item) => {
        counts[item.outcome] += 1
        return counts
      }, { ACCEPTED: 0, UNKNOWN: 0, FAILED: 0 })
    },
    rules () {
      // Make rules reactive after a locale switch.
      // eslint-disable-next-line no-unused-expressions
      this.$locale
      return {
        side: [{ required: true, message: this.$t('tradeDirection'), trigger: 'change' }],
        fundId: [{ required: true, message: this.$t('tradeFundPh'), trigger: 'change' }],
        value: [{ validator: this.validateValue, trigger: 'blur' }],
        remark: [{ max: 500, message: this.$t('tradeRemarkTooLong'), trigger: 'blur' }]
      }
    }
  },
  watch: {
    '$locale' () { this.loadProducts() },
    '$route.query.fundId' (fundId) { this.applyPreselection(fundId) }
  },
  created () {
    this.loadTradeAccounts()
    this.loadProducts()
  },
  methods: {
    localized (value) {
      if (!value || typeof value !== 'object') return value || this.$t('commonNotAvailable')
      return value[this.$locale] || this.$t('commonNotAvailable')
    },
    async loadTradeAccounts () {
      try {
        const account = await accounts.getOrganizationAccount()
        this.tradeAccounts = account.tradeAccounts || []
        this.loadHolding()
      } catch (error) {
        this.tradeAccounts = []
      }
    },
    async loadProducts () {
      this.productsState = 'loading'
      this.funds = []
      try {
        const result = await products.list({ page: 1, pageSize: 100, locale: this.$locale })
        this.funds = result.items
        this.productsState = this.funds.length ? 'success' : 'empty'
        this.applyPreselection(this.$route.query.fundId)
      } catch (error) {
        this.productsState = 'error'
      }
    },
    applyPreselection (fundId) {
      if (!fundId || !this.funds.length) return
      const fund = this.funds.find(item => item.fundId === String(fundId))
      if (!fund) return
      this.form.fundId = fund.fundId
      this.form.currency = fund.currency
      if (!fund.tradableSides.includes(this.form.side)) this.form.side = fund.tradableSides[0]
      this.loadHolding()
    },
    onSideChange () {
      this.form.value = ''
      this.redeemAll = false
      if (this.selectedFund && !this.selectedFund.tradableSides.includes(this.form.side)) {
        this.form.fundId = ''
        this.form.currency = ''
      }
      this.loadHolding()
    },
    onFundChange () {
      this.form.value = ''
      this.redeemAll = false
      this.form.currency = this.selectedFund ? this.selectedFund.currency : ''
      this.loadHolding()
    },
    async loadHolding () {
      this.holding = null
      if (this.form.side !== 'REDEEM' || !this.form.fundId || !this.tradeAccountId) return
      try {
        const result = await holdings.list({ tradeAccountId: this.tradeAccountId, fundId: this.form.fundId, page: 1, pageSize: 1, locale: this.$locale })
        this.holding = result.items[0] || null
      } catch (error) {
        this.holding = null
      }
    },
    async loadBatchHoldings () {
      const pages = await Promise.all(this.tradeAccounts.map(account => holdings.list({
        tradeAccountId: account.tradeAccountId,
        page: 1,
        pageSize: 100,
        locale: this.$locale
      })))
      return pages.reduce((items, page) => items.concat(page.items || []), [])
    },
    downloadBatchTemplate () {
      const product = this.funds.find(item => item.minimumSubscription && item.tradableSides.includes('SUBSCRIBE'))
      const account = product && this.tradeAccounts.find(item => !item.supportedCurrencies || item.supportedCurrencies.includes(product.currency))
      if (!product || !account || !this.$export) {
        this.$message.error(this.$t('batchTemplateUnavailable'))
        return
      }
      this.$export.excel({
        columns: [
          { label: this.$t('batchTemplateAccount'), prop: 'tradeAccountId' },
          { label: this.$t('batchTemplateFundCode'), prop: 'fundCode' },
          { label: this.$t('batchTemplateSide'), prop: 'side' },
          { label: this.$t('batchTemplateValue'), prop: 'value' },
          { label: this.$t('batchTemplateCurrency'), prop: 'currency' },
          { label: this.$t('batchTemplateRemark'), prop: 'remark' }
        ],
        data: [{
          tradeAccountId: account.tradeAccountId,
          fundCode: product.fundCode,
          side: this.$t('tradeDirSubscribe'),
          value: product.minimumSubscription,
          currency: product.currency,
          remark: ''
        }],
        title: this.$t('batchTemplateFilename')
      })
    },
    async handleBatchFile (uploadFile) {
      const raw = uploadFile && uploadFile.raw
      const fileName = uploadFile && uploadFile.name ? uploadFile.name : ''
      if (!raw || !/\.xlsx?$/i.test(fileName)) {
        this.$message.error(this.$t('batchFileTypeInvalid'))
        return
      }
      if (raw.size > 5 * 1024 * 1024) {
        this.$message.error(this.$t('batchFileTooLarge'))
        return
      }
      try {
        const imported = await this.$import.xlsx(raw)
        const sourceRows = imported.results || []
        if (!sourceRows.length) throw new Error('EMPTY_FILE')
        if (sourceRows.length > MAX_BATCH_TRADE_ROWS) {
          this.$message.error(this.$t('batchTooManyRows', { max: MAX_BATCH_TRADE_ROWS }))
          return
        }
        const missing = missingBatchTradeHeaders(imported.header || [])
        if (missing.length) {
          const fields = missing.map(field => this.$t(`batchField.${field}`)).join(', ')
          this.$message.error(this.$t('batchHeadersMissing', { fields }))
          return
        }
        const batchHoldings = await this.loadBatchHoldings()
        this.batchRows = normalizeBatchTradeRows(sourceRows, {
          products: this.funds,
          tradeAccounts: this.tradeAccounts,
          holdings: batchHoldings,
          locale: this.$locale
        })
        this.batchFileName = fileName
        this.batchCommands = []
        this.batchResults = []
        if (this.batchInvalidCount) this.$message.warning(this.$t('batchImportHasErrors', { count: this.batchInvalidCount }))
        else this.$message.success(this.$t('batchImportSuccess', { count: this.batchValidCount }))
      } catch (error) {
        this.$message.error(this.$t(error && error.message === 'EMPTY_FILE' ? 'batchFileEmpty' : 'batchParseFailed'))
      }
    },
    batchRowErrorText (row) {
      return row.errors.map(error => this.$t(error.messageKey, error.params || {})).join(this.$locale === 'en' ? '; ' : '；')
    },
    resetBatch () {
      if (this.batchSubmitting) return
      this.batchUploadKey += 1
      this.batchFileName = ''
      this.batchRows = []
      this.batchCommands = []
      this.batchResults = []
    },
    prepareBatchSubmit () {
      if (!this.batchCanSubmit) return
      this.batchCommands = trades.prepareBatchCommands(this.batchRows, this.$locale)
      this.batchConfirmVisible = true
    },
    async confirmBatchSubmit () {
      if (this.batchSubmitting || !this.batchCommands.length) return
      this.batchSubmitting = true
      try {
        this.batchResults = await trades.submitBatch(this.batchCommands)
        this.batchResultVisible = true
      } catch (error) {
        this.$message.error(this.$t('batchSubmitFailed'))
      } finally {
        this.batchSubmitting = false
      }
    },
    batchOutcomeClass (outcome) {
      return outcome === 'ACCEPTED' ? 'is-valid' : (outcome === 'UNKNOWN' ? 'is-warning' : 'is-error')
    },
    batchOutcomeText (result) {
      if (result.outcome === 'ACCEPTED') return this.$t('batchOutcomeAccepted')
      if (result.outcome === 'UNKNOWN') return this.$t('batchOutcomeUnknown')
      return this.$t(result.error && result.error.messageKey ? result.error.messageKey : 'batchOutcomeFailed')
    },
    finishBatch () {
      this.batchResultVisible = false
      this.resetBatch()
    },
    toggleRedeemAll (checked) {
      this.form.value = checked ? this.availableShares : ''
      this.$nextTick(() => this.$refs.form && this.$refs.form.validateField('value'))
    },
    validateValue (rule, value, callback) {
      if (!POSITIVE_DECIMAL.test(String(value || ''))) return callback(new Error(this.$t('tradeAmountInvalid')))
      if (!this.selectedFund) return callback()
      if (this.form.side === 'SUBSCRIBE') {
        if (this.selectedFund.minimumSubscription == null) return callback(new Error(this.$t('tradeMinimumUnavailable')))
        if (compareDecimal(value, this.selectedFund.minimumSubscription) < 0) return callback(new Error(this.$t('tradeBelowMinimum', { minimum: this.minimumText })))
      } else {
        if (!this.canRedeem) return callback(new Error(this.$t('tradeNoAvailableShares')))
        if (compareDecimal(value, this.availableShares) > 0) return callback(new Error(this.$t('tradeInsufficientShares', { available: this.availableShares })))
      }
      callback()
    },
    prepareSubmit () {
      if (this.submitting || this.resultUnknown) return
      this.$refs.form.validate(valid => {
        if (!valid || !this.selectedFund) return
        const base = {
          tradeAccountId: this.tradeAccountId,
          fundId: this.selectedFund.fundId,
          fundCode: this.selectedFund.fundCode,
          side: this.form.side,
          valueType: this.form.side === 'REDEEM' ? 'SHARES' : 'AMOUNT',
          value: String(this.form.value),
          currency: this.selectedFund.currency,
          remark: this.form.remark,
          locale: this.$locale
        }
        const prepared = trades.prepareClientRequest(base)
        this.pendingCommand = { ...base, clientRequestId: prepared.clientRequestId, fundName: this.localized(this.selectedFund.name) }
        this.confirmVisible = true
      })
    },
    async confirmSubmit () {
      if (!this.pendingCommand || this.submitting) return
      this.submitting = true
      try {
        const command = { ...this.pendingCommand }
        delete command.fundName
        this.lastInstruction = await trades.submit(command)
        trades.clearClientRequest(command.clientRequestId)
        this.acceptedVisible = true
        this.pendingCommand = null
      } catch (error) {
        if (error && (error.resultUnknown || error.code === 'TRADE_RESULT_UNKNOWN')) {
          this.resultUnknown = true
          this.$message.warning(this.$t('tradeResultUnknown'))
        } else {
          trades.clearClientRequest(this.pendingCommand && this.pendingCommand.clientRequestId)
          this.$message.error(this.$t(error && error.messageKey ? error.messageKey : 'tradeSubmitFailed'))
          this.pendingCommand = null
        }
      } finally {
        this.submitting = false
      }
    },
    continueTrade () {
      this.acceptedVisible = false
      this.resultUnknown = false
      this.pendingCommand = null
      this.lastInstruction = null
      this.form.value = ''
      this.form.remark = ''
      this.redeemAll = false
      this.$nextTick(() => this.$refs.form && this.$refs.form.clearValidate())
    },
    goTransactions () {
      this.acceptedVisible = false
      this.batchResultVisible = false
      this.$router.push('/account/trade-records')
    }
  }
}
</script>

<style lang="scss" scoped>
.trade-page-title { min-height: 30px; }
.trade-page-title strong { font-size: 16px; font-weight: 600; line-height: 30px; }
.trade-wrap { padding: 0 0 38px; background: transparent; }
.trade-page { width: 100%; }
.trade-sub { margin: 0; padding: 8px 16px; border-bottom: 1px solid; @include borderColor(A13); @include color(A21); background: transparent; font-size: 12px; line-height: 20px; }
.trade-card { overflow: hidden; margin: 0; background: transparent; border: 0; border-radius: 0; }
.trade-card__hd { display: flex; align-items: center; justify-content: space-between; min-height: 32px; padding: 6px 16px; @include backgroundColor(A14); @include color(A6); font-size: 13px; font-weight: 500; }
.trade-card__bd { padding: 18px 24px; border-bottom: 1px solid; @include borderColor(A13); }
.trade-card__bd ::v-deep .single-trade-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; }
.trade-card__bd ::v-deep .el-form-item { margin-bottom: 16px; }
.trade-card__bd ::v-deep .el-form-item__label { padding-bottom: 6px; color: inherit; font-size: 12px; line-height: 18px; }
.trade-card__bd ::v-deep .el-input__inner,
.trade-card__bd ::v-deep .el-textarea__inner { border-radius: 0; }
.grid-full { grid-column: 1 / -1; }
.trade-full { width: 100%; }
.trade-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
.trade-fund-info { display: flex; flex-wrap: wrap; gap: 8px 24px; margin: -2px 0 16px; padding: 10px 12px; border-left: 3px solid currentColor; background: rgba(128, 128, 128, .1); font-size: 12px; }
.trade-fund-info div { width: 100%; font-weight: 600; }
.trade-hint, .trade-unknown { margin-bottom: 16px; padding: 10px 12px; border-radius: 0; font-size: 12px; line-height: 1.6; }
.trade-hint { border-left: 3px solid; @include borderColor(A10); @include backgroundColor(A10O1); }
.trade-unknown { @include color(A23); border: 1px solid; @include borderColor(A10); @include backgroundColor(A10O1); }
.trade-unknown p { margin: 6px 0 10px; }
.trade-submit { justify-self: end; width: 150px; border-radius: 0; }
.trade-error { margin: 16px; padding: 64px 20px; text-align: center; background: transparent; border: 1px solid rgba(128, 128, 128, .28); }
.accepted-message { margin-bottom: 16px; padding: 10px 12px; @include color(A19); border-left: 3px solid; @include borderColor(A19); @include backgroundColor(A10O1); }
.batch-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-bottom: 14px; border-bottom: 1px solid rgba(128, 128, 128, .24); }
.batch-toolbar__copy { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.batch-toolbar__copy span { font-size: 12px; line-height: 18px; opacity: .7; }
.batch-toolbar__actions { display: flex; align-items: center; flex: 0 0 auto; gap: 10px; }
.batch-empty { display: flex; align-items: center; justify-content: center; gap: 18px; min-height: 250px; color: inherit; border-bottom: 1px solid rgba(128, 128, 128, .24); }
.batch-empty > i { @include color(A10); font-size: 48px; opacity: .82; }
.batch-empty strong { font-size: 14px; }
.batch-empty p { margin: 8px 0 0; font-size: 12px; opacity: .65; }
.batch-file-bar { display: flex; align-items: center; gap: 22px; min-height: 42px; font-size: 12px; }
.batch-file-bar > span:first-child { max-width: 36%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.batch-file-bar .el-button { margin-left: auto; }
.batch-table ::v-deep .cell { font-size: 12px; }
.batch-status { line-height: 18px; }
.is-valid { @include color(A19); }
.is-warning { @include color(A23); }
.is-error { @include color(A20); }
.batch-hint { margin-top: 14px; margin-bottom: 14px; }
.batch-submit { display: block; margin-left: auto; }
.batch-result-summary { display: flex; gap: 24px; margin-bottom: 14px; padding: 10px 12px; background: rgba(128, 128, 128, .1); font-size: 12px; }
@media (max-width: 760px) {
  .trade-card__bd ::v-deep .single-trade-form { grid-template-columns: 1fr; }
  .grid-half, .grid-full { grid-column: 1; }
  .trade-row { grid-template-columns: 1fr; }
  .trade-card__hd, .batch-toolbar { align-items: flex-start; flex-direction: column; }
  .batch-toolbar__actions { flex-wrap: wrap; }
  .batch-file-bar { align-items: flex-start; flex-direction: column; gap: 6px; padding: 10px 0; }
  .batch-file-bar > span:first-child { max-width: 100%; }
  .batch-file-bar .el-button { margin-left: 0; }
}
</style>
