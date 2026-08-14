import {
  MOCK_DATABASE_KEY,
  ensureMockDatabase,
  readMockTable,
  resetMockDatabase,
  writeMockTable
} from '@/mocks/intl/database'

describe('international mock database', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetMockDatabase()
  })

  it('writes the complete acceptance dataset into local storage', () => {
    const database = ensureMockDatabase()
    expect(JSON.parse(window.localStorage.getItem(MOCK_DATABASE_KEY))).toEqual(database)
    expect(database.products.length).toBeGreaterThan(0)
    expect(database.holdings.length).toBeGreaterThan(0)
    expect(database.trades.length).toBeGreaterThan(0)
    expect(database.dividends.length).toBeGreaterThan(0)
    expect(database.statements.length).toBeGreaterThan(0)
    expect(database.organizationAccount.tradeAccounts.length).toBeGreaterThan(0)
  })

  it('persists table writes and returns defensive copies', () => {
    const trades = readMockTable('trades')
    const next = [{ ...trades[0], instructionId: 'INT-PERSISTED' }, ...trades]
    writeMockTable('trades', next)
    const persisted = readMockTable('trades')
    expect(persisted[0].instructionId).toBe('INT-PERSISTED')
    persisted.shift()
    expect(readMockTable('trades')[0].instructionId).toBe('INT-PERSISTED')
  })
})
