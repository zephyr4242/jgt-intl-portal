<template>
  <div class="expand-table-box">
    <el-table
      class="expand-table"
      ref="jgtExpandTable"
      v-bind="tableAttrData"
      v-on="$listeners"
      :header-cell-class-name="headerCellClassName"
      :span-method="spanMethod"
    >
    <el-table-column
      v-if="isSelection"
      type="selection"
      width="50">
    </el-table-column>
    <el-table-column
      label="序号"
      v-if="isIndex"
      type="index"
      align="center"
      width="60">
      <template slot-scope="scope">
          <span >{{ setIndexSort(scope) }} </span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(i, index) in tableThData"
      :key="index"
      v-bind="i"
      :min-width="i.width ? i.width : ''"
      :width="i.fixedWidth || ''"
      :show-overflow-tooltip="i['show-overflow-tooltip'] === false || i['showOverflowTooltip'] === false ? false : true"
      header-cell-class-name="last-th-box"
    >
      <template slot-scope="scope">
        <TableHeaderCell
          v-if="i.render"
          :prop="{row: scope.row, index:scope.$index, column: i, render:i.render, that: $parent}"
        />
        <component
          v-else-if="i.componentsName"
          :is="i.componentsName"
          v-on="$listeners"
          :prop="{row: scope.row, index:scope.$index, column: i}"
          />
        <slot v-else-if="i.slotName"
          :name="i.slotName"
          :row="scope.row"
          :index="scope.$index"
          :column="scope.column"
          >
        </slot>
        <span
          v-else
          v-text="scope.row[i.prop] || ''"
          :class="{ 'table-color-disable': !scope.row[i.prop] }"
        >
        </span>
      </template>
    </el-table-column>
    <!-- <el-table-column type="expand" width="1">
      <template slot-scope="props">
        <slot
          name="expand-table"
          :row="props.row"
          :index="props.$index"
          :column="props.column"
        ></slot>
      </template>
    </el-table-column> -->

    </el-table>
    <div class="expend-btn" v-if="isShow" :class="{'expend-btn-bg': !isClickMore}">
      <el-button
        class="handle-btn"
        :type="'text'"
        size="small"
        @click="moreClick"
        >
        {{isClickMore ? '查看全部' : '收起'}}
        <i :class="[isClickMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up' ]"></i>
      </el-button>
    </div>
    <el-pagination
      class="footer"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-show="isPagination && pagination.total > showCount">
    </el-pagination>
  </div>
</template>

