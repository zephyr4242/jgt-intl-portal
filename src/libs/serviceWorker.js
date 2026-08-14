import router from '@/router'
// serviceWorker 相关方法
const serviceWorker = {}
const isElectron = navigator?.userAgent?.toLowerCase()?.indexOf('electron/') > -1
const isClient = window.top && window.top.$gc

// 初始化 serviceWorker
serviceWorker.init = () => {
  // 处理兼容问题，不支持则不激活（老客户端不兼容）
  if ('serviceWorker' in navigator && !isClient) {
    // 是否开启serviceWorker的全局开关
    if (window.CONFIG?.SW_IS_REGISTER === '1' || window.localStorage.getItem('SW_IS_REGISTER') === '1') {
      // 等待页面加载完成
      window.addEventListener('load', () => {
        // 注册 serviceWorker
        navigator.serviceWorker
          .register('/openaccount/service-worker.js')
          .then(reg => {
            console.log('sw 注册成功 ' + process.env.VUE_APP_BUILD_TIME)
            // 清除缓存的方法（客户端做特殊处理）
            const runSkipWaiting = () => {
              if (isElectron && router?.history?.current?.fullPath === '/elogin') {
                // 暂时不替换，防止新客户端进入首页加载不到文件导致页面展示不正常
              } else {
                serviceWorker.handleSkipWaiting()
              }
            }
            if (reg?.waiting) {
              runSkipWaiting()
              return
            }
            // 发现 serviceWorker 有更新
            reg.onupdatefound = function () {
              const installingWorker = reg.installing
              installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                  case 'installed':
                    if (navigator.serviceWorker.controller) {
                      runSkipWaiting()
                    }
                    break
                }
              }
            }
          })
          .catch(error => {
            console.error('sw 注册失败 error：' + error)
          })
        // 监听 serviceWorker 交替
        // navigator.serviceWorker.addEventListener('controllerchange', () => {
        //   alert('---sw 替换成功---')
        //   // window.location.reload()
        // })
      })
    } else {
      // 卸载service-worker
      serviceWorker.handleUninstall(isUninstall => {
        if (isUninstall) {
          console.log('sw 卸载成功')
          window.location.reload()
        }
      })
    }
  }
}

// 清除缓存，强制等待中的service-worker被激活
serviceWorker.handleSkipWaiting = () => {
  try {
    // 处理兼容问题，不支持则不激活（老客户端不兼容）
    if ('serviceWorker' in navigator && !isClient) {
      navigator.serviceWorker.getRegistration().then(reg => {
        const worker = reg?.waiting
        if (!worker) {
          return
        }
        worker.postMessage({ type: 'SKIP_WAITING' })
        // 新客户端首页做替换后才刷新页面（为了解决客户端登录页跳首页导致页面样式问题）
        if (isElectron && router?.history?.current?.fullPath === '/index') {
          window.location.reload()
        }
      })
    }
  } catch (error) {
    console.log(error, '---handleSkipWaiting---')
  }
}

// 卸载service-worker
serviceWorker.handleUninstall = callback => {
  try {
    if ('serviceWorker' in navigator && !isClient) {
      navigator.serviceWorker.getRegistration().then(function (registration) {
        if (registration) {
          registration.unregister().then(function () {
            const event = document.createEvent('Event')
            event.initEvent('sw.unregister', true, true)
            window.dispatchEvent(event)
            if (callback) {
              const flag = true
              callback(flag)
            }
          })
        } else {
          callback && callback()
        }
      })
    } else {
      callback && callback()
    }
  } catch (error) {
    console.log(error, '---handleUninstall---')
  }
}

export default serviceWorker
