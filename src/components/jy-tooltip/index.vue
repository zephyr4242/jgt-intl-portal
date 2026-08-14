<template>
    <el-tooltip class="jy-tooltip" :class="className" :placement="placement" :content="content" :close-delay="closeDelay" :open-delay="openDelay" :disabled="isDisabled || disabled" v-bind="$attrs">
      <slot></slot>
      <div slot="content" class="jy-tooltip_slot" v-if="!content">
        <slot name="content"></slot>
      </div>
    </el-tooltip>
</template>

<script>
/**
 * 注意：
 * 1，jy-tooltip所包含的元素 本身或者父级 必须有相应的宽度，
 * 2，如果需要动态计算是否tooltip  可以改动 jyTooltipId的值。
 *    例：表格表头可以拖动宽度 添加表头宽度变化监听，修改jyTooltipId的值。
 *        // 表头宽度变化
          headerDragend (newWidth, oldWidth, column, event) {
            // console.log(newWidth, oldWidth, column, event)
            if (column.label === '产品名称/代码') {
              this.$nextTick(() => {
                this.jyTooltipId = Math.random()
              })
            }
          }
   3，套在 el-checkbox上，如果需要行内展示，给父盒子布局方式需要为flex，不要给自身添加inline-block！  这样方可计算label文字的宽度
   4，套在 el-button上，默认会给.el-button 添加flex。 会给内部的文字元素span flex 1。 如果有icon  请用i标签或者其他标签
 */
export default {
  name: 'jy-tooltip',
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    content: {
      type: String,
      default: ''
    },
    openDelay: {
      type: Number,
      default: 300
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    jyTooltipId: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 固定宽度的 可关闭resize事件
    resizeFlag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isDisabled: false,
      observer: null,
      el: null,
      timer: null,
      className: ''
    }
  },
  watch: {
    jyTooltipId () {
      setTimeout(() => {
        this.initEle()
      }, 500)
    }
  },
  mounted () {
    this.addTooltipClass()
    if (this.resizeFlag) window.addEventListener('resize', this.resizeFunc)
  },
  beforeDestroy () {
    if (this.resizeFlag) window.removeEventListener('resize', this.resizeFunc)
  },
  methods: {
    resizeFunc () {
      // console.log('resizeFunc')
      clearTimeout(this.timer)
      this.timer = null
      this.timer = setTimeout(() => {
        this.initEle()
      }, 500)
    },
    addTooltipClass () {
      const firstElement = this.getFirstElement()
      if (!firstElement || !firstElement.elm) return null
      let el = firstElement.elm
      // console.log(el)
      if (el.nodeName === 'LABEL') {
        el.querySelector('.el-checkbox__label').classList.add('jy-tooltip_ellipsis')
        this.el = el.querySelector('.el-checkbox__label')
      } else if (el.nodeName === 'BUTTON') {
        el.querySelector('span').classList.add('jy-tooltip_ellipsis')
        this.el = el.querySelector('span')
      } else {
        // el.classList.add('jy-tooltip_ellipsis')
        this.className = 'jy-tooltip_ellipsis'
        this.el = el
      }
      this.initEle()
    },
    getFirstElement () {
      const slots = this.$slots.default
      if (!Array.isArray(slots)) return null
      let element = null
      for (let index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index]
        }
      }
      return element
    },
    initEle () {
      setTimeout(() => {
        let ow = this.el.offsetWidth
        let sw = this.el.scrollWidth
        if (sw > ow) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      }, 300)
    }
  }
}
</script>

<style lang="scss">
.jy-tooltip {
  width: 100%;
  &.el-checkbox {
    display: flex;
    align-items: center;
    .el-checkbox__label {
      flex: 1;
    }
  }
  &.el-button{
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      flex: 1;
    }
  }
}
.jy-tooltip_ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
