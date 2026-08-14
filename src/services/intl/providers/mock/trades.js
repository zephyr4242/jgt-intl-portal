import { INITIAL_TRADES, TRADE_SCENARIOS, createAcceptedInstruction } from '@/mocks/intl/trades'
import { readMockTable, writeMockTable } from '@/mocks/intl/database'
import { DomainError } from '@/services/intl/errors'

let scenario = TRADE_SCENARIOS.success
let instructions = readMockTable('trades')
const byClientId = new Map()
const payloadByClientId = new Map()

function indexInstructions () {
  instructions.forEach(item => {
    byClientId.set(item.clientRequestId, item)
    payloadByClientId.set(item.clientRequestId, fingerprint(item))
  })
}

function domainError (code, messageKey = code) {
  return new DomainError({
    code,
    category: code === 'TRADE_RESULT_UNKNOWN' ? 'NETWORK' : 'BUSINESS',
    messageKey,
    retryable: false,
    resultUnknown: code === 'TRADE_RESULT_UNKNOWN'
  })
}

function decimalParts (value) {
  const match = String(value == null ? '' : value).trim().match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) return null
  return { integer: match[1].replace(/^0+(?=\d)/, ''), fraction: (match[2] || '').replace(/0+$/, '') }
}

export function compareDecimal (left, right) {
  const a = decimalParts(left)
  const b = decimalParts(right)
  if (!a || !b) return null
  if (a.integer.length !== b.integer.length) return a.integer.length > b.integer.length ? 1 : -1
  if (a.integer !== b.integer) return a.integer > b.integer ? 1 : -1
  const length = Math.max(a.fraction.length, b.fraction.length)
  const af = a.fraction.padEnd(length, '0')
  const bf = b.fraction.padEnd(length, '0')
  if (af === bf) return 0
  return af > bf ? 1 : -1
}

export function validateTradeCommand (command, product, holding) {
  if (!command || !command.clientRequestId || !command.tradeAccountId || !product) return 'TRADE_INVALID'
  if (!['SUBSCRIBE', 'REDEEM'].includes(command.side)) return 'TRADE_SIDE_INVALID'
  const parsed = decimalParts(command.value)
  if (!parsed || compareDecimal(command.value, '0') <= 0) return 'TRADE_VALUE_INVALID'
  if (!product.tradableSides.includes(command.side)) return 'TRADE_SIDE_UNAVAILABLE'
  if (command.currency !== product.currency) return 'TRADE_CURRENCY_MISMATCH'
  if (command.side === 'SUBSCRIBE') {
    if (command.valueType !== 'AMOUNT') return 'TRADE_VALUE_TYPE_INVALID'
    if (!product.minimumSubscription) return 'TRADE_MINIMUM_UNAVAILABLE'
    if (compareDecimal(command.value, product.minimumSubscription) < 0) return 'TRADE_BELOW_MINIMUM'
  }
  if (command.side === 'REDEEM') {
    if (command.valueType !== 'SHARES') return 'TRADE_VALUE_TYPE_INVALID'
    if (!holding || compareDecimal(holding.availableShares, '0') <= 0) return 'TRADE_NO_AVAILABLE_SHARES'
    if (compareDecimal(command.value, holding.availableShares) > 0) return 'TRADE_INSUFFICIENT_SHARES'
  }
  return null
}

function fingerprint (command) {
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

function withFundName (instruction) {
  const product = readMockTable('products').find(item => item.fundId === instruction.fundId || item.fundCode === instruction.fundCode)
  return { ...instruction, fundName: instruction.fundName || (product && product.name) }
}

export function setTradeScenario (nextScenario) {
  scenario = nextScenario
}

export function resetTrades () {
  scenario = TRADE_SCENARIOS.success
  instructions = INITIAL_TRADES.slice()
  writeMockTable('trades', instructions)
  byClientId.clear()
  payloadByClientId.clear()
  indexInstructions()
}

async function submit (command) {
  const existingFingerprint = payloadByClientId.get(command.clientRequestId)
  const nextFingerprint = fingerprint(command)
  if (existingFingerprint && existingFingerprint !== nextFingerprint) {
    throw domainError('IDEMPOTENCY_CONFLICT', 'tradeIdempotencyConflict')
  }
  if (byClientId.has(command.clientRequestId)) return { ...byClientId.get(command.clientRequestId) }

  const product = readMockTable('products').find(item => item.fundId === command.fundId)
  const holding = readMockTable('holdings').find(item => item.tradeAccountId === command.tradeAccountId && item.fundId === command.fundId)
  const validationError = validateTradeCommand(command, product, holding)
  if (validationError) throw domainError(validationError, `trade.${validationError}`)

  payloadByClientId.set(command.clientRequestId, nextFingerprint)
  if (scenario === TRADE_SCENARIOS.explicitFailure) {
    payloadByClientId.delete(command.clientRequestId)
    throw domainError('TRADE_REJECTED', 'tradeSubmitFailed')
  }
  if (scenario === TRADE_SCENARIOS.resultUnknown) {
    throw domainError('TRADE_RESULT_UNKNOWN', 'tradeResultUnknown')
  }

  const instruction = withFundName(createAcceptedInstruction(command, instructions.length + 1))
  instructions.unshift(instruction)
  writeMockTable('trades', instructions)
  byClientId.set(command.clientRequestId, instruction)
  return { ...instruction }
}

async function getByClientRequestId (clientRequestId) {
  const item = byClientId.get(clientRequestId)
  return item ? withFundName(item) : null
}

async function list (query = {}) {
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20))
  const filtered = instructions.filter(item => {
    if (query.tradeAccountId && item.tradeAccountId !== query.tradeAccountId) return false
    if (query.fundId && item.fundId !== query.fundId) return false
    if (query.side && item.side !== query.side) return false
    if (query.status && item.status !== query.status) return false
    if (query.submittedFrom && item.submittedAt < query.submittedFrom) return false
    if (query.submittedTo && item.submittedAt > query.submittedTo) return false
    return true
  })
  const start = (page - 1) * pageSize
  return { items: filtered.slice(start, start + pageSize).map(withFundName), page, pageSize, total: filtered.length }
}

export default { submit, getByClientRequestId, list }

indexInstructions()
