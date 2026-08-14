import { readMockTable } from '@/mocks/intl/database'
import { DomainError } from '@/services/intl/errors'

export default {
  async list (query = {}) {
    if (query.scenario === 'failure') {
      throw new DomainError({ code: 'DIVIDEND_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 20)
    const filtered = readMockTable('dividends')
      .filter(item => !query.tradeAccountId || item.tradeAccountId === query.tradeAccountId)
      .filter(item => !query.fundId || item.fundId === query.fundId)
      .filter(item => !query.status || item.status === query.status)
      .filter(item => !query.dateFrom || item.exDividendDate >= query.dateFrom)
      .filter(item => !query.dateTo || item.exDividendDate <= query.dateTo)
    const start = (page - 1) * pageSize
    return { items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length }
  }
}
