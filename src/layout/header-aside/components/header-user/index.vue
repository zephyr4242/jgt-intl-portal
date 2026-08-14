<template>
  <div class="toggle-account-box">
    <!-- <span v-if="feignVersion" class="jgt-vm feignVersion"> 迭代={{ feignVersion }}</span> -->
    <el-dropdown size="small" class="d2-mr jgt-vm jgt-drag" :disabled="!isOpenAccountLogin">
      <span class="user-text">
        <pre class="show-user-name" v-html="userName" @dblclick="toggleIsMax"></pre>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logOff">
          <d2-icon name="power-off" class="d2-mr-5"/>
          {{ $t('headerLogout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span v-if="isShowToggleBtnFlag" @click="changePortfolio" class="toggle-account">{{ $t('headerSwitchAccount') }}</span>
    <UserSetting />
    <!-- 切换投组 -->
    <PortfolioSingle v-if="!isIntlPortal" ref="portfolioSingle" @loginDone="loginDone"/>
  </div>
</template>

<script>
import PortfolioSingle from '@/views/components/PortfolioSingle'
import UserSetting from './UserSetting'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    PortfolioSingle,
    UserSetting
  },
  computed: {
    ...mapState('d2admin/user', [
      'info',
      'isSingleAccount'
    ]),
    /** 机构名称：兼容国内投组字段与国际门户 companyName */
    displayOrgName () {
      return this.info?.userLoginCustomer?.fofundShortName ||
        this.info?.userLoginOrg?.orgName ||
        this.info?.companyName ||
        ''
    },
    user () {
      let userText = this.$t('headerNotLoggedIn')
      if ((this.info.mobile && this.info.userLoginOrg) || (this.info.mobile && this.info.userLoginCustomer)) {
        userText = `${this.info.operatorName} ${this.displayOrgName}`
      } else if (this.info.operatorName) {
        userText = this.displayOrgName
          ? `${this.info.operatorName} ${this.displayOrgName}`
          : `${this.info.operatorName}`
      } else if (this.info.mobile) {
        userText = this.info.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
      return userText
    },
    ISREGISTERTRIAL () {
      return this.REGISTERTRIAL.includes(this.info?.loginType)
    },
    whiteUserName () {
      let userText = this.$t('headerNotLoggedIn')
      let userName = ''
      const { LOGIN_TYPE } = this.constant
      // 基煜账户登录
      if (this.info?.loginType === LOGIN_TYPE.CUSTOMER) {
        if (this.info.userLoginCustomer?.accountList?.length > 1 && this.info.userLoginCustomer?.investPortfolioName) {
          // 多投组
          userName = this.info.userLoginCustomer?.investPortfolioName
          userText = `交易账户(${this.info?.userLoginCustomer?.tradeAcco}) : <span class="user-name-box" title="${userName}">${userName || ''}</span>`
        } else {
          userName = this.info?.userLoginCustomer?.fofundShortName || this.info?.userLoginOrg?.orgName || this.info?.companyName || (this.info?.mobile && this.info.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')) || ''
          userText = `交易账户(${this.info?.userLoginCustomer?.tradeAcco}) : <span class="user-name-box" title="${userName}">${userName || ''}</span>`
        }
      } else if (this.ISREGISTERTRIAL) { // 游客，体验账户登录
        userText = `您好！`
      } else { // 其他（含国际门户）
        userName = this.displayOrgName
        userText = `${this.$t('headerOrganizationName')}：<span class="user-name-box" title="${userName}">${userName || ''}</span>`
      }
      return userText
    },
    userName () {
      return this.isOpenAccountLogin ? this.user : this.whiteUserName
    },
    isMoreOperatorOrg () {
      return this.operatorOrgList.length > 1
    },
    isOpenAccountLogin() { // 开户入口登录
      return this.util.notEmpty(this.info?.noTokenLogin)
    },
    isIntlPortal() {
      return this.info?.userLoginOrg?.orgCode === 'INTL' || !!this.info?.companyName
    },
    isShowToggleBtnFlag() {
      if (this.isIntlPortal) {
        return false
      }
      if (this.ISREGISTERTRIAL) {
        return false
      } else if (this.util.notEmpty(this.info?.noTokenLogin)) {
        // 开户登录登录为false
        return false
      } else {
        return this.isSingleAccount === false
      }
    }
  },
  // 将当前this赋值给fundData
  provide () {
    return {
      headerUser: this
    }
  },
  data () {
    return {
      userTipsName: '',
      REGISTERTRIAL: [],
      operatorOrgList: [],
      isMoreCustomerlength: 0,
      feignVersion: null,
      switchLoading: false
    }
  },
  created () {
    const { LOGIN_TYPE } = this.constant
    this.REGISTERTRIAL = [
      LOGIN_TYPE.REGISTER,
      LOGIN_TYPE.TRIAL
    ]
    this.currentFeignVersion()
  },
  mounted() {
    if (!this.isIntlPortal) {
      this.$refs.portfolioSingle && this.$refs.portfolioSingle.checkSingleAccount()
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    changePortfolio() {
      if (this.switchLoading) {
        return
      }
      this.switchLoading = true
      this.$refs.portfolioSingle.open()
    },

    // 切换最大最小化
    toggleIsMax () {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('toggle-is-max')
      }
    },
    // 提示当前测试的迭代号
    currentFeignVersion () {
      // 开发和测试环境提示当前迭代号
      if (this.util.isEmpty(location.origin)) {
        this.feignVersion = null
      } else if (location.origin.includes('localhost')) {
        this.feignVersion = process.env.VUE_APP_BIZ_ID
      } else if (window.CONFIG?.SHOW_VERSION_DEBUG) {
        let feignVersion = localStorage.getItem('jgt-feign-version')
        this.feignVersion = this.util.isEmpty(feignVersion) ? null : feignVersion
      } else {
        this.feignVersion = null
      }
    },
    loginDone() {
      this.switchLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle-account-box{
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.user-text {

  font-size: 12px;
  display: flex;
  cursor: auto;
  .show-user-name{
    max-width: 900px;
    overflow: hidden;
    text-overflow: ellipsis; //超出部分以省略号显示
    white-space: nowrap;
  }
}

.feignVersion{
  font-size: 12px;
  margin-right: 10px;
  @include color(A3);
}
@media screen and ( max-width: 1800px ){
  .user-text {
    .show-user-name{
      max-width: 780px;
    }
  }
}
@media screen and ( max-width: 1600px ){
  .user-text {
    .show-user-name{
      max-width: 580px;
    }
  }
}
@media screen and ( max-width: 1440px ){
  .user-text {
    .show-user-name{
      max-width: 440px;
    }
  }
}
@media screen and ( max-width: 1300px ){
  .user-text {
    .show-user-name{
      max-width: 360px;
    }
  }
}
.toggle-account{
  @include color(A3);
  cursor: pointer;
  margin-left: 8px;
  font-size: 12px;
  &:hover {
    text-decoration: underline;
    @include borderColor(A3)
  }
}
</style>
