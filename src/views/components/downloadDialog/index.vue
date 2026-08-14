<template>
  <!--导出数据下载-->
  <DownloadModal class="download-dialog" :dialogTableVisible.sync="visible" :showCloseIcon="true" :mask="true"
    width="800px" @onModalClose='onModalClose'>
    <template #header>请选择导出方式</template>
    <template>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="获取方式" prop="exportMethod">
          <el-select v-model="form.exportMethod" placeholder="请选择获取方式" @change="queryConfig">
            <el-option label="本地下载" value="1"></el-option>
            <el-option label="深证通" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.exportMethod === '2'" label="发送路径" prop="exportAddress">
          <el-input maxlength="200" clearable="clearable" v-model="form.exportAddress"  placeholder="请输入发送路径" ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="download-assessment-dialog-footer">
        <el-button class="sunbmit-risk" type="primary" size="medium" :loading="loading" @click="validFun('form')">确定</el-button>
        <el-button class="sunbmit-risk" size="medium" type="primary" plain @click="onModalClose">取消</el-button>
      </div>
    </template>
  </DownloadModal>
</template>
<script>
import DownloadModal from '@/views/components/jgt-modal'
import { queryOperatorSendConfig } from '@/api/intl/legacy/bus-jgt-account'
import { orderBatchExport } from '@/api/intl/legacy/bus-jgt-trade'
// 邮箱
export default {
  name: 'bonus-dialog-component',
  components: { DownloadModal },
  props: {
    // 是否显示关闭小图标
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    // 是否开启背景遮罩层
    mask: {
      type: Boolean,
      default: true
    },
    requestData: {
      type: Array,
      default: () => []
    },
    exportType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      errorFlag: false,
      riskToleranceSelector: '',
      additionalQueObj: {},
      form: {
        exportMethod: '1',
        exportAddress: ''
      },
      rules: {
        exportAddress: [{ required: true, message: '发送路径不能为空', trigger: 'blur' }]
      }
    }
  },
  async mounted() {
  },
  methods: {
    queryConfig(val) {
      if (val === '2') {
        queryOperatorSendConfig().then((res) => {
          if (res) {
            this.form.exportAddress = res.sendFdepAddress || ''
          }
        })
        return false
      }
      this.form.exportAddress = ''
    },
    // 表单验证
    validFun (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) { return false } else {
          this.onSubmit()
        }
      })
    },
    onSubmit() {
      const params = {
        ...this.form,
        exportType: this.exportType
      }
      if (params.exportMethod === '1') {
        delete params.exportAddress
      }
      if (params.exportType === '1') {
        params.tradeOrderFundList = this.requestData.map(item => {
          return {
            fundCode: item.fundCode,
            businFlag: '022',
            requestBala: item.investAmt,
            dividendMethod: ''
          }
        })
      } else {
        params.tradeOrderFundList = this.requestData.map(item => {
          return {
            fundCode: item.fundCode,
            businFlag: item.businFlag,
            requestBala: item.requestBala,
            dividendMethod: item.dividendMethod
          }
        })
      }
      orderBatchExport(params).then(() => {
        if (params.exportMethod === '1') {
          this.$message.success('生成中...')
          this.goDownload()
        } else {
          this.$message.success('发送成功')
        }
        this.onModalClose()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 跳转单据生成记录
    goDownload () {
      const url = `/personal-center/download-records`
      const options = {
        url: url,
        tab: '单据生成记录',
        menu: 'DANJUSHENGCHENGJILU',
        push: true
      }
      this.util.fapRouter(options)
    },
    onModalClose() {
      this.$refs['form'].resetFields()
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
 .download-assessment-dialog-footer {
    text-align: center;
    overflow: hidden;
    .sunbmit-risk {
      margin: 0 11px;
      margin-bottom: 24px;
    }
 }
</style>
