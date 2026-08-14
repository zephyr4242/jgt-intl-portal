import mockStatementUrl from './files/mock-statement.pdf'

export const statements = [
  {
    statementId: 'stmt-demo-2026-07',
    tradeAccountId: 'TA-HK-001',
    period: '2026-07',
    fileName: 'HK____0001_2026-07.pdf',
    generatedAt: '2026-08-03T02:00:00.000Z',
    fileStatus: 'AVAILABLE',
    previewRef: mockStatementUrl,
    downloadRef: mockStatementUrl,
    expiresAt: '2099-12-31T23:59:59.000Z'
  },
  {
    statementId: 'stmt-demo-expired',
    tradeAccountId: 'TA-HK-001',
    period: '2026-05',
    fileName: 'HK____0001_2026-05.pdf',
    generatedAt: '2026-06-03T02:00:00.000Z',
    fileStatus: 'EXPIRED',
    previewRef: null,
    downloadRef: null,
    expiresAt: '2026-06-10T00:00:00.000Z'
  },
  {
    statementId: 'stmt-demo-failed',
    tradeAccountId: 'TA-SG-002',
    period: '2026-06',
    fileName: 'SG____0002_2026-06.pdf',
    generatedAt: '2026-07-03T02:00:00.000Z',
    fileStatus: 'FAILED',
    previewRef: null,
    downloadRef: null,
    expiresAt: null
  }
]

export const statementFileFailures = {
  'stmt-demo-failed': 'STATEMENT_FILE_FAILED',
  'stmt-demo-expired': 'STATEMENT_EXPIRED'
}
