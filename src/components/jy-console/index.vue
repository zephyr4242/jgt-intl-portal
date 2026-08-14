<!--
  客户端控制台
-->
<template>
  <div>
    <el-dialog
      title="打开控制台"
      :before-close="() => toggleConsole(false)"
      :visible.sync="passwordVisible"
      width="400px"
    >
      <div>
        <el-input
          v-model="password"
          type="password"
          autocomplete="off"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="() => toggleConsole(false)">取 消</el-button>
        <el-button type="primary" @click="openDevTools">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 开发小工具 -->
    <!-- <jy-handle-devTools v-show="isDevToolsOpened" />-->
  </div>
</template>

<script>
// import jyHandleDevTools from '@/components/jy-handle-devTools'
export default {
  name: 'jy-console',
  components: {
    // jyHandleDevTools
  },
  data () {
    return {
      // 控制台密码弹框
      passwordVisible: false,
      password: '',
      // 控制台是否打开
      isDevToolsOpened: false
    }
  },
  mounted () {
    if (window.ipcRenderer) {
      // 获取控制台状态
      window.ipcRenderer.on('getDevToolsStatus', (_event, isDevToolsOpened) => {
        this.isDevToolsOpened = isDevToolsOpened
      })

      // 发送 获取控制台状态
      window.ipcRenderer.send('is-devtools-opened')

      // 监听打开控制台动作
      window.ipcRenderer.on('want-openDevtools', () => {
        this.toggleConsole(true)
      })
    }
  },
  methods: {
    // 控制台密码框显示隐藏
    toggleConsole (flag = false) {
      this.passwordVisible = flag
      this.password = ''
    },
    // 输入密码打开控制台
    openDevTools () {
      if (this.password === 'qazqaz11') {
        window.ipcRenderer.send('open-devTools')
        this.toggleConsole(false)
      } else {
        this.$message.error('密码错误')
      }
    }
  },
  beforeDestroy () {
    if (window.ipcRenderer) {
      window.ipcRenderer.removeAllListeners('getDevToolsStatus')
      window.ipcRenderer.removeAllListeners('want-openDevtools')
    }
  }
}
</script>
