import Vue from 'vue'
import JyPreviewMask from './mask.vue'

let JyPreviewMaskConstructor = Vue.extend(JyPreviewMask)

let instance = null
const GlobalPreview = function (option = {}, visible) {
  if (Vue.prototype.$isServer) return
  if (instance) {
    document.body.removeChild(instance.$el)
  }
  instance = new JyPreviewMaskConstructor({
    data: {
      option,
      visible: visible,
      isCurrent: visible
    }
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  return instance
}
export default GlobalPreview
