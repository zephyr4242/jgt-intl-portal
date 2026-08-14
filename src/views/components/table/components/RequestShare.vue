<!--
  申请金额/份额
-->
<template>
  <div class="request-number">
    <div style="font-size: 13px"><span v-html="requestNumber"></span><span class="jgt-ml-5" v-if="requestUnit">{{ requestUnit }}</span></div>
    <div class="request-icon">
      <jy-hint
        v-if="isRedeem"
        icon="iconfont-feishuaishuoming"
        fontSize="16px"
        themeType="gradient"
        placement="bottom-end"
        :offset="10"
      >
        该笔交易选择了全部份额，您的实际赎回份额会高于当前<br/>持仓份额（实际赎回份额含当日确认的结转收益份额）
      </jy-hint>
      <jy-hint
        class="iconfont-qingcang-box"
        v-if="!isRedeem && isFundClearFlag"
        icon="iconfont-qingcang"
        fontSize="16px"
        placement="bottom-end"
        :offset="10"
      >
        持有人已经申请赎回/转出该产品的全部持仓份额，但可能会因管理人部分确认、红利再投等原因导致持仓份额无法全部赎净。最终以注册登记机构确认为准。
      </jy-hint>
      <jy-hint
        v-if="limitTips"
        class="request-icon-overrun jgt-ml-4"
        icon="iconfont-chaoxiantishi"
        fontSize="16px"
        placement="bottom-end"
        :offset="10"
      >
        <div v-html="limitTips"/>
      </jy-hint>
    </div>
  </div>
</template>
<script>
import jyHint from '@/components/jy-hint'
export default {
  name: 'TradeDirection',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  components: {
    jyHint
  },
  computed: {
    // 是否全赎
    isRedeem () {
      return this.prop?.row.redeemFlag === '1'
    },
    // 是否清仓
    isFundClearFlag () {
      return this.prop?.row.fundClearFlag === '1'
    },
    // 超限提示
    limitTips () {
      let { limitFlag, todayTotalBala, oneDayMaxBala, totalBala, accoMaxBala } = this.prop?.row
      todayTotalBala = this.util.thousands(todayTotalBala)
      oneDayMaxBala = this.util.thousands(oneDayMaxBala)
      totalBala = this.util.thousands(totalBala)
      accoMaxBala = this.util.thousands(accoMaxBala)
      let tips = ''
      if (limitFlag === '1' || limitFlag === '3') {
        tips += `<p>您${this.dateFmt}累计购买金额为${todayTotalBala}元，超过该产品的单日购买上限${oneDayMaxBala}元。</p>`
      }
      if (limitFlag === '2' || limitFlag === '3') {
        tips += `<p>您${this.dateFmt}累计购买金额为${todayTotalBala}元，持仓最新市值及其他在途购买金额共（预估）：${totalBala}元，合计超过该产品的单账户上限${accoMaxBala}元。</p>`
      }
      return tips
    },
    /**
     * 日期格式化
     */
    dateFmt () {
      const { transferType, transferInDate } = this.prop?.row
      if (transferType && transferType === '2' && transferInDate) {
        return this.util.fmtDate(transferInDate)
      }
      return '今日'
    },
    /**
     * 获取单位状态
     */
    unitState () {
      const { businFlag } = this.prop?.row
      if (businFlag === '022' || businFlag === '020') {
        // 认申购
        return '1'
      } else if (businFlag === '024' || businFlag === '036') {
        // 赎回、转换显示份额
        return '2'
      }
      return '3'
    },
    // 申请金额/份额
    requestNumber () {
      const { requestBala, requestShare } = this.prop?.row
      if (this.unitState === '1') {
        return this.util.numberQuantile(requestBala)
      } else if (this.unitState === '2') {
        return this.util.numberQuantile(requestShare)
      }
      return '--'
    },
    // 单位
    requestUnit () {
      if (this.unitState === '1') {
        return '元'
      } else if (this.unitState === '2') {
        return '份'
      }
      return ''
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
  .iconfont-qingcang-box{
    &::before{
      @include color(A18);
    }
  }
}
</style>
