<template>
  <div :class="{'limitFlag': alignType}">
    <jy-tooltip
      :jyTooltipId="jyTooltipId"
      :content="val+(prop.column.unit || '')"
      placement="top"
      :open-delay="300">
      <div
        class="ellipsis"
        :class="{'ellipsis-pr': !isLimitFlag}"
      >
        <span class="moneyNumClass">{{val}}{{prop.column.unit || ''}}</span>
      </div>
    </jy-tooltip>
    <jyHint
      v-if="isLimitFlag"
      class="chaoxiantishi"
      fontSize="16px"
      icon="iconfont-chaoxiantishi"
      placement="top">
      <pre v-html="limitFlagTipTxt"></pre>
    </jyHint>
  </div>
</template>
<script>
import jyHint from '@/components/jy-hint'
export default {
  name: 'MoneyStr',
  components: {
    jyHint
  },
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      val: '',
      isLimitFlag: false,
      limitFlagTipTxt: '',
      alignType: false,
      limitFlagHahs: {
        '1': '单日超限',
        '2': '单账户超限',
        '3': '单日超限、单账户超限'
      },
      jyTooltipId: ''
    }
  },
  computed: {

  },
  watch: {
    prop () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      const { row, column } = this.prop
      this.val = this.util.thousands(row[column.prop], column.num)
      this.isLimitFlag = column.limitFlagName ? row[column.limitFlagName] : false
      this.alignType = column.alignType
      this.jyTooltipId = Math.random()
      if (this.isLimitFlag) {
        const tips = this.limitFlagHahs[this.isLimitFlag]
        this.limitFlagTipTxt = `您提交的购买金额已超该产品${tips}，\n可能导致交易失败`
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .moneyNumClass{
    @include color(A6);
  }
  .limitFlag{
    text-align: right;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .ellipsis-pr{
      padding-right: 18px;
    }
  }
  .chaoxiantishi{
    margin-left: 4px;
    font-size: 16px;
    @include color(A18);
    &:hover{
      @include color(A18);
      opacity: 0.8;
    }
  }
</style>
