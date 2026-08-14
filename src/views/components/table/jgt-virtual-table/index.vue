<template>
  <div>
    <u-table
      v-if="tableAttr"
      ref="jgtTable"
      v-bind="tableAttrData"
      :header-cell-class-name="headerCellClassName"
      v-on="$listeners"
      @filter-change="filterChange"
      @sort-change="sortChange"
      :class="{ singleLineTable: singleLineTable }"
      v-loading="this.loading"
      :use-virtual="useVirtual"
      :data-changes-scroll-top="false"
      :highlight-current-row="false"
      :row-height="rowHeight"
      :max-height="maxHeight"
      :row-class-name="tableRowClassName"
    >
      <u-table-column
        v-if="isSelection"
        :fixed="isSelectionFixed"
        :selectable="isDisabled"
        :reserve-selection="true"
        class-name="header-cell-selection"
        type="selection"
        width="50"
      >
      </u-table-column>
      <u-table-column
        :fixed="isIndexFixed"
        label="序号"
        v-if="isIndex"
        type="index"
        align="center"
        width="50"
      >
        <template slot-scope="scope">
          <span>{{ setIndexSort(scope) }} </span>
        </template>
      </u-table-column>
      <u-table-column
        v-for="(i, index) in tableTh"
        :key="index"
        v-bind="i"
        :min-width="i.width ? i.width : ''"
        :width="i.fixedWidth || ''"
        :show-overflow-tooltip="
          i['show-overflow-tooltip'] === false ||
          i['showOverflowTooltip'] === false
            ? false
            : true
        "
      >
        <template slot="header" slot-scope="scope">
          <component
            v-if="i.customerHeaderName"
            :is="i.customerHeaderName"
            v-on="$listeners"
            :prop="{ row: scope.row, index: scope.$index, column: i }"
          />
          <span v-else> {{ scope.column.label }}</span>
        </template>
        <template slot-scope="scope">
          <TableHeaderCell
            v-if="i.render"
            :prop="{
              row: scope.row,
              index: scope.$index,
              column: i,
              render: i.render,
              that: $parent,
            }"
          />
          <component
            v-else-if="i.componentsName"
            :is="i.componentsName"
            v-on="$listeners"
            :prop="{ row: scope.row, index: scope.$index, column: i }"
          />
          <slot
            v-else-if="i.slotName"
            :name="i.slotName"
            :row="scope.row"
            :index="scope.$index"
            :column="scope.column"
            :conf="i"
          >
          </slot>

          <span
            v-else
            v-text="scope.row[i.prop] || ''"
            :class="{ 'table-color-disable': !scope.row[i.prop] }"
          >
          </span>
        </template>
      </u-table-column>
      <u-table-column
        class="expand-table"
        type="expand"
        width="1"
        v-if="isExpandTable"
      >
        <template slot-scope="props">
          <slot
            name="expand-table"
            :row="props.row"
            :index="props.$index"
            :column="props.column"
          ></slot>
        </template>
      </u-table-column>
      <template slot="empty" v-if="noDataUrl && emptyData.isEmpty">
        <el-empty
          class="jgt-table-empty"
          :image="emptyData.image || noDataUrl"
          :description="emptyData.description"
        >
          <el-button
            v-if="emptyData.label"
            class="handle-btn"
            @click="handleNoDataBtnFn"
            :type="'text'"
            size="small"
          >
            {{ emptyData.label }}
          </el-button>
        </el-empty>
      </template>
    </u-table>

    <el-pagination
      class="footer"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="pageSizes"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-if="showPagination"
    >
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
import { cloneDeep } from 'lodash'
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
import { mapState } from 'vuex'
import RequestShareMoney from '../components/RequestShareMoney'
import { UTable, UTableColumn } from 'umy-ui'
const BusinessQualification = { name: 'BusinessQualification', render (h) { return null } }
const noDataWebImag = require('@/assets/images/nodata.png')
const noClientDataImag = require('@/assets/images/no_client_data.png')
export default {
  name: 'jgtVirtualTable',
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
    RequestShareMoney,
    UTable,
    UTableColumn
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
    isIndexSort: {
      type: Boolean,
      default: true
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    isSelectionFixed: {
      type: [String, Boolean],
      default: false
    },
    isExpandTable: {
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: true
    },
    isIndexFixed: {
      type: [String, Boolean],
      default: false
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    // 旧接口的全量数据+前端分页
    isOldPagination: {
      type: Boolean,
      default: false
    },
    // 前端分页大于5条才显示分页器
    isGreaterThanShowCount: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => [5, 10, 20, 50]
    },
    // 是否是后台分页
    frontend: {
      type: Boolean,
      default: true
    },
    // 搜索过滤 '--' 将'--'排到最后面
    isSortFilter: {
      type: Boolean,
      default: false
    },
    // 专属产品排序
    isZSCPSort: {
      type: Boolean,
      default: false
    },
    // 大于该值时展示分页
    showCount: {
      type: Number,
      required: false,
      default: 5
    },
    // 强制隐藏分页
    hidePagination: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否为单行表格 false - 56px true - 40px
    singleLineTable: {
      type: Boolean,
      required: false,
      default: false
    },
    emptyData: {
      type: Object,
      default: () => {
        return {
          image: null,
          imageSize: null,
          description: '暂无数据',
          label: '立刻挑选产品',
          isEmpty: false
        }
      }
    },
    // 分页布局
    layout: {
      type: String,
      required: false,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 56
    },
    maxHeight: {
      type: Number,
      default: 600
    },
    useVirtual: {
      type: Boolean,
      default: true
    },
    tableRowClassName: {
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
      resizeHanlder: null,
      isResetCurrent: true,
      // 前端分页的数据
      frontendData: [],
      frontendFilterParams: {},
      attrData: {
        stripe: true,
        rowClassName: 'details-row-class-name',
        tooltipEffect: 'dark'
      }
    }
  },
  computed: {
    ...mapState('d2admin/theme', ['activeName']),
    setIndexSort (scope) {
      return (scope) => {
        return this.isIndexSort
          ? scope.$index +
              1 +
              (this.pagination.currentPage - 1) * this.pagination.pageSize
          : scope.$index + 1
      }
    },
    tableAttrData () {
      const tableAttr = cloneDeep(this.tableAttr) || JSON.parse(JSON.stringify(this.tableAttr))
      /*
        * 不需要高度设置
        * 设置最大高度 可以让小于10条数据时，自动适配高度
      */
      // return this.tableAttr.autoHeight ? { ...this.attrData, ...tableAttr } : { ...this.attrData, ...{ maxHeight: this.tableHeight }, ...tableAttr }
      return { ...this.attrData, ...tableAttr }
    },
    isDisabled () {
      return this.tableAttr.selectable !== undefined
        ? this.tableAttr.selectable
        : this.selectable
    },
    // 默认高度设置 用不到
    tableHeight () {
      if (this.isExpandTable && !this.tableAttr.autoHeight) {
        return 601
      } else {
        return this.tableAttr.data.length >= 10 ? 600 : 'auto'
      }
    },
    isClientTrue () {
      return this.$isClient || this.activeName === 'client'
    },
    noDataUrl () {
      return this.isClientTrue ? noClientDataImag : noDataWebImag
    },
    // 是否显示分页组件
    showPagination () {
      if (this.hidePagination) { // 隐藏分页
        return false
      }
      if (this.isOldPagination) { // 前端分页
        const arr = this.getOldFEPagingData()
        return this.isGreaterThanShowCount ? this.frontendData?.length > this.showCount : arr?.length > 0
      } else { // 后端分页
        return this.isPagination && this.pagination.total > this.showCount
      }
    }
  },
  watch: {
    currentPage: {
      handler (val, oldVal) {
        this.pagination.currentPage = Number(this.currentPage)
      },
      deep: true
    }
  },
  created () {
    this.pagination.pageSize = this.pageSize
  },
  mounted () {
    this.$nextTick(() => {
      this.resizeHanlderFn()
      this.$isClient &&
        window.addEventListener('resize', this.resizeHanlder, false)
    })
  },
  beforeDestroy () {
    this.resizeHanlder = null
    this.$isClient &&
      window.removeEventListener('resize', this.resizeHanlder, false)
  },
  deactivated () {
    this.resizeHanlder = null
    this.$isClient &&
      window.removeEventListener('resize', this.resizeHanlder, false)
  },
  methods: {
    handleNoDataBtnFn () {
      this.$emit('handleNoDataBtn')
    },
    clearSelection () {
      this.$refs.jgtTable.clearSelection()
    },
    resizeHanlderFn () {
      this.resizeHanlder = this.util.debounce(() => {
        if (this.$refs.jgtTable) {
          this.$refs.jgtTable.doLayout()
        }
      }, 100)
    },
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      let className = ''
      if (columnIndex === this.tableTh.length && this.isExpandTable) {
        className += 'column-last-th-box'
      }
      if (!this.tableAttr.data.length) {
        className += 'headerClass'
      }
      return className
    },
    selectable (row, index) {
      return true
    },
    handleSizeChange (val) {
      this.isResetCurrent = false
      this.pagination.pageSize = val
      // 分页数量变更时，当前页码置为1
      this.pagination.currentPage = 1
      if (this.isOldPagination) {
        this.$emit('feFilter', this.getOldFEPagingData())
      } else if (this.frontend) {
        this.$emit('paginationChange')
      } else {
        this.$emit('paginationChange', this.getPagingData())
      }
    },
    handleCurrentChange (val) {
      this.isResetCurrent = false
      this.pagination.currentPage = val
      if (this.isOldPagination) {
        this.$emit('feFilter', this.getOldFEPagingData())
      } else if (this.frontend) {
        this.$emit('paginationChange')
      } else {
        this.$emit('paginationChange', this.getPagingData())
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
    // 轮训无筛选接口获取分页参数
    getParam2 () {
      return {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
    },
    // 获取前端分页的数据
    getPagingData () {
      return this.frontendData.filter(
        (item, index) =>
          index >=
            (this.pagination.currentPage - 1) * this.pagination.pageSize &&
          index <= this.pagination.currentPage * this.pagination.pageSize - 1
      )
    },
    // 前端过滤后分页
    getOldFEPagingData () {
      if (!this.frontendData || this.frontendData.length <= 0) return []
      let dataList = this.frontendData.slice()
      const params = this.frontendFilterParams
      for (let key in params) {
        if (params[key]) {
          // 选择了某项的值不为null，则需要过滤
          dataList = dataList.filter((item) => item[key] === params[key])
        }
      }

      this.pagination.total = dataList.length
      return dataList.filter(
        (item, index) =>
          index >=
            (this.pagination.currentPage - 1) * this.pagination.pageSize &&
          index <= this.pagination.currentPage * this.pagination.pageSize - 1
      )
    },
    updata (data) {
      if (this.isOldPagination) {
        // pagesize 实际传的 10000
        if (data) {
          this.frontendData = data.dataList
          this.pagination.currentPage = data.page
          this.pagination.total = data.totalCount
        } else {
          this.frontendData = []
          this.pagination.currentPage = 1
          this.pagination.total = 0
        }
        this.$emit('feFilter', this.getOldFEPagingData())
      } else if (this.frontend) {
        this.pagination.total = data.total
      } else {
        this.frontendData = data
        this.pagination.currentPage = 1
        this.pagination.total = data.length
        this.$emit('paginationChange', this.getPagingData())
      }
    },
    expansionRow (row, type) {
      this.$refs.jgtTable.toggleRowExpansion(row, type)
    },
    filterChange (options) {
      let params = {}
      Object.keys(options).forEach((key) => {
        let prop = key.replace('FilterKey', '')
        // 单选默认第一项 注意该方法仅支持单选
        const value = options[key][0]
        params[prop] = value

        const conf = this.tableTh.find((config) => config.columnKey === key)
        const clicked = conf.filters.find((i) => value && i.value === value)
        if (clicked) {
          conf.label = clicked.text
        } else {
          conf.label = conf.allLabel
        }
        console.log(conf)
      })

      // 将选中的过滤项返回
      this.$emit('filterChange', params)

      if (this.isOldPagination) {
        this.frontendFilterParams = params
        this.pagination.currentPage = 1
        this.$emit('feFilter', this.getOldFEPagingData())
      }
    },

    sortChange ({ column, prop, order }) {
      if (this.isOldPagination) {
        if (this.isSortFilter) {
          const frontendDataFilter = this.frontendData.filter((item) => {
            return item[prop] !== '--'
          })
          const filterDatas = this.frontendData.filter((item) => {
            return item[prop] === '--'
          })
          frontendDataFilter.sort((a, b) => {
            if (order === 'ascending') {
              return Number(a[prop]) - Number(b[prop])
            } else {
              return Number(b[prop]) - Number(a[prop])
            }
          })
          this.frontendData = [...frontendDataFilter, ...filterDatas]
        } else if (this.isZSCPSort) {
          // 专属产品排序
          const notEmptyArr = this.frontendData.filter((item) => { return this.util.notEmpty(item[prop]) && item[prop] !== '--' })
          const emptyArr = this.frontendData.filter((item) => { return this.util.isEmpty(item[prop]) || item[prop] === '--' })
          try {
            const specialParseFloat = (x) => {
              if (x.indexOf('万元') !== -1) {
                x = x.replace(/万元/, '0000')
              } else if (x.indexOf('亿元') !== -1) {
                x = x.replace(/亿元/, '00000000')
              } else if (x === '无限制') {
                x = Infinity
              }
              return x
            }

            notEmptyArr.sort((a, b) => {
              let x = a[prop]
              let y = b[prop]
              if (prop === 'oneDayMaxBalaFmt') {
                x = specialParseFloat(x)
                y = specialParseFloat(y)
                if (order === 'ascending') {
                  return x - y
                } else if (order === 'descending') {
                  return y - x
                }
              } else {
                if (x === y) return 0
                if (order === 'ascending') {
                  return x > y ? 1 : -1
                } else if (order === 'descending') {
                  return x < y ? 1 : -1
                } else {
                  return 0
                }
              }
            })
          } catch (error) {
            console.log(error)
          }

          this.frontendData = [...notEmptyArr, ...emptyArr]
        } else {
          this.frontendData.sort((a, b) => {
            if (order === 'ascending') {
              return Number(a[prop]) - Number(b[prop])
            } else {
              return Number(b[prop]) - Number(a[prop])
            }
          })
        }

        this.pagination.currentPage = 1
        this.$emit('feFilter', this.getOldFEPagingData())
      }
      this.$emit('sortChange', { column, prop, order })
    },
    clearSort () {
      this.$refs.jgtTable.clearSort()
    }
  }
}
</script>

<style lang="scss" scoped>
.statusClass {
  @include color(A18);
}
.expand-table-box {
  @include backgroundColor(A1);
  padding: 8px;
}
</style>
<style lang="scss">
.plTableBox .el-table {
  .el-icon-arrow-right {
    display: none !important;
  }
  .details-row-class-name {
    .is-left {
      text-align: left !important;
    }
  }
  .module-attribution-customer {
    div.cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .header-cell-selection,
  th {
    .cell {
      line-height: 40px;
    }
  }
  th.getter {
    display: none;
  }
  td.el-table__expand-column{
    display: none;
  }
  th.is-leaf {
    &.column-last-th-box {
      // border: none !important;
    }
    &.el-table__expand-column {
      border: none !important;
    }
  }
  .sort-caret.ascending {
    @include borderBottomColor(A42);
  }
  .ascending .sort-caret.ascending {
    @include borderBottomColor(A3);
  }

  .sort-caret.descending {
    @include borderTopColor(A42);
  }

  .descending .sort-caret.descending {
    @include borderTopColor(A3);
  }

  // 表格内筛选颜色
  .el-table__column-filter-trigger i {
    @include color(A15);
  }

  .el-table__column-filter-trigger ~ span{
    color: red !important;
  }

  th > .cell.highlight {
    @include color(A15);
  }
  .jgt-table-empty {
    .el-empty__image {
      img {
        margin-top: 40px;
        width: 250px;
      }
    }
    .el-empty__description {
      margin-top: -70px;
    }
    .el-empty__bottom {
      margin-top: -10px;
    }
    .el-empty__description,
    .el-empty__bottom {
      height: 40px;
      line-height: 40px;
      p {
        @include color(A8);
        font-size: 14px;
      }
    }
  }
  .headerClass {
    .el-checkbox {
      width: 14px;
      height: 14px;
      .el-checkbox__input {
        display: none;
      }
      &::before {
        cursor: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwLjEgKDg4MTMzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uL+WFs+mXreWkh+S7vTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIiBpZD0ibGluZWFyR3JhZGllbnQtMSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNERUNFQTgiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0JEQTM3MyIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJpY29uL+WFs+mXreWkh+S7vSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjI4IiBmaWxsPSIjRDhEOEQ4IiBvcGFjaXR5PSIwIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjwvcmVjdD4KICAgICAgICA8L2c+CiAgICAgICAgPGcgaWQ9ImRpc2FibGUiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMSkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik04LDAgQzEyLjQxODI3OCwwIDE2LDMuNTgxNzIyIDE2LDggQzE2LDEyLjQxODI3OCAxMi40MTgyNzgsMTYgOCwxNiBDMy41ODE3MjIsMTYgMCwxMi40MTgyNzggMCw4IEMwLDMuNTgxNzIyIDMuNTgxNzIyLDAgOCwwIFogTTMuMTMwNzMxNjYsNC40OTQ4NDk0OCBMMy4wODQyNTc1OCw0LjU1ODgzMzAyIEMyLjQwMTAwMTE2LDUuNTMzMDY1OTEgMiw2LjcxOTcwMzUzIDIsOCBDMiwxMS4zMTM3MDg1IDQuNjg2MjkxNSwxNCA4LDE0IEM5LjMwODgxNjgyLDE0IDEwLjUxOTc1NTYsMTMuNTgwOTM0MiAxMS41MDU5NTY2LDEyLjg2OTY2MjEgQzExLjQyOTE5NDIsMTIuODI1OTY5OSAxMS4zNTc3MDI0LDEyLjc3MTkxNiAxMS4yOTI4OTMyLDEyLjcwNzEwNjggTDMuMjkyODkzMjIsNC43MDcxMDY3OCBDMy4yMjgwODM5OSw0LjY0MjI5NzU1IDMuMTc0MDMwMTQsNC41NzA4MDU3OCAzLjEzMDczMTY2LDQuNDk0ODQ5NDggWiBNOCwyIEM2LjY5MTE4MzE4LDIgNS40ODAyNDQ0NCwyLjQxOTA2NTg1IDQuNDk0MDQzNDMsMy4xMzAzMzc4NyBDNC41NzA4MDU3OCwzLjE3NDAzMDE0IDQuNjQyMjk3NTUsMy4yMjgwODM5OSA0LjcwNzEwNjc4LDMuMjkyODkzMjIgTDEyLjcwNzEwNjgsMTEuMjkyODkzMiBDMTIuNzcxOTE2LDExLjM1NzcwMjQgMTIuODI1OTY5OSwxMS40MjkxOTQyIDEyLjg2OTI2ODMsMTEuNTA1MTUwNSBDMTMuNTgwOTM0MiwxMC41MTk3NTU2IDE0LDkuMzA4ODE2ODIgMTQsOCBDMTQsNC42ODYyOTE1IDExLjMxMzcwODUsMiA4LDIgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+),
        auto !important;
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        left: 0;
        top: 0px;
        z-index: 999;
        border: 1px solid transparent;
        @include backgroundColor(A17);
        @include borderColor(A2);
        cursor: not-allowed;
        border-radius: 2px;
        box-sizing: border-box;
      }
    }
  }
}

div.el-table.singleLineTable tr td {
  height: 40px;
}

// 过滤列
div.el-table-filter {
  .el-table-filter__list-item {
    @include color(A6);
    &:hover {
      @include color(A10);
      @include backgroundColor(A2h);
    }

    &.is-active {
      // 已选中
      @include color(A10);
      @include backgroundColor(A2h);
    }
  }
}

// 过滤列
.filter-th{
  span {
    cursor: pointer;
  }
}

.smallTable{
  margin-top:12px;
  div.el-pagination.footer{
    padding:8px;
  }
}
.el-table__body {
  width: 100%;
}
</style>
