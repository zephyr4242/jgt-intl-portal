<template>
  <div class="jy-panel">
    <div class="jy-panel__title">
      <span class="jy-panel__title-left">
        <span @click="isShow = !isShow">
          <slot name="title">title</slot>
        </span>
        <span>
          <slot name="icon"></slot>
        </span>
      </span>

      <span class="jy-panel__title-right">
        <!-- <slot name="titleRight"> -->
         <span class="isExpen"  @click="isShow = !isShow">
            {{ isShow ? "收起" : "展开" }}
            <i
              :class="{
                'el-icon-arrow-up': isShow,
                'el-icon-arrow-down': !isShow,
              }"
            ></i>
         </span>
          <!-- <i
            class="el-icon-caret-bottom el-icon--right"
            v-show="!isShow"
            @click="isShow = !isShow"
          >
            展开
          </i>
          <i
            class="el-icon-caret-top el-icon--right"
            v-show="isShow"
            @click="isShow = !isShow"
          >
            收起
          </i> -->
        <!-- </slot> -->
      </span>
    </div>

    <div class="jy-panel__split"></div>
    <transition name="jy-panel__fade">
      <div class="jy-panel__content" v-show="isShow">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'jy-panel',
  props: {
    collapsed: {
      type: Boolean,
      require: false,
      // 默认展开
      // 如果传入true 会默认折叠
      default: false
    }
  },
  created () {
    this.isShow = !this.collapsed
  },
  data () {
    return {
      isShow: true
    }
  }
}
</script>

<style lang="scss" scoped>
.jy-panel {
  border-bottom: 8px solid transparent;
  @include borderColor(A1);
  font-size: 14px;
  padding: 0 36px;
  box-sizing: border-box;
   .isExpen {
      cursor: pointer;
    }
  .jy-panel__title {
    padding: 20px 0;
    line-height: 20px;
    @include backgroundColor(A2);
    width: 100%;
    display: flex;
    justify-content: space-between;

    .jy-panel__title-left {
      @include color(A6);
      display: inline-block;
      font-weight: bold;
    }

    .jy-panel__title-right {
      @include color(A6);
      cursor: default;
      font-size: 12px;
      display: inline-block;
    }
  }
}

.jy-panel__split {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid transparent;
  @include borderColor(A1);
}

// 动效
.jy-panel__fade-enter-active,
.jy-panel__fade-leave-active {
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform: scaleY(1);
  opacity: 1;
  transform-origin: center top;
}
.jy-panel__fade-enter,
.jy-panel__fade-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
</style>
