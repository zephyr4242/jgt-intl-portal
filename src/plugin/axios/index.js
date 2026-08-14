import store from '@/store'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util'
import { authInit } from '@/libs/auth'
import qs from 'qs'
import { getBaseUrl } from '@/config'
// 引入基构通功能埋点方法
import jgtSensorsTrack from '@/libs/jgtSensors'
// 创建一个错误
function errorCreate (msg, response) {
  const error = new Error(msg)
  errorLog(error)

  if (window.CONFIG.SENTRY?.ACCOUNT_PORTAL_ENABLE) {
    // msg中有error/异常/系统 或者code中有9999 则触发告警
    const warningWord = window.CONFIG.SENTRY.KEYWORDS || ['error', '异常', '系统', 'not found', 'timeout']
    if (warningWord.find(i => msg?.toLowerCase().includes(i)) || response?.data?.code.includes('9999')) {
      console.error(
        'operatorCode = ' + store.state.d2admin?.user?.info?.operatorCode,
        'traceId = ' + JSON.stringify(response.config?.headers?.traceId),
        '\nrequest = ' + JSON.stringify(response.config?.data),
        '\nresponse = ' + JSON.stringify(response?.data))

      window.$Sentry.captureException(new Error(`path:${response.config.url} code:${response.data?.code} msg:${msg}`))
    }
  }

  throw new Error(msg)
}
const isClient = window.top && window.top.$gc
const isNoNeedLoginUrl = '/user/toggle-login'
// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
  }
  if (error.message === 'Request aborted') {
    return false
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000,
    showClose: true
  })
}

// 创建一个 axios 实例
const service = axios.create({
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
  baseURL: getBaseUrl(),
  timeout: 240000 // 请求超时时间
})
const fofundResearch = '/fofund-research'
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.baseURL = getBaseUrl()
    const token = util.cookies.get('token')
    // 让每个请求携带token，token为自定义key 请根据实际情况自行修改
    if (!config.url.includes(fofundResearch)) {
      config.headers['token'] = token || ''
    }
    if (!config.url.includes('/gateway-http')) {
      // 1-前端 0-运营后台
      config.headers['frontFlag'] = '1'
    }
    // 禁用缓存
    config.headers['Cache-Control'] = 'no-cache'
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // 当前设备id
    config.headers['deviceFid'] = util.getDeviceId()
    if (util.isElectron()) {
      config.headers['platform'] = 'Win'
    }
    if (!isClient) {
      if (localStorage.getItem('jgt-feign-version')) {
        config.headers['feign-version'] = localStorage.getItem('jgt-feign-version')
      }
      if (window.localStorage.getItem('jgt-iaVersionHost')) {
        config.headers['version-host-ia'] = window.localStorage.getItem('jgt-iaVersionHost')
      }
      if (window.localStorage.getItem('jgt-irVersionHost')) {
        config.headers['version-host-ir'] = window.localStorage.getItem('jgt-irVersionHost')
      }
      if (window.localStorage.getItem('jgt-etsVersionHost')) {
        config.headers['version-host-ets'] = window.localStorage.getItem('jgt-etsVersionHost')
      }
      if (window.localStorage.getItem('jgt-portalList')) {
        config.headers['portal-list'] = window.localStorage.getItem('jgt-portalList')
      }

      if (process.env.NODE_ENV !== 'production') {
        config.headers['feign-version'] = process.env.VUE_APP_BIZ_ID
      }
    }
    if (config.url.includes('/route/v1') || config.url.includes('/common20/Route')) {
      config.baseURL = '/'
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      config.data = qs.stringify(config.data)
    }

    if (config.method === 'get') {
      if (!config.params) {
        config.params = {}
      }
      config.params['timestamp'] = util.currentTime()
    }

    config.requestStart = Date.now()
    return config
  },

  error => {
    console.log(error)
    // 发送失败
    return Promise.reject(error)
  }
)

