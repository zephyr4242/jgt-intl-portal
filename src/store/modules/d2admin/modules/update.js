export default {
  namespaced: true,
  state: {
    // 更新图标
    showUpdate: false
  },
  mutations: {
    /**
     * @description 是否显示更新图标
     * @param {Boolean} showUpdate showUpdate
     */
    toShowUpdate (state, showUpdate) {
      state.showUpdate = showUpdate
    }
  }
}
