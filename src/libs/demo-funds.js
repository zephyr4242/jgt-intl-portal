/** Dormant legacy adapters now expose only anonymous acceptance products. */
import { PRODUCTS } from '@/mocks/intl/products'

export const FUND_DATA = PRODUCTS.map(item => ({
  id: item.fundId,
  name: item.name,
  manager: item.managerName,
  type: item.fundType,
  region: item.region,
  currency: item.currency,
  risk: item.riskLevel,
  nav: item.nav,
  navDate: item.navDate,
  minInvest: item.minimumSubscription
}))

function localize (value, locale) {
  return value && typeof value === 'object' ? (value[locale] || '') : (value || '')
}

export function getFunds (locale = 'zh-Hans') {
  return FUND_DATA.map(item => ({
    ...item,
    name: localize(item.name, locale),
    nameEn: localize(item.name, 'en'),
    manager: localize(item.manager, locale)
  }))
}

export function getFundById (id, locale) { return getFunds(locale).find(item => item.id === id) }
export function getFundTypeOptions () { return Array.from(new Set(FUND_DATA.map(item => item.type))) }
export function getFundRiskOptions () { return Array.from(new Set(FUND_DATA.map(item => item.risk))) }
