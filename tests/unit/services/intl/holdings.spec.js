import holdings from '@/services/intl/providers/mock/holdings'

describe('international holdings mock provider', () => {
  it('keeps currency groups separate and exposes decimal strings', async () => {
    const result = await holdings.list({ page: 1, pageSize: 100 })
    expect(new Set(result.items.map(item => item.currency))).toEqual(new Set(['HKD', 'USD']))
    expect(result.items.every(item => typeof item.marketValue === 'string')).toBe(true)
  })

  it('keeps negative profit and zero available shares as valid values', async () => {
    const result = await holdings.list({ page: 1, pageSize: 100 })
    expect(result.items.some(item => item.profitLoss.startsWith('-'))).toBe(true)
    expect(result.items.some(item => item.availableShares === '0.00')).toBe(true)
  })

  it('does not turn a missing NAV into zero', async () => {
    const result = await holdings.list({ scenario: 'missing-nav' })
    expect(result.items[0]).toMatchObject({ nav: null, navDate: null })
  })

  it('returns a localizable failure without stale rows', async () => {
    await expect(holdings.list({ scenario: 'failure' })).rejects.toMatchObject({
      code: 'HOLDING_QUERY_FAILED',
      retryable: true
    })
  })
})
