import { readMockTable } from '@/mocks/intl/database'
import { DomainError } from '@/services/intl/errors'

const EXTRAS = {
  'HOLDING-001': { cost: '11000000.00', profitLoss: '-410700.00', profitLossRate: '-3.7336' },
  'HOLDING-002': { cost: '132500000.00', profitLoss: '11160000.00', profitLossRate: '8.4226' },
  'HOLDING-003': { cost: '19500.00', profitLoss: '-535.00', profitLossRate: '-2.7436' }
}

const localizedKeyword = (value, keyword) => {
  if (!keyword) return true
  const names = value && typeof value === 'object' ? Object.values(value).join(' ') : String(value || '')
  return names.toLowerCase().includes(String(keyword).trim().toLowerCase())
}

export default {
  async list (query = {}) {
    if (query.scenario === 'failure') {
      throw new DomainError({ code: 'HOLDING_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 20)
    const filtered = readMockTable('holdings')
      .map((item, index) => ({
        ...item,
        ...(EXTRAS[item.holdingId] || {}),
        ...(query.scenario === 'missing-nav' && index === 0 ? { nav: null, navDate: null } : {})
      }))
      .filter(item => !query.tradeAccountId || item.tradeAccountId === query.tradeAccountId)
      .filter(item => !query.fundId || item.fundId === query.fundId)
      .filter(item => !query.currency || item.currency === query.currency)
      .filter(item => !query.keyword || String(item.fundCode).toLowerCase().includes(String(query.keyword).toLowerCase()) || localizedKeyword(item.fundName, query.keyword))
    const start = (page - 1) * pageSize
    return { items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length }
  }
}
