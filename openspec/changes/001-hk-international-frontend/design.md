## Context

实施基线为 `jgt-intl-portal@63b42dd311e73becbcce362c56ba870a1c1f0aa2`。现有 `src/libs/intl-biz.js` 已有 Mock/API 分支雏形，但认证与业务共用 `VUE_APP_DEMO_AUTH`，`.env.demo` 又由其他开关控制，可能形成半 Mock/半 API。多数正式业务路由未设置 `meta.auth`；Demo 注册会直接写当前用户；交易 API 每次生成新的 `X-Request-Id`，无法表达同一业务意图的幂等重试。

批准的上游设计位于 `/Users/wpx/Desktop/个人发明/香港基构通/specs/001-hk-international-frontend/`，本 OpenSpec 不改变其业务范围。

## Goals / Non-Goals

**Goals:**

- 在现有 Vue 2 工程完成 12 个正式页面/功能入口和 18 个验收场景
- Mock/API 共用领域模型、页面逻辑、错误和状态，Mock 可独立验收
- 注册经人工审核后才允许登录，全部业务页受保护
- 交易是人工处理的内部指令，防重复并安全处理未知结果
- 三语结构一致，多币种不做无口径合计，PDF 只操作可信有效文件

**Non-Goals:**

- 产品详情、PI、资料索取、开户指引、完整投后、在线工单
- 忘记/重置密码、首次改密、角色权限、设备、换肤
- 真实 `bus-jgt-intl` 改造、Allfunds 直连/UAT、生产域名和发布
- 移动端/平板适配

## Decisions

### 1. 单一业务访问边界

页面只依赖 `@/services/intl`。启动时严格解析 `VUE_APP_DATA_SOURCE=mock|api` 并选择一次 provider。API provider 只调用 `src/api/intl`；Mock provider 只调用匿名 fixture。两者通过共用 contract tests。任何 API 异常只转换为 `DomainError`，不读取 Mock。

不修改共享 `src/plugin/axios`；国际 provider 在外层归一化 raw envelope 和错误，避免影响遗留代码。

### 2. 注册审核与会话

注册只返回 `applicationId/PENDING_REVIEW/submittedAt`，不返回 token。Mock 预置 approved/pending/rejected 账户，新申请固定 pending；正式 UI 不提供自助审批。只有 approved 且凭证正确才建立现有兼容会话。父业务路由统一设置认证要求，并保留安全深链接回跳。

既有 `auth-login-register-security` 中“注册成功自动登录”的行为由本变更替代；忘记密码和首次改密仍存在历史实现，但不进入本期正式路由/入口，也不在本变更扩展。

### 3. 交易幂等

用户确认一次业务意图时生成稳定 `clientRequestId`。HTTP `Idempotency-Key` 在同意图重试时保持不变，`X-Request-Id` 仅追踪单次 attempt。页面同步锁、service 并发锁、Mock key 索引和未来后端原子去重共同组成防重。超时/断网且结果不明映射为 `UNKNOWN` 视图状态，通过 client id 查询记录，不立即生成新 key 重提。

状态统一为 `ACCEPTED/MANUAL_PENDING/PROCESSING/CONFIRMED/PARTIALLY_CONFIRMED/FAILED/CANCELLED`；`UNKNOWN` 是前端安全状态。所有回执明确“内部指令、人工处理、非成交”。

### 4. 数据和页面状态

查询统一返回 `{items,page,pageSize,total}`；页面统一 `idle/loading/success/empty/error`。金额、份额、净值和比例使用十进制字符串。持仓按币种分组；没有可靠汇率时不提供总资产单值。当前语言缺失的帮助内容显示暂缺，不回退其他语言。

### 5. PDF 与联系方式

账单 provider 返回短期可信 PDF 引用；只有 AVAILABLE 且未过期可预览/下载，预览成功后才允许浏览器打印。帮助联系方式来自批准的非敏感本地安全配置，因此 API 搜索失败或无结果时仍可见。

### 6. 配置、测试和可辨识 Mock

添加明确的 Mock/API 启动和构建脚本。Mock 模式全局展示环境标识，API/生产构建不显示。优先测试 provider 契约、审核状态机、路由保护、交易幂等、PDF 状态、三语键和 API 无回退；最终分别执行 lint、unit、build:mock、build:api。

### 7. Excel 批量交易指令

交易页复用仓库现有 `@d2-projects/vue-table-import` 与 `vue-table-export`，在单笔和 Excel 批量两种录入模式间切换。模板包含交易账户、基金代码、方向、金额/份额、币种和备注；解析层兼容三语表头及三语方向值，单文件最多 100 笔。前端先按可交易产品、账户币种、最低申购额和累计可用赎回份额完成整表校验，错误行只能修改源文件后重新导入，全部有效后才允许确认提交。

批量提交不新增不确定的后端聚合契约：API/Mock 均复用现有单笔 `trades.submit`，每行生成独立且稳定的 `clientRequestId/Idempotency-Key`，以受控并发提交并返回逐行 `ACCEPTED/UNKNOWN/FAILED` 结果。未知结果不得立即重提；用户必须先到交易记录按客户端请求号核对。页面同步锁保证一次点击只发起一个批次。

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| Vue 2 与旧依赖工具链老化 | 固定可验证 Node 版本；不做框架大版本升级 |
| 仓库遗留国内代码较多 | 正式路由/菜单白名单化；新页面禁止 legacy API |
| 后端契约未最终确认 | Mock 和 API adapter 遵循前端 OpenAPI；联调前由后端确认 |
| 超时重提形成重复指令 | 稳定幂等键、未知结果回查和非成交提示 |
| PDF URL 过期或跨域 | 可信来源校验、短期引用、失败时停止打印 |
| 批量文件误填或重复点击 | 模板约束、整表预校验、累计份额校验、逐行幂等键与批次提交锁 |

