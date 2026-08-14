<template>
  <el-dialog :title="'设置'+typeName+'密码'" :visible.sync="show" @close="close" width="600px" custom-class="reset-pwd">
    <WarningTips v-if="type==='login' && tips" :icon="tips === '由于您的账户首次登录，为了您的账户安全，请您重置登录密码！'">{{tips}}</WarningTips>
    <WarningTips v-if="type==='trade' && tips" :icon="false">{{tips}}</WarningTips>
    <div v-if="type==='trade'" class="jgt-tc">
      <div class="reset-pwd-trade-title">
        <i class="iconfont-icon_xiugaimima"></i>
        设置交易/授权密码
      </div>
      <div>为保证账户&交易安全，当您进行投资交易/账户权限设置时，必须输入此密码</div>
    </div>

    <div class="reset-pwd-input">
      <el-input v-model="pwd" :placeholder="'请输入8-16位'+typeName+'密码'" maxlength="16" type="password" class="jgt-mb-20"
        v-throttleEnter="confirm" @blur="blurCheck" >
      </el-input>
      <el-input v-model="pwd2" :placeholder="'请再次输入8-16位'+typeName+'密码'" maxlength="16" type="password" class="jgt-mb-20"
        v-throttleEnter="confirm" @blur="blurCheck" >
      </el-input>
      <div class="jgt-mb-10 reset-pwd-tips" :class="(pwd.length >= 8 && pwd.length <= 16) ? 'reset-pwd-ok' : ''">
        <i class="el-icon-success jgt-mr-4"></i>
        <span>密码长度为8-16位</span>
      </div>
      <div class="reset-pwd-tips" :class="passwordCount ? 'reset-pwd-ok' : ''">
        <i class="el-icon-success jgt-mr-4"></i>
        <span>包括数字、大写字母、小写字母、英文符号中的两种</span>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="confirm" :loading="loading">确定</el-button>
      <el-button size="medium" type="primary" plain @click="close">取消</el-button>
    </span>

    <ResetLoginDone ref="resetLoginDone" @confirm="loginConfirm" />
    <ResetTradeDone ref="resetTradeDone" />

  </el-dialog>
</template>

<script>
import { passwordReset } from '@/api/intl'
import WarningTips from './WarningTips'
import ResetLoginDone from './ResetLoginDone'
import ResetTradeDone from './ResetTradeDone'

export default {
  name: 'ResetPwd',
  props: ['type', 'goTrade'],
  components: {
    WarningTips,
    ResetLoginDone,
    ResetTradeDone
  },
  computed: {
    typeName () {
      return this.type === 'login' ? '登录' : '交易/授权'
    },
    // 密码规则效验
    passwordCount () {
      let index = 0
      if (/\d/.test(this.pwd)) {
        index++
      }
      if (/[a-z]/.test(this.pwd)) {
        index++
      }
      if (/[A-Z]/.test(this.pwd)) {
        index++
      }
      if (/.*[~!@#$%^&*()_+].*/.test(this.pwd)) {
        index++
      }
      return index >= 2
    }
  },
  data () {
    return {
      show: false,
      loading: false,
      pwd: '',
      pwd2: '',
      tips: this.type === 'login' ? '由于您的账户首次登录，为了您的账户安全，请您重置登录密码！' : null
    }
  },
  methods: {
    blurCheck () {
      if (this.util.notEmpty(this.pwd) && this.util.notEmpty(this.pwd2)) {
        this.checkValid()
      }

      if (this.util.isEmpty(this.pwd) && this.util.isEmpty(this.pwd2)) {
        this.tips = null
      }
    },
    checkValid () {
      this.tips = null
      if (this.pwd.length === 0) {
        this.tips = `请输入新的${this.typeName}密码`
      } else if (!(this.pwd.length >= 8 && this.pwd.length <= 16)) {
        this.tips = '请输入正确的密码，密码长度应为8-16位'
      } else if (!this.passwordCount) {
        this.tips = '请输入正确的密码，密码应包括数字、大写字母、小写字母、英文符号中的两种组合'
      } else if (/\s/.test(this.pwd || '')) {
        this.tips = '请输入正确的密码，密码不能包含空格'
      } else if (this.pwd2.length === 0) {
        this.tips = `请再次输入新的${this.typeName}密码`
      } else if (this.pwd !== this.pwd2) {
        this.tips = '两次新密码输入不一致，请重新输入'
      }
      return this.tips
    },
    async confirm () {
      try {
        if (this.checkValid()) return
        if (this.loading) return
        this.loading = true

        const params = {
          newPassword: this.util.getRsaCode(this.pwd),
          resetPwdType: this.type === 'login' ? '2' : '1',
          token: this.util.cookies.get('token'),
          handlerBusinessError: true
        }
        await passwordReset(params)
        this.show = false
        this.util.resize(600, 275)
        if (this.type === 'login') {
          this.$refs.resetLoginDone.show = true
        } else {
          this.$refs.resetTradeDone.show = true
        }
      } catch (error) {
        this.tips = error.msg
      } finally {
        this.loading = false
      }
    },
    loginConfirm () {
      if (this.goTrade) {
        this.util.resize(600, 424)
        this.$emit('nextStep')
      }
    },
    close () {
      this.pwd = ''
      this.pwd2 = ''
      this.tips = '由于您的账户首次登录，为了您的账户安全，请您重置登录密码！'
      this.show = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.reset-pwd {

  .reset-pwd-input {
    margin: 24px auto 12px auto;
    position: relative;
    width: 340px;
  }

  .reset-pwd-checkbox {
    width: 320px;
    margin: 0 auto;
  }

}
</style>

<style lang="scss">
div.el-dialog.reset-pwd {

  .reset-pwd-tips {
    @include color(A8);
  }

  .reset-pwd-ok {
    @include color(A10);
  }

  .reset-pwd-trade-title {
    font-size: 16px;
    margin-bottom: 12px;
    margin-top: 12px;
    line-height: 20px;
  }
}
</style>
