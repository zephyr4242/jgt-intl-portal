<!-- 勾选树 -->
<template>
  <div v-loading="insideLoading && loading" class="portfolio-multi" :style="{ height: containerHeight + 'px' }">
    <div class="portfolio-multi-tree"
      :style="{ height: showPagination ? (containerHeight - 32) + 'px' : containerHeight + 'px' }">
      <JyVirtalTreeL2
        :data="treeData"
        :lazy="lazy"
        :load="load"
        :props="defaultProps"
        :default-expand-all="defaultExpandAll"
        :showCheckbox="true"
        @check="updateChecked"
        node-key="value"
        ref="tree"
        :visualHeight="visualHeight"
        @node-click="nodeClick"
        :expand-on-click-node="false"
      >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span class="label" :title="node.label">{{ node.label }}</span>
          </span>
      </JyVirtalTreeL2>
    </div>

    <el-pagination layout="prev, pager, next" v-if="showPagination" :page-size="pageSize" :total="total"
      @current-change="paginationChange">
    </el-pagination>
  </div>
</template>

<script>
import {
  pageOrgOperatorCustomerWithEstablish,
  pageOrgCustomerWithEstablish,
  pageOrgOperatorRelationAccount,
  pageOrgAccountGroup
} from '@/api/intl/legacy/bus-jgt-account'
import reprocessingDataMixin from './reprocessingDataMixin'

import JyVirtalTreeL2 from './JyVirtualTree/JyVirtualTreeL2'
import { difference, differenceBy, union, unionBy, intersection } from 'lodash'

// 定义一个字典表，一个页面可能有多个此组件，需要定义出来每个组件对应的数据值名称
const componentToDataName = {
  account: {
    checkedTree: 'checkedTree',
    checkedData: 'checkedData',
    recordsTotal: 'recordsTotal',
    keyword: 'keyword',
    refName: 'portfolioMulti',
    checkedFullTree: 'checkedFullTree'
  },
  group: {
    checkedTree: 'checkedGroupTree',
    checkedData: 'checkedGroupData',
    recordsTotal: 'groupRecordsTotal',
    keyword: 'groupKeyword',
    refName: 'groupPortfolioMulti',
    checkedFullTree: 'checkedFullGroupTree'
  }
}

