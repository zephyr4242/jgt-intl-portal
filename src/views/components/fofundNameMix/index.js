import { cloneDeep } from 'lodash'
export default {
  components: {

  },
  data () {
    return {
    }
  },

  computed: {

  },
  watch: {

  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 截取fofundName
    isShowFofundName (scope, type, conf) {
      const { row, column } = scope
      const width = conf ? conf.width : column.minWidth
      if (type === 1) {
        const num = (width - 22) / 12
        return row?.fofundName?.substr(0, num)
      }
      if (type === 2) {
        const num = (width - 22) / 12
        return row?.fofundName?.substr(num, row.fofundName.length)
      }
      return row?.fofundName
    },
    // 截取fofundName
    isShowFofundNameBr (scope) {
      const { row } = scope
      const isTrue = row.fofundName && row.fofundName.length >= 14
      return isTrue
    },
    // 有tableth取最大数值设置最大宽度
    setWidth (data, tableTh) {
      let maxLength = 0
      const listlh = cloneDeep(data).map(item => {
        return item.fofundName && item.fofundName.length
      })
      maxLength = Math.max.apply(null, listlh)
      if (maxLength) {
        tableTh.forEach(item => {
          if (item.value === 'fofundName' || item.prop === 'fofundName') {
            let width = (maxLength && maxLength >= 20) ? Number((maxLength * 12 / 2 + 22).toFixed(0)) : Number((maxLength * 12 + 22).toFixed(0))
            width = width < 150 ? 150 : width
            this.$set(item, 'width', width < 150 ? 150 : width)
          }
        })
      }
    },
    // 没有tableth设置宽度
    setNoThWidth (data) {
      if (data && data.length) {
        let maxLength = 0
        const listlh = cloneDeep(data).map(item => {
          return item.fofundName && item.fofundName.length
        })
        maxLength = Math.max.apply(null, listlh)
        if (maxLength) {
          let width = maxLength && maxLength >= 20 ? Number((maxLength * 12 / 2 + 22).toFixed(0)) : Number((maxLength * 12 + 22).toFixed(0))
          width = width < 150 ? 150 : width
          return width
        }
      }
    }
  }
}
