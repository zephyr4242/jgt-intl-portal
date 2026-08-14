<template>
    <span @click="goFrp" class="frp-link">
        <!-- frp-link-logo注意添加top等定位 -->
        <img :src="frpLogo" alt="体验投研功能" :height="height" class="frp-link-logo"
        :style="{top:top, right:right}"
        >
    </span>
</template>

<script>
import themeImage from '@/mixins/themeImage'

export default {
  name: 'frp-link',
  mixins: [themeImage],
  props: {
    height: {
      type: String,
      default: '40px',
      required: true
    },
    options: {
      required: true
    },
    top: {
      type: String,
      default: '0'
    },
    right: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      frpLogo: ''
    }
  },
  mounted() {
    this.registerThemeImage('frpLogo', '/common/frp-logo.png')
  },
  methods: {
    goFrp() {
      this.util.isGoFrp(this.options)
    }
  }
}
</script>
<style lang="scss" scoped>
.frp-link{
    cursor: pointer;
    position: relative;
    vertical-align: middle;

    .frp-link-logo{
      vertical-align: middle;
      position: absolute;
    }

}
</style>
