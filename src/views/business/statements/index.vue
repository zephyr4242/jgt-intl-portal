<template>
  <d2-container class="biz-shell">
    <template slot="header"><div class="biz-header"><div class="biz-header__title">{{ $t('statementsTitle') }}</div></div></template>
    <div class="biz-page">
      <p class="biz-sub">{{ $t('statementsDescription') }}</p>
      <el-form inline class="filters">
        <el-form-item :label="$t('accountTradeAccount')"><el-input v-model.trim="query.tradeAccountId" clearable /></el-form-item>
        <el-form-item :label="$t('statementsPeriod')"><el-date-picker v-model="query.period" type="month" value-format="yyyy-MM" /></el-form-item>
        <el-button type="primary" :loading="loading" @click="search">{{ $t('commonSearch') }}</el-button>
        <el-button @click="reset">{{ $t('commonReset') }}</el-button>
      </el-form>
      <el-alert v-if="error" type="error" :title="$t(error.messageKey || 'errors.queryFailed')" show-icon>
        <el-button size="mini" @click="load">{{ $t('commonRetry') }}</el-button>
      </el-alert>
      <div v-else class="biz-card" v-loading="loading">
        <el-table :data="items" stripe size="small" class="biz-table">
          <el-table-column prop="tradeAccountId" :label="$t('accountTradeAccount')" min-width="150" />
          <el-table-column prop="period" :label="$t('statementsPeriod')" min-width="100" />
          <el-table-column prop="fileName" :label="$t('statementsFileName')" min-width="210" />
          <el-table-column prop="generatedAt" :label="$t('statementsGeneratedAt')" min-width="180" />
          <el-table-column :label="$t('commonStatus')" min-width="110"><template slot-scope="{ row }">{{ $t(`statementStatus.${effectiveStatus(row)}`) }}</template></el-table-column>
          <el-table-column :label="$t('commonActions')" min-width="170" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" :disabled="!canUse(row)" :loading="workingId === row.statementId" @click="preview(row)">{{ $t('statementsPreview') }}</el-button>
              <el-button type="text" :disabled="!canUse(row)" :loading="workingId === row.statementId" @click="download(row)">{{ $t('statementsDownload') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!loading && items.length === 0" class="biz-empty">{{ $t('statementsEmpty') }}</div>
      </div>
      <p class="biz-tip">{{ $t('statementsSecurityTip') }}</p>
      <statement-preview-dialog ref="preview" />
    </div>
  </d2-container>
</template>

<script>
import { statements } from '@/services/intl'
import StatementPreviewDialog from './StatementPreviewDialog'

export default {
  name: 'IntlStatements',
  components: { StatementPreviewDialog },
  data () {
    return { query: { tradeAccountId: '', period: '', page: 1, pageSize: 20 }, items: [], loading: false, error: null, workingId: null }
  },
  created () { this.load() },
  methods: {
    async load () {
      this.loading = true; this.error = null; this.items = []
      try { this.items = (await statements.list(this.query)).items } catch (error) { this.error = error } finally { this.loading = false }
    },
    search () { this.query.page = 1; this.load() },
    reset () { this.query = { tradeAccountId: '', period: '', page: 1, pageSize: 20 }; this.load() },
    effectiveStatus (row) {
      if (row.fileStatus === 'AVAILABLE' && row.expiresAt && new Date(row.expiresAt).getTime() <= Date.now()) return 'EXPIRED'
      return row.fileStatus
    },
    canUse (row) { return this.effectiveStatus(row) === 'AVAILABLE' },
    async preview (row) {
      this.workingId = row.statementId
      try {
        const access = await statements.getFileAccess({ statementId: row.statementId, purpose: 'PREVIEW' })
        this.$refs.preview.open(access)
      } catch (error) { this.$message.error(this.$t(error.messageKey || 'errors.statementFileUnavailable')) } finally { this.workingId = null }
    },
    async download (row) {
      this.workingId = row.statementId
      try {
        const access = await statements.getFileAccess({ statementId: row.statementId, purpose: 'DOWNLOAD' })
        const anchor = document.createElement('a')
        anchor.href = access.url; anchor.download = access.fileName; anchor.rel = 'noopener'; anchor.click()
      } catch (error) { this.$message.error(this.$t(error.messageKey || 'errors.statementFileUnavailable')) } finally { this.workingId = null }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/biz-page.scss';
</style>
<style lang="scss">@import '../styles/biz-table.scss';</style>
