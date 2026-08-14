export default {
  path: '/orgManage',
  title: '机构管理',
  id: '1385071203459006477',
  icon: 'jigouguanli',
  children: ([
    { path: '/org-info/org-list', title: '机构账户信息', icon: 'logo', id: '1385071203459006478' },
    { path: '/account-info', title: '在线开户管理', icon: 'logo', id: '1393409255594299394' },
    { path: `/org-manage/jy-account`, title: '基煜账户管理', icon: 'logo', id: '1385071203459006479' },
    { path: `/org-manage/user-info`, title: '操作员信息管理', icon: 'logo', id: '1385071203459006480' },
    { path: `/org-manage/user-rights`, title: '操作员权限管理', icon: 'logo', id: '1385071203459006481' },
    // { path: `/3`, title: '消息订阅管理', id: '1385071203459006482' },
    { path: '/org-manage/role-manage', title: '角色管理', icon: 'logo', id: '1385071203459006483' },
    { path: `/org-manage/category`, title: '品类及限额管理', icon: 'logo', id: '1385071203459006484' },
    { path: `/org-manage/credit`, title: '授信管理', icon: 'logo', id: '1385071203459006485' },
    { path: `/org-manage/trade-records`, title: '交易记录', icon: 'logo', id: '1385071203459006486' },
    { path: `/org-manage/position`, title: '账户持仓', icon: 'logo', id: '1385071203459006487' },
    { path: `/org-manage/log`, title: '操作日志管理', icon: 'logo', id: '1385071203459006488' }
  ])
}
