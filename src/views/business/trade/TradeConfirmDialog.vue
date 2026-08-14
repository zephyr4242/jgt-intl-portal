<template>
  <el-dialog
    :title="$t('tradeConfirmTitle')"
    width="560px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    @closed="afterClosed"
  >
    <div class="trade-warning">
      <i class="el-icon-warning-outline" />
      <div>
        <strong>{{ $t('tradeInstructionNoticeTitle') }}</strong>
        <p>{{ $t('tradeInstructionNotice') }}</p>
      </div>
    </div>
    <el-descriptions v-if="summary" :column="1" border size="small">
      <el-descriptions-item :label="$t('tradeAccount')">{{ summary.tradeAccountId }}</el-descriptions-item>
      <el-descriptions-item :label="$t('tradeFund')">{{ summary.fundCode }} - {{ summary.fundName }}</el-descriptions-item>
      <el-descriptions-item :label="$t('tradeDirection')">{{ $t(summary.side === 'REDEEM' ? 'tradeDirRedeem' : 'tradeDirSubscribe') }}</el-descriptions-item>
      <el-descriptions-item :label="$t(summary.side === 'REDEEM' ? 'tradeRedeemShares' : 'tradeSubscribeAmount')">
        {{ summary.value }} {{ summary.side === 'REDEEM' ? $t('tradeSharesUnit') : summary.currency }}
      </el-descriptions-item>
      <el-descriptions-item v-if="summary.remark" :label="$t('tradeRemark')">{{ summary.remark }}</el-descriptions-item>
    </el-descriptions>
    <el-checkbox v-model="riskAccepted" class="risk-confirm">{{ $t('tradeRiskConfirm') }}</el-checkbox>
    <div slot="footer">
      <el-button @click="cancel">{{ $t('commonCancel') }}</el-button>
      <el-button type="primary" :disabled="!riskAccepted" @click="confirm">{{ $t('tradeConfirmSubmit') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TradeConfirmDialog',
  props: {
    visible: { type: Boolean, default: false },
    summary: { type: Object, default: null }
  },
  data () {
    return { dialogVisible: false, riskAccepted: false, confirmed: false }
  },
  watch: {
    visible: {
      immediate: true,
      handler (value) {
        this.dialogVisible = value
        if (value) {
          this.riskAccepted = false
          this.confirmed = false
        }
      }
    },
    dialogVisible (value) { this.$emit('update:visible', value) }
  },
  methods: {
    confirm () {
      if (!this.riskAccepted) return
      this.confirmed = true
      this.dialogVisible = false
      this.$emit('confirm')
    },
    cancel () {
      if (!this.confirmed) this.$emit('cancel')
      this.dialogVisible = false
    },
    afterClosed () {
      this.riskAccepted = false
      this.confirmed = false
    }
  }
}
</script>

<style lang="scss" scoped>
.trade-warning { display: flex; gap: 12px; margin-bottom: 18px; padding: 14px; @include color(A23); @include backgroundColor(A10O1); border: 1px solid; @include borderColor(A10); border-radius: 0; }
.trade-warning i { margin-top: 2px; font-size: 20px; }
.trade-warning p { margin: 6px 0 0; line-height: 1.6; }
.risk-confirm { margin-top: 18px; white-space: normal; }
</style>
