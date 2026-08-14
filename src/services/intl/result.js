export function normalizePage (raw, mapItem = item => item, defaults = {}) {
  const payload = raw && raw.data && !Array.isArray(raw.data) ? raw.data : raw || {}
  const source = Array.isArray(payload) ? payload : payload.items || payload.records || payload.list || []
  const items = (Array.isArray(source) ? source : []).map(mapItem)
  const page = Number(payload.page || payload.current || defaults.page || 1)
  const pageSize = Number(payload.pageSize || payload.size || defaults.pageSize || Math.max(items.length, 20))
  const total = Number(payload.total == null ? items.length : payload.total)
  return { items, page, pageSize, total }
}

export function withMockDelay (value, delay = 80) {
  return new Promise(resolve => setTimeout(() => resolve(value), delay))
}
