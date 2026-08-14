import { listDividends } from '@/api/intl/dividend'
import { createDomainError } from '@/services/intl/errors'

export default {
  async list (query = {}) {
    try {
      const raw = await listDividends(query)
      const body = raw && raw.data !== undefined ? raw.data : raw || {}
      const items = body.items || body.records || body.list || (Array.isArray(body) ? body : [])
      return {
        items: items.map(item => ({
          ...item,
          dividendId: String(item.dividendId || item.id || ''),
          tradeAccountId: String(item.tradeAccountId || item.tradeAcco || ''),
          fundId: String(item.fundId || ''),
          fundCode: String(item.fundCode || item.fundId || ''),
          dividendPerUnit: item.dividendPerUnit == null ? null : String(item.dividendPerUnit),
          eligibleShares: item.eligibleShares == null ? null : String(item.eligibleShares),
          dividendAmount: item.dividendAmount == null ? null : String(item.dividendAmount),
          status: String(item.status || 'UNKNOWN').toUpperCase(),
          currency: String(item.currency || '')
        })),
        page: Number(body.page || body.pageNum || query.page || 1),
        pageSize: Number(body.pageSize || body.size || query.pageSize || 20),
        total: Number(body.total == null ? items.length : body.total)
      }
    } catch (error) {
      throw createDomainError(error, { code: 'DIVIDEND_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
  }
}
