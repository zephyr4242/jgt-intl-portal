/**
 * Compatibility facade for dormant legacy views.
 *
 * Formal international pages import `@/services/intl` directly. This module
 * deliberately contains no data-source switch and no fallback to legacy demo
 * storage; it only forwards supported read operations to the selected provider.
 */
import { products, trades, holdings } from '@/services/intl'
import { DomainError } from '@/services/intl/errors'

function localized (value, locale) {
  return value && typeof value === 'object' ? (value[locale] || '') : (value || '')
}

export function isDemoBiz () {
  return false
}

export async function fetchProducts (locale) {
  const page = await products.list({ locale, page: 1, pageSize: 100 })
  return page.items.map(item => ({
    id: item.fundId,
    name: localized(item.name, locale),
    nameEn: localized(item.name, 'en'),
    manager: localized(item.managerName, locale),
    type: item.fundType,
    region: item.region,
    currency: item.currency,
    risk: item.riskLevel,
    nav: item.nav,
    navDate: item.navDate,
    minInvest: item.minimumSubscription
  }))
}

export function localFundTypeOptions () { return [] }
export function localFundRiskOptions () { return [] }
export function localFundById () { return null }

function outOfScope () {
  return Promise.reject(new DomainError({
    code: 'FEATURE_OUT_OF_SCOPE',
    category: 'BUSINESS',
    messageKey: 'errorSystem',
    retryable: false
  }))
}

export function submitInquiry () { return outOfScope() }
export function submitTrade () { return outOfScope() }

export async function fetchTrades (locale) {
  const page = await trades.list({ locale, page: 1, pageSize: 100 })
  return page.items
}

export async function fetchHoldings (locale) {
  const page = await holdings.list({ locale, page: 1, pageSize: 100 })
  return page.items
}

export async function fetchPostInvest () { return [] }
export function confirmPostItem () { return outOfScope() }
export async function fetchPiStatus () { return { pi: false, piFlag: '0' } }
export function confirmPiStatus () { return outOfScope() }
export function demoPendingTradeCount () { return 0 }
export function demoInquiryCount () { return 0 }
export function readCachedPi () { return false }
