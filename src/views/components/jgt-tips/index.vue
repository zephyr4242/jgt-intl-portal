<template>
  <div class="jgt-tips" flex="dir">
    <div :class="`title ${ noLeftMargin ? 'no-left-margin' : '' }`" flex-box="0">
      <d2-icon :name="icon"></d2-icon>
      <span>{{title}}</span>
    </div>
    <div class="content" flex-box="1">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'jgt-tips',
  props: {
    title: {
      type: String,
      default: '温馨提示：'
    },
    icon: {
      type: String,
      default: 'exclamation-circle'
    },
    noLeftMargin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.jgt-tips {
  font-size: 12px;
  line-height: 16px;
  padding: 8px 16px;
  @include backgroundColor(A22);
  @include color(A29);
  .title {
    font-weight: bold;
    i {
      margin-right: 5px;
    }
    &.no-left-margin{
      i{
        margin-left: 0;
      }
    }
  }
}
</style>
