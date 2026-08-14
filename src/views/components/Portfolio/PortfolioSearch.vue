<template>
  <el-input :placeholder="placeholder" clearable v-model="keyword" @input="keywordChange" :size="size" :style="{'width':width}">
    <em slot="prefix" class="el-input__icon el-icon-search" />
  </el-input>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'PortfolioSearch',
  props: {
    width: {
      type: String,
      default: '200px',
      required: false
    },
    size: {
      type: String,
      default: 'mini',
      required: false
    },
    placeholder: {
      type: String,
      default: '请搜索基煜账户名称',
      required: false
    }
  },
  data() {
    return {
      keyword: '',
      // 搜索防抖 0.3s
      keywordSearch: debounce(this.notify, 300)
    }
  },
  methods: {
    notify() {
      this.$emit('change', this.keyword)
    },

    keywordChange() {
      if (this.util.isEmpty(this.keyword)) {
        this.keyword = ''
      } else {
        this.keyword = this.keyword.trim()
      }
      this.keywordSearch()
    },

    clearKeyword() {
      this.keyword = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
