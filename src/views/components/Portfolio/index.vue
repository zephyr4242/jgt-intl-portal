<!-- 所有投组选择框，业务组件，含接口 -->
<template>
  <div class="portfolio-cascader">
    <!-- 不要用 emitPath，否则想补一级节点的时候会很复杂 -->
    <PortofolioCascaderBase v-model="value" :options="options" :props="defaultProps" @change="handleChange"
      :disableSuffix="hideDialogButton || noData" @suffixClick="openDialog" :show-all-levels="false" :defaultWidth="defaultWidth"
      @loadMore="loadMore" @remoteFilter="remoteFilter" filterable :loading="loading" ref="base"
      :placeholder="placeholder" :tips="tips" :size="size" :disabled="noData">
    </PortofolioCascaderBase>
    <PortofolioDialog ref="portofolioDialog" :showTab="showTab" :apiType="apiType" :args="args" @change="dialogChange"/>
  </div>
</template>
<script>
import PortofolioCascaderBase from './PortofolioCascader/Base'
import { pageOrgOperatorCustomerWithEstablish, pageOrgCustomerWithEstablish } from '@/api/intl/legacy/bus-jgt-account'
import { mapState } from 'vuex'
import PortofolioDialog from './PortofolioDialog'
import reprocessingDataMixin from './reprocessingDataMixin'
// 全部账户使用-1作为id标记
const FAKE_ACCOUNT_NO = '-1'
// 多个账户使用-2作为id标记
const FAKE_MULTI_ACCOUNT_NO = '-2'
// 当前账户无权限
const FAKE_NO_PERMISSION_NO = '-3'
// 暂无数据
const FAKE_NO_DATA = '-4'

