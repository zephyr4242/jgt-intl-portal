export default {
  namespaced: true,
  state: { current: null },
  mutations: {
    set (state, session) { state.current = session || null },
    clear (state) { state.current = null }
  }
}
