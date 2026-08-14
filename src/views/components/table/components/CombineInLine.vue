 <template>
    <div v-bind="$attrs" class="combine-in-line">
        {{str}}
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'CombineInLine',
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
      str: ''
    }
  },
  computed: {

  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      const props = this.prop?.column?.props ?? []
      const joinStrs = this.prop?.column?.joinStrs ?? []
      // dateFormat属性用于格式化日期, 请确保传入的值都是日期格式，避免格式化错误。
      const dateFormat = this.prop?.column?.dateFormat
      let str = ''
      props.forEach((prop, idx) => {
        if (dateFormat) {
          let temp = data[prop] ?? ''
          temp = dayjs(temp).format(dateFormat)
          str = str + temp + (joinStrs[idx] ?? '')
        } else {
          str = str + (data[prop] ?? '') + (joinStrs[idx] ?? '')
        }
      })
      this.str = str
    }
  }
}
</script>
<style scoped lang="scss">
.combine-in-line{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
