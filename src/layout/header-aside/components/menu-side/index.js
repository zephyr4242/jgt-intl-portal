import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'
import BScroll from 'better-scroll'

export default {
  name: 'd2-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render (h) {
    // 依赖 locale，切换三语时重渲染侧栏标题
    // eslint-disable-next-line no-unused-expressions
    this.$locale
    return <div class="d2-layout-header-aside-menu-side">
      <el-menu
        collapse={this.asideCollapse}
        collapseTransition={this.asideTransition}
        uniqueOpened={true}
        defaultActive={this.activeRoute}
        ref="menu"
        onSelect={this.handleMenuSelect}>
        {this.aside.map(menu => createMenu.call(this, h, menu, this.menuIds))}
      </el-menu>
      {
        this.aside.length === 0 && !this.asideCollapse
          ? <div class="d2-layout-header-aside-menu-empty" flex="dir:top main:center cross:center">
            <d2-icon name="inbox"></d2-icon>
            <span>{this.$t('commonNoData')}</span>
          </div>
          : null
      }
    </div>
  },
  data () {
    return {
      asideHeight: 300,
      BS: null
    }
  },
  computed: {
    ...mapState('d2admin/menu', [
      'aside',
      'asideCollapse',
      'asideTransition'
    ]),
    menuIds () { return [] },
    activeRoute () {
      return (this.$route.meta && this.$route.meta.menuPath) || this.$route.path
    }
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      if (this.BS) return
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy () {
      // https://github.com/d2-projects/d2-admin/issues/75
      if (!this.BS) return
      try {
        this.BS.destroy()
      } catch (e) {
        // delete this.BS
        // this.BS = null
      }
      this.BS = null
    }
  }
}
