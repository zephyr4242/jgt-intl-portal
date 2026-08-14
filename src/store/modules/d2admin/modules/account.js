import { MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import { userTrialLogin, userLogin, userLogout, userTokenInfo, getOrgTypeByToken } from '@/api/intl'
import store from '@/store'
import { forceCleanCookieAndLocalStorage } from '@/libs/auth'
import session from '@/libs/util.session'
import { clearDemoSession } from '@/libs/demo-auth'
import { clearAuthExpire } from '@/libs/intl-auth'
import { isMockMode } from '@/services/intl/mode'
import { t as translate } from '@/locales'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 采集材料注册用户登录
     * @param {Object} context
     * @param {Object} payload loginFacility {String} 登录设备 W-网上交易;C-客户端;P-IPAD
     * @param {Object} payload mobile {String} 手机号
     * @param {Object} payload smsCode {String} 验证码
     * @param {Object} payload smsCodeKey {String} 验证码key
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    loginOnce ({ dispatch }, {
      loginFacility = 'P',
      mobile = '',
      smsCode = '',
      smsCodeKey = '',
      handlerBusinessError = false
    } = {}) {
      return new Promise((resolve, reject) => {
        // 判断登录设备
        if (util.isPC()) {
          loginFacility = 'WEB'
        }
        // 开始请求登录接口
        userTrialLogin({
          channel: loginFacility,
          mobile,
          authCode: smsCode,
          deviceId: util.cookies.get('deviceId'),
          authCodeToken: smsCodeKey,
          handlerBusinessError
        })
          .then(async res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('uuid', res.mobile)
            util.cookies.set('token', res.token)
            // 是否是开户登录
            res.noTokenLogin = 'noTokenLogin'
            // 设置 vuex 用户信息
            await dispatch('d2admin/user/set', res, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * @description 在线开户登录接口
     * @param {Object} context
     * @param {Object} payload userName {String} 用户账号
     * @param {Object} payload loginPwd {String} 密码
     * @param {Object} payload continueLoginFlag {String} 是否机继续登录
     * @param {Object} payload deviceId {String} 登录设备ID
     * @param {Object} payload authCode {String} 验证码
     * @param {Object} payload authCodeToken {String} 验证码key
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    loginAgain ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        userLogin(data)
          .then(async res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('uuid', res.operatorCode)
            util.cookies.set('token', res.token)
            // 是否是开户登录
            res.noTokenLogin = 'noTokenLogin'
            // 设置 vuex 用户信息
            await dispatch('d2admin/user/set', res, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * @description 老系统跳转登录
     * @param {Object} token token
     */
    async tokenLogin ({ dispatch }, data) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        userTokenInfo(data)
          .then(async res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            util.cookies.set('uuid', res.operatorCode)
            util.cookies.set('token', data.token)
            // 设置 vuex 用户信息
            if (res.userLoginOrg && res.userLoginOrg.orgCode) {
              res.orgCode = res.userLoginOrg.orgCode
            }

            try {
              let resData = null
              const params = {
                handlerBusinessError: true // 隐藏该接口报错
              }
              resData = await getOrgTypeByToken(params)
              if (resData && resData.orgTypeStr && res.userLoginOrg && res.userLoginOrg.orgCode) {
                res.userLoginOrg.orgTypeStr = resData.orgTypeStr
              }
            } catch (error) {
              console.log(error)
            }

            await dispatch('d2admin/user/set', res, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     * @param {Object} payload skipRemote {Boolean} 会话已失效时跳过远端 logout
     * @param {Function} payload callback 清理后自定义回调
     */
    logout ({ commit, dispatch, rootState }, { confirm = false, skipRemote = false, callback } = {}) {
      /**
       * @description 清理本地会话并跳转登录页
       */
      async function cleanCache () {
        clearDemoSession()
        clearAuthExpire()
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        commit('intl/session/clear', null, { root: true })
        commit('intl/pending/clearTrade', null, { root: true })
        await dispatch('d2admin/page/closeAll', null, { root: true })
        store.state.storePage = { randomParam: {} }
        // 清空私募和资管承诺函session
        const promiseObj = session.getAll({ user: true })
        try {
          let keys = Object.keys(promiseObj)
          keys.forEach(key => {
            if (key.includes('_bmisQualifiedInvestorDialogFlag') || key.includes('_fundPrivateDialogFlagKey')) {
              session.set(key, false, { user: true })
            }
          })
        } catch (e) {
        }
        // 删除cookie
        forceCleanCookieAndLocalStorage()
        if (callback) {
          callback()
        } else {
          // 国际门户统一回到本站 elogin
          location.href = `${location.origin}${location.pathname}${location.search || ''}#/elogin`
        }
      }

      function remoteThenClean () {
        const operatorCode = util.cookies.get('uuid') || ''
        const token = util.cookies.get('token') || ''
        const isDemoSession = isMockMode() || !!(token && /^(demo|mock)-token-/.test(String(token))) ||
          !!(rootState.d2admin.user.info && rootState.d2admin.user.info.demoUser)

        // 本地已失效或演示会话：直接清本地，避免远端 01000106 卡住退出
        if (skipRemote || !token || isDemoSession) {
          return cleanCache()
        }
        return userLogout({
          operatorCode,
          token
        }).then(cleanCache).catch(cleanCache)
      }

      // 判断是否需要确认
      if (confirm) {
        const locale = rootState.d2admin.locale.locale
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm(translate(locale, 'personalLogoutConfirm'), translate(locale, 'commonConfirm'), {
          center: true,
          confirmButtonText: translate(locale, 'commonConfirm'),
          cancelButtonText: translate(locale, 'commonCancel'),
          cancelButtonClass: 'el-button--primary is-plain'
        })
          .then(() => remoteThenClean())
          .finally(() => {
            commit('d2admin/gray/set', false, { root: true })
          })
      } else {
        return remoteThenClean()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        // await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // DB -> store 加载基金对比
        await dispatch('d2admin/compare/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
