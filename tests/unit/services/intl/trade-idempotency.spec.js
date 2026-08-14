import trades, { resetTrades, setTradeScenario } from '@/services/intl/providers/mock/trades'
import { TRADE_SCENARIOS } from '@/mocks/intl/trades'

const base = {
  clientRequestId: 'stable-client-request',
  tradeAccountId: 'TA-HK-001',
  fundId: 'FUND-HK-001',
  fundCode: 'HK0001',
  side: 'SUBSCRIBE',
  valueType: 'AMOUNT',
  value: '10000.00',
  currency: 'USD',
  remark: ''
}

describe('trade idempotency', () => {
  beforeEach(resetTrades)

  it('replays the original instruction for the same key and payload', async () => {
    const first = await trades.submit(base)
    const replay = await trades.submit(base)
    expect(replay.instructionId).toBe(first.instructionId)
    const records = await trades.list({ page: 1, pageSize: 20 })
    expect(records.items.filter(item => item.clientRequestId === base.clientRequestId)).toHaveLength(1)
  })

  it('collapses concurrent double-click submissions into one instruction', async () => {
    const [first, second] = await Promise.all([trades.submit(base), trades.submit(base)])
    expect(first.instructionId).toBe(second.instructionId)
    const records = await trades.list({ page: 1, pageSize: 20 })
    expect(records.items.filter(item => item.clientRequestId === base.clientRequestId)).toHaveLength(1)
  })

  it('rejects the same key with a different payload', async () => {
    await trades.submit(base)
    await expect(trades.submit({ ...base, value: '10001.00' })).rejects.toEqual(expect.objectContaining({ code: 'IDEMPOTENCY_CONFLICT' }))
  })

  it('keeps an unknown request queryable by client id without inventing success', async () => {
    setTradeScenario(TRADE_SCENARIOS.resultUnknown)
    await expect(trades.submit(base)).rejects.toEqual(expect.objectContaining({ code: 'TRADE_RESULT_UNKNOWN', resultUnknown: true }))
    await expect(trades.getByClientRequestId(base.clientRequestId)).resolves.toBeNull()
  })
})
