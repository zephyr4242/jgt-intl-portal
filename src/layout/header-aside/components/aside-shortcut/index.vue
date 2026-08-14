<!--
  右侧快捷功能
-->
<template>
  <div class="aside-shortcut">
    <div class="aside-shortcut-item" @click="gotoDownload" v-if="isShowClientDownload">
      <i class="iconfont-kehuduan"></i>
      <span class="aside-shortcut-title">客户<br/>端<i class="iconfont-xiazaikehuduan jgt-fs-12"></i></span>
    </div>
    <div class="aside-shortcut-item" @click="gotoAccountMaterials">
      <i class="iconfont-cailiaoqingdan"></i>
      <span class="aside-shortcut-title">开户<br/>材料</span>
    </div>
    <el-popover
      placement="left"
      title="上海基煜基金销售有限公司销售归集账户"
      width="300"
      popper-class="popover-box"
      trigger="hover"
    >
      <div class="shortcut-tooltip">
        <div>公募产品专用销售结算资金账户</div>
        <p>账户名称：上海基煜基金销售有限公司</p>
        <p>开户银行：中国民生银行股份有限公司上海宝山支行</p>
        <p>银行账号：692307023</p>
        <p>大额支付号：305290002383</p>
      </div>
      <div class="shortcut-tooltip">
          <div>私募产品专用销售结算资金账户</div>
          <p>账户名称：上海基煜基金销售有限公司</p>
          <p>开户银行：中国民生银行上海分行营业部</p>
          <p>银行账号：608004552</p>
          <p>大额支付号：305290002012</p>
        </div>
      <div class="aside-shortcut-item" slot="reference">
        <i class="iconfont-jiaoyizhongxin"></i>
        <span class="aside-shortcut-title">账户<br/>信息</span>
      </div>
    </el-popover>
    <el-popover
      placement="left"
      title="基煜基金客服联系方式"
      width="300"
      popper-class="popover-box"
      trigger="hover"
    >
      <div class="jgt-fs-12 jgt-lh-20">
        <p>客服热线：400-820-5369</p>
        <p>客服邮箱：service@jiyufund.com.cn</p>
        <p>传真号码：021-5508-5991</p>
      </div>
      <div class="aside-shortcut-item not-border" slot="reference">
        <i class="iconfont-kefuxinxi"></i>
        <span class="aside-shortcut-title">客服<br/>信息</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  computed: {
    // 是否显示客户端下载按钮
    isShowClientDownload () {
      return !this.$isClient && !this.$isElectron
    }
  },
  methods: {
    gotoDownload () {
      this.util.pushRouterParam('/guide/client-download')
    },
    gotoAccountMaterials () {
      let routeData = this.$router.resolve({
        path: '/account-counter-online'
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.aside-shortcut {
  position: absolute;
  right: 0;
  bottom: 200px;
  width: 36px;
  // 不要超过999，会有可能超过弹框的层级
  z-index: 999;
  .aside-shortcut-item {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    @include backgroundColor(A8);
    border-bottom: 1px solid;
    @include borderColor(A2);
    cursor: pointer;
    color: #FFFFFF;
    &.not-border {
      border: none;
    }
    .aside-shortcut-title {
      display: none;
    }
    &:hover {
      @include color(A2);
      @include backgroundColor(A10);
      & > i {
        display: none;
      }
      .aside-shortcut-title {
        display: block;
      }
    }
  }
}
</style>
<style lang="scss">
div.el-popover.popover-box {
  @include borderTopColor(A10, 1);
}
.shortcut-tooltip {
  font-size: 12px;
  line-height: 20px;
  margin-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  div {
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
