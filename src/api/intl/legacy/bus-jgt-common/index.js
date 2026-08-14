/**
 * 国际门户遗留 API stub（原 src/api/bussiness 已删除）
 * 仅保证旧组件可编译；调用将拒绝，请迁移至 src/api/intl 真实接口。
 */
const notImpl = (name) => (...args) => {
  console.warn(`[jgt-intl-portal] legacy API stub called: ${name}`)
  return Promise.reject(new Error(`[jgt-intl-portal] legacy API removed: ${name}`))
}

export const authorDownload = notImpl('bus-jgt-common/authorDownload')
export const bannerList = notImpl('bus-jgt-common/bannerList')
export const bindClient = notImpl('bus-jgt-common/bindClient')
export const bindClientList = notImpl('bus-jgt-common/bindClientList')
export const clientVersionUpgrade = notImpl('bus-jgt-common/clientVersionUpgrade')
export const commonFileDownload = notImpl('bus-jgt-common/commonFileDownload')
export const employeeQualificationList = notImpl('bus-jgt-common/employeeQualificationList')
export const fastdfsInfoQuery = notImpl('bus-jgt-common/fastdfsInfoQuery')
export const fileQuery = notImpl('bus-jgt-common/fileQuery')
export const queryOnlineAnnouncementConfig = notImpl('bus-jgt-common/queryOnlineAnnouncementConfig')
export const queryReportList = notImpl('bus-jgt-common/queryReportList')
export const templateCreate = notImpl('bus-jgt-common/templateCreate')
export const templateDetail = notImpl('bus-jgt-common/templateDetail')
export const templateEdit = notImpl('bus-jgt-common/templateEdit')
export const templateList = notImpl('bus-jgt-common/templateList')
export const templateRemove = notImpl('bus-jgt-common/templateRemove')
export const unbindClient = notImpl('bus-jgt-common/unbindClient')
export const voucherPackQuery = notImpl('bus-jgt-common/voucherPackQuery')
export const voucherPackSave = notImpl('bus-jgt-common/voucherPackSave')
