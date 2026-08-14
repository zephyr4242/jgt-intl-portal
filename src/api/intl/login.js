import request from '@/plugin/axios'
import util from '@/libs/util'

/**
 * 国际门户认证 API（对接 bus-jgt-intl）
 * 路径：/bus/jgt/intl/auth/*
 */

const auth = (url) => `/bus/jgt/intl/auth${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

export const getPublicKey = (params = {}, headers = {}) =>
  request.post(auth('/public-key'), params, { headers: withRequestId(headers), handlerBusinessError: true })

export const sendAuthCode = (params, headers = {}) =>
  request.post(auth('/send-auth-code'), params, { headers: withRequestId(headers), handlerBusinessError: true })

export const userRegister = (params, headers = {}) =>
  request.post(auth('/register'), params, { headers: withRequestId(headers), handlerBusinessError: true })

export const userLogin = (params, headers = {}) =>
  request.post(auth('/login'), params, { headers: withRequestId(headers), handlerBusinessError: true })

export const userLogout = (params = {}, headers = {}) =>
  request.post(auth('/logout'), { ...params }, {
    headers: withRequestId(headers),
    // 会话已失效时 logout 仍可能返回 01000106；交由业务侧 cleanCache，勿弹二次失效框
    handlerBusinessError: true
  })

export const userTokenInfo = (params = {}, headers = {}) =>
  request.post(auth('/user-info'), params, { headers: withRequestId(headers), isType: params && params.isType })

/** 忘记密码：身份核验并发码（手机+邮箱同一码） */
export const forgotSendCode = (params, headers = {}) =>
  request.post(auth('/forgot/send-code'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 忘记密码：校验验证码，返回 resetToken */
export const forgotVerifyCode = (params, headers = {}) =>
  request.post(auth('/forgot/verify-code'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 忘记密码：提交新密码（RSA 密文） */
export const forgotResetPassword = (params, headers = {}) =>
  request.post(auth('/forgot/reset'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 首次登录改密（一体化建户，凭 changePwdToken） */
export const firstLoginChangePwd = (params, headers = {}) =>
  request.post(auth('/first-login/change-pwd'), params, { headers: withRequestId(headers), handlerBusinessError: true })

// ---- 以下为国内门户遗留占位，国际版暂不实现 ----
export const userCheck = (params, headers = {}) =>
  Promise.reject(new Error('intl: userCheck not implemented'))

export const userTrialLogin = (params, headers = {}) =>
  Promise.reject(new Error('intl: userTrialLogin not implemented'))

export const addAuthIp = (params, headers = {}) =>
  Promise.reject(new Error('intl: addAuthIp not implemented'))

export const deferredLogin = (params, headers = {}) =>
  Promise.reject(new Error('intl: deferredLogin not implemented'))

export const passwordReset = (params, headers = {}) =>
  Promise.reject(new Error('intl: passwordReset not implemented'))

export const forgotPassword = (params, headers = {}) =>
  Promise.reject(new Error('intl: forgotPassword not implemented'))

export const getOrgTypeByToken = (params, headers = {}) =>
  Promise.resolve({ orgTypeStr: '' })

export const validateAuthCode = (params, headers = {}) =>
  Promise.reject(new Error('intl: validateAuthCode not implemented'))

export const bindClientList = (params, headers = {}) =>
  Promise.resolve([])

export const bindClient = (params, headers = {}) =>
  Promise.reject(new Error('intl: bindClient not implemented'))

export const unbindClient = (params, headers = {}) =>
  Promise.reject(new Error('intl: unbindClient not implemented'))
