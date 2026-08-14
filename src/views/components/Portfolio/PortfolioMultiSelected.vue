<!-- 已勾选树 -->
<template>
  <div class="portfolio-multi-selected">
    <div class="portfolio-multi-selected-tree">
      <JyVirtalTreeL2 :data="parentDialog.checkedFullTree" :props="defaultProps" default-expand-all node-key="value" ref="tree"
        :visualHeight="316" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="label" :title="node.label">{{ node.label }}</span>

          <span class="el-icon-close" @click.stop="remove(data)"></span>
        </span>
      </JyVirtalTreeL2>
    </div>
  </div>
</template>

<script>
import reprocessingDataMixin from './reprocessingDataMixin'
import JyVirtalTreeL2 from './JyVirtualTree/JyVirtualTreeL2'

export default {
  name: 'PortfolioMultiSelected',
  inject: ['parentDialog'],
  mixins: [reprocessingDataMixin],
  components: {
    JyVirtalTreeL2
  },
  data() {
    return {
      defaultProps: {
        children: 'accountList' // 仅映射children，其他在 reprocessingData 方法中处理
      },
      treeData: []
    }
  },
  watch: {
    'parentDialog.checkedTree'() {
      this.update()
    },
    'parentDialog.visible'(val) {
      if (val) {
        this.update()
      }
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      // 更新已勾选项
      this.$nextTick(() => {
        this.$refs.tree.scroll()
      })
    },
    remove(data) {
      let i = data.accountList?.length > 0 ? data.accountList.map(i => i.value) : [data.value]
      this.$emit('remove', i)
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio-multi-selected {
  .custom-tree-node {
    position: relative;
    width: 100%;
    line-height: 30px;
    height: 30px;

    .label {
      width: 400px;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .el-icon-close {
      display: none;
      width: 16px;
      position: absolute;
      right: 12px;
      top: 8px;
    }
  }
}
</style>
<style lang="scss">
.portfolio-multi-selected {
  height: 316px;

  .portfolio-multi-selected-tree {
    height: 316px;
    overflow: hidden;

    // 有分页器之后 减少32px
    &.portfolio-multi-selected-tree-pagination {
      height: 284px;
      overflow: hidden;
    }

    .el-tree {
      background: transparent;

      // 滚动条样式
      &::-webkit-scrollbar-track {
        @include backgroundColor(A11);
      }
    }
  }

  div.el-pagination {
    padding: 2px 0;
  }

  .el-tree-node__content {
    height: 32px;
  }

  div.el-tree-node__content:hover {
    .el-icon-close {
      display: inline-block;
    }
  }
}
</style>
