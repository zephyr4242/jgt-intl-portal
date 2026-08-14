import dividends from '@/services/intl/providers/mock/dividends'

describe('international dividends mock provider', () => {
  it('returns formal fields and currency for every record', async () => {
    const result = await dividends.list({ page: 1, pageSize: 20 })
    expect(result.items.length).toBeGreaterThan(0)
    result.items.forEach(item => {
      expect(item).toEqual(expect.objectContaining({
        dividendId: expect.any(String),
        eligibleShares: expect.any(String),
        dividendAmount: expect.any(String),
        currency: expect.stringMatching(/^[A-Z]{3}$/),
        status: expect.any(String)
      }))
    })
  })

  it('filters by account, status and ex-dividend date', async () => {
    const result = await dividends.list({
      tradeAccountId: 'TA-HK-001',
      status: 'PAID',
      dateFrom: '2026-05-01',
      dateTo: '2026-05-31'
    })
    expect(result.total).toBe(1)
    expect(result.items[0].dividendId).toBe('div-demo-001')
  })
})
