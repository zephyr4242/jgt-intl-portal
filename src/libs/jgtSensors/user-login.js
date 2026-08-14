import { $sensorsTrack } from './lib'

// 登录模块
const userLogin = {}
const btnType = {
  1: '机构开户',
  2: '忘记密码',
  3: '《隐私政策声明》',
  4: '切换至账号密码登录',
  5: '切换至验证码登录'
}
/*
  1. 登录页面浏览
*/
userLogin.loginPageview = () => {
  $sensorsTrack('login_pageview')
}
/*
  2. 登录页面按钮点击
  登录首页及登录类型: button_name,
*/
userLogin.loginPageClick = payload => {
  payload.button_name = btnType[payload.type]
  delete payload.type
  $sensorsTrack('login_page_click', payload)
}

/*
  3. 登录按钮点击
  login_type: 登录方式
*/
userLogin.loginClick = payload => {
  $sensorsTrack('login_click', payload)
}
/*
  4. 选择机构点击
  org_code:机构id
  select_source: 来源
*/
userLogin.selectOrganizationClick = payload => {
  $sensorsTrack('select_organization_click', payload)
}
/*
  5. 选择账户弹窗操作
    select_account_type: 选择账户类型
    org_code: 机构id
    button_name: 按钮名称
    select_source: 来源
*/
userLogin.selectAccountHandle = payload => {
  $sensorsTrack('select_account_handle', payload)
}

/*
  6. 选择账户结果返回
    org_code： 机构id
    select_source：来源
    fofund_no: 账户code
*/
userLogin.feLoginResult = (payload) => {
  $sensorsTrack('fe_login_result', payload)
}

/*
  7. 登录一览表页面点击
  登录类型: open_acc_type
  登录处理状态: open_acc_deal_status,
  按钮名称: button_name
*/
userLogin.searchAccount = (payload) => {
  $sensorsTrack('search_account', payload)
}

/*
  8. 登录协议同意
  login_type: 登录方式
*/
userLogin.loginAgreementAgree = payload => {
  $sensorsTrack('login_agreement_click', payload)
}

export default userLogin
