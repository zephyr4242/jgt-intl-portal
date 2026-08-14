/**
 * v-change 指令
 * 当内容改变时自动去除空格和换行符
 * 使用方式: v-change
 */
const change = {
  inserted: function (el, binding) {
    // 获取输入元素（可能是 input 或 textarea）
    const input = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? el : el.querySelector('input') || el.querySelector('textarea')

    if (!input) {
      console.warn('v-change 指令需要绑定到 input 或 textarea 元素上')
      return
    }

    // 中文输入法状态标记
    let isComposing = false

    // 去除空格和换行符的函数
    const removeWhitespace = (preserveCursor = false) => {
      // 如果正在使用中文输入法，不处理
      if (isComposing) {
        return
      }

      const originalValue = input.value
      // 如果值为空（null、undefined、空字符串），直接返回
      if (!originalValue) {
        return
      }

      // 去除空格和换行符（\s 包括空格、换行符、制表符等，根据需求可以改为 /[ \n\r]/g 只去除空格和换行符）
      let newValue = originalValue.replace(/\\n+/g, '')
      newValue = newValue.replace(/\\r+/g, '')
      newValue = newValue.replace(/\s+/g, '')
      newValue = newValue.replace(/\\/g, '')
      if (originalValue !== newValue) {
        // 保存光标位置（如果需要保留）
        let selectionStart = null
        let selectionEnd = null
        if (preserveCursor && input.setSelectionRange) {
          selectionStart = input.selectionStart
          selectionEnd = input.selectionEnd
        }

        // 更新值
        input.value = newValue

        // 尝试恢复光标位置（简化版：计算光标前删除的空白字符数）
        if (preserveCursor && selectionStart !== null && selectionEnd !== null) {
          try {
            // 计算光标前有多少空白字符
            const beforeCursor = originalValue.substring(0, selectionStart)
            const removedBeforeCursor = (beforeCursor.match(/\s+/g) || []).join('').length
            const beforeEnd = originalValue.substring(0, selectionEnd)
            const removedBeforeEnd = (beforeEnd.match(/\s+/g) || []).join('').length

            const newStart = Math.max(0, selectionStart - removedBeforeCursor)
            const newEnd = Math.max(0, selectionEnd - removedBeforeEnd)

            input.setSelectionRange(newStart, newEnd)
          } catch (e) {
            // 某些情况下 setSelectionRange 可能失败，忽略错误
          }
        }

        // 触发 input 事件，更新 v-model 绑定的值
        const inputEvent = new Event('input', { bubbles: true })
        input.dispatchEvent(inputEvent)
      }
    }

    // 中文输入法开始
    const handleCompositionStart = () => {
      isComposing = true
    }

    // 中文输入法结束
    const handleCompositionEnd = () => {
      isComposing = false
      // 输入法结束后处理一次
      removeWhitespace()
    }

    // 创建事件处理函数（需要保存引用以便解绑）
    const handleInput = () => removeWhitespace(false)
    const handleBlur = () => removeWhitespace(true)

    // 监听输入事件（不保留光标位置，避免输入时光标跳动）
    input.addEventListener('input', handleInput)
    // 监听失焦事件，确保失焦时也去除空白字符（保留光标位置）
    input.addEventListener('blur', handleBlur)
    // 监听中文输入法事件
    input.addEventListener('compositionstart', handleCompositionStart)
    input.addEventListener('compositionend', handleCompositionEnd)

    // 保存清理函数和 input 引用，用于解绑时使用
    el._changeDirective = {
      input,
      handleInput,
      handleBlur,
      handleCompositionStart,
      handleCompositionEnd
    }
  },

  unbind: function (el) {
    // 解绑时移除事件监听器
    if (el._changeDirective) {
      const { input, handleInput, handleBlur, handleCompositionStart, handleCompositionEnd } = el._changeDirective
      input.removeEventListener('input', handleInput)
      input.removeEventListener('blur', handleBlur)
      input.removeEventListener('compositionstart', handleCompositionStart)
      input.removeEventListener('compositionend', handleCompositionEnd)
      // 清理引用
      delete el._changeDirective
    }
  }
}

export default change
