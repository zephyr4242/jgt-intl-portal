<template>
  <div class="jgt-expand-button">
    <div class="jgt-expand-button-bg"></div>
    <div class="iconfont-mianbanbeijing jgt-expand-button-btnbg"></div>
    <div @click="switchExpand">
      <span
        v-if="expand"
        class="iconfont-mianbanshouqi  jgt-expand-button-text"
      ></span>
      <span
        v-else
        class="iconfont-mianbanzhankai  jgt-expand-button-text"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jgt-expand-button',
  props: {
    expand: {
      type: Boolean,
      required: true,
      default: true
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    switchExpand () {
      if (!this.disable) {
        this.$emit('switchExpand', this.expand)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jgt-expand-button {
  position: relative;
  text-align: center;
  .jgt-expand-button-bg {
    width: 100%;
    height: 8px;
    @include backgroundColor(A1);
  }
  .jgt-expand-button-btnbg {
    @include color(A1);
    position: absolute;
    line-height: 0;
    font-size: 150px;
    height: 8px;
    left: calc(50% - 75px);
    // 这个图。。。
    pointer-events: none;
  }
  .jgt-expand-button-text {
    @include color(A8);
    position: absolute;
    width: 120px;
    left: calc(50% - 60px);
    top: 2px;
    line-height: 16px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
