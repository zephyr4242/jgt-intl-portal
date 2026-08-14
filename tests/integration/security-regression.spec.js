import fs from 'fs'
import path from 'path'
import statements from '@/services/intl/providers/mock/statements'

const project = path.resolve(__dirname, '../..')

describe('international frontend security regression', () => {
  it('keeps credentials out of formal navigation URLs and mock records', () => {
    const formalFiles = [
      'src/menu/aside.js', 'src/router/routes.js', 'src/mocks/intl/trades.js',
      'src/mocks/intl/holdings.js', 'src/mocks/intl/dividends.js'
    ].map(file => fs.readFileSync(path.join(project, file), 'utf8')).join('\n')
    expect(formalFiles).not.toMatch(/[?&](password|token|credential)=/i)
    expect(formalFiles).not.toMatch(/BEGIN (RSA |EC )?PRIVATE KEY/)
  })

  it('selects API or Mock once and has no API-to-Mock fallback branch', () => {
    const entry = fs.readFileSync(path.join(project, 'src/services/intl/index.js'), 'utf8')
    expect(entry).toContain("require('./providers/api')")
    expect(entry).toContain("require('./providers/mock')")
    expect(entry).not.toMatch(/catch[\s\S]{0,200}providers\/mock/)
  })

  it('rejects an untrusted PDF URL', async () => {
    await expect(statements.getFileAccess({ statementId: 'STATEMENT-UNTRUSTED', purpose: 'PREVIEW' }))
      .rejects.toMatchObject({ name: 'DomainError' })
  })
})
