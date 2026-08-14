import request from '@/plugin/axios'
import util from '@/libs/util'

const base = '/bus/jgt/intl'
const headers = extra => ({
  'Content-Type': 'application/json;charset=UTF-8',
  'X-Request-Id': util.randomString(24),
  ...extra
})

export const getOrganizationAccount = (params = {}, extraHeaders = {}) =>
  request.post(`${base}/account/info`, params, { headers: headers(extraHeaders), handlerBusinessError: true })

export const getOperatorProfile = (params = {}, extraHeaders = {}) =>
  request.post(`${base}/auth/user-info`, params, { headers: headers(extraHeaders), handlerBusinessError: true })

export const updateOperatorLocale = (params, extraHeaders = {}) =>
  request.post(`${base}/account/locale`, params, { headers: headers(extraHeaders), handlerBusinessError: true })
