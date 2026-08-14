## Context

门户登录/注册走 `demo-auth`。后端将提供 `/bus/jgt/intl/auth/*`。本设计将前端主路径切换为真实认证，并保留可选演示开关。

## Goals / Non-Goals

**Goals:**
- 登录/注册调用真实 API；密码 RSA 密文上传
- ≥3 次失败展示验证码 UI 并发码；冻结提示
- token 约 30 分钟过期自动登出；请求带 `token` 与 `X-Request-Id`
- 三语文案与代理路径对齐

**Non-Goals:**
- 图形验证码刷新
- 改造演示业务页（产品/交易等）为真实后端
- 忘记密码真实流程（可保持提示）

## Decisions

1. API 前缀改为 `/bus/jgt/intl/auth`（不再用 `/api/intl/auth` 占位）
2. `vue.config.js` 增加 `/bus/jgt/intl` 代理到 `VUE_APP_API`
3. 登录前 `POST public-key` 缓存公钥；`getRsaCode` 优先用缓存
4. 密码登录为主路径；原「手机号验证码登录」可保留为演示或收敛为「增强验证码」流程（失败 ≥3 时在密码登录下展示）
5. 会话：`util.cookies.set('token', token)`，配合本地过期时间戳或依赖后端过期码
6. `VUE_APP_DEMO_AUTH=true` 时仍走 demo-auth；默认 false/未设置走真实

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| 后端未起导致无法登录 | 文档说明联调步骤；演示开关回退 |
| cookie 实现实际为 localStorage | 保持现有 util.cookies，增加 expires 语义或并行写 expireAt |

## Migration Plan

- 默认切真实；演示环境显式打开 `VUE_APP_DEMO_AUTH`
