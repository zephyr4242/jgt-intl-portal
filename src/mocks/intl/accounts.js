export const organizationAccount = {
  organizationId: 'org-demo-001',
  organizationName: '国际机构演示账户',
  organizationNameI18n: {
    'zh-Hans': '国际机构演示账户',
    'zh-Hant': '國際機構演示賬戶',
    en: 'International Demo Institution'
  },
  customerNo: 'CUST•••0001',
  accountStatus: 'ACTIVE',
  openedOn: '2024-01-15',
  contactName: '演示联系人',
  contactNameI18n: {
    'zh-Hans': '演示联系人',
    'zh-Hant': '演示聯繫人',
    en: 'Demo Contact'
  },
  contactEmail: 'co***@example.test',
  contactMobile: '+852 **** 8801',
  tradeAccounts: [
    {
      tradeAccountId: 'TA-HK-001',
      accountNoMasked: 'HK•••0001',
      accountName: '香港交易账户',
      accountNameI18n: {
        'zh-Hans': '香港交易账户',
        'zh-Hant': '香港交易賬戶',
        en: 'Hong Kong Trading Account'
      },
      status: 'ACTIVE',
      supportedCurrencies: ['HKD', 'USD']
    },
    {
      tradeAccountId: 'TA-SG-002',
      accountNoMasked: 'SG•••0002',
      accountName: '新加坡交易账户',
      accountNameI18n: {
        'zh-Hans': '新加坡交易账户',
        'zh-Hant': '新加坡交易賬戶',
        en: 'Singapore Trading Account'
      },
      status: 'ACTIVE',
      supportedCurrencies: ['USD']
    }
  ]
}

export const operatorProfile = {
  operatorId: 'operator-demo-001',
  name: '演示操作员',
  nameI18n: {
    'zh-Hans': '演示操作员',
    'zh-Hant': '演示操作員',
    en: 'Demo Operator'
  },
  email: 'op***@example.test',
  mobileMasked: '+852 **** 6618',
  certificateNoMasked: 'P••••••6618',
  locale: 'zh-Hans',
  organizationId: 'org-demo-001'
}
