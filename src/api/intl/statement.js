import request from '@/plugin/axios'
import util from '@/libs/util'

const endpoint = url => `/bus/jgt/intl/statement${url}`
const headers = extra => ({
  'Content-Type': 'application/json;charset=UTF-8',
  'X-Request-Id': util.randomString(24),
  ...extra
})

export const listStatements = (params = {}, extraHeaders = {}) =>
  request.post(endpoint('/list'), params, { headers: headers(extraHeaders), handlerBusinessError: true })

export const getStatementFileAccess = (params, extraHeaders = {}) =>
  request.post(endpoint('/file-access'), params, { headers: headers(extraHeaders), handlerBusinessError: true })
