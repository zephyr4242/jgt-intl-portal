export default {
  data () {
    return {

    }
  },
  methods: {
    // 登录浏览埋点
    sensorsLoginPageview() {
      try {
        this.$jgtSensorsTrack.loginPageview()
      } catch (error) {

      }
    },
    // 登录页面按钮点击
    sensorsLoginPageClick(type) {
      try {
        this.$jgtSensorsTrack.loginPageClick({
          type
        })
      } catch (error) {

      }
    },
    // 登录页面按钮点击
    sensorsLoginClick(type) {
      try {
        this.$jgtSensorsTrack.loginClick({
          login_type: type
        })
      } catch (error) {

      }
    },
    // 选择机构点击
    sensorsSelectOrganizationClick(orgCode) {
      try {
        this.$jgtSensorsTrack.selectOrganizationClick({
          org_code: orgCode,
          org_name: this.orgName,
          select_source: this.isLogin ? '登录' : '切换账号'
        })
      } catch (error) {

      }
    },
    // 选择账户弹窗操作
    sensorsSelectAccountHandle(btnName) {
      try {
        this.$jgtSensorsTrack.selectAccountHandle({
          select_account_type: this.activeId === 'allAccount' ? '全部账号' : '常用账号',
          org_code: this.orgCode,
          org_name: this.orgName,
          button_name: btnName,
          select_source: this.isLogin ? '登录' : '切换账号'
        })
      } catch (error) {

      }
    },
    sensorsFeLoginResult(fofundNo) {
      try {
        this.$jgtSensorsTrack.feLoginResult({
          fofund_no: fofundNo,
          org_code: this.orgCode,
          org_name: this.orgName,
          select_source: this.isLogin ? '登录' : '切换账号'
        })
      } catch (error) {

      }
    },
    sensorsSearchAccount(count) {
      try {
        this.$jgtSensorsTrack.searchAccount({
          search_content: this.searchText,
          org_code: this.orgCode,
          org_name: this.orgName,
          result_count: count,
          select_source: this.isLogin ? '登录' : '切换账号'
        })
      } catch (error) {

      }
    }
  }
}
