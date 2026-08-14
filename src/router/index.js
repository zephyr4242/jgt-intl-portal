import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
import cookies from '@/libs/util.cookies.js'
import { forceCleanCookieAndLocalStorage, authInit } from '@/libs/auth'
import { isAuthTokenExpiredLocally, clearAuthExpire } from '@/libs/intl-auth'
import setPageGray from '@/libs/pageGray.js'
import { t as translate } from '@/locales'
// 路由数据
import routes from './routes'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
NProgress.configure({ parent: '#app' })

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  to.meta.loadStartTime = new Date().getTime()

  try {
    to.meta.pageId = util.genNonDuplicateID(16)
    if (Vue.prototype.$jgtSensorsTrack && from.meta.loadStartTime) {
      Vue.prototype.$jgtSensorsTrack.pageStayDuration({
        page_stay_time: (to.meta.loadStartTime - from.meta.loadStartTime) / 1000
      })
    }
  } catch (error) {

  }
  try {
    if (to.query.sourcepage) {
      util.cookies.set('channelSourceName', to.query.sourcepage)
      util.goLoginJGT()
      return false
    }
  } catch (error) {

  }
  const versionKey = 'account-portal-version'
  const version = '20230611'
  const userVersion = util.cookies.get(versionKey)
  // 当版本不一致，清理所有缓存然后刷新页面, 避免缓存污染
  if (userVersion !== version) {
    // 清理cookeis和localstorage
    forceCleanCookieAndLocalStorage()

    // 清理完成设置version
    util.cookies.set(versionKey, version)
    // localStorage.setItem('electronVersion', process.env.VUE_APP_VERSION)
    // 刷新页面，使用url上的token进入页面
    location.reload()
    return
  }
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 获取客户端window用户信息并注册到Vue原型
  const $clientWindow = window.top
  // 客户端Window
  Vue.prototype.$clientWindow = $clientWindow || null
  const $clientUserInfo = $clientWindow && $clientWindow.$gc ? $clientWindow.$gc : null
  // 是否是客户端(换肤)
  Vue.prototype.$isClient = !!$clientUserInfo
  Vue.prototype.$isElectron = navigator?.userAgent?.toLowerCase()?.indexOf('electron/') > -1
  Vue.prototype.$isMac = window.process && window.process.platform === 'darwin'
  // 用户信息
  Vue.prototype.$clientUserInfo = $clientUserInfo || null
  // 客户端方法库
  Vue.prototype.$clientCommonFn = $clientUserInfo ? $clientWindow.index : null
  // 客户端MENUS定义表,重开窗口需要在客户端定义MENUS
  Vue.prototype.$OPERATOR_MENUS = $clientUserInfo ? $clientWindow.CONST.OPERATOR_MENUS : null

  if (Vue.prototype.$isClient) {
    // 客户端跳转Url  配置项
    Vue.prototype.$clientUrl = 'clientnewroot/index.html/#/'
    // 客户端重新设置cookies信息
    util.cookies.set('token', $clientUserInfo.token || '')
    util.cookies.set('orgCode', $clientUserInfo.orgCode || '')
    util.cookies.set('uuid', $clientUserInfo.operatorCode || '')
    const local = JSON.parse(localStorage.getItem('jgt'))
    const localInfo = local?.sys?.user[$clientUserInfo.operatorCode]?.user?.info
    const localFofundNo = localInfo?.userLoginCustomer?.fofundNo
    if (!localStorage.getItem('againLogin') || !localInfo || (localInfo && !localFofundNo)) {
      // 重新请求用户信息
      await authInit($clientUserInfo.token, store.state.d2admin.user.info)
      localStorage.setItem('againLogin', 'againLogin')
    }
  } else {
    // 进度条
    NProgress.start()
  }

  if (to.query.token) {
    cookies.remove('token')
  }
  const token = cookies.get('token')
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    const operatorCode = util.cookies.get('uuid')
    const userInfo = store.state.d2admin.user.info
    if (userInfo && userInfo.operatorCode && operatorCode && userInfo.operatorCode !== operatorCode) {
      // 切换账号后，之前已经打开的浏览器tab内，再点击页面小tab时，内存中的账户信息，与新登录的信息不同
      // 内存中的open的信息会写入localStorage
      // 内存中的operatorCode 与 cookie中的不一样
      console.log('内存中的operatorCode 与 cookie中的不一样', userInfo.operatorCode, operatorCode)
      // await store.dispatch('d2admin/page/closeAll', null, { root: true })
      location.reload()
      // 进度条
      NProgress.done()
      return
    }

    // 登录后，多页面操作时, 若其中一个页面切换过账号，则刷新
    try {
      // 有操作员operatorCode才判断
      if (!util.isEmpty(operatorCode)) {
        const local = JSON.parse(localStorage.getItem('jgt'))
        const localInfo = local?.sys?.user[operatorCode]?.user?.info
        if (localInfo) {
          const localFofundNo = localInfo?.userLoginCustomer?.fofundNo
          const vuexFofundNo = userInfo?.userLoginCustomer?.fofundNo
          if (localFofundNo && localFofundNo !== vuexFofundNo) {
            location.reload()
            NProgress.done()
            return
          }
        }
      }
    } catch (error) {
    }

    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      // 本地会话 TTL 到期：清缓存并跳登录（不依赖接口返回 01000106）
      if (!$clientUserInfo && isAuthTokenExpiredLocally()) {
        clearAuthExpire()
        forceCleanCookieAndLocalStorage()
        next({
          name: 'elogin',
          query: {
            redirect: to.fullPath
          }
        })
        NProgress.done()
        return
      }
      // next()
      if ($clientUserInfo) {
        next()
      } else {
        const menuList = JSON.parse(localStorage.getItem('menuList')) || []
        let isNoRouter = menuList && Array.isArray(menuList) && menuList.length ? util.noRouter(menuList, to) : false
        // 首次开通 or 已有账户登录，不要鉴权跳转首页
        if (util.cookies.get('isNormalLogin') === '0' && (to.fullPath.includes('/account-info') || to.fullPath.includes('/account/list') || to.fullPath.includes('/org-info'))) {
          next()
        } else if (isNoRouter) {
          await store.dispatch('d2admin/page/closeAll', null, { root: true })
          next({ name: 'index' })
          NProgress.done()
        } else {
          next()
        }
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      if (to.query && to.query.token) {
        util.cookies.set('isNormalLogin', '1')

        util.cookies.set('token', to.query.token)
        // 重新请求用户信息
        await authInit(to.query.token, store.state.d2admin.user.info, true)
        util.removeLocal('saveParams_trade_orgManage')
        util.removeLocal('saveParams_trade_account')
        util.removeLocal('saveParams_assets')
        const menuList = store.state.d2admin.user && store.state.d2admin.user.info && store.state.d2admin.user.info.userLoginOrg ? store.state.d2admin.user.info.userLoginOrg.menuList : null
        let isNoRouter = menuList && Array.isArray(menuList) && menuList.length ? util.noRouter(menuList, to) : false
        next({
          name: isNoRouter ? 'personal-center-my-permission' : to.name,
          params: {
            ...to.params,
            ...to.query
          }
        })
      } else if (['/login/once', '/login/again'].includes(to.fullPath)) {

      } else {
        // 记录登录失效前的访问地址（用于重新登录后跳转回来）
        try {
          const currentPath = window.location.hash.replace('#', '')
          // 排除登录页、首页等不需要记录的页面
          if (currentPath && !currentPath.startsWith('/elogin') && !currentPath.startsWith('/login') && currentPath !== '/index' && currentPath !== '/') {
            util.cookies.set('redirectPathAfterLogin', currentPath)
          }
        } catch (error) {
          console.log(error)
        }
        forceCleanCookieAndLocalStorage()
        next({
          name: 'elogin',
          query: { redirect: to.fullPath }
        })
      }
      NProgress.done()
    }
  } else {
    next()
  }
})

router.afterEach(async (to, from) => {
  if (!Vue.prototype.$isClient) {
    // 进度条
    NProgress.done()
  }
  // 更改标题
  const locale = store.state.d2admin.locale.locale
  const pageTitle = to.meta.titleKey ? translate(locale, to.meta.titleKey) : to.meta.title
  util.title(pageTitle)
  try {
    setPageGray(to.name)
  } catch (error) {

  }

  // 多页控制 打开新的页面
  await store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(pageTitle)
  try {
    to.meta.pageLoadTime = (new Date().getTime() - to.meta.loadStartTime) / 1000
    const noSensorsRouter = [
      'fund/product/detail',
      'bmis/product/detail',
      'fund/company/detail',
      'bmis/company/detail'
    ]
    const isNoUpSensors = noSensorsRouter.some(item => {
      return to.fullPath.includes(item)
    })
    if (!isNoUpSensors) {
      // 此处手动上报 $pageview 事件
      Vue.prototype.$nextTick(() => {
        if (Vue.prototype.$jySensors) {
          Vue.prototype.$jySensors.trackSinglePageview({
            page_id: to.meta.pageId,
            flow_id: to.meta.flowId
          })
        }
      })
    }
  } catch (e) {}
})

export default router
