
<template>
  <el-dialog title="提示" :visible.sync="show" @close="close" width="400px" custom-class="relogin-dialog"
    :show-close="false">
    <WarningTips v-if="tips" :icon="false">{{tips}}</WarningTips>
    <WarningTips v-else>您的账号登录超时，请重新登录</WarningTips>
    <div class="jgt-mt-32">
      操作员代码：{{info.operatorCode || util.cookies.get('uuid') }}
    </div>

    <div class="jgt-mt-16">
      <!-- 添加相同name 禁用保存续期移除保存功能 -->
      <form action="" style="padding:0">
      <el-input type="text" style="height:0; width:0;position: absolute;" name="password"/>
      <el-input
        v-model="password"
        :type="inputTypeIsPassword ? 'password' : 'text'"
        placeholder="请输入登录密码"
        name="password"
        maxlength="16"
        v-throttleEnter="confirm"
        autocomplete="new-password"
        readonly
        onfocus="removeAttribute('readonly');"
        onblur="setAttribute('readonly',true);"
      >
        <span slot="suffix" class="input-password-eye">
          <i :class="[inputTypeIsPassword ? 'iconfont-biyan1' : 'iconfont-yanjing']" @click="toggleInputType"/>
        </span>
      </el-input>
    </form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="confirm" :loading="loading">登录</el-button>

      <div class="jgt-mt-8">
        <el-link type="assist" @click="goLogin"> 使用其他账号登录</el-link>
      </div>
    </span>
  </el-dialog>
</template>

<script>

import WarningTips from './WarningTips'
import { mapState } from 'vuex'
import { deferredLogin } from '@/api/intl'
export default {
  name: 'ReloginDialog',
  components: {
    WarningTips
  },
  watch: {
    reloginDialog (val) {
      this.show = val
    }
  },
  computed: {
    ...mapState('d2admin/page', ['reloginDialog']),
    ...mapState('d2admin/user', ['info'])
  },
  data () {
    return {
      loading: false,
      show: false,
      password: '',
      tips: null,
      // 密码输入框type是否为password
      inputTypeIsPassword: true
    }
  },
  methods: {
    async confirm () {
      try {
        if (this.util.isEmpty(this.password)) {
          this.tips = '请输入登录密码'
          return
        } else if (this.password?.indexOf('·') !== -1) {
          this.$message.error('密码格式不符合要求')
          return
        }

        if (this.loading) {
          return
        }
        this.loading = true

        const params = {
          loginPwd: this.util.getRsaCode(this.password),
          handlerBusinessError: true
        }

        const data = await deferredLogin(params)
        if (data.code === '00000000') {
          // 续期成功
          this.util.cookies.remove('channelSourceName')
          this.close()
          location.reload()
        } else if (data.code === '02013006') {
          // 您的账号或密码输入有误（02013006） 重新输入密码
          this.tips = data.msg
        } else if (data.code === '02013010') {
          this.tips = data.msg
        } else {
          // 您的登录信息已过期（02013007）
          // 获取token失败（02046001）
          // 操作员不存在（02013004）
          // 操作员状态不存在（02013030）
          // 此账号已冻结（02013005）
          // 该账号信息变更尚未通过复核（02013028）
          // 该账号信息变更尚未通过复核（02013029）
          // 操作员已删除或已注销（02013031）
          // 登录密码连续输入错误3次（02013010）
          // 弹出到首页
          this.util.cookies.remove('channelSourceName')
          this.$message.error(data.msg)
          this.goLogin()
        }
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    close () {
      // 续期弹窗
      this.show = false
      this.inputTypeIsPassword = true
      this.$store.commit('d2admin/page/setReloginDialog', false)
    },
    /**
     * 切换密码输入框type
     */
    toggleInputType () {
      this.inputTypeIsPassword = !this.inputTypeIsPassword
    },
    goLogin () {
      // 续期成功
      this.util.cookies.remove('channelSourceName')
      this.util.goLoginJGT()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">
.relogin-dialog  {
  a.el-link.el-link--assist.is-underline:after {
    display: none;
  }
  .input-password-eye {
    line-height: 40px;
    i {
      cursor: pointer;
    }
  }
}
</style>
