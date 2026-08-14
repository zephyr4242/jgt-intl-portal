/**
 * 修改tab和meta title方法
 */
import { mapState } from 'vuex'
import Vue from 'vue'

export default {
  methods: {
    changeTabName (name, path) {
      path = path || this.$route.fullPath
      this.opened.forEach((item, index) => {
        if (path === item.fullPath) {
          if (this.$isClient) {
            window.top.setCurrentTabName(name, window.name)
          } else {
            item.index = index
            item.meta = { ...item.meta, title: name }
            this.util.title(name)
            try {
              Vue.prototype.$jySensors && Vue.prototype.$jySensors.trackSinglePageview({
                $title: name,
                page_id: this.$route.meta.pageId,
                flow_id: this.$route.meta.flowId
              })
            } catch (error) {

            }
            this.$store.dispatch('d2admin/page/openedUpdate', item)
          }
        }
      })
    }
  },
  computed: {
    ...mapState('d2admin/page', ['opened']),
    current: {
      get () {
        return this.$store.state.d2admin.page.current
      },
      set (v) {
        this.currentSet(v)
      }
    }
  }
}
