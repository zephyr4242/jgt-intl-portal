<template>
  <el-dialog title="绑定客户端" :visible.sync="show" @close="close" width="600px" custom-class="first-login">
    <WarningTips v-if="tips" :icon="false">{{tips}}</WarningTips>
    <WarningTips v-else-if="afterSendCode" :icon="false">
        我们已发送验证码短信到登录账户的手机号码{{ mobile | encrypt}}
    </WarningTips>
    <WarningTips v-else>由于您的账号首次在此设备上使用，为了您的账户安全，需要您完成验证操作！</WarningTips>

    <div class="first-login-input">
      <el-input v-model="code" placeholder="请输入短信验证码" maxlength="6" v-throttleEnter="login">
      </el-input>
      <el-link type="assist" class="first-login-sendcode" @click="sendCode" v-if="time === 0">
        发送验证码
      </el-link>
      <span v-else class="first-login-time">{{time}}</span>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="login('1')" :loading="loading">绑定并登录</el-button>
      <el-button size="medium" type="primary" plain @click="login('2')" :loading="loading">不绑定直接登录</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { sendAuthCode, validateAuthCode } from '@/api/intl'
import WarningTips from './WarningTips'

export default {
  name: 'BindingClient',
  props: ['loginType', 'userName', 'mobile'],
  components: {
    WarningTips
  },
  data () {
    return {
      loading: false,
      show: false,
      code: '',
      tips: null,
      authCodeToken: null,
      afterSendCode: false, // 是否已发送验证码
      time: 0, // 验证码剩余时间
      timer: null // 验证码倒计时定时器
    }
  },
  methods: {
    async sendCode () {
      try {
        const params = {
          userName: this.loginType === '1' ? this.userName : '',
          mobile: this.loginType === '1' ? '' : this.util.getRsaCode(this.mobile),
          businessCode: '099',
          requestType: this.loginType === '1' ? '2' : '1',
          handlerBusinessError: true
        }

        const data = await sendAuthCode(params)
        this.$emit('authCodeToken', data?.authCodeToken)
        this.authCodeToken = data?.authCodeToken
        this.afterSendCode = true

        this.time = 60

        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.time <= 0) {
            clearTimeout(this.timer)
            return
          }
          this.time--
        }, 1000)
      } catch (error) {
        this.tips = error.msg
      }
    },
    async login (needBind) {
      if (!this.code) {
        this.tips = '验证码不能为空'
        return false
      }
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        const params = {
          authCode: this.code,
          authCodeToken: this.authCodeToken,
          userName: this.loginType === '1' ? this.userName : '',
          mobile: this.loginType === '1' ? '' : this.util.getRsaCode(this.mobile),
          businessCode: '099',
          requestType: this.loginType === '1' ? '2' : '1',
          handlerBusinessError: true
        }
        await validateAuthCode(params)
        this.$emit('login', needBind)
        this.close()
      } catch (error) {
        this.tips = error.msg
        try {
          this.$jgtSensorsTrack.machineBind({
            errTips: this.tips
          })
        } catch (error) {

        }
      } finally {
        this.loading = false
      }
    },
    close () {
      this.code = ''
      this.authCodeToken = null
      this.afterSendCode = false
      this.needBind = false
      this.time = 0
      this.show = false
      this.tips = null
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.first-login {

  .first-login-input {
    margin: 32px auto 12px auto;
    position: relative;
    width: 320px;

    .first-login-sendcode {
      position: absolute;
      top: 10px;
      right: 16px;
    }

    .first-login-time {
      position: absolute;
      right: 12px;
      top: 12px;
      @include color(A6);
      opacity: 0.3;
    }
  }

  .first-login-checkbox {
    width: 320px;
    margin: 0 auto;
  }

}
</style>

<style lang="scss">
a.first-login-sendcode.el-link.el-link--assist.is-underline:after {
  display: none;
}
</style>
