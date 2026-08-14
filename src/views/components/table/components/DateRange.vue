<template>
  <div v-bind="$attrs">{{ start }} {{ split }} {{ end }}</div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'DateRange',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  data () {
    return {
      start: '',
      end: '',
      split: '~'
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      const settings = this.prop?.column ?? {}
      this.split = settings.split ?? '~'
      this.start = this.formatValue(data[settings.start], settings)
      this.end = this.formatValue(data[settings.end], settings)
    },
    formatValue (v, settings) {
      const formatTemplate = settings.formatTemplate ?? 'YYYY-MM-DD'
      const nullValue = settings.nullValue ?? '至今'
      let ret = v ? dayjs(v).format(formatTemplate) : nullValue
      // 旧代码后端会返回中文的至今，导致格式化失败
      if (ret === 'Invalid Date') {
        ret = nullValue
      }
      return ret
    }
  }
}
</script>
<style scoped lang="scss">
</style>
