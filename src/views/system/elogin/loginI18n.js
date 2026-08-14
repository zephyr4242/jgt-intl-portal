/**
 * @deprecated 请使用全局 `@/locales` 与 `this.$t`
 * 保留 re-export 避免旧引用瞬时报错
 */
export {
  LANG_OPTIONS,
  loadLocale as loadLoginLang,
  saveLocale as saveLoginLang,
  t as tLogin
} from '@/locales'
