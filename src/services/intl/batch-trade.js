import { createRequestId } from './normalizers'

export const MAX_BATCH_TRADE_ROWS = 100

export const BATCH_TRADE_FIELDS = Object.freeze([
  'tradeAccountId',
  'fundCode',
  'side',
  'value',
  'currency',
  'remark'
])

const REQUIRED_FIELDS = BATCH_TRADE_FIELDS.filter(field => field !== 'remark')

const HEADER_ALIASES = Object.freeze({
  tradeAccountId: ['基金交易账户', '基金交易賬戶', '交易账户', '交易賬戶', 'Fund Trading Account', 'Trade Account', 'tradeAccountId'],
  fundCode: ['基金代码', '基金代碼', 'Fund Code', 'fundCode'],
  side: ['交易方向', '方向', 'Direction', 'Side', 'side'],
  value: ['金额/份额', '金額/份額', 'Amount/Shares', 'Amount / Shares', 'Value', 'value'],
  currency: ['币种', '幣種', 'Currency', 'currency'],
  remark: ['备注', '備註', 'Remark', 'Remarks', 'remark']
})

const SIDE_ALIASES = Object.freeze({
  SUBSCRIBE: ['SUBSCRIBE', '申购', '申購'],
  REDEEM: ['REDEEM', '赎回', '贖回']
})

function normalizeHeader (value) {
  return String(value == null ? '' : value).trim().toLowerCase().replace(/\s+/g, '')
}

function normalizeValue (value) {
  return String(value == null ? '' : value).trim()
}

function aliasSet (field) {
  return HEADER_ALIASES[field].map(normalizeHeader)
}

function readCell (source, field) {
  const aliases = aliasSet(field)
  const key = Object.keys(source || {}).find(name => aliases.includes(normalizeHeader(name)))
  return key == null ? '' : normalizeValue(source[key])
}

function decimalParts (value) {
  const match = normalizeValue(value).match(/^(\d+)(?:\.(\d+))?$/)
  if (!match) return null
  return {
    integer: match[1].replace(/^0+(?=\d)/, ''),
    fraction: (match[2] || '').replace(/0+$/, '')
  }
}

export function compareBatchDecimal (left, right) {
  const a = decimalParts(left)
  const b = decimalParts(right)
  if (!a || !b) return null
  if (a.integer.length !== b.integer.length) return a.integer.length > b.integer.length ? 1 : -1
  if (a.integer !== b.integer) return a.integer > b.integer ? 1 : -1
  const length = Math.max(a.fraction.length, b.fraction.length)
  const af = a.fraction.padEnd(length, '0')
  const bf = b.fraction.padEnd(length, '0')
  return af === bf ? 0 : (af > bf ? 1 : -1)
}

export function addBatchDecimal (left, right) {
  const a = decimalParts(left)
  const b = decimalParts(right)
  if (!a || !b) return null
  const scale = Math.max(a.fraction.length, b.fraction.length)
  const leftDigits = `${a.integer}${a.fraction.padEnd(scale, '0')}`
  const rightDigits = `${b.integer}${b.fraction.padEnd(scale, '0')}`
  const maxLength = Math.max(leftDigits.length, rightDigits.length)
  let carry = 0
  let result = ''
  for (let index = 1; index <= maxLength; index += 1) {
    const sum = Number(leftDigits[leftDigits.length - index] || 0) + Number(rightDigits[rightDigits.length - index] || 0) + carry
    result = String(sum % 10) + result
    carry = Math.floor(sum / 10)
  }
  if (carry) result = String(carry) + result
  result = result.padStart(scale + 1, '0')
  if (!scale) return result.replace(/^0+(?=\d)/, '')
  const integer = result.slice(0, -scale).replace(/^0+(?=\d)/, '')
  const fraction = result.slice(-scale).replace(/0+$/, '')
  return fraction ? `${integer}.${fraction}` : integer
}

function normalizeSide (value) {
  const normalized = normalizeValue(value).toUpperCase()
  return Object.keys(SIDE_ALIASES).find(side => SIDE_ALIASES[side].some(alias => alias.toUpperCase() === normalized)) || ''
}

function addError (row, messageKey, params = {}) {
  row.errors.push({ messageKey, params })
}

function localizedName (value, locale) {
  if (!value || typeof value !== 'object') return value || ''
  return value[locale] || ''
}

export function missingBatchTradeHeaders (headers = []) {
  const normalized = headers.map(normalizeHeader)
  return REQUIRED_FIELDS.filter(field => !aliasSet(field).some(alias => normalized.includes(alias)))
}

