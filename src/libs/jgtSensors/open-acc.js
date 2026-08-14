import { $sensorsTrack } from './lib'

// 开户首页及登录模块
const openAcc = {}
const btnType = {
  1: '查看样本-营业执照',
  2: '查看样本-金融许可证',
  3: '查看样本-法人身份证',
  4: '查看样本-操作员授权委托书',
  5: '下载-操作员授权委托书',
  6: '查看样本-授权经办人身份证',
  7: '已有帐号',
  8: '首次开通',
  9: '原开户流程',
  10: '返回'
}
const loginBtnType = {
  1: '立即登录',
  2: '忘记密码',
  3: '获取验证码'
}
const uploadType = {
  1: '查看模板',
  2: '上传文件',
  3: '下一步',
  4: '返回',
  5: '线下版',
  6: '查看信息',
  7: '重新上传'
}
const overviewBtnType = {
  1: '预览',
  2: '前往上传-用印版材料',
  3: '前往填写-信息采集表',
  4: '修改-用印版材料',
  5: '修改-信息采集表',
  6: '线下版',
  7: '查看样本-营业执照',
  8: '查看样本-金融许可证',
  9: '查看样本-法人身份证',
  10: '查看样本-操作员授权委托书',
  11: '下载-操作员授权委托书',
  12: '查看样本-授权经办人身份证',
  13: '新增机构信息'
}
/*
  1. 开户流程首页浏览
*/
openAcc.openAccHomepagePageview = () => {
  $sensorsTrack('open_acc_homepage_pageview')
}
/*
  2. 开户流程首页点击
  开户首页及登录类型: button_name,
*/
openAcc.openAccHomepageClick = payload => {
  payload.button_name = btnType[payload.type]
  delete payload.type
  $sensorsTrack('open_acc_homepage_click', payload)
}

/*
  3. 开户登录账号页面浏览
*/
openAcc.openAccLoginPageview = payload => {
  $sensorsTrack('open_acc_login_pageview', payload)
}
/*
  4. 前端开户首页及登录结果返回
  开户类型: open_acc_type
  登录方式: login_type,
*/
openAcc.openAccLoginClick = payload => {
  payload.button_name = loginBtnType[payload.type]
  delete payload.type
  $sensorsTrack('open_acc_login_click', payload)
}
/*
  5. 开户登录账号结果
  开户类型: open_acc_type
  登录方式: login_type,
*/
openAcc.openAccLoginResult = payload => {
  $sensorsTrack('open_acc_login_result', payload)
}

/*
  6. 开户一览表页面浏览
  开户类型: open_acc_type
  开户处理状态: open_acc_deal_status,
*/
openAcc.openAccOverviewPageview = (payload) => {
  $sensorsTrack('open_acc_overview_pageview', payload)
}

/*
  7. 开户一览表页面点击
  开户类型: open_acc_type
  开户处理状态: open_acc_deal_status,
  按钮名称: button_name
*/
openAcc.openAccOverviewClick = (payload) => {
  payload.button_name = overviewBtnType[payload.type]
  delete payload.type
  $sensorsTrack('open_acc_overview_click', payload)
}
/*
  8. 开户材料上传页面浏览
  开户类型: open_acc_type
  页面来源: page_source
*/
openAcc.openAccMatUploadPageview = (payload) => {
  $sensorsTrack('open_acc_mat_upload_pageview', payload)
}
/*
  9. 开户材料上传页按钮点击
  开户类型: open_acc_type
  页面来源: page_source
*/
openAcc.openAccMatUploadClick = (payload) => {
  payload.button_name = uploadType[payload.type]
  delete payload.type
  $sensorsTrack('open_acc_mat_upload_click', payload)
}
/*
  10. 开户材料上传结果
  开户类型: open_acc_type
  材料类型: file_type
  文件大小: file_size,
  文件格式: file_format
  上传结果: file_upload_result
*/
openAcc.openAccMatUploadResult = (payload) => {
  $sensorsTrack('open_acc_mat_upload_result', payload)
}
/*
  11. 开户材料信息确认/查看信息
  开户类型: open_acc_type
  材料类型: file_type
  文件大小: page_stay_time,
*/
openAcc.openAccMatInfoConfirm = (payload) => {
  $sensorsTrack('open_acc_mat_info_confirm', payload)
}

/*
  12. 机构信息采集页浏览
  开户类型: open_acc_type
  材料类型: file_type
  文件大小: page_stay_time,
*/
openAcc.orgInfoCollectPageview = (payload) => {
  $sensorsTrack('org_info_collect_pageview', payload)
}

/*
  13. 机构信息采集页OCR按钮点击
  开户类型: open_acc_type
  材料类型: file_type
  文件大小: page_stay_time,
*/
openAcc.orgInfoCollectOcrClick = (payload) => {
  $sensorsTrack('org_info_collect_ocr_click', payload)
}
/*
  14. 机构信息采集页查看协议
  开户类型: open_acc_type
  材料类型: file_type
*/
openAcc.orgInfoCollectAgreementView = (payload) => {
  $sensorsTrack('org_info_collect_agreement_view', payload)
}
/*
  15. 机构信息采集页按钮点击
  开户类型: open_acc_type
  按钮名称: button_name
*/
openAcc.orgInfoCollectClick = (payload) => {
  $sensorsTrack('org_info_collect_click', payload)
}
/*
  16. 机构信息采集页错误提示(未埋)
  开户类型: open_acc_type
  错误类型: error_type
*/
openAcc.orgInfoCollectError = (payload) => {
  $sensorsTrack('org_info_collect_error', payload)
}
/*
  17. 机构信息预览页浏览
  开户类型: open_acc_type
  开户处理状态: open_acc_deal_status
*/
openAcc.orgInfoPreviewPageview = (payload) => {
  $sensorsTrack('org_info_preview_pageview', payload)
}
/*
  18. 机构信息预览页材料查看
  开户类型: open_acc_type
  开户处理状态: open_acc_deal_status
*/
openAcc.orgInfoPreviewMatView = (payload) => {
  $sensorsTrack('org_info_preview_mat_view', payload)
}
/*
  19. 机构信息预览页按钮点击
  开户类型: open_acc_type
  开户处理状态: open_acc_deal_status
*/
openAcc.orgInfoPreviewClick = (payload) => {
  $sensorsTrack('org_info_preview_click', payload)
}
export default openAcc
