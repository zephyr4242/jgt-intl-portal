## Why

现有国际门户已有 Vue 2 页面骨架，但仍是演示范围：注册成功直接登录、业务路由未统一保护、Mock/API 使用多个开关且数据形状不一致，交易只做界面 loading 而没有稳定幂等语义；分红、账单、账户信息、个人中心和帮助中心也不完整。需要在现有工程内收敛为可独立 Mock 验收、未来可直接接 API 的国际业务门户一期。

## What Changes

- 保留 Vue 2、Vue Router、Vuex、Element UI、D2 Admin 和现有国际布局，不新建工程
- 以 `VUE_APP_DATA_SOURCE=mock|api` 显式选择统一业务 provider；API 失败禁止回退 Mock
- 注册改为提交申请并等待人工审核，只有批准账户可登录；保护首页及全部业务路由
- 正式范围：首页、登录、注册、基金产品列表、申购/赎回内部指令、持仓、交易记录、分红、账单、账户信息、个人中心、帮助中心
- 产品列表只提供“去交易”，没有产品详情或资料索取
- 交易同时支持单笔录入和 Excel 批量导入；增加模板下载、导入校验、明细预览、确认弹窗、稳定幂等键、结果未知回查及非成交语义
- 账单支持可信 PDF 预览、下载、浏览器打印与失效处理
- 所有新增文案覆盖 zh-Hans / zh-Hant / en；Mock 数据匿名且有可辨识环境标志
- 恢复最小 Jest/Vue Test Utils 能力，分别验证 Mock/API 构建

## Capabilities

### New Capabilities

- `portal-runtime-boundary`：显式 Mock/API provider、规范化领域数据/错误、生产无回退
- `portal-admission`：注册申请、人工审核态、批准登录、路由保护和安全退出
- `portal-product-trade`：产品筛选到申购/赎回内部指令，含幂等和未知结果
- `portal-account-records`：持仓、交易、分红、账单、机构账户和操作员资料
- `portal-help-i18n`：三语帮助、指南、联系方式和全局国际品牌

### Modified Capabilities

- `portal-auth-wire`：注册成功不再自动登录；`VUE_APP_DEMO_AUTH` 被单一数据源配置替代
- `portal-auth-i18n-proxy`：保留 `/bus/jgt/intl/*` 代理，扩展为全门户三语与运行模式

## Impact

- 页面：`src/views/home`、`src/views/system/elogin`、`src/views/system/eregister`、`src/views/business/*`
- 业务边界：新增 `src/services/intl` 与 `src/mocks/intl`
- API：正式接口只新增到 `src/api/intl`，不使用 `legacy`
- 路由/菜单：`src/router`、`src/menu/aside.js`
- 状态/三语：`src/store`、`src/locales/index.js`
- 配置/测试：`.env.*`、`package.json`、`tests/`
- 后端、Allfunds 和生产发布不在本变更实现范围；OpenAPI 仅为前端期望契约
