<template>
    <div class="page" :class="{'page-client': isClientTrue || false}">
        <div class="doc">{{content}}</div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    content: {
      type: String,
      default: '暂无数据'
    }
  },
  computed: {
    ...mapState('d2admin/theme', [
      'activeName'
    ]),
    isClientTrue () {
      return this.$isClient || this.activeName === 'client'
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
    background: url(~@/assets/images/nodata.png) center no-repeat;
    background-size: 300px;
    width: 100%;
    height: 400px;
    position: relative;
    .doc {
        font-size: 14px;
        position: absolute;
        right: 50%;
        bottom: 32%;
        transform: translate(50%,50%);
        @include color(A8);
    }
}
.page-client{
  background: url(~@/assets/images/no_client_data.png) center no-repeat;
  background-size: 300px;
  height: 250px;
  padding-top: 150px;
  position: relative;
  .doc {
      font-size: 14px;
      position: absolute;
      right: 50%;
      bottom: 32%;
      transform: translate(50%,50%);
      color: #838383;
  }
}
</style>
