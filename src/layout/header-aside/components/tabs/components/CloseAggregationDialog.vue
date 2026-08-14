<!--
  关闭前回调-交易下单
-->
<template>
  <el-dialog :title="$t('commonTip')" width="400px" :visible.sync="visible" :before-close="cancel" class="aggregation-container">
    <p class="jgt-mb-8">{{ $t('tradeLeaveConfirm') }}</p>
    <p class="aggregation-error">*{{ $t('tradeLeaveRecordTip') }}</p>
    <div slot="footer">
      <el-button type="primary" @click="confirm">{{ $t('commonConfirm') }}</el-button>
      <el-button type="primary" plain @click="cancel">{{ $t('commonCancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  name: 'CloseAggregationDialog',
  data () {
    return {
      visible: false,
      callback: null
    }
  },
  methods: {
    init (callback) {
      this.callback = callback
      this.visible = true
    },
    confirm () {
      this.visible = false
      if (this.callback) {
        this.callback()
      }
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.aggregation-error {
  @include color(A18);
}
</style>
<style lang="scss">
.aggregation-container.el-dialog__wrapper div.el-dialog__body {
  padding: 24px 18px 32px;
  text-align: center;
}
</style>
