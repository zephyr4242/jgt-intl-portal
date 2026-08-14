import { userRegister, userLogin, userLogout, userTokenInfo } from '@/api/intl/login'
import { ensureRsaPublicKey, encryptPassword } from '@/libs/intl-auth'
import { createDomainError } from '@/services/intl/errors'

function mapOperator (raw = {}) {
  return {
    operatorId: raw.userId || raw.operatorCode || raw.email,
    name: raw.operatorName || raw.contactName || raw.email,
    email: raw.email || raw.operatorCode || '',
    mobile: raw.mobile || '',
    organizationId: raw.orgId || 'INTL',
    organizationName: raw.companyName || '',
    locale: raw.locale || 'zh-Hans'
  }
}

export default {
  async register (input) {
    try {
      await ensureRsaPublicKey()
      const raw = await userRegister({
        companyName: input.organizationName,
        contactName: input.operatorName,
        name: input.operatorName,
        email: input.email,
        mobile: input.mobile,
        passwordCipher: encryptPassword(input.password)
      })
      return {
        applicationId: raw.applicationId || raw.applyId,
        reviewStatus: raw.reviewStatus || 'PENDING_REVIEW',
        submittedAt: raw.submittedAt || new Date().toISOString(),
        contact: raw.contact || null
      }
    } catch (e) { throw createDomainError(e) }
  },
  async login (input) {
    try {
      await ensureRsaPublicKey()
      const raw = await userLogin({
        loginName: input.account,
        passwordCipher: encryptPassword(input.password),
        authCode: input.verificationCode,
        authCodeToken: input.verificationCodeToken
      })
      return {
        accessToken: raw.token,
        token: raw.token,
        expiresAt: raw.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        operator: mapOperator(raw)
      }
    } catch (e) {
      const code = e && e.code
      if (['AUTH_REVIEW_PENDING', '01000113'].includes(code)) throw createDomainError({ code: 'AUTH_REVIEW_PENDING' })
      if (['AUTH_REVIEW_REJECTED', '01000114'].includes(code)) throw createDomainError({ code: 'AUTH_REVIEW_REJECTED' })
      throw createDomainError(e, { code: 'AUTH_INVALID_CREDENTIALS', retryable: false })
    }
  },
  async getCurrentSession () {
    try {
      const raw = await userTokenInfo({})
      return { operator: mapOperator(raw) }
    } catch (e) { throw createDomainError(e) }
  },
  async logout () {
    try { await userLogout({}) } catch (e) { throw createDomainError(e) }
  }
}
