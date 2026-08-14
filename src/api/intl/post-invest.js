import request from '@/plugin/axios'
import util from '@/libs/util'

const postInvest = (url) => `/bus/jgt/intl/post-invest${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

/** 投后公告列表 */
export const listPostInvest = (params = {}, headers = {}) =>
  request.post(postInvest('/list'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** 确认参与投后事项 */
export const confirmPostInvest = (params, headers = {}) =>
  request.post(postInvest('/confirm'), params, { headers: withRequestId(headers), handlerBusinessError: true })
