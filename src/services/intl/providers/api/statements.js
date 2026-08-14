import { listStatements, getStatementFileAccess } from '@/api/intl/statement'
import { DomainError, createDomainError } from '@/services/intl/errors'

const unwrap = raw => raw && raw.data !== undefined ? raw.data : raw

export const isTrustedPdfAccess = access => {
  if (!access || access.mimeType !== 'application/pdf' || !access.url) return false
  if (access.expiresAt && new Date(access.expiresAt).getTime() <= Date.now()) return false
  try {
    const base = typeof window === 'undefined' ? 'https://portal.invalid' : window.location.origin
    const parsed = new URL(access.url, base)
    if (!['https:', 'http:'].includes(parsed.protocol)) return false
    if (typeof window === 'undefined') return parsed.protocol === 'https:'
    if (parsed.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(parsed.hostname)) return false
    const configured = (window.CONFIG && window.CONFIG.INTL_STATEMENT_TRUSTED_ORIGINS) || []
    return parsed.origin === window.location.origin || configured.includes(parsed.origin)
  } catch (e) {
    return false
  }
}

export default {
  async list (query = {}) {
    try {
      const body = unwrap(await listStatements(query)) || {}
      const items = body.items || body.records || body.list || (Array.isArray(body) ? body : [])
      return {
        items: items.map(item => ({
          ...item,
          statementId: String(item.statementId || item.id || ''),
          tradeAccountId: String(item.tradeAccountId || item.tradeAcco || ''),
          fileStatus: String(item.fileStatus || 'FAILED').toUpperCase()
        })),
        page: Number(body.page || body.pageNum || query.page || 1),
        pageSize: Number(body.pageSize || body.size || query.pageSize || 20),
        total: Number(body.total == null ? items.length : body.total)
      }
    } catch (error) {
      throw createDomainError(error, { code: 'STATEMENT_QUERY_FAILED', messageKey: 'errors.queryFailed', retryable: true })
    }
  },
  async getFileAccess (query) {
    try {
      const access = unwrap(await getStatementFileAccess(query))
      if (!isTrustedPdfAccess(access)) {
        throw new DomainError({ code: 'STATEMENT_FILE_UNTRUSTED', category: 'FILE', messageKey: 'errors.statementFileUnavailable', retryable: true })
      }
      return access
    } catch (error) {
      throw createDomainError(error, { code: 'STATEMENT_FILE_FAILED', category: 'FILE', messageKey: 'errors.statementFileUnavailable', retryable: true })
    }
  }
}
