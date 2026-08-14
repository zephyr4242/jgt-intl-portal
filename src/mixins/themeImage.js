/**
 * 图片换肤
 */
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('d2admin/theme', ['activeName']),
    isClient () {
      return this.$isClient || this.activeName === 'client'
    }
  },
  data () {
    return {
      urls: {}
    }
  },
  watch: {
    activeName: {
      handler () {
        this.getNewImage()
      },
      deep: true
    }
  },
  methods: {
    /**
     * 注册图片
     * @param fields
     * @param url
     */
    registerThemeImage (fields, url) {
      const urlData = url.split('.')
      this.urls[fields] = {
        path: urlData[0],
        type: urlData[1]
      }
      this.getNewImage()
    },
    /**
     * 获取最新图片
     */
    getNewImage () {
      Object.keys(this.urls).map(key => {
        this.setImage(key)
      })
    },
    /**
     * 设置图片
     */
    setImage (key) {
      let dataObj = this
      const data = key.split('.')
      data.map((item, index) => {
        if (index === data.length - 1) {
          dataObj[item] = this.requireUrl(key)
        } else {
          dataObj = dataObj[item]
        }
      })
    },
    /**
     * 加载图片
     */
    requireUrl (key) {
      let { path, type } = this.urls[key]
      // 如果path带的有后缀就不添加后缀了
      if (!path.endsWith('_client') && !path.endsWith('_web')) {
        path = this.isClient ? `${path}_client` : `${path}_web`
      }
      switch (type) {
        case 'png':
          return require(`@/assets/images${path}.png`)
        case 'jpg':
          return require(`@/assets/images${path}.jpg`)
        case 'jpeg':
          return require(`@/assets/images${path}.jpeg`)
        case 'gif':
          return require(`@/assets/images${path}.gif`)
      }
    }
  }
}
