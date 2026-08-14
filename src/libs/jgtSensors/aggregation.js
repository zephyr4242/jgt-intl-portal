import { $sensorsTrack } from './lib'

// 智能拆单
const aggregation = {}
/*
  1. 聚合交易下单页浏览
*/
aggregation.aggregationOrderPageview = () => {
  $sensorsTrack('aggregation_order_pageview')
}
/*
  2. 聚合交易下单页按钮点击
  基金产品列表类型: button_name,
*/
aggregation.aggregationOrderClick = payload => {
  $sensorsTrack('aggregation_order_click', payload)
}

/*
  3. 聚合交易上传文件错误提示
  标签页名称: error_type,
*/
aggregation.aggregationImportError = payload => {
  $sensorsTrack('aggregation_import_error', payload)
}
/*
  4. 聚合交易excel解析结果页按钮点击
  基金产品列表类型: button_name,
*/
aggregation.aggregationExcelResultClick = payload => {
  $sensorsTrack('aggregation_excel_result_click', payload)
}

/*
  5. 聚合交易移除交易指令
  基煜账户名称: fofund_name,
  产品代码: fund_code,
  产品名称: fund_name,
  交易方向: trade_direction,
  金额标记: amount_mark,
  巨额赎回方式: huge_redemption_type,
  分红方式: dividend_type,
*/
aggregation.aggregationRemoveOrderInstruction = payload => {
  $sensorsTrack('aggregation_remove_order_instruction', payload)
}
/*
  6. 批量下单接口返回Click
  标签页名称: tab_name,
*/
aggregation.feAggregationApiResult = payload => {
  $sensorsTrack('fe_aggregation_api_result', payload)
}
/*
  6. 批量下单结果
  标签页名称: tab_name,
*/
aggregation.feAggregationResult = payload => {
  $sensorsTrack('fe_aggregation_result', payload)
}
/*
  7. 智能拆单预览页浏览
  产品数量:fund_quantity
*/
aggregation.aggregationResultClick = payload => {
  $sensorsTrack('aggregation_result_click', payload)
}
/*
  8. 聚合交易excel解析结果页浏览
  按钮名称: import_success_quantity,
*/
aggregation.aggregationExcelResultPageview = payload => {
  $sensorsTrack('aggregation_excel_result_pageview', payload)
}

export default aggregation
