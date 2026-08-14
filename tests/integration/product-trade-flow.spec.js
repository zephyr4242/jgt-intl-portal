import { shallowMount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import ProductsPage from '@/views/business/products/index.vue'
import TradeConfirmDialog from '@/views/business/trade/TradeConfirmDialog.vue'

jest.mock('@/services/intl', () => ({
  products: {
    list: jest.fn().mockResolvedValue({
      items: [{ fundId: 'FUND-HK-001', fundCode: 'HK0001', name: { en: 'Fund' }, managerName: { en: 'Manager' }, fundType: 'BOND', region: 'GLOBAL', currency: 'USD', riskLevel: 'R3', nav: '1', navDate: '2026-01-01', minimumSubscription: '10000', tradableSides: ['SUBSCRIBE', 'REDEEM'] }],
      page: 1,
      pageSize: 20,
      total: 1
    })
  }
}))

const localVue = createLocalVue()
localVue.use(ElementUI)

function options (extra = {}) {
  return {
    localVue,
    mocks: {
      $t: key => key,
      $locale: 'en',
      $route: { query: {} },
      $router: { push: jest.fn() }
    },
    stubs: { 'd2-container': { template: '<div><slot /></div>' } },
    ...extra
  }
}

describe('product to trade flow', () => {
  it('navigates with only a fundId and never opens a product detail', async () => {
    const wrapper = shallowMount(ProductsPage, options())
    await wrapper.vm.$nextTick()
    const product = { fundId: 'FUND-HK-001' }
    wrapper.vm.goTrade(product)
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ path: '/trade-info/aggregation/index', query: { fundId: 'FUND-HK-001' } })
  })

  it('uses an explicit all-types tab so changing currency does not add a synthetic type filter', async () => {
    const wrapper = shallowMount(ProductsPage, options())
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeType).toBe('ALL')
    wrapper.vm.changeCurrency('HKD')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filters.currency).toBe('HKD')
    expect(require('@/services/intl').products.list).toHaveBeenLastCalledWith(expect.objectContaining({
      currency: 'HKD',
      fundType: ''
    }))
  })

  it('requires explicit risk acceptance before confirming', async () => {
    const wrapper = shallowMount(TradeConfirmDialog, options({ propsData: { visible: true, summary: { side: 'SUBSCRIBE' } } }))
    wrapper.vm.confirm()
    expect(wrapper.emitted().confirm).toBeFalsy()
    wrapper.setData({ riskAccepted: true })
    await wrapper.vm.$nextTick()
    wrapper.vm.confirm()
    expect(wrapper.emitted().confirm).toHaveLength(1)
  })
})
