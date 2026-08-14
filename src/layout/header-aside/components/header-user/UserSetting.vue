<!--
  用户设置
-->
<template>
  <div>
    <el-dropdown @command="handleCommand">
      <div class="user-setting-ball jgt-ml-12">{{ userNameFirst }}<span class="user-notice-dot" v-show="isShowDot"></span></div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="user-setting-item is-name" disabled>
          <div style="display: flex">
            <div class="user-setting-ball jgt-mr-12">{{ userNameFirst }}</div>
            <jy-tooltip :content="userName" placement="top-start">
              <div class="user-setting-name">{{ userName }}</div>
            </jy-tooltip>
          </div>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="toggleTheme">
          <i class="iconfont-huanfu"></i>
          <span style="position: relative">
          <span>{{ $t('userSwitchToTheme', { theme: themeName }) }}</span>
          <span class="user-notice-dot" v-show="isShowThemeNotice"></span>
        </span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="toggledFullscreen" v-if="!$isElectron">
          <i :class="active ? 'iconfont-tuichuquanping' : 'iconfont-quanping'"></i>
          <span>{{ $t(active ? 'userCloseFullscreen' : 'userOpenFullscreen') }}</span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="changePassword">
          <i class="iconfont-xiugaimima1"></i>
          <span>{{ $t('userChangePassword') }}</span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="checkUpdate" v-if="$isElectron && !$isMac">
          <i class="iconfont-jianchagengxin"></i>
          <span style="position: relative">
          <span>{{ $t('userCheckUpdate') }}</span>
          <span class="user-notice-dot" v-show="showUpdate"></span>
        </span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="deviceMgr" v-if="$isElectron && showDeviceMgrDialog">
          <i class="iconfont-icon_computer_defaul"></i>
          <span>{{ $t('userDeviceManagement') }}</span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="clearCache" v-if="$isElectron">
          <i class="iconfont-icon_computer_defaul"></i>
          <span>{{ cleanTitle }}</span>
        </el-dropdown-item>
        <el-dropdown-item class="user-setting-item" command="logout">
          <i class="iconfont-zhuxiao1"></i>
          <span>{{ $t('userSafeLogout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <DeviceMgrDialog ref="DeviceMgrDialog" @noDevice="noDevice" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DeviceMgrDialog from './DeviceMgrDialog'
import { bindClientList } from '@/api/intl/legacy/bus-jgt-common'
import setPageGray from '@/libs/pageGray.js'
import local from '@/libs/util.local'

export default {
  name: 'UserSetting',
  components: { DeviceMgrDialog },
  computed: {
    ...mapState('d2admin/theme', ['list', 'activeName']),
    ...mapState('d2admin/fullscreen', ['active']),
    ...mapState('d2admin/user', ['info']),
    ...mapState('d2admin/update', ['showUpdate']),
    // 用户名
    userName () {
      let userName = this.info?.operatorName || ''
      // 5-游客 7-体验账号
      if (this.info?.loginType === '5') {
        userName = '游客'
      } else if (this.info?.loginType === '7') {
        userName = '体验'
      }
      return userName
    },
    // 用户名第一个字符
    userNameFirst () {
      if (this.userName) {
        const len = this.userName.length
        const firstChars = this.userName[len - 2] || ''
        const secondChars = this.userName[len - 1] || ''
        return `${firstChars}${secondChars}`
      }
      return ''
    },
    // 主题名称翻译
    themeName () {
      return this.$t(this.activeName === 'web' ? 'themePremium' : 'themeSimple')
    },
    cleanTitle () {
      return this.$t(window.CONFIG.ELECTRON_VERSION >= '2.0.3' ? 'userClearCache' : 'userClearCacheRestart')
    },
    // 是否显示红点
    isShowDot () {
      return this.showUpdate || this.isShowThemeNotice
    }
  },
  data () {
    return {
      showDeviceMgrDialog: true,
      // 是否显示换肤通知
      isShowThemeNotice: window.CONFIG.IS_SHOW_THEME_NOTICE
    }
  },
  methods: {
    ...mapActions('d2admin/theme', ['set']),
    ...mapActions('d2admin/fullscreen', ['toggle']),
    ...mapActions('d2admin/account', ['logout']),
    handleCommand (command) {
      switch (command) {
        // 切换主题
        case 'toggleTheme':
          const themeName = this.activeName === 'web' ? 'client' : 'web'
          this.set(themeName)
          this.util.setLocal('jgt-userThemeName', themeName)
          this.avatarClickChange(themeName === 'web' ? '切换至简约版' : '切换至尊享版')
          this.isShowThemeNotice = false
          local.set('isShowThemeNotice', true, { user: true })
          try {
            this.$jySensors.registerPage({
              current_theme: themeName === 'client' ? '尊享版' : '简约版'
            })
            setPageGray(this.$route.name)
          } catch (error) {

          }
          break
        case 'toggledFullscreen':
          this.toggle()
          this.avatarClickChange('切换全屏')
          break
        case 'changePassword':
          this.avatarClickChange('修改密码')
          this.$router.push({
            path: '/personal-center/password-edit'
          })
          break
        case 'checkUpdate':
          this.avatarClickChange('检查更新')
          this.$eventBus.$emit('updateClient')
          break
        case 'logout':
          this.avatarClickChange('安全退出')
          this.logout({
            confirm: true
          })
          break
        case 'deviceMgr':
          this.$refs.DeviceMgrDialog.show = true
          break
        case 'clearCache':
          this.util.confirmClearCache()
          break
      }
    },
    avatarClickChange (buttonName) {
      try {
        this.$jgtSensorsTrack.avatarClick({
          button_name: buttonName
        })
      } catch (error) {

      }
    },
    noDevice () {
      this.showDeviceMgrDialog = false
    }
  },
  async mounted () {
    this.isShowThemeNotice = !local.get('isShowThemeNotice', { user: true })
    try {
      if (this.$isElectron) {
        const data = await bindClientList()
        this.showDeviceMgrDialog = data?.clientList?.length > 0
      }
    } catch {

    }
  }
}
</script>

<style lang="scss">
.user-setting-ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  @include backgroundColor(A3);
  display: flex;
  align-items: center;
  @include color(A2);
  font-size: 12px;
  justify-content: center;
  .user-notice-dot {
    width: 6px;
    height: 6px;
    right: -2px;
    top: -2px;
    @include backgroundColor(A18);
    border: 3px solid;
    @include borderColor(A2);
  }
}
.user-notice-dot {
  display: block;
  width: 5px;
  height: 5px;
  position: absolute;
  right: -8px;
  top: 8px;
  @include backgroundColor(A18);
  border-radius: 50%;
}
ul.el-popper.el-dropdown-menu {
  padding: 0;
  li.user-setting-item {
    width: 168px;
    display: flex;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
    padding: 0 12px;
    &.is-name {
      height: 56px;
      @include color(A6);
      @include borderColor(A13);
      border-bottom-style: solid;
      border-bottom-width: 1px;
    }
    .user-setting-name {
      width: 108px;
    }
    i {
      margin-left: 4px;
      margin-right: 8px;
    }
  }
}
</style>
