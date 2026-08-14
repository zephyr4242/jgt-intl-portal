export default {
  namespaced: true,
  state: { trade: null },
  mutations: {
    setTrade (state, trade) { state.trade = trade || null },
    clearTrade (state) { state.trade = null }
  }
}
