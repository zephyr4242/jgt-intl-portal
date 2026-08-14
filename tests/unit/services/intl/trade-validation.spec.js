import { PRODUCTS } from '@/mocks/intl/products'
import { HOLDINGS } from '@/mocks/intl/holdings'
import { compareDecimal, validateTradeCommand } from '@/services/intl/providers/mock/trades'

function command (overrides = {}) {
  return {
    clientRequestId: 'client-1',
    tradeAccountId: 'TA-HK-001',
    fundId: 'FUND-HK-001',
    fundCode: 'HK0001',
    side: 'SUBSCRIBE',
    valueType: 'AMOUNT',
    value: '10000.00',
    currency: 'USD',
    ...overrides
  }
}

describe('trade validation', () => {
  const product = PRODUCTS[0]
  const holding = HOLDINGS[0]

  it('compares decimal strings without losing precision', () => {
    expect(compareDecimal('100000000000000000.01', '100000000000000000.001')).toBe(1)
    expect(compareDecimal('1.00', '1')).toBe(0)
  })

  it('enforces the minimum subscription amount', () => {
    expect(validateTradeCommand(command({ value: '9999.99' }), product, holding)).toBe('TRADE_BELOW_MINIMUM')
    expect(validateTradeCommand(command(), product, holding)).toBeNull()
  })

  it('enforces available shares and supports full redemption', () => {
    const redeem = command({ side: 'REDEEM', valueType: 'SHARES', value: holding.availableShares })
    expect(validateTradeCommand(redeem, product, holding)).toBeNull()
    expect(validateTradeCommand({ ...redeem, value: '650000.01' }, product, holding)).toBe('TRADE_INSUFFICIENT_SHARES')
  })

  it('blocks subscription when minimum amount is unavailable', () => {
    const unavailable = PRODUCTS.find(item => item.minimumSubscription == null)
    expect(validateTradeCommand(command({ fundId: unavailable.fundId, fundCode: unavailable.fundCode }), unavailable, HOLDINGS[2]))
      .toBe('TRADE_MINIMUM_UNAVAILABLE')
  })
})