export function normalizeBatchTradeRows (sourceRows = [], context = {}) {
  const products = context.products || []
  const tradeAccounts = context.tradeAccounts || []
  const holdings = context.holdings || []
  const locale = context.locale || 'zh-Hans'
  const rows = sourceRows.map((source, index) => {
    const accountInput = readCell(source, 'tradeAccountId')
    const fundCode = readCell(source, 'fundCode').toUpperCase()
    const sideInput = readCell(source, 'side')
    const side = normalizeSide(sideInput)
    const value = readCell(source, 'value')
    const currency = readCell(source, 'currency').toUpperCase()
    const remark = readCell(source, 'remark')
    const account = tradeAccounts.find(item => [item.tradeAccountId, item.accountNoMasked, item.accountName].includes(accountInput))
    const product = products.find(item => normalizeValue(item.fundCode).toUpperCase() === fundCode)
    const row = {
      rowNumber: index + 2,
      accountInput,
      tradeAccountId: account ? account.tradeAccountId : '',
      tradeAccountLabel: account ? (account.accountNoMasked || account.accountName || account.tradeAccountId) : accountInput,
      fundCode,
      fundId: product ? product.fundId : '',
      fundName: product ? localizedName(product.name, locale) : '',
      side,
      sideInput,
      value,
      valueType: side === 'REDEEM' ? 'SHARES' : 'AMOUNT',
      currency,
      remark,
      errors: []
    }

    if (!accountInput) addError(row, 'batchTradeAccountRequired')
    else if (!account) addError(row, 'batchTradeAccountUnknown')
    if (!fundCode) addError(row, 'batchFundCodeRequired')
    else if (!product) addError(row, 'batchFundUnknown')
    if (!sideInput) addError(row, 'batchSideRequired')
    else if (!side) addError(row, 'batchSideInvalid')
    if (!decimalParts(value) || compareBatchDecimal(value, '0') <= 0) addError(row, 'batchValueInvalid')
    if (!currency) addError(row, 'batchCurrencyRequired')
    if (remark.length > 500) addError(row, 'tradeRemarkTooLong')

    if (account && currency && Array.isArray(account.supportedCurrencies) && !account.supportedCurrencies.includes(currency)) {
      addError(row, 'batchAccountCurrencyUnsupported', { currency })
    }
    if (product && currency && product.currency !== currency) {
      addError(row, 'batchCurrencyMismatch', { currency: product.currency })
    }
    if (product && side && !product.tradableSides.includes(side)) addError(row, 'batchSideUnavailable')
    if (product && side === 'SUBSCRIBE' && decimalParts(value)) {
      if (product.minimumSubscription == null) addError(row, 'tradeMinimumUnavailable')
      else if (compareBatchDecimal(value, product.minimumSubscription) < 0) {
        addError(row, 'tradeBelowMinimum', { minimum: `${product.minimumSubscription} ${product.currency}` })
      }
    }
    if (product && account && side === 'REDEEM' && decimalParts(value)) {
      const holding = holdings.find(item => item.tradeAccountId === account.tradeAccountId && item.fundId === product.fundId)
      row.availableShares = holding ? holding.availableShares : '0'
      if (!holding || compareBatchDecimal(row.availableShares, '0') <= 0) addError(row, 'tradeNoAvailableShares')
    }
    return row
  })

  const redemptionGroups = new Map()
  rows.filter(row => row.side === 'REDEEM' && row.tradeAccountId && row.fundId && decimalParts(row.value)).forEach(row => {
    const key = `${row.tradeAccountId}|${row.fundId}`
    const group = redemptionGroups.get(key) || { total: '0', rows: [] }
    group.total = addBatchDecimal(group.total, row.value)
    group.rows.push(row)
    redemptionGroups.set(key, group)
  })
  redemptionGroups.forEach(group => {
    const available = group.rows[0].availableShares || '0'
    if (compareBatchDecimal(group.total, available) > 0) {
      group.rows.forEach(row => addError(row, 'batchCumulativeSharesExceeded', { total: group.total, available }))
    }
  })

  rows.forEach(row => { row.valid = row.errors.length === 0 })
  return rows
}

export function prepareBatchTradeCommands (rows = [], locale = 'zh-Hans') {
  return rows.map(row => ({
    rowNumber: row.rowNumber,
    command: {
      clientRequestId: createRequestId(),
      tradeAccountId: row.tradeAccountId,
      fundId: row.fundId,
      fundCode: row.fundCode,
      side: row.side,
      valueType: row.valueType,
      value: String(row.value),
      currency: row.currency,
      remark: row.remark || '',
      locale
    }
  }))
}

export async function submitBatchTradeCommands (entries = [], submit, concurrency = 3) {
  const results = new Array(entries.length)
  let cursor = 0
  async function worker () {
    while (cursor < entries.length) {
      const index = cursor
      cursor += 1
      const entry = entries[index]
      try {
        const instruction = await submit(entry.command)
        results[index] = { ...entry, outcome: 'ACCEPTED', instruction }
      } catch (error) {
        const unknown = error && (error.resultUnknown || error.code === 'TRADE_RESULT_UNKNOWN')
        results[index] = { ...entry, outcome: unknown ? 'UNKNOWN' : 'FAILED', error }
      }
    }
  }
  const workerCount = Math.min(Math.max(1, Number(concurrency) || 1), entries.length || 1)
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}
