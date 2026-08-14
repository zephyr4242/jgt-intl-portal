<template>
  <div class="portfolio-tab">
    <span @click="switchTab(false)" class="lable-title" :class="{ 'active-title': !isCommon }">全部账户</span>
    <span class="lable-title jgt-ml-8 jgt-mr-8">|</span>
    <span @click="switchTab(true)" class="lable-title" :class="{ 'active-title': isCommon }">常用账户</span>
    <jyHint icon="iconfont-wenhao-fill hint" placement="bottom-start" :offset="50" class="jgt-ml-8" v-if="showHintIcon">
      点击
      <em class="iconfont-tianjiachangyongzhanghu hint-icon" />
      添加到常用账户，点击
      <em class="iconfont-shanchu1 hint-icon" />
      从常用账户移除
    </jyHint>
  </div>
</template>

<script>
import jyHint from '@/components/jy-hint'

export default {
  name: 'PortfolioTab',
  components: {
    jyHint
  },
  props: {
    isCommon: {
      type: Boolean,
      required: true
    },
    // 是否显示提示，默认不显示
    showHintIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    switchTab(val) {
      if (this.isCommon !== val) {
        this.$emit('switchTab', val)
      }
    }
  }

}
</script>

<style lang="scss">
.portfolio-tab {
  flex: 2;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;

  .lable-title {
    cursor: pointer;
    @include color(A8);
  }

  .active-title {
    @include color(A6);
    font-weight: 600;
  }

  .hint {
    @include color(A17);
  }
}
</style>
