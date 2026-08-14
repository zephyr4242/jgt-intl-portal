jest.mock('@/store/index', () => ({ state: { d2admin: { user: { info: {} } } } }))
jest.mock('@/libs/util.js', () => ({
  cookies: { get: jest.fn() },
  isEmpty: value => value == null || Object.keys(value).length === 0,
  isInWhiteList: jest.fn().mockResolvedValue(false),
  isIntlPortalUser: info => info?.portalType === 'intl' || info?.userLoginOrg?.orgCode === 'INTL',
  open: jest.fn()
}))

import fs from 'fs'
import path from 'path'
import store from '@/store/index'
import menuMixin from '@/layout/header-aside/components/mixin/menu'

describe('international account navigation gate', () => {
  it('recognizes both current and persisted international sessions', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../../src/libs/util.js'), 'utf8')
    expect(source).toContain("info?.portalType === 'intl'")
    expect(source).toContain("info?.userLoginOrg?.orgCode === 'INTL'")
    expect(source).toMatch(/!util\.isIntlPortalUser[\s\S]{0,160}userLoginCustomer/)
  })

  it('does not show the domestic unbound-account alert for international routes', async () => {
    const previous = store.state.d2admin.user.info
    store.state.d2admin.user.info = {
      portalType: 'intl',
      userLoginOrg: { orgCode: 'INTL' },
      userLoginCustomer: null
    }
    const context = {
      $alert: jest.fn(),
      $message: { warning: jest.fn() },
      $router: { push: jest.fn() }
    }
    try {
      await menuMixin.methods.handleMenuSelect.call(context, '/account/my-assets')
      expect(context.$alert).not.toHaveBeenCalled()
      expect(context.$router.push).toHaveBeenCalledWith({ path: '/account/my-assets' })
    } finally {
      store.state.d2admin.user.info = previous
    }
  })
})
