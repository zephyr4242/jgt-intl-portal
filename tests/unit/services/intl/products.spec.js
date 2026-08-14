import mockProducts from '@/services/intl/providers/mock/products'
import { normalizeProduct } from '@/services/intl/providers/api/products'

jest.mock('@/api/intl/product', () => ({ fetchProducts: jest.fn() }))

describe('international products service', () => {
  it('returns canonical pagination and applies business filters', async () => {
    const result = await mockProducts.list({ fundType: 'EQUITY', currency: 'USD', page: 1, pageSize: 10 })
    expect(result).toEqual(expect.objectContaining({ page: 1, pageSize: 10, total: 1 }))
    expect(result.items[0]).toEqual(expect.objectContaining({ fundId: 'FUND-HK-004', fundType: 'EQUITY', currency: 'USD' }))
  })

  it('searches all localized names without changing the locale', async () => {
    const result = await mockProducts.list({ keyword: 'Opportunity', page: 1, pageSize: 10 })
    expect(result.total).toBe(1)
    expect(result.items[0].fundCode).toBe('HK0004')
  })

  it('normalizes missing NAV and minimum subscription as null', () => {
    expect(normalizeProduct({ id: 'F-1', name: 'Fund', nav: '', minInvest: '' })).toEqual(expect.objectContaining({
      fundId: 'F-1',
      nav: null,
      minimumSubscription: null
    }))
  })
})
