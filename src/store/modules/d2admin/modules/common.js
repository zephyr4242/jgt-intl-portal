export default {
  namespaced: true,
  state: {
    // pdf预览弹窗flag
    pdfVisible: false,
    pdfOption: {
      pdfUrl: '',
      pdfTitle: ''
    }

  },
  actions: {
    setPdfVisible ({ state, dispatch, commit }, value) {
      state.pdfVisible = value
      if (value === false) {
        state.pdfOption.pdfUrl = ''
        state.pdfOption.pdfTitle = ''
      }
    },
    setPdfOption ({ state, dispatch, commit }, { pdfUrl, pdfTitle }) {
      state.pdfOption.pdfUrl = pdfUrl
      state.pdfOption.pdfTitle = pdfTitle
    }
  }
}