## Migration Plan

1. 先恢复工具链并建立 `src/services/intl`，保留旧 `intl-biz` 兼容转发。
2. 修复认证/路由后，按 US1～US6 逐页迁移；每个故事单独通过 Mock 测试。
3. 全部页面迁移后清理旧 demo 分支和范围外正式入口。
4. 双模式构建、三语和 18 个场景通过后才完成本变更。

## Source of Truth

- 产品范围：`/Users/wpx/Desktop/个人发明/香港基构通/specs/001-hk-international-frontend/spec.md`
- 技术方案：同目录 `plan.md`、`research.md`、`data-model.md`
- 契约：同目录 `contracts/business-access-contract.md`、`contracts/api.openapi.yaml`
- 完整任务：同目录 `tasks.md`（T001～T078）

## Implementation Reconciliation (2026-08-11)

### Implemented against the approved frontend contract

- 页面统一通过 `src/services/intl/index.js` 访问业务能力；`VUE_APP_DATA_SOURCE` 在应用挂载前严格校验，API 生产构建会移除 Mock provider 代码树。
- 注册只生成 `PENDING_REVIEW` 申请；Mock 提供 approved、pending、rejected 三类匿名操作员；全部正式业务路由由父路由统一保护。
- 交易提交使用稳定 `clientRequestId/Idempotency-Key` 与单次 `X-Request-Id`，页面和 Mock provider 均防重；结果未知时保留未决 key，回执不表达成交。
- 已实现产品、持仓、八状态交易记录、分红、账单 PDF、账户信息、个人中心和帮助中心的 API/Mock provider 与正式页面。
- 正式菜单、首页和国际壳层已移除 PI、资料索取、开户指引、完整投后、忘记密码、首次改密、权限和在线工单入口；遗留页面仅保留不可达的兼容编译代码。
- 三语键结构对称；金额与份额保留十进制字符串；持仓不做无汇率跨币种合计；PDF 仅允许可信且未过期引用。

### Verification completed

- `npm run lint`：通过。
- `npm run test:unit`：28 个测试套件、76 个用例通过。
- `npm run build:mock`：通过；Mock 环境标识和匿名验收数据包含在 Mock 构建。
- `npm run build:api`：通过；构建产物扫描未发现 approved Mock 账号、Mock 注册存储键或匿名 Mock 产品名。
- 最大异步 JavaScript 分包为 498.71 KiB，低于 500 KiB 验收阈值。

### Backend and delivery dependencies still open

- `bus-jgt-intl` 真实接口尚未由后端联调确认；当前 API provider 按批准的 `contracts/api.openapi.yaml` 实现，原始 code/envelope 的最终映射需联调后确认。
- `Idempotency-Key` 的真实跨标签、跨实例和超时重试保证必须由后端按操作员与 key 原子去重；前端只能提供稳定 key、按钮锁和安全未知结果提示。
- Allfunds 接入、供应商凭证、订单/成交确认、UAT 与生产发布不在本期完成范围内，浏览器不会直连供应商。
- `src/config/intl-contact.js` 只保存公开业务联系方式；生产发布前仍应由业务负责人再次确认电话、邮箱、地址和服务时间。
- 仓库声明 Node 16.20.2；本机仅有 Node 22.17.0，自动检查在 Node 22 上通过。正式 CI 仍应使用 `.nvmrc` 的 Node 16 执行 `npm ci`。公司私有 `@jiyu/core` 注册源在本机不可用，本次本地验证使用了未写入源码/锁文件的最小临时替身。
- 2026-08-13 已在本地桌面浏览器逐页复验 10 个 canonical 路由；基金全部/HKD/USD 切换和国际壳层无新增运行时错误。

## UI Baseline Reconciliation (2026-08-13)

- 国际门户不再维护独立的全局深色覆盖层；直接复用原仓库 `client` 黑金主题、原字体栈、侧栏背景、顶部标签和 Element UI 组件状态。
- 菜单恢复原基构通信息架构和 canonical 路径：公募基金/基金产品、交易中心/交易下单、我的账户五个子项、个人中心四个子项和帮助中心；旧简化路径仅作为兼容 alias。
- 左上角使用等比缩放的基煜国际图片标识并在原 40px 顶栏垂直居中；登录页继续使用维多利亚港背景和设计稿页脚信息。
- 基金产品页使用原有页签、表单、单选按钮、标签和表格密度；“全部基金 / 港币基金 / 美元基金”均已在浏览器验证，修复了 Element Tabs 空 name 被转换为索引导致二次筛选为空的问题。
- 个人中心按原页面结构展示“我的权限 / 修改密码 / 单据生成记录 / 登录日志”，修改密码页保留原两列资料布局；全部业务页不再硬编码另一套浅色卡片或字体。
- Mock 构建首次启动会将产品、账户、持仓、八状态交易、分红、账单和首页摘要写入版本化本地演示数据库；所有 Mock provider 从该数据库读取，交易提交与语言偏好更新会持久化。API 构建经产物扫描确认不包含数据库键、验收账号或 Mock 基金标识。
- 国际门户会话通过 `portalType: intl` 与兼容的 `INTL` 机构代码识别，统一绕过国内门户专属的“绑定基煜账户”菜单及路由检查；该判断同时兼容修复前已登录的存量会话，不要求用户重新登录。
- 交易下单页新增单笔/Excel批量模式；已在繁体界面实测导入两笔跨 USD/HKD 指令、整表校验、风险确认、逐笔受理并回查交易记录。Excel读写复用原仓库插件源码并共享单一 SheetJS 运行时，构建后最大异步 JavaScript 分包仍为 498.71 KiB。
