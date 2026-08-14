// 国际门户菜单沿用基构通原有的信息架构、图标和层级，仅裁剪本期范围。
function getMenu () {
  return [
    { path: '/index', titleKey: 'navHome', icon: 'shouye', id: '1385071203408674817' },
    {
      path: '/fund',
      titleKey: 'navPublicFunds',
      icon: 'gongmu',
      id: '1385071203408674818',
      children: [
        { path: '/fund/product/list', titleKey: 'navProducts', icon: 'logo', id: '1385071203408674820' }
      ]
    },
    {
      path: '/trade-info',
      titleKey: 'navTradeCenter',
      icon: 'jiaoyizhongxin',
      id: '1385071203408674829',
      children: [
        { path: '/trade-info/aggregation/index', titleKey: 'navTrade', icon: 'logo', id: '1453625743562945000' }
      ]
    },
    {
      path: '/account',
      titleKey: 'navMyAccount',
      icon: 'wodezhanghu',
      id: '1385071203408674832',
      children: [
        { path: '/account/my-assets', titleKey: 'navHoldings', icon: 'logo', id: '1385071203459006466' },
        { path: '/account/trade-records', titleKey: 'navTransactions', icon: 'logo', id: '1385071203459006467' },
        { path: '/account/dividend-records', titleKey: 'navDividends', icon: 'logo', id: '1385071203459006468' },
        { path: '/account/bill', titleKey: 'navStatements', icon: 'logo', id: '1385071203459006471' },
        { path: '/account/list', titleKey: 'navAccountInfo', icon: 'logo', id: '1385071203459006472' }
      ]
    },
    {
      path: '/personal-center',
      titleKey: 'navPersonalCenter',
      icon: 'gerenzhongxin',
      id: '1385071203459006474',
      children: [
        { path: '/personal-center/my-permission', titleKey: 'navMyPermission', icon: 'logo', id: '1385071203459006475' },
        { path: '/personal-center/password-edit', titleKey: 'navPasswordEdit', icon: 'logo', id: '1385071203459006476' },
        { path: '/personal-center/download-records', titleKey: 'navDocumentRecords', icon: 'logo', id: '1453625743562944513' },
        { path: '/personal-center/login-logs', titleKey: 'navLoginLogs', icon: 'logo' }
      ]
    },
    { path: '/help-center', titleKey: 'navHelpCenter', icon: 'kefuxinxi' }
  ]
}

export default getMenu