// 响应拦截器
let errorFlag = true
function errorDialog (message, messagetxt) {
  if (errorFlag) {
    errorFlag = false
    // 记录登录失效前的访问地址（用于重新登录后跳转回来）
    const currentPath = window.location.hash.replace('#', '')
    // 排除登录页、首页等不需要记录的页面
    if (currentPath && !currentPath.startsWith('/elogin') && !currentPath.startsWith('/login') && currentPath !== '/index' && currentPath !== '/') {
      util.cookies.set('redirectPathAfterLogin', currentPath)
    }

    const messageHtml = messagetxt ? `<div><p>${message}</p><p>${messagetxt}</p></div>` : ` <div><p>${message}</p></div>`
    MessageBox.alert(messageHtml, '提示', {
      center: true,
      showClose: false,
      dangerouslyUseHTMLString: true,
      customClass: 'alertConfirmButtonClass',
      confirmButtonClass: 'el-button--small'

    })
      .then(() => {
        errorFlag = true
        // skipRemote：本地会话已失效时勿再调 logout API，避免二次弹「登录已失效」
        store.dispatch('d2admin/account/logout', { confirm: false, skipRemote: true })
      })
      .catch(() => {
        errorFlag = true
        store.dispatch('d2admin/account/logout', { confirm: false, skipRemote: true })
      })
  }
}
// 被迫登出时调用客户端登出方法 登出提示为客户端默认
function clientErrLoginOutDialog () {
  const err = {
    code: '1006',
    data: null,
    msg: '您的账号在另一个地点登录，您已被迫下线，如非本人操作请尽快重置您的密码，有任何问题请拨打基构通客服热线400-820-5369。'
  }
  window.top.$ && window.top.$.commonAjaxErrorHandle && window.top.$.commonAjaxErrorHandle(err)
}

