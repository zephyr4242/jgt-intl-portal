import sticky from './sticky'
import elTableScroll from './elTableScroll'
import verificationStr from './verificationStr'
import throttleEnter from './throttleEnter'
import change from './change'

const directives = {
  sticky,
  elTableScroll,
  verificationStr,
  throttleEnter,
  change
}

function install (Vue) {
  for (const key in directives) {
    Vue.directive(key, directives[key])
  }
}

export default {
  install
}
