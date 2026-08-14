import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import intl from './modules/intl'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    d2admin,
    intl,
    storePage: {
      namespaced: true,
      modules: {
        randomParam: {}
      }
    }
  }
})
