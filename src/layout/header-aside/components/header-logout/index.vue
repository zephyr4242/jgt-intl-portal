<template>
  <el-tooltip
    class="iconfont-loginOut"
    effect="dark"
    :content="$t('headerLogout')"
    placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="logOff">
      <d2-icon iconfontClass="iconfont-zhuxiao"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.iconfont-zhuxiao{
  font-size: 22px;
  padding: 0;
}
</style>
<style lang="scss">
  button.el-button.iconfont-loginOut{
    margin: 0 !important;
    span{
      text-align: center;
      width: 22px;
      height: 22px;
      display: inline-block;
    }
    .margin{
      margin: 0;
    }
  }
</style>
