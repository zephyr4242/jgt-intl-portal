## ADDED Requirements

### Requirement: 真实登录注册接线
门户 MUST 默认调用 `bus-jgt-intl` 的 `/bus/jgt/intl/auth/*` 完成登录与注册；密码 MUST 使用后端公钥 RSA 加密后提交。

#### Scenario: 密码登录成功
- **WHEN** 用户提交正确邮箱与密码且无需验证码
- **THEN** 写入 token（约 30 分钟有效）并进入工作台

#### Scenario: 注册成功
- **WHEN** 用户提交合法注册信息
- **THEN** 调用 register，成功后自动登录进入工作台

### Requirement: 增强验证码 UI
当登录响应指示 needAuthCode 或等价业务码时，页面 MUST 展示验证码输入与获取验证码（60s 倒计时）；再次登录 MUST 携带 authCode 与 authCodeToken。

#### Scenario: 获取验证码
- **WHEN** 用户点击获取验证码且后端成功
- **THEN** Toast 提示已发送至脱敏手机与邮箱，并开始 60s 倒计时

#### Scenario: 账号冻结
- **WHEN** 后端返回冻结
- **THEN** 页面提示联系管理员，不进入系统

### Requirement: 过期登出与防重
当后端返回 token 无效/过期业务码时，前端 MUST 清理会话并跳转 `/elogin`；登录/注册/发码请求 MUST 带 loading，并携带 `X-Request-Id`。

#### Scenario: token 过期
- **WHEN** 已登录用户在 token 过期后请求受保护接口
- **THEN** 自动登出并回到登录页
