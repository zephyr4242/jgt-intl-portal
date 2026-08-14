<template>
  <el-pagination
    class="footer"
    :current-page="pagination.currentPage"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    :page-sizes="pageSizes"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    v-show="pagination.total > showCount">
  </el-pagination>
</template>

<script>
export default {
  props: {
    currentPage: {
      default: 1
    },
    pageSize: {
      default: 10
    },
    total: {
      default: 0
    },
    // 前端分页
    frontend: {
      default: true
    },
    // 大于该值时展示分页
    showCount: {
      type: Number,
      required: false,
      default: 5
    }
  },
  data: function () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isResetCurrent: true,
      // 前端分页的数据
      frontendData: [],
      pageSizes: [10, 20, 50, 200]
    }
  },
  watch: {
    pageSize: {
      handler (val, oldVal) {
        this.pagination.pageSize = val
      },
      deep: true
    }
  },
  created () {
    this.pagination.pageSize = Number(this.pageSize)
    this.pagination.currentPage = Number(this.currentPage)
    if (this.$isClient) {
      // 客户端最多20行
      this.pageSizes = [5, 10, 20]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.isResetCurrent = false
      this.pagination.pageSize = val
      // 分页数量变更时，当前页码置为1
      this.pagination.currentPage = 1
      if (this.frontend) {
        this.$emit('change', { pageSize: this.pagination.pageSize, currentPage: this.pagination.currentPage })
      } else {
        this.$emit('change', this.getPagingData())
      }
    },
    handleCurrentChange (val) {
      this.isResetCurrent = false
      this.pagination.currentPage = val
      if (this.frontend) {
        this.$emit('change', { pageSize: this.pagination.pageSize, currentPage: this.pagination.currentPage })
      } else {
        this.$emit('change', this.getPagingData())
      }
    },
    // 获取分页参数
    getParam () {
      // 如果是外部调用就重置当前页数
      if (this.isResetCurrent) {
        this.pagination.currentPage = 1
      } else {
        this.isResetCurrent = true
      }
      return {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
    },
    // 获取前端分页的数据
    getPagingData () {
      return this.frontendData.filter((item, index) => index >= (this.pagination.currentPage - 1) * this.pagination.pageSize && index <= this.pagination.currentPage * (this.pagination.pageSize) - 1)
    },
    updata (data) {
      if (this.frontend) {
        this.pagination.total = data.total
        this.pagination.currentPage = this.currentPage
        this.pagination.pageSize = this.pageSize
      } else {
        this.frontendData = data
        this.pagination.currentPage = 1
        this.pagination.total = data.length
        this.$emit('change', this.getPagingData())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  padding: 5px 10px;
  @include backgroundColor(A2)
}
</style>
