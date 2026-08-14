<!-- 所有投组选择框，业务组件，含接口 -->
<template>
  <div class="portfolio-cascader">
    <!-- 不要用 emitPath，否则想补一级节点的时候会很复杂 -->
    <PortofolioCascaderBase
      v-model="value"
      :options="options"
      :props="defaultProps"
      @change="handleChange"
      :disableSuffix="true"
      :show-all-levels="false"
      :defaultWidth="defaultWidth"
      @loadMore="loadMore"
      @remoteFilter="remoteFilter"
      filterable
      :loading="loading"
      ref="base"
      :placeholder="valueName || '请选择基煜账户'"
      :size="size"
      @visible-change="visibleChange"
      :tips="tips"
    >
    </PortofolioCascaderBase>
  </div>
</template>
<script>
import PortofolioCascaderBase from './PortofolioCascader/Base'
import {
  pageOrgOperatorCustomerWithEstablish,
  pageOrgCustomerWithEstablish
} from '@/api/intl/legacy/bus-jgt-account'
import { mapState } from 'vuex'
import reprocessingDataMixin from './reprocessingDataMixin'
import { uniqBy } from 'lodash'
// 当前账户无权限
const FAKE_NO_PERMISSION_NO = '-3'

export default {
  name: 'PortfolioInTable',
  components: {
    PortofolioCascaderBase
  },
  mixins: [reprocessingDataMixin],
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  props: {
    // 接口类型
    apiType: {
      type: String,
      default: '2', // 1机构管理，2我的账户 3 单个操作员  其中3仅提供给PortfolioMulti 支持
      required: false
    },
    // 宽度
    defaultWidth: {
      type: String,
      default: '220px',
      required: false
    },
    // apiType = 1 机构管理菜单下使用 http://yapi.jiyufund.com.cn/project/185/interface/api/32617
    // apiType = 2 我的账户菜单下使用 http://yapi.jiyufund.com.cn/project/185/interface/api/32620
    // apiType = 3 单个操作员的 http://yapi.jiyufund.com.cn/project/185/interface/api/33391
    // 接口入参中特殊标识部分,可不传
    // 例如 {queryCancel:'1', queryCommon:'0', queryType:'3'}
    // 1. queryCancel  0 - 未销户账户（我的持仓、问卷）， 1 - 全量 默认 = '1'
    //
    // 2. queryCommon  0 - 全部账户  1 - 常用账户 默认 = '0'
    //   【注意】级联应该都用0,子组件通过是否选中常用tab控制，所以此项会在前端代码修正。
    //
    // 3. queryType 复核列表传 '3' 其他不传, 代表只要有复核权限的（提供给复核列表使用）

    args: {
      type: Object,
      required: false,
      default: () => {}
    },
    isNoDefaultAcc: {
      type: Boolean,
      default: false
    },
    // 分页
    pageSize: {
      type: Number,
      required: false,
      default: 1000
    },

    // 尺寸
    size: {
      type: String,
      required: false,
      default: 'small'
    },

    // 如果传入了该值，会使用这个初始化
    defaultData: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  watch: {
    keyword() {
      this.pageNum = 1
      this.pages = 1000 // 避免删除搜索词时，无法下拉
      this.options = []
      this.query()
    },
    loading(val) {
      this.$emit('loadingChange', val)
    },
    apiType() {
      this.query()
    }
  },
  async mounted() {
    if (this.defaultData?.accountNo) {
      this.setDefaultData(this.defaultData)
    } else {
      if (!this.isNoDefaultAcc) {
        this.getCurrentInfo()
      }
    }
  },
  data() {
    return {
      loading: false,
      value: [],
      options: [],
      // 级联相关配置&字段映射
      defaultProps: {
        expandTrigger: 'hover', // hover打开下一级
        children: 'accountList' // 仅映射children，其他在 reprocessingData 方法中处理
      },

      keyword: '',
      // 分页相关
      pageNum: 1,
      pages: 0,

      currentAccount: [], // 当前账户，用于第一页没有该项数据的拼接处理

      // 弹框内选择多项时，显示的tips
      tips: {
        length: 0,
        text: ''
      },
      valueName: ''
    }
  },
  methods: {
    // 级联完成勾选后
    handleChange(arr) {
      let accountNo = arr[arr.length - 1]
      let ret = {}
      for (let item of this.options) {
        if (item.accountNo === accountNo) {
          ret = this.util.deepClone(item)
          break
        }
        let temp = item?.accountList?.find((i) => i.accountNo === accountNo)
        if (temp) {
          ret = this.util.deepClone(temp)
          break
        }
      }
      this.notify(ret, true)
    },
    // 当前账户
    getCurrentInfo() {
      if (this.util.isEmpty(this.info.userLoginCustomer)) {
        return
      }
      if (!this.checkTradeMenuList()) {
        // 当前账户无对应权限时
        this.value = [FAKE_NO_PERMISSION_NO]
        this.currentAccount = []
        this.options = []
        this.notify({}, false)
      } else {
        if (this.info.userLoginCustomer?.accountCount === 1) {
          // 只有一个投组时 value使用accountNo
          this.value = [this.info.userLoginCustomer.accountNo]
        } else {
          this.value = [
            this.info.userLoginCustomer.fofundNo,
            this.info.userLoginCustomer.accountNo
          ]
        }

        let data = this.util.deepClone(this.info.userLoginCustomer)

        this.currentAccount = this.reprocessingData([data])
        this.options = [data]
        this.notify(data, false)
      }
    },
    // 校验是否有对应的交易权限
    checkTradeMenuList() {
      const tradeMenuList = this.info.userLoginCustomer.tradeMenuList
      if (this.util.isEmpty(this.args?.queryType)) {
        // 没有传queryType时 视为有权限
        return true
      } else if (this.args.queryType === '2') {
        // 需要有高经或者经办
        return (
          tradeMenuList.findIndex(
            (i) =>
              i.resourceId === this.constant.roleId.EXPERT_HANDLE ||
              i.resourceId === this.constant.roleId.HANDLE
          ) >= 0
        )
      } else if (this.args.queryType === '3') {
        // 需要有复核
        return (
          tradeMenuList.findIndex(
            (i) => i.resourceId === this.constant.roleId.AUDIT
          ) >= 0
        )
      } else {
        return true
      }
    },
    visibleChange(visible) {
      visible && this.query()
    },
    // 查询下拉项
    async query() {
      try {
        if (this.loading) return
        this.loading = true
        const api =
          this.apiType === '2'
            ? pageOrgOperatorCustomerWithEstablish
            : pageOrgCustomerWithEstablish
        const params = {
          ...this.args,
          queryCommon: '0',
          pageSize: this.pageSize,
          fofundName: this.keyword,
          pageNum: this.pageNum
        }

        const data = await api(params)
        let temp = data.records
        // 选择当前账户时，如果没有搜索词，把当前账户置顶
        if (this.util.isEmpty(this.keyword)) {
          const index = temp.findIndex(
            (i) => i.fofundNo === this.info.userLoginCustomer.fofundNo
          )
          const oldIndex = this.options.findIndex(
            (i) => i.fofundNo === this.info.userLoginCustomer.fofundNo
          )
          if (index >= 0) {
            // 下一页数据中有该账户，就用新数据置顶替换
            let bak = temp[index]
            temp.splice(index, 1)
            this.options.splice(oldIndex, 1)
            this.options = [bak].concat(this.options).concat(temp)
          } else if (oldIndex >= 0) {
            // 下一页无此账户，但上一页已有，维持不变
            this.options = this.options.concat(temp)
          } else {
            // 两页没有，看情况是否补当前登录的数据
            // 该场景直接补
            this.options = [this.deepClone(this.info.userLoginCustomer)]
          }
        } else {
          this.options = this.options.concat(temp)
        }

        // 基煜账户维度去重
        this.options = uniqBy(this.options, 'fofundNo')

        this.options = this.reprocessingData(this.options)

        this.pages = data.pages
      } catch (error) {
      } finally {
        this.loading = false
        this.$forceUpdate()
      }
    },

    // 下一页
    loadMore() {
      if (!this.loading && this.pages > this.pageNum) {
        this.pageNum++
        this.query()
      }
    },

    // 远端搜索
    remoteFilter(v) {
      if (this.util.isEmpty(v)) {
        this.keyword = ''
      } else {
        this.keyword = v.trim()
      }
    },
    notify(data, type) {
      console.log('notify...', data)
      this.valueName = data?.label || data?.investPortfolioName || data?.fofundShortName || ''
      this.tips = {
        length: 1,
        text: this.valueName
      }
      this.$emit('change', data, type)
    },
    setDefaultData(data) {
      this.value = data.accountNo
      this.valueName = data.label
      this.tips = {
        length: 1,
        text: data.label
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
