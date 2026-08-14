<template>
  <div v-bind="$attrs">
    <pre style="text-align: left;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: visible;
      display: flex;
      align-items: center;"
      class="rate-txt-box">{{ text }}</pre>
  </div>
</template>
<script>
// 专门用于公告的单元格，属于业务组件
export default {
  name: 'RateTxt',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop() {
      this.init()
    }
  },
  data() {
    return {
      text: null
    }
  },
  computed: {},
  created() { },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const data = this.prop?.row ?? {}

      const text = this.prop?.column?.prop
      this.text = text ? data[text] : ''
    }
  }
}
</script>
<style scoped lang="scss">
.rate-txt-box {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: visible;
  display: flex;
  margin-top: 10px;
}
</style>
