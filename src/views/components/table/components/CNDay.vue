<template>
  <div v-bind="$attrs">
    {{dayStr}}
  </div>
</template>
<script>
export default {
  name: 'CNDay',
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
      dayStr: null
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
      this.dayStr = this.day2CN(data[prop])
    },

    // 格式化天数
    // @param data 天数
    //  @return string 不满一年时显示天数，超过一年，显示x年又xx天
    day2CN (data) {
      if (!data) {
        return '--'
      }
      data = parseInt(data)
      var year = parseInt(data / 365)
      if (year === 0) {
        return data + '天'
      } else {
        var day = data - year * 365
        return year + '年又' + day + '天'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.celllink {
  @include color(A10);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
