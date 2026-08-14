/**
 * 国际门户遗留 API stub（原 src/api/bussiness 已删除）
 * 仅保证旧组件可编译；调用将拒绝，请迁移至 src/api/intl 真实接口。
 */
const notImpl = (name) => (...args) => {
  console.warn(`[jgt-intl-portal] legacy API stub called: ${name}`)
  return Promise.reject(new Error(`[jgt-intl-portal] legacy API removed: ${name}`))
}

export const cumulativeYieldTrend = notImpl('bus-jgt-asset/cumulativeYieldTrend')
export const customerProductShareExport = notImpl('bus-jgt-asset/customerProductShareExport')
export const dividendMethodOrder = notImpl('bus-jgt-asset/dividendMethodOrder')
export const earningsCharts = notImpl('bus-jgt-asset/earningsCharts')
export const exportCumulativeYieldTrend = notImpl('bus-jgt-asset/exportCumulativeYieldTrend')
export const exportEarningsCharts = notImpl('bus-jgt-asset/exportEarningsCharts')
export const exportFundTotalIncome = notImpl('bus-jgt-asset/exportFundTotalIncome')
export const exportMarketValue = notImpl('bus-jgt-asset/exportMarketValue')
export const fundTotalIncome = notImpl('bus-jgt-asset/fundTotalIncome')
export const holdExport = notImpl('bus-jgt-asset/holdExport')
export const holdList = notImpl('bus-jgt-asset/holdList')
export const holdShareDetail = notImpl('bus-jgt-asset/holdShareDetail')
export const listMarketValue = notImpl('bus-jgt-asset/listMarketValue')
export const overviewBaseInfo = notImpl('bus-jgt-asset/overviewBaseInfo')
export const positionDistribution = notImpl('bus-jgt-asset/positionDistribution')
export const positionShareHis = notImpl('bus-jgt-asset/positionShareHis')
export const positionTotalInfo = notImpl('bus-jgt-asset/positionTotalInfo')
export const queryAccountBalanceInfo = notImpl('bus-jgt-asset/queryAccountBalanceInfo')
export const queryAccountBalanceInfoManager = notImpl('bus-jgt-asset/queryAccountBalanceInfoManager')
export const queryCustomerAssetList = notImpl('bus-jgt-asset/queryCustomerAssetList')
export const queryCustomerProductShareList = notImpl('bus-jgt-asset/queryCustomerProductShareList')
export const queryHoldList = notImpl('bus-jgt-asset/queryHoldList')
export const queryRelegation = notImpl('bus-jgt-asset/queryRelegation')
export const topFundProportion = notImpl('bus-jgt-asset/topFundProportion')
export const weightingInfo = notImpl('bus-jgt-asset/weightingInfo')
