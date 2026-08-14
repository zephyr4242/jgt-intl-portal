/** Compatibility data for dormant, out-of-scope views. */
import { INTL_CONTACT } from '@/config/intl-contact'

function localized (value, locale) {
  return value && typeof value === 'object' ? (value[locale] || '') : (value || '')
}

export const HOLDING_DATA = []
export const POST_DATA = []
export const ACCOUNT_DOC_DATA = []

export function getHoldings (locale = 'zh-Hans') {
  return HOLDING_DATA.map(item => ({ ...item, fundName: localized(item.fundName, locale) }))
}

export function getPostItems () { return [] }
export function getAccountDocs () { return [] }

export function getContactInfo (locale = 'zh-Hans') {
  return {
    phone: INTL_CONTACT.phone,
    email: INTL_CONTACT.email,
    address: localized(INTL_CONTACT.address, locale),
    hours: localized(INTL_CONTACT.serviceHours, locale),
    manager: localized(INTL_CONTACT.serviceTeam, locale)
  }
}
