 <template>
  <div v-bind="$attrs">
    {{ text }}
  </div>
</template>
<script>
export default {
  name: 'CellText',
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
      text: null
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
      const prop = this.prop?.column?.prop
      const nullText = this.prop?.column?.nullText ?? '--'
      this.text = (prop && data[prop]) ?? nullText
      if (this.text === '') {
        this.text = nullText
      }
    }
  }
}
</script>
