<template>
  <el-dialog class="portofolio-dialog" title="请选择账户" :visible.sync="visible" :before-close="close" width="1000px">
    <PortfolioTab :isCommon="isCommon" @switchTab="switchTab" v-if="showTab" />

    <div class="grid">
      <!-- 左侧 -->
      <div class="left-row">
        <div class="first-col">
          <el-checkbox v-model="checkAllCommon" @change="changeCheck" v-if="isCommon" size="mini" class="jgt-ml-24" :indeterminate="indeterminateCommon">全选</el-checkbox>
          <el-checkbox v-model="checkCurrentPageAll" @change="changeCheck" v-else size="mini" class="jgt-ml-24" :indeterminate="indeterminateCurrentPageAll">当前页全选</el-checkbox>
          <PortfolioSearch @change="keywordChange" ref="portfolioSearch"/>
        </div>

        <div class="second-col">
          <PortfolioMulti ref="portfolioMulti" :apiType="apiType" @changed="updateCheckBox" :args="args"/>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right-row">
        <div class="first-col">
          <span class="jgt-ml-12 jgt-fw-bold">
            已选账户({{ checkedFullTree.length }}/{{ recordsTotal }})
            <span v-if="checkedFullTree.length" class="clear-text" @click="clear">清空</span>
          </span>
        </div>
        <div class="second-col">
          <PortfolioMultiSelected @remove="remove"/>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="confirm" :disabled="checkedData && checkedData.length === 0">
        确定
      </el-button>
      <el-button size="medium" type="primary" plain v-show="!isCommon" @click="selectAll">
        全部账户
      </el-button>
      <el-button size="medium" type="primary" plain @click="close">
        取消
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import PortfolioTab from '../PortfolioSingle/PortfolioTab'
import PortfolioMultiSelected from './PortfolioMultiSelected'
import PortfolioMulti from './PortfolioMulti'
import PortfolioSearch from './PortfolioSearch'
import PortfolioMultiMixin from './PortfolioMultiMixin'
import { difference } from 'lodash'

export default {
  name: 'PortofolioDialog',
  mixins: [PortfolioMultiMixin],
  components: {
    PortfolioTab,
    PortfolioMulti,
    PortfolioMultiSelected,
    PortfolioSearch
  },
  props: {
    // 是否需要显示切换全部/常用tab
    showTab: {
      type: Boolean,
      required: false,
      default: true
    },
    // 接口类型
    apiType: {
      type: String,
      default: '2', // 1 机构管理 2 我的账户 3 单个操作员
      required: false
    },
    args: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  data() {
    return {
      checkAllCommon: false, // 常用tab的全选框
      indeterminateCommon: false,
      checkCurrentPageAll: false, // 全部tab的全选框
      indeterminateCurrentPageAll: false
    }
  },
  methods: {
    // 搜索
    keywordChange(v) {
      this.keyword = v
    },
    // 确定
    confirm() {
      this.visible = false
      this.$emit('change', this.checkedData, this.checkedTree)
    },
    // 全部账户
    selectAll() {
      this.visible = false
      this.checkedData = []
      this.checkedTree = []
      this.cleanBak()

      this.$emit('change', ['-1'], [{ label: '全部基煜账户' }])
    },
    // 清空
    clear() {
      this.checkedData = []
      this.checkedTree = []
      this.cleanBak()
      this.$refs.portfolioMulti.changeAllTo(false)
    },
    // 在已选列表中删除某一项
    remove(arr) {
      this.checkedData = difference(this.checkedData, arr)
      arr.forEach(value => {
        let index = this.checkedTree.findIndex(i => i.value === value)
        this.checkedTree.splice(index, 1)
      })
      this.$refs.portfolioMulti.checkedDataChange()
      this.updateCheckBox()
    },

    // 更新全选半选状态
    updateCheckBox() {
      if (this.util.isEmpty(this.$refs.portfolioMulti)) {
        return
      }
      const { checked, indeterminate } = this.$refs.portfolioMulti.getCheckedStatus()

      if (this.isCommon) {
        this.checkAllCommon = checked
        this.indeterminateCommon = indeterminate
      } else {
        this.checkCurrentPageAll = checked
        this.indeterminateCurrentPageAll = indeterminate
      }
    },

    close() {
      this.revert()
      // 取消时还原已勾选部分
      this.visible = false
      this.cleanBak()
      this.checkAllCommon = false
      this.indeterminateCommon = false
      this.checkCurrentPageAll = false
      this.indeterminateCurrentPageAll = false
    },

    changeCheck(val) {
      this.$refs.portfolioMulti && this.$refs.portfolioMulti.changeAllTo(val)
    }

  }
}
</script>

<style lang="scss" scoped>
.bgA11 {
  @include backgroundColor(A11);
}

div.portofolio-dialog {
  .grid {
    width: 968px;
    height: 367px;
    margin-top: 12px;

    .left-row {
      display: inline-block;
      width: 476px;
      margin-right: 12px;
    }

    .right-row {
      display: inline-block;
      width: 480px;
    }

    .first-col {
      @extend .bgA11;
      line-height: 44px;
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;

      .clear-text {
        height: 19px;
        line-height: 19px;
        margin-left: 4px;
        box-sizing: border-box;
        @include color(A10);
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        border-bottom: 1px solid transparent;

        &:hover {
          @include borderBottomColor(A10);
        }
      }
    }

    .second-col {
      @extend .bgA11;
      height: 316px;
      overflow: hidden;
    }

  }
}
</style>
<style lang="scss">
div.portofolio-dialog div.el-dialog .el-dialog__body {
  padding: 16px 16px 0 16px;
}
</style>
