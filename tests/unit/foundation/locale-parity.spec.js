import { LANG_OPTIONS, MESSAGES } from '@/locales'

describe('locale parity', () => {
  it('keeps the same keys in Simplified Chinese, Traditional Chinese and English', () => {
    const locales = LANG_OPTIONS.map(item => item.value)
    const expected = Object.keys(MESSAGES[locales[0]]).sort()
    locales.slice(1).forEach(locale => expect(Object.keys(MESSAGES[locale]).sort()).toEqual(expected))
    const required = [
      'mockEnvironmentBadge', 'navMyAccount', 'navTransactions', 'registerPendingTitle',
      'productsTradeBtn', 'tradeAcceptedTitle', 'holdingsTitle', 'dividendsTitle',
      'statementsTitle', 'accountInfoTitle', 'personalCenterTitle', 'helpTitle', 'commonUntitled',
      'tradeModeBatch', 'batchDownloadTemplate', 'batchConfirmSubmit', 'batchUnknownNotice'
    ]
    locales.forEach(locale => required.forEach(key => expect(MESSAGES[locale][key]).toBeTruthy()))
  })
})
