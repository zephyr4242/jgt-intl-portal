import { MOCK_OPERATORS } from '@/mocks/intl/operators'
import { loadRegistrations, saveRegistrations } from '@/mocks/intl/registrations'
import { createDomainError } from '@/services/intl/errors'
import { createRequestId } from '@/services/intl/normalizers'
import { withMockDelay } from '@/services/intl/result'

function sessionFrom (operator) {
  return {
    accessToken: `mock-token-${operator.operatorId}`,
    token: `mock-token-${operator.operatorId}`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    operator: { ...operator, password: undefined, locale: 'zh-Hans' }
  }
}

export default {
  async register (input) {
    const email = String(input.email || '').trim().toLowerCase()
    const mobile = String(input.mobile || '').trim()
    const items = loadRegistrations()
    if (MOCK_OPERATORS.some(item => item.email === email || item.mobile === mobile) || items.some(item => item.email === email || item.mobile === mobile)) {
      throw createDomainError({ code: 'REGISTRATION_DUPLICATE' })
    }
    const application = {
      applicationId: `REG-${createRequestId().slice(0, 12).toUpperCase()}`,
      organizationName: input.organizationName,
      operatorName: input.operatorName,
      email,
      mobile,
      reviewStatus: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString()
    }
    saveRegistrations([application, ...items])
    return withMockDelay(application)
  },
  async login ({ account, password }) {
    const key = String(account || '').trim().toLowerCase()
    const operator = MOCK_OPERATORS.find(item => item.email.toLowerCase() === key || item.mobile === account)
    if (!operator || operator.password !== password) throw createDomainError({ code: 'AUTH_INVALID_CREDENTIALS' })
    if (operator.reviewStatus === 'PENDING_REVIEW') throw createDomainError({ code: 'AUTH_REVIEW_PENDING' })
    if (operator.reviewStatus === 'REJECTED') throw createDomainError({ code: 'AUTH_REVIEW_REJECTED' })
    return withMockDelay(sessionFrom(operator))
  },
  async getCurrentSession () { return null },
  async logout () { return withMockDelay(undefined, 20) }
}
