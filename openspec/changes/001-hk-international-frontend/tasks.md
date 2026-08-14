## 1. Gate and Foundation

- [x] 1.1 确认本 proposal/design/spec 与批准的 PM/Spec Kit 产物一致
- [x] 1.2 固定 Node/依赖并恢复 lint、unit、Mock/API 双模式命令
- [x] 1.3 建立统一 provider、领域/错误归一化、Mock 场景、三语与受保护路由

## 2. Admission and Core Trade

- [x] 2.1 完成注册审核、批准登录、会话失效/退出和首页摘要
- [x] 2.2 完成产品筛选、“去交易”预选、申购/赎回校验、确认和幂等提交
- [x] 2.3 完成持仓与八状态交易记录，确保多币种和非成交语义正确
- [x] 2.4 完成 Excel 交易模板、三语导入、逐行/累计校验、明细预览和批量幂等提交

## 3. Account Services and Help

- [x] 3.1 完成分红记录与账单 PDF 预览/下载/打印/失效处理
- [x] 3.2 完成只读账户信息、个人中心、语言偏好和退出
- [x] 3.3 完成 FAQ、指南、搜索、分类和持续联系方式

## 4. Convergence

- [x] 4.1 清理范围外入口、国内品牌和旧页面 Mock/API 分支
- [x] 4.2 通过 lint、unit、Mock/API 双构建、安全/性能和三语检查
- [x] 4.3 按完整任务清单 T001～T078 执行 AC-001～AC-018、SC-001～SC-010 并记录证据（Chrome 151.0.7922.76 / macOS 26.4.1 / 1440×900）
- [x] 4.4 以原 account-portal 为唯一视觉基线，恢复 client 黑金主题、200px 侧栏、原菜单层级/图标、顶部标签栏和 Element 筛选表格组件，并完成基金币种切换浏览器回归
- [x] 4.5 建立仅 Mock 构建启用的本地演示数据库，首次启动写入产品、账户、持仓、交易、分红和账单数据，并验证新增交易刷新后仍保留
- [x] 4.6 为国际门户会话补充稳定身份标记，并绕过国内版“未绑定基煜账户”路由拦截；验证存量会话可从侧栏进入我的持仓且正常显示 Mock 数据

> 完整任务、依赖和文件路径以 `/Users/wpx/Desktop/个人发明/香港基构通/specs/001-hk-international-frontend/tasks.md` 为准；本文件用于仓库内 OpenSpec 状态汇总。
