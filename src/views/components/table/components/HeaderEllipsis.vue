<template>
  <jy-tooltip :content="label" placement="top">
    <p>{{ label }}</p>
  </jy-tooltip>
</template>

<script>
export default {
  name: 'HeaderEllipsis',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    label () {
      return this.prop?.column?.label
    }
  }
}
</script>
