 <template>
  <div></div>
</template>
<script>
// 接口
import {
  asyncQueryBatchResult
} from '@/api/intl/legacy/fofund-fap'
export default {
  name: 'JgtNotify',
  props: {
    batchNo: {
      type: String,
      default: ''
    },
    batchType: {
      type: String,
      default: ''
    },
    queryData: {
      type: Function,
      default: null
    }
  },
  watch: {
    batchNo (val, oldVal) {
      if (val && val !== oldVal) {
        if (this.notification) {
          this.notification.close()
        }
        this.init()
      }
    }
  },
  data () {
    return {
      timeTypeName: 'batch',
      batchTypeTips: {
        updateRole: '修改角色',
        batchUpdateRole: '操作员批量修改角色',
        bind: '绑定',
        batchBind: '批量绑定',
        unbind: '解绑',
        batchUnbind: '批量解绑'
      },
      statusTxt: {
        '0': '处理中, 请稍候...',
        '1': '处理中, 请稍候...',
        '2': '成功',
        '9': '失败'
      },
      tilte: {
        '0': '处理中',
        '1': '处理中',
        '2': '成功',
        '9': '失败'
      },
      notification: null
    }
  },
  computed: {
    batchTypeTip() {
      return this.batchTypeTips[this.batchType]
    },
    timeTypeNameKey() {
      return this.timeTypeName + this.batchType
    }
  },
  created () {},
  mounted () {
  },
  methods: {
    init () {
      asyncQueryBatchResult({ batchNo: this.batchNo }).then(res => {
        if (res) {
          if (res.status === '0' || res.status === '1') {
            if (!this.notification) {
              this.createDnotification(res)
            }
            setTimeout(() => {
              this.init()
            }, 1000)
          } else {
            if (this.notification) {
              this.notification.close()
            }
            this.createDnotification(res)
            this.queryData && this.queryData()
            setTimeout(() => {
              this.notification = null
            }, 2900)
          }
        }
      }).catch((error) => {
        console.log(error)
        if (this.notification) {
          this.notification.close()
        }
      })
    },
    // 创建通知窗口
    createDnotification(res) {
      const statusTxt = this.statusTxt[res.status]
      this.notification = this.$notify({
        title: this.tilte[res.status],
        message: this.batchTypeTip + statusTxt,
        duration: res.status !== '2' ? 0 : 3500,
        type: res.status === '2' ? 'success' : res.status === '9' ? 'error' : 'info',
        customClass: 'custom-class-notification'
      })
    }
  }
}
</script>
<style lang="scss">
.custom-class-notification{
  .el-notification__icon {
    &.el-icon-success{
      @include color(A10)
    }
    &.el-icon-error{
      @include color(A18)
    }
    &.el-icon-info{
      @include color(A23)
    }
  }
}

</style>
