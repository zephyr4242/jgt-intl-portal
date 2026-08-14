import { t as translate } from '@/locales'

export default {
  install (Vue) {
    Vue.mixin({
      computed: {
        $locale () {
          try {
            return this.$store.state.d2admin.locale.locale
          } catch (e) {
            return 'zh-Hans'
          }
        }
      },
      methods: {
        /**
         * 三语文案：简体 / 繁体 / English
         * 依赖 $locale，切换语言后模板会自动刷新
         */
        $t (key, params) {
          // eslint-disable-next-line no-unused-expressions
          this.$locale
          return translate(this.$locale, key, params)
        }
      }
    })
  }
}
