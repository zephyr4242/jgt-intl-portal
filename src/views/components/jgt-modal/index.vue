<template>
  <transition name="animation">
    <div
      class="dialogBox"
      :class="{ isShowMask: mask == true }"
      v-show="dialogTableVisible"
      @click="clickMaskCloseFn"
    >
      <div class="dialog-box-content" @click.stop>
        <div class="modal-head">
          <slot name="header">
            <span>{{ title }}</span>
          </slot>
          <i class="el-icon-close" @click="close" v-show="showCloseIcon"> </i>
        </div>
        <div class="modal-boday">
          <slot></slot>
        </div>
        <div class="modal-foot">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dialogComponent',
  props: {
    cls: {
      type: String,
      default: ''
    },
    // 控制是否展示或隐藏对话框
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    // 父组件传过来的标题值
    title: {
      type: String,
      default: ''
    },
    // 是否显示关闭小图标
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    // 是否开启背景遮罩层
    mask: {
      type: Boolean,
      default: true
    },
    // 是否点击遮罩层mask关闭弹出框
    clickMaskClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    // 关闭弹出框
    close () {
      this.$emit('onModalClose', false)
    },
    // 点击遮罩层关闭弹框
    clickMaskCloseFn () {
      // this.$emit('onModalClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogBox {
  width: 100%;
  height: 100%;
  position: fixed;
  // top: 10px;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog-box-content {
    max-width: 800px;
    border-radius: 2px;
    overflow: hidden;
    .modal-head {
      font-size: 16px;
      line-height: 18px;
      @include color(A10);
      font-weight: 600;
      box-sizing: border-box;
      @include backgroundColor(A12);
      @include borderColor(A2h);
      border-bottom: 1px solid;
      border-top-width: 3px;
      border-top-style: solid;
      @include borderTopColor(A10);
      padding: 9px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      // border-bottom: 1px solid ;
      border-bottom: 1px solid;
      span {
        font-size: 24px;
      }
      i {
        font-size: 18px;
        cursor: pointer;
        @include color(A8);
        font-weight: 600;
        &:hover{
          @include color(A10);
        }
      }
    }
    .modal-boday {
      padding: 24px;
      height: calc(100% - 120px);
      @include backgroundColor(A2);
    }
    .modal-foot {
      width: 100%;
      margin-top: -1px;
      @include backgroundColor(A2);
      .el-button {
        margin-left: 12px;
      }
    }
  }
}
.isShowMask {
  background-color: rgba(0,0,0,.6);
}
.animation-enter,
.animation-leave-to {
  opacity: 0;
}
.animation-enter-active,
.animation-leave-active {
  transition: opacity 0.3s;
}
</style>
