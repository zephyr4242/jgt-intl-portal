<template>
  <el-dialog
    :title="`重置${type ? '交易' : '登录'}密码`"
    :visible.sync="visible"
    width="600px"
    :before-close="closeDialog"
    class="forget-pwd-container"
  >
    <!-- 步骤条 -->
    <el-steps :active="activeNum" align-center>
      <el-step title="身份验证" :icon="activeList[0] ? 'el-icon-success' : 'el-icon-remove'"></el-step>
      <el-step title="设置新密码" :icon="activeList[1] ? 'el-icon-success' : 'el-icon-remove'"></el-step>
      <el-step title="重置成功" :icon="activeList[2] ? 'el-icon-success' : 'el-icon-remove'"></el-step>
    </el-steps>
    <!-- 身份验证表单 -->
    <div v-if="activeNum === 0" class="reset-psd-formBody">
      <el-form :model="form" :rules="rulesId" ref="form" label-width="100px" style="padding: 0;background: transparent;">
        <el-form-item :label="hideLabel?'':'姓名'" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item :label="hideLabel?'':'证件类型'" prop="certType">
          <select-dict name="A2002" v-model="form.certType" key="CertTypeEnum"></select-dict>
        </el-form-item>
        <el-form-item :label="hideLabel?'':'证件号码'" prop="certNo">
          <el-input maxlength="30" v-model="form.certNo" placeholder="请输入证件号码"></el-input>
        </el-form-item>
        <el-form-item :label="hideLabel?'':'手机号'" prop="mobile">
          <el-input maxlength="11" v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item :label="hideLabel?'':'验证码'" prop="authCode" class="jgt-mb-0">
          <el-input maxlength="6" v-model="form.authCode" placeholder="请输入验证码"></el-input>
          <el-link type="primary" class="sendCode" :class="hideLabel?'sendCode-in':''" @click="sendCode" :disabled="disabledSendCode" :underline="false" style="width:100px">{{sendCodeTxt}}</el-link>
          <!-- <el-button type="text" class="sendCode" @click="sendCode" :disabled="disabledSendCode">{{sendCodeTxt}}</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 设置新密码表单 -->
    <div v-else-if="activeNum === 1" class="reset-psd-formBody">
      <el-form
        :model="pwdForm"
        ref="pwdForm"
        :rules="pwdRules"
        label-width="100px"
        class="demo-ruleForm psd-upd-tab"
        style="padding: 0;background: transparent;">
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password"  maxlength="16" v-model="pwdForm.newPwd" :placeholder="`请输入8-16位新${type ? '交易' : '登录'}密码`"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password"  maxlength="16" v-model="pwdForm.checkPwd" :placeholder="`请再次输入8-16位新${type ? '交易' : '登录'}密码`"></el-input>
        </el-form-item>
        <div class="psd-tab-alert">
          <div class="psd-alert-length" ref="psdLength">
            <i class="el-icon-success"></i>
            <span>密码长度为8-16位</span>
          </div>
          <div class="psd-alert-type" ref="psdType">
            <i class="el-icon-success"></i>
            <span>包括数字、大写字母、小写字母、英文符号中的两种</span>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 重置成功 -->
    <div class="reset-psd-success" v-else-if="activeNum === 2">
      <div class="success-alert">
        重置成功
        <i class="iconfont-chenggong"></i>
      </div>
      <div class="login-alert">您的{{type ? '交易' : '登录'}}密码重置成功，请重新登录</div>
      <div>
        <el-row class="jgt-button-margin submit-btn">
          <el-button type="primary" @click="goNext">重新登录</el-button>
        </el-row>
      </div>
    </div>
    <div v-if="activeNum !== 2" slot="footer" class="dialog-footer">
      <el-row class="jgt-text-center">
          <el-button size="medium" type="primary" @click="goNext('form')">确定</el-button>
          <el-button size="medium" type="primary" plain @click="closeDialog">取消</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { forgotPassword, passwordReset } from '@/api/intl/legacy/fofund-fap'
