<template>
  <div v-bind="$attrs">
    <!-- 编辑模式 -->
    <div v-if="editMode" class="money-edit">
      <div class="money-cn-number" :class="{ firstRow:index === 0 }" v-show="isFocus">
        {{ util.Arabia_To_SimplifiedChinese(temp) || "--"}}
      </div>
      <el-input size="mini" v-model="temp" style="width:calc(100% - 100px)" clearable
        @keydown.enter.native="moneyEditChange" :maxlength="maxLength"
        @input="temp = util.inputNumber(temp, inputOptions)" @focus="focusChange(true)" @blur="focusChange(false)"
        ref="input">
      </el-input>
      <el-button type="assist" size="mini" @click="moneyEditChange" style="margin-right:8px" class="money-btn">
        确定
      </el-button>
      <el-button type="assist" size="mini" plain class="money-btn" @click="revert">
        取消
      </el-button>
    </div>
    <!-- 查看模式 -->
    <div v-else style="text-align: right;">
      {{ util.isEmpty(raw) ? nullText : util.thousands(raw) }}
      <el-button type="text" icon="iconfont-bianji" @click="startEdit"></el-button>
    </div>
  </div>
</template>
<script>

// table监听 moneyEditChange 事件处理用户真实的输入事件

// 外层table添加 避免只有一行时，hover 的tooltip无法显示全
// .money-edit-table {
//   .el-table__body-wrapper {
//     min-height: 80px;
//   }
// }

// 注意输入文字的中文翻译比较长,默认宽度在小屏可能出现显示不全的情况
// 如果输入列后面没有操作列（移除按钮等），则会显示不全
// 举例如果支持千亿整数，该输入控件需要宽度>320
// 可以在外层配置fixedWidth: 320
export default {
  name: 'MoneyEdit',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  data () {
    return {
      editMode: false, // 是否编辑模式
      isFocus: false, // 是否获取焦点
      index: null,
      raw: null, // 原始值
      temp: null, // 临时值
      row: null,
      maxLength: 11,
      inputOptions: null, // 允许的输入，几位小数等  参考util.inputNumber  默认只允许正整数
      nullText: '--'
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = this.prop?.row ?? {}
      const prop = this.prop?.column?.prop
      this.nullText = this.prop?.column?.nullText ?? '--' // 无数据时显示文字
      this.raw = (prop && data[prop]) ?? null
      this.row = data
      this.index = this.prop?.index

      this.maxLength = this.prop?.column?.maxLength ?? 11
      this.inputOptions = this.prop?.column?.inputOptions
    },

    moneyEditChange () {
      this.$emit('moneyEditChange', this.prop, this.temp)
      this.editMode = false
    },

    revert () {
      this.temp = this.raw
      this.editMode = false
    },

    focusChange (val) {
      this.isFocus = val
    },

    startEdit () {
      this.temp = this.raw
      this.editMode = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.money-edit {
  padding: 0 4px;

  .money-btn {
    padding: 3px 11px;
  }

  .money-cn-number {
    font-size: 12px;
    @include backgroundColor(A2h);
    border-radius: 2px;
    border: 1px solid transparent;
    @include color(A6);
    @include borderColor(A10);
    padding: 5px;
    position: absolute;
    top: -22px;
    z-index: 10;

    &::after {
      content: " ";
      height: 1px;
      width: 4px;
      border: 4px solid transparent;
      position: absolute;
      left: 4px;
      bottom: -8px;
      @include borderTopColor(A2h);
    }
    &::before {
      content: " ";
      height: 7px;
      width: 7px;
      border-top: 1px solid transparent;
      border-right: 1px solid transparent;
      position: absolute;
      @include borderColor(A10);
      transform: rotate(135deg);
      bottom: -5px;
      left: 6px;
    }

    &.firstRow {
      top: 47px;
      &::after {
        content: " ";
        height: 1px;
        width: 4px;
        border: 4px solid transparent;
        position: absolute;
        left: 4px;
        top: -8px;
        @include borderBottomColor(A2h);
      }

      &::before {
        content: " ";
        height: 7px;
        width: 7px;
        border-top: 1px solid transparent;
        border-right: 1px solid transparent;
        position: absolute;
        @include borderColor(A10);
        transform: rotate(-45deg);
        top: -5px;
        left: 6px;
      }
    }
  }
}
</style>
