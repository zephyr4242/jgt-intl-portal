import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { path: '/elogin' },
    component: layoutHeaderAside,
    meta: { auth: true },
    children: [
      {
        path: 'index',
        name: 'index',
        meta: { title: '工作台', titleKey: 'wbTitle' },
        component: _import('home/index')
      },
      {
        path: 'fund/product/list',
        alias: '/products',
        name: 'products',
        meta: { title: '基金产品', titleKey: 'navProducts', menuPath: '/fund/product/list' },
        component: _import('business/products')
      },
      {
        path: 'trade-info/aggregation/index',
        alias: '/trade',
        name: 'trade',
        meta: { title: '交易下单', titleKey: 'navTrade', menuPath: '/trade-info/aggregation/index' },
        component: _import('business/trade')
      },
      {
        path: 'account/my-assets',
        alias: '/holdings',
        name: 'holdings',
        meta: { title: '我的持仓', titleKey: 'navHoldings', menuPath: '/account/my-assets' },
        component: _import('business/holdings')
      },
      {
        path: 'account/trade-records',
        alias: '/transactions',
        name: 'transactions',
        meta: { title: '交易记录', titleKey: 'navTransactions', menuPath: '/account/trade-records' },
        component: _import('business/transactions')
      },
      {
        path: 'account/dividend-records',
        alias: '/dividends',
        name: 'dividends',
        meta: { title: '分红记录', titleKey: 'navDividends', menuPath: '/account/dividend-records' },
        component: _import('business/dividends')
      },
      {
        path: 'account/bill',
        alias: '/statements',
        name: 'statements',
        meta: { title: '账单打印', titleKey: 'navStatements', menuPath: '/account/bill' },
        component: _import('business/statements')
      },
      {
        path: 'account/list',
        alias: '/account-info',
        name: 'accountInfo',
        meta: { title: '账户信息', titleKey: 'navAccountInfo', menuPath: '/account/list' },
        component: _import('business/account-info')
      },
      {
        path: 'personal-center',
        redirect: { path: '/personal-center/my-permission' }
      },
      {
        path: 'personal-center/my-permission',
        name: 'personalCenterMyPermission',
        meta: { title: '我的权限', titleKey: 'navMyPermission', personalSection: 'permission', menuPath: '/personal-center/my-permission' },
        component: _import('business/personal-center')
      },
      {
        path: 'personal-center/password-edit',
        name: 'personalCenterPasswordEdit',
        meta: { title: '修改密码', titleKey: 'navPasswordEdit', personalSection: 'password', menuPath: '/personal-center/password-edit' },
        component: _import('business/personal-center')
      },
      {
        path: 'personal-center/download-records',
        name: 'personalCenterDocumentRecords',
        meta: { title: '单据生成记录', titleKey: 'navDocumentRecords', personalSection: 'documents', menuPath: '/personal-center/download-records' },
        component: _import('business/personal-center')
      },
      {
        path: 'personal-center/login-logs',
        name: 'personalCenterLoginLogs',
        meta: { title: '登录日志', titleKey: 'navLoginLogs', personalSection: 'loginLogs', menuPath: '/personal-center/login-logs' },
        component: _import('business/personal-center')
      },
      {
        path: 'help-center',
        name: 'helpCenter',
        meta: { title: '帮助中心', titleKey: 'navHelpCenter', menuPath: '/help-center' },
        component: _import('business/help-center')
      },
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  {
    path: '/elogin',
    name: 'elogin',
    component: _import('system/elogin')
  },
  {
    path: '/eregister',
    name: 'eregister',
    component: _import('system/eregister')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

export const frameInRoutes = frameIn

export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
