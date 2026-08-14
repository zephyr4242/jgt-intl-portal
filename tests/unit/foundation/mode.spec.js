import { DATA_SOURCES, resolveDataSource } from '@/services/intl/mode'

describe('international data source mode', () => {
  it('accepts only explicit mock or api values', () => {
    expect(resolveDataSource('mock')).toBe(DATA_SOURCES.MOCK)
    expect(resolveDataSource(' API ')).toBe(DATA_SOURCES.API)
    expect(() => resolveDataSource('')).toThrow('VUE_APP_DATA_SOURCE')
    expect(() => resolveDataSource('auto')).toThrow('VUE_APP_DATA_SOURCE')
  })
})
