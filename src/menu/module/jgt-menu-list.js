import orgManage from './org-manage'
// 通用方法注册
var linkPath = process.env.NODE_ENV === 'production' ? window.CONFIG.VUE_APP_LINK_PATH : process.env.VUE_APP_LINK_PATH

export default
[
  { path: '/index', title: '首页', icon: 'shouye', id: '1385071203408674817' },
  {
    path: '/fund',
    title: '公募基金',
    id: '1385071203408674818',
    icon: 'gongmu',
    children: ([
      { path: '/fund/product/list', whitePath: `${linkPath}/oper/fund/list`, title: '基金产品', icon: 'logo', id: '1385071203408674820' },
      { path: '/fund/company/list', whitePath: `${linkPath}/oper/fund/company/list`, title: '基金公司', icon: 'logo', id: '1385071203408674819' },
      { path: `${window.CONFIG.JGT_ADVISER}`, title: '基金投顾', icon: 'logo', id: '1385071203420221026' },
      { path: '/fund/market', whitePath: `${linkPath}/oper/fund/market`, title: '市场概况', icon: 'logo', id: '1385071203408674821' },
      { path: `/fund/recommond`, whitePath: `${linkPath}/oper/fund/recommond`, title: '基煜精选', icon: 'logo', id: '1385071203408674822' }
      // { path: `${window.CONFIG.JGT_PPI_PORT}`, title: '基金投后', icon: 'logo', id: '1853325732562145281' }
    ])
  },
  {
    path: '/bmis',
    title: '资管计划',
    id: '1385071203408674826',
    icon: 'quanshangziguan',
    children: ([
      { path: '/bmis/recommend', title: '热门推荐', icon: 'logo', id: '2009542646690533378' },
      { path: '/bmis/product/list', whitePath: `${linkPath}/oper/bmis/list`, title: '资管产品', icon: 'logo', id: '1385071203408674827' }
      // { path: `/bmis/company/list`, whitePath: `${linkPath}/oper/bmis/company/list`, title: '资管公司', icon: 'logo', id: '1385071203408674828' }
    ])
  },
  {
    path: '/private',
    title: '私募基金',
    id: '1591985206420156418',
    icon: 'simu',
    children: ([
      { path: '/private/product/list', title: '私募产品', icon: 'logo', id: '1591985206483070978' },
      { path: `/private/company/list`, title: '私募公司', icon: 'logo', id: '1591985206483070979' }
    ])
  },
  {
    path: '/ir',
    title: '投研资讯',
    id: '1385071203408674823',
    icon: 'touyanzixun',
    children: ([
      { path: '/ir/report-list', whitePath: `${linkPath}/oper/report/list`, title: '研究报告', icon: 'logo', id: '1385071203408674824' },
      { path: '/ir/manager', title: '基金经理', icon: 'logo', id: '1385071203408674825' }
    ])
  },
  {
    path: '/trade-info',
    title: '交易中心',
    id: '1385071203408674829',
    icon: 'jiaoyizhongxin',
    children: ([
      { path: '/trade-info/aggregation/index', title: '交易下单', icon: 'logo', id: '1453625743562945000' },
      { path: '/trade-info/purchase-list', whitePath: `${linkPath}/oper/account/purchase-list`, title: '预购清单', icon: 'logo', id: '1385071203408674830' },
      { path: '/trade-info/audit-list', whitePath: `${linkPath}/oper/account/audit-list`, title: '复核列表', icon: 'logo', id: '1385071203408674831' }
    ])
  },
  {
    path: '/account',
    title: '我的账户',
    id: '1385071203408674832',
    icon: 'wodezhanghu',
    children: ([
      { path: `/account/overview`, title: '账户总览', icon: 'logo', id: '1385071203408674833' },
      { path: `/account/optional-list`, whitePath: `${linkPath}/oper/account/optional-list`, title: '自选产品', icon: 'logo', id: '1385071203408674834' },
      { path: `/account/my-assets`, title: '我的持仓', icon: 'logo', id: '1385071203459006466' },
      { path: `/account/trade-records`, title: '交易记录', icon: 'logo', id: '1385071203459006467' },
      { path: `/account/dividend-records`, whitePath: `${linkPath}/oper/account/dividend-list`, title: '分红记录', icon: 'logo', id: '1385071203459006468' },
      { path: `/account/notice-setting`, whitePath: `${linkPath}/oper/account/notification-edit`, title: '通知设置', icon: 'logo', id: '1385071203459006469' },
      { path: `/account/credit-list`, whitePath: `${linkPath}/oper/account/credit-list`, title: '授信材料', icon: 'logo', id: '1385071203459006470' },
      { path: `/account/bill`, whitePath: `${linkPath}/oper/account/statement`, title: '账单打印', icon: 'logo', id: '1385071203459006471' },
      { path: `/account/list`, title: '账户信息', icon: 'logo', id: '1385071203459006472' },
      { path: `/account/contract`, title: '电子合同', icon: 'logo', id: '1385071203459006473' }
    ])
  },
  {
    path: '/personal-center',
    title: '个人中心',
    id: '1385071203459006474',
    icon: 'gerenzhongxin',
    children: ([
      { path: `/personal-center/my-permission`, title: '我的权限', icon: 'logo', id: '1385071203459006475' },
      { path: `/personal-center/password-edit`, title: '修改密码', icon: 'logo', id: '1385071203459006476' },
      { path: `/personal-center/download-records`, title: '单据生成记录', icon: 'logo', id: '1453625743562944513' }
    ])
  },
  orgManage

]
