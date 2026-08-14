import { readMockTable } from '@/mocks/intl/database'

function includesText (value, keyword) {
  if (value && typeof value === 'object') return Object.values(value).some(item => includesText(item, keyword))
  return String(value || '').toLowerCase().includes(keyword)
}

function matches (product, query) {
  const keyword = String(query.keyword || '').trim().toLowerCase()
  if (keyword && ![
    product.fundCode,
    product.name,
    product.managerName
  ].some(value => includesText(value, keyword))) return false
  if (query.fundId && product.fundId !== String(query.fundId)) return false
  if (query.fundType && product.fundType !== query.fundType) return false
  if (query.region && product.region !== query.region) return false
  if (query.currency && product.currency !== query.currency) return false
  if (query.riskLevel && product.riskLevel !== query.riskLevel) return false
  return true
}

async function list (query = {}) {
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20))
  const all = readMockTable('products').filter(product => matches(product, query))
  const start = (page - 1) * pageSize
  return {
    items: all.slice(start, start + pageSize).map(item => ({ ...item })),
    page,
    pageSize,
    total: all.length
  }
}

async function getTradableSelection ({ fundId } = {}) {
  const product = readMockTable('products').find(item => item.fundId === String(fundId))
  return product ? { ...product } : null
}

export default { list, getTradableSelection }
