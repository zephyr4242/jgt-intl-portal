<template>
  <div class="jy_viewer">
    <!-- 默认视图 prodType:1公募 2私募 3资管 其他null-->
    <div class="jy_viewer_title">全部视图</div>
    <div class="jy_viewer_tabs">
      <div class="tabsBox">
        <span v-for="item in defaultViewList" class="tagsBtn tagsBtn1" :class="isDark" :key="item.value"
              @click="changeSelectedViewId(item.value)">
          <jy-tooltip effect="dark" :resize-flag="false" :open-delay="300" :content="item.label" placement="top">
            <el-button
              v-if="selectedViewId !== item.value"
              type="assist"
              plain
              size="mini"
            >
              <span class="private-fund-tag" v-if="item.prodType==='2'">(私募)</span>
              {{ item.label }}
            </el-button>
            <el-button
              v-else
              type="assist"
              size="mini"
              style="opacity: 1"
            >
              <span class="private-fund-tag" v-if="item.prodType==='2'">(私募)</span>
              {{ item.label }}
            </el-button>
          </jy-tooltip>
        </span>
         <span v-for="item in customViewList"  class="tagsBtn" :key="item.value"
              @click="changeSelectedViewId(item.value)">
          <jy-tooltip effect="dark" :resize-flag="false" :open-delay="300" :content="item.label" placement="top">
            <el-button
              v-if="selectedViewId !== item.value"
              type="assist"
              plain
              size="mini"
            >
              <span class="private-fund-tag" v-if="item.prodType==='2'">(私募)</span>
              {{ item.label }}
            </el-button>
            <el-button
              v-else
              type="assist"
              size="mini"
              style="opacity: 1"
            >
              <span class="private-fund-tag" v-if="item.prodType==='2'">(私募)</span>
              {{ item.label }}
            </el-button>
          </jy-tooltip>
        </span>
      </div>
    </div>
    <!-- 自定义视图 -->
    <!-- <div class="jy_viewer_tabs" v-if="customViewList.length !== 0">
      <div class="tabsBox">
        <span v-if="customViewList.length === 0"> </span>

      </div>
    </div> -->

    <span class="jy_viewer_manage">
      <el-tooltip
      :open-delay="300"
      effect="dark"
      content="编辑当前视图"
      placement="top">
        <span class="iconfont iconfont-bianji1 iconfont-box" @click="goEdit"  style="margin-left: 11px; border: none;">
        </span>
      </el-tooltip>
      <el-tooltip
        :open-delay="300"
        effect="dark"
        content="将当前条件另存为新视图"
        placement="top">
          <span class="iconfont iconfont-lingcunwei iconfont-box" @click="openSaveAsDialog" style=" border: none">
          </span>
      </el-tooltip>
      <el-button  style="margin-left: 11px;" type="primary" size="mini" plain @click="goViews">
        视图管理
      </el-button>
    </span>
  </div>
</template>

<script>
/**
 * @params
 *  defaultViewList Array 默认视图
 *  customViewList Array 自定义视图
 *  selectedViewId String 选中的视图
 * @method
 *  goEdit 点击编辑当前视图按钮
 *  openSaveAsDialog 点击视图另存为按钮
 *  goViews 点击视图管理按钮
 *  changeSelectedViewId 切换视图
 */
import { mapState } from 'vuex'

export default {
  name: 'jy-viewer',
  props: {
    defaultViewList: { // 默认视图
      type: Array,
      default: null
    },
    customViewList: { // 自定义视图
      type: Array,
      default: null
    },
    selectedViewId: { // 自定义视图
      type: String,
      default: ''
    }
  },
  created () {
  },
  computed: {
    ...mapState('d2admin/theme', ['activeName']),
    isDark () {
      return this.$isClient || this.activeName === 'client' ? 'darkTheme' : ''
    }
  },
  methods: {
    goEdit () {
      this.$emit('goEdit')
    },
    openSaveAsDialog () {
      this.$emit('openSaveAsDialog')
    },
    goViews () {
      this.$emit('goViews')
    },
    changeSelectedViewId (viewerId) {
      this.$emit('changeSelectedViewId', viewerId)
    }
  }
}
</script>

<style lang="scss">
.jy_viewer {
  position: relative;
  border-bottom: 4px solid transparent;
  padding: 8px 0;
  min-height: 36px;
  // margin-top: 8px;
  .jy_viewer_manage {
    // width: 176px;
    display: flex;
    align-items: center;
    // height: 35px;
    position: absolute;
    right: 16px;
    top: 10px;
    .iconfont-box{
      @include color(A3);
      cursor: pointer;
      font-size: 18px;
      padding: 5px;
      border-radius: 50%;
      &:hover {
        @include color(A2h);
        @include backgroundColor(A3);
      }
    }
    .iconfont-a-shezhi2 {
      font-size: 19px !important;
    }
  }
  @include borderBottomColor(A1);
  .jy_viewer_title{
    padding: 0 16px 12px;
    font-size: 14px;
    font-weight: 500;
    @include color(A6);
    margin-top: 6px;
  }
  .jy_viewer_tabs {
    margin: 0px 16px;
    display: flex;
    align-items: flex-start;
    position: relative;
    .tabsBox {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      min-width: 100px;
       > span {
        display: inline-block;
        margin: 4px 8px 4px 0;
      }
      .tagsBtn {
        &.tagsBtn1 .el-button{
          background-image: url('./images/W1.png');
          background-size: 12px;
          background-repeat: no-repeat;
          background-position: left top;
          display: flex;
        }
        &.darkTheme.tagsBtn1 .el-button {
          background-image: url('./images/K1.png');
        }
        .el-button {
          width: 90px;
        }
      }
    }
    // padding-right: 140px;
  }
  .private-fund-tag{
    @include color(A18);
  }
}
</style>
