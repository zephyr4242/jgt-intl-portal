## 1. API 与工具

- [x] 1.1 改造 `src/api/intl/login.js` 对接 `/bus/jgt/intl/auth/*`（public-key/send-auth-code/register/login/logout/user-info）
- [x] 1.2 `util.getRsaCode` 支持动态公钥缓存；新增拉公钥辅助方法
- [x] 1.3 请求增加 `X-Request-Id`（登录/注册/发码）；token 写入支持约 30 分钟过期语义

## 2. 登录注册页面

- [x] 2.1 `LoginForm.vue` 接真实登录；needAuthCode 时展示验证码+倒计时发码；冻结提示
- [x] 2.2 `eregister/index.vue` 接真实注册（密码规则校验 + RSA）；成功自动登录
- [x] 2.3 可选 `VUE_APP_DEMO_AUTH`：true 走 demo-auth，默认真实接口
- [x] 2.4 axios 识别 token 过期业务码 → logout → `/elogin`

## 3. i18n 与代理

- [x] 3.1 `src/locales/index.js` 补充三语：验证码已发送（脱敏）、冻结、密码规则、发码频繁等
- [x] 3.2 `vue.config.js` 增加 `/bus/jgt/intl` 代理；核对 `.env.development`

## 4. 验证

- [ ] 4.1 与后端联调：注册、登录、3 次验证码、10 次冻结、过期登出、CORS/代理
- [ ] 4.2 `npm run lint` 修复本变更相关告警
