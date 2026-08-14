import { getAudioCount, queryPreOrderTotal } from '@/api/intl/legacy/bus-jgt-trade'
import util from '@/libs/util'
// import GlobalData from '@/libs/GlobalData'
// import constant from '@/libs/constant'
export default {
  namespaced: true,
  state: {
    // 需要展示红点的菜单id列表
    menuIds: []
  },
  actions: {
    /**
     * 复核条数大于0，展示复核列表菜单右边的红点
     */
    async needMenuDot ({ commit }, payload) {
      // 是否绑定了基煜账号
      const isBindFofundNo = util.isBindFofundNo()
      let menuList = []
      try {
        menuList = JSON.parse(localStorage.getItem('menuList')) || []
      } catch (e) {
        menuList = []
      }
      let tradeList = menuList.find(item => item.title.includes('交易中心'))
      tradeList = tradeList?.children || []
      let hasAuditList = tradeList.find(item => item.title.includes('复核列表'))

      if (isBindFofundNo && hasAuditList) {
        payload.multiEntrance = 1
        getAudioCount(payload).then(res => {
          commit('asideDotSet', {
            state: res.countAudit > 0, // 是否添加标志
            menuId: '1385071203408674831' // 复核列表菜单id
          })
        }).catch(() => {
          commit('asideDotSet', {
            state: 0, // 是否添加标志
            menuId: '1385071203408674831' // 复核列表菜单id
          })
        })
      }
    },
    /**
     * 复核条数大于0，展示复核列表菜单右边的红点
     */
    needMenuDotFn ({ commit }, payload) {
      commit('asideDotSet', {
        state: 0, // 是否添加标志
        menuId: '1385071203408674831' // 复核列表菜单id
      })
    },
    /**
     * 预购条数大于0，展示复核列表菜单右边的红点
     */
    needPurchaseDotFn ({ commit }, payload) {
      commit('asideDotSet', {
        state: payload ? payload.state : 0, // 是否添加标志
        menuId: '1385071203408674830' // 复核列表菜单id
      })
    },
    needPurchaseDot ({ commit }, payload) {
      // 是否绑定了基煜账号
      const isBindFofundNo = util.isBindFofundNo()
      if (isBindFofundNo) {
        queryPreOrderTotal(payload).then(res => {
          commit('asideDotSet', {
            state: res.total > 0, // 是否添加标志
            menuId: '1385071203408674830' // 复核列表菜单id
          })
        }).catch(() => {
          commit('asideDotSet', {
            state: 0, // 是否添加标志
            menuId: '1385071203408674830' // 复核列表菜单id
          })
        })
      }
    }
  },
  mutations: {
    /**
     * @description 设置菜单后边点的样式
     * @param {Object} state state
     * @param {Array} payload 菜单id、是否添加标志
     */
    asideDotSet (state, payload) {
      if (payload.state) {
        state.menuIds.push(payload.menuId)
      } else {
        state.menuIds = state.menuIds.filter(id => payload.menuId !== id)
      }
    }
  }
}
