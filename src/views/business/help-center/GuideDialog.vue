<template>
  <el-dialog
    :title="dialogTitle"
    width="680px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
  >
    <div v-if="contentAvailable" class="guide-content">{{ guide.body }}</div>
    <el-empty v-else :description="$t('helpContentUnavailable')" :image-size="72" />
    <div slot="footer">
      <el-button type="primary" @click="visible = false">{{ $t('helpClose') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'HelpGuideDialog',
  data () {
    return {
      visible: false,
      guide: null
    }
  },
  computed: {
    dialogTitle () {
      return (this.guide && this.guide.title) || this.$t('helpContentUnavailable')
    },
    contentAvailable () {
      return !!(this.guide && this.guide.body)
    }
  },
  methods: {
    open (guide) {
      this.guide = guide || null
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-content {
  min-height: 120px;
  color: inherit;
  font-size: 14px;
  line-height: 1.9;
  white-space: pre-line;
}
</style>
