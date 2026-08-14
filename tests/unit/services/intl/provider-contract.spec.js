import provider from '@/services/intl/providers/mock'

describe('international provider contract', () => {
  it('exposes every approved capability through one provider', () => {
    expect(Object.keys(provider).sort()).toEqual([
      'accounts', 'auth', 'dashboard', 'dividends', 'help', 'holdings',
      'products', 'statements', 'trades'
    ])
  })

  it('returns canonical pages and dashboard fields', async () => {
    const [summary, products, holdings, trades, dividends, statements, help] = await Promise.all([
      provider.dashboard.getSummary(),
      provider.products.list({ page: 1, pageSize: 2 }),
      provider.holdings.list({ page: 1, pageSize: 2 }),
      provider.trades.list({ page: 1, pageSize: 2 }),
      provider.dividends.list({ page: 1, pageSize: 2 }),
      provider.statements.list({ page: 1, pageSize: 2 }),
      provider.help.list({ locale: 'en', page: 1, pageSize: 2 })
    ])
    expect(summary).toEqual(expect.objectContaining({ accountCount: expect.any(Number), asOf: expect.any(String) }))
    ;[products, holdings, trades, dividends, statements, help].forEach(page => {
      expect(page).toEqual(expect.objectContaining({
        items: expect.any(Array), page: expect.any(Number), pageSize: expect.any(Number), total: expect.any(Number)
      }))
    })
  })

  it('does not hide query failures behind successful mock-shaped data', async () => {
    await expect(provider.holdings.list({ scenario: 'failure' })).rejects.toMatchObject({ name: 'DomainError' })
    await expect(provider.dividends.list({ scenario: 'failure' })).rejects.toMatchObject({ name: 'DomainError' })
    await expect(provider.statements.list({ scenario: 'failure' })).rejects.toMatchObject({ name: 'DomainError' })
  })
})
