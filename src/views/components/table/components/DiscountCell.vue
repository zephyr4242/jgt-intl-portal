<template>
  <div v-bind="$attrs"  class="discount-cell">
    <div v-if="discountValue">
      <span class="discount-cell-origin">{{ value }} </span>
      <span class="discount-cell-after">{{ discountValue }}</span>
    </div>
    <div v-else>
      <span>{{ value }} </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DiscountCell',
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
      value: null,
      discountValue: null
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
      this.value = prop && data[prop]
      if (this.prop?.column?.num) {
        this.value = Number(this.value).toFixed(this.prop?.column?.num)
      }
      this.value = this.prop?.column?.unit ? this.value + this.prop?.column?.unit : this.value
      this.discountValue = data.discountValue
    }
  }
}
</script>

<style lang="scss" scoped>
.discount-cell-origin{
  text-decoration: line-through;
}

.discount-cell-after{
  @include color(A20);
}
</style>
