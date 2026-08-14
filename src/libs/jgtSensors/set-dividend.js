import { $sensorsTrack } from './lib'

// 分红模块
const redeem = {}
const setupClickBtn = {
  1: '移除',
  2: '预览',
  3: '取消',
  4: '确定设置'
}
// 超限提示类型
const transactionType = {
  transaction_type: '设置分红方式'
}
/*
  1. 设置分红方式设置页浏览
*/
redeem.setDividendSetupPageview = payload => {
  payload = {
    ...payload,
    ...transactionType
  }
  $sensorsTrack('set_dividend_setup_pageview', payload)
}
/*
  2. 设置分红方式设置页按钮点击
  交易类型: transaction_type
  按钮名称: button_name,
*/
redeem.setDividendSetupClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('set_dividend_setup_click', payload)
}

/*
  3. 设置分红方式设置预览或取消
  交易类型: transaction_type
  分红笔数: set_dividend_quantity,
  按钮名称: button_name,
  {
    set_dividend_quantity: '',
    huge_redemption_type: '',
    type: '',
  }
*/
redeem.setDividendSetupConfirm = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('set_dividend_setup_confirm', payload)
}
/*
  4. 分红预览页按钮点击
  交易类型: transaction_type
  分红笔数: set_dividend_quantity,
  按钮名称: button_name,
  按钮名称: type
  {
    set_dividend_quantity: '',
    huge_redemption_type: '',
    type: '',
  }
*/
redeem.setDividendPreviewPageview = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('set_dividend_preview_pageview', payload)
}
/*
  5. 设置分红方式预览页按钮点击
  交易类型: transaction_type
  分红笔数: set_dividend_quantity,
  {
    set_dividend_quantity: '',
    huge_redemption_type: '',
  }
*/
redeem.setDividendPreviewClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('set_dividend_preview_click', payload)
}
/*
  6. 前端分红结果返回
  交易类型: transaction_type,
  分红笔数: set_dividend_quantity,
  {
    set_dividend_quantity: '',
    huge_redemption_type: '',
  }
*/
redeem.feSetDividendResult = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('fe_set_dividend_result', payload)
}
export default redeem
