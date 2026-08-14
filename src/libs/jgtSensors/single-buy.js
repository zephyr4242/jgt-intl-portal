import { $sensorsTrack } from './lib'

// 认申购模块
const singleBuy = {}
// 基金详情页交易按钮点击类型
const fundDetailBtn = {
  'purchase': '立即申购',
  'subscribe': '立即认购',
  'addAdvance': '加入预购',
  'cancel': '取消'
}
// 超授信提示类型
const overCreditTypeName = {
  1: '不在授信范围-禁止购买',
  2: '不在授信范围-允许购买',
  3: '超过授信额度-禁止购买',
  4: '超过授信额度-允许购买'
}
// 超限提示类型
const overrunTypeName = {
  '1': '单日超限',
  '2': '单账户超限',
  '3': '单日超限&单账户超限'
}
// 不满足起点提示类型
/* const belowStartingTypeName = {
  'onceBelow': '不满足首次购买起点',
  'addBelow': '不满足追加购买起点'
} */

// 风险错配和高风险提示类型
const notificationTypeName = {
  'notMatch': '风险不匹配警示',
  'highRisk': '高风险产品警示',
  'highRiskAndNotMatch': '风险不匹配警示&高风险产品警示'
}
/*
  1. 基金详情页浏览
  基金名称: fund_name
  基金代码: fund_code
  页面加载时长: loading_duration
*/
singleBuy.fundDetailsPageview = payload => {
  $sensorsTrack('fund_details_pageview', payload)
}

/*
  2. 基金详情页交易按钮点击
  基金名称: fund_name
  基金代码: fund_code
  按钮名称: button_name
  type: 按钮类型
*/
singleBuy.fundDetailPurchaseClick = payload => {
  payload.button_name = fundDetailBtn[payload.type]
  delete payload.type
  $sensorsTrack('fund_detail_purchase_click', payload)
}

/*
  3. 超授信提示
  交易类型: transaction_type
  超授信类型: over_credit_type，
  type: 超授信类型
*/
singleBuy.overCreditPageview = payload => {
  payload.over_credit_type = overCreditTypeName[payload.type]
  delete payload.type
  $sensorsTrack('over_credit_pageview', payload)
}

/*
  4. 超限提示
  交易类型: transaction_type
  超限类型: overrun_type,
  type: 超限类型
*/
singleBuy.overrunTipsPageview = payload => {
  payload.over_credit_type = overrunTypeName[payload.type]
  delete payload.type
  $sensorsTrack('overrun_tips_pageview', payload)
}

/*
  5. 不满足起点提示
  交易类型: transaction_type
  超限类型: below_starting_type,
  type: 超限类型
*/
singleBuy.belowStartingPageview = payload => {
  $sensorsTrack('below_starting_pageview', payload)
}

/*
  6. 认申购预览页浏览
  交易类型: transaction_type
  超限类型: loading_duration,
*/
singleBuy.purchasePreviewPageview = payload => {
  $sensorsTrack('purchase_preview_pageview', payload)
}

/*
  7. 认申购预览页按钮点击
  交易类型: transaction_type
  基金名称: fund_name
  基金代码: fund_code
  按钮名称: button_name
*/
singleBuy.purchasePreviewClick = payload => {
  payload.button_name = fundDetailBtn[payload.type]
  delete payload.type
  $sensorsTrack('purchase_preview_click', payload)
}

/*
  8. 风险错配和高风险提示
  提示类型: notification_type
  交易类型: transaction_type
*/
singleBuy.riskStatementPageview = payload => {
  payload.notification_type = notificationTypeName[payload.type]
  delete payload.type
  $sensorsTrack('risk_statement_pageview', payload)
}
/*
  8. 风险错配和高风险提示停留时长
  提示类型: notification_type
  交易类型: transaction_type
  停留时长:page_stay_time
*/
singleBuy.riskStatementDuration = payload => {
  payload.notification_type = notificationTypeName[payload.type]
  delete payload.type
  $sensorsTrack('risk_statement_duration', payload)
}
/*
  9. 密码输入成功
  交易类型: transaction_type
*/
singleBuy.passwordEnteredSuccess = payload => {
  $sensorsTrack('password_entered_success', payload)
}
/*
  9. 密码输入成功
  交易类型: transaction_type
*/
singleBuy.passwordEnteredError = payload => {
  $sensorsTrack('password_entered_error', payload)
}
/*
  10. 密码输入成功
  交易类型: transaction_type,
  基金名称: fund_name
  基金代码: fund_code
*/
singleBuy.fePurchaseResult = payload => {
  $sensorsTrack('fe_purchase_result', payload)
}
/*
  10. 渠道来源下单成功埋点
*/
singleBuy.channelSourcePurchaseSuccess = payload => {
  $sensorsTrack('channel_source_purchase_success', payload)
}
export default singleBuy
