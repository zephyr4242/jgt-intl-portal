import { listHoldings } from '@/api/intl/holding'
import { createDomainError } from '@/services/intl/errors'

const pageOf = (raw, query) => {
  const body = raw && raw.data !== undefined ? raw.data : raw || {}
  const items = body.items || body.records || body.list || (Array.isArray(body) ? body : [])
  return {
    items: items.map(item => ({
      holdingId: String(item.holdingId || item.id || ''),
      tradeAccountId: String(item.tradeAccountId || item.tradeAcco || ''),
      fundId: String(item.fundId || ''),
      fundCode: String(item.fundCode || item.fundId || ''),
      fundName: item.fundName || { zhHans: null, zhHant: null, en: null },
      shares: String(item.shares == null ? '0' : item.shares),
      availableShares: String(item.availableShares == null ? '0' : item.availableShares),
      nav: item.nav == null ? null : String(item.nav),
      navDate: item.navDate || null,
      marketValue: item.marketValue == null ? null : String(item.marketValue),
      cost: item.cost == null ? null : String(item.cost),
      profitLoss: item.profitLoss == null ? (item.profit == null ? null : String(item.profit)) : String(item.profitLoss),
      profitLossRate: item.profitLossRate == null ? (item.profitRate == null ? null : String(item.profitRate).replace('%', '')) : String(item.profitLossRate),
      currency: String(item.currency || '')
    })),
    page: Number(body.page || body.pageNum || query.page || 1),
    pageSize: Number(body.pageSize || body.size || query.pageSize || 20),
    total: Number(body.total == null ? items.length : body.total)
  }
}

export default {
  async list (query = {}) {
    try {
      return pageOf(await listHoldings(query), query)
    } catch (error) {
      throw createDomainError(error, { code: 'HOLDING_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
  }
}
