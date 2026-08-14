import request from '@/plugin/axios'
import util from '@/libs/util'

const pi = (url) => `/bus/jgt/intl/pi${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

/** 专业投资者自认状态 */
export const getPiStatus = (params = {}, headers = {}) =>
  request.post(pi('/status'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 确认专业投资者自认 */
export const confirmPi = (params = {}, headers = {}) =>
  request.post(pi('/confirm'), params, { headers: withRequestId(headers), handlerBusinessError: true })
