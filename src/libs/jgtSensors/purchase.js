import { $sensorsTrack } from './lib'

// 预购清单模块
const purchase = {}
const setupClickBtn = {
  0: '一键下单',
  1: '一键清空',
  2: '导出全部数据',
  3: '立刻挑选产品',
  4: '移除'
}
// 超限提示类型
const transactionType = {
  transaction_type: '预购下单'
}
/*
  1. 设置预购清单设置页浏览
*/
purchase.purchaselistPageview = () => {
  $sensorsTrack('purchaselist_pageview')
}
/*
  2. 设置预购清单设置页按钮点击
  预购清单类型: button_name,
*/
purchase.purchaselistClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  $sensorsTrack('purchaselist_click', payload)
}

/*
  3. 预购清单预览页浏览
  交易类型: transaction_type
  基金名称:fund_name
  基金代码:fund_code
  基金名称:fund_type
  操作员名称: operator_name
  超限类型: amount_mark,
*/
purchase.purchaselistRemoveProduct = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('purchaselist_remove_product', payload)
}
/*
  5. 前端预购清单结果返回
  交易类型: transaction_type
  产品数量: fund_quantity,
*/
purchase.fePurchaselistResult = payload => {
  $sensorsTrack('fe_purchaselist_result', payload)
}
export default purchase
