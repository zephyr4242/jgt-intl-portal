import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LoginForm from '@/views/system/elogin/LoginForm.vue'
import { auth } from '@/services/intl'
import { establishAuthSession } from '@/libs/intl-auth'

jest.mock('@/views/system/elogin/dialogs/ForgotPwdDialog.vue', () => ({
  name: 'ForgotPwdDialog',
  render (h) { return h('div') }
}))
jest.mock('@/services/intl', () => ({
  auth: { login: jest.fn() }
}))
jest.mock('@/libs/intl-auth', () => ({
  establishAuthSession: jest.fn().mockResolvedValue({})
}))

const localVue = createLocalVue()
localVue.use(Vuex)

function mountLogin (redirect = '/index') {
  const store = new Vuex.Store({
    modules: {
      intl: {
        namespaced: true,
        modules: {
          session: { namespaced: true, state: { current: null }, mutations: { set: (state, value) => { state.current = value } } }
        }
      }
    }
  })
  return shallowMount(LoginForm, {
    localVue,
    store,
    mocks: {
      $t: key => key,
      $route: { query: { redirect } },
      $router: { replace: jest.fn(), push: jest.fn() },
      $message: { info: jest.fn() }
    },
    stubs: { 'jgt-lang-switch': true }
  })
}

describe('authentication access flow', () => {
  beforeEach(() => jest.clearAllMocks())

  it('establishes a session only after an approved login result', async () => {
    auth.login.mockResolvedValue({
      token: 'acceptance-token',
      operator: { operatorId: 'OP-1', email: 'approved@example.test', name: 'Approved Operator' }
    })
    const wrapper = mountLogin('/trade?fundId=FUND-HK-001')
    wrapper.setData({ loginName: 'approved@example.test', password: 'Demo123!', agreed: true })
    await wrapper.vm.handleLogin()
    expect(establishAuthSession).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith({ path: '/trade?fundId=FUND-HK-001' })
  })

  it('shows review status and does not create a session when login is blocked', async () => {
    auth.login.mockRejectedValue({ code: 'AUTH_REVIEW_PENDING', messageKey: 'authReviewPending' })
    const wrapper = mountLogin()
    wrapper.setData({ loginName: 'pending@example.test', password: 'Demo123!', agreed: true })
    await wrapper.vm.handleLogin()
    expect(wrapper.vm.errorMsg).toBe('authReviewPending')
    expect(establishAuthSession).not.toHaveBeenCalled()
  })

  it('does not redirect to an external URL supplied in the query', async () => {
    auth.login.mockResolvedValue({ token: 'acceptance-token', operator: { operatorId: 'OP-1' } })
    const wrapper = mountLogin('//malicious.example/collect')
    wrapper.setData({ loginName: 'approved@example.test', password: 'Demo123!', agreed: true })
    await wrapper.vm.handleLogin()
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith({ path: '/index' })
  })
})
