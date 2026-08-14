/*
 * @Descripttion:
 * @version:
 * @Author: lcf
 * @Date: 2022-10-23 17:51:26
 * @LastEditors: lcf
 * @LastEditTime: 2022-10-30 19:41:05
 */
import util from '@/libs/util.js'
import store from '@/store/index'
import session from '@/libs/util.session'
import { MessageBox } from 'element-ui'
// var linkPath = process.env.NODE_ENV === 'production' ? window.CONFIG.VUE_APP_LINK_PATH : process.env.VUE_APP_LINK_PATH

const accountLimit = [
  '/account/overview', // 账户总览
  // linkPath + '/oper/account/notification-edit', // 通知设置
  // '/account/dividend-records', // 分红记录
  '/account/list', // 账户信息
  // linkPath + '/oper/account/contract-list', // 电子合同
  '/account/trade-records', // 我的账户-交易记录
  '/account/trade-records/trade-views', // 我的账户-交易视图
  '/account/my-assets', // 我的账户-我的持仓
  '/account/my-assets/assets-views', // 我的账户-持仓视图
  '/account/contract' // 电子合同
]
const tradeLimit = [
  '/trade-info/purchase-list', // 预购清单
  '/trade-info/audit-list', // 复核列表
  '/account/dividend-records', // 分红记录
  '/account/credit-list',
  '/account/notice-setting',
  '/account/bill',
  '/trade-info/aggregation/index'
]

export default {
  computed: {
    // 判断是否有私募菜单
    isPrivateMenu () {
      const menuList = store.state.d2admin.user.info?.userLoginOrg?.menuList
      if (menuList && menuList.length) {
        const accountMenu = menuList.find(item => item.resourceId === '1591985206420156418')
        return accountMenu
      }
      return false
    },
    // 判断是否有资管产品菜单
    isBmistMenu () {
      const menuList = store.state.d2admin.user.info?.userLoginOrg?.menuList
      if (menuList && menuList.length) {
        const accountMenu = menuList.find(item => item.resourceId === '1385071203408674826')
        return accountMenu
      }
      return false
    }
  },
  methods: {
    postInvestmentAuthorizationDialog (path) {
      const postInvestmentAuthorization = util.cookies.get('uuid') + '_postInvestmentAuthorization'
      const postInvestmentAuthorizationFlag = session.get(postInvestmentAuthorization, { user: true })
      if (!postInvestmentAuthorizationFlag) {
        let messageHtml = `<div>${this.tipsTxt}</div>`
        MessageBox.confirm(messageHtml, '风险提示', {
          center: true,
          showClose: false,
          dangerouslyUseHTMLString: true,
          customClass: 'postInvestmentAuthorization',
          confirmButtonClass: 'el-button--small'

        })
          .then(() => {
            session.set(postInvestmentAuthorization, true, { user: true })
            window.open(path, '_blank')
          })
      } else {
        window.open(path, '_blank')
      }
    },

    async handleMenuSelect (index, indexPath) {
      // try {
      //   if (!this.isPrivateMenu && !this.isBmistMenu && index.includes('/account/contract')) {
      //     this.$alert('您没有资管计划和私募基金的菜单权限，请联系管理员配置！', '提示', {
      //       confirmButtonText: '确定',
      //       center: true
      //     })
      //     return false
      //   }
      // } catch (error) {
      //   console.log(error)
      // }
      if (index.includes('&pathId=')) {
        this.postInvestmentAuthorizationDialog(index)
        return false
      }
      const isIntlPortalUser = util.isIntlPortalUser(store.state.d2admin.user.info)
      const isNoAccount = accountLimit.some(item => { return item === index }) || tradeLimit.some(item => { return index.includes(item) })
      // 未绑定基煜账户时对部分菜单进行弹窗拦截处理
      if (!isIntlPortalUser && util.isEmpty(store.state.d2admin.user.info.userLoginCustomer) && isNoAccount) {
        this.$alert('未绑定基煜账户', '提示', {
          confirmButtonText: '确定',
          center: true
        })
        return false
      }
      if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.warning('临时菜单')
      } else if (index.indexOf(',') > -1) {
        let paths = index.split(',')
        let isInWhiteList = await util.isInWhiteList()
        if (isInWhiteList) {
          this.$router.push({
            path: paths[0]
          })
        } else {
          util.open(paths[1])
        }
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        util.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
