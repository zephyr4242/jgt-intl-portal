<template>
  <el-dialog title="设备管理" :visible.sync="show" @close="close" width="600px" custom-class="device-mgr">

    <div v-for="i in list" :key="i.id" class="device-mgr-item">
      <div class="device-mgr-item-left">
        <div class="device-mgr-item-left1">
          {{ i.remark }}
        </div>
        <div class="device-mgr-item-left2">
          绑定时间：{{ i.bindTime }}
        </div>
      </div>
      <el-tooltip effect="dark" :disabled="i.clientId !== machineId" content="暂不支持移除当前设备" placement="top"
        :open-delay="300">
        <span>
          <el-button type="assist" plain size="small" @click="unbind(i.id)" :disabled="i.clientId === machineId">
            移除设备绑定
          </el-button>
        </span>
      </el-tooltip>

    </div>
  </el-dialog>
</template>

<script>
import { bindClientList, unbindClient } from '@/api/intl/legacy/bus-jgt-common'
export default {
  name: 'DeviceMgrDialog',
  data () {
    return {
      show: false,
      list: [],
      loading: false,
      unbindLoading: false,
      machineId: null
    }
  },
  watch: {
    show (val) {
      val && this.init()
    }
  },
  mounted () {
    if (this.$isElectron) this.init()
  },
  methods: {
    close () {
      this.show = false
    },
    async init () {
      try {
        this.loading = true
        this.machineId = this.util.getMachineId()
        const data = await bindClientList()
        if (data?.clientList?.length > 0) {
          this.list = data.clientList
        } else {
          this.noDevice()
        }
      } catch (error) {
        this.noDevice()
      } finally {
        this.loading = false
      }
    },
    noDevice () {
      this.list = []
      this.$emit('noDevice')
      this.close()
    },
    async unbind (id) {
      try {
        await this.$confirm('确定要移除当前选中的设备绑定吗？', '提示', {
          confirmButtonText: '移除',
          cancelButtonText: '取消',
          customClass: 'confirmButtonTextClass',
          center: true
        })
        if (this.unbindLoading) return

        this.unbindLoading = true
        const params = {
          clientId: this.machineId,
          id: id
        }
        await unbindClient(params)
        this.$message.success('移除成功')

        const idx = this.list.findIndex(i => i.id === id)
        this.list.splice(idx, 1)
        if (this.list.length === 0) {
          this.noDevice()
        }
      } catch (error) {

      } finally {
        this.unbindLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.device-mgr {
  .device-mgr-item {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    @include borderBottomColor(A2);
    @include backgroundColor(A1);

    &:last-of-type {
      border: none;
    }

    .device-mgr-item-left {
      display: inline-block;
      width: 380px;
      margin-right: 12px;
      vertical-align: middle;

      .device-mgr-item-left1 {
        @include color(A6);
        font-size: 14px;
      }

      .device-mgr-item-left2 {
        @include color(A8);
        font-size: 12px;
      }
    }
  }
}
</style>

<style lang="scss">
div.el-dialog.device-mgr {
  div.el-dialog__body {
    padding: 24px;
  }
}
</style>
