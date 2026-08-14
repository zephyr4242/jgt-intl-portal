<template>
  <div>
    <!-- 单行 带连接 -->
    <div @click="click" class="celllink" :class="prop.column.propClassName || ''">
      {{ prop.row[prop.column.prop] }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'CellLink',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    click () {
      this.$emit('linkClick', this.prop.row)
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
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
