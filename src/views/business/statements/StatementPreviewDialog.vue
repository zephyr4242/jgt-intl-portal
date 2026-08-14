<template>
  <el-dialog :title="$t('statementsPreviewTitle')" width="82%" :visible.sync="visible" :close-on-click-modal="false" @closed="reset">
    <el-alert v-if="error" type="error" :title="$t('statementsPreviewUnavailable')" show-icon />
    <jy-pdf v-if="visible && access && !error" ref="pdf" :pdf-option="pdfOption" @loaded="onLoaded" @error="onError" />
    <div slot="footer">
      <el-button @click="visible = false">{{ $t('commonClose') }}</el-button>
      <el-button type="primary" :disabled="!previewReady || expired" @click="print">{{ $t('statementsPrint') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JyPdf from '@/components/jy-pdf'

export default {
  name: 'StatementPreviewDialog',
  components: { JyPdf },
  data () {
    return { visible: false, access: null, previewReady: false, error: false, timer: null, now: Date.now() }
  },
  computed: {
    expired () { return !this.access || !this.access.expiresAt || new Date(this.access.expiresAt).getTime() <= this.now },
    pdfOption () { return { pdfUrl: this.access && this.access.url, fileName: this.access && this.access.fileName } }
  },
  beforeDestroy () { clearInterval(this.timer) },
  methods: {
    open (access) {
      this.access = access; this.previewReady = false; this.error = false; this.now = Date.now(); this.visible = true
      clearInterval(this.timer)
      this.timer = setInterval(() => { this.now = Date.now() }, 1000)
    },
    onLoaded () { if (!this.expired) this.previewReady = true },
    onError () { this.previewReady = false; this.error = true },
    print () {
      if (this.expired || !this.previewReady || !this.$refs.pdf.print()) {
        this.$message.error(this.$t('statementsPreviewUnavailable'))
      }
    },
    reset () { clearInterval(this.timer); this.access = null; this.previewReady = false; this.error = false }
  }
}
</script>
