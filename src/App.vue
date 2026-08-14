<template>
  <!-- 增加 ondragstart="return false" 禁止拖拽图片 -->
  <div id="app" ondragstart="return false">
    <jgt-environment-badge />
    <router-view />
    <!-- 生产环境打开控制台密码弹窗 -->
    <jy-console />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import cfg from '@/eleConfig'
import jyConsole from '@/components/jy-console'
import JgtEnvironmentBadge from '@/components/jgt-environment-badge'

export default {
  name: 'app',
  components: {
    jyConsole,
    JgtEnvironmentBadge
  },
  data() {
    return {
      initFactor: this.util.debounce(this._initFactor)
    }
  },
  mounted() {
    try {
      this.$jySensors.registerPage({
        build_time: this.$buildTime,
        web_version: window.CONFIG?.WEB_VERSION
      })
    } catch (error) {

    }
    // 初始化多账户标志
    if (!this.util.getLocal('isMultiple')) {
      this.util.setLocal('isMultiple', 'true')
    }

    // 在页面加载时读取localStorage里的状态信息
    this.$store.state.storePage = Object.assign(
      this.$store.state.storePage,
      JSON.parse(localStorage.getItem('storePage'))
    )

    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('storePage', JSON.stringify(this.$store.state.storePage))
    })

    // 初始化客户端
    if (window.ipcRenderer) {
      // 读设备信息
      window.ipcRenderer.on('machineInfo', (_event, machine) => {
        window.machine = machine
      })

      window.ipcRenderer.send('getMachineInfo')

      // 处理并行环境
      window.ipcRenderer.on('setspVersion', (_event, spVersion) => {
        if (spVersion) {
          let raw = window.CONFIG.VUE_APP_LINK_PATH
          window.CONFIG.VUE_APP_LINK_PATH = raw.replace('http://www.', `http://sp${spVersion}.ets.`)
          localStorage.setItem('jgt-feign-version', spVersion)
        }
      })

      window.ipcRenderer.send('getspVersion')

      window.ipcRenderer.invoke('win-envConfig', cfg)

      this.setZoomFactor(1)
      this.initFactor()
      window.addEventListener('resize', this.initFactor)

      // 客户端崩溃时上报到神策
      window.ipcRenderer.on('sentrySend', (_event, mes) => {
        if (window.CONFIG.SENTRY?.ACCOUNT_PORTAL_ENABLE) {
          window.$Sentry.captureException(new Error(`path: 进程崩溃 msg:${mes}`))
        }
      })
    }

    const isClient = window.top && window.top.$gc

    // 设置换肤
    this.setTheme(isClient)
  },
  methods: {
    ...mapActions('d2admin/theme', ['set']),
    setTheme(isClient) {
      const userThemeName = this.util.getLocal('jgt-userThemeName')
      let themeName = userThemeName
      let isElectron = navigator?.userAgent?.toLowerCase()?.indexOf('electron/') > -1
      if (userThemeName && !isClient) {
        this.set(userThemeName)
      } else {
        // 国际门户默认直接使用原基构通尊享版主题；仍尊重用户已保存的换肤选择。
        let setThemeName = 'client'
        this.set(setThemeName)
        themeName = setThemeName
      }
      // 定义事件公共属性
      try {
        let platform = this.$isClient ? 'client' : 'web'
        this.$jySensors.registerPage({
          business_type: 'jgt-intl',
          business_name: '基煜国际业务门户',
          platform: isElectron ? 'client2.0' : platform,
          current_theme: themeName === 'client' ? '尊享版' : '简约版',
          system_digits: this.$isMac ? 'mac' : this.util.getIsWin32() ? 'win32' : 'win64'
        })
      } catch (error) {

      }
    },
    _initFactor() {
      if (window.ipcRenderer) {
        const width = window.screen.width

        let factor = 1
        if (width < 1280) {
          factor = width / 1280
        } else if (width > 1920) {
          factor = width / 1920
        }

        // 登录页无需修正
        if (location.href.includes('#/elogin')) {
          factor = 1
        }

        // 忽略千2的误差，避免因为浮点数精度导致无限循环
        if (factor > 1.002 || factor < 0.998) {
          this.setZoomFactor(factor)
        } else {
          this.setZoomFactor(1)
        }
      }
    },
    setZoomFactor(factor) {
      window.ipcRenderer.send('triggerApi', '1', 'webContents', 'setZoomFactor', factor)
    }
  },
  beforeDestroy() {
    if (window.ipcRenderer) {
      window.ipcRenderer.removeAllListeners('sentrySend')
      window.ipcRenderer.removeAllListeners('setspVersion')
      window.removeEventListener('resize', this.initFactor)
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";
@import "~@/assets/style/theme/register.scss";

.fap.jy-pdf-dialog {
  .el-dialog {
    display: flex;
    flex-direction: column;
    height: 100vh;
    .el-dialog__body {
      // height: 95vh;
      // max-height: 95vh;
      flex: 1;
      padding: 0;
      max-height: none;
    }
    .el-dialog__header {
      padding-right: 50px;
    }
  }
}
</style>
