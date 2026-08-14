import { readMockTable, writeMockTable } from '@/mocks/intl/database'
import { DomainError } from '@/services/intl/errors'

export default {
  async getOrganizationAccount () {
    return readMockTable('organizationAccount')
  },
  async getOperatorProfile () {
    let currentProfile = readMockTable('operatorProfile')
    if (typeof localStorage !== 'undefined') {
      const savedLocale = localStorage.getItem('jiyu_demo_locale')
      if (['zh-Hans', 'zh-Hant', 'en'].includes(savedLocale)) currentProfile = { ...currentProfile, locale: savedLocale }
    }
    return { ...currentProfile }
  },
  async updateLocale (locale) {
    if (!['zh-Hans', 'zh-Hant', 'en'].includes(locale)) {
      throw new DomainError({ code: 'LOCALE_UNSUPPORTED', category: 'VALIDATION', messageKey: 'errors.invalidLocale' })
    }
    const currentProfile = { ...readMockTable('operatorProfile'), locale }
    return writeMockTable('operatorProfile', currentProfile)
  }
}
