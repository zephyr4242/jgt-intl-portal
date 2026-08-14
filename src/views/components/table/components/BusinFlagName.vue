 <template>
  <div v-bind="$attrs">
    {{ businFlagName }}
    <span class="gray">{{ timeType }}</span>
  </div>
</template>
<script>
export default {
  name: 'CellText',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  data () {
    return {
      businFlagName: null,
      timeType: null
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const row = this.prop?.row ?? {}
      const prop = this.prop?.column?.prop || 'businFlag'
      this.convertBusinFlag(row, prop)
    },
    convertBusinFlag (row, prop) {
      if (row[prop] === this.constant.BUSINESSCODE.TRANSFER && row.fixBusinFlag === this.constant.FIXBUSINFLAG.STRIDE) {
        this.businFlagName = '超级转换'
        this.timeType = row.specialFlag === '43' ? '实时' : row.specialFlag === '06' ? '非实时' : ''
        return
      }
      switch (row[prop]) {
        case this.constant.BUSINESSCODE.OPENACCO:
          this.businFlagName = '开户'
          break
        case this.constant.BUSINESSCODE.CANCELLATION:
          this.businFlagName = '销户'
          break
        case this.constant.BUSINESSCODE.SUBSCRIPTION:
          this.businFlagName = '认购'
          break
        case this.constant.BUSINESSCODE.SUBSCRIPTIONCONFIRM_120:
          this.businFlagName = '认购行为确认'
          break
        case this.constant.BUSINESSCODE.SUBSCRIPTIONCONFIRM_130:
          this.businFlagName = '认购结果确认'
          break
        case this.constant.BUSINESSCODE.PURCHASE:
          this.businFlagName = '申购'
          break
        case this.constant.BUSINESSCODE.PURCHASECONFIRM:
          this.businFlagName = '申购确认'
          break
        case this.constant.BUSINESSCODE.REDEEM:
        case this.constant.BUSINESSCODE.ALLREDEEM:
          this.businFlagName = '赎回'
          break
        case this.constant.BUSINESSCODE.REDEEMCONFIRM:
          this.businFlagName = '赎回确认'
          break
        case this.constant.BUSINESSCODE.DIVIDENDMETHOD:
          this.businFlagName = '设置分红方式'
          break
        case this.constant.BUSINESSCODE.DIVIDENDMETHODCONFIRM:
          this.businFlagName = '设置分红方式确认'
          break
        case this.constant.BUSINESSCODE.TRANSFER:
          this.businFlagName = '普通转换'
          break
        case this.constant.BUSINESSCODE.CANCEL:
          this.businFlagName = '撤单'
          break
        case this.constant.BUSINESSCODE.TRANSFER_ENTRANCE_CONFIRM:
          this.businFlagName = '转换入确认'
          break
        case this.constant.BUSINESSCODE.TRANSFER_EXIT_CONFIRM:
          this.businFlagName = '转换出确认'
          break
        case this.constant.BUSINESSCODE.ADJUST_REDEEM:
          this.businFlagName = '强制赎回'
          break
        case this.constant.BUSINESSCODE.DIVIDEND_CONFIRM:
          this.businFlagName = '分红确认'
          break
        case this.constant.BUSINESSCODE.ADJUST_ADD:
          this.businFlagName = '强制调增'
          break
        case this.constant.BUSINESSCODE.ADJUST_SUB:
          this.businFlagName = '强制调减'
          break
        default:
          this.businFlagName = row[prop]
          break
      }
    }
  }
}
</script>
<style lang="scss">
  .gray{
    display: block;
    @include color(A8);
  }
</style>
