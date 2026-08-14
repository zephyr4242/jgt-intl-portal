/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseURL: axios的baseURL
 * 国际门户接口前缀为 /bus/jgt/intl/*，开发态走相对路径由 vue-cli 代理。
 */
export function getBaseUrl () {
  if (window.CONFIG && window.CONFIG.VUE_APP_API === 'http://root/vue_axios') {
    return 'http://root/vue_axios/api/'
  }
  if (process.env.NODE_ENV === 'development') {
    // 空 baseURL：请求 /bus/jgt/intl/... 经 vue.config.js 代理到 bus-jgt-intl
    return ''
  }
  const link = (window.CONFIG && window.CONFIG.VUE_APP_LINK_PATH) || process.env.VUE_APP_LINK_PATH || ''
  return String(link).replace(/\/$/g, '')
}