<script>
import TableHeaderCell from '../components/TableHeaderCell'
import DateTime from '../components/DateTime'
import HandleBtns from '../components/HandleBtns'
import MoneyStr from '../components/MoneyStr'
import CenterEllipsis from '../components/CenterEllipsis'
import MultiLineBox from '../components/MultiLineBox'
import FundNameCode from '../components/FundNameCode'
import StatusName from '../components/StatusName'
import ProductInfo from '../components/productInfo.vue'
import PdfList from '../components/pdfList.vue'
import nodata from '@/components/nodata'
import CombineInLine from '../components/CombineInLine'
import DateRange from '../components/DateRange'
import NumberFormat from '../components/NumberFormat'
import CellLink from '../components/CellLink'
import QuartileRankings from '../components/QuartileRankings'
import HeaderWithHint from '../components/HeaderWithHint'
import CellText from '../components/CellText'
import DiscountCell from '../components/DiscountCell'
import CellNoUrlLink from '../components/CellNoUrlLink'
import CNDay from '../components/CNDay'
import NoticeCell from '../components/NoticeCell'
import FundScore from '../components/FundScore'
import BusinFlagName from '../components/BusinFlagName'
import TradeDirection from '../components/TradeDirection'
import RequestShare from '../components/RequestShare'
import MoneyEdit from '../components/MoneyEdit'
import CellEmptySetTxt from '../components/CellEmptySetTxt'
import JySwitch from '../components/JySwitch'
import jyHint from '@/components/jy-hint'
import RequestShareMoney from '../components/RequestShareMoney'
const BusinessQualification = { name: 'BusinessQualification', render (h) { return null } }
export default {
  name: 'jgtExpandTable',
  components: {
    jyHint,
    TableHeaderCell,
    DateTime,
    HandleBtns,
    MoneyStr,
    CenterEllipsis,
    MultiLineBox,
    StatusName,
    ProductInfo,
    PdfList,
    nodata,
    CombineInLine,
    DateRange,
    NumberFormat,
    CellLink,
    QuartileRankings,
    HeaderWithHint,
    CellText,
    DiscountCell,
    CellNoUrlLink,
    CNDay,
    NoticeCell,
    FundNameCode,
    FundScore,
    BusinFlagName,
    BusinessQualification,
    TradeDirection,
    RequestShare,
    MoneyEdit,
    CellEmptySetTxt,
    JySwitch,
    RequestShareMoney
  },
  props: {
    tableAttr: {
      type: Object,
      default: () => null
    },
    tableTh: {
      type: Array,
      default: () => []
    },
    addIndex: {
      type: Number,
      default: 0
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: true
    },
    isPagination: {
      type: Boolean,
      default: true
    },
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
    },
    isMore: {
      type: Boolean,
      default: false
    },
    spanMethod: {
      type: Function,
      default: () => {}
    }

  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      isResetCurrent: true,
      // 前端分页的数据
      frontendData: [],
      attrData: {
        stripe: true,
        rowClassName: 'details-row-class-name',
        tooltipEffect: 'dark',
        style: {
          swidth: '100%'
        }
      },
      isClickMore: true
    }
  },
  computed: {
    tableData () {
      const objData = {
        data: []
      }
      if (this.isMore && this.tableAttr.data && this.tableAttr.data.length > 5 && this.isClickMore) {
        objData.data = this.tableAttr.data.filter((item, index) => {
          return index <= 4
        })
      } else {
        objData.data = this.tableAttr.data
      }
      return objData
    },
    tableThData () {
      return JSON.parse(JSON.stringify(this.tableTh))
    },
    isShow () {
      return this.isMore && this.tableAttr.data && this.tableAttr.data.length > 5
    },
    setIndexSort (scope) {
      return (scope) => {
        return this.isIndexSort ? scope.$index + 1 + (this.pagination.currentPage - 1) * this.pagination.pageSize : scope.$index + 1
      }
      // 风险测评计算属性控制
    },
    tableAttrData () {
      const tableAttr = JSON.parse(JSON.stringify(this.tableAttr))
      const objData = {
        data: []
      }
      if (this.isMore && tableAttr.data && tableAttr.data.length > 5 && this.isClickMore) {
        objData.data = tableAttr.data.filter((item, index) => {
          return index <= 4
        })
      } else {
        objData.data = tableAttr.data
      }
      return { ...this.attrData, ...tableAttr, ...objData }
    }
  },
  watch: {
    /* tableTh: {
      handler (val, oldVal) {
        this.tableThData = JSON.parse(JSON.stringify(this.tableTh))
      },
      deep: true
    } */
  },
  created () {
    this.pagination.pageSize = Number(this.pageSize)
  },
  mounted () {
  },
  beforeDestroy () {},
  methods: {
    moreClick () {
      this.isClickMore = !this.isClickMore
      window.scrollTo(0, 0)
    },
    // 隐藏boder
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === this.tableTh.length) {
        return 'column-last-th-box'
      }
    },
    handleSizeChange (val) {
      this.isResetCurrent = false
      this.pagination.pageSize = val
      // 分页数量变更时，当前页码置为1
      this.pagination.currentPage = 1
      if (this.frontend) {
        this.$emit('change')
      } else {
        this.$emit('change', this.getPagingData())
      }
    },
    handleCurrentChange (val) {
      this.isResetCurrent = false
      this.pagination.currentPage = val
      if (this.frontend) {
        this.$emit('change')
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
      } else {
        this.frontendData = data
        this.pagination.currentPage = 1
        this.pagination.total = data.length
        this.$emit('change', this.getPagingData())
      }
    },
    expansionRow (row, type) {
      this.$refs.jgtTable.toggleRowExpansion(row, type)
    },
    queryData () {
      this.$emit('queryDataChange', this.$refs.tableFooter)
    }
  }
}
</script>
<style lang="scss" scoped>
  .statusClass{
    @include color(A18);
  }
  .expand-table-box{
    @include backgroundColor(A1);
    padding: 8px;
  }
  .expend-btn{
    margin-top: -1px;
    height: 56px;
    line-height: 56px;
    @include backgroundImage(expendBg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    button{
      font-size: 14px;
    }
  }
  .expend-btn-bg{
    background: transparent !important;
  }
</style>
<style lang="scss">
.expand-table-box{
  .expand-table.el-table {
    .details-row-class-name {
      .is-left {
        text-align: left !important;
      }
    }
    th.is-leaf {
      @include backgroundColor(A14O1);
      @include color(A15);
      &.el-table__expand-column{
        border: none !important;
      }
    }
  }
}

.expand-table-box .expand-table.el-table th.is-leaf:first-child{
  border: none;
}

</style>
