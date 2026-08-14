/**
 * 国际门户遗留 API stub（原 src/api/bussiness 已删除）
 * 仅保证旧组件可编译；调用将拒绝，请迁移至 src/api/intl 真实接口。
 */
const notImpl = (name) => (...args) => {
  console.warn(`[jgt-intl-portal] legacy API stub called: ${name}`)
  return Promise.reject(new Error(`[jgt-intl-portal] legacy API removed: ${name}`))
}

export const etsDownload = notImpl('ets-portal/etsDownload')
export const importCreditCheck = notImpl('ets-portal/importCreditCheck')
