import { queryRegisterInfoByOrgCode } from '@/api/intl/legacy/fofund-account'
import getMenu from '@/menu/aside'
import jgtMenuList from '@/menu/module/jgt-menu-list'
import orgManage from '@/menu/module/org-manage'
import util from '@/libs/util'
import store from '@/store'

// 强制清理缓存
export const forceCleanCookieAndLocalStorage = () => {
  // cookies
  util.cookies.remove('rolesType')
  util.cookies.remove('orgCode')
  util.cookies.remove('isNormalLogin')
  util.cookies.remove('hasAccount')
  util.cookies.remove('token')
  util.cookies.remove('uuid')
  util.cookies.remove('isNormalLogin')
  util.cookies.remove('channelSourceName')
  // localStorage
  localStorage.removeItem('d2admin-1.8.0')
  localStorage.removeItem(`jgt`)
  localStorage.removeItem('menuList')
  localStorage.removeItem('storePage')
}
// type阻断接口拦截重新调用调用登录接口
export const authInit = async (token, info, type) => {
  if (token) {
    const res = await store.dispatch('d2admin/account/tokenLogin', { token: token, isType: type })
    util.cookies.set('hasAccount', util.isEmpty(res.userLoginCustomer) ? '0' : '1')
    if (res.loginType === '5' || res.loginType === '7') {
      getMenuList(res.trialLoginInfo.menuList, res.trialLoginInfo && res.trialLoginInfo.orgCode, res.loginType)
      // 首次进入info可能为空
      if (info) {
        info.id = res.trialLoginInfo.id
      }
      res.id = res.trialLoginInfo.id
      await store.dispatch('d2admin/user/set', res)
    } else {
      // 生成动态菜单
      // 机构信息采集的状态需要用registerId查询,避免无机构采集的账户登陆后读取原来的registerId,先置空
      store.state.storePage.registerId = ''
      if (res && res.userLoginOrg) {
        getMenuList(res.userLoginOrg.menuList, res.userLoginOrg.orgCode, res.loginType)
        let orgRes = null
        try {
          orgRes = await queryRegisterInfoByOrgCode({ orgCode: res.userLoginOrg.orgCode })
        } catch (error) {

        }
        // 首次进入info可能为空
        if (info) {
          info.orgCode = res.userLoginOrg.orgCode
        }

        res.orgCode = res.userLoginOrg.orgCode
        util.cookies.set('orgCode', res.userLoginOrg.orgCode)
        await store.dispatch('d2admin/user/set', res, { root: true })
        if (orgRes && orgRes.id) {
          store.state.storePage.registerId = orgRes.id
        }
      }
    }
  } else {
    const token = util.cookies.get('token')
    const isNormalLogin = util.cookies.get('isNormalLogin')
    // 当出现是非在线开户登录且已登录状态时进行 当前页面调接口检测orgCode是否改变
    // 增加非游客和体验账户的判断
    if (token && isNormalLogin === '1' && info.loginType !== '5' && info.loginType !== '7') {
      await store.dispatch('d2admin/account/tokenLogin', { token })
    }
  }
}
export const getMenuList = (list, orgCode, loginType) => {
  localStorage.setItem('menuList', '{}')
  let aside = util.deepClone(jgtMenuList)
  let temp = []
  let tempChild = []
  // 去除基煜精选
  list = util.filterMenuList(list)
  aside.forEach((aitem) => {
    list.forEach((litem) => {
      if (aitem.id === litem.resourceId) {
        tempChild = []

        if (aitem.children) {
          // 机构管理重新排序由前端完成
          if (litem.resourceId === '1385071203459006477') {
            let sortedOrgMenu = [
              // { path: '/intro', title: '功能介绍', icon: 'logo', id: 'hhh' }
            ]

            orgManage.children.forEach((i) => {
              let t = litem.children.find((e) => e.resourceId === i.id)
              if (t) {
                sortedOrgMenu.push(i)
              }
            })
            aitem.children = sortedOrgMenu
          } else {
            aitem.children.forEach(caitem => {
              if (caitem.id === '1385071203420221026' || caitem.id === '1853325732562145281') {
                if (localStorage.getItem('jgt-feign-version')) {
                  caitem.path = caitem.path + util.cookies.get('token') + `&jgtFeignVersion=${localStorage.getItem('jgt-feign-version')}`
                } else {
                  caitem.path = caitem.path + util.cookies.get('token')
                }
              }
              if (caitem.id === '1853325732562145281') {
                caitem.path = caitem.path + `&pathId=${caitem.id}`
              }

              let tempChildRes = litem.children.find(clitem => {
                return clitem.resourceId === caitem.id
              })
              if (tempChildRes) {
                const hideBmisRecommend = util.isBmisExclusiveOrgRestricted(orgCode, loginType) && caitem.path === '/bmis/recommend'
                if (!hideBmisRecommend) {
                  tempChild.push(caitem)
                }
              }
            })
            aitem.children = tempChild
          }
        }
        temp.push(aitem)
      }
    })
  })
  localStorage.setItem('menuList', JSON.stringify(temp))
  const menulist = getMenu(true)
  store.commit('d2admin/menu/asideSet', menulist)
}
