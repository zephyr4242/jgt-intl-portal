import Vue from 'vue'
// 设置页面灰度
let { OPEN_GRAY = false, GRAY_PAGE_LIST = [] } = window.CONFIG
const setGray = routeName => {
  const grayscaleClass = 'page-grayscale'
  let bodyEl = document.body
  let bindElStyle = bodyEl.getAttribute('class') || ''
  if (bindElStyle.length > 0) {
    bindElStyle = bindElStyle.split(' ')
  } else {
    bindElStyle = []
  }
  if (GRAY_PAGE_LIST.includes(routeName)) {
    bindElStyle.push(grayscaleClass)
  } else {
    let findClassIndex = bindElStyle.findIndex(item => item === grayscaleClass)
    if (findClassIndex !== -1) {
      bindElStyle.splice(findClassIndex, 1)
    }
  }
  bodyEl.setAttribute('class', bindElStyle.join(' '))
}
const setPageGray = function (routeName) {
  Vue.prototype.$nextTick(() => {
    if (OPEN_GRAY) {
      setGray(routeName)
    }
  })
}

export default setPageGray
