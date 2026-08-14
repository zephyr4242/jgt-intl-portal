## ADDED Requirements

### Requirement: 首次登录改密弹窗
系统 MUST 在登录响应 `needChangePwd=true` 时展示「设置登录密码」弹窗，包含双密码输入与规则提示；MUST NOT 在此时建立登录会话或跳转业务首页。

#### Scenario: 需要改密
- **WHEN** userLogin 返回 needChangePwd 与 changePwdToken
- **THEN** 打开弹窗；本地无正式登录态

#### Scenario: 确定改密成功
- **WHEN** 用户提交合规新密码且接口成功
- **THEN** 关闭弹窗并提示重新登录；用户仍在登录页

#### Scenario: 取消
- **WHEN** 用户点击取消
- **THEN** 关闭弹窗并取消本次登录（不写 token、不进首页）
