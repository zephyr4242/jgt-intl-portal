## ADDED Requirements

### Requirement: 忘记密码三步弹窗
系统 MUST 在登录页提供忘记密码入口，打开三步弹窗：身份验证、设置新密码、重置成功。

#### Scenario: 打开弹窗
- **WHEN** 用户点击「忘记密码」
- **THEN** 展示步骤条与身份表单（姓名、公司名称、手机号、邮箱、验证码）

#### Scenario: 获取验证码
- **WHEN** 四要素校验通过并点击获取验证码
- **THEN** 调用 forgot/send-code；成功后开始倒计时并保存 authCodeToken

#### Scenario: 进入设密步骤
- **WHEN** 用户提交正确验证码
- **THEN** 调用 forgot/verify-code，保存 resetToken，进入设置新密码步骤

#### Scenario: 重置成功
- **WHEN** 用户提交合规新密码（RSA 密文）
- **THEN** 调用 forgot/reset，展示成功页并可返回重新登录

### Requirement: 三语文案
忘记密码相关用户可见文案 MUST 覆盖 zh-Hans / zh-Hant / en。

#### Scenario: 切换语言
- **WHEN** 用户切换界面语言
- **THEN** 弹窗标题、步骤、字段、按钮与校验提示同步切换
