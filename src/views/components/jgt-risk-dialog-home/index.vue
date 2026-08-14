<template>
  <el-dialog
    v-if="visible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    :before-close="close"
    :show-close="canClose && visibleType !== 4"
    class="fap select-box-risk"
  >
      <div v-if="visibleType === 1">
        <div>
          <h1 class="risk-assessment-dialog-title">
            尊敬的投资者：
          </h1>
          <p class="risk-assessment-columns">
            根据中国证监会颁布的《证券投资基金销售适用性指导意见》以及《证券期货投资者适当性管理办法》等法规要求，上海基煜基金销售有限公司作为销售机构，为保证基金投资人的权益，落实基金投资者适当性原则，需要投资者配合完成以下风险承受能力问卷，并保证所做的选项真实、准确、完整，且当以下信息发生重要变化后，应及时更新。
          </p>
          <p class="risk-assessment-columns">
            如投资人在问卷调查中欺诈、隐瞒或有其他不实陈述导致问卷调查结果与投资实际情况不符，本公司不承担任何责任。
          </p>
        </div>
        <div class="risk-assessment-dialog-content" :class="{'jy-transfer-left-main-client': $isClient}" v-loading="loadingBox">
          <div class="questionnairep-container">
            <p class="riskTipsTxt" v-if="riskTipsTxt">{{riskTipsTxt}}</p>
            <div
              class="questionnairep-item"
              v-for="(topic, topicIndex) in riskQuestionList"
              :key="topicIndex"
            >
              <p
                :class="[
                  errorFlag && (topic.replyOptionNo === '' || !topic.replyOptionNo)
                    ? 'questionnairep-error'
                    : ''
                ]"
              >
                {{ topic.questionContent }}
              </p>
              <div
                v-for="(answer, answerIndex) in topic.riskQuestionOptionBOList"
                :key="answerIndex"
              >
                <el-radio v-model="topic.replyOptionNo" :label="answer.optionNo">{{
                  answer.optionContent
                }}</el-radio>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="visibleType === 2" ref='domRef'>
        <div>
          <h3 class="dialog-bonus-title">《投资者类型及风险匹配告知书》</h3>
          <p class="risk-assessment-columns">
            根据您填写的《投资者基本信息表》，依据相关法律、法规的规定，我司将您认定为{{evaluationRes.pubProfessionFlag == '1' ? '专业投资者': '普通投资者'}}。结合您填写的《风险测评问卷》以及其它相关信息，我司对您的风险承受能力进行了综合评估，现得到评估结果如下：
          </p>
          <p class="risk-assessment-columns">
            您的风险承受能力为：<span
              class="risk-desc"
              >{{ evaluationRes.custRiskTypeDesc }}</span
            >，依据我司的投资者与产品、服务风险等级匹配规则，您的风险承受能力等级与我司
            <span class="risk-desc">{{ evaluationRes.fundRiskType || evaluationRes.fundRiskTypeDesc }} {{showText}}</span>
             的产品和服务风险等级相匹配。
          </p>
          <p class="risk-assessment-columns">
            我司在此郑重提醒，我司向您销售的产品或提供的服务将以您的风险承受能力和投资品种、期限为基础，若您提供的信息发生任何重大变化，您应当及时以书面方式通知我司。我司建议您审慎评判自身风险承受能力、结合自身投资行为，认真填写投资品种、期限，并做出审慎的投资判断。
          </p>
        </div>
        <div class="border-dashed">
          <h3 class="dialog-bonus-title">《投资者确认函》</h3>
          <p class="risk-assessment-columns">
            本机构已仔细阅读贵司的《投资者类型及风险匹配告知书》，已充分知晓并理解贵司对本机构的风险承受能力评估及产品、服务风险等级匹配结果。本机构对该《投资者类型及风险匹配告知书》内容没有异议，愿意遵守法律、法规及贵司有关规定，通过贵司购买产品或者服务。
          </p>
          <p class="risk-assessment-columns">
            本机构承诺，将及时以书面方式如实地向贵司告知本机构的重大信息变更。
          </p>
          <p class="risk-assessment-columns">
            本确认函系本机构独立、自主、真实的意思表示。
          </p>
          <p class="confirm-check-area">
            <el-checkbox v-model="confirmResChecked">
              <span  class="confirm-check-text"> 我已阅读并确认《投资者类型及风险匹配告知书》和《投资者确认函》。</span>
            </el-checkbox>
          </p>
        </div>
      </div>
      <div v-else-if="visibleType === 3">
        <div>
          <h3 class="dialog-bonus-title">《投资者类型及风险匹配告知书》</h3>
          <p class="risk-assessment-columns">
            尊敬的投资者，根据您的风险承受调查问卷测评结果，您的风险承受能力为
            <span class="risk-desc">{{ evaluationRes.custRiskTypeDesc }}</span>，根据《基金募集机构投资者适当性管理实施指引（试行）》的规定，本公司需通过如下题目向您追加了解相关信息，以确认您是否属于
            <span class="risk-desc">{{ evaluationRes.custRiskTypeDesc }}风险承受能力中最低类别投资者</span> 。您需配合完成以下测评题目，并保证所填的选项真实、准确、完整，且当以下信息发生重要变化后，应及时更新。
          </p>
          <p class="risk-assessment-columns">
            如您在问卷调查中欺诈、隐瞒或者有其他不实陈述导致问卷调查结果与投资实际情况不符，本公司不承担任何责任。
          </p>
        </div>

        <p class="dialog-bonus-test-title">请您完成如下题目：</p>
        <p class="dialog-bonus-test-qs">
          {{ additionalQueObj.content }}
        </p>
        <div
          v-for="(item, answerIndex) in additionalQueObj.optionList"
          :key="answerIndex"
        >
          <el-radio
            class="dialog-bonus-test-as"
            v-model="riskToleranceSelector"
            :label="item.option"
            >{{ item.content }}</el-radio
          >
        </div>
      </div>
      <div v-else-if="visibleType === 4">
        <div>
          <p class="risk-assessment-columns">
            根据您的最新风险承受调查问卷调查结果，您的风险承受力调整为：<span class="risk-desc">{{custRiskName }} </span>。 根据《证券期货投资者适当性管理办法》的规定，适合您的产品类型为
            <span class="risk-desc">{{ matchFundRiskTypeName }}{{showText}}</span>  产品。请确认您在调查问卷中所做出的选项准确，并清楚了解调查方法和有关结果。
          </p>
          <p class="risk-assessment-columns">
            以上结果仅供参考，以及作为本公司对您以后的投资行为进行匹配和提示的依据。您应当在了解产品或者服务情况、听取本公司适当性意见的基础上，根据自身能力审慎决策，独立承担投资风险。本公司的适当性匹配意见不表明其对产品或者服务的风险和收益做出实质性判断或者保证。
          </p>
          <p class="risk-assessment-columns">
            特别注意：本次调整导致您当前所持有产品或服务与您最新的风险承受能力<span class="risk-desc">{{ custRiskName }}</span>发生如下不匹配情况：
          </p>
          <div class="risk-assessment-columns-box" :class="{'jy-transfer-left-main-client': $isClient}">
            <!-- <p class="risk-assessment-columns" v-for="item in notMatchData" :key="item.serialNo">
              【{{item.fundName}}】风险等级为 <span class="custRiskTypetxt">{{item.fundRiskTypeNameNow}}</span> <span class="custRiskTypeName">不匹配</span> ；
            </p> -->
            <JgtTable
              :tableTh="tableTh"
              :tableAttr="tableAttr"
              :isIndex='true'
              :isSelection="false"
              :frontend="true"
              class="classNameRisk"
              ref="jgtTable"
            >
               <!-- 内嵌展开组件示例 -->
              <template slot="mateName" slot-scope="{ row }">
                 <span class="custRiskTypeName">{{row.mateName}}</span>
              </template>
            </JgtTable>
          </div>
          <p class="risk-assessment-columns">
            我司特向您警示：继续持有上述产品或者服务，可能导致您承担超出自身承受能力的损失及不利后果。请您认真考虑相应风险，并自行作出决策。
          </p>
          <p class="confirm-risk-text">点击“确定”表示您已知悉上述内容。</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="confirm" size="medium" :loading="loading">
            {{visibleType === 2 || visibleType === 3 ? '确认同意' : visibleType === 4 ? '确定' : '提交问卷'}}
          </el-button>
          <el-button
            @click="resetRisk"
            size="medium"
            type="primary"
            v-if="visibleType !== 1 && visibleType !== 4" plain>
              {{visibleType === 2 || visibleType === 3 ? '重新测评' : ''}}
            </el-button>
        </div>
      </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import {
  queryRiskQuestion,
  submitRiskAnser,
  submitRiskToHS,
  quueryAdditionalQue,
  submitRiskConfirm,
  positionRiskTodo,
  saveTodoItem
} from '@/api/intl/legacy/bus-jgt-account'

