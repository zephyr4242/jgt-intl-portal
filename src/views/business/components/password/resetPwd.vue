<template>
  <el-dialog class="resetDia" :title="resetPwdForm.pwdType === '1' ? '重置交易密码' : '重置登录密码'" :visible.sync="visible" width="600px" :before-close="closeDialog">
    <div v-show="isReset">
      <div class="reset-header">
        <div>
          <i :class="`iconfont-${resetPwdForm.pwdType === '1' ? 'jiaoyimima' : 'jiaoyimimabeifen2'}`"></i>
          重置{{resetPwdForm.pwdType === '1' ? '交易' : '登录'}}密码
        </div>
        <div class="resetMessage">由于您的账户是首次登录，为了您的账户安全，请重置{{resetPwdForm.pwdType === '1' ? '交易' : '登录'}}密码！</div>
      </div>
      <!-- 身份验证表单 -->
      <div class="reset-psd-formBody">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          :rules="rules"
          label-width="70px"
          class="demo-ruleForm psd-upd-tab">
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password"  maxlength="16" v-model="ruleForm.newPwd" autocomplete="off" :placeholder="`请输入8-16位新${resetPwdForm.pwdType === '1' ? '交易' : '登录'}密码`"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPwd">
            <el-input type="password"  maxlength="16" v-model="ruleForm.checkPwd" autocomplete="off" :placeholder="`请再次输入8-16位新${resetPwdForm.pwdType === '1' ? '交易' : '登录'}密码`"></el-input>
          </el-form-item>
          <div class="psd-tab-alert">
            <div :class="`psd-alert-length ${className[0]}`">
              <i class="el-icon-success"></i>
              <span>密码长度为8-16位</span>
            </div>
            <div :class="`psd-alert-type ${className[1]}`">
              <i class="el-icon-success"></i>
              <span>包括数字、大写字母、小写字母、英文符号中的两种</span>
            </div>
          </div>
        </el-form>
        <el-row class="jgt-button-margin submit-btn">
          <el-button type="primary" @click="resetPwd">确 定</el-button>
          <el-button @click="closeDialog" type="primary" plain >取 消</el-button>
        </el-row>
      </div>
    </div>
    <div v-show="!isReset && resetPwdForm.errorCode !== 'A0010027'" class="reset-psd-success">
      <div class="success-alert">
        重置成功
        <i class="iconfont-chenggong"></i>
      </div>
      <div class="login-alert">您的{{resetPwdForm.pwdType === '1' ? '交易' : '登录'}}密码重置成功，请重新登录</div>
      <div>
        <el-row class="jgt-button-margin submit-btn">
          <el-button type="primary" @click="closeDialog('submit')">重新登录</el-button>
        </el-row>
      </div>
    </div>
    <div v-show="!isReset && resetPwdForm.errorCode === 'A0010027'" class="reset-psd-success">
      <div class="success-alert">
        重置成功
        <i class="iconfont-chenggong"></i>
      </div>
      <div class="login-alert">您的新{{resetPwdForm.pwdType === '1' ? '交易' : '登录'}}密码已重置成功，请继续设置交易密码</div>
      <div>
        <el-row class="jgt-button-margin submit-btn">
          <el-button type="primary" @click="restTradePwd('submit')">下一步</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { passwordReset } from '@/api/intl/legacy/fofund-fap'
// 首次登录重置密码框
export default {
  data () {
    var validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!this.util.ispasswordFormatRight(value)) {
        callback(new Error('密码格式不符合要求'))
      } else {
        if (value === this.ruleForm.oldPass) {
          callback(new Error('不可与原密码相同!'))
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isReset: true,
      ruleForm: {
        newPwd: '',
        checkPwd: ''
      },
      rules: {
        newPwd: [{ validator: validateNewPwd, trigger: 'blur' }],
        checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    resetPwdForm: {
      pwdType: Object,
      errorCode: Object,
      default: () => {}
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
      }
    },
    /**
     * 密码规则效验
     */
    passwordCount () {
      let index = 0
      if (/\d/.test(this.ruleForm.newPwd)) {
        index++
      }
      if (/[a-z]/.test(this.ruleForm.newPwd)) {
        index++
      }
      if (/[A-Z]/.test(this.ruleForm.newPwd)) {
        index++
      }
      if (/.*[~!@#$%^&*()_+].*/.test(this.ruleForm.newPwd)) {
        index++
      }
      return index >= 2
    },
    className () {
      let data = []
      if (this.ruleForm.newPwd.length >= 8 && this.ruleForm.newPwd.length <= 16) {
        data[0] = 'psd-alert-length psd-alert-length-current'
      } else {
        data[0] = 'psd-alert-length'
      }
      if (this.passwordCount) {
        data[1] = 'psd-alert-type psd-alert-type-current'
      } else {
        data[1] = 'psd-alert-type'
      }
      return data
    }
  },
  methods: {
    // 关闭弹框
    closeDialog (isSubmit) {
      this.visible = false
      this.isReset = true
      if (isSubmit === 'submit') {
        window.location.reload()
      }
      this.$refs['ruleForm'].resetFields()
    },
    // 重置交易密码
    restTradePwd () {
      this.$emit('setDialogVisible', true)
      this.isReset = true
      this.resetPwdForm.pwdType = '1'
      this.resetPwdForm.errorCode = ''
      this.$refs['ruleForm'].resetFields()
    },
    // 重置密码
    resetPwd () {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          console.log(this.ruleForm.newPwd)
          passwordReset({
            newPassword: this.util.getRsaCode(this.ruleForm.newPwd),
            userName: this.resetPwdForm.userName,
            resetPwdType: this.resetPwdForm.pwdType,
            token: this.util.cookies.get('token')
          })
            .then(res => {
              // 重置登录密码后将当前token失效
              if (this.resetPwdForm.pwdType === '2') {
                this.util.cookies.remove('token')
              }
              this.isReset = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.resetDia {
  -webkit-app-region: no-drag;
}
.submit-btn {
  display: flex;
  justify-content: center;
}
.reset-header {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  @include color(A6);
  .resetMessage {
    font-size: 12px;
    font-weight: 400;
    margin-top: 26px;
    @include color(A18);
  }
  i {
    @include color(A6);
    font-size: 16px;
  }
}
.reset-psd-formBody {
  width: 460px;
  margin: 30px auto;
  .demo-ruleForm {
    padding: 0;
  }
}
.psd-tab-alert {
  font-size: 14px;
  padding-left: 70px;
  .psd-alert-length,
  .psd-alert-type {
    @include color(A21);
    margin-bottom: 12px;
    > span {
      margin-left: 7px;
    }
  }
  .psd-alert-length-current {
    @include color(A10);
  }
  .psd-alert-type-current {
    @include color(A10);
  }
}
.reset-psd-success {
  text-align: center;
  margin: 42px auto;
  .success-alert {
    position: relative;
    font-weight: bold;
    font-size: 16px;
    vertical-align: middle;
    @include color(A6);
    > i {
      margin-right: 8px;
      position: absolute;
      left: 50%;
      vertical-align: middle;
      transform: translateX(-320%);
      top: 2px;
      @include color(A10);
    }
  }
  .login-alert {
    margin-top: 34px;
  }
}
</style>
<style lang="scss">
.resetDia {
  .el-form-item__label {
    padding-right: 8px !important;
  }
}
</style>
