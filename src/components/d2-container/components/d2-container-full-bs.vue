<template>
  <div class="d2-container-full-bs">
    <div v-if="$slots.header" class="d2-container-full-bs__header" ref="header">
      <slot name="header"/>
    </div>
    <div class="d2-container-full-bs__body" ref="wrapper">
      <div class="d2-container-full-bs__body-wrapper-inner">
        <div :style="`min-height: ${minHeight}px;background-color: #ffffff;position:relative;`">
          <slot/>
        </div>
        <jgt-footer></jgt-footer>
      </div>
    </div>
    <div v-if="$slots.footer" class="d2-container-full-bs__footer" ref="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
import bs from './mixins/bs'
import jgtFooter from './jgt-footer'
export default {
  name: 'd2-container-card-bs',
  components: {
    jgtFooter
  },
  mixins: [
    bs
  ],
  data: function () {
    return {
      minHeight: 450
    }
  }
}
</script>
