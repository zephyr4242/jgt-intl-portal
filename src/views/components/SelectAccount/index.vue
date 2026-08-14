<template>
  <el-dialog v-if="dialogVisible" class="select-account" :close-on-press-escape="false"  :class="{'select-account-noShowOrgList': !showOrgList, 'select-account-client-login':isClientLogin}" :title="title" :visible.sync="dialogVisible" width="600px" :before-close="(e) => closeDialog(e, false)">
    <!-- 机构列表 -->
    <div v-if="showOrgList">
      <div class="orgItem" v-for="item in orgList" :key="item.orgCode" @click="goNext(item)">
          <div class="orgName" :title="item.orgName">{{item.orgName}}</div>
          <div class="btn-next">立即前往</div>
      </div>
    </div>
     <!-- 基煜账户列表 -->
    <div v-else>
      <div class="title-msg">
        <h2>
          <span @click="toggleAccountFn('allAccount')" class="lable-title" :class="{'active-title': activeId === 'allAccount'}">全部账户</span>
          <span class="lable-title">|</span>
          <span @click="toggleAccountFn('oftenAccount')" class="lable-title" :class="{'active-title': activeId === 'oftenAccount'}">常用账户</span>
        </h2>
        <el-input
          placeholder="基煜账户名称"
          clearable
          v-model="searchText"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="customer-list" v-if="originList.length">
        <div class="orgItem" :class="{'activeed': item.active}" v-for="item in originList" :key="item.fofundNo" @click.stop="toggleCustomer(item)">
          <span class="fofundName" :title="item.fofundShortName || item.fofundName">
            <i @click.stop="setCommonlyUsedFn(item)" :class="setCommonlyUsedFlag(item)"></i>
            {{item.fofundShortName || item.fofundName}}
          </span>
          <span class="roleName">{{item.roleStr}}</span>
        </div>
      </div>
      <div class="nodata" v-else>
        暂无数据
      </div>
    </div>
    <!-- loading -->
    <div class="loading-box" v-if="loading" v-loading="loading"></div>
    <span slot="footer" class="dialog-footer">
      <div v-if="!showOrgList">
        <div class="tips">
          点击<i class="iconfont-tianjia"></i>添加到常用账户，
          点击<i class="iconfont-yichu"></i>从常用账户移除</div>
        <el-button
          type="primary"
          @click="confirm"
          size="medium"
        >
          确 定
        </el-button>
        <el-button v-if="!isNoBackOrgList" @click="backOrgListFn" size="medium" type="primary" plain>
          返回机构列表
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>
<script>
/* 接口 */
import { toggleLoginCustomerList, toggleLoginCustomer, setCommonlyUsed, toggleLoginType, userLoginOrg } from '@/api/intl/legacy/fofund-fap'
import { mapState, mapActions } from 'vuex'
import { authInit } from '@/libs/auth'
import session from '@/libs/util.session'
import loginSensorsMix from '@/views/system/elogin/loginSensorsMix'
export default {
  props: {
    isClientLogin: {
      type: Boolean,
      default: false
    },
    // 登录页的选择账号
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      orgList: [],
      // 是否显示机构列表
      showOrgList: true,
      // 全部基煜账户
      allAccountList: [],
      // 常用基煜账户
      commonlyUsedList: [],
      // 组件内orgCode
      orgCode: '',
      // 搜索条件
      searchText: '',
      // 选择账户
      fofundObj: null,
      // 常用账户与全部账户切换
      activeId: 'allAccount',
      // 是否线上返回机构列表
      isNoBackOrgList: false
    }
  },
  mixins: [loginSensorsMix],
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    title () {
      return this.showOrgList ? '选择机构' : '选择基煜账户'
    },
    // 基煜账户列表
    originList () {
      // 搜索埋点
      if (this.searchText) {
        this.sensorsSearchAccount(this.searchAcountList.length)
      }
      return this.searchText ? this.searchAcountList : this.accountList
    },
    // 全部基煜账户
    accountList () {
      /*
        commonlyUsedList: 常用账户
        allAccountList: 全部账户
      */
      return this.activeId === 'allAccount' ? this.allAccountList : this.commonlyUsedList
    },
    // 搜索基煜账户
    searchAcountList () {
      return this.allAccountList.filter(item => {
        const isFofundShortName = item.fofundShortName && item.fofundShortName.includes(this.searchText)
        const fofundName = item.fofundName && item.fofundName.includes(this.searchText)
        return isFofundShortName || fofundName
      })
    },
    defaultOftenAccount () {
      return this.commonlyUsedList.length > 1 || (this.commonlyUsedList.length && this.commonlyUsedList[0].fofundNo !== '授信池')
    }
  },
  async mounted () {
  },
  methods: {
    ...mapActions('d2admin/page', [
      'closeAll'
    ]),
    // 基煜账户列表 添加删除ICON控制
    setCommonlyUsedFlag (item) {
      let commonlyUsedFlag = ''
      if (item.fofundNo === '授信池') {
        commonlyUsedFlag = 'iconfont-shouquanjingbanren'
      } else {
        commonlyUsedFlag = item.commonlyUsedFlag === '1' ? 'iconfont-yichu' : 'iconfont-tianjia'
      }
      return commonlyUsedFlag
    },
    // 切换全部账户与基煜账户
    toggleAccountFn (val) {
      if (val === 'oftenAccount' && !this.commonlyUsedList.length) {
        return false
      }
      this.activeId = val
    },
    // 返回机构列表
    backOrgListFn () {
      this.fofundObj = null
      this.searchText = ''
      this.showOrgList = true
      // 选择账户弹窗埋点
      this.sensorsSelectAccountHandle('返回机构列表')
    },
    /**
     * 设置弹框是否可见
     */
    async setVisible (state, datas) {
      this.orgList = this.util.deepClone(datas)

      // 机构列表===1 判断基煜账户是否存在，存在直接线上基煜账户
      // 单机构
      if (this.orgList.length === 1) {
        this.util.cookies.set('orgCode', this.orgList[0].orgCode)
        // 获取机构id
        this.orgCode = this.orgList[0].orgCode
        // 调用基煜账户列表，无绑定基煜账户 直接跳转
        await this.getToggleLoginCustomerList()
        // 有绑定基煜账户列表
        if (this.allAccountList.length > 1) {
          this.dialogVisible = state
          // 隐藏机构列表
          this.showOrgList = false
          // 隐藏返回机构列表按钮
          this.isNoBackOrgList = true
          // 第一次进入 如果常用基煜账户>1  显示常用基煜账户列表
          if (this.defaultOftenAccount) {
            this.activeId = 'oftenAccount'
          } else {
            this.activeId = 'allAccount'
          }
        }
        return false
      }
      this.dialogVisible = state
      this.orgCode = this.info.orgCode
      // 如果存在orgCode
      if (this.orgCode) {
        // 获取基煜账户列表，传false是为了 弹窗显示时,没有基煜账户时不跳转
        await this.getToggleLoginCustomerList(false)
        // 基煜账户列表>1时，隐藏机构列表
        if (this.originList.length > 1) {
          // 情况选择默认选中
          this.originList.forEach(item => {
            item.active = false
          })
          // 情况默认选择账户
          this.fofundObj = null
          this.dialogVisible = state
          // 隐藏机构列表
          this.showOrgList = false
        }
        // 第一次进入 如果常用基煜账户>1  显示常用基煜账户列表
        if (this.defaultOftenAccount) {
          this.activeId = 'oftenAccount'
        } else {
          this.activeId = 'allAccount'
        }
      }
    },
    /**
     * 关闭弹框
     */
    closeDialog (e, type) {
      // 还原对应状态
      this.fofundObj = null
      this.searchText = ''
      this.isNoBackOrgList = false
      this.dialogVisible = false
      // 登录时关闭弹窗 再次登录时 显示机构列表
      if (this.isLogin && !type) {
        this.showOrgList = true
      }
      this.$emit('close')
      this.$emit('loginDone')
    },
    /**
     * 选择机构，立即前往
     */
    goNext (item) {
      this.orgCode = item.orgCode || ''
      this.orgName = item.orgName || ''
      // 选择机构进行埋点
      this.sensorsSelectOrganizationClick(item.orgCode)
      // 获取基煜账户列表 传true是为了 没有基煜账户时 直接调转
      this.getToggleLoginCustomerList(true)
    },
    // 切换机构登录
    userLoginOrgFn (loginType) {
      this.loading = true
      const params = {
        orgCode: this.orgCode,
        operatorCode: this.info.operatorCode
      }
      // 切换机构登录
      userLoginOrg(params).then((res) => {
        if (res) {
          // 更新登录类型
          this.toggleLoginTypeFn(loginType)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取基煜账户列表
    async getToggleLoginCustomerList (isGoUrl) {
      this.loading = true

      const params = {
        orgCode: this.orgCode,
        operatorCode: this.info.operatorCode
      }
      // 接口调用
      await toggleLoginCustomerList(params).then(async res => {
        if (res?.customerResourceList?.length) {
          const { LOGIN_TYPE } = this.constant
          // 如果基煜账户数量为1

          if (res.customerResourceList.length === 1 && (isGoUrl || this.isLogin)) {
            // 如果账户是授信次 为机构登录, 否则为账户登录 当选择账户弹窗只有授信池登录时，直接以机构登录，跳过选择账户弹窗
            this.fofundObj = res.customerResourceList[0]
            const loginType = res.customerResourceList[0].fofundNo === '授信池' ? LOGIN_TYPE.ORG : LOGIN_TYPE.CUSTOMER
            if (loginType === LOGIN_TYPE.CUSTOMER) {
              await this.setToggleLoginCustomer(loginType)
              return false
            }
            if (loginType === LOGIN_TYPE.ORG) { // 机构登录（无基煜账户登录）
              this.cleanSessionDialog()
            }
            this.userLoginOrgFn(loginType)
            return false
            // 当选择账户弹窗有授信池登录和一个账户时，直接以该账户登录，跳过选择账户弹窗
          } else if (res.customerResourceList.length === 2 && res.customerResourceList[0].fofundNo === '授信池' && (isGoUrl || this.isLogin)) {
            // 如果账户是授信次 为机构登录, 否则为账户登录
            this.fofundObj = res.customerResourceList[1]
            await this.setToggleLoginCustomer(LOGIN_TYPE.CUSTOMER)
            return false
          }

          // 基煜账户列表循环
          res.customerResourceList.forEach((item, index) => {
            let role = []
            // 权限列表信息 新增字段 拼接权限显示内容 例：高级经办+复核
            item.tradeMenuList.forEach(trade => {
              if (trade.menuName !== '查询') {
                role.push(trade.menuName)
              }
            })
            // 例：高级经办+复核
            let roleStr = role.join('+')
            if (this.util.isEmpty(roleStr)) {
              roleStr = '查询'
            }
            this.$set(item, 'roleStr', roleStr)
            this.$set(item, 'active', false)
          })
          // 全部基煜账户
          this.allAccountList = res.customerResourceList.filter(item => {
            return item.fofundNo !== '授信池'
          })
          // 常用基煜账户
          this.commonlyUsedList = res.customerResourceList.filter((item, index) => {
            return item.fofundNo !== '授信池' && item.commonlyUsedFlag === '1'
          })
          if (!this.commonlyUsedList.length) {
            this.activeId = 'allAccount'
          }
          if (isGoUrl) {
            // 基煜账户列表>1时，隐藏机构列表
            if (this.allAccountList.length > 1) {
              // 情况选择默认选中
              this.allAccountList.forEach(item => {
                item.active = false
              })
              // 情况默认选择账户
              this.fofundObj = null
              // 隐藏机构列表
              this.showOrgList = false
            }
            // 第一次进入 如果常用基煜账户>1  显示常用基煜账户列表
            if (this.defaultOftenAccount) {
              this.activeId = 'oftenAccount'
            } else {
              this.activeId = 'allAccount'
            }
          }
        } else {
          this.allAccountList = []
          this.commonlyUsedList = []
          this.showOrgList = true
          // 没有基煜账户 并且可跳转
          if (isGoUrl || this.isLogin) {
            this.userLoginOrgFn(this.constant.LOGIN_TYPE.ORG)
            this.cleanSessionDialog()
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 登录类型 1-管理员登录 2-授信管理员登录 3-基煜账户登录 4-老开户登录 5-游客登录, 6-机构登录（无基煜账户登录）7-体验账户登录
    toggleLoginTypeFn (loginType) {
      this.loading = true
      const params = {
        token: this.util.cookies.get('token'),
        loginType: loginType
      }
      // 登录类型切换
      toggleLoginType(params).then(async () => {
        this.util.removeLocal('saveParams_trade_account')
        this.util.removeLocal('saveParams_assets')
        session.set('auditParamKeys', '')

        // 首页 需要清空用户信息然后重新登录。  之后从切换账号做个通知监听。
        await this.$store.dispatch('d2admin/user/set', {}, { root: true })
        await authInit(this.util.cookies.get('token'), this.info)

        if (!this.isLogin) {
          await this.closeAll()
        }
        // 如果为机构或者基煜账户登录 机构登录跳转首页 否则跳转授信管理
        this.closeDialog(false, true)

        const gotoHome = () => {
          // 以后不能直接写 /index 的路由
          if (this.$route.path === '/index') {
            this.$router.replace('/refresh')
          } else {
            this.$router.push({ path: '/index' })
          }
        }
        // 当前账户为授信池
        const { LOGIN_TYPE } = this.constant
        this.sensorsFeLoginResult(loginType === LOGIN_TYPE.CUSTOMER ? this.fofundObj?.fofundNo : null)
        if (window.ipcRenderer && this.isLogin) {
          this.util.setClientWindowSize({
            isResizable: true,
            callback: gotoHome
          })
        } else {
          gotoHome()
        }
      }).finally(() => {
        this.loading = false
        this.$emit('loginDone')
      })
    },
    // 基煜账户选择时控制当前基煜账户选中状态改变背景色
    toggleCustomer (row) {
      this.originList.forEach(item => {
        item.active = false
      })
      row.active = true
      this.fofundObj = row
    },
    // 设置常用账户 方法
    setCommonlyUsedFn (row) {
      const params = {
        operatorCode: this.info.operatorCode,
        orgCode: this.orgCode,
        fofundNo: row.fofundNo,
        dealFlag: row.commonlyUsedFlag === '1' ? '0' : '1'
      }
      this.fofundObj = null
      // 设置常用账户接口
      setCommonlyUsed(params).then(res => {
        if (res) {
          this.getToggleLoginCustomerList()
        }
      })
    },
    confirm () {
      // 选择账户弹窗埋点
      this.sensorsSelectAccountHandle('确定')
      // 没选择基煜账户
      if (!this.fofundObj) {
        this.$alert('请选择基煜账户', '提示', {
          confirmButtonText: '确定',
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: () => {}
        })
        return false
      }
      // 当前账户为授信池
      const { LOGIN_TYPE } = this.constant
      if (this.fofundObj?.fofundNo === '授信池') {
        this.userLoginOrgFn(LOGIN_TYPE.CREDIT)
        return false
      }

      // 基煜账户切换
      this.setToggleLoginCustomer(LOGIN_TYPE.CUSTOMER)
    },
    // 基煜账户切换
    setToggleLoginCustomer (loginType) {
      this.loading = true
      // 入参
      const params = {
        token: this.util.cookies.get('token'),
        orgCode: this.orgCode,
        operatorCode: this.info.operatorCode,
        fofundNo: this.fofundObj?.fofundNo
      }
      // 基煜账户切换接口
      toggleLoginCustomer(params).then(res => {
        this.cleanSessionDialog()
        if (res) {
          // 机构切换方法
          this.userLoginOrgFn(loginType)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 清空私募和资管承诺函session
    cleanSessionDialog () {
      const promiseObj = session.getAll({ user: true })
      try {
        let keys = Object.keys(promiseObj)
        keys.forEach(key => {
          if (key.includes('_bmisQualifiedInvestorDialogFlag') || key.includes('_fundPrivateDialogFlagKey')) {
            session.set(key, false, { user: true })
          }
        })
      } catch (e) {
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.orgItem{
  display: flex;
  justify-content: space-between;
  padding: 10px;
  // background: #F9F9F9;
  @include backgroundColor(A11);
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;
  .btn-next{
      cursor: pointer;
  }
  &:hover{
    @include backgroundColor(A2h);
    @include color(A10)
  }
  .orgName{
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
    width: 460px;
  }
  .fofundName{
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
    width: 380px;
    i{
      margin-right: 10px;
      @include color(A10)
    }
  }
  .roleName{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
    text-align: right;
  }
}
.activeed{
  @include backgroundColor(A2h);
  @include color(A10)
}
.nodata{
  text-align: center;
  font-size: 14px;
  @include color(A8);
  height: 100px;
  line-height: 100px;
}
</style>
<style lang="scss">
.select-account{
  position: relative;
  .el-dialog{
    .el-dialog__body{
      padding: 10px 16px 16px !important;
      max-height: 310px !important;
      .title-msg{
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

        h2{
          flex: 2;
          font-size: 14px;
        }
        .lable-title{
          cursor: pointer;
          @include color(A8);
          margin: 0 4px;
          font-size: 16px;
        }
        .active-title{
          @include color(A6);
          font-weight: 600;
        }
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
      .loading-box{
        .el-loading-mask{
          background-color: transparent;
        }
      }
    }
    .el-dialog__footer{
      padding-bottom: 30px !important;
      .tips{
        font-size: 12px;
        text-align: left;
        padding-top: 6px !important;
        padding-bottom: 16px !important;
        i{
          @include color(A10);
          margin: 0 2px;
        }
      }
    }
  }
  .loading-box{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
.select-account-noShowOrgList{
  .el-dialog__body{
    margin-top: 36px;
  }
}

.select-account.select-account-client-login .el-dialog .el-dialog__body{
  max-height: 217px !important;
}
</style>
