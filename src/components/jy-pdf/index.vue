<template>
  <div v-loading="loading" class="jy-pdf">
    <iframe
      v-if="viewerUrl"
      ref="frame"
      :src="viewerUrl"
      :title="pdfOption.fileName || $t('statementsPreviewTitle')"
      sandbox="allow-scripts allow-same-origin allow-downloads"
      frameborder="0"
      @load="onLoad"
      @error="onError"
    />
    <div v-else class="jy-pdf__empty">{{ $t('statementsPreviewUnavailable') }}</div>
  </div>
</template>

<script>
export default {
  name: 'JyPdf',
  props: {
    pdfOption: {
      type: Object,
      required: true
    }
  },
  data () {
    return { loading: true, loaded: false, timer: null }
  },
  computed: {
    viewerUrl () {
      if (!this.pdfOption || !this.pdfOption.pdfUrl) return ''
      const root = this.$baseUrl || process.env.BASE_URL || '/'
      return `${root}pdfjs-2.0.943-dist/web/viewer.html?file=${encodeURIComponent(this.pdfOption.pdfUrl)}`
    }
  },
  watch: {
    viewerUrl () { this.beginLoading() }
  },
  mounted () { this.beginLoading() },
  beforeDestroy () { clearTimeout(this.timer) },
  methods: {
    beginLoading () {
      clearTimeout(this.timer)
      this.loaded = false
      this.loading = Boolean(this.viewerUrl)
      if (this.loading) this.timer = setTimeout(this.onError, 15000)
    },
    onLoad () {
      clearTimeout(this.timer)
      this.loading = false
      this.loaded = true
      this.$emit('loaded')
    },
    onError () {
      clearTimeout(this.timer)
      this.loading = false
      this.loaded = false
      this.$emit('error')
    },
    print () {
      if (!this.loaded || !this.$refs.frame || !this.$refs.frame.contentWindow) return false
      this.$refs.frame.contentWindow.print()
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.jy-pdf { width: 100%; height: 100%; min-height: 520px; background: #fff; }
.jy-pdf iframe { width: 100%; height: 100%; min-height: 520px; }
.jy-pdf__empty { padding: 80px 20px; color: #909399; text-align: center; }
</style>
