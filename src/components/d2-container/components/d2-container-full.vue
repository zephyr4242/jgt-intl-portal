<template>
  <div class="d2-container-full-box">
    <div class="d2-container-full">
      <div class="d2-container-full__body" ref="body" :class="{'d2-container-full__body_client': $isClient}">
        <div v-if="$slots.header" class="d2-container-full__header" ref="header">
          <slot name="header"/>
        </div>
        <div :style="`min-height: ${minHeight}px;margin-bottom: 16px;`" class="d2-container-full__body--slot">
          <slot/>
        </div>
      </div>
    </div>
    <div v-if="$slots.footer" class="d2-container-full__footer" ref="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'd2-container-full',
  props: ['showFooter'],
  components: {
  },
  computed: {
    ...mapState('d2admin', {
      asideCollapse: state => state.menu.asideCollapse
    })
  },
  data: function () {
    return {
      minHeight: 450
    }
  },
  mounted () {
    window.onresize = this.setMinHeight
    // 初始执行一次
    this.setMinHeight()
  },
  methods: {
    setMinHeight () {
      // 180（底部） + 16（间距） + 56（页面标题） + 31（tab） + 40（操作栏） - 5（不知道为啥多5）
      let minHeight = document.body.clientHeight - 328 + 5
      this.minHeight = minHeight < 450 ? 450 : minHeight
      this.minHeight = this.minHeight + 180
    }
  }
}
</script>

<style lang="scss">
.d2-container-full-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.d2-container-full__body--slot{
  @include backgroundColor(A2);
  position: relative;
}
.page-bg-1  {
  .d2-container-full {
    background-image: url(~@/assets/images/page/common/page-bg-1.png);
    background-repeat: no-repeat;
    background-size: 230px 160px;
    background-position: right top;
  }
  .d2-container-full__header {
    background-color: transparent !important;
  }
}
</style>
