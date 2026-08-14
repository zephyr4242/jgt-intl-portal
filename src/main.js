// Vue
import Vue from 'vue'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
import i18nPlugin from '@/plugin/i18n'
import { resolveDataSource } from '@/services/intl/mode'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
import getMenu from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'
// 通用组件注册
import '@/views/components'
// 通用方法注册
import util from '@/libs/util'
import constant from '@/libs/constant'
// 过滤器
import '@/libs/fliter'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
// echarts
// import * as echarts from 'echarts'

import eventBus from './libs/eventBus'
// 引入Sentry
import * as Sentry from '@sentry/browser'
import directives from './directives/index'
// 引入基构通组件展示平台相关内容
import './libs/ui-demo-components'
import JyCore from '@jiyu/core'
import '@jiyu/core/lib/core.css' // 如果有css则需要引入
// 引入基构通功能埋点方法
import jgtSensorsTrack from '@/libs/jgtSensors'
// 文件域名
import '@/libs/file-domain'

import session from '@/libs/util.session'
// serviceWorker引用
import serviceWorker from '@/libs/serviceWorker'

// 引入虚拟table
import 'umy-ui/lib/theme-chalk/u-table.css'
/* import { UTable, UTableColumn } from 'umy-ui'
Vue.use(UTable)
Vue.use(UTableColumn) */

// Fail before mounting the application when the build did not explicitly
// select one, and only one, international data source.
resolveDataSource()
if (process.env.VUE_APP_DATA_SOURCE === 'mock') {
  require('@/mocks/intl/database').ensureMockDatabase()
}

Vue.use(JyCore)
// 初始化sensors
try {
  Vue.prototype.$jySensors.initSensors({
    is_track_single_page: false,
    isDev: process.env.NODE_ENV === 'development',
    showLog: false,
    heatmap: {
      custom_property: () => {
        // 比如您需要给有 data=test 属性的标签的点击事件增加自定义属性 name:'aa' ，则代码如下：
        try {
          if (router?.app?.$route?.meta?.pageId || router?.app?.$route?.meta?.flowId) {
            return {
              page_id: router.app.$route.meta.pageId,
              flow_id: router.app.$route.meta.flowId
            }
          }
        } catch (error) {

        }
        return {}
      }
    }
  })
  Vue.prototype.$jySensors.registerPage({
    business_type: 'jgt-intl',
    business_name: '国际业务门户'
  })
} catch (error) {

}
session.set('auditParamKeys', '')

Vue.prototype.$eventBus = eventBus
Vue.use(directives)

// Vue.prototype.$echarts = echarts

// backup images
const loadimage = require('../public/image/loading/loading.jpg')
const errorimage = require('../public/image/loading/loading.jpg')

Vue.prototype.util = util
Vue.prototype.constant = constant
Vue.prototype.$jgtSensorsTrack = jgtSensorsTrack
Vue.use(VueLazyload, {
  preLoad: 1.3, // proportion of pre-loading height
  error: errorimage, // src of the image upon load fail
  loading: loadimage, // src of the image while loading
  attempt: 3 // attempts count
})
// 核心插件
Vue.use(d2Admin)
Vue.use(i18nPlugin)
store.dispatch('d2admin/locale/load')
window.localStorage.setItem('jgt-intl-portal_branchHash', process.env.BRANCH_HASH || 'unknown')
window.jylog = console.log.bind(console)
// 在vue中对click添加节流处理
const on = Vue.prototype.$on
// 节流时间0.5s
const throttleTime = 500

