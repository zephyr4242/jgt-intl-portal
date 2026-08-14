<template>
    <el-dialog title="提示" :visible.sync="show" @close="close" width="400px" custom-class="duplicate-login">
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
            <el-form-item label="证件类型">
                <el-select v-model="form.certType">
                    <el-option v-for="item in dict" :label="item.label" :value="item.value" :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号码">
                <el-input v-model="form.userName" placeholder="请输入证件号码" style="width:237px;"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="login" :disabled="util.isEmpty(form.userName)">确定
            </el-button>
            <el-button size="medium" type="primary" plain @click="close">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { CERT_ENUM } from './config'

export default {
  name: 'DuplicateLogin',
  mounted () {
  },
  data () {
    return {
      show: false,
      form: {
        certType: '0',
        userName: ''
      },
      dict: CERT_ENUM
    }
  },
  methods: {
    login () {
      this.$emit('login', this.form)
      this.show = false
    },

    close () {
      this.form = {
        certType: '0',
        userName: ''
      }
      this.show = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">

.el-dialog.duplicate-login .el-dialog__body form{
    padding: 24px 0;

}

</style>
