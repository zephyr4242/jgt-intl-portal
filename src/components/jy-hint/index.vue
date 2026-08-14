<template>
  <el-tooltip :placement="placement" :disabled="disabled" :offset="offset">
    <i :class="[icon, themeType ? `jy-hint-theme-${themeType}` : '']" class="tooltips-icon" :style="{ fontSize: fontSize }"></i>
    <div slot="content" class="jy-hint-slot">
      <slot></slot>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'jy-hint',
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    offset: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: 'iconfont-wenhao-fill'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // icon的类型 gradient：渐变色
    themeType: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.jy-hint-slot {
  font-size: 12px;
  line-height: 24px;
  pre{
    margin: 0;
  }
  .redeem-fee-detail{
    div.el-table{
      background: #232323 !important;
      color: #fff !important;
    }
  }
  // 表格
  // 表头
  th.is-leaf {
    background: #232323 !important;
    color: #fff !important;
    border-color: #232323 !important;
    font-weight: bold;
  }

  // 表格
  tr.el-table__row {
    color: #fff !important;
    background: #232323 !important;
    &:hover > td {
      color: #fff !important;
      background: #232323 !important;
    }

    &.hover-row {
      td {
        color: #fff !important;
        background: #232323 !important;
      }
    }
  }
  // 表格内边框线隐藏
  &.el-table--border td {
    border-color: transparent;
  }
}
.jy-hint-theme-gradient {
  @include backgroundImage(A24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
