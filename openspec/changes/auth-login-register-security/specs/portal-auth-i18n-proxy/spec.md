## ADDED Requirements

### Requirement: 三语文案
系统 MUST 为验证码已发送、倒计时、冻结、密码规则、发码频繁等关键提示提供 zh-Hans / zh-Hant / en 文案。

#### Scenario: 切换语言
- **WHEN** 用户在登录页切换语言
- **THEN** 验证码与冻结相关提示使用对应语言文案

### Requirement: 开发代理对齐
开发环境 MUST 将 `/bus/jgt/intl` 代理到 `VUE_APP_API`（默认 localhost:8090），使浏览器同源调用后端 auth 接口。

#### Scenario: 代理联调
- **WHEN** 前端开发服务请求 `/bus/jgt/intl/auth/public-key`
- **THEN** 请求被代理到后端并返回公钥
