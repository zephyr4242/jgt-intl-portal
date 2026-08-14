<template>
  <div v-bind="$attrs">
    <div @click="click()" class="notice-cell" :class="{'no-url': type && !url}">
      {{ text }}
    </div>
  </div>
</template>
<script>
// 专门用于公告的单元格，属于业务组件
export default {
  name: 'NoticeCell',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  data () {
    return {
      text: null,
      urlProp: null,
      noticeId: null,
      type: ''
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}

      const text = this.prop?.column?.prop
      const urlProp = this.prop?.column?.url
      this.type = this.prop?.column?.type
      this.url = data[urlProp]
      this.text = text ? data[text] : ''
    },
    click () {
      const data = this.prop?.row ?? {}
      const urlProp = this.prop?.column?.url
      const type = this.prop?.column?.type
      const noticeId = data.noticeId

      if (data[urlProp]) {
        // 如有文件链接 打开该pdf
        const text = this.prop?.column?.prop
        let fileName = data[text]
        const fileId = data[urlProp]
        if (fileId.endsWith('pdf') && !fileName.endsWith('pdf')) {
          // IE 下载时依赖文件后缀，不会自动识别文件类型
          fileName = fileName + '.pdf'
        }
        this.util.filePreview({
          type: 'url',
          fileId: data[urlProp],
          fileName: fileName
        })
      } else if (data.isBmis) {
        // 是否为券商资管, 在数据层处理好传过来
        const options = {
          url: `/bmis/product/notice/${noticeId}`,
          tab: '公告详情',
          menu: 'ZIGUANCHANPIN',
          paramKey: 'GONGGAOXIANGQING' + noticeId,
          push: true,
          params: { noticeId, fundCode: data.fundCode, type: 'bmis', productId: data.productId }
        }

        this.util.fapRouter(options)
      } else {
        if (type === 'private') {
          return false
        }
        // 公募兜底
        const options = {
          url: `/fund/product/notice/${noticeId}`,
          tab: '公告详情',
          menu: 'JIJINCHANPIN',
          paramKey: 'GONGGAOXIANGQING' + noticeId,
          push: true,
          params: { noticeId, proCode: data.proCode, type: 'fund' }
        }

        this.util.fapRouter(options)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.notice-cell {
  @include color(A10);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
}
.notice-cell.no-url{
  @include color(A6);
  cursor: default;
  &:hover {
    text-decoration: none !important;
  }
}
</style>
