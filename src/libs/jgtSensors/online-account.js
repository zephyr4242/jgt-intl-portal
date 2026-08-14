import { $sensorsTrack } from './lib'

// 开户首页及登录模块
const onlineAccount = {}
/*
  1.在线开户管理页浏览
*/
onlineAccount.onlineAccountManagementBrowsing = () => {
  $sensorsTrack('online_account_management_browsing')
}
/*
  2.在线开户管理页tab点击
  标签页名称: tab_name,
*/
onlineAccount.onlineAccountManagementTabClick = payload => {
  $sensorsTrack('online_account_management_tab_click', payload)
}
/*
  3.在线开户管理页按钮点击
  标签页名称: tab_name, 未完成、已完成、批量开户
  按钮名称: button_name  新开机构户、新开产品户、批量开产品户
*/
onlineAccount.onlineAccountManagementButtonClick = payload => {
  $sensorsTrack('online_account_management_button_click', payload)
}
/*
  4. 在线开户管理页条件筛选
  标签页名称: tab_name
  筛选项名称: filter_item
*/
onlineAccount.onlineAccountManagementFilter = payload => {
  $sensorsTrack('online_account_management_filter', payload)
}
/*
  5.在线开户管理页条件搜索
*/
onlineAccount.onlineAccountManagementSearch = payload => {
  $sensorsTrack('online_account_management_search', payload)
}
/*
  6.在线开户管理页操作按钮点击
*/
onlineAccount.onlineAccountManagementOperationButtonClick = (payload) => {
  $sensorsTrack('online_account_management_operation_button_click', payload)
}

/*
  7.材料上传页浏览
*/
onlineAccount.fileUploadPageBrowsing = (payload) => {
  $sensorsTrack('file_upload_page_browsing', payload)
}
/*
  8.材料上传
*/
onlineAccount.fileUpload = (payload) => {
  $sensorsTrack('file_upload', payload)
}
/*
  9.材料信息确认
*/
onlineAccount.fileConfirmation = (payload) => {
  $sensorsTrack('file_confirmation', payload)
}
/*
  10.材料上传页查看模板
*/
onlineAccount.fileUploadPageSampleViewing = (payload) => {
  $sensorsTrack('file_upload_page_sample_viewing', payload)
}
/*
  11.材料上传页按钮点击
*/
onlineAccount.fileUploadPageButtonClick = (payload) => {
  $sensorsTrack('file_upload_page_button_click', payload)
}
/*
  12.信息填写页浏览
*/
onlineAccount.informationFillingPageBrowsing = (payload) => {
  $sensorsTrack('information_filling_page_browsing', payload)
}
/*
  13.信息填写页按钮点击
*/
onlineAccount.informationFillingPageButtonClick = (payload) => {
  $sensorsTrack('information_filling_page_button_click', payload)
}
/*
  14.必填信息触发校验
*/
onlineAccount.requiredInformationCheck = (payload) => {
  $sensorsTrack('required_information_check', payload)
}
/*
  15.准确性触发校验
*/
onlineAccount.accuracyCheck = (payload) => {
  $sensorsTrack('accuracy_check', payload)
}
/*
  16.信息填写页OCR使用
*/
onlineAccount.ocrUsage = (payload) => {
  $sensorsTrack('ocr_usage', payload)
}
/*
  17.带出历史人员
*/
onlineAccount.takingOutMaintainedPeople = (payload) => {
  $sensorsTrack('taking_out_maintained_people', payload)
}
/*
  18.机构信息预览页材料查看
*/
onlineAccount.accountConfirmationPreviewPageBrowsing = (payload) => {
  $sensorsTrack('account_confirmation_preview_page_browsing', payload)
}
/*
  19.开户信息预览页材料查看
*/
onlineAccount.accountConfirmationPreviewPageMaterialViewing = (payload) => {
  $sensorsTrack('account_confirmation_preview_page_material_viewing', payload)
}
/*
  20.开户信息预览页按钮点击
*/
onlineAccount.accountConfirmationPreviewPageButtonClick = (payload) => {
  $sensorsTrack('account_confirmation_preview_page_button_click', payload)
}

export default onlineAccount
