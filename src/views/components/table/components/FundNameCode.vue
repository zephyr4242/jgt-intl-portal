<template>
  <div v-if="prop" class="multiLineBox">
    <div class="multiLineBox-fundName" :class="columnData.propClassName">
      <template v-if="isConvert">
        <el-tooltip
          placement="top"
          class="multiLineBox-fundName-tooltip"
          :class="{'isAuto': (!isChaiDan && !isNewPro) || isConvert}"
          :disabled="false"
          :open-delay="300">
          <div slot="content">
            <div>转出：{{ rowData[columnData.prop1] || '--' }}/{{ rowData[columnData.prop] || '--' }}</div>
            <div class="el-tooltip__split-line"></div>
            <div>转入：{{ rowData[columnData.prop3] || '--' }}/{{ rowData[columnData.prop2] || '--' }}</div>
          </div>
          <div class="cell_assist text-left-force ellipsis">
            <span :class="{'multi-line-name_noLine': noOnline}">
              <span class="multi-line-name" @click="openPage('out')">
                <img :src="outImg" alt="出" class="convert_out_icon"/>
                <span class="jgt-vm jgt-ml-4">{{ rowData[columnData.prop1] }}/{{ rowData[columnData.prop] }}</span>
              </span>
            </span>
            <br>
            <span class="multi-line-name" @click="openPage('in')">
              <img :src="inImg" alt="入" class="convert_out_icon"/>
              <span class="jgt-vm jgt-ml-4">{{ rowData[columnData.prop3] }}/{{ rowData[columnData.prop2] }}</span>
            </span>
          </div>
        </el-tooltip>
      </template>
      <template v-else>
        <jy-tooltip
          :jyTooltipId="jyTooltipId"
          placement="bottom-start"
          class="multiLineBox-fundName-tooltip"
          :class="{'isAuto': (!isChaiDan && !isNewPro) || isConvert}"
          :disabled="false"
          :open-delay="300">
            <div slot="content">{{ rowData[columnData.prop] || '--' }} {{ rowData[columnData.prop1] || '--' }}</div>
            <div class="cell_assist text-left-force ellipsis" :class="{'multi-line-name_noLine': noOnline || clientDisabled}">
              <span class="multi-line-name" @click="openPage">{{rowData[columnData.prop]}}</span>
            </div>
        </jy-tooltip>
      </template>
      <div>
        <div class="fund-box-flex">
          <div v-if="isChaiDan" class="chaidan-icon-box">拆单</div>
          <div v-else-if="isNewPro" class="chaidan-icon-box chaidan-icon-box2">新增</div>
          <el-tooltip v-if="isRepetition" effect="dark" :content="rowData[columnData.repetitionTipsKey]" placement="bottom-start" :open-delay="300" :enterable="false">
            <div class="repetition-icon-box jgt-ml-4">重复</div>
          </el-tooltip>
          <jyHint
            v-if="noOnline && isConvert"
            class="gaofengxianbeifen jgt-ml-4"
            fontSize="12px"
            icon="iconfont-guitaijiaoyi">
            该产品为柜台交易，请前往柜台查看详情
          </jyHint>
          <jyHint
            v-if="isOffShoreFlag && isConvert"
            class="importance-currency-icon jgt-ml-4"
            fontSize="12px"
            icon="iconfont-lianjijin"
            placement="bottom-start"
            :offset="-10">
            由于产品投资标的涉及离岸市场，当前该市场为非交易时间，<br/>您的交易可能被确认失败，敬请谅解。
          </jyHint>
        </div>
        <div class="fund-box-flex" v-if="isConvert">
          <jyHint
            v-if="isHeightRisk"
            class="gaofengxianbeifen"
            fontSize="12px"
            icon="iconfont-gaofengxianbeifen"
            placement="bottom">
            高风险
          </jyHint>
          <jyHint
            v-if="isSpecialFundCode"
            class="gaofengxianbeifen jgt-ml-4"
            fontSize="12px"
            icon="iconfont-zhushi"
            placement="bottom-start"
            :offset="-10">
            本基金前端收费模式下有A类、D类两类份额，两类份额的申购费和赎回费<br/>有差异，具体请参考本基金招募说明书和基金产品资料概要。
          </jyHint>
          <jyHint
            v-if="isImportanceCurrency"
            class="importance-currency-icon jgt-ml-4"
            fontSize="12px"
            icon="iconfont-zhongyaohuobi"
            placement="bottom-start"
            :offset="-10">
            重要货币市场基金是指因基金资产规模较大或者投资者人数较多、与其他金融机构或者金融产品<br/>关联性较强，如发生重大风险，可能对资本市场和金融体系产生重大不利影响的货币市场基金。
          </jyHint>
          <jyHint
            v-if="isOtherOffShoreFlag"
            class="importance-currency-icon jgt-ml-4"
            fontSize="12px"
            icon="iconfont-lianjijin"
            placement="bottom-start"
            :offset="-10">
            由于产品投资标的涉及离岸市场，当前该市场为非交易时间，<br/>您的交易可能被确认失败，敬请谅解。
          </jyHint>
        </div>
      </div>
    </div>
    <div class="multiLineSpan2" :class='columnData.prop1ClassName' v-if="columnData.prop1 && !isConvert">
      <span>{{rowData[columnData.prop1]}}</span>
      <span v-if="rowData.tips">
        <jyHint :disabled="!rowData.tips" placement="top-start" :offset="10">
          {{rowData.tips}}
        </jyHint>
      </span>
      <jyHint
        v-if="noOnline"
        class="gaofengxianbeifen"
        fontSize="12px"
        icon="iconfont-guitaijiaoyi">
        该产品为柜台交易，请前往柜台查看详情
      </jyHint>
      <jyHint
        v-if="isHeightRisk"
        class="gaofengxianbeifen"
        fontSize="12px"
        icon="iconfont-gaofengxianbeifen"
        placement="bottom">
        高风险
      </jyHint>
      <jyHint
        v-if="isSpecialFundCode"
        class="gaofengxianbeifen"
        fontSize="12px"
        icon="iconfont-zhushi"
        placement="bottom-start"
        :offset="-10">
        本基金前端收费模式下有A类、D类两类份额，两类份额的申购费和赎回费<br/>有差异，具体请参考本基金招募说明书和基金产品资料概要。
      </jyHint>
      <jyHint
        v-if="isImportanceCurrency"
        class="importance-currency-icon"
        fontSize="12px"
        icon="iconfont-zhongyaohuobi"
        placement="bottom-start"
        :offset="-10">
        重要货币市场基金是指因基金资产规模较大或者投资者人数较多、与其他金融机构或者金融产品<br/>关联性较强，如发生重大风险，可能对资本市场和金融体系产生重大不利影响的货币市场基金。
      </jyHint>
      <jyHint
        v-if="isOffShoreFlag"
        class="importance-currency-icon"
        fontSize="12px"
        icon="iconfont-lianjijin"
        placement="bottom-start"
        :offset="-10">
        由于产品投资标的涉及离岸市场，当前该市场为非交易时间，<br/>您的交易可能被确认失败，敬请谅解。
      </jyHint>
    </div>
  </div>
