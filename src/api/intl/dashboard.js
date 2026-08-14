import request from '@/plugin/axios'
import util from '@/libs/util'

export const getDashboardSummary = (params = {}) => request.post('/bus/jgt/intl/dashboard/summary', params, {
  headers: { 'Content-Type': 'application/json;charset=UTF-8', 'X-Request-Id': util.randomString(24) },
  handlerBusinessError: true
})
