# Acceptance Record

## Status

人工桌面浏览器验收与自动化回归均已完成。本轮使用 Mock 数据验证前端范围；真实供应商、UAT 和生产接口仍按后端依赖边界另行联调。

## Confirmed browser matrix

| Item | Proposed value | Status |
|---|---|---|
| Browser | Google Chrome stable | Confirmed and tested |
| Browser version | 151.0.7922.76 | Confirmed and tested |
| Operating system | macOS 26.4.1 (Build 25E253) | Confirmed and tested |
| Desktop viewport | 1440 × 900 CSS pixels | Confirmed and tested |

确认来源：用户在 2026-08-11 对推荐矩阵回复“开始”，随后按该矩阵完成验收。

## Automated evidence (2026-08-11)

| Check | Result | Evidence |
|---|---|---|
| ESLint | PASS | `npm run lint` |
| Unit/integration components | PASS | 25 suites, 67 tests via `npm run test:unit` |
| Mock production build | PASS | `npm run build:mock` |
| API production build | PASS | `npm run build:api` |
| API provider isolation | PASS | API bundle contains no approved Mock account, Mock registration key, or Mock product fixture name |
| Locale structure | PASS | locale parity test covers zh-Hans / zh-Hant / en |
| Financial submit safety | PASS | validation, double-submit, stable key, conflict and unknown-result tests |
| PDF safety | PASS | available/failed/expired/trusted-reference tests and valid one-page anonymous fixture |
| Performance | PASS | 500-row filter/pagination under 200ms; largest async JS chunk 498.71 KiB |

## Manual acceptance results (2026-08-11)

按 `specs/001-hk-international-frontend/quickstart.md` 执行并逐项记录：

- [x] AC-001～AC-003：待审核账户被拒绝登录；已批准账户登录成功；注册只返回人工审核回执；退出后受保护 `/statements` 跳转登录并在批准登录后安全回跳。
- [x] AC-004～AC-007：基金列表、关键词筛选和重置通过；产品到交易入口、最低金额校验、风险确认、内部指令受理和交易记录回查通过；赎回、双击、稳定幂等键和未知结果由同版本自动化用例补充验证。
- [x] AC-008～AC-010：USD/HKD 分币种持仓、八种内部指令状态、原因文案及新提交记录通过；查询清空和错误态由组件/集成测试补充验证。
- [x] AC-011～AC-013：分红列表、账单状态、仅可用 PDF 可操作、匿名一页 PDF 预览及打印入口通过；过期/失败/可信引用由自动化补充验证。
- [x] AC-014～AC-016：账户信息、个人中心、简中/繁中/英文即时切换、标签同步翻译及本地 Mock 退出通过。
- [x] AC-017～AC-018：帮助列表、无结果、清除筛选、全文弹窗和静态联系方式通过。
- [x] SC-001～SC-010：范围、路由保护、性能、安全、API 无 Mock 回退、构建与文件生命周期证据通过。
- [x] 已在当前验收会话保留简中、繁中、英文关键页面截图，并记录浏览器、系统和视口证据。

## Acceptance fixes found and closed

- 英文模式的多页标签曾保留中文标题；已改为按 `titleKey` 实时翻译，并在简中、繁中和英文复测通过。
- Mock 退出曾因 token 前缀判断错误而误调真实退出接口，并出现中文系统错误；已改为显式数据模式判断，英文确认文案及退出复测通过。
- Mock 交易记录曾回退显示基金代码；已在服务适配器补齐三语基金名称并增加回归测试。

## Known verification constraints

- 本机没有 `.nvmrc` 指定的 Node 16.20.2，自动化验证实际运行于 Node 22.17.0；正式 CI 应在 Node 16 复跑。
- 公司私有 `@jiyu/core@1.1.4` 注册源当前不可访问；本地验证使用临时最小兼容替身，产品源码和 `package-lock.json` 仍指向正式私有包。
- 真实 `bus-jgt-intl`、Allfunds、UAT 和生产发布不属于本次前端 Mock 验收。
