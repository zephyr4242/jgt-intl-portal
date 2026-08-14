<template>
  <d2-container>
    <div class="biz-placeholder">
      <h2 class="biz-placeholder__title">{{ $t(titleKey) }}</h2>
      <p class="biz-placeholder__desc">{{ $t(descKey) }}</p>
      <el-button type="primary" plain size="small" @click="$router.push('/index')">
        {{ $t('navHome') }}
      </el-button>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'BizPlaceholder',
  props: {
    titleKey: { type: String, required: true },
    descKey: { type: String, required: true }
  }
}
</script>

<style scoped>
.biz-placeholder {
  padding: 32px 24px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}
.biz-placeholder__title {
  margin: 0 0 12px;
  font-size: 22px;
  color: #1a2d4a;
}
.biz-placeholder__desc {
  margin: 0 0 20px;
  color: #666;
  line-height: 1.6;
}
</style>
