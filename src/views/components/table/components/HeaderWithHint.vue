<template>
  <span class="tips-header">
    <span>
      <pre v-html="text"></pre>
    </span>
    <jy-hint v-if="hint">
      <pre v-html="hint"></pre>
    </jy-hint>
  </span>
</template>
<script>
import jyHint from '@/components/jy-hint'
export default {
  name: 'HeaderWithHint',
  components: { jyHint },
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
      text: null,
      hint: null
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const option = this.prop?.column?.headerOptions
      this.text = option?.text
      this.hint = option?.hint || ''
      // this.array = this.hint.split('\n')
    }
  }
}
</script>
<style scoped lang="scss">
  .tips-header{
    display: flex;
    align-items: baseline;
    justify-content: center;
    pre{
      margin: 0;
    }
    span{
      margin-right: 2px;
    }
  }
</style>