import { sendAuthCode } from '@/api/intl/legacy/bus-jgt-account'
import { mapActions } from 'vuex'
// 忘记密码框、重置密码框
export default {
  name: 'forget-pwd',
  data () {
    let phoneReg = /^1[3456789]\d{9}$/
    // 修改为证件号码验证，允许数字+字母6-30位
    let idReg = /[0-9a-zA-Z]{6,30}/
    var userNameValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('证件号码不能为空'))
      } else if (!idReg.test(value)) {
        callback(new Error('证件号码格式不正确'))
      } else {
        callback()
      }
    }
    var mobileValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      } else if (!phoneReg.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    var authCodeValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (this.form.authCodeToken === '') {
        callback(new Error('请先获取验证码'))
      } else {
        callback()
      }
    }
    var validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!this.util.ispasswordFormatRight(value)) {
        callback(new Error('密码格式不符合要求'))
      } else {
        callback()
      }
    }
    var validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeNum: 0,
      activeList: [false, false, false],
      form: this.createdForm(),
      rulesId: {
        userName: [ { required: true, message: '姓名不能为空', trigger: 'blur' } ],
        certNo: [{ required: true, validator: userNameValid, trigger: 'blur' }],
        mobile: [{ required: true, validator: mobileValid, trigger: 'blur' }],
        authCode: [{ required: true, validator: authCodeValid, trigger: 'blur' }],
        certType: [{ required: true, message: '证件类型不能为空', trigger: 'blur' }]
      },
      timer: null,
      pwdRules: {
        newPwd: [{ validator: validateNewPwd, trigger: 'blur' }],
        checkPwd: [{ validator: validatePwd2, trigger: 'blur' }]
      },
      pwdForm: this.createdPwdForm(),
      // 验证码相关
      sendCodeTxt: '获取验证码',
      disabledSendCode: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: false
    },
    pwdType: {
      type: String,
      required: false
    },
    hideLabel: {
      type: Boolean,
      required: false,
      default: false
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
    type () {
      return this.pwdType === '1'
    },
    /**
     * 密码规则效验
     */
    passwordCount () {
      let index = 0
      if (/\d/.test(this.pwdForm.newPwd)) {
        index++
      }
      if (/[a-z]/.test(this.pwdForm.newPwd)) {
        index++
      }
      if (/[A-Z]/.test(this.pwdForm.newPwd)) {
        index++
      }
      if (/.*[~!@#$%^&*()_+].*/.test(this.pwdForm.newPwd)) {
        index++
      }
      return index >= 2
    }
  },
  watch: {
    // 监听进度条
    activeNum (val) {
      for (let index = 0; index < val; index++) {
        this.activeList[index] = true
      }
    },
    pwdForm: {
      handler (val) {
        if (this.util.isEmpty(this.$refs.psdLength)) {
          return false
        }
        if (val.newPwd.length >= 8 && val.newPwd.length <= 16) {
          this.$refs.psdLength.className = 'psd-alert-length psd-alert-length-current'
        } else {
          this.$refs.psdLength.className = 'psd-alert-length'
        }
        if (this.passwordCount) {
          this.$refs.psdType.className = 'psd-alert-type psd-alert-type-current'
        } else {
          this.$refs.psdType.className = 'psd-alert-type'
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    createdPwdForm () {
      return {
        newPwd: '',
        checkPwd: ''
      }
    },
    createdForm () {
      return {
        userName: '',
        certNo: '',
        mobile: '',
        authCode: '',
        authCodeToken: '',
        certType: '0'
      }
    },
    verificationCertNo (value) {
      let idReg = /[0-9a-zA-Z]{6,30}/
      if (!value) {
        this.$message.warning('证件号码不能为空')
        return false
      } else if (!idReg.test(value)) {
        this.$message.warning('证件号码格式不正确')
        return false
      } else {
        return true
      }
    },
    mobileValidFn (value) {
      let phoneReg = /^1[3456789]\d{9}$/
      if (!value) {
        this.$message.warning('手机号码不能为空')
        return false
      } else if (!phoneReg.test(value)) {
        this.$message.warning('手机号码格式不正确')
        return false
      } else {
        return true
      }
    },
    /**
     * 获取验证码
     */
    sendCode () {
      if (!this.form.userName) {
        this.$message.warning('姓名不能为空')
        return false
      }
      if (!this.form.certType) {
        this.$message.warning('证件类型不能为空')
        return false
      }
      let isContinue = this.verificationCertNo(this.form.certNo)
      if (!isContinue) {
        return false
      }
      isContinue = this.mobileValidFn(this.form.mobile)
      if (!isContinue) {
        return false
      }
      sendAuthCode({
        businessCode: '002',
        userName: this.form.certNo,
        requestType: '2'
      })
        .then(res => {
          this.form.authCodeToken = res.authCodeToken
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
    // 下一步
    goNext () {
      let formName = ''
      switch (this.activeNum) {
        case 0:
          formName = 'form'
          break
        case 1:
          formName = 'pwdForm'
          break
        case 2:
          // 最后一步点击重新登录
          this.closeDialog()
          if (this.$route.path === '/elogin') {
            this.form = this.createdForm()
            this.pwdForm = this.createdPwdForm()
          } else {
            // 登出
            this.logout({ confirm: false })
          }
          return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.activeNum === 0) {
            // 验证操作员信息
            forgotPassword(this.form)
              .then(res => {
                this.form.token = res.token
                this.activeNum += 1
                this.util.resize(600, 428)
              })
          } else if (this.activeNum === 1) {
            // 重置密码
            passwordReset({
              newPassword: this.util.getRsaCode(this.pwdForm.newPwd),
              userName: this.form.userName,
              resetPwdType: this.type ? '1' : '2',
              token: this.form.token
            })
              .then(res => {
                this.activeNum += 1
                this.util.resize(600, 371)
              })
          }
        }
      })
    },
    /**
     * 关闭弹框
     */
    closeDialog () {
      this.visible = false
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.$refs['pwdForm'] && this.$refs['pwdForm'].resetFields()
      this.sendCodeTxt = '获取验证码'
      this.activeNum = 0
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.forget-pwd-container {
  .reset-psd-formBody .el-select{
    width: 340px;
  }
  .reset-psd-formBody .el-form{
    transform: translateX(-50px);
    .el-form-item {
      .el-form-item__content{
        margin-left: 120px !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.submit-btn {
  display: flex;
  justify-content: center;
}
.reset-psd-formBody {
  width: 460px;
  margin: 20px auto;
  .sendCode {
    position: absolute;
    left: 336px;
    top: 4px;
    font-size: 12px;
  }

  .sendCode.sendCode-in{
    position: absolute;
    left: 248px;
    top: 4px;
    font-size: 12px;
  }
}
.psd-tab-alert {
  font-size: 14px;
  padding-left: 100px;
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
    @include color(A10);
    font-weight: bold;
    font-size: 16px;
    vertical-align: middle;
    > i {
      @include color(A10);
      margin-right: 8px;
      position: absolute;
      left: 50%;
      vertical-align: middle;
      transform: translateX(-320%);
      top: 2px;
    }
  }
  .login-alert {
    margin-top: 34px;
  }
}
</style>
