<template>
  <div class="jy-rule-input">
    <div class="jy-rule-input__container jy-rule-input__container2">
      <span class="jy-rule-input__label">
        {{ label1 }}
      </span>

      <el-input
        v-model="rule"
        size="small"
        :maxlength="60"
        placeholder="请输入单据文件名"
        @input="changeValue"

      >
      <template #suffix>.pdf</template>
      </el-input>

      <el-button
        type="primary"
        plain
        size="small"
        @click="rule = resetValue"
      >
        恢复默认
      </el-button>
    </div>

    <div class="jy-rule-input__container">
      <span class="jy-rule-input__label">
        {{ label2 }}
      </span>

      <span
        v-for="(item, index) in list"
        :key="index"
        class="jy-rule-input__button"
        @click="buttonClick(item)"
      >
        <span class="variableName">{{ item.label }}</span>
        <span
          class="iconfont-shanchu1 jy-rule-input__icon--del"
          v-if="item.selected"
        ></span>
        <span class="iconfont-jia jy-rule-input__icon--add" v-else></span>
      </span>
    </div>
  </div>
</template>

<script>
// 规则输入框 带按钮快速输入
export default {
  name: 'jy-rule-input',
  props: {
    // 第一行标题
    label1: {
      type: String,
      default: '设置单据文件名：',
      required: false
    },
    // // 文件名输入框宽度
    // inputWidth: {
    //   type: String,
    //   required: false,
    //   default: 'calc(100% - 246px)'
    // },
    // 上一次使用的规则名称
    lastValue: {
      type: String,
      required: true
    },
    // 恢复默认值
    resetValue: {
      type: String,
      required: true
    },
    // 第二行标题
    label2: {
      type: String,
      default: '可设置变量：',
      required: false
    },
    // 第二行按钮组
    buttonGroup: {
      type: Array,
      required: true
    }
  },
  watch: {
    rule (val) {
      this.list.forEach((item) => {
        const label = `&${item.label}&`
        if (val.includes(label)) {
          item.selected = true
        } else {
          item.selected = false
        }
      })

      let translateString = this.rule
      this.buttonGroup.forEach(item => {
        const label = `&${item.label}&`
        const value = `&${item.value}&`
        const reg = new RegExp(label, 'g')
        translateString = translateString.replace(reg, value)
      })

      this.$emit('ruleInputChange', this.rule, translateString)
    },
    lastValue (val) {
      this.rule = val
    }
  },
  data () {
    return {
      rule: '',
      list: []
    }
  },
  mounted () {
    this.rule = this.lastValue
    this.list = this.buttonGroup.map((i) => {
      return { label: i.label, value: i.value, selected: false }
    })
  },
  methods: {
    changeValue (value) {
      this.rule = this.util.stripsString(value)
    },
    buttonClick (item) {
      const label = `&${item.label}&`
      if (item.selected) {
        // 从input中移除
        const reg = new RegExp(label, 'g')
        this.rule = this.rule.replace(reg, '')
      } else {
        // 添加至input
        this.rule += label
      }

      item.selected = !item.selected
    }
  }
}
</script>

<style lang="scss" scoped>
.jy-rule-input {
  .jy-rule-input__container {
    .variableName {
      margin-right: 2px;
    }
    .iconfont-shanchu1.jy-rule-input__icon--del,.iconfont-jia.jy-rule-input__icon--add {
      font-size: 12px;
    }
    &.jy-rule-input__container2 {
      display: flex;
      align-items: center;
      .el-input{
        flex: 1;
      }
    }
    margin: 12px 0;
    .jy-rule-input__label {
      display: inline-block;
      width: 128px;
    }

    .jy-rule-input__button {
      cursor: pointer;
      margin-right: 12px;
      .jy-rule-input__icon--del {
        @include color(A17);
      }
      .jy-rule-input__icon--add {
        @include color(A10);
      }
    }
  }
}
</style>

<style lang="scss">
.jy-rule-input {
  .el-input__suffix {
    right: 12px;
    line-height: 30px;
  }
}
</style>
