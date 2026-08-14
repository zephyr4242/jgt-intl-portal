<template>
    <div class="jgt-tc warning-tips">
        <i class="el-icon-warning" style="font-size: 12px" v-if="icon"></i>
        <slot />
    </div>

</template>

<script>
export default {
  name: 'WarningTips',
  props: {
    // 是否显示！ 默认显示
    icon: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.warning-tips {
    top: 40px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    @include backgroundColor(A22);
    @include color(A29);
}
</style>
