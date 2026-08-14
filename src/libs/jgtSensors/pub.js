import { $sensorsTrack } from './lib'
// 公共模块
const pub = {}
/*
  1. 页面静态资源加载时长
  page_load_time
  api_load_time
  overall_load_time
*/
pub.pageLoadDuration = payload => {
  $sensorsTrack('page_load_duration', payload)
}
/*
  1. 页面停留时长
  page_stay_time
*/
pub.pageStayDuration = payload => {
  $sensorsTrack('page_stay_duration', payload)
}
/*
  1. 首屏加载时长
  overall_load_time
*/
pub.firstMeaningfulPaint = payload => {
  $sensorsTrack('first_meaningful_paint', payload)
}
/*
  1. 接口调用时长
  api_request_url,
  api_load_time
*/
pub.apiLoadDuration = payload => {
  $sensorsTrack('api_load_duration', payload)
}

pub.avatarClick = payload => {
  $sensorsTrack('avatar_click', payload)
}
// 历史搜索结果点击
pub.historySearchResultClick = payload => {
  $sensorsTrack('history_search_result_click', payload)
}
// 搜索联想结果点击
pub.searchResultClick = payload => {
  $sensorsTrack('search_result_click', payload)
}
// 点击下载客户端
pub.downloadClientClick = () => {
  $sensorsTrack('download_client_click')
}
// 引导页按钮点击
pub.guidePageClick = (payload) => {
  $sensorsTrack('guide_page_click', payload)
}

// banner_click按钮点击
pub.homeBannerClick = (payload) => {
  $sensorsTrack('banner_click', payload)
}

// banner视频播放时长
pub.homeBannerVideoView = (payload) => {
  $sensorsTrack('banner_video_view', payload)
}

// 设备绑定埋点

pub.machineBind = (payload) => {
  $sensorsTrack('machine_bind', payload)
}
export default pub
