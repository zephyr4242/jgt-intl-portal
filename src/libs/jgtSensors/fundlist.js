import { $sensorsTrack } from './lib'

// 基金产品列表模块
const fundlist = {}
/*
  1. 基金产品列表页浏览
*/
fundlist.fundlistPageview = () => {
  $sensorsTrack('fundlist_pageview')
}
/*
  2. 基金产品列表页按钮点击
  基金产品列表类型: button_name,
*/
fundlist.fundlistClick = payload => {
  $sensorsTrack('fundlist_click', payload)
}

/*
  3. 切换标签页点击
  标签页名称: tab_name,
*/
fundlist.switchTabClick = tabName => {
  $sensorsTrack('switch_tab_click', { tab_name: tabName })
}
/*
  4. 基金产品列表页筛选项点击
  标签页名称: tab_name,
*/
fundlist.fundlistFilterClick = payload => {
  $sensorsTrack('fundlist_filter_click', payload)
}
/*
  5. 基金产品列表页单产品按钮点击
  产品代码: fund_code
  产品名称: fund_name,
  按钮名称:button_name
*/
fundlist.fundlistSingleFundClick = payload => {
  $sensorsTrack('fundlist_single_fund_click', payload)
}
/*
  6. 分页器点击
  当前页面总条数: pagination_total_number
  按钮名称: button_name,
  按钮内容: button_content
*/
fundlist.paginationLoad = payload => {
  $sensorsTrack('pagination_load', payload)
}
export default fundlist