// 处理导出异常
service.interceptors.response.use(
  async response => {
    // 切换机构以后需要根据接口返回的内容重置orgCode
    const orgCode = util.cookies.get('orgCode')
    // 客户端环境加验证切换机构时不重新走该段逻辑
    // 从老基构通带token 不走这里 response.config.isType
    if (!response.config.url.includes(isNoNeedLoginUrl) && !response.config.isType && (window.top && util.isEmpty(window.top.$gc)) && !util.isEmpty(orgCode) && response.headers.orgcode && response.headers.orgcode !== orgCode) {
      // 添加锁  调接口时更新cookies中orgCode 使orgCode与新orgcode一致  不再走当前逻辑
      util.cookies.set('orgCode', response.headers.orgcode)
      store.state.d2admin.user.info.orgCode = response.headers?.orgcode
      store.dispatch('d2admin/user/set', store.state.d2admin.user.info, { root: true })
      store.dispatch('d2admin/page/closeAll', null, { root: true })

      authInit(util.cookies.get('token'), store.state.d2admin.user.info)
      localStorage.removeItem('toggleFoFundNo')
      return false
    } else {
      // 获取ets - portal切换的基煜账号
      const toggleFoFundNo = localStorage.getItem('toggleFoFundNo')
      const fofundNo = store.state.d2admin?.user?.info?.userLoginCustomer?.fofundNo
      // 不是白名单接口才做重新登陆操作
      const notWhiteApi = response.config.url.indexOf('/user/check-white-operator') === -1
      if (!response.config.isType && (window.top && util.isEmpty(window.top.$gc)) && util.notEmpty(toggleFoFundNo) && util.notEmpty(fofundNo) && toggleFoFundNo !== fofundNo && notWhiteApi) {
        localStorage.removeItem('toggleFoFundNo')
        store.dispatch('d2admin/page/closeAll', null, { root: true })
        authInit(util.cookies.get('token'), store.state.d2admin.user.info)
        return false
      }
    }
    // dataAxios 是 axios 返回数据中的 data
    try {
      if (window.CONFIG && window.CONFIG.SENSORS_SERVER && window.CONFIG.SENSORS_SERVER.sensors_enable) {
        const timeout = new Date().getTime() - response.config.requestStart
        // const cfgTime = window.CONFIG.SENSORS_SERVER.timeout || 500
        // if (timeout > cfgTime) {
        let url = response.config.url
        if (response.config.url.includes('/route/v1') || response.config.url.includes('/common20/Route')) {
          url = qs.parse(response.config.data)?.serviceName || qs.parse(response.config.data)?.api
        }
        jgtSensorsTrack.apiLoadDuration({
          api_request_para: response.config.data,
          api_request_url: url,
          api_load_time: timeout / 1000,
          if_error: '否'
        })
        // }
      }
    } catch (error) {
      console.log(error)
    }
    let dataAxios = response.data
    // 这个状态码是和后端约定的
    if (Object.prototype.toString.call(dataAxios) === '[object Blob]' && dataAxios.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = function () {
        const dataBlob = JSON.parse(reader.result)
        if (dataBlob.code === '1014' || dataBlob.code === '01020004' || dataBlob.code === '01010006' || dataBlob.code === '01000106') {
          if (window.top && window.top.$gc) {
            clientErrLoginOutDialog()
          }
          // 登录超时
          util.cookies.remove('channelSourceName')
          errorDialog('您的登录已失效，请重新登录')
        } else if (dataBlob.code === '1006' || dataBlob.code === '02013008' || dataBlob.code === '01026007') {
          if (window.top && window.top.$gc) {
            clientErrLoginOutDialog()
          }
          util.cookies.remove('channelSourceName')
          // 未登录或者账号在另一个地点登录
          errorDialog('您的账号权限发生变更或在另一个地点登录，您已被迫下线。', '如有任何问题，请拨打基构通客服热线400-820-5369。')
        } else if (dataBlob.code === '1015' || dataBlob.code === '01020005' || dataBlob.code === '02013007') {
          util.cookies.remove('channelSourceName')
          if (util.isElectron()) {
            // 登录超时
            errorDialog('您的登录已失效，请重新登录')
          } else {
            // 续期弹窗
            store.commit('d2admin/page/setReloginDialog', true)
          }
        } else if (dataBlob.code === '99030001') {
          errorCreate('系统异常', response)
        } else if (dataBlob.code !== '0000' && dataBlob.code !== '00000000') {
          errorCreate(dataBlob.msg || '系统异常', response)
        }
      }
      reader.readAsText(dataAxios)
      return Promise.reject(dataAxios)
    }
    let code
    if (dataAxios) {
      code = dataAxios.code
    }
    // 根据 code 进行判断
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本

      // 文件下载， 且直接使用远端文件名
      if (response.config.useRemoteFileName === true) {
        return {
          fileName: response.headers['content-disposition'] ? decodeURIComponent(response.headers['content-disposition'].split(';')[1].split('=')[1]) : new Date().getTime() + '.xlsx',
          blob: dataAxios
        }
      }

      return dataAxios
    } else {
      // 静默
      if (response.config && response.config.slience === true) return
      // 判断是否需要自己处理业务错误
      let handlerBusinessError = false
      if (typeof response.config.data === 'string' && response.config.data.indexOf('=') === -1) {
        if (!isClient || (isClient && !response.config.url.includes('/data/common20/Route'))) {
          const isJson = response.config.headers['Content-Type'].includes('application/json')
          if (isJson) {
            handlerBusinessError = JSON.parse(response.config.data).handlerBusinessError || false
          } else {
            handlerBusinessError = response.config.data.includes('handlerBusinessError')
          }
        }
      }
      try {
        if (typeof response.config.data === 'string' && (response.config.url.includes('/bus/jgt/account/send-auth-code') || response.config.url.includes('/bus/jgt/account/validate-auth-code'))) {
          const isJson = response.config.headers['Content-Type'].includes('application/json')
          if (isJson) {
            handlerBusinessError = JSON.parse(response.config.data).handlerBusinessError || false
          } else {
            handlerBusinessError = response.config.data.includes('handlerBusinessError')
          }
        }
      } catch (error) {

      }
      if (typeof response.config.data === 'string' && response.config.data.indexOf('dc.fund.score.get') > 0 && response.config.data.indexOf('handlerBusinessError') > 0) {
        handlerBusinessError = true
      }

      // 从config里传入 handlerBusinessError
      if (response.config?.handlerBusinessError) {
        // 不是客户端的请求
        if (!isClient || (isClient && !response.config.url.includes('/data/common20/Route'))) {
          handlerBusinessError = true
        }
      }

      // 判断接口耗时
      if (window.CONFIG && window.CONFIG.SENTRY && window.CONFIG.SENTRY.ACCOUNT_PORTAL_ENABLE) {
        const timeout = window.CONFIG.SENTRY.TIMEOUT || 5000

        const requestStart = response.config.requestStart
        const requestEnd = Date.now()
        const time = requestEnd - requestStart // 接口耗时

        if (time > timeout) {
          console.warn('time used: ' + time + ' operatorCode: ' + store.state.d2admin?.user?.info?.operatorCode)
          window.$Sentry.captureMessage('接口慢|path: ' + response.config.url)
        }
      }

      // 续期接口的错误码特殊处理
      if (response.config.url === '/fofund-fap/fap/user/deferred-login') {
        return dataAxios
      }
      // 设备管理异常特殊处理
      if (response.config.url.includes('/client/bind-client-list')) {
        if (code !== '00000000') {
          return Promise.reject(dataAxios)
        }
      }
      let tradeErrorCount = 0
      // 有 code 代表这是一个后端接口 可以进行进一步的判断

      switch (code) {
        case '0000':
        case '00000000':
          // [ 示例 ] code === 0 代表没有错误
          if (
            response.config.url.includes('/common/dictionary') ||
            response.config.url.includes('/trade/mix/app/client-version-upgrade')
          ) {
            return dataAxios.data
          }
          store.commit('d2admin/page/setReloginDialog', false)
          return dataAxios.data
        case '1041':
          return Promise.reject(dataAxios)
        case '1014': // 您未登录或登录超时，请重新登录
        case '01020004': // 请登录
        case '01010006': // 国际门户 token 无效或过期（兼容旧码）
        case '01000106': // 国际门户 token 无效或过期
          // 登出接口本身可能因 token 已失效返回本码：只 reject，勿再弹窗，避免「安全退出」死循环
          if (response.config && response.config.url && response.config.url.includes('/auth/logout')) {
            return Promise.reject(dataAxios)
          }
          if (window.top && window.top.$gc) {
            clientErrLoginOutDialog()
          } else {
            // 会话失效必须强制登出跳转，不受 handlerBusinessError 抑制
            // （国际门户业务 API 普遍带 handlerBusinessError:true，否则会出现「提示失效但不跳登录」）
            util.cookies.remove('channelSourceName')
            errorDialog('您的登录已失效，请重新登录')
          }

          return Promise.reject(dataAxios)

        case '1015': // 登录超时
        case '01020005': // 登录已失效，请重新登录
        case '02013007': // 您的登录信息已过期，请重新登录
          if (window.top && window.top.$gc) {
            clientErrLoginOutDialog()
          } else if (util.isElectron()) {
            // 登录超时
            errorDialog('您的登录已失效，请重新登录')
          } else {
            // 登录成功后，选择机构过程中登录失效
            if (location.hash.startsWith('#/elogin') || location.hash.startsWith('#/login/again')) {
              util.cookies.remove('channelSourceName')
              // errorDialog('您的登录已失效，请重新登录')
              location.reload()
              return
            }
            // 续期弹窗
            store.commit('d2admin/page/setReloginDialog', true)
          }

          return Promise.reject(dataAxios)
        case '1006':
        case '02013008':
        case '01026007':
          if (window.top && window.top.$gc) {
            clientErrLoginOutDialog()
          } else if (!handlerBusinessError || response.config.checkLoginError) {
            // 未登录或者账号在另一个地点登录
            util.cookies.remove('channelSourceName')
            errorDialog('您的账号权限发生变更或在另一个地点登录，您已被迫下线。', '如有任何问题，请拨打基构通客服热线400-820-5369。')
          }
          return Promise.reject(dataAxios)
        case '02022006':
        case '02040005':
        case '11031013':
        case '1109999':
          tradeErrorCount = util.isEmpty(Number(util.cookies.get('tradeErrorCount'))) ? 0 : Number(util.cookies.get('tradeErrorCount'))
          // 密码错误 未区分交易密码和登录密码
          util.cookies.set('tradeErrorCount', tradeErrorCount + 1)
          let msg = dataAxios.message || dataAxios.msg
          try {
            const passwordLength = Number(util.cookies.get('passwordLength')) || 0
            if (passwordLength > 8 && ['交易密码错误', '交易密码不正确', '交易密码不正确,请重试'].includes(msg)) {
              msg = window.CONFIG.TRADE_ERROR_MSG || msg
              util.cookies.remove('passwordLength')
              if (window.CONFIG.SENTRY?.ACCOUNT_PORTAL_ENABLE && window.CONFIG.TRADE_ERROR_MSG) {
                window.$Sentry.captureException(new Error(`path: 原密码长度为8位 msg:${msg}${store.state.d2admin?.user?.info?.operatorCode}`))
              }
            }
          } catch (error) {
            console.log(error)
          }
          errorCreate(`${msg}`)
          return Promise.reject(dataAxios)
        case '02010001':
          // 验证码必填
          let db = await store.dispatch('d2admin/db/database')
          db.set('pwdErrorCount', 4).write()
          return Promise.reject(dataAxios)
        case '02013032':
          // 操作员没绑定机构直接强制退出
          util.cookies.remove('token')
          util.cookies.remove('channelSourceName')
          errorCreate(`${dataAxios.message || dataAxios.msg}`)
          return Promise.reject(dataAxios)
        case '02013010': // 登录密码连续输入错误3次
        case '02013009': // 操作员未绑定当前设备/IP
        case '02013014': // 同一手机号码绑定多个操作员
          return Promise.reject(dataAxios)
        default:
          // 不是正确的 code
          if (handlerBusinessError) {
            return Promise.reject(dataAxios)
          } else {
            // 后端返回的异常
            const msg = dataAxios.msg || dataAxios.message || '系统异常，请稍后再试！'
            errorCreate(msg, response)
          }
          break
      }
    }
  },
  error => {
    if (error && error.response) {
      let isTips = true
      try {
        if (error.response?.config?.url && error.response.config.url.includes('bus-frp-agg/jgt/agg')) {
          isTips = false
        }
      } catch (error) {

      }
      if (isTips) {
        switch (error.response.status) {
          case 400: error.message = '请求错误'; break
          case 401: error.message = '未授权，请登录'
            // 客户端提示登出
            if (window.top && window.top.$gc) {
              clientErrLoginOutDialog()
              return Promise.reject(error)
            }
            break
          case 403:
            // 客户端提示登出
            if (window.top && window.top.$gc) {
              clientErrLoginOutDialog()
              return Promise.reject(error)
            }
            error.message = '拒绝访问'
            errorDialog('服务器拒绝了您的访问,请重新登录或联系系统管理员')
            break
          case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
          case 408: error.message = '请求超时'; break
          case 500: error.message = '服务器内部错误'; break
          case 501: error.message = '服务未实现'; break
          case 502: error.message = '网关错误'; break
          case 503: error.message = '服务不可用'; break
          case 504: error.message = '网关超时'; break
          case 505: error.message = 'HTTP版本不受支持'; break
          default: break
        }
      }
    }
    try {
      if (window.CONFIG && window.CONFIG.SENSORS_SERVER && window.CONFIG.SENSORS_SERVER.sensors_enable) {
        const timeout = new Date().getTime() - error.response.config.requestStart
        const cfgTime = window.CONFIG.SENSORS_SERVER.timeout || 500
        if (timeout > cfgTime) {
          let url = error.response.config.url
          let gatewayData = null
          if (error.response.config.url.includes('/route/v1') || error.response.config.url.includes('/common20/Route')) {
            gatewayData = qs.parse(error.response.config.data)
            url = gatewayData?.serviceName || gatewayData?.api
          }
          jgtSensorsTrack.apiLoadDuration({
            api_request_para: error.response.config.data,
            api_request_url: url,
            api_request_version: gatewayData?.serviceVersion || gatewayData?.version,
            api_load_time: timeout / 1000,
            if_error: '是',
            error_reason: error.message
          })
        }
      }
    } catch (error) {

    }
    try {
      if (error?.response?.config?.url && error.response.config.url.includes('bus-frp-agg/jgt/agg')) {
        return false
      }
    } catch (error) {

    }
    errorCreate(error.message, error)
    return Promise.reject(error)
  }
)

export default service
