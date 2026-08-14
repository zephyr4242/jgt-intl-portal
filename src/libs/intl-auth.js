import util from '@/libs/util.js'
import { getPublicKey } from '@/api/intl/login'
import { isMockMode } from '@/services/intl/mode'

const TOKEN_TTL_MS = 30 * 60 * 1000
const TOKEN_EXPIRE_AT_KEY = 'tokenExpireAt'

/**
 * 是否启用演示登录（默认关闭，走真实 bus-jgt-intl）
 */
export function isDemoAuthEnabled () {
  return isMockMode()
}

/**
 * 拉取并缓存 RSA 公钥
 */
export async function ensureRsaPublicKey () {
  const cached = util.getRsaPublicKeyCache && util.getRsaPublicKeyCache()
  if (cached) return cached
  const res = await getPublicKey({})
  const publicKey = (res && (res.publicKey || res.public_key)) || ''
  if (!publicKey) {
    throw new Error('public key empty')
  }
  util.setRsaPublicKey(publicKey)
  return publicKey
}

export function encryptPassword (plain) {
  return util.getRsaCode(String(plain || ''))
}

/**
 * 写入约 30 分钟有效的登录会话
 */
export async function establishAuthSession (store, loginRes) {
  const token = loginRes.token
  const email = loginRes.email || loginRes.operatorCode || ''
  const pi = loginRes.pi === true || loginRes.piFlag === '1'
  const info = {
    token,
    portalType: 'intl',
    demoUser: isMockMode(),
    operatorCode: loginRes.operatorCode || email,
    operatorName: loginRes.operatorName || loginRes.contactName || email,
    mobile: loginRes.mobile || '',
    email,
    companyName: loginRes.companyName || '',
    userId: loginRes.userId,
    pi,
    piFlag: pi ? '1' : '0',
    userLoginOrg: {
      orgCode: 'INTL',
      orgName: loginRes.companyName || '',
      menuList: []
    },
    userLoginCustomer: null
  }
  util.cookies.set('uuid', email)
  util.cookies.set('token', token)
  util.cookies.set('isNormalLogin', '1')
  localStorage.setItem(`jgt-${TOKEN_EXPIRE_AT_KEY}`, String(Date.now() + TOKEN_TTL_MS))
  localStorage.setItem('menuList', JSON.stringify([]))
  await store.dispatch('d2admin/user/set', info)
  try {
    await store.dispatch('d2admin/account/load')
  } catch (e) { /* ignore */ }
  try {
    const getMenu = require('@/menu/aside').default
    store.commit('d2admin/menu/asideSet', getMenu())
  } catch (e) { /* ignore */ }
  return info
}

export function clearAuthExpire () {
  localStorage.removeItem(`jgt-${TOKEN_EXPIRE_AT_KEY}`)
}

export function isAuthTokenExpiredLocally () {
  const raw = localStorage.getItem(`jgt-${TOKEN_EXPIRE_AT_KEY}`)
  if (!raw) return false
  const ts = Number(raw)
  return Number.isFinite(ts) && Date.now() > ts
}

/** 后端 token 无效/过期业务码 */
export const TOKEN_INVALID_CODES = ['01000106', '1014', '01020004']
