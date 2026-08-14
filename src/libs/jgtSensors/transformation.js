import { $sensorsTrack } from './lib'

// 转换模块
const transformation = {}
const setupClickBtn = {
  1: '预览',
  2: '确认转换',
  3: '取消'
}
// 转换方式, 0-普通转换 1-实时超级转换 2-非实时超级转换
transformation.transferTypeName = {
  '0': '普通转换',
  '1': '实时超级转换',
  '2': '非实时超级转换'
}
// 超限提示类型
const transactionType = {
  transaction_type: '转换'
}
/*
  1. 设置转换设置页浏览
*/
transformation.transformationSetupPageview = that => {
  let payload = {
    ...transactionType
  }
  $sensorsTrack('transformation_setup_pageview', payload)
}
/*
  2. 设置转换设置页按钮点击
  交易类型: transaction_type
  转出基金名称:out_fund_name
  转出基金代码:out_fund_code
  转入基金名称:in_fund_name
  转入基金代码:in_fund_code
  转换类型: transformation_type,
*/
transformation.transformationSetupClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  payload.transformation_type = transformation.transferTypeName[payload.transferType]
  delete payload.type
  delete payload.transferType
  payload = { ...payload, ...transactionType }
  $sensorsTrack('transformation_setup_click', payload)
}

/*
  3. 转换预览页浏览
  交易类型: transaction_type
  转出基金名称:out_fund_name
  转出基金代码:out_fund_code
  转入基金名称:in_fund_name
  转入基金代码:in_fund_code
  转换类型: transformation_type,
*/
transformation.transformationPreviewPageview = payload => {
  payload.transformation_type = transformation.transferTypeName[payload.transferType]
  delete payload.transferType
  payload = { ...payload, ...transactionType }
  $sensorsTrack('transformation_preview_pageview', payload)
}
/*
  4. 转换预览页按钮点击
  交易类型: transaction_type
  转出基金名称:out_fund_name
  转出基金代码:out_fund_code
  转入基金名称:in_fund_name
  转入基金代码:in_fund_code
  转换类型: transformation_type,
  按钮名称:button_name
*/
transformation.transformationPreviewClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  payload.transformation_type = transformation.transferTypeName[payload.transferType]
  delete payload.type
  delete payload.transferType
  payload = { ...payload, ...transactionType }
  $sensorsTrack('transformation_preview_click', payload)
}
/*
  6. 前端转换结果返回
  交易类型: transaction_type
  转出基金名称:out_fund_name
  转出基金代码:out_fund_code
  转入基金名称:in_fund_name
  转入基金代码:in_fund_code
  转换类型: transformation_type,
*/
transformation.feTransformationResult = payload => {
  payload.transformation_type = transformation.transferTypeName[payload.transferType]
  delete payload.transferType
  payload = { ...payload, ...transactionType }
  $sensorsTrack('fe_transformation_result', payload)
}
export default transformation
