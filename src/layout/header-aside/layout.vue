<template>
  <div class="d2-layout-header-aside-group" :class="{ grayMode: grayActive }">
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        v-if="!$isClient"
        class="d2-theme-header"
        flex-box="0"
        flex
      >
        <router-link to="/index" class="logo-group" :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" flex-box="0">
          <img v-if="asideCollapse" :src="asideLogoMini" class="intl-brand-image intl-brand-image--mini" :alt="$t('portalShortName')">
          <img v-else :src="asideLogo" class="intl-brand-image" :alt="$t('portalShortName')">
        </router-link>
        <div class="toggle-aside-btn icon-button" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars"/>
        </div>
        <div class="toggle-aside-btn icon-button refresh-button" @click="handleRefreshPage" flex-box="0">
          <d2-icon name="refresh"/>
        </div>
        <div class="header-search-slot" flex-box="0">
          <jgt-intl-search />
        </div>
        <div flex-box="1" @dblclick="toggleIsMax"></div>
        <div class="d2-header-right" flex-box="0">
          <jgt-lang-switch class="header-lang-switch" theme="light" />
          <d2-header-user/>
          <el-button class="header-logout-btn" size="mini" plain @click="handleDemoLogout">{{ $t('topbarExit') }}</el-button>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          v-if="!$isClient"
          flex-box="0"
          ref="aside"
          class="d2-theme-container-aside"
          :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth }">
          <d2-menu-side/>
          <img :src="asideBackgroundImage" class="asideBackgroundImage" alt="">
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div v-if="!$isClient" class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs/>
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <FullPathKeepAlive :include="keepAlive.map(i=>i.fullPath)" ref="keepAlive">
                    <router-view :key="$route.fullPath" />
                  </FullPathKeepAlive>
                </transition>
              </div>
            </div>
          </transition>
          <!-- 快捷功能 -->
          <asideShortcut v-if="!$isClient"/>
        </div>
      </div>
    </div>

    <ReloginDialog ref="ReloginDialog"></ReloginDialog>
  </div>
</template>

<script>
import d2MenuSide from './components/menu-side'
import d2Tabs from './components/tabs'
import d2HeaderUser from './components/header-user'
import asideShortcut from './components/aside-shortcut'
import JgtLangSwitch from '@/components/jgt-lang-switch'
import { mapState, mapActions, mapMutations } from 'vuex'
// import * as echarts from 'echarts'
import JgtIntlSearch from '@/components/jgt-intl-search'
import FullPathKeepAlive from './FullPathKeepAlive'
import ReloginDialog from '@/views/system/elogin/dialogs/ReloginDialog'
import themeImage from '@/mixins/themeImage'
import eventBus from '@/libs/eventBus'
import Vue from 'vue'

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag

    if (type === 'css') {
      tag = document.createElement('link')
      tag.rel = 'stylesheet'
      tag.href = url
    } else if (type === 'js') {
      tag = document.createElement('script')
      tag.src = url
    }
    if (tag) {
      tag.onload = () => resolve(url)
      tag.onerror = () => reject(url)
      document.head.appendChild(tag)
    }
  })
}

