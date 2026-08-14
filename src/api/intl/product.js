import request from '@/plugin/axios'
import util from '@/libs/util'

const product = (url) => `/bus/jgt/intl/product${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

/** 产品货架列表（分页、筛选与交易预选共用） */
export const listProducts = (params = {}, headers = {}) =>
  request.post(product('/list'), params, { headers: withRequestId(headers), handlerBusinessError: true })

/** @deprecated 仅供未迁移的旧组件编译兼容，不在本期正式路由中使用。 */
export const submitProductInquiry = (params, headers = {}) =>
  request.post(product('/inquiry/submit'), params, { headers: withRequestId(headers), handlerBusinessError: true })
