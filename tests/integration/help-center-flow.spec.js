import { createLocalVue, mount } from '@vue/test-utils'
import ElementUI from 'element-ui'
import HelpCenter from '@/views/business/help-center/index.vue'
import { help } from '@/services/intl'

jest.mock('@/services/intl', () => ({
  help: {
    list: jest.fn(),
    getGuide: jest.fn(),
    getContact: jest.fn()
  }
}))

const localVue = createLocalVue()
localVue.use(ElementUI)
localVue.component('d2-container', {
  render (createElement) {
    return createElement('div', this.$slots.default)
  }
})

const contactContent = {
  contact: {
    phone: '+852 3900-8888',
    email: 'hk.service@jiyufund.com',
    address: 'Public address',
    serviceHours: 'Weekdays',
    serviceTeam: 'Client Service'
  }
}

const guide = {
  contentId: 'GUIDE-001',
  type: 'GUIDE',
  categoryCode: 'TRADE',
  title: 'Trade guide',
  body: 'Guide body',
  sortOrder: 10
}

async function settle (wrapper) {
  await Promise.resolve()
  await Promise.resolve()
  await wrapper.vm.$nextTick()
}

function mountPage () {
  return mount(HelpCenter, {
    localVue,
    mocks: {
      $locale: 'en',
      $t: key => key
    }
  })
}

describe('help center flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    help.getContact.mockResolvedValue(contactContent)
    help.list.mockResolvedValue({ items: [guide], page: 1, pageSize: 10, total: 1 })
    help.getGuide.mockResolvedValue(guide)
  })

  it('loads help, searches, opens a guide and clears filters', async () => {
    const wrapper = mountPage()
    await settle(wrapper)

    expect(help.list).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en', page: 1 }))
    expect(wrapper.text()).toContain('Trade guide')

    wrapper.vm.filters.keyword = 'trade'
    wrapper.vm.filters.categoryCode = 'TRADE'
    wrapper.vm.search()
    await settle(wrapper)
    expect(help.list).toHaveBeenLastCalledWith(expect.objectContaining({
      keyword: 'trade',
      categoryCode: 'TRADE'
    }))

    await wrapper.vm.viewContent(guide)
    expect(help.getGuide).toHaveBeenCalledWith({ contentId: 'GUIDE-001', locale: 'en' })
    expect(wrapper.findComponent({ name: 'HelpGuideDialog' }).vm.visible).toBe(true)

    wrapper.vm.clearFilters()
    await settle(wrapper)
    expect(wrapper.vm.filters).toEqual({ keyword: '', type: '', categoryCode: '' })
  })

  it('shows an empty-state clear action while retaining contact details', async () => {
    help.list.mockResolvedValue({ items: [], page: 1, pageSize: 10, total: 0 })
    const wrapper = mountPage()
    await settle(wrapper)

    expect(wrapper.text()).toContain('helpNoResults')
    expect(wrapper.text()).toContain('+852 3900-8888')
    expect(wrapper.text()).toContain('helpClearFilters')
  })

  it('retains static contact details when the API query fails', async () => {
    help.list.mockRejectedValue(new Error('network'))
    const wrapper = mountPage()
    await settle(wrapper)

    expect(wrapper.vm.loadError).toBe(true)
    expect(wrapper.text()).toContain('helpErrorLoad')
    expect(wrapper.text()).toContain('+852 3900-8888')
    expect(wrapper.find('a[href="mailto:hk.service@jiyufund.com"]').exists()).toBe(true)
  })
})
