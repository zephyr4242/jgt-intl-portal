
// 接口
import {
  commonSelectOptions,
  userRightsAllTradeRights
} from '@/api/intl/legacy/fofund-fap'

import { taCodeDict, listOrgOperatorTradeAuth } from '@/api/intl/legacy/bus-jgt-account'
import constant from '@/libs/constant'
export default class GlobalData {
  // 获取字典
  static async getDict () {
    if (GlobalData.dict) {
      return GlobalData.dict
    }

    const data = await commonSelectOptions()

    GlobalData.dict = data

    return GlobalData.dict
  }

  // 交易权限枚举
  static async getTradeRightsEnums () {
    if (GlobalData.tradeRights) {
      return GlobalData.tradeRights
    }

    const { records } = await userRightsAllTradeRights()

    GlobalData.tradeRights = records

    return GlobalData.tradeRights
  }

  // ta字典 -  全量获取，前端模糊查询
  static async getTaCodeDict () {
    if (GlobalData.taCodeDict) {
      return GlobalData.taCodeDict
    }

    const data = await taCodeDict({ taCodeOrName: '' })

    GlobalData.taCodeDict = data.map(i => {
      return {
        label: i.taCode + ' ' + i.taName,
        value: i.taCode
      }
    })

    return GlobalData.taCodeDict
  }

  // 机构下所有基煜账户对应的交易权限
  static async orgTradeRightsDict () {
    // if (GlobalData.orgTradeRight) {
    //   return GlobalData.orgTradeRight
    // }
    try {
      const data = await listOrgOperatorTradeAuth()
      // 防止返回null
      if (data && data.orgOperatorTradeAuthList && data.orgOperatorTradeAuthList.filter) {
        GlobalData.orgTradeRight = data.orgOperatorTradeAuthList.filter(item => item.orderFlag === '1').map(i => i.accountNo)

        return GlobalData.orgTradeRight
      }
      return []
    } catch (error) {
      return []
    }
  }

  // 查询机构下基煜账号交易权限信息
  static async getOrgTradeAuthList () {
    try {
      const { orgOperatorTradeAuthList } = await listOrgOperatorTradeAuth()
      return orgOperatorTradeAuthList || []
    } catch (error) {
      return []
    }
  }
  /**
   * 判断基煜账户是否有某个权限
   * @param roleId 权限id
   * @param accountNo 开户账号，不传为全部
   * @return {Promise<boolean>}
   */
  static async isOrgTradeAuth (roleId, accountNo) {
    if (!accountNo) return false
    let orgTradeAuthList = await GlobalData.getOrgTradeAuthList()
    let item = orgTradeAuthList.find(item => item.accountNo === accountNo)
    return item?.resourceIdList?.includes(roleId)
  }

  // 获取指定fofundNo的角色信息
  static async getRoles (accountNo) {
    let ret = {
      QUERY: false, // 查询
      HANDLE: false, // 经办
      EXPERT_HANDLE: false, // 高级经办
      AUDIT: false // 复核
    }
    if (!accountNo) {
      return ret
    }

    const data = await GlobalData.getOrgTradeAuthList()
    const roles = data.find(i => i.accountNo === accountNo)
    if (roles?.resourceIdList?.length > 0) {
      roles.resourceIdList.forEach(role => {
        if (role === constant.roleId.QUERY) {
          ret.QUERY = true
        } else if (role === constant.roleId.HANDLE) {
          ret.HANDLE = true
        } else if (role === constant.roleId.EXPERT_HANDLE) {
          ret.EXPERT_HANDLE = true
        } else if (role === constant.roleId.AUDIT) {
          ret.AUDIT = true
        }
      })
    }
    return ret
  }
}
