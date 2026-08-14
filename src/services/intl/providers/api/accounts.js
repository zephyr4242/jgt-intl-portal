import { getOrganizationAccount, getOperatorProfile, updateOperatorLocale } from '@/api/intl/account'
import { createDomainError } from '@/services/intl/errors'

const unwrap = raw => raw && raw.data !== undefined ? raw.data : raw

export default {
  async getOrganizationAccount () {
    try { return unwrap(await getOrganizationAccount()) } catch (error) {
      throw createDomainError(error, { code: 'ACCOUNT_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
  },
  async getOperatorProfile () {
    try { return unwrap(await getOperatorProfile()) } catch (error) {
      throw createDomainError(error, { code: 'OPERATOR_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
  },
  async updateLocale (locale) {
    try {
      const profile = unwrap(await updateOperatorLocale({ locale })) || {}
      return { ...profile, locale }
    } catch (error) {
      throw createDomainError(error, { code: 'LOCALE_UPDATE_FAILED', messageKey: 'errors.saveFailed', retryable: true })
    }
  }
}
