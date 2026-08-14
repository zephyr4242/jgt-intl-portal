import { Message } from 'element-ui'
import db from '@/libs/util.db'

export default {
  namespaced: true,
  state: {
    compareList: {
      '100101': [],
      '100201': [],
      '100301': [],
      '100401': []
    }
  },
  actions: {
    /**
     * 判断code是否重复
     */
    async isRepetition ({ state, dispatch }, info) {
      await dispatch('d2admin/compare/load', null, { root: true })
      const list = state.compareList[info.fundStyle]
      return list.filter(item => item.fundCode === info.fundCode).length !== 0
    },
    /**
     * 获取对应类型的比对列表
     */
    async compareList ({ state, dispatch }, info) {
      await dispatch('d2admin/compare/load', null, { root: true })
      const list = state.compareList[info.fundStyle] || []
      return list
    },
    /**
     * 添加对比
     */
    async add ({ state, dispatch }, info) {
      await dispatch('d2admin/compare/load', null, { root: true })
      const list = state.compareList[info.fundStyle]
      if (list.length >= 5) {
        Message({
          message: '对比栏不能超过5只产品',
          type: 'error'
        })
        return false
      }
      if (list.filter(item => item.fundCode === info.fundCode).length === 0) {
        list.push(info)
        // 持久化
        dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'compare.compareList',
          value: state.compareList,
          user: true
        }, { root: true })
      }
      return true
    },
    /**
     * 删除对比
     */
    async remove ({ state, dispatch }, info) {
      await dispatch('d2admin/compare/load', null, { root: true })
      const list = state.compareList[info.fundStyle]
      list.map((item, index) => {
        if (item.fundCode === info.fundCode) {
          list.splice(index, 1)
          // 持久化
          dispatch('d2admin/db/set', {
            dbName: 'sys',
            path: 'compare.compareList',
            value: state.compareList,
            user: true
          }, { root: true })
        }
      })
      return true
    },
    /**
     * 清空对比
     */
    clear ({ state, dispatch }, fundStyle) {
      state.compareList[fundStyle] = []
      // 持久化
      dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'compare.compareList',
        value: state.compareList,
        user: true
      }, { root: true })
    },
    /**
     * 添加/删除对比（已经添加就删除，否则添加）
     */
    toggle ({ state, dispatch }, info) {
      const list = state.compareList[info.fundStyle]
      const isAdd = list.filter(item => item.fundCode === info.fundCode).length === 0
      dispatch(`d2admin/compare/${isAdd ? 'add' : 'remove'}`, info)
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        const localData = JSON.parse(localStorage.getItem(`jgt`))
        // 浏览器多个tab下，没有重新获取最新localStorage的值，在这里重新赋值
        db.set('sys', localData.sys).write()
        // store 赋值
        state.compareList = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'compare.compareList',
          defaultValue: {
            '100101': [],
            '100201': [],
            '100301': [],
            '100401': []
          },
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  }
}
