import util from '@/libs/util'
import { submitTradeOrder, getTradeOrderByClientId, listTradeOrders } from '@/api/intl/trade'
import { DomainError, createDomainError } from '@/services/intl/errors'

const inFlight = new Map()
const payloadByClientId = new Map()

function commandFingerprint (command) {
  return JSON.stringify([
    command.tradeAccountId,
    command.fundId,
    command.fundCode,
    command.side,
    command.valueType,
    String(command.value),
    command.currency,
    command.remark || ''
  ])
}

function normalizeInstruction (raw) {
  const value = raw && raw.data ? raw.data : raw
  if (!value) return null
  return {
    ...value,
    instructionId: String(value.instructionId || value.id || ''),
    clientRequestId: String(value.clientRequestId || ''),
    status: value.status || 'ACCEPTED'
  }
}

function normalizePage (raw, query = {}) {
  const source = raw && raw.data ? raw.data : raw
  const items = Array.isArray(source)
    ? source
    : (source && (source.items || source.records || source.list)) || []
  return {
    items: items.map(normalizeInstruction),
    page: Number(source && (source.page || source.current)) || Number(query.page) || 1,
    pageSize: Number(source && (source.pageSize || source.size)) || Number(query.pageSize) || 20,
    total: Number(source && source.total) || items.length
  }
}

function isResultUnknown (error) {
  return !error || error.code === 'ECONNABORTED' || error.message === 'Network Error' || (error.request && !error.response)
}

async function executeSubmit (command) {
  const attemptId = util.randomString(24)
  try {
    const raw = await submitTradeOrder(command, {
      'Idempotency-Key': command.clientRequestId,
      'X-Request-Id': attemptId
    })
    return normalizeInstruction(raw)
  } catch (error) {
    if (isResultUnknown(error)) {
      throw new DomainError({
        code: 'TRADE_RESULT_UNKNOWN',
        category: 'NETWORK',
        messageKey: 'tradeResultUnknown',
        retryable: false,
        resultUnknown: true,
        requestId: attemptId,
        cause: error
      })
    }
    const responseCode = error && error.response && error.response.data && error.response.data.code
    if (error && (error.code === '409' || error.code === 'IDEMPOTENCY_CONFLICT' || responseCode === 'IDEMPOTENCY_CONFLICT' || (error.response && error.response.status === 409))) {
      throw new DomainError({ code: 'IDEMPOTENCY_CONFLICT', category: 'CONFLICT', messageKey: 'tradeIdempotencyConflict', cause: error })
    }
    throw createDomainError(error, { messageKey: 'tradeSubmitFailed' })
  }
}

function submit (command) {
  const fingerprint = commandFingerprint(command)
  const previous = payloadByClientId.get(command.clientRequestId)
  if (previous && previous !== fingerprint) {
    return Promise.reject(new DomainError({
      code: 'IDEMPOTENCY_CONFLICT',
      category: 'CONFLICT',
      messageKey: 'tradeIdempotencyConflict'
    }))
  }
  if (inFlight.has(fingerprint)) return inFlight.get(fingerprint)
  payloadByClientId.set(command.clientRequestId, fingerprint)
  const promise = executeSubmit(command)
  inFlight.set(fingerprint, promise)
  const clear = () => inFlight.delete(fingerprint)
  promise.then(clear, clear)
  return promise
}

async function getByClientRequestId (clientRequestId) {
  return normalizeInstruction(await getTradeOrderByClientId(clientRequestId))
}

async function list (query = {}) {
  return normalizePage(await listTradeOrders(query), query)
}

export default { submit, getByClientRequestId, list }
