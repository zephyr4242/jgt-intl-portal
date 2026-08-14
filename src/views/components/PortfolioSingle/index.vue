<!-- 单选交易账号，用于登录&账号切换 -->
<template>
  <el-dialog v-if="step > 0" class="portfolio-single" :close-on-press-escape="false"
    :class="{ 'portfolio-single-noShowOrgList': step === 2, 'portfolio-single-client-login': util.isElectron() }"
    :title="title" width="600px" :before-close="close" visible>
    <!-- 选择机构 -->
    <div v-if="step === 1">
      <div class="orgItem" v-for="item in orgList" :key="item.orgCode" @click="getAccountList(item.orgCode)">
        <div class="orgName" :title="item.orgName">{{ item.orgName }}</div>
        <div class="btn-next">立即前往</div>
      </div>
    </div>
    <!-- 选择交易账户 -->
    <div v-if="step === 2">
      <!-- tab 搜索区域 -->
      <div class="title-msg">
        <PortfolioTab :isCommon="isCommon" @switchTab="switchTab" :showHintIcon="true" />
        <el-input placeholder="请搜索基煜账户名称" clearable v-model="keyword" @input="keywordChange">
          <em slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <!-- 列表区域 -->
      <ul v-if="activeList.length" v-infinite-scroll="loadMore" infinite-scroll-distance="10"
        infinite-scroll-immediate="false" class="infinite-list">
        <li v-for="item in activeList" :key="item.fofundNo" class="list-item">
          <div v-if="item.accountResourceList.length === 1" class="orgItem"
            @click.stop="setAccountNo(item.accountResourceList[0].accountNo)"
            :class="{ actived: selectAccountNo === item.accountResourceList[0].accountNo }">
            <!-- 只有一个投组，无需显示 -->
            <span class="fofundName" :title="item.fofundShortName || item.fofundName">
              <em @click.stop="changeStatus(item)" class="jgt-ml-20"
                :class="item.commonlyUsedFlag === '1' ? 'iconfont-shanchu1' : 'iconfont-tianjiachangyongzhanghu'" />
              {{ item.fofundShortName || item.fofundName }}
            </span>

            <span class="roleName">{{ item.resourceMergeName }}</span>

          </div>
          <div v-else class="jgt-mb-8">
            <!-- 多个投组，分级显示 -->
            <div class="orgItem jgt-mb-0">
              <span class="fofundName" :title="item.fofundShortName || item.fofundName">
                <em @click.stop="item.expand = !item.expand"
                  :class="item.expand ? 'iconfont-sanjiaoxiala' : 'iconfont-sanjiaoxiangyou'" />
                <em @click.stop="changeStatus(item)"
                  :class="item.commonlyUsedFlag === '1' ? 'iconfont-shanchu1' : 'iconfont-tianjiachangyongzhanghu'"
                  class="jgt-fs-16"/>
                {{ item.fofundShortName || item.fofundName }}
              </span>
              <span class="roleName">{{ item.resourceMergeName }}</span>
            </div>
            <div v-if="item.expand">
              <div v-for="subItem in item.accountResourceList" :key="subItem.accountNo"
                @click.stop="setAccountNo(subItem.accountNo)" class="orgItem jgt-mb-0"
                :title="subItem.investPortfolioName"
                :class="{ actived: selectAccountNo === subItem.accountNo }">
                <span class="investPortfolioName"> {{ subItem.investPortfolioName }}</span>
                <span class="roleName">{{ subItem.resourceMergeName }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="nodata" v-else>
        暂无数据
      </div>
    </div>

    <!-- loading -->
    <div class="loading-box" v-if="loading" v-loading="loading"></div>

    <span slot="footer" class="dialog-footer">
      <div v-if="step === 2">
        <el-tooltip effect="dark" :disabled="util.notEmpty(selectAccountNo)" content="请先选择账户" placement="top"
          :open-delay="300">
          <span class="jgt-mr-32">
            <el-button type="primary" @click="confirm" size="medium" :disabled="util.isEmpty(selectAccountNo)">
              确 定
            </el-button>
          </span>
        </el-tooltip>
        <el-button v-if="isMultiOrg" @click="backToSelectOrg" size="medium" type="primary" plain>
          返回机构列表
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { userLoginOrgList, toggleLoginCustomerEstablishList, toggleLoginCommonCustomerList, setCommonlyUsed, toggleLoginEstablish, userLoginOrg, toggleLoginType } from '@/api/intl/legacy/fofund-fap'
import { mapState, mapActions } from 'vuex'
import { sum, debounce } from 'lodash'
import session from '@/libs/util.session'
import loginSensorsMix from '@/views/system/elogin/loginSensorsMix'
import { authInit } from '@/libs/auth'
import PortfolioTab from './PortfolioTab'

export default {
  name: 'PortfolioSingle',
  mixins: [loginSensorsMix],
  components: {
    PortfolioTab
  },
  computed: {
    ...mapState('d2admin/user', ['info']),
    title() {
      if (this.step === 1) {
        return '请选择机构'
      } else if (this.step === 2) {
        return '请选择账户'
      }
      return ''
    },
    // 是否为多个机构
    isMultiOrg() {
      return this.orgList.length > 1
    },
    loadMoreDisabled() {
      // 加载更多的功能禁用条件
      // 1. 常用账户tab
      // 2. 全部账户loading中
      // 3. 全部账户分页已经到了最后一页
      return this.isCommon || this.accountloading || this.pages <= this.pageNum
    },
    activeList() {
      if (this.util.notEmpty(this.keyword)) {
        return this.accountList
      }
      return this.isCommon ? this.commonAccountList : this.accountList
    },
    loading() {
      // || this.changeStatusLoading 这个太快了
      return this.accountloading || this.orgLoading || this.commmonLoading || this.loginLoading
    }
  },
  watch: {
    step(val) {
      this.dialogVisible = val > 0
    }
  },
  props: {
    // 登录页的选择账号
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accountloading: false,
      orgLoading: false,
      commmonLoading: false,
      changeStatusLoading: false,
      loginLoading: false,

      step: 0, // 进度, 0-不显示弹窗  1-显示选择机构弹窗  2-显示选择交易账号弹窗
      isCommon: true, // tab 是否为常用账户tab

      // 机构相关
      orgList: [], // 机构列表
      selectedOrgCode: '', // 当前选择的机构

      // 账户相关
      accountList: [], // 完整账户+投组树
      commonAccountList: [], // 常用账户， 这是全量的
      selectAccountNo: '',

      // 全部账户 分页相关（常用账户不分页）
      pageNum: 1, // 当前页码
      pages: 1, // 总页数
      pageSize: 100,

      // 搜索
      keyword: '',
      // 搜索防抖 0.3s
      keywordSearch: debounce(this.resetPageAndQueryAccountList, 300)
    }
  },
  methods: {
    ...mapActions('d2admin/page', [
      'closeAll'
    ]),
    // 打开弹窗
    async open() {
      this.step = 0
      this.isCommon = true
      this.keyword = ''
      await this.$store.dispatch('d2admin/user/setIsSingleAccount', false, { root: true })
      const next = await this.getOrgList() // 获取机构列表
      if (next) {
        this.orgListLengthCheck(!this.Login) // 判断机构个数
      }
    },

    // 关闭弹窗
    close() {
      this.step = 0
      this.isCommon = true
      this.selectAccountNo = ''
      this.$emit('loginDone')
    },

    // 1 - 获取机构列表
    async getOrgList() {
      if (this.orgLoading) {
        return
      }

      try {
        this.orgLoading = true
        // 没有操作员代码时，直接return
        if (this.util.isEmpty(this.info.operatorCode)) {
          this.orgList = []
          return
        }

        const params = {
          operatorCode: this.info.operatorCode
        }
        const data = await userLoginOrgList(params)
        this.orgList = data?.operatorOrgList || []
        return true
      } catch (error) {
        this.$emit('loginDone') //  error
        return false
      } finally {
        this.orgLoading = false
      }
    },

    // 2.a - 判断机构个数，自动选择机构
    // toggleFirstOpen 切换账户首次打开时，进入当前选择的机构
    orgListLengthCheck(toggleFirstOpen) {
      const len = this.orgList.length
      if (len === 0) {
        // 0个机构 提示 操作员未绑定机构
        this.$alert('操作员未绑定机构', '提示', {
          confirmButtonText: '确定',
          center: true,
          callback: () => { }
        })
      } else if (len === 1) {
        // 只有1个机构，视为直接选择该机构
        this.getAccountList(this.orgList[0].orgCode)
      } else if (toggleFirstOpen && this.info.userLoginCustomer && this.orgList.find(i => i.orgCode === this.info.orgCode)) {
        // 切换账号首次打开弹窗时
        // 如果未绑定基煜账户,仍停在选择机构上
        // 如果当前机构在机构列表中，则直接选择该机构进入

        this.getAccountList2(this.info.orgCode)
      } else {
        // 有多个机构
        // 显示选择机构列表
        // 等待用户click之后进入getAccountList
        this.step = 1
      }
    },

    // 2.b - 手动选择机构
    async getAccountList(orgCode) {
      if (this.isMultiOrg) {
        // 用户点击的机构，需要埋点, 自动选择时无需埋点
        this.sensorsSelectOrganizationClick(orgCode)
      }
      this.selectedOrgCode = orgCode
      this.pageNum = 1
      this.isCommon = true // 默认显示常用账户
      this.accountList = []

      await this.queryCommonAccountList()
      // 如果有常用账户，默认展示常用账户tab
      this.isCommon = this.commonAccountList.length > 0
      await this.queryAccountList()
      this.accountListLengthCheck() // 判断投组个数
    },

    // 2.c - 切换按钮尝试选择机构
    async getAccountList2(orgCode) {
      this.selectedOrgCode = orgCode
      this.pageNum = 1
      this.isCommon = true // 默认显示常用账户
      this.accountList = []

      await this.queryAccountList()

      const len = sum(this.accountList.map(i => i.accountResourceList.length))
      if (len === 1) {
        // 切换账号时，如果是单账户，停在选择机构
        this.step = 1
      } else {
        await this.queryCommonAccountList()
        // 如果有常用账户，默认展示常用账户tab
        this.isCommon = this.commonAccountList.length > 0
        this.accountListLengthCheck() // 自动判断投组个数
      }
    },

    // 3.a - 查询全部账户
    async queryAccountList() {
      if (this.accountloading) {
        return
      }
      try {
        this.accountloading = true

        const params = {
          orgCode: this.selectedOrgCode,
          fofundName: this.keyword,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }

        const data = await toggleLoginCustomerEstablishList(params)
        this.pages = data.pages

        data.records.forEach(i => { i.expand = true })// 默认全展开
        this.accountList = this.accountList.concat(data?.records || [])
        // 搜索埋点
        if (this.keyword) {
          this.sensorsSearchAccount(data.total)
        }
      } catch (error) {
        this.$emit('loginDone') //  error
        throw error
      } finally {
        this.accountloading = false
      }
    },

    // 3.b - 查询常用账户
    async queryCommonAccountList() {
      if (this.commmonLoading) {
        return
      }
      try {
        this.commmonLoading = true
        const params = {
          orgCode: this.selectedOrgCode,
          // fofundName: this.keyword,  常用账户不搜索keyword
          pageNum: 1,
          pageSize: 1000 // 常用账户不会超过1000条
        }

        const data = await toggleLoginCommonCustomerList(params)
        data.records.forEach(i => { i.expand = true })// 默认全展开
        this.commonAccountList = data.records
        // 搜索埋点
        if (this.keyword) {
          this.sensorsSearchAccount(data.total)
        }
      } catch (error) {
        this.$emit('loginDone') //  error
        throw error
      } finally {
        this.commmonLoading = false
      }
    },

    // 4.a - 判断投组个数，自动选择投组
    async accountListLengthCheck() {
      const len = sum(this.accountList.map(i => i.accountResourceList.length))
      if (len === 0) {
        // 没有绑定过基煜账户，直接登录成功
        this.setAccountNo('')
        await this.login()

        // 没有投资组合
        if (this.orgList.length === 1) {
          // 只有一个机构时，全局隐藏切换账号按钮
          await this.$store.dispatch('d2admin/user/setIsSingleAccount', true, { root: true })
        }
      } else if (len === 1) {
        //  绑定了唯一的基煜账户，且只有一个投资组合，选择该投组
        this.setAccountNo(this.accountList[0].accountResourceList[0].accountNo)
        await this.login()

        if (this.orgList.length === 1) {
          // 只有一个机构时，全局隐藏切换账号按钮
          await this.$store.dispatch('d2admin/user/setIsSingleAccount', true, { root: true })
        }
      } else {
        // 有多个交易账号
        // 显示选择交易账号列表
        // 等待用户click之后进入 login
        this.step = 2

        if (this.isLogin) { // 登录场景
          if (this.commonAccountList.length > 0) {
            // 如果有常用账户，默认选中常用账户的第一条
            this.setAccountNo(this.commonAccountList[0].accountResourceList[0].accountNo)
          } else { // 选中全部账户的第一条
            this.setAccountNo(this.accountList[0].accountResourceList[0].accountNo)
          }
        } else { // 切换账户场景
          let loginAccountNo = this.info?.userLoginCustomer?.accountNo
          const loginOrgCode = this.info?.orgCode
          if (this.util.notEmpty(loginAccountNo) && this.util.notEmpty(loginOrgCode)) {
            if (loginOrgCode !== this.selectedOrgCode) {
              // 选择了非当前登录机构，直接设置第一条
              this.setAccountNo(this.accountList[0].accountResourceList[0].accountNo)
              return
            }
            let flag = false // 查找常用中是否包含当前已登录accountNo
            for (let item of this.commonAccountList) {
              if (item.accountResourceList.findIndex(i => i.accountNo === loginAccountNo) >= 0) {
                flag = true
                break
              }
            }
            this.setAccountNo(loginAccountNo)

            if (!flag) { // 常用tab中没有找到accountNo的时候 切到全部账户tab
              this.isCommon = false
            }
          }
        }
      }
    },

    // 4.b1 - 选择交易账户
    setAccountNo(accountNo) {
      this.selectAccountNo = accountNo
    },

    // 4.b2 确定按钮
    confirm() {
      // 选择账户弹窗埋点
      this.sensorsSelectAccountHandle('确定')
      // 没选择基煜账户
      if (this.util.isEmpty(this.selectAccountNo)) {
        this.$alert('请选择交易账户', '提示', {
          confirmButtonText: '确定',
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: () => { }
        })
        return false
      }
      this.login()
    },

    // 5 - 登录
    async login() {
      try {
        if (this.loginLoading) {
          return
        }
        this.loginLoading = true
        this.cleanCache()
        const isAccountLogin = this.util.notEmpty(this.selectAccountNo)
        if (isAccountLogin) { // 无交易账号时 不会确认投组
          const accountParams = {
            orgCode: this.selectedOrgCode,
            accountNo: this.selectAccountNo
          }
          await toggleLoginEstablish(accountParams) // 确认交易账号
        }

        const orgParams = {
          orgCode: this.selectedOrgCode,
          operatorCode: this.info.operatorCode
        }
        await userLoginOrg(orgParams) // 确认机构

        const loginTypeParams = {
          token: this.util.cookies.get('token'),
          loginType: isAccountLogin ? this.constant.LOGIN_TYPE.CUSTOMER : this.constant.LOGIN_TYPE.ORG
        }
        await toggleLoginType(loginTypeParams) // 确认登录类型

        this.step = 0
        this.sensorsFeLoginResult(isAccountLogin ? this.selectAccountNo : null)

        await this.$store.dispatch('d2admin/user/set', {}, { root: true })
        await authInit(this.util.cookies.get('token'), this.info)

        if (!this.isLogin) { // 切换账号场景
          await this.closeAll()
        }

        if (window.ipcRenderer && this.isLogin) {
          this.util.setClientWindowSize({
            isResizable: true,
            callback: this.goHomePage
          })
        } else {
          this.goHomePage()
        }
      } catch (error) {
        throw error
      } finally {
        this.loginLoading = false
        this.$emit('loginDone')// 全部处理完成
      }
    },

    // 切换activetab
    async switchTab(isCommon) {
      this.setAccountNo('')
      this.isCommon = isCommon
      if (this.util.notEmpty(this.keyword)) {
        // 有搜索词时，搜全部账户
        isCommon = false
      }
      if (isCommon) {
        // 切常用账户之前，先获取一下列表
        await this.queryCommonAccountList()
        if (this.commonAccountList.length === 0) {
          // 没有常用账户时，常用之后点击无效
          this.isCommon = false
        }
      } else {
        await this.resetPageAndQueryAccountList()
      }
    },

    // 更改是否常用状态
    async changeStatus(row) {
      if (this.changeStatusLoading) {
        return
      }
      try {
        this.changeStatusLoading = true
        const nextFlag = row.commonlyUsedFlag === '1' ? '0' : '1'
        const params = {
          operatorCode: this.info.operatorCode,
          orgCode: this.selectedOrgCode,
          fofundNo: row.fofundNo,
          dealFlag: nextFlag
        }
        // 设置常用账户接口
        await setCommonlyUsed(params)
        row.commonlyUsedFlag = nextFlag
        if (this.isCommon) {
          const index = this.commonAccountList.findIndex(i => i.fofundNo === row.fofundNo)
          this.commonAccountList.splice(index, 1)
          if (this.commonAccountList.length === 0) {
            // 删光后直接跳到全部账户
            this.switchTab(false)
          }
        }
      } catch (error) {
        this.$emit('loginDone') //  error
      } finally {
        this.changeStatusLoading = false
      }
    },

    // 全部账户加载更多
    loadMore() {
      if (!this.loadMoreDisabled) {
        this.pageNum++
        this.queryAccountList()
      }
    },
    // 重置分页后，查询全部账户
    resetPageAndQueryAccountList() {
      this.accountList = []
      this.pageNum = 1
      this.queryAccountList()
      this.queryCommonAccountList()
    },

    // 返回选择机构
    async backToSelectOrg() {
      this.step = 1
      this.keyword = ''
      await this.getOrgList() // 获取机构列表
      this.orgListLengthCheck() // 判断机构个数
      this.sensorsSelectAccountHandle('返回机构列表') // 选择账户弹窗埋点
    },

    // 清空私募和资管承诺函session
    cleanCache() {
      this.util.removeLocal('saveParams_trade_account')
      this.util.removeLocal('saveParams_assets')
      session.set('auditParamKeys', '')

      const promiseObj = session.getAll({ user: true })
      try {
        let keys = Object.keys(promiseObj)
        keys.forEach(key => {
          if (key.includes('_bmisQualifiedInvestorDialogFlag') || key.includes('_fundPrivateDialogFlagKey')) {
            session.set(key, false, { user: true })
          }
        })
      } catch (error) {
      }
    },

    goHomePage() {
      // 检查是否有登录失效前记录的访问地址
      const redirectPath = this.util.cookies.get('redirectPathAfterLogin')

      if (redirectPath) {
        // 使用后立即清除记录（一次性）
        this.util.cookies.remove('redirectPathAfterLogin')
        // 跳转到之前记录的地址
        this.$router.push({ path: redirectPath })
      } else {
        // 没有记录的地址，正常跳转首页
        // 以后不能直接写 /index 的路由
        if (this.$route.path === '/index') {
          this.$router.replace('/refresh')
        } else {
          this.$router.push({ path: '/index' })
        }
      }
    },

    keywordChange() {
      if (this.util.isEmpty(this.keyword)) {
        this.keyword = ''
      } else {
        this.keyword = this.keyword.trim()
      }
      this.keywordSearch()
    },

    // 切换账号按钮重新请求状态
    async checkSingleAccount() {
      const next = await this.getOrgList() // 获取机构列表
      if (next) {
        if (this.orgList.length > 1) {
          // 多机构
          await this.$store.dispatch('d2admin/user/setIsSingleAccount', false, { root: true })
        } else {
          this.selectedOrgCode = this.info.orgCode
          await this.queryAccountList()
          const len = sum(this.accountList.map(i => i.accountResourceList.length))
          await this.$store.dispatch('d2admin/user/setIsSingleAccount', len <= 1, { root: true })
        }
      }
      await authInit(this.util.cookies.get('token'), this.info)
    }
  }

}
</script>

