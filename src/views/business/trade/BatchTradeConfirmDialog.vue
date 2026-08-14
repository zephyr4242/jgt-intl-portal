<template>
  <el-dialog
    :title="$t('batchConfirmTitle')"
    :visible.sync="dialogVisible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @closed="riskAccepted = false"
  >
    <div class="batch-confirm-notice">
      <strong>{{ $t('tradeInstructionNoticeTitle') }}</strong>
      <p>{{ $t('batchConfirmNotice') }}</p>
    </div>
    <el-descriptions :column="1" border size="small">
      <el-descriptions-item :label="$t('batchValidRows')">{{ total }}</el-descriptions-item>
      <el-descriptions-item :label="$t('batchAccountsCount')">{{ accountCount }}</el-descriptions-item>
      <el-descriptions-item :label="$t('batchCurrencies')">{{ currencies.join(' / ') }}</el-descriptions-item>
    </el-descriptions>
    <el-checkbox v-model="riskAccepted" class="batch-confirm-check">
      {{ $t('tradeRiskConfirm') }}
    </el-checkbox>
    <div slot="footer">
      <el-button @click="dialogVisible = false">{{ $t('commonCancel') }}</el-button>
      <el-button type="primary" :disabled="!riskAccepted" @click="confirm">
        {{ $t('batchConfirmSubmit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'BatchTradeConfirmDialog',
  props: {
    visible: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    accountCount: { type: Number, default: 0 },
    currencies: { type: Array, default: () => [] }
  },
  data () {
    return { riskAccepted: false }
  },
  computed: {
    dialogVisible: {
      get () { return this.visible },
      set (value) { this.$emit('update:visible', value) }
    }
  },
  methods: {
    confirm () {
      if (!this.riskAccepted) return
      this.$emit('confirm')
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-confirm-notice {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-left: 3px solid;
  @include borderColor(A10);
  @include backgroundColor(A10O1);
  font-size: 12px;
  line-height: 1.6;
}
.batch-confirm-notice p { margin: 4px 0 0; }
.batch-confirm-check { margin-top: 18px; }
</style>
