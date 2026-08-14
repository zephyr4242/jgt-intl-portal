<template>
  <el-popover :placement="placement" width="256" v-model="visible"  popper-class="popover-box">
    <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px">
      {{ title }}
    </div>
    <div style="font-size: 14px; margin-bottom: 20px">{{ tips }}</div>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="primary" @click="confirm" v-if="hasConfirm">
        确定
      </el-button>
      <el-button
        size="mini"
        type="primary"
        @click="visible = false"
        plain
        v-if="hasCancel"
      >
        取消
      </el-button>
    </div>
    <!-- 仅支持在列表中使用，否则应该用el-button -->
      <span slot="reference" style="padding:0">
        <slot>
          <el-button size="mini" type="text">
            {{ text }}
          </el-button>
        </slot>
      </span>
  </el-popover>
</template>

<script>
export default {
  name: 'jy-popover',
  props: {
    title: {
      type: String,
      require: false,
      default: '提示'
    },
    tips: {
      type: String,
      require: true
    },
    hasCancel: {
      type: Boolean,
      require: false,
      default: true
    },
    hasConfirm: {
      type: Boolean,
      require: false,
      default: true
    },
    text: {
      type: String,
      require: true
    },
    placement: {
      type: String,
      require: false,
      default: 'bottom-end'
    }
  },
  data () {
    return {
      visible: false
    }
  },

  methods: {
    confirm () {
      this.visible = false
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
