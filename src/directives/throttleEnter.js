
import { throttle } from 'lodash'

// 修改方式: @keyup.native.enter="login" ->  v-throttleEnter="login"
// useage: v-throttleEnter:1000="login"  1s节流
// login必须是一个函数，如果不是函数，loadsh会报错
// 目前暂不支持给login函数传入入参
const throttleEnter = {
  bind: function(el, binding) {
    // 默认节流时间=500ms
    const delay = parseInt(binding.arg) || 500
    const callback = binding.value

    const throttleCallback = throttle(callback, delay)

    el.addEventListener('keyup', function(event) {
      if (event.keyCode === 13) { // 检查是否是回车键
        throttleCallback()
      }
    })
  }
}

export default throttleEnter
