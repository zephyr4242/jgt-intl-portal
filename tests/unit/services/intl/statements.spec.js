import statements from '@/services/intl/providers/mock/statements'
import { isTrustedPdfAccess } from '@/services/intl/providers/api/statements'

jest.mock('@/api/intl/statement', () => ({
  listStatements: jest.fn(),
  getStatementFileAccess: jest.fn(),
  updateStatementPreference: jest.fn()
}))

describe('international statements providers', () => {
  it('distinguishes available, expired and failed statements', async () => {
    const result = await statements.list({ page: 1, pageSize: 20 })
    expect(result.items.map(item => item.fileStatus)).toEqual(expect.arrayContaining(['AVAILABLE', 'EXPIRED', 'FAILED']))
  })

  it('only grants valid PDF access and rejects expired files', async () => {
    await expect(statements.getFileAccess({ statementId: 'stmt-demo-2026-07', purpose: 'PREVIEW' }))
      .resolves.toMatchObject({ mimeType: 'application/pdf' })
    await expect(statements.getFileAccess({ statementId: 'stmt-demo-expired', purpose: 'PREVIEW' }))
      .rejects.toMatchObject({ code: 'STATEMENT_EXPIRED', retryable: false })
  })

  it('rejects unsafe schemes and expired API access', () => {
    expect(isTrustedPdfAccess({ mimeType: 'application/pdf', url: 'javascript:alert(1)', expiresAt: '2099-01-01T00:00:00Z' })).toBe(false)
    expect(isTrustedPdfAccess({ mimeType: 'application/pdf', url: '/safe.pdf', expiresAt: '2020-01-01T00:00:00Z' })).toBe(false)
  })
})
