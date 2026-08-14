jest.mock('@/services/intl', () => ({
  holdings: { list: jest.fn() },
  trades: { list: jest.fn() }
}))

import { holdings, trades } from '@/services/intl'
import HoldingsPage from '@/views/business/holdings'
import TransactionsPage from '@/views/business/transactions'

describe('account core record page state', () => {
  beforeEach(() => jest.clearAllMocks())

  it('clears old holdings while loading a fresh query', async () => {
    let finish
    holdings.list.mockReturnValue(new Promise(resolve => { finish = resolve }))
    const context = {
      loading: false,
      error: null,
      items: [{ holdingId: 'stale' }],
      query: { page: 1, pageSize: 20 },
      $locale: 'en'
    }
    const request = HoldingsPage.methods.load.call(context)
    expect(context.items).toEqual([])
    finish({ items: [{ holdingId: 'fresh' }] })
    await request
    expect(context.items).toEqual([{ holdingId: 'fresh' }])
  })

  it('does not retain stale transactions after a failed query', async () => {
    const failure = { code: 'TRADE_QUERY_FAILED', messageKey: 'errors.queryFailed' }
    trades.list.mockRejectedValue(failure)
    const context = {
      loading: false,
      error: null,
      items: [{ instructionId: 'stale' }],
      total: 1,
      query: { page: 1, pageSize: 20 },
      dateRange: [],
      $locale: 'en'
    }
    await TransactionsPage.methods.load.call(context)
    expect(context.items).toEqual([])
    expect(context.total).toBe(0)
    expect(context.error).toBe(failure)
  })
})
