// 此 mixin 完成勾选数组相关方法，常用tab的相关方法
// 使用 PortfolioMulti 和 PortfolioMultiSelected 组件需要再父级引入该 mix
import {
  queryOrgAccountRelationGroupDetail
} from '@/api/intl/legacy/bus-jgt-account'

export default {
  // 将当前this赋值给fundData
  provide() {
    return {
      parentDialog: this
    }
  },
  watch: {
    checkedTree() {
      let temp = []
      this.checkedTree.forEach(item => {
        if (item.level === 1) {
          temp.push(item)
        } else {
          // 多投组场景(level = 2)
          let index = temp.findIndex(i => {
            return i.value === item.fofundNo
          })
          if (index >= 0) { // 之前已经创建了父级
            temp[index].accountList.push(item)
          } else {
            let parent = {
              value: item.fofundNo,
              label: item.fofundName,
              level: 1,
              accountList: [item]
            }
            temp.push(parent)
          }
        }
      })
      this.checkedFullTree = temp.slice()
    },
    checkedGroupTree() {
      this.checkedFullGroupTree = this.generateCheckedGroupTree(this.checkedGroupTree)
    }
  },
  data() {
    return {
      visible: false,
      isCommon: false, // 是否常用
      keyword: '', // 搜索词
      groupKeyword: '',
      recordsTotal: 0, // 记录总数
      groupRecordsTotal: 0,

      // 实现跨页勾选
      checkedData: [], // 已勾选key，使用该数组完成跨页勾选
      checkedDataBak: [], // 已勾选key备份
      checkedTree: [], // 已勾选树
      checkedTreeBak: [], // 已勾选树备份
      checkedFullTree: [], // 跨页勾选结果树

      checkedGroupData: [],
      checkedGroupDataBak: [],
      checkedGroupTree: [],
      checkedTreeBakTree: [],
      checkedFullGroupTree: []
    }
  },
  methods: {
    switchTab(val) {
      this.isCommon = val
    },
    setCheckedData(val) {
      if (this.util.isEmpty(val)) {
        this.checkedData = []
      } else {
        this.checkedData = val.slice()
      }
    },
    setCheckedTree(val) {
      if (this.util.isEmpty(val)) {
        this.checkedTree = []
      } else {
        this.checkedTree = val.slice()
      }
    },
    open() {
      // 打开时 备份一下最初的状态
      this.bak()
      this.visible = true
      this.isCommon = false
      this.keyword = ''

      if (this.$refs.portfolioSearch) {
        this.$refs.portfolioSearch.clearKeyword()
      }
    },

    close() {
      this.revert()
      // 取消时还原已勾选部分
      this.visible = false
      this.cleanBak()
    },

    // 备份
    bak() {
      this.checkedDataBak = this.checkedData.slice()
      this.checkedTreeBak = this.checkedTree.slice()
      this.checkedGroupDataBak = this.checkedGroupData.slice()
      this.checkedGroupTreeBak = this.checkedGroupTree.slice()
    },

    // 还原
    revert() {
      this.checkedData = this.checkedDataBak.slice()
      this.checkedTree = this.checkedTreeBak.slice()
      this.checkedGroupData = this.checkedGroupDataBak.slice()
      this.checkedGroupTree = this.checkedGroupTreeBak.slice()
    },

    // 释放备份占用内存
    cleanBak() {
      this.checkedDataBak = []
      this.checkedTreeBak = []
      this.checkedGroupDataBak = []
      this.checkedGroupTreeBak = []
    },

    // 获取基煜账户组下所有基煜账户组
    async loadGroupAccounts(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      const treeRef = this.$refs.groupPortfolioMulti.$refs.tree
      if (node.level > 1) {
        setTimeout(() => {
          resolve(node.data.accountList)
          this.$nextTick(() => {
            if (treeRef) {
              treeRef.scroll()
            }
          })
        }, 500)
        return
      }
      const res = await queryOrgAccountRelationGroupDetail({ groupId: node.data.value })
      const accountLeafs = this.generateAccountLeafs(node, res.orgCustomerWithEstablishAccountResponseList || [])
      resolve(accountLeafs)
      this.$nextTick(() => {
        if (treeRef) {
          treeRef.scroll()
        }
      })
    },

    // 生成 checkedGroupTree 的方法
    generateCheckedGroupTree(groupTree) {
      const res = []
      groupTree.forEach(item => {
        if (item.level === 1) {
          res.push(item)
        } else {
          if (!res.find(i => i.value === item.value.split('-')[0])) {
            res.push({
              level: 1,
              label: '',
              value: item.value.split('-')[0]
            })
          }
        }
      })
      return res
    },

    // 工具函数，生成基煜账号树列表数据
    generateAccountLeafs(node, list, deep = 2, secondNodeValue = '') {
      // 深度遍历如果有accountList就转换为 children
      return (list || []).map(item => {
        if (item?.accountList?.length) {
          return {
            label: item.fofundShortName || item.fofundName,
            level: deep,
            value: `${node?.data?.value || node.value}-${item.fofundNo}`,
            accountList: this.generateAccountLeafs(node, item.accountList, deep + 1, item.fofundNo),
            isLeaf: false
          }
        }
        return {
          label: item.fofundShortName || item.fofundName || item.investPortfolioName,
          level: deep,
          value: secondNodeValue ? `${node?.data?.value || node.value}-${secondNodeValue}-${item.accountNo}` : `${node?.data?.value || node.value}-${item.accountNo}`,
          accountList: [],
          isLeaf: true
        }
      })
    }

  }
}
