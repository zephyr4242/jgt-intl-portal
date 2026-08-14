import request from '@/plugin/axios'
import util from '@/libs/util'

const holding = (url) => `/bus/jgt/intl/holding${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

/** 持仓列表 */
export const listHoldings = (params = {}, headers = {}) =>
  request.post(holding('/list'), params, { headers: withRequestId(headers), handlerBusinessError: true })