export default {
  name: 'd2-layout-header-aside',
  mixins: [themeImage],
  components: {
    d2MenuSide,
    d2Tabs,
    d2HeaderUser,
    asideShortcut,
    JgtIntlSearch,
    FullPathKeepAlive,
    ReloginDialog,
    JgtLangSwitch
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '64px',
      isInWhiteList: false,
      // 侧边栏背景图
      asideBackgroundImage: '',
      asideLogo: require('@/assets/images/common/jiyu-international-sidebar-logo.png'),
      asideLogoMini: require('@/assets/images/common/jiyu-fund-logo.png')
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      opened: state => state.page.opened,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapState('d2admin/user', ['info'])
  },
  beforeRouteEnter(to, from, next) {
    let isElectron = navigator?.userAgent?.toLowerCase()?.indexOf('electron/') > -1
    if (isElectron) {
      Promise.all([
        loadExternalResource(`./echarts.min.js`, 'js')
      ]).finally(() => {
        Vue.prototype.$echarts = window.echarts
        next()
      })
    } else {
      Promise.all([
        loadExternalResource(`./pdfjs-2.0.943-dist/build/pdf.js`, 'js'),
        loadExternalResource(`./echarts.min.js`, 'js')
      ]).finally(() => {
        Vue.prototype.$echarts = window.echarts
        next()
      })
    }
  },
  async mounted () {
    this.isInWhiteList = !this.info?.noTokenLogin
    // 老客户端固定改为黑色换肤
    if (this.$isClient) {
      this.set('client')
    }
    this.registerThemeImage('asideBackgroundImage', '/common/aside-bg.png')
  },
  methods: {
    ...mapActions('d2admin/theme', ['set']),
    ...mapMutations('d2admin/page', ['keepAliveRemove']),
    ...mapActions('d2admin/menu', ['asideCollapseToggle']),
    ...mapActions('d2admin/account', ['logout']),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
      Array.from(document.querySelectorAll('[_echarts_instance_]')).forEach((e) => {
        setTimeout(() => {
          this.$echarts.getInstanceByDom(e).resize()
        }, 500)
      })
    },
    handleDemoLogout () {
      this.logout({
        confirm: true
      })
    },
    /**
     * 清空当前页缓存并刷新此页面
     */
    async handleRefreshPage () {
      this.keepAliveRemove(this.$route)
      await this.$nextTick()
      try {
        /* const dbName = 'sys'
        const path = 'user.info'
        const user = true
        const uuid = util.cookies.get('uuid') || 'ghost-uuid'
        const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
        const localData = await db.get(currentPath).value()
        console.log(localData) */
        // 获取本地用户信息缓存  更新VUEX用户信息缓存
        const localData = window.localStorage.getItem(`jgt`)
        const res = localData && JSON.parse(window.localStorage.getItem(`jgt`))
        const uuid = this.util.cookies.get('uuid')
        if (
          res &&
          uuid &&
          res.sys &&
          res.sys.user &&
          res.sys.user[uuid] &&
          res.sys.user[uuid].user &&
          res.sys.user[uuid].user.info
        ) {
          await this.$store.dispatch(
            'd2admin/user/set',
            res.sys.user[uuid].user.info
          )
        }
        // 点击刷新时做内容的检查更新，避免因为sw导致刷新不到新的内容
        eventBus.$emit('updateWeb')
      } catch (error) {
      } finally {
        this.$router.replace('/refresh')
      }
    },
    // 切换最大最小化
    toggleIsMax () {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('toggle-is-max')
      }
    }
  }
}
</script>
<style lang="scss">
.d2-header-right {
  display: flex;
  align-items: center;
  gap: 12px;

  .header-home-link {
    font-size: 13px;
    color: #666;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: #c4a574;
    }
  }

  .header-lang-switch {
    margin-right: 4px;
  }

  .header-logout-btn {
    margin-left: 4px;
    color: #c4a574 !important;
    border-color: #c4a574 !important;
    background: transparent !important;
  }

  .header-aside-btn,
  .btn-text {
    padding: 0 !important;
    width: 32px !important;
    height: 32px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.icon-button{
  width: 30px !important;
  margin-left: 8px;
  &.refresh-button{
    margin-left: 0;
    margin-right: 8px;
  }
}

.header-main-demo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  -webkit-app-region: no-drag;
}

.header-main-demo__left,
.header-main-demo__right {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
}

.header-main-demo__right {
  justify-content: flex-end;
}

.header-page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a2d4a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-search-slot {
  width: 420px;
  -webkit-app-region: no-drag;
}

.d2-theme-header {
  -webkit-app-region: drag;
  z-index: 1;
  .logo-group,
  .toggle-aside-btn,
  .header-search-slot,
  .header-main-demo,
  .d2-header-right {
    -webkit-app-region: no-drag;
  }
  .logo-group {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    outline: none;
    overflow: hidden;
  }
}

.intl-brand-image {
  display: block;
  width: auto !important;
  max-width: 164px;
  height: 26px !important;
  margin: 0 auto;
  object-fit: contain;

  &--mini {
    max-width: 28px;
    height: 24px !important;
  }
}

.asideBackgroundImage {
  position: absolute;
  bottom: 0;
  left: 0;
}

.layout-mac-logo-img {
  position: relative;
  top: 12px;
}
</style>
