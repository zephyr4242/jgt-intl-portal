<template>
    <ul class="item_box" v-if="dataList && dataList.length" >
      <li v-for="(item, index) in dataList" :key="index" class="item">
        <span :title=" item.label">{{ item.label }}</span>
        <span class="el-icon-close" @click="delClick(item)"></span>
      </li>
    </ul>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    delClick (item) {
      this.$emit('delClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
    ul {
      li {
        height: 24px;
        border-radius: 2px;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @include color(A6);
        cursor: pointer;
        span {
          width: 422px;
          overflow: hidden;
          text-overflow: ellipsis; //超出部分以省略号显示
          white-space: nowrap;
          font-size: 13px;
        }
        .el-icon-close {
          display: none;
          width: 16px;
        }
        &:hover {
          @include backgroundColor(A2h);
          @include color(A10);
          .el-icon-close {
            display: block;
          }
        }
      }
    }

</style>
