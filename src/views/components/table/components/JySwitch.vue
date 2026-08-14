<template>
  <el-switch
    v-if="prop"
    class="jy-switch"
    :width="68"
    v-model="isActive"
    :active-value="prop.column.activeValue"
    :inactive-value="prop.column.inactiveValue"
    :active-text="prop.column.activeText"
    :inactive-text="prop.column.inactiveText"
    disabled
    @click.native="clickSwitch"
    ></el-switch>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'JySwitch',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      text: null,
      hint: null
    }
  },
  computed: {
    isActive() {
      const { row, column } = cloneDeep(this.prop)
      return row[column.prop]
    }
  },
  methods: {
    clickSwitch () {
      this.$emit('switchClick', this.prop)
    }
  }
}
</script>
<style scoped lang="scss">
    .jy-switch{
        cursor: pointer;
    }
</style>
