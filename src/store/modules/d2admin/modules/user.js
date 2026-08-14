import util from '@/libs/util.js'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},

    // 是否只有一个投组
    isSingleAccount: false
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    set ({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = info
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })

        state.isSingleAccount = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.isSingleAccount',
          defaultValue: false,
          user: true
        }, { root: true })
        try {
          if (state.info?.operatorCode && Vue.prototype.$jySensors) {
            const loginId = state.info?.operatorCode || state.info?.id
            const noTokenLogin = state.info?.noTokenLogin
            Vue.prototype.$jySensors.trackLogin(loginId)
            const { orgCode, customerType, fofundNo } = state.info?.userLoginCustomer || {}
            const { orgCode1, orgName, orgTypeStr } = state.info?.userLoginOrg || {}
            /* Vue.prototype.$jySensors.setProfile({
              latest_org_code: orgCode || state.info?.orgCode,
              latest_customer_type: util.hashCustomerName[customerType],
              latest_fofund_no: fofundNo
            }) */
            // 定义事件公共属性
            let paramsData = {
              platform: Vue.prototype.$isElectron ? 'client2.0' : window.top.$gc ? 'client' : 'web',
              org_code: orgCode || orgCode1 || state.info?.orgCode,
              org_name: orgName || undefined,
              org_type_name: orgTypeStr || undefined,
              customer_type: util.hashCustomerName[customerType],
              fofund_no: fofundNo,
              noTokenLogin: noTokenLogin,
              build_time: Vue.prototype.$buildTime,
              web_version: window.CONFIG?.WEB_VERSION
            }
            if (window.top.$gc) {
              paramsData.client_version = window.top.$gc.appVersion || undefined
            }
            Vue.prototype.$jySensors.registerPage(paramsData)
          }
        } catch (e) {}
        // end
        resolve()
      })
    },
    isSame ({ state }) {
      return new Promise(async resolve => {
        try {
          const operatorCode = util.cookies.get('uuid')
          if (util.isEmpty(operatorCode)) {
            resolve(true)
          }

          const local = JSON.parse(localStorage.getItem('jgt'))
          const localInfo = local?.sys?.user[operatorCode]?.user?.info
          if (localInfo) {
            const localFofundNo = localInfo?.userLoginCustomer?.fofundNo
            const vuexFofundNo = state.info?.userLoginCustomer?.fofundNo
            resolve(localFofundNo === vuexFofundNo)
          }

          resolve(true)
        } catch (error) {
          resolve(true)
        }
      })
    },

    // 必须在创建user之后调用，即通常需要完成 await login之后再调用
    // login之前 新的操作员，父级对象还没创建
    setIsSingleAccount({ state, dispatch }, payload) {
      return new Promise(async resolve => {
        // store 赋值
        state.isSingleAccount = payload
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.isSingleAccount',
          value: payload,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  }
}
