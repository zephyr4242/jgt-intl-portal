// localStorage 模拟 cookie，支持 expires（单位：天，可小数，如 30/1440 = 30 分钟）

const cookies = {}

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} cookieSetting cookie setting { expires: days }
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
  let currentCookieSetting = {
    expires: 1
  }
  Object.assign(currentCookieSetting, cookieSetting)
  localStorage.setItem(`jgt-${name}`, value)
  if (currentCookieSetting.expires != null && currentCookieSetting.expires !== '') {
    const ms = Number(currentCookieSetting.expires) * 24 * 60 * 60 * 1000
    if (!Number.isNaN(ms) && ms > 0) {
      localStorage.setItem(`jgt-${name}-expires`, String(Date.now() + ms))
    } else {
      localStorage.removeItem(`jgt-${name}-expires`)
    }
  } else {
    localStorage.removeItem(`jgt-${name}-expires`)
  }
}

/**
 * @description 拿到 cookie 值（过期则清除并返回 null）
 * @param {String} name cookie name
 */
cookies.get = function (name = 'default') {
  const exp = localStorage.getItem(`jgt-${name}-expires`)
  if (exp) {
    const ts = Number(exp)
    if (!Number.isNaN(ts) && Date.now() > ts) {
      localStorage.removeItem(`jgt-${name}`)
      localStorage.removeItem(`jgt-${name}-expires`)
      return null
    }
  }
  return localStorage.getItem(`jgt-${name}`)
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
cookies.remove = function (name = 'default') {
  localStorage.removeItem(`jgt-${name}`)
  localStorage.removeItem(`jgt-${name}-expires`)
}

export default cookies
