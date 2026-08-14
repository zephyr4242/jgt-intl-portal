## Context

对齐截图三步步骤条与国内 forgetPwd 交互，字段按国际门户改为姓名/公司/手机/邮箱（非证件号）。

## Goals / Non-Goals

**Goals:**
- 登录页可完成完整重置闭环
- 发码前校验四要素；验证码通过后再展示设密页
- 新密码 RSA 加密提交；规则提示与注册一致
- 强制三语

**Non-Goals:**
- 不改交易密码重置
- 不改 axios 全局封装

## Decisions

1. **独立弹窗组件** `ForgotPwdDialog`，不复用国内 `forgetPwd.vue`（字段与 API 不同）
2. **步骤**：0 身份+发码+填码 → verify → 1 设密 → reset → 2 成功回登录
3. **Demo**：`isDemoAuthEnabled()` 时跳过真实接口，便于无后端 UI 验收
4. **姓名**：与注册 `contactName`→`name` 对齐

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| 用户填错姓名导致匹配失败 | 文案使用「姓名」= 注册联系人；统一错误提示 |

## Migration Plan

- 无路由变更；默认真实 API
