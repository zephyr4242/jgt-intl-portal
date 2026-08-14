 <template>
  <div v-bind="$attrs" v-if="date || time">
    <p v-if="date" class="dateTyep">{{ date }}</p>
    <p v-if="time" class="timeType">{{ time }}</p>
  </div>
  <div v-else>--</div>
</template>
<script>
export default {
  name: 'DateTime',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      date: '',
      time: ''
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {},
  methods: {
    init () {
      // 处理日期
      let { row } = this.prop
      const { dateType, timeType, prop, handleDate } = this.prop.column
      if (handleDate && row[prop] === '1900-01-01') {
        this.date = '--'
        return
      }
      if (row[prop] && row[prop] !== '--') {
        this.date = dateType
          ? row[prop]
            ? this.util.fmtDate(row[prop], dateType)
            : '--'
          : ''
        this.time = timeType
          ? row[prop]
            ? this.util.fmtDate(row[prop], timeType)
            : '--'
          : ''
      } else {
        this.date = '--'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.dateTyep {
  @include color(A6);
}
.timeType {
  @include color(A8);
}
span {
  display: block;
}
</style>
