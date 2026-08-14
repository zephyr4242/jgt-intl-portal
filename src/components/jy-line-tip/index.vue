<template>
    <div class="jy-line-tip">
        <div class="jy-line-tip-idx">{{ idx }}</div>
        <div class="jy-line-tip-context">{{ context }}</div>
    </div>
</template>

<script>
export default {
  name: 'jy-line-tip',
  props: {
    idx: {
      type: String,
      required: true
    },
    context: {
      type: String,
      required: true
    }
  }

}
</script>

<style lang="scss" scoped>
.jy-line-tip {
    display: flex;

    .jy-line-tip-title-idx {
        width: 24px;
    }

    .jy-line-tip-title-context {
        flex: 1
    }
}
</style>
