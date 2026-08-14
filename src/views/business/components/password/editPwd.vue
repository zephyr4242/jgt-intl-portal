<template>
  <el-dialog
    class="editPwd-dialog"
    :title="`修改${passwordType === '1' ? '交易' : '登录'}密码`"
    :visible.sync="visible"
    width="600px"
    :before-close="closeDialog"
  >
    <!-- 身份验证表单 -->
    <div class="edit-psd-formBody">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        :rules="rules"
        label-width="90px"
        label-position="left"
        class="demo-ruleForm psd-upd-tab editPwd"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input
            type="password"
            maxlength="16"
            v-model="ruleForm.oldPwd"
            autocomplete="off"
            :placeholder="`请输入原${passwordType === '1' ? '交易' : '登录'}密码`"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            maxlength="16"
            v-model="ruleForm.newPwd"
            autocomplete="off"
            :placeholder="`请输入8-16位新${passwordType === '1' ? '交易' : '登录'}密码`"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input
            type="password"
            maxlength="16"
            v-model="ruleForm.checkPwd"
            autocomplete="off"
            :placeholder="`请再次输入8-16位新${passwordType === '1' ? '交易' : '登录'}密码`"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="authCode" class="jgt-mb-0">
          <el-input
            maxlength="6"
            v-model="ruleForm.authCode"
            placeholder="请输入验证码"
          ></el-input>
          <el-link
            type="primary"
            class="sendCode"
            @click="sendCode"
            :disabled="disabledSendCode"
            :underline="false"
            style="width: 100px"
            >{{ sendCodeTxt }}</el-link
          >
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
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="resetPwd" :loading="loading">确 定</el-button>
      <el-button size="medium" @click="closeDialog" type="primary" plain>取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  updatePassword,
  sendAuthCode,
  validateAuthCode
} from '@/api/intl/legacy/bus-jgt-account'
export default {
  props: {
    passwordType: {
      type: String,
      default: '1'
    }
  },
  data () {
    var validateNewPwd = (rule, value, callback) => {
      let title = this.passwordType === '1' ? '新的交易密码' : '新的登录密码'
      let title1 = this.passwordType === '1' ? '原交易密码' : '原登录密码'
      if (value === '') {
        callback(new Error(`请输入${title}`))
      } else if (!this.util.ispasswordFormatRight(value)) {
        callback(new Error(`${title}格式不符合要求`))
      } else {
        if (value === this.ruleForm.oldPwd) {
          callback(new Error(`不可与${title1}相同!`))
        }
        callback()
      }
    }
    var validateOldPwd = (rule, value, callback) => {
      let title1 = this.passwordType === '1' ? '原交易密码' : '原登录密码'
      if (value === '') {
        callback(new Error(`请输入${title1}`))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      let title = this.passwordType === '1' ? '新的交易密码' : '新的登录密码'
      if (value === '') {
        callback(new Error(`请再次输入${title}`))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error(`两次输入${title}不一致!`))
      } else {
        callback()
      }
    }
    var authCodeValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (this.ruleForm.authCodeToken === '') {
        callback(new Error('请先获取验证码'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      ruleForm: {
        newPwd: '',
        checkPwd: '',
        oldPwd: '',
        certNo: '',
        authCode: '',
        authCodeToken: ''
      },
      loading: false,
      // 验证码相关
      sendCodeTxt: '获取验证码',
      disabledSendCode: false,
      rules: {
        oldPwd: [{ required: true, validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }],
        checkPwd: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        authCode: [
          { required: true, validator: authCodeValid, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
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
      if (
        (this.ruleForm.newPwd.length >= 8 && this.ruleForm.newPwd.length <= 16) &&
        (this.ruleForm.oldPwd.length >= 8 && this.ruleForm.oldPwd.length <= 16)
      ) {
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
      this.loading = false
      // if (isSubmit === 'submit') {
      //   this.$emit('submit', '', this.ruleForm.newPwd)
      // }
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
      this.sendCodeTxt = '获取验证码'
    },

    newPwd (reg) {
      let title = this.passwordType === '1' ? '新的交易密码' : '新的登录密码'
      let title1 = this.passwordType === '1' ? '原交易密码' : '原登录密码'
      if (this.ruleForm.newPwd === '') {
        this.$message.error(`请输入${title}`)
        return false
      } else if (!this.util.ispasswordFormatRight(this.ruleForm.newPwd)) {
        this.$message.error(`${title}格式不符合要求`)
        return false
      } else if (this.ruleForm.newPwd === this.ruleForm.oldPwd) {
        this.$message.error(`不可与${title1}相同!`)
        return false
      } else {
        return true
      }
    },
    oldPwd (reg) {
      let title = this.passwordType === '1' ? '原交易密码' : '原登录密码'
      if (this.ruleForm.oldPwd === '') {
        this.$message.error(`请输入${title}`)
        return false
      } else {
        return true
      }
    },
    checkPwd (reg) {
      let title = this.passwordType === '1' ? '新的交易密码' : '新的登录密码'
      if (this.ruleForm.checkPwd === '') {
        this.$message.error(`请再次输入${title}`)
        return false
      } else {
        return true
      }
    },
    /**
     * 获取验证码
     */
    sendCode () {
      const oldPwd = this.oldPwd()
      if (!oldPwd) {
        return false
      }
      const newPwd = this.newPwd()
      if (!newPwd) {
        return false
      }
      const checkPwd = this.checkPwd()
      if (!checkPwd) {
        return false
      }
      sendAuthCode({
        userName: this.util.cookies.get('uuid') || '',
        businessCode: '003',
        requestType: '2'
      }).then((res) => {
        this.ruleForm.authCodeToken = res.authCodeToken
        this.disabledSendCode = true
        this.sendCodeTxt = 60
        let time = setInterval(() => {
          this.sendCodeTxt--
          if (this.sendCodeTxt <= 0 || isNaN(this.sendCodeTxt)) {
            this.sendCodeTxt = '获取验证码'
            this.disabledSendCode = false
            clearInterval(time)
          }
        }, 1000)
      })
    },
    // 重置密码
    resetPwd () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          validateAuthCode({
            authCode: this.ruleForm.authCode,
            authCodeToken: this.ruleForm.authCodeToken,
            userName: this.util.cookies.get('uuid') || '',
            businessCode: '003',
            requestType: '2'
          }).then(res => {
            this.setPassword()
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    setPassword () {
      updatePassword({
        operatorCode: this.util.cookies.get('uuid') || '',
        originalPassword: this.util.getRsaCode(this.ruleForm.oldPwd),
        newPassword: this.util.getRsaCode(this.ruleForm.newPwd),
        passwordType: this.passwordType
      }).then((res) => {
        this.$message.success(`修改${this.passwordType === '1' ? '交易' : '登录'}密码成功`)
        try {
          let loginData = this.util.cookies.get('loginData')
          if (loginData) {
            loginData = JSON.parse(loginData)
            if ((loginData.tradePwdExpired || loginData.loginPwdExpired)) {
              if (this.passwordType === '1') {
                loginData.tradePwdExpired = false
              } else {
                loginData.loginPwdExpired = false
              }
              this.util.cookies.set('loginData', JSON.stringify(loginData))
              setTimeout(() => {
                location.reload()
              }, 1000)
            }
          }
        } catch (error) {
          console.log(error)
        }
        this.closeDialog()
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.submit-btn {
  display: flex;
  justify-content: center;
}
.edit-psd-formBody {
  padding: 30px;
  @include backgroundColor(A1);
  .el-form-item__label {
    padding: 0 12px 0 0 !important;
  }
}
.psd-tab-alert {
  font-size: 14px;
  padding-left: 100px;
  .psd-alert-length,
  .psd-alert-type {
    @include color(A21);
    margin-bottom: 12px;
    &:first-child {
      margin-top: 20px;
    }
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
</style>
<style lang="scss">
.editPwd-dialog {
  // 内容
  .el-dialog__body {
    @include backgroundColor(A2);
    form {
      background-color: transparent !important;
      padding: 0 !important;
      .el-form-item__label {
        padding: 0 12px 0 0 !important;
        font-weight: 400 !important;
      }
      .el-form-item {
        .el-form-item__content {
          position: relative;
          .sendCode {
            position: absolute;
            right: 10px;
            top: 2px;
            // transform: translateY(-50%);
            font-size: 12px;
            @include color(A10);
            font-weight: 400;
          }
        }
      }
    }
  }
  .el-dialog .el-dialog__footer {
    padding: 10px 20px 32px;
  }
}
</style>
