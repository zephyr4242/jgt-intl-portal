import { $sensorsTrack } from './lib'

// 赎回模块
const redeem = {}
const setupClickBtn = {
  1: '按申请份额输入',
  2: '按预期金额输入',
  3: '全部赎回',
  4: '移除',
  5: '预览',
  6: '取消',
  7: '确定赎回'
}
// 超限提示类型
const transactionType = {
  transaction_type: '赎回'
}

/*
  1. 我的持仓页浏览
*/
redeem.myPositionPageview = payload => {
  $sensorsTrack('my_position_pageview', payload)
}
/*
  2. 我的持仓页按钮点击
  按钮名称: button_name
  按钮类型: type
*/
redeem.myPositionClick = payload => {
  $sensorsTrack('my_position_click', payload)
}
/*
  3. 赎回设置页浏览
  交易类型: transaction_type
*/
redeem.redemptionSetupPageview = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('redemption_setup_pageview', payload)
}

/*
  4. 赎回设置页按钮点击
  交易类型: transaction_type
  按钮名称: button_name,
*/
redeem.redemptionSetupClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('redemption_setup_click', payload)
}

/*
  5. 赎回产品单支明细
  交易类型: transaction_type
  交易账户id: selected_fofund_no,
  基金名称: fund_name,
  基金代码: fund_code,
  赎回输入方式: redemption_input_type
  是否全赎: is_all_redemption
  [
    {
      selected_fofund_no: '',
      fund_name: '',
      fund_code: '',
      redemption_input_type: '',
      is_all_redemption: '',
    }
  ]
*/
redeem.redemptionSingleDetail = payload => {
  $sensorsTrack('redemption_single_detail', payload)
}

/*
  6. 赎回设置预览或取消
  交易类型: transaction_type
  赎回笔数: redemption_quantity,
  巨额赎回方式: huge_redemption_type,
  按钮名称: button_name,
  {
    redemption_quantity: '',
    huge_redemption_type: '',
    type: '',
  }
*/
redeem.redemptionSetupConfirm = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('redemption_setup_confirm', payload)
}

/*
  7. 赎回预览页浏览
  交易类型: transaction_type
  赎回笔数: redemption_quantity,
  巨额赎回方式: huge_redemption_type,
  {
    redemption_quantity: '',
    huge_redemption_type: '',
  }
*/
redeem.redemptionPreviewPageview = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('redemption_preview_pageview', payload)
}

/*
  8. 赎回预览页按钮点击
  交易类型: transaction_type
  赎回笔数: redemption_quantity,
  巨额赎回方式: huge_redemption_type,
  按钮名称: button_name,
  按钮名称: type
  {
    redemption_quantity: '',
    huge_redemption_type: '',
    type: '',
  }
*/
redeem.redemptionPreviewClick = payload => {
  payload.button_name = setupClickBtn[payload.type]
  delete payload.type
  payload = { ...payload, ...transactionType }
  $sensorsTrack('redemption_preview_click', payload)
}
/*
  10. 前端赎回结果返回
  交易类型: transaction_type,
  赎回笔数: redemption_quantity,
  巨额赎回方式: huge_redemption_type,
  {
    redemption_quantity: '',
    huge_redemption_type: '',
  }
*/
redeem.feRedemptionResult = payload => {
  payload = { ...payload, ...transactionType }
  $sensorsTrack('fe_redemption_result', payload)
}
export default redeem
