import { listProducts } from '@/api/intl/product'

function localizedText (value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      'zh-Hans': value['zh-Hans'] || value.zhHans || null,
      'zh-Hant': value['zh-Hant'] || value.zhHant || null,
      en: value.en || null
    }
  }
  return { 'zh-Hans': value || '', 'zh-Hant': value || '', en: value || '' }
}

export function normalizeProduct (raw = {}) {
  return {
    fundId: String(raw.fundId || raw.id || ''),
    fundCode: String(raw.fundCode || raw.code || raw.id || ''),
    name: localizedText(raw.name || raw.fundName),
    managerName: localizedText(raw.managerName || raw.manager),
    fundType: raw.fundType || raw.type || '',
    region: raw.region || '',
    currency: raw.currency || '',
    riskLevel: raw.riskLevel || raw.risk || '',
    nav: raw.nav == null || raw.nav === '' ? null : String(raw.nav),
    navDate: raw.navDate || null,
    minimumSubscription: raw.minimumSubscription == null || raw.minimumSubscription === ''
      ? null
      : String(raw.minimumSubscription).replace(/,/g, '').replace(/\s[A-Z]{3}$/i, ''),
    tradableSides: Array.isArray(raw.tradableSides) ? raw.tradableSides : ['SUBSCRIBE', 'REDEEM']
  }
}

function normalizePage (raw, query = {}) {
  const source = raw && raw.data ? raw.data : raw
  const items = Array.isArray(source)
    ? source
    : (source && (source.items || source.records || source.list)) || []
  return {
    items: items.map(normalizeProduct),
    page: Number(source && (source.page || source.current)) || Number(query.page) || 1,
    pageSize: Number(source && (source.pageSize || source.size)) || Number(query.pageSize) || 20,
    total: Number(source && source.total) || items.length
  }
}

async function list (query = {}) {
  const raw = await listProducts(query)
  return normalizePage(raw, query)
}

async function getTradableSelection ({ fundId, locale } = {}) {
  if (!fundId) return null
  const page = await list({ fundId, locale, page: 1, pageSize: 1 })
  return page.items.find(item => item.fundId === String(fundId)) || null
}

export default { list, getTradableSelection }
