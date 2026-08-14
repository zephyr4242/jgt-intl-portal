import { PRODUCTS } from '@/mocks/intl/products'
import { HOLDINGS } from '@/mocks/intl/holdings'
import { organizationAccount } from '@/mocks/intl/accounts'
import {
  addBatchDecimal,
  missingBatchTradeHeaders,
  normalizeBatchTradeRows,
  prepareBatchTradeCommands,
  submitBatchTradeCommands
} from '@/services/intl/batch-trade'

const context = {
  products: PRODUCTS,
  tradeAccounts: organizationAccount.tradeAccounts,
  holdings: HOLDINGS,
  locale: 'zh-Hans'
}

describe('Excel batch trade instructions', () => {
  it('accepts three-language headers and validates a subscription row', () => {
    const headers = ['基金交易賬戶', '基金代碼', '交易方向', '金額/份額', '幣種', '備註']
    expect(missingBatchTradeHeaders(headers)).toEqual([])
    const rows = normalizeBatchTradeRows([{
      'Fund Trading Account': 'TA-HK-001',
      'Fund Code': 'HK0001',
      Direction: 'SUBSCRIBE',
      'Amount/Shares': '10000.00',
      Currency: 'USD',
      Remark: 'batch acceptance'
    }], context)
    expect(rows[0]).toEqual(expect.objectContaining({ valid: true, fundId: 'FUND-HK-001', valueType: 'AMOUNT' }))
  })

  it('rejects missing required columns and cumulative over-redemption', () => {
    expect(missingBatchTradeHeaders(['基金代码', '交易方向'])).toEqual(expect.arrayContaining(['tradeAccountId', 'value', 'currency']))
    const rows = normalizeBatchTradeRows([
      { 基金交易账户: 'TA-HK-001', 基金代码: 'HK0001', 交易方向: '赎回', '金额/份额': '400000', 币种: 'USD' },
      { 基金交易账户: 'TA-HK-001', 基金代码: 'HK0001', 交易方向: 'REDEEM', '金额/份额': '300000', 币种: 'USD' }
    ], context)
    rows.forEach(row => expect(row.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ messageKey: 'batchCumulativeSharesExceeded' })
    ])))
  })

  it('uses decimal-string arithmetic for accumulated shares', () => {
    expect(addBatchDecimal('999999999999999999.99', '0.02')).toBe('1000000000000000000.01')
  })

  it('creates a separate stable key for every row and returns per-row outcomes', async () => {
    const validRows = normalizeBatchTradeRows([
      { 基金交易账户: 'TA-HK-001', 基金代码: 'HK0001', 交易方向: '申购', '金额/份额': '10000', 币种: 'USD' },
      { 基金交易账户: 'TA-HK-001', 基金代码: 'HK0002', 交易方向: '申购', '金额/份额': '50000', 币种: 'HKD' },
      { 基金交易账户: 'TA-HK-001', 基金代码: 'HK0003', 交易方向: '申购', '金额/份额': '10000', 币种: 'HKD' }
    ], context)
    const commands = prepareBatchTradeCommands(validRows)
    expect(new Set(commands.map(item => item.command.clientRequestId)).size).toBe(3)
    const submit = jest.fn(command => {
      if (command.fundCode === 'HK0002') return Promise.reject(Object.assign(new Error('unknown'), { code: 'TRADE_RESULT_UNKNOWN', resultUnknown: true }))
      if (command.fundCode === 'HK0003') return Promise.reject(Object.assign(new Error('failed'), { messageKey: 'tradeSubmitFailed' }))
      return Promise.resolve({ instructionId: 'I-1', status: 'ACCEPTED' })
    })
    const results = await submitBatchTradeCommands(commands, submit, 2)
    expect(results.map(item => item.outcome)).toEqual(['ACCEPTED', 'UNKNOWN', 'FAILED'])
    expect(submit).toHaveBeenCalledTimes(3)
  })
})
