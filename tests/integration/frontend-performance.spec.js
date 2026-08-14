import { normalizePage } from '@/services/intl/result'
import trades from '@/services/intl/providers/mock/trades'
import { resetTrades } from '@/services/intl/providers/mock/trades'

describe('frontend performance and submit lock feedback', () => {
  beforeEach(() => resetTrades())

  it('filters and paginates a 500-row acceptance data set within 200ms', () => {
    const rows = Array.from({ length: 500 }, (_, index) => ({
      fundId: `FUND-${index}`,
      fundName: `Acceptance Fund ${index}`,
      currency: index % 2 ? 'USD' : 'HKD'
    }))
    const startedAt = Date.now()
    const filtered = rows.filter(item => item.currency === 'USD' && item.fundName.includes('Fund'))
    const page = normalizePage({ items: filtered.slice(0, 20), total: filtered.length, page: 1, pageSize: 20 })
    expect(Date.now() - startedAt).toBeLessThan(200)
    expect(page.items).toHaveLength(20)
    expect(page.total).toBe(250)
  })

  it('coalesces immediate duplicate submissions into one instruction', async () => {
    const command = {
      clientRequestId: 'performance-lock-001',
      tradeAccountId: 'TA-HK-001',
      fundId: 'FUND-HK-001',
      fundCode: 'HK0001',
      side: 'SUBSCRIBE',
      valueType: 'AMOUNT',
      value: '10000',
      currency: 'USD',
      remark: ''
    }
    const startedAt = Date.now()
    const [first, second] = await Promise.all([trades.submit(command), trades.submit(command)])
    expect(Date.now() - startedAt).toBeLessThan(500)
    expect(first.instructionId).toBe(second.instructionId)
    const page = await trades.list({ page: 1, pageSize: 100 })
    expect(page.items.filter(item => item.clientRequestId === command.clientRequestId)).toHaveLength(1)
  })
})