import {
  // 问卷更新缓存接口
  cacheRefresh
} from '@/api/intl/legacy/fofund-fap'
import JgtTable from '@/views/components/table/jgt-table'
export default {
  props: {
    selectfofundNo: {
      type: String,
      default: ''
    },
    showType: {
      type: Number,
      default: 1
    },
    // 默认展示关闭按钮， 如果传入false 会禁止用户点击x关闭
    canClose: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  components: {
    JgtTable
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    showText () {
      return (this.evaluationRes.fundRiskType && this.evaluationRes.fundRiskType !== '低风险等级(R1)' ? '及以下' : '')
    }
  },
  data () {
    return {
      visibleType: 1, // 1 做风险测评 2 确认分线测评 3 附加题 4 风险不匹配
      visible: false,
      riskTipsTxt: '',
      errorFlag: false,
      riskQuestionList: [],
      dialogTitle: '风险测评',
      additionalQueObj: {},
      minQuestionContent: '',
      confirmResChecked: false,
      riskToleranceSelector: '',
      // 基础题目提交
      quesParams: {},
      // 附加题提交
      addPrams: {},
      // 恒生测评结果
      hsRiskRes: {},
      fofundNo: '',
      notMatchData: [],
      loading: false,
      loadingBox: false,
      custRiskName: '', // 匹配风险返回
      matchFundRiskTypeName: '',
      evaluationRes: null,
      tableAttr: {
        data: [],
        height: 190,
        'row-class-name': 'rowClassNameRisk'
      },
      tableTh: [
        {
          label: '产品名称',
          prop: 'fundNameTxt'
        },
        {
          label: '风险等级',
          prop: 'fundRiskTypeNameNow'
        },
        {
          label: '匹配情况',
          prop: 'mateName',
          slotName: 'mateName'
        }
      ],
      isConfirm: false
    }
  },
  watch: {
    showType: {
      handler (val, oldVal) {
        if (val) {
          this.visibleType = val
        }
      },
      deep: true
    },
    visible: {
      handler (val, oldVal) {
        if (val) {
          // this.fofundNo = this.selectfofundNo
        }
      },
      deep: true
    },
    visibleType: {
      handler (val, oldVal) {
        switch (val) {
          case 1:
            this.dialogTitle = '风险测评'
            break
          case 2:
            this.dialogTitle = '风险测评结果'
            break
          case 3:
            this.dialogTitle = '风险测评结果'
            break
          case 4:
            this.dialogTitle = '风险警示'
            break
          default:
        }
      },
      deep: true
    }
  },
  created () {

  },
  methods: {
    validate () {
      let errorFlag = true
      this.riskQuestionList.map(item => {
        if ((item.replyOptionNo === '' || !item.replyOptionNo) && errorFlag) {
          errorFlag = false
          this.errorFlag = true
          this.$nextTick(() => {
            let dom = document.querySelector('.questionnairep-error')
            dom.scrollIntoView()
          })
        }
      })
      return errorFlag
    },
    addValidate () {
      let errorFlag = true
      if (!this.riskToleranceSelector || this.riskToleranceSelector === '') {
        this.$message.warning('请完成附加题')
        errorFlag = false
      }
      return errorFlag
    },
    getAdditionalQue () {
      quueryAdditionalQue().then(res => {
        if (res) {
          this.additionalQueObj = res
          this.minQuestionContent = res.content
        }
      })
    },
    close () {
      this.riskQuestionList = []
      this.resetRisk()
      this.visible = false
    },
    resetRisk () {
      this.visibleType = 1
      this.additionalQueObj = {}
      this.minQuestionContent = ''
      this.confirmResChecked = false
      this.riskToleranceSelector = ''
      this.riskQuestionList = []
      // 基础题目提交
      this.quesParams = {}
      // 附加题提交
      this.addPrams = {}
      // 恒生测评结果
      this.hsRiskRes = {}
      // if (!this.isConfirm) {
      this.queryRiskAssessmentTask()
      // } else {
      // this.visible = false
      // }
      this.isConfirm = false
    },
    confirm () {
      switch (this.visibleType) {
        case 1:
          if (this.validate()) {
            this.errorFlag = false
            let questionReplyList = this.riskQuestionList.map(item => {
              return {
                questionNo: item.questionNo,
                order: item.replyOptionNo
              }
            })
            this.questionReplyList = questionReplyList
            this.questionNaireNo = this.riskQuestionList[0].questionNaireNo
            const params = {
              ...this.paramsData,
              fofundNo: this.fofundNo,
              questionNaireNo: this.riskQuestionList[0].questionNaireNo,
              ...{ questionReplyList }
            }
            this.quesParams = params
            this.submitRiskAnserSave(params)
          }
          break
        case 2:
          this.submitRiskToHSSave()
          break
        case 3:
          this.submitAdd()
          break
        case 4:
          this.saveTodoItemClick()
          break
        default:
      }
    },
    // 风险确认函恒生
    submitRiskToHSSave () {
      const riskContent = this.$refs.domRef.innerHTML
      if (!this.confirmResChecked) {
        this.$message.error('请选择已阅读并确认')
        return
      }
      const submitParams = {
        ...this.paramsData,
        ...this.addParams,
        ...this.quesParams
      }
      this.loading = true
      submitRiskToHS(submitParams).then(res => {
        this.loading = false
        if (res) {
          // this.evaluationRes = res
          const { questionNaireNo } = res
          const newParams = {
            requestNo: questionNaireNo,
            fofundNo: this.fofundNo,
            ip: this.util.getIpAddress(),
            signType: 'R',
            operatorId: this.info.operatorId,
            riskContent,
            ...this.paramsData
          }
          this.submitSign(newParams)
          if (this.$isClient) {
            this.$clientCommonFn.reloadAccountInfo()
          }
          this.updateCacheRefresh()
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 问卷更新缓存接口
    updateCacheRefresh () {
      const upParams = {
        fofundNo: this.fofundNo,
        token: this.util.cookies.get('token') || '',
        loginSource: this.$isClient ? '2' : '1'
      }
      cacheRefresh(upParams).then(() => {}).catch(e => {})
    },
    // 风险确认函
    submitSign (params) {
      submitRiskConfirm(params).then(res => {
        if (res) {
          this.queryPositionRTodo()
        }
      })
    },
    // 附加题
    submitAdd () {
      if (this.addValidate()) {
        const minQuestionOption = this.riskToleranceSelector
        const minQuestionContent = this.additionalQueObj.content
        const params = {
          minQuestionOption,
          minQuestionContent
        }
        this.addParams = params
        const submitParams = {
          ...this.paramsData,
          ...this.quesParams,
          ...params
        }
        this.submitRiskAnserSave(submitParams)
      }
    },
    // 风险计算结果
    submitRiskAnserSave (submitParams) {
      this.loading = true
      submitRiskAnser(submitParams).then(res => {
        this.loading = false
        this.visible = true
        if (res) {
          if (this.visibleType === 1) {
            const { custRiskType, custType } = res
            this.evaluationRes = res
            if (custRiskType === '1' && custType === '1') {
              this.visibleType = 3
              this.getAdditionalQue()
              return false
            }
            this.visibleType = 2
            return false
          }
          this.evaluationRes = res
          this.visibleType = 2
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 获取是否匹配
    queryPositionRTodo () {
      const params = {
        ...this.paramsData,
        fofundNo: this.fofundNo
      }
      positionRiskTodo(params).then(res => {
        if (res) {
          this.notMatchData = [...res.todoListNotMatch, ...res.todoListNotMatchOnDoing]
          if (this.notMatchData.length) {
            this.custRiskName = res.custRiskName || ''
            this.matchFundRiskTypeName = res.matchFundRiskTypeName || ''
            this.visibleType = 4
            this.tableAttr.data = this.notMatchData.map(item => {
              this.$set(item, 'fundNameTxt', item.fundName)
              this.$set(item, 'mateName', '不匹配')
              return item
            })
            return false
          }
          this.$emit('change', true)
          this.close()
        }
      })
    },
    // 获取题目
    queryRiskAssessmentTask () {
      this.loadingBox = true
      const operatorCode = this.util.cookies.get('operatorCode') || this.info.operatorCode
      const orgCode = this.util.cookies.get('orgCode') || this.info.orgCode
      this.paramsData = {
        operatorCode,
        orgCode
      }
      queryRiskQuestion({
        fofundNo: this.fofundNo
      }).then(res => {
        this.loadingBox = false
        if (res && res.customerRiskQuestionDTOList && res.customerRiskQuestionDTOList.length) {
          this.riskQuestionList = res.customerRiskQuestionDTOList
          /* if (this.isConfirm) {
            this.confirm()
          } */
        }
      }).catch(e => {
        this.loadingBox = false
      })
    },
    // 获取题目2
    queryRiskAssessmentTask2 () {
      this.loadingBox = true
      const operatorCode = this.util.cookies.get('operatorCode') || this.info.operatorCode
      const orgCode = this.util.cookies.get('orgCode') || this.info.orgCode
      this.paramsData = {
        operatorCode,
        orgCode
      }
      queryRiskQuestion({
        fofundNo: this.fofundNo
      }).then(res => {
        this.loadingBox = false
        if (res && res.customerRiskQuestionDTOList && res.customerRiskQuestionDTOList.length) {
          this.riskQuestionList = res.customerRiskQuestionDTOList
          this.confirm()
        }
      }).catch(e => {
        this.loadingBox = false
      })
    },
    saveTodoItemClick () {
      this.loading = true
      saveTodoItem({
        fofundNo: this.fofundNo,
        operatorId: this.info.operatorId,
        todoSerialNoList: this.notMatchData.length ? this.notMatchData.map(item => item.serialNo) : []
      }).then(res => {
        this.loading = false
        this.$message.success('保存成功')
        this.close()
        this.$emit('change', true)
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .risk-assessment-dialog-title {
    font-size: 14px;
    font-weight: 600;
    @include color(A6);
    margin-bottom: 8px;
  }
  .risk-assessment-columns {
    font-size: 12px;
    font-weight: 400;
    @include color(A6);
    line-height: 24px;
    text-indent: 2em;
  }

</style>
<style lang="scss">
  .select-box-risk{
    .el-dialog .el-dialog__body{
      max-height: 440px !important;
      padding: 24px !important;
    }
    .risk-assessment-dialog-content {
      margin-top: 16px;
      height: 282px;
      overflow-y: auto;
      overflow-x: hidden;
      // 滚动条样式优化
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      /*滚动条的轨道*/
      ::-webkit-scrollbar-track {
        @include backgroundColor(A2);
      }
      /*滚动条里面的小方块，能向上向下移动*/
      ::-webkit-scrollbar-thumb {
        @include backgroundColor(A17);
        border-radius: 5px;
        border: none;
        box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      }
      ::-webkit-scrollbar-thumb:hover {
        @include backgroundColor(A17);
      }
      ::-webkit-scrollbar-thumb:active {
        @include backgroundColor(A21);
      }
      /*边角，即两个滚动条的交汇处*/
      ::-webkit-scrollbar-corner {
        @include backgroundColor(A2);
      }

      .questionnairep-container {
        @include backgroundColor(A11);
        padding: 15px 20px 0;
        margin-bottom: 0;
        .riskTipsTxt{
          @include color(A6);
          font-size: 12px;
          margin-bottom: 10px;
        }
        .questionnairep-item {
          line-height: 20px;
          padding-bottom: 20px;
          @include color(A6);
          & > p {
            margin-bottom: 10px;
            font-size: 12px;
            &.questionnairep-error {
              color: red;
            }
          }
          & > div {
            .el-radio__label {
              margin-bottom: 10px;
              font-size: 12px;
              @include color(A6);
            }
          }
        }
      }
    }
    .el-dialog__header {
      border-top: none;
    }
    .el-dialog__title {
      font-size: 16px;
      color: #a08d79;
      font-weight: 600;
    }
    .el-dialog__body {
      padding: 24px 24px;
      max-height: none;
      overflow: hidden;
    }
    .el-dialog__footer{
      padding: 0 24px 24px !important;
    }
    .risk-assessment-dialog-footer {
      text-align: center;
      overflow: hidden;
      .sunbmit-risk {
        margin: 0 11px;
        margin-bottom: 24px;
      }
    }
    .confirm-risk-text {
      margin: 24px 0 0;
      font-size: 12px;
      font-weight: 400;
    }
    .dialog-bonus-title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 20px;
    }
    .risk-desc {
      @include backgroundColor(A10);
      font-size: 12px;
      @include color(A7);
    }
    .border-dashed {
      border-top: 1px dashed #c0c0c0;
      margin-top: 24px;
      padding-top: 23px;
    }
    .confirm-check-area{
      margin-top: 24px;
      .confirm-check-text{
        @include color(A8);
        font-size: 12px;
      }
    }
    .risk-list-tooltips {
      width: 300px;
    }
    // 附加题
    .risk-assessment-columns {
      font-size: 12px;
      font-weight: 400;
      @include color(A6);
      line-height: 24px;
      text-indent: 2em;
    }
    .dialog-bonus-title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 20px;
    }
    .dialog-bonus-test-title {
      font-size: 14px;
      font-weight: 600;
      margin: 24px 0 12px;
    }
    .dialog-bonus-test-qs {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 12px;
    }
    .dialog-bonus-test-as {
      & > span {
        font-size: 12px;
        @include color(A6);
      }
    }
    .risk-desc {
      @include backgroundColor(A10);
      font-size: 12px;
      @include color(A7);
    }
    .border-dashed {
      border-top: 1px dashed #c0c0c0;
      margin-top: 24px;
      padding-top: 23px;
    }
    // 风险提示
    .el-dialog__header {
      border-top: none;
    }
    .el-dialog__title {
      font-size: 16px;
      color: #a08d79;
      font-weight: 600;
    }
    .el-dialog__body {
      padding: 24px 24px;
      max-height: none;
      overflow: hidden;
    }
    .risk-assessment-dialog-footer {
      text-align: center;
      overflow: hidden;
      .sunbmit-risk {
        margin: 0 11px;
        margin-bottom: 24px;
        padding: 10px 16px;
      }
    }
    .confirm-risk-text {
      margin: 24px 0 0;
      font-size: 12px;
      font-weight: 400;
    }
    .dialog-bonus-title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 20px;
    }
    .risk-desc {
      @include backgroundColor(A10);
      font-size: 12px;
      @include color(A7);
    }
    .border-dashed {
      border-top: 1px dashed #c0c0c0;
      margin-top: 24px;
      padding-top: 23px;
    }
    .custRiskTypeName{
      @include color(A18);
    }
    .custRiskTypetxt{
      margin: 0 2px;
    }
    .risk-assessment-columns-box{
      max-height: 190px;
      margin-bottom: 10px;
      overflow-y: auto;
      // 滚动条样式优化
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      /*滚动条的轨道*/
      ::-webkit-scrollbar-track {
        @include backgroundColor(A2);
      }
      /*滚动条里面的小方块，能向上向下移动*/
      ::-webkit-scrollbar-thumb {
        @include backgroundColor(A17);
        border-radius: 5px;
        border: none;
        box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      }
      ::-webkit-scrollbar-thumb:hover {
        @include backgroundColor(A17);
      }
      ::-webkit-scrollbar-thumb:active {
        @include backgroundColor(A21);
      }
      /*边角，即两个滚动条的交汇处*/
      ::-webkit-scrollbar-corner {
        @include backgroundColor(A2);
      }

    }
    .jy-transfer-left-main-client{
      // 滚动条样式优化
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      /*滚动条的轨道*/
      ::-webkit-scrollbar-track {
        @include backgroundColor(A2);
      }
      /*滚动条里面的小方块，能向上向下移动*/
      ::-webkit-scrollbar-thumb {
        @include backgroundColor(A17);
        border-radius: 5px;
        border: none;
        box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      }
      ::-webkit-scrollbar-thumb:hover {
        @include backgroundColor(A17);
      }
      ::-webkit-scrollbar-thumb:active {
        @include backgroundColor(A21);
      }
      /*边角，即两个滚动条的交汇处*/
      ::-webkit-scrollbar-corner {
        @include backgroundColor(A2);
      }

    }
  }
  .risk-assessment-columns-box{
    .classNameRisk{
      .el-table td {
        height: 36px;
      }
    }
  }

</style>
