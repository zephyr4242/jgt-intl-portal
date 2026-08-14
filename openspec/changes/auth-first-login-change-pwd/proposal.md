## Why

一体化后台创建的操作员首次登录国际前台时，账密通过后需弹窗引导修改初始密码；改密成功后重新登录。取消则取消本次登录。客户自助注册账号不触发。

## What Changes

- 登录成功响应若 `needChangePwd=true`：不写登录态、不跳转首页；打开「设置登录密码」弹窗（对齐截图：黄条提示 + 双输入 + 规则提示）
- 确定：RSA 加密新密码 → 调 `first-login/change-pwd` → 成功提示后留在登录页重新登录
- 取消：关闭弹窗，丢弃 `changePwdToken`，取消本次登录
- API：`firstLoginChangePwd`；三语文案
- Demo 模式可模拟 needChangePwd 分支（可选）

## Capabilities

### New Capabilities

- `portal-auth-first-login-pwd`：首次登录改密弹窗、登录衔接、改密 API、取消=取消登录

### Modified Capabilities

- `portal-auth-wire`：`LoginForm` 登录成功分支增加 needChangePwd 处理

## Impact

- 页面：`LoginForm.vue`、新建 `FirstLoginChangePwdDialog.vue`（或复用/改造现有 `ResetPwd.vue`）
- API：`src/api/intl/login.js`
- i18n：`src/locales/index.js`
- 联调：后端 change `auth-first-login-change-pwd`