export default {
  name: 'PortfolioMulti',
  inject: ['parentDialog'],
  mixins: [reprocessingDataMixin],
  components: {
    JyVirtalTreeL2
  },
  props: {
    // 接口类型
    apiType: {
      type: String,
      default: '2', // 1 机构管理 2 我的账户 3 单个操作员
      required: false
    },
    // 是否本组件处理loading
    insideLoading: {
      type: Boolean,
      default: true,
      required: false
    },
    // 高度，（含分页器位置的）
    containerHeight: {
      type: Number,
      default: 316,
      required: false
    },
    args: {
      type: Object,
      required: false,
      default: () => { }
    },
    orgCode: {
      type: String,
      default: ''
    },
    lazy: {
      type: Boolean,
      default: false,
      required: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
      required: false
    },
    componentType: {
      type: String,
      default: 'account',
      required: false
    },
    singleClick: {
      type: Boolean,
      default: true,
      required: false
    },
    load: Function
  },
  watch: {
    'parentDialog.visible'(val) {
      if (val) {
        this.firstVisible = true
        this.query()
      } else {
        this.treeData = []
        this.pageNum = 1
        this.total = 0
      }
    },
    'parentDialog.isCommon'(val) {
      this.query()
    },

    // 【请将keyword属性留给此处，实现投组搜索】
    computedKeyword() {
      if (this.parentDialog.visible) {
        // 隐藏时不监听keyword变更
        this.pageNum = 1
        this.query()
      }
    },

    loading(val) {
      if (!this.insideLoading) {
        this.$emit('loadingChange', val)
      }
    }
  },
  computed: {
    showPagination() {
      return this.total > this.pageSize
    },
    // 当页全部key
    currentAllKeys() {
      let ret = []
      this.treeData.forEach(item => {
        if (item?.accountList?.length > 0) {
          item.accountList.forEach(i => {
            ret.push(i.value)
          })
        } else {
          ret.push(item.value)
        }
      })
      return ret
    },
    visualHeight() {
      return this.showPagination ? this.containerHeight - 32 : this.containerHeight
    },
    computedKeyword() {
      // 根据 type 不同，取不同值，应对一个页面有多个此组件场景
      return this.parentDialog[componentToDataName[this.componentType].keyword]
    }
  },
  mounted() {
    this.query()
  },
  data() {
    return {
      loading: false,
      firstVisible: true,
      treeData: [], // 当前页面显示的data
      defaultProps: {
        children: 'accountList', // 仅映射children，其他在 reprocessingData 方法中处理
        isLeaf: 'isLeaf'
      },
      pageNum: 1, // 当页页码
      pageSize: 1000, // 分页条数
      total: 0
    }
  },
  methods: {
    // 已勾选数组变更时，将当前页能匹配到的勾选框选上
    checkedDataChange() {
      if (this.lazy) {
        this.parentDialog[componentToDataName[this.componentType].checkedData].forEach(item => {
          // 如果选中的是二层节点,需要将一层节点打开
          if (item.split('-').length === 2) {
            const node = this.getNode(item.split('-')[0])
            node.expand()
          }
          // 如果选中的是三层节点,需要将一、二层节点打开
          if (item.split('-').length === 3) {
            const node = this.getNode(item.split('-')[0])
            node.expand(() => {
              node.childNodes.forEach(it => {
                const childNode = this.getNode(`${item.split('-')[0]}-${item.split('-')[1]}`)
                if (it.data.value === `${item.split('-')[0]}-${item.split('-')[1]}`) {
                  childNode.expand()
                }
              })
            })
          }
        })
        setTimeout(() => {
          this.$refs.tree.$refs.ElTree.setCheckedKeys(this.parentDialog[componentToDataName[this.componentType].checkedData])
        }, 1000)
      } else {
        // 不是 lazy 情况下，直接取交集即可
        this.$refs.tree.$refs.ElTree.setCheckedKeys(this.getCurrentKeys())
      }
    },

    // 全选，反选
    changeAllTo(flag) {
      if (flag) {
        this.$refs.tree.$refs.ElTree.setCheckedKeys(this.currentAllKeys)
      } else {
        this.$refs.tree.$refs.ElTree.setCheckedKeys([])
      }

      this.updateChecked()
    },

    // 计算当前页选中了哪些keys
    getCurrentKeys() {
      return intersection(this.parentDialog[componentToDataName[this.componentType].checkedData], this.currentAllKeys)
    },

    // 该方法返回当前页的全选，未选，半选状态
    getCheckedStatus() {
      const currentKeys = this.getCurrentKeys()
      const currentLength = currentKeys.length
      const total = this.currentAllKeys.length
      return {
        // 是否全选
        checked: currentLength > 0 && currentLength === total,
        // 是否全未选
        unchecked: currentLength === 0,
        // 是否已半选
        indeterminate: currentLength > 0 && currentLength < total
      }
    },

    // 节点被点击时 实现选中/反选
    nodeClick(data, node) {
      let nextValue = !node.checked
      if (node?.childNodes.length > 0) {
        node.childNodes.forEach(i => {
          this.$refs.tree.$refs.ElTree.setChecked(i.data.value, nextValue)
          if (i?.childNodes.length > 0) {
            i.childNodes.forEach(iChild => {
              this.$refs.tree.$refs.ElTree.setChecked(iChild.data.value, nextValue)
            })
          }
        })
      } else {
        this.$refs.tree.$refs.ElTree.setChecked(data.value, nextValue)
      }

      this.updateChecked()
    },

    // 当前页勾选变更
    updateChecked() {
      // 先删掉所有当前页已有的（实现去勾选）, 再和已勾选部分合并
      const checkedKeys = this.$refs.tree.$refs.ElTree.getCheckedKeys(this.singleClick)
      const checkedNodes = this.$refs.tree.$refs.ElTree.getCheckedNodes(this.singleClick)

      if (this.lazy) {
        const diffCheckedKeys = this.parentDialog[componentToDataName[this.componentType].checkedData].filter(i => {
          return !this.currentAllKeys.find(k => k === i.split('-')[0])
        })
        this.parentDialog[componentToDataName[this.componentType].checkedData] = union(checkedKeys, diffCheckedKeys)
        const tempAllNodes = this.currentAllKeys.map(i => { return { value: i } })
        const diffCheckedNodes = this.parentDialog[componentToDataName[this.componentType].checkedTree].filter(i => {
          return !tempAllNodes.find(k => k.value === i.value.split('-')[0])
        })
        this.parentDialog[componentToDataName[this.componentType].checkedTree] = unionBy(checkedNodes, diffCheckedNodes, 'value')
      } else {
        const diffCheckedKeys = difference(this.parentDialog[componentToDataName[this.componentType].checkedData], this.currentAllKeys)
        this.parentDialog[componentToDataName[this.componentType].checkedData] = union(checkedKeys, diffCheckedKeys)
        const tempAllNodes = this.currentAllKeys.map(i => { return { value: i } })
        const diffCheckedNodes = differenceBy(this.parentDialog[componentToDataName[this.componentType].checkedTree], tempAllNodes, 'value')
        this.parentDialog[componentToDataName[this.componentType].checkedTree] = unionBy(checkedNodes, diffCheckedNodes, 'value')
      }
      this.$emit('changed')
    },

    // 查询树
    async query() {
      try {
        if (this.loading) return
        this.loading = true
        this.treeData = []
        let api = pageOrgOperatorCustomerWithEstablish
        let params = {
          queryCommon: this.parentDialog.isCommon ? '1' : '0',
          fofundName: this.computedKeyword,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          ...this.args
        }

        if (this.apiType === '1') {
          api = pageOrgCustomerWithEstablish
        } else if (this.apiType === '3') {
          // 增加单个操作员   其他参数使用args传入
          api = pageOrgOperatorRelationAccount
          params = {
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            fofundName: this.computedKeyword,
            ...this.args
          }
        } else if (this.apiType === '4') {
          // 当 apiType 为 4 时，是获取分组列表
          api = pageOrgAccountGroup
          params = {
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            orgCode: this.orgCode,
            searchKey: this.computedKeyword
          }
        }

        const data = await api(params)
        this.total = data.total
        if (this.firstVisible) {
          // 弹窗显示时，更新总记录数（避免收到keyword干扰）
          this.firstVisible = false
          this.parentDialog[componentToDataName[this.componentType].recordsTotal] = data.total
        }

        if (this.apiType === '4') {
          // 当 apiType 为 4 时，是获取分组列表
          this.treeData = data.records.map(item => ({
            label: item.groupName,
            level: 1,
            value: item.groupId
          }))
        } else {
          this.treeData = this.reprocessingData(data.records, this.apiType === '3')
        }

        // 更新已勾选项
        this.$nextTick(() => {
          this.checkedDataChange()
          this.$refs.tree.scroll()
          // 提供一个查询结束事件，通常用于变更计算外层勾选框状态。
          this.$emit('changed')
        })
      } catch (error) {

      } finally {
        this.loading = false
      }
    },

    // 分页数变更
    paginationChange(pageNum) {
      this.pageNum = pageNum
      this.query()
    },

    getNode(data) {
      return this.$refs.tree.$refs.ElTree.getNode(data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.portfolio-multi {
  .custom-tree-node {
    position: relative;
    width: 100%;
    line-height: 30px;
    height: 30px;
  }

  div.el-pagination {
    padding: 2px 0;
    @include backgroundColor(A11);
    box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.1);

    .number {
      @include backgroundColor(A11);
    }

    button.btn-prev,
    button.btn-next {
      @include backgroundColor(A11);
    }
  }
}
</style>
