import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

export function mountIntlComponent (component, options = {}) {
  const { mocks = {}, stubs = {}, store: suppliedStore, ...mountOptions } = options
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = suppliedStore || new Vuex.Store({
    modules: {
      d2admin: {
        namespaced: true,
        modules: {
          locale: { namespaced: true, state: { locale: 'zh-Hans' } }
        }
      }
    }
  })
  return shallowMount(component, {
    localVue,
    store,
    mocks: {
      $t: (key, params = {}) => Object.keys(params).reduce((text, name) => text.replace(`{${name}}`, params[name]), key),
      $locale: 'zh-Hans',
      $route: { query: {} },
      $router: { push: jest.fn(), replace: jest.fn() },
      $message: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
      ...mocks
    },
    stubs: {
      'd2-container': { template: '<div><slot /></div>' },
      ...stubs
    },
    ...mountOptions
  })
}
