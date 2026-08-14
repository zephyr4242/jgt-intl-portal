import { HELP_CONTENT, HELP_CONTACT } from '@/mocks/intl/help'

const SUPPORTED_LOCALES = ['zh-Hans', 'zh-Hant', 'en']

function safeLocale (locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'zh-Hans'
}

function localizedValue (value, locale) {
  if (value == null || typeof value === 'string') return value == null ? null : value
  return Object.prototype.hasOwnProperty.call(value, locale) ? value[locale] : null
}

function localizedKeywords (value, locale) {
  if (Array.isArray(value)) return value
  const localized = value && value[locale]
  return Array.isArray(localized) ? localized : []
}

function localizeContact (contact, locale) {
  if (!contact) return null
  return {
    phone: contact.phone,
    email: contact.email,
    address: localizedValue(contact.address, locale),
    serviceHours: localizedValue(contact.serviceHours, locale),
    serviceTeam: localizedValue(contact.serviceTeam, locale)
  }
}

function localizeItem (item, locale) {
  return {
    contentId: item.contentId,
    type: item.type,
    categoryCode: item.categoryCode,
    keywords: localizedKeywords(item.keywords, locale),
    title: localizedValue(item.title, locale),
    body: localizedValue(item.body, locale),
    sortOrder: Number.isFinite(item.sortOrder) ? item.sortOrder : 0,
    contact: localizeContact(item.contact, locale)
  }
}

function compareHelpContent (left, right) {
  return left.sortOrder - right.sortOrder || left.contentId.localeCompare(right.contentId)
}

export async function list (query = {}) {
  const locale = safeLocale(query.locale)
  const keyword = String(query.keyword || '').trim().toLocaleLowerCase(locale)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.max(1, Number(query.pageSize) || 20)
  const items = HELP_CONTENT
    .map(item => localizeItem(item, locale))
    .filter(item => !query.type || item.type === query.type)
    .filter(item => !query.categoryCode || item.categoryCode === query.categoryCode)
    .filter(item => {
      if (!keyword) return true
      const searchable = [item.title, item.body, ...item.keywords]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase(locale)
      return searchable.includes(keyword)
    })
    .sort(compareHelpContent)

  const offset = (page - 1) * pageSize
  return {
    items: items.slice(offset, offset + pageSize),
    page,
    pageSize,
    total: items.length
  }
}

export async function getGuide ({ contentId, locale } = {}) {
  const item = HELP_CONTENT.find(content => content.contentId === contentId)
  if (!item) {
    const error = new Error('Help content not found')
    error.code = 'HELP_CONTENT_NOT_FOUND'
    error.messageKey = 'helpErrorNotFound'
    error.retryable = false
    throw error
  }
  return localizeItem(item, safeLocale(locale))
}

export async function getContact ({ locale } = {}) {
  return localizeItem(HELP_CONTACT, safeLocale(locale))
}

export default { list, getGuide, getContact }
