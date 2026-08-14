<template>
  <div class="fundScore" v-if="score">
    <div>
      <span class="bigSpan">{{ score.substr(0, 1) }}</span>
      <span>{{ score.substr(1) }}</span>
    </div>
    <div>{{ rowData[columnData.prop1] }}</div>
  </div>
  <div v-else>--</div>
</template>
<script>
export default {
  name: 'FundScore',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    score () {
      if (!this.rowData || !this.rowData[this.columnData.prop]) {
        return null
      }
      return Number(this.rowData[this.columnData.prop]).toFixed(2)
    }
  },
  data () {
    return {
      rowData: {},
      columnData: {}
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const { row, column } = this.prop
      this.rowData = row
      this.columnData = column
    }
  }
}
</script>
<style lang="scss">
.fundScore {
  font-size: 12px;
  @include color(A10);
  span {
    font-weight: bolder;
    font-style: italic;
  }
  .bigSpan {
    font-size: 20px;
  }
}
</style>