export default {
  name: 'PortfolioCascader',
  components: {
    PortofolioCascaderBase,
    PortofolioDialog
  },
  mixins: [reprocessingDataMixin],
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    isMultiple() {
      // 判断选择的是全部账户还是当前账户
      if (this.alwaysSingle) {
        return false
      }
      return this.alwaysMultiple || this.util.getLocal('isMultiple') === 'true'
    },
    noData() {
      return this.value[0] === FAKE_NO_DATA
    },
    placeholder() {
      return this.util.isEmpty(this.tips?.text) ? '请选择基煜账户' : this.tips.text
    }
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
    // 是否隐藏打开弹窗按钮, 不传时显示该按钮
    hideDialogButton: {
      type: Boolean,
      default: false
    },
    // 是否总是多账户
    // 默认为false。
    // 传入true的例子：复核列表中因为总是复核其他账户的，所以应该总是全部账户，并显示【全部基煜账户】
    alwaysMultiple: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否总是单账户
    // 默认为false。
    // 传入true的例子：单笔交易，需要隐藏【全部基煜账户】
    alwaysSingle: {
      type: Boolean,
      default: false,
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
      default: () => { }
    },

    // 如果传入了该值，初始化后value会使用这个树重新计算，你也可以通过调用 setDefaultTree 触发
    defaultTree: {
      type: Array,
      required: false,
      default: null
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

    // 无需获取账户
    doNotGetCurrent: {
      type: Boolean,
      default: false,
      required: false
    },
    // 弹窗是否需要显示切换全部/常用tab
    showTab: {
      type: Boolean,
      default: true,
      required: false
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
    if (!this.doNotGetCurrent) {
      this.getCurrentInfo()
    }
    await this.query()
    this.emitFullAccount()
    if (this.defaultTree !== null) {
      this.setDefaultTree(this.defaultTree)
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
      allAccount: {
        accountNo: FAKE_ACCOUNT_NO,
        fofundName: '全部基煜账户',
        fofundNo: FAKE_ACCOUNT_NO,
        investPortfolioName: '全部基煜账户',
        value: FAKE_ACCOUNT_NO,
        level: 1
      }, // 伪造全部基煜账户选项

      // 弹框内选择多项时，显示的tips
      tips: {
        length: 0,
        text: ''
      }
    }
  },
  methods: {
    // 级联完成勾选后
    handleChange() {
      let item = null
      // 通知弹窗已勾选数组变更，只传accountNo
      if (this.value[0] === FAKE_ACCOUNT_NO) {
        this.$refs.portofolioDialog.setCheckedData([])
        item = { label: '全部基煜账户' }
      } else if (this.value.length === 2) { // 没有使用 emitPath 所以两级会有两个节点
        this.$refs.portofolioDialog.setCheckedData([this.value[1]])
        this.options.forEach(i => {
          if (i?.accountList?.length > 0) {
            i.accountList.forEach(j => {
              if (j.accountNo === this.value[1]) {
                item = this.util.deepClone(j)
              }
            })
          }
        })
      } else {
        this.$refs.portofolioDialog.setCheckedData([this.value[0]])
        item = this.options.find(i => i.accountNo === this.value[0])
      }

      // 如果找到了对应项修改text
      const text = item ? item.label : '请选择基煜账户'

      // 通知已勾选树
      let tree = this.$refs.base.getCheckedNodes()[0]
      if (tree.value === FAKE_ACCOUNT_NO) {
        // 全部账户
        this.$refs.portofolioDialog.setCheckedTree([])
      } else {
        this.$refs.portofolioDialog.setCheckedTree([tree.data])
      }

      this.notify()

      // 级联下拉框选择后，更新text
      this.tips = {
        legnth: 1,
        text
      }
    },
    // 打开弹窗按钮点击事件
    openDialog() {
      this.$refs.base.toggleDropDownVisible(false)
      this.$refs.portofolioDialog.open()
    },
    // 当前账户
    getCurrentInfo() {
      if (this.util.isEmpty(this.info.userLoginCustomer)) {
        return
      }

      if (this.isMultiple) {
        this.value = [FAKE_ACCOUNT_NO]
        this.currentAccount = []
        this.$emit('accountChange', [], [], [], true)
      } else if (!this.checkTradeMenuList()) {
        // 当前账户无对应权限时
        this.value = [FAKE_NO_PERMISSION_NO]
        this.currentAccount = []
        this.$emit('accountChange', [FAKE_NO_PERMISSION_NO], [FAKE_NO_PERMISSION_NO], [{}], true)
      } else {
        let data = this.util.deepClone(this.info.userLoginCustomer)
        const accountNo = this.info.userLoginCustomer.accountNo
        if (this.info.userLoginCustomer?.accountCount === 1) { // 只有一个投组时 value使用accountNo
          this.value = [accountNo]
        } else {
          this.value = [this.info.userLoginCustomer.fofundNo, accountNo]
          data.accountList = data.accountList.filter(i => i.accountNo === accountNo).slice()
        }

        this.currentAccount = this.reprocessingData([data])
        const label = this.info.userLoginCustomer?.accountCount === 1 ? (data.fofundShortName || data.fofundName) : data.investPortfolioName

        let tree = [{
          level: 2,
          accountNo: accountNo,
          fofundName: data.fofundShortName || data.fofundName,
          fofundNo: data.fofundNo,
          investPortfolioName: data.investPortfolioName,
          tradeAcco: data.tradeAcco,
          operatorCode: data.operatorCode,
          orgCode: data.orgCode,
          customerType: data.customerType,
          custNo: data.custNo,
          label: label,
          value: accountNo
        }]

        this.$emit('accountChange', [data.accountNo], [data.tradeAcco], tree, true)

        this.setDefaultTree(tree)
      }
    },
    // 校验是否有对应的交易权限
    checkTradeMenuList() {
      const tradeMenuList = this.info.userLoginCustomer.tradeMenuList
      const account = this.info.userLoginCustomer?.accountList.find(i => i.accountNo === this.info.userLoginCustomer.accountNo)
      // 0正常、1新开户、2帐号登记、5正在销户、6销户、A挂失、D冻结、F开户失败 、G冻结且挂失
      // 仅 0 1 2 可以交易
      const accountValid = ['0', '1', '2'].includes(account.thirdAccoState)

      if (this.util.isEmpty(this.args?.queryType)) {
        // 没有传queryType时 视为有权限
        return true
      } else if (this.args.queryType === '2') {
        // 需要有高经或者经办
        return accountValid && tradeMenuList.findIndex(i => i.resourceId === this.constant.roleId.EXPERT_HANDLE || i.resourceId === this.constant.roleId.HANDLE) >= 0
      } else if (this.args.queryType === '3') {
        // 需要有复核
        return accountValid && tradeMenuList.findIndex(i => i.resourceId === this.constant.roleId.AUDIT) >= 0
      } else {
        return true
      }
    },
    // 查询下拉项
    async query() {
      try {
        if (this.loading) return
        this.loading = true
        const api = this.apiType === '2' ? pageOrgOperatorCustomerWithEstablish : pageOrgCustomerWithEstablish
        const params = {
          ...this.args,
          queryCommon: '0',
          pageSize: this.pageSize,
          fofundName: this.keyword,
          pageNum: this.pageNum
        }

        const data = await api(params)
        let temp = data.records

        // 无搜索且没有值的情况下
        if (this.util.isEmpty(this.keyword) && data.total === 0) {
          this.options = []
          this.value = [FAKE_NO_DATA]
          return
        }

        // 选择当前账户时，如果没有搜索词，把当前账户置顶
        if (!this.isMultiple && this.util.isEmpty(this.keyword)) {
          const index = temp.findIndex(i => i.fofundNo === this.info.userLoginCustomer.fofundNo)
          const oldIndex = this.options.findIndex(i => i.fofundNo === this.info.userLoginCustomer.fofundNo)
          if (index >= 0) {
            // 下一页数据中有该账户，就用新数据置顶替换
            let bak = temp[index]
            temp.splice(index, 1)
            this.options.splice(oldIndex, 1)
            this.options = [bak].concat(this.options).concat(temp)
          } else if (oldIndex >= 0) {
            // 下一页无此账户，但上一页已有，维持不变
            this.options = this.options.concat(temp)
          } else { // 两页没有，看情况是否补当前登录的数据
            // 如果传了queryType  this.args?.queryType 需要判断权限是否匹配在考虑是否补数据
            if (this.args?.queryType) {
              this.options = this.options.concat(temp)
            } else {
              this.options = this.currentAccount.concat(this.options).concat(temp)
            }
          }
        } else {
          this.options = this.options.concat(temp)
        }
        if (this.util.isEmpty(this.keyword) && this.options[0].accountNo !== FAKE_ACCOUNT_NO) {
          // 未搜索时，如果没有全部基煜账户，补一个全部基煜账户置顶
          this.options = [this.allAccount].concat(this.options)
        }

        this.options = this.reprocessingData(this.options)

        // 总是单账户时，隐藏【全部基煜账户】下拉项
        if (this.alwaysSingle) {
          this.options = this.options.filter(i => i.value !== FAKE_ACCOUNT_NO)
        }
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

    // 弹窗确定事件
    dialogChange(arr, tree) {
      if (arr.length === 0) {
        this.value = [FAKE_ACCOUNT_NO]
        this.tips = {
          length: 1,
          text: '全部基煜账户'
        }
      } else if (arr.length === 1) {
        this.value = arr
        this.tips = {
          length: 1,
          text: tree[0].label
        }
      } else {
        this.value = [FAKE_MULTI_ACCOUNT_NO]
        this.tips = {
          length: tree.length,
          text: tree[0].label
        }
      }

      this.notify()
    },

    notify() {
      const tradeAccoList = []
      this.$refs.portofolioDialog.checkedTree.forEach(item => {
        if (item.accountList?.length > 0) {
          item.accountList.forEach(i => {
            tradeAccoList.push(i.tradeAcco)
          })
        } else {
          tradeAccoList.push(item.tradeAcco)
        }
      })

      this.$emit('accountChange', this.$refs.portofolioDialog.checkedData, tradeAccoList, this.$refs.portofolioDialog.checkedTree)
    },

    // 设置默认勾选树
    setDefaultTree(tree) {
      if (tree) {
        this.$refs.portofolioDialog.setCheckedTree(tree.slice())
        let data = []
        tree.forEach(item => {
          if (item?.accountList?.length > 0) {
            item.accountList.forEach(i => {
              data.push(i.accountNo)
            })
          } else {
            data.push(item.accountNo)
          }
        })
        this.$refs.portofolioDialog.setCheckedData(data)
        const len = data.length
        if (len === 0) {
          this.value = [FAKE_ACCOUNT_NO]
          this.tips = {
            length: 1,
            text: '全部基煜账户'
          }
        } else if (len === 1) {
          this.value = data[0]
          this.tips = {
            length: 1,
            text: tree[0].label
          }
        } else {
          this.value = [FAKE_MULTI_ACCOUNT_NO]
          this.tips = {
            length: data.length,
            text: tree[0].label
          }
        }
      }
    },

    // 设置默认勾选， 这个必须是全量的数据才可以用，确保 pageSize = 3000
    // 目前仅交易记录、我的持仓、交易视图、持仓视图使用
    setDefaultAccounts(keys = []) {
      // 根据传入的keys和this.options 构造已选的树
      let tree = []
      let len = keys.length
      for (let item of this.options) {
        if (len === 0) { // 塞完了 提前截止
          break
        }

        if (item?.accountList?.length > 0) { // 多投组
          item.accountList.forEach(i => {
            if (keys.includes(i.accountNo)) {
              tree.push(i)
              len--
            }
          })
        } else { // 单投组
          if (keys.includes(item.accountNo)) {
            tree.push(item)
            len--
          }
        }
      }

      this.setDefaultTree(tree)
      // 销户的账户登录后，无法匹配，告知外层下拉框选不到
      if (this.options.length > 0 && tree.length === 0) {
        return true
      }
    },

    // 发射全量开户账号和交易账号
    emitFullAccount() {
      let accountList = []
      let tradeAccoList = []
      this.options.forEach(item => {
        if (item.accountNo !== FAKE_ACCOUNT_NO) { // 过滤全部基煜账户
          if (item?.accountList?.length > 0) {
            // 多投组
            item.accountList.forEach(i => {
              accountList.push(i.accountNo)
              tradeAccoList.push(i.tradeAcco)
            })
          } else {
            // 单投组
            accountList.push(item.accountNo)
            tradeAccoList.push(item.tradeAcco)
          }
        }
      })
      this.$emit('fullAccount', accountList, tradeAccoList)
    }
  }
}
</script>

<style lang="scss" scoped></style>
