export function localize (value, locale = 'zh-Hans') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value == null ? null : value
  return value[locale] || null
}

export function decimalString (value) {
  if (value === null || value === undefined || value === '') return null
  return String(value).replace(/,/g, '').replace(/%$/, '')
}

export function normalizeTradeStatus (value) {
  const code = String(value == null ? '' : value).toUpperCase()
  const map = {
    '9': 'ACCEPTED',
    PENDING: 'MANUAL_PENDING',
    ACCEPTED: 'ACCEPTED',
    MANUAL_PENDING: 'MANUAL_PENDING',
    '1': 'PROCESSING',
    PROCESSING: 'PROCESSING',
    '2': 'CONFIRMED',
    SUCCESS: 'CONFIRMED',
    CONFIRMED: 'CONFIRMED',
    PARTIAL: 'PARTIALLY_CONFIRMED',
    PARTIALLY_CONFIRMED: 'PARTIALLY_CONFIRMED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    CANCELED: 'CANCELLED',
    UNKNOWN: 'UNKNOWN'
  }
  return map[code] || 'UNKNOWN'
}

export function createRequestId () {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes).map(v => v.toString(16).padStart(2, '0')).join('')
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`
}
