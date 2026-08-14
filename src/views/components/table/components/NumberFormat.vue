<template>
  <div
    v-bind="$attrs"
    :class="{
      red: showRed,
      green: showGreen
    }"
    :style="{ textAlign: textAlign }"
    class="numberFormat-wrap"
  >
    <div class="numberFormat-wrap-box">
      <span>{{ prefix }}{{ str }}{{ unit }}{{ suffix }}</span>
      <jy-hint v-if="isFundClearFlag" icon="iconfont-qingcang" fontSize="16px"
        placement="top-end" :offset="-10" class="jgt-vb iconfont-qingcang-box" >
        持有人已经申请赎回该产品的全部持仓份额，但可能会因管理人部分确认、 红利再投<br />等原因导致持仓份额无法全部赎净。最终以注册登记机构确认为准。
      </jy-hint>
    </div>
    <p v-if="prop.column.prop1" class="multiLinep">{{prop.row[prop.column.prop1] || '--'}}</p>
  </div>
</template>
<script>
import util from '@/libs/util'
import jyHint from '@/components/jy-hint'
export default {
  name: 'NumberFormat',
  components: { jyHint },
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
      str: '',
      prefix: '',
      suffix: '',
      unit: '',
      showRed: false,
      showGreen: false,
      textAlign: 'right',
      isFundClearFlag: false
    }
  },
  computed: {},
  created () {},
  /**
   * multiply 单位换算 乘以一个换算单位 默认为1
   * precision 精度 默认为2
   * thousands 是否添加千分位 默认为不添加
   * percent 是否添加百分号 默认为不添加
   * nanText 非数字时文字  默认为--
   */
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      const settings = this.prop?.column ?? {}
      // 处理前缀 默认为空
      this.prefix = settings?.prefix ?? ''

      // 处理单位 默认为空
      this.unit = settings?.unit ? data[settings?.unit] : ''

      // 处理后缀 默认为空
      this.suffix = settings?.suffix ?? ''

      // 处理金额
      const value = settings?.prop ? data[settings?.prop] : null
      let val = value
      if (value === null || isNaN(value) || value === '') {
        this.str = settings.nanText || '--'
      } else {
        let ret = Number(value)
        const multiply = settings?.multiply ?? 1
        let precision = settings?.precision ?? 2
        const thousands = settings?.thousands ?? false
        const percent = settings?.percent ?? false

        ret = ret * multiply
        if (settings?.useRawPrecision) {
          // 使用原生小数位数
          const rawPrecision = this.util.getNumberPrecision(ret)
          precision = Math.max(rawPrecision, 2)
        }

        if (precision > 0) {
          ret = ret.toFixed(precision)
        } else {
          ret = Math.round(ret)
        }
        // 将 -0转为0
        if (Number(ret) === 0) {
          ret = String(ret).replace(/-/g, '')
        }
        val = ret

        if (thousands) {
          ret = util.thousands(ret, precision)
        }
        if (percent) {
          ret = ret + '%'
        }
        this.str = ret
        if (settings?.isFundClearFlag) {
          this.isFundClearFlag = data.fundClearFlag === '1'
        }
      }

      // 处理样式
      const color = settings?.color ?? false
      if (color) {
        if (val === 0 || val === '0' || val === '0.00' || val === '0.00%') {
          this.showRed = true
        } else {
          this.showRed = val && Number(val) >= 0
          this.showGreen = val && Number(val) < 0
        }
      }
      this.textAlign = settings?.textAlign ?? 'right'
    }
  }
}
</script>
<style scoped lang="scss">
  .multiLinep{
    @include color(A8);
    cursor: default;
  }
  .numberFormat-wrap{
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .numberFormat-wrap-box{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .iconfont-qingcang-box{
    margin-left: 6px;
    &::before{
      @include color(A18);
    }
  }
</style>
