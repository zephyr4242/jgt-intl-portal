import request from '@/plugin/axios'
import util from '@/libs/util'

const endpoint = url => `/bus/jgt/intl/dividend${url}`
const headers = extra => ({
  'Content-Type': 'application/json;charset=UTF-8',
  'X-Request-Id': util.randomString(24),
  ...extra
})

export const listDividends = (params = {}, extraHeaders = {}) =>
  request.post(endpoint('/list'), params, { headers: headers(extraHeaders), handlerBusinessError: true })
