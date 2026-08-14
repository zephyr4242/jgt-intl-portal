import { loadLocale, saveLocale } from '@/locales'
import ElementLocale from 'element-ui/lib/locale'
import elementZhCN from 'element-ui/lib/locale/lang/zh-CN'
import elementZhTW from 'element-ui/lib/locale/lang/zh-TW'
import elementEn from 'element-ui/lib/locale/lang/en'

const elementLocaleMap = {
  'zh-Hans': elementZhCN,
  'zh-Hant': elementZhTW,
  en: elementEn
}

function applyComponentLocale (locale) {
  ElementLocale.use(elementLocaleMap[locale] || elementZhCN)
}

export default {
  namespaced: true,
  state: {
    locale: loadLocale()
  },
  getters: {
    locale (state) {
      return state.locale
    }
  },
  mutations: {
    set (state, locale) {
      state.locale = locale
      saveLocale(locale)
      applyComponentLocale(locale)
    }
  },
  actions: {
    set ({ commit }, locale) {
      commit('set', locale)
    },
    /**
     * 应用启动时同步 html lang
     */
    load ({ state }) {
      saveLocale(state.locale)
      applyComponentLocale(state.locale)
    }
  }
}
