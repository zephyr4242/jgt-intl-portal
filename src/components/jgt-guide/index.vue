<template>
  <div class="jgt-guide" :style="{ top: top , opacity: opacity }" v-if="!hideAlways && show">
    <slot />
    <div class="jgt-guide-arrow" ></div>
    <i class="el-icon-close jgt-guide-close-btn" @click="foreverHide"></i>
  </div>
</template>

<script>
const prefix = 'jgt-guide-'
export default {
  name: 'jgt-guide',
  props: {
    // 相对于该dom元素的y值进行定位。 水平方向直接外层通过style写死即可
    parentId: {
      type: String,
      required: true,
      default: 'app'
    },
    // 整个content高度, 不含尾巴
    // 可以调整y方向偏移，正数向上，负数向下
    guideHeight: {
      type: Number,
      required: false,
      default: 80
    },
    // 如果为true，则只在首次进入提示一次，
    onlyOnce: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    opacity () {
      return this.show ? 1 : 0
    }
  },
  data () {
    return {
      // 向上偏移距离
      top: '0px',
      show: true,
      hideAlways: false
    }
  },
  mounted () {
    if (localStorage.getItem(prefix + this.parentId)) {
      this.hideAlways = true
      this.show = false
      return
    }

    this.computeTop()

    // 从较长的页面到改页面时，会触发该页面滚动事件
    setTimeout(() => {
      this.computeTop()
      document.getElementById('app').addEventListener('scroll', this.scrollChange, true)
    }, 100)
  },
  beforeDestroy () {
    document.getElementById('app').removeEventListener('scroll', this.scrollChange, true)
  },
  methods: {
    computeTop () {
      const dom = document.getElementById(this.parentId)

      if (!dom) return
      const top = dom.getBoundingClientRect().top || 0
      this.top = top - this.guideHeight - 10 + 'px'

      if (this.onlyOnce) {
        // 首次进入页面之后，不再提示
        localStorage.setItem(prefix + this.parentId, '1')
      }
    },
    scrollChange () {
      this.show = false
      this.computeTop()
    },
    // 认为看过了，永久隐藏
    foreverHide () {
      this.hideAlways = true
      this.show = false

      localStorage.setItem(prefix + this.parentId, '1')
    },
    // 本次隐藏
    hide () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.jgt-guide {
  position: fixed;
  padding: 10px;
  @include backgroundColor(A2h);
  border: 2px solid transparent;
  @include borderColor(A10);
  box-shadow: 0 6px 12px 0 rgb(0 0 0 / 15%);
  z-index: 6;
  line-height: 20px;
  font-size: 14px;
  // 隐藏过渡
  transition: opacity 0.5s;

  .jgt-guide-close-btn{
    position: absolute;
    right: 10px;
    top: 13px;
    cursor: pointer;
  }

  .jgt-guide-arrow {
    position: absolute;
    bottom: -32px;
    right: 10px;
    width: 6px;
    height: 6px;
    padding: 4px;
    border-radius: 50%;
    @include backgroundColor(A2O1);
    &::before {
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      @include backgroundColor(A10);
      border-radius: 50%;
    }
    &::after {
      content: "";
      display: block;
      width: 2px;
      height: 21px;
      @include backgroundColor(A10);
      position: absolute;
      bottom: 10px;
      right: 6px;
    }
  }

  .jgt-guide-show{
    display: none;
  }
}
</style>
