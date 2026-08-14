<template>
  <el-select v-model="selectValue" @change="changeData" :filterable="filterable" placeholder="请选择" clearable :disabled="disabled" :key="name">
    <el-option
      v-for="item in data"
      :key="item.keyValue"
      :label="item.caption"
      :value="item.keyValue">
    </el-option>
  </el-select>
</template>
<script>
import { commonDictionary, hsDictionary } from '@/api/intl/legacy/fofund-account'
export default {
  data () {
    return {
      data: [],
      api: {
        common: commonDictionary,
        hs: hsDictionary
      }
    }
  },
  props: {
    changeData: {
      type: Function,
      default: () => {}
    },
    name: {
      required: true
    },
    value: {
      required: true
    },
    disabled: {
      default: false
    },
    filterable: {
      default: false
    },
    defaultVal: {
      type: String,
      default: ''
    },
    dataOrigin: {
      type: String,
      default: 'common'
    }
  },
  computed: {
    selectValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    }
  },
  created () {
    this.renderList()
  },
  methods: {
    /**
     * 渲染列表
     */
    renderList () {
      this.api[this.dataOrigin]({
        keyNo: this.name
      })
        .then(res => {
          if (res.dictionaryList.length > 0) {
            this.data = res.dictionaryList
            // 默认选中
            if (this.defaultVal) {
              this.selectValue = this.defaultVal === 'first' ? this.data[0].keyValue : this.defaultVal
            }
          }
        })
    }
  }
}
</script>
