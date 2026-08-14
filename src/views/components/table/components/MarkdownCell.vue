<template>
  <div
    v-bind="$attrs"
    class="markdown-cell"
    :style="{ textAlign: textAlign }"
    v-html="html"
  />
</template>
<script>
import { marked } from 'marked'

export default {
  name: 'MarkdownCell',
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
      html: '',
      textAlign: 'left'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      const settings = this.prop?.column ?? {}
      const text = settings?.prop ? data[settings.prop] : ''
      this.textAlign = settings?.textAlign ?? 'left'

      if (!text || text === '--') {
        this.html = text || '--'
        return
      }
      // 转义孤立的 * 防止被解析为斜体，保留 ** (加粗) 语法
      const escaped = text.replace(/(?<!\*)\*(?!\*)/g, '\\*')
      this.html = marked(escaped, { breaks: true })
    }
  }
}
</script>
<style scoped lang="scss">
.markdown-cell {
  width: 100%;
  line-height: 1.6;

  ::v-deep {
    p {
      margin: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin: 4px 0;

      th,
      td {
        border: 1px solid #dcdfe6;
        padding: 4px 8px;
        text-align: left;
        white-space: normal;
        word-break: break-all;
      }

      th {
        font-weight: 600;
        background-color: #f5f5f5;
        color: rgba(0, 0, 0, .9);
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }
    }
  }
}
</style>