</template>
<script>
import jyHint from '@/components/jy-hint'
import { mapState } from 'vuex'
export default {
  name: 'FundNameCode',
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
      rowData: '',
      columnData: '',
      clickName: '',
      jyTooltipId: ''
    }
  },
  computed: {
    ...mapState('d2admin/theme', [
      'list',
      'activeName'
    ]),
    isClient () {
      const isCleint = this.util.isElectron() || this.$isClient
      return isCleint || this.activeName === 'client'
    },
    noRiight () {
      const { specialFlagKey, specialFlagVal } = this.columnData
      return specialFlagVal && this.rowData[specialFlagKey] !== specialFlagVal && !this.isHeightRisk
    },
    isChaiDan () {
      const { specialFlagKey, specialFlagVal } = this.columnData
      return specialFlagVal && this.rowData[specialFlagKey] === specialFlagVal
    },
    isNewPro () {
      const { newProFlagKey, newProFlagVal } = this.columnData
      return newProFlagVal && this.rowData[newProFlagKey] === newProFlagVal
    },
    /**
     * 是否显示【重复】标签(目前聚合交易用到)
     * @return {boolean}
     */
    isRepetition () {
      const { repetitionKey, repetitionVal } = this.columnData
      return repetitionVal && this.rowData[repetitionKey] === repetitionVal
    },
    /**
     * 是否启用显示特殊收费模式浮层
     */
    isSpecialFundCode () {
      if (this.columnData.isSpecialFundCode) {
        const fundCode = this.isConvert ? this.rowData[this.columnData.prop3] : this.rowData[this.columnData.prop1]
        if (fundCode && window.CONFIG?.TRADE_TIPS_SPECIAL_FUND_CODE) {
          return window.CONFIG.TRADE_TIPS_SPECIAL_FUND_CODE.indexOf(fundCode) !== -1
        }
      }
      return false
    },
    isHeightRisk () {
      const { fundRiskLevelKey, otherFundRiskLevelKey, source } = this.columnData
      // 来源是复核
      if (source && this.isConvert) {
        return otherFundRiskLevelKey && this.rowData[otherFundRiskLevelKey] === this.constant.STR.FOUR
      }
      return (fundRiskLevelKey && this.rowData[fundRiskLevelKey] === this.constant.STR.FOUR)
    },
    noOnline () {
      const { statusName, statusVal, statusName1 } = this.columnData
      return (statusVal && this.rowData[statusName] === statusVal) || (statusName1 && this.rowData[statusName1] !== '1')
    },
    clientDisabled () {
      const { fundTypeJy1 } = this.rowData
      const { statusName, statusVal, statusName1 } = this.columnData
      const fundTypeHs = this.constant.privateFundTypeJy.includes(fundTypeJy1)
      const isNoLine = (statusVal && this.rowData[statusName] === statusVal) || (statusName1 && this.rowData[statusName1] !== '1')
      return fundTypeHs && !isNoLine && this.$isClient
    },
    isConvert () {
      const { fixBusinFlag, businFlag, originalBusinFlag, otherFundCode } = this.rowData
      const { FIXBUSINFLAG, BUSINESSCODE } = this.constant
      const { TRANSFER, CANCEL } = BUSINESSCODE
      return fixBusinFlag === FIXBUSINFLAG.STRIDE || businFlag === TRANSFER || originalBusinFlag === TRANSFER ||
        (businFlag === CANCEL && otherFundCode)
    },
    outImg () {
      return this.isClient ? require('@/assets/svg-icons/out_dark.svg') : require('@/assets/svg-icons/out.svg')
    },
    inImg () {
      return this.isClient ? require('@/assets/svg-icons/in_dark.svg') : require('@/assets/svg-icons/in.svg')
    },
    /**
     * 是否显示【重要货币】标签
     * @return {boolean}
     */
    isImportanceCurrency () {
      const { importanceCurrencyKey, importanceCurrencyVal } = this.columnData
      return importanceCurrencyKey && this.rowData[importanceCurrencyKey] === importanceCurrencyVal
    },
    isOffShoreFlag() {
      return !!this.rowData.offshoreFlag
    },
    isOtherOffShoreFlag() {
      return !!this.rowData.otherOffshoreFlag
    }
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
      this.rowData = row
      this.columnData = column
      this.clickName = column.clickName
      this.jyTooltipId = Math.random()
    },
    openPage (type) {
      // 柜台产品
      if ((this.noOnline && type !== 'in') || this.clientDisabled) {
        return false
      }
      // 没有自定义事件名
      if (!this.clickName) {
        const { fundCode, fundName, fundTypeJy1, productType, otherFundCode, otherFundTypeJy1, otherProductType } = this.rowData
        const isQSZG = type === 'in' ? otherProductType && otherProductType === '2' : productType && productType === '2'
        const fundType = type === 'in' ? otherFundTypeJy1 : fundTypeJy1
        const fofundCode = type === 'in' ? otherFundCode : fundCode
        try {
          if (this.columnData.sourceType === 'split') {
            this.$jgtSensorsTrack.fundsplitResultSingleFundClick({
              fund_code: fundCode,
              fund_name: fundName,
              button_name: '产品名称'
            })
          }
        } catch (error) {

        }
        this.util.gotoProduct(fofundCode, isQSZG || fundType)
        return false
      }
      this.$emit(this.clickName || this.openPage, this.rowData)
    }
  }
}
</script>
<style scoped lang="scss">
// 多行展示默认样式
.multiLineBox{
  width: 100%;
  .multiLineBox-fundName{
    position: relative;
    display: flex;
    .convert_out_icon{
      width: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    .multiLineBox-fundName-tooltip{
      width: calc(100% - 30px);
      .multi-line-name{
        @include color(A10);
        line-height: 16px;
        padding-bottom: 1px;
        margin-right: 4px;
        font-size: 14px;
        &:hover{
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
    .isAuto{
      width: 100%;
    }
    .multi-line-name_noLine{
      .multi-line-name{
        @include color(A6);
        &:hover{
          cursor: default;
          text-decoration: none;
        }
      }
    }
    .chaidan-icon-box {
      vertical-align: middle;
      text-align: center;
      height: 17px;
      line-height: 16px;
      padding: 0 2px;
      @include color(A10);
      border: 1px solid;
      @include borderColor(A10);
      @include borderImage(A24, 0, 1 round);
      width: 30px;
      box-sizing: border-box;
      @include backgroundImage(A24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .repetition-icon-box {
      vertical-align: middle;
      text-align: center;
      min-width: 32px;
      height: 16px;
      line-height: 16px;
      padding: 0 4px;
      @include color(A18);
      @include backgroundColor(A18O1);
      box-sizing: border-box;
      border-radius: 2px;
    }
  }
  .multiLineSpan2{
    @include color(A8);
    cursor: default;
    display: flex;
    align-items: center;
    span{
      vertical-align: middle;
      height: 16px;
      line-height: 16px;
      margin-right: 4px;
    }
    .gaofengxianbeifen, .importance-currency-icon {
      vertical-align: middle;
      text-align: center;
      margin-right: 2px;
      i{
        font-size: 12px !important;
      }
    }
  }
  .importance-currency-icon {
    @include color(A23);
  }
  // 注册机构
  .registrationAgency{
    @include color(A6);
    cursor: default;
    &:hover{
      text-decoration: none;
    }
  }
}
</style>
<style lang="scss">
.fund-box-flex {
  display: flex;
  justify-content: flex-end;
  height: 18px;
  min-width: 1px;
}
</style>
