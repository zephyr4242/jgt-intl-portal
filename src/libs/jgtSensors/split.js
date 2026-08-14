import { $sensorsTrack } from './lib'

// 智能拆单
const fundsplit = {}
/*
  1. 智能拆单设置页浏览
*/
fundsplit.fundsplitPageview = () => {
  $sensorsTrack('fundsplit_setup_pageview')
}
/*
  2. 智能拆单设置确认
  基金产品列表类型: button_name,
*/
fundsplit.fundsplitSetupResultClick = payload => {
  $sensorsTrack('fundsplit_setup_result_click', payload)
}

/*
  3. 智能拆单设置页按钮点击
  标签页名称: tab_name,
*/
fundsplit.fundsplitSetupConfirm = payload => {
  $sensorsTrack('fundsplit_setup_confirm', payload)
}
/*
  4. 智能拆单设置确认
  基金产品列表类型: button_name,
*/
fundsplit.fundsplitSetupResultPageview = payload => {
  $sensorsTrack('fundsplit_setup_result_pageview', payload)
}

/*
  5. 智能拆单预览页单产品按钮点击
  标签页名称: tab_name,
*/
fundsplit.fundsplitSingleFundClick = payload => {
  $sensorsTrack('fundsplit_single_fund_click', payload)
}
/*
  6. 智能拆单预览页单产品按钮点击
  标签页名称: tab_name,
*/
fundsplit.fundsplitSetupResultSingleFundClick = payload => {
  $sensorsTrack('fundsplit_setup_result_single_fund_click', payload)
}
/*
  7. 智能拆单预览页浏览
  产品数量:fund_quantity
*/
fundsplit.fundsplitPreviewPageview = payload => {
  $sensorsTrack('fundsplit_preview_pageview', payload)
}
/*
  8. 智能拆单预览页按钮点击
  按钮名称: button_name,
*/
fundsplit.fundsplitPreviewClick = payload => {
  $sensorsTrack('fundsplit_preview_click', payload)
}
/*
  9. 前端智能拆单申购结果返回
  交易类型: transaction_type
  产品数量: fund_quantity,
*/
fundsplit.feFundsplitResult = payload => {
  $sensorsTrack('fe_fundsplit_result', payload)
}
/*
  10. 前端智能拆单申购结果返回
  交易类型: transaction_type
  产品数量: fund_quantity,
*/
fundsplit.fundsplitResultSingleFundClick = payload => {
  $sensorsTrack('fundsplit_result_single_fund_click', payload)
}

export default fundsplit
