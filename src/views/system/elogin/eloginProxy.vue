<template>
    <div>
        <el-form ref="form" :model="form" label-width="0">
            <el-form-item label>
                <el-input v-model="form.privateUrl" placeholder="专线地址">
                    <el-select
                        v-model="form.privateUrlPrefix"
                        slot="prepend"
                        placeholder="请选择"
                        style="width:80px"
                    >
                        <el-option label="http" value="http://"></el-option>
                        <el-option label="https" value="https://"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
        </el-form>

        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
            <el-button type="assist" style="width:100px;" @click="confirm">确定</el-button>
            <el-button type="assist" plain style="width:100px;" @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'elogin-proxy',
  data () {
    return {
      form: {
        privateUrl: null,
        privateUrlPrefix: 'http://'
      }
    }
  },
  methods: {
    confirm () {
      this.setPrivate()
      this.$emit('close')
    },

    cancel () {
      this.$emit('close')
    },

    // 设置代理
    setPrivate () {
      if (this.util.isElectron() && this.form.privateUrl) {
        window.ipcRenderer.send('privateUrl_changed', this.form.privateUrlPrefix + this.form.privateUrl, window.CONFIG.VUE_APP_API)
        console.log('已设置代理为' + this.form.privateUrlPrefix + this.form.privateUrl)
      }
    }

  }
}
</script>
