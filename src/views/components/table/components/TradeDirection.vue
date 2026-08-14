<!--
  交易方向
-->
<template>
  <div class="trade-direction-container">
    <div>{{ directionName }}</div>
    <p v-if="directionSubclass">{{ directionSubclass }}</p>
  </div>
</template>
<script>
export default {
  name: 'TradeDirection',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    directionName () {
      return this.prop?.row?.businFlagName || '--'
    },
    directionSubclass () {
      const transferType = this.prop?.row?.transferType
      if (transferType === '1') {
        return '实时'
      } else if (transferType === '2') {
        return '非实时'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.trade-direction-container {
  div {
    @include color(A6);
  }
  p {
    @include color(A21);
  }
}
</style>
