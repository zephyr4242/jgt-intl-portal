<template>
  <el-tooltip
    effect="dark"
    :content="$t(active ? 'userCloseFullscreen' : 'userOpenFullscreen')"
    placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <d2-icon v-if="active" name="compress"/>
      <d2-icon v-else name="arrows-alt" style="font-size: 16px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('d2admin/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('d2admin/fullscreen', [
      'toggle'
    ])
  }
}
</script>

<style lang="scss">
.header-fullscreen-btn {
  margin-left: 5px !important;
  &:hover {
    @include backgroundColor(A3h);
    color: #f4eaeb !important;
  }
}
</style>
