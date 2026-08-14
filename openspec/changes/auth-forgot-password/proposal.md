## Why

登录页「忘记密码」需提供自助重置：身份四要素 + 双通道验证码 + 设新密码三步弹窗，对接 `bus-jgt-intl` forgot API。原先 `onForgot` 仅提示「功能暂未开通」。

> 说明：本 change 在代码落地后补齐 OpenSpec（事后归档），后续大需求须先提案再编码。

## What Changes

- 新增 `ForgotPwdDialog.vue`：三步（身份验证 → 设新密码 → 成功），字段为姓名/公司/手机/邮箱/验证码
- `LoginForm.vue` 忘记密码入口打开弹窗
- `src/api/intl/login.js` 增加 `forgotSendCode` / `forgotVerifyCode` / `forgotResetPassword`
- 三语文案（zh-Hans / zh-Hant / en）
- `VUE_APP_DEMO_AUTH=true` 时本地模拟三步，不请求后端

## Capabilities

### New Capabilities

- `portal-auth-forgot`：忘记密码三步 UI、API 接线、RSA 新密码、倒计时发码、三语

### Modified Capabilities

- `portal-auth-wire`：登录页忘记密码入口由占位改为真实弹窗

## Impact

- 页面：`LoginForm.vue`、`dialogs/ForgotPwdDialog.vue`
- API：`src/api/intl/login.js`
- i18n：`src/locales/index.js`
- 联调依赖：后端 change `auth-forgot-password`
