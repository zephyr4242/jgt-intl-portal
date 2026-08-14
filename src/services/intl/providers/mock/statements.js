import { statementFileFailures } from '@/mocks/intl/statements'
import { readMockTable } from '@/mocks/intl/database'
import { DomainError } from '@/services/intl/errors'

const failure = (code, retryable = true) => {
  return new DomainError({
    code,
    category: 'FILE',
    messageKey: code === 'STATEMENT_EXPIRED' ? 'errors.statementExpired' : 'errors.statementFileUnavailable',
    retryable
  })
}

export default {
  async list (query = {}) {
    if (query.scenario === 'failure') throw failure('STATEMENT_QUERY_FAILED')
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 20)
    const filtered = readMockTable('statements')
      .filter(item => !query.tradeAccountId || item.tradeAccountId === query.tradeAccountId)
      .filter(item => !query.period || item.period === query.period)
    const start = (page - 1) * pageSize
    return { items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length }
  },
  async getFileAccess ({ statementId, purpose }) {
    const item = readMockTable('statements').find(statement => statement.statementId === statementId)
    const fixtureFailure = statementFileFailures[statementId]
    if (!item || fixtureFailure) throw failure(fixtureFailure || 'STATEMENT_FILE_FAILED', fixtureFailure !== 'STATEMENT_EXPIRED')
    if (item.fileStatus !== 'AVAILABLE' || !item.expiresAt || new Date(item.expiresAt).getTime() <= Date.now()) {
      throw failure('STATEMENT_EXPIRED', false)
    }
    const url = purpose === 'DOWNLOAD' ? item.downloadRef : item.previewRef
    if (!url) throw failure('STATEMENT_FILE_FAILED')
    return {
      statementId,
      fileName: item.fileName,
      mimeType: 'application/pdf',
      url,
      expiresAt: item.expiresAt
    }
  }
}
