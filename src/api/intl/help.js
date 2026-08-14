import request from '@/plugin/axios'
import util from '@/libs/util'

const help = url => `/bus/jgt/intl/help${url}`

function withRequestId (headers = {}) {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    ...headers,
    'X-Request-Id': headers['X-Request-Id'] || util.randomString(24)
  }
}

export const listHelpContent = (params = {}, headers = {}) =>
  request.post(help('/list'), params, {
    headers: withRequestId(headers),
    handlerBusinessError: true
  })

export const getHelpGuide = (params, headers = {}) =>
  request.post(help('/guide'), params, {
    headers: withRequestId(headers),
    handlerBusinessError: true
  })
