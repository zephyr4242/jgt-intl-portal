<!-- 空数据占位图 -->
<template>
  <div class="jy-empty-container" :style="`height: ${height}`">
    <div class="jy-empty-content">
      <img :src="noDataUrl" alt="暂无数据">
      <p>{{ text }}</p>
      <p>
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const noDataWebImag = require('@/assets/images/nodata.png')
const noClientDataImag = require('@/assets/images/no_client_data.png')

export default {
  name: 'JyEmptyData',
  props: {
    height: {
      type: String,
      default: '100%'
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('d2admin/theme', ['activeName']),
    isClientTrue () {
      return this.$isClient || this.activeName === 'client'
    },
    noDataUrl () {
      return this.isClientTrue ? noClientDataImag : noDataWebImag
    }
  }
}
</script>

<style lang="scss" scoped>
.jy-empty-container {
  width: 100%;
  height: 100%;
  position: relative;
  .jy-empty-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img{
    height: 126px;
  }
  p {
    width: 100%;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    position: absolute;
    top: 100px;
    @include color(A10);
  }
}
</style>
