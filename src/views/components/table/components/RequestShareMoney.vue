<!--
  申请金额/份额
-->
<template>
  <div class="request-number">
    <div style="font-size: 13px"><span v-html="requestNumber"></span><span class="jgt-ml-5" v-if="requestUnit">{{ requestUnit }}</span></div>
  </div>
</template>
<script>
export default {
  name: 'RequestShareMoney',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  components: {
  },
  computed: {
    // 申请金额/份额
    requestNumber () {
      const { row, column } = this.prop
      const { prop } = column
      return row[prop] ? this.util.numberQuantile(row[prop]) : '--'
    },
    requestUnit() {
      return this.prop.column?.requestUnit || ''
    }
  }
}
</script>
<style lang="scss" scoped>
.request-number {
  @include color(A6);
  text-align: right;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .request-icon {
    width: 36px;
    display: flex;
    align-items: flex-start;
    margin-left: 4px;
  }
  .request-icon-overrun {
    @include color(A18);
  }
}
</style>
