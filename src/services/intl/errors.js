export class DomainError extends Error {
  constructor ({ code = 'SYSTEM_ERROR', category = 'SYSTEM', messageKey = 'errorSystem', retryable = false, resultUnknown = false, requestId = null, cause = null } = {}) {
    super(messageKey)
    this.name = 'DomainError'
    this.code = code
    this.category = category
    this.messageKey = messageKey
    this.retryable = retryable
    this.resultUnknown = resultUnknown
    this.requestId = requestId
    this.cause = cause
  }
}

const CODE_MAP = {
  AUTH_REVIEW_PENDING: ['AUTHORIZATION', 'authReviewPending', false],
  AUTH_REVIEW_REJECTED: ['AUTHORIZATION', 'authReviewRejected', false],
  AUTH_INVALID_CREDENTIALS: ['AUTHORIZATION', 'loginErrorInvalid', false],
  REGISTRATION_DUPLICATE: ['CONFLICT', 'registerDuplicate', false],
  IDEMPOTENCY_CONFLICT: ['CONFLICT', 'tradeIdempotencyConflict', false],
  TRADE_RESULT_UNKNOWN: ['TIMEOUT', 'tradeResultUnknown', false],
  FILE_EXPIRED: ['FILE', 'statementExpired', true]
}

export function createDomainError (input, fallback = {}) {
  if (input instanceof DomainError) return input
  const raw = input || {}
  const response = raw.response && raw.response.data
  const code = String(raw.code || (response && response.code) || fallback.code || 'SYSTEM_ERROR')
  const mapped = CODE_MAP[code]
  const timeout = raw.code === 'ECONNABORTED' || /timeout/i.test(raw.message || '')
  const network = !raw.response && !!raw.request
  return new DomainError({
    code: timeout && fallback.resultUnknown ? 'TRADE_RESULT_UNKNOWN' : code,
    category: mapped ? mapped[0] : timeout ? 'TIMEOUT' : network ? 'NETWORK' : fallback.category || 'SYSTEM',
    messageKey: mapped ? mapped[1] : fallback.messageKey || (network ? 'errorNetwork' : 'errorSystem'),
    retryable: mapped ? mapped[2] : fallback.retryable !== false,
    resultUnknown: timeout && !!fallback.resultUnknown,
    requestId: raw.requestId || (response && response.requestId) || null,
    cause: raw
  })
}
