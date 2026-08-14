<template>
  <div v-bind="$attrs" class="quartile-rankings">
    <div class="quartile-rankings-div-container">
      <div class="quartile-rankings-div" :class="{'quartile-rankings-fourth':rank > 3}"/>
      <div class="quartile-rankings-div" :class="{'quartile-rankings-third':rank > 2}"/>
      <div class="quartile-rankings-div" :class="{'quartile-rankings-second':rank > 1}"/>
      <div class="quartile-rankings-div" :class="{'quartile-rankings-first':rank > 0}"/>
    </div>
    <div class="quartile-rankings-text">{{text}}</div>

  </div>
</template>
<script>
export default {
  name: 'QuartileRankings',
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
      rank: null,
      text: [],
      rankText: null
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
      let rank = prop ? Number(data[prop]) : null

      // 只有 rank 为1-4时，进行翻译
      if ([1, 2, 3, 4].includes(rank)) {
        this.rank = rank
      } else {
        this.rank = 0
      }

      const array = this.prop?.column?.text || ['', '不佳', '一般', '良好', '优秀']
      this.text = array[this.rank]
    },
    click (url) {
      window.open(url, '_blank')
    }
  }
}
</script>
<style scoped lang="scss">
.quartile-rankings{
  .quartile-rankings-div-container{
    margin: 4px 0;
    .quartile-rankings-div {
      margin: 0 auto;
      width: 60px;
      height: 10px;
      &.quartile-rankings-fourth{
        @include backgroundColor(A28,1)
      }
      &.quartile-rankings-third{
         @include backgroundColor(A27,1)
      }
      &.quartile-rankings-second{
         @include backgroundColor(A26,1)
      }
      &.quartile-rankings-first{
        @include backgroundColor(A25,1)
      }
    }
  }

  .quartile-rankings-text{
    @include color(A10);
  }

}
</style>
