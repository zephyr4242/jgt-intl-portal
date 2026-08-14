<!--
   切换远端地址
-->
<template>
    <div>
      <el-dialog
        title="请输入密码"
        :before-close="hidePwdDialog"
        :visible.sync="pwdDialogVisible"
        width="400px"
      >
        <div>
          <el-input
            v-model="password"
            type="password"
            autocomplete="off"
            @keyup.enter.native="confirmPwd"
          ></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePwdDialog">取 消</el-button>
          <el-button type="primary" @click="confirmPwd">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="请选择远端环境"
        :before-close="() => switchDialogVisible = false"
        :visible.sync="switchDialogVisible"
        width="400px"
      >
        <div>
            <el-radio-group v-model="env" size="small">
                <el-radio-button label="prod"> 生产 </el-radio-button>
                <el-radio-button label="uat"> uat </el-radio-button>
                <el-radio-button label="test"> 测试 </el-radio-button>
                <el-radio-button label="dev"> 开发 </el-radio-button>
            </el-radio-group>
            <el-input v-model="sp" placeholder="请输入迭代号，否则进入主环境" v-if="env === 'test' || env === 'dev'" size="small" class="jgt-mt-10"></el-input>
            <div v-else style="height:42px"> </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="() => switchDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSwitch">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </template>

<script>
export default {
  name: 'jy-remote-switch',
  components: {
  },
  data () {
    return {
      pwdDialogVisible: false,
      password: '',

      switchDialogVisible: false,
      env: 'prod',
      sp: ''
    }
  },
  mounted () {
    if (window.ipcRenderer) {
    // 监听打开切换远端
      window.ipcRenderer.on('begin-switch-env', () => {
        this.pwdDialogVisible = true
        this.password = ''
        this.switchDialogVisible = false
      })
    }
  },
  methods: {
    showSwitchDialog () {
      this.pwdDialogVisible = false
      this.switchDialogVisible = true
    },
    hidePwdDialog () {
      this.pwdDialogVisible = false
      this.password = ''
    },
    // 输入密码 打开切换远端地址弹窗
    confirmPwd () {
      if (this.password === 'qazqaz11') {
        this.showSwitchDialog()
      } else {
        this.$message.error('密码错误')
      }
    },
    // 确认切换
    confirmSwitch () {
      let ret = ''
      this.sp = this.sp.trim()
      if (this.env === 'prod') {
        ret = 'https://www.jiyufund.com.cn'
      } else if (this.env === 'uat') {
        ret = 'https://uat.jiyufund.com.cn'
      } else if (this.env === 'test') {
        if (this.util.isEmpty(this.sp)) {
          ret = 'http://www.test.jiyujgt.com'
        } else {
          ret = `http://${this.sp}.ets.test.jiyujgt.com`
        }
      } else if (this.env === 'dev') {
        if (this.util.isEmpty(this.sp)) {
          ret = 'http://www.dev.jiyujgt.com'
        } else {
          ret = `http://${this.sp}.ets.dev.jiyujgt.com`
        }
      }
      if (location.origin === ret) {
        // 域名相同
        this.$message.success('已在该环境')
      } else {
        // 直接跳转
        if (this.sp && ['test', 'dev'].includes(this.env)) {
          // 并行环境的跳转，基于ets-portal的application.properties, 会跳转主环境
          ret = ret + '/openaccount/#/elogin'
        }
        location.href = ret
      }
    }
  },
  beforeDestroy () {
    if (window.ipcRenderer) {
      window.ipcRenderer.removeAllListeners('begin-switch-env')
    }
  }
}
</script>
