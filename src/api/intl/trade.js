import request from '@/plugin/axios'
import util from '@/libs/util'

const trade = (url) => `/bus/jgt/intl/trade${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

/** 提交交易指令 */
export const submitTradeOrder = (params, headers = {}) =>
  request.post(trade('/submit'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 按稳定客户端请求号回查指令 */
export const getTradeOrderByClientId = (clientRequestId, headers = {}) =>
  request.post(trade('/by-client-id'), { clientRequestId }, { headers: withRequestId(headers), handlerBusinessError: true })

/** 交易确认列表 */
export const listTradeOrders = (params = {}, headers = {}) =>
  request.post(trade('/list'), params, { headers: withRequestId(headers), handlerBusinessError: true })
