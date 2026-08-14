## Context

国际登录页已接 `userLogin`；忘记密码弹窗可作 UI/密码规则参考。遗留 `dialogs/ResetPwd.vue` 依赖国内 `passwordReset`，需新建国际契约弹窗或改造。

## Goals / Non-Goals

**Goals:**

- 账密通过且 `needChangePwd` 时弹「设置登录密码」
- 确定改密成功 → 提示重新登录，不自动进首页
- 取消 → 取消本次登录（无 token、不跳转）
- 密码规则与注册/忘记密码一致（8–16、两类字符、禁空格）

**Non-Goals:**

- 不接国内 `passwordReset`
- 不实现「取消后继续进系统」

## Decisions

1. **登录分支**：`userLogin` 返回 `needChangePwd` 时调用 `establishAuthSession` **之前**拦截；仅把 `changePwdToken` 交给弹窗。
2. **弹窗**：样式对齐产品截图（黄条「由于您的账户首次登录…」+ 双密码框 + 规则 tip + 确定/取消）。
3. **取消**：`visible=false`，清空 token 与输入；父组件不写 cookie/store。
4. **成功**：message 提示成功并请重新登录；关闭弹窗；可清空密码输入框便于重登。

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| 误把 needChangePwd 当成功登录 | 明确分支在 establishAuthSession 前 |
| 与忘记密码弹窗样式不一致 | 复用国际登录主题色与 ForgotPwd 规则 tip 模式 |

## Migration Plan

- 随后端同发；无本地存储迁移
