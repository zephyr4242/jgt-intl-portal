## Why

门户登录/注册仍使用 `demo-auth`，无法对接后端安全认证。需替换为真实 API：拉公钥 RSA 加密密码、失败增强验证码 UI、30 分钟 token、过期自动登出、防重提交，并补齐三语文案与开发代理。

## What Changes

- `src/api/intl/login.js` 对齐 `/bus/jgt/intl/auth/*`（含 `getPublicKey`、`sendAuthCode`、`register`、`login`、`logout`、`userInfo`）
- `LoginForm.vue` / `eregister/index.vue` 接真实接口；可选 `VUE_APP_DEMO_AUTH=true` 保留演示，**默认真实**
- 登录前拉公钥并缓存；`util.getRsaCode` 使用动态公钥
- 失败 `needAuthCode` 时展示验证码输入 + 60s 倒计时发码；冻结提示联系管理员
- cookie/localStorage `token` TTL 约 30 分钟；axios 过期码 → logout → `/elogin`
- 登录/注册/发码：loading + `X-Request-Id`
- 开发代理增加 `/bus/jgt/intl` → `localhost:8090`；三语文案更新

## Capabilities

### New Capabilities

- `portal-auth-wire`：真实登录注册接线、RSA、验证码 UI、会话与过期登出、防重
- `portal-auth-i18n-proxy`：三语文案与代理路径对齐

### Modified Capabilities

- 无独立既有 openspec spec；行为上替换 demo-auth 主路径

## Impact

- 页面：`src/views/system/elogin/LoginForm.vue`、`eregister/index.vue`
- API：`src/api/intl/login.js`
- 工具：`src/libs/util.js`（RSA 公钥）、`util.cookies` / account store / axios 拦截
- 配置：`.env.development`、`vue.config.js` 代理、`src/locales/index.js`
- 联调依赖：`bus-jgt-intl` 同名 change 后端就绪