Vue.prototype.$on = function (event, func) {
  let previous = 0
  let newFunc = func
  if (event === 'click') {
    newFunc = function () {
      const now = new Date().getTime()
      if (previous + throttleTime <= now) {
        func.apply(this, arguments)
        previous = now
      }
    }
  }
  on.call(this, event, newFunc)
}
const bakMessage = Vue.prototype.$message
Vue.prototype.$message = function (mes) {
  let t = typeof mes
  bakMessage(t.toLowerCase() === 'object'
    ? {
      showClose: true,
      ...mes
    } : {
      message: mes,
      showClose: true
    })
}
Vue.prototype.$message.success = function (mes) {
  let t = typeof mes
  bakMessage.success(t.toLowerCase() === 'object'
    ? {
      showClose: true,
      ...mes
    } : {
      message: mes,
      showClose: true
    })
}
Vue.prototype.$message.error = function (mes) {
  let t = typeof mes
  bakMessage.error(t.toLowerCase() === 'object'
    ? {
      showClose: true,
      ...mes
    } : {
      message: mes,
      showClose: true
    })
}
Vue.prototype.$message.warning = function (mes) {
  let t = typeof mes
  bakMessage.warning(t.toLowerCase() === 'object'
    ? {
      showClose: true,
      ...mes
    } : {
      message: mes,
      showClose: true
    })
}

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    let menuList = getMenu()
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet', menuList)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuList)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
    // 关闭页面过渡效果
    this.$store.dispatch('d2admin/transition/set', false)
  }
}).$mount('#app')

Sentry.init({
  Vue,
  dsn: process.env.NODE_ENV === 'production' ? window.CONFIG.SENTRY.ACCOUNT_PORTAL : process.env.VUE_APP_SENTRY,
  tracesSampleRate: 1.0,
  // release: process.env.RELEASE,
  maxValueLength: 1e10 // 单个值在被截断之前可以具有的最大字符数
})

let syntaxErrorFlag = true
window.onerror = function (e) {
  // 如果报这个错误就检查web是否有更新（这个错误是资源不存在）
  if (e?.indexOf && e.indexOf("Uncaught SyntaxError: Unexpected token '<'") !== -1) {
    if (syntaxErrorFlag) {
      eventBus.$emit('unexpectedToken')
      syntaxErrorFlag = false
      setTimeout(() => { syntaxErrorFlag = true }, 3000)
    }
  } else {
    console.error('operatorCode = ' + util.cookies.get('uuid'))
    console.error(e)
    if (e instanceof Error) {
      window.CONFIG.SENTRY.ACCOUNT_PORTAL_ENABLE && Sentry.captureException(e)
    }
  }
}

window.onunhandledrejection = function (e) {
  // 不再上报 onunhandledrejection
  console.error(e)
}

window.onload = function() {
  if (!window?.CONFIG?.SENTRY.ACCOUNT_PORTAL_ENABLE) return

  try {
    if (navigator.userAgent.toLowerCase().indexOf('electron/') === -1) return
    // 是否开启sw的全局开关，如果开启sw则文件size=0不需要清除缓存操作
    if (window.CONFIG?.SW_IS_REGISTER === '1' || util.getLocal('SW_IS_REGISTER') === '1') return
    // chrome >= 54 edge>=17 支持， 低版本浏览器直接调过这段代码
    // transferSize和decodedBodySize兼容性：
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize
    const entries = (performance && performance.getEntries && performance.getEntries()) || []

    let failedSource = []

    for (const entry of entries) {
      if (entry && ['css', 'img', 'link', 'script'].includes(entry.initiatorType)) {
        if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
          if (entry.name.includes(location.origin) && !entry.name.includes('/sensors/sa.gif') && !entry.name.includes('sentry_version')) {
            failedSource.push(entry.name)
          }
        }
      }
    }
    if (failedSource.length > 0) {
      console.error('operatorCode = ' + util.cookies.get('uuid'))
      const msg = `Resource ${failedSource.join(',')} failed to load`
      Sentry.captureException(new Error(msg))
      util.confirmClearCache()
    }
  } catch (error) {

  }
}

// 全局挂载Sentry
window.$Sentry = Sentry

// 解决el-tooltip 滚动不消失的问题
function hideToolTip () {
  const tooltips = document.getElementsByClassName('el-tooltip__popper')
  if (tooltips.length > 0) {
    tooltips[tooltips.length - 1].style.display = 'none'
  }
}
window.addEventListener('wheel', hideToolTip)
window.addEventListener('mousewheel', hideToolTip)
window.addEventListener('DOMMouseScroll', hideToolTip)
jgtSensorsTrack.mountObserver()
window.addEventListener('beforeunload', jgtSensorsTrack.unmountObserverListener)

// 注册 serviceWorker
try {
  serviceWorker.init()
  // 注册全局sw卸载事件
  eventBus.$on('handleUninstall', (callback) => {
    serviceWorker.handleUninstall(() => {
      callback && callback()
    })
  })
} catch (error) {
  console.log(error)
}
