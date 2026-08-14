import trades, { resetTrades } from '@/services/intl/providers/mock/trades'

describe('international trade records', () => {
  beforeEach(() => resetTrades())

  it('exposes all eight internal instruction states', async () => {
    const result = await trades.list({ page: 1, pageSize: 100 })
    expect(new Set(result.items.map(item => item.status))).toEqual(new Set([
      'ACCEPTED',
      'MANUAL_PENDING',
      'PROCESSING',
      'CONFIRMED',
      'PARTIALLY_CONFIRMED',
      'FAILED',
      'CANCELLED',
      'UNKNOWN'
    ]))
  })

  it('filters by account, direction, state and submitted date', async () => {
    const all = await trades.list({ page: 1, pageSize: 100 })
    const expected = all.items.find(item => item.status === 'FAILED')
    const result = await trades.list({
      tradeAccountId: expected.tradeAccountId,
      side: expected.side,
      status: expected.status,
      submittedFrom: expected.submittedAt.slice(0, 10),
      submittedTo: `${expected.submittedAt.slice(0, 10)}T23:59:59.999Z`,
      page: 1,
      pageSize: 20
    })
    expect(result.items).toContainEqual(expected)
  })

  it('keeps a normalized reason on failed records', async () => {
    const result = await trades.list({ status: 'FAILED', page: 1, pageSize: 20 })
    expect(result.items[0]).toEqual(expect.objectContaining({
      reasonCode: expect.any(String),
      reasonMessageKey: expect.any(String)
    }))
  })

  it('enriches records with a localized fund name', async () => {
    const result = await trades.list({ page: 1, pageSize: 20 })
    expect(result.items[0].fundName).toEqual(expect.objectContaining({
      'zh-Hans': expect.any(String),
      'zh-Hant': expect.any(String),
      en: 'Global Income Bond Fund'
    }))
  })
})