<style lang="scss" scoped>
.orgItem {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  @include backgroundColor(A11);
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;

  .btn-next {
    cursor: pointer;
  }

  &:hover {
    @include backgroundColor(A2h);
    @include color(A10)
  }

  .orgName {
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
    width: 460px;
  }

  .fofundName {
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
    width: 390px;

    i,
    em {
      margin-right: 4px;
      @include color(A10)
    }
  }

  .roleName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 112px;
    text-align: right;
  }

  .investPortfolioName {
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
    padding-left: 42px;
    width: 390px;
  }
}

.actived {
  @include backgroundColor(A2h);
  @include color(A10)
}

.nodata {
  text-align: center;
  font-size: 14px;
  @include color(A8);
  height: 100px;
  line-height: 100px;
}

.infinite-list {
  overflow: auto;
  max-height: 300px;
}
</style>
<style lang="scss">
.portfolio-single {
  position: relative;

  .el-dialog {
    .el-dialog__body {
      padding: 10px 16px 16px !important;
      max-height: 310px !important;

      .title-msg {
        height: 40px;
        line-height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        position: absolute;
        top: 47px;
        left: 0;
        padding: 0 0 0 16px;
        box-sizing: border-box;
        @include backgroundColor(A2);

        .el-input {
          flex: 1;
          margin-left: 20px;
          height: 28px;
          line-height: 28px;

          .el-input__inner {
            height: 28px !important;
            line-height: 28px !important;
            font-size: 13px;
          }

          .el-input__icon {
            line-height: 28px;
          }
        }

      }

      .loading-box {
        .el-loading-mask {
          background-color: transparent;
        }
      }
    }

    .el-dialog__footer {
      padding-bottom: 30px !important;

      .tips {
        font-size: 12px;
        text-align: left;
        padding-top: 6px !important;
        padding-bottom: 16px !important;

        i {
          @include color(A10);
          margin: 0 2px;
        }
      }
    }
  }

  .loading-box {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}

.portfolio-single-noShowOrgList {
  .el-dialog__body {
    margin-top: 36px;
  }
}

.portfolio-single.portfolio-single-client-login .el-dialog .el-dialog__body {
  max-height: 300px !important;
}

em.hint-icon::before {
  font-size: 14px !important;
  line-height: 24px;
  @include color(A10);
}
</style>
