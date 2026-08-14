import { $sensorsTrack } from './lib'
// 公共模块
const tradeOrder = {}
/*
  1. 切换标签页点击
  tab_name： 单笔下单、Excel下单
*/
tradeOrder.switchTabClick = payload => {
  $sensorsTrack('switch_tab_click', payload)
}
/*
  2. 单笔交易下单页浏览
  flow_id
*/
tradeOrder.individualOrderPageview = payload => {
  $sensorsTrack('individual_order_pageview', payload)
}
/*
  3. 单笔交易下单页按钮点击
    transaction_type:交易类型
    button_name:按钮名称
    is_success:是否成功
    error_type:错误类型
    flow_id:流程id
*/
tradeOrder.individualOrderClick = payload => {
  $sensorsTrack('individual_order_click', payload)
}
/*
  4. 前端单笔交易结果返回
  transaction_type:交易类型
  flow_id:流程id
*/
tradeOrder.feIndividualResult = payload => {
  $sensorsTrack('fe_individual_result', payload)
}

/*
  5. 前端单笔交易结果返回
  tbutton_name:按钮名称  继续下单、交易查询、打印申请单
  flow_id:流程id
*/

tradeOrder.individualResultClick = payload => {
  $sensorsTrack('individual_result_click', payload)
}

export default tradeOrder
