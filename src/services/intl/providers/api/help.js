import { listHelpContent, getHelpGuide } from '@/api/intl/help'
import INTL_CONTACT from '@/config/intl-contact'

const SUPPORTED_LOCALES = ['zh-Hans', 'zh-Hant', 'en']

function safeLocale (locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'zh-Hans'
}

function localizedValue (value, locale) {
  if (value == null || typeof value === 'string') return value == null ? null : value
  return Object.prototype.hasOwnProperty.call(value, locale) ? value[locale] : null
}

function localizeContact (contact, locale) {
  if (!contact) return null
  return {
    phone: contact.phone || null,
    email: contact.email || null,
    address: localizedValue(contact.address, locale),
    serviceHours: localizedValue(contact.serviceHours || contact.hours, locale),
    serviceTeam: localizedValue(contact.serviceTeam || contact.manager, locale)
  }
}

function normalizeItem (raw = {}, locale) {
  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords
    : (raw.keywords && Array.isArray(raw.keywords[locale]) ? raw.keywords[locale] : [])
  return {
    contentId: String(raw.contentId || raw.id || ''),
    type: raw.type || 'FAQ',
    categoryCode: raw.categoryCode || '',
    keywords,
    title: localizedValue(raw.title, locale),
    body: localizedValue(raw.body, locale),
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : 0,
    contact: localizeContact(raw.contact, locale)
  }
}

function asPage (raw, query) {
  const source = raw && raw.data ? raw.data : raw || {}
  const records = Array.isArray(source)
    ? source
    : (source.items || source.records || source.list || [])
  const page = Math.max(1, Number(source.page || source.current || query.page) || 1)
  const pageSize = Math.max(1, Number(source.pageSize || source.size || query.pageSize) || 20)
  const items = records
    .map(item => normalizeItem(item, query.locale))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.contentId.localeCompare(right.contentId))
  return {
    items,
    page,
    pageSize,
    total: Number.isFinite(Number(source.total)) ? Number(source.total) : items.length
  }
}

function adaptError (error, messageKey) {
  if (error && error.messageKey) return error
  const adapted = new Error('International help service is unavailable')
  adapted.code = (error && error.code) || 'HELP_SERVICE_UNAVAILABLE'
  adapted.category = 'SERVICE'
  adapted.messageKey = messageKey
  adapted.retryable = true
  adapted.resultUnknown = false
  adapted.requestId = error && error.requestId
  return adapted
}

export async function list (query = {}) {
  const normalizedQuery = {
    type: query.type || undefined,
    categoryCode: query.categoryCode || undefined,
    keyword: String(query.keyword || '').trim(),
    page: Math.max(1, Number(query.page) || 1),
    pageSize: Math.max(1, Number(query.pageSize) || 20),
    locale: safeLocale(query.locale)
  }
  try {
    return asPage(await listHelpContent(normalizedQuery), normalizedQuery)
  } catch (error) {
    throw adaptError(error, 'helpErrorLoad')
  }
}

export async function getGuide ({ contentId, locale } = {}) {
  const normalizedLocale = safeLocale(locale)
  try {
    const raw = await getHelpGuide({ contentId, locale: normalizedLocale })
    return normalizeItem(raw && raw.data ? raw.data : raw, normalizedLocale)
  } catch (error) {
    throw adaptError(error, 'helpErrorGuide')
  }
}

export async function getContact ({ locale } = {}) {
  const normalizedLocale = safeLocale(locale)
  return {
    contentId: 'CONTACT-STATIC',
    type: 'CONTACT',
    categoryCode: 'CONTACT',
    keywords: [],
    title: null,
    body: null,
    sortOrder: 1000,
    contact: localizeContact(INTL_CONTACT, normalizedLocale)
  }
}

export default { list, getGuide, getContact }
