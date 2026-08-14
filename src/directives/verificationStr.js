const verificationStr = {
  inserted: function (el, binding) {
    const input = el.querySelector('input')
    const myInput = new Event('input')
    const reg = binding.value.reg || /[^0-9.]/g
    /**
     * 判断是否是谷歌
     */
    function isChrome () {
      var browser = {
        versions: (function () {
          let u = navigator.userAgent
          // let app = navigator.appVersion
          return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            mobile:
              !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
          }
        })(),
        language: (
          navigator.browserLanguage || navigator.language
        ).toLowerCase()
      }

      if (browser.versions.webKit) {
        return true
      }

      return false
    }
    // 只有在键盘输入结束之后才出发
    input.addEventListener('compositionend', function () {
      // 判断是否是谷歌浏览器
      if (isChrome()) {
        fun()
      }
    })
    // 过滤方法
    const fun = (type = 0) => {
      let newVal = ''
      // if (type === 0) {
      //   newVal = input.value.replace(/[^\u4e00-\u9fa5\w]/g, '')
      // } else {
      //   newVal = input.value.replace(/[`~!@#$%^&*()\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, '')
      // }
      newVal = input.value.replace(reg, '')
      input.value = newVal
      input.dispatchEvent(myInput)
    }
    input.onkeyup = function () {
      fun(1)
    }
    input.onblur = function () {
      fun()
    }
  }
}

export default verificationStr
