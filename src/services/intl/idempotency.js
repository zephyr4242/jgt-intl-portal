import { createRequestId } from './normalizers'

const STORAGE_KEY = 'jgt-intl-pending-trade'

export function tradeFingerprint (payload = {}) {
  return ['tradeAccountId', 'fundId', 'side', 'valueType', 'value', 'currency']
    .map(key => `${key}:${String(payload[key] == null ? '' : payload[key])}`)
    .join('|')
}

function readPending () {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') } catch (e) { return null }
}

export function prepareClientRequest (payload) {
  const fingerprint = tradeFingerprint(payload)
  const cached = readPending()
  if (cached && cached.fingerprint === fingerprint && cached.clientRequestId) return cached
  const next = { fingerprint, clientRequestId: createRequestId(), createdAt: new Date().toISOString() }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearClientRequest (clientRequestId) {
  const cached = readPending()
  if (!clientRequestId || (cached && cached.clientRequestId === clientRequestId)) sessionStorage.removeItem(STORAGE_KEY)
}

export function getPendingClientRequest () {
  return readPending()
}
