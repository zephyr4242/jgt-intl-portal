<template>
  <el-select
    v-model="sValue"
    :multiple="multiple"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="disabled"
    @visible-change="visibleChange"
    @change="change"
    size="mini"
    v-el-select-loadmore="loadmore"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item[props.label]"
      :value="item[props.value]"
    >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    props: {
      // option 中的label value
      type: Object,
      default: () => ({
        label: 'fullName',
        value: 'id'
      })
    },
    pretendData: {
      // 模拟数据
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    disabled: {
      default: false,
      type: Boolean
    },
    value: {}, // v-model绑定的值 或者:value
    selectOptions: {
      // 暂时只有设置 中审批设置 组件中需要
      type: Array
    },
    required: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      options: [],
      sValue: this.multiple ? [] : '',
      dataModel: {
        keyWord: '',
        statusIds: [],
        pageIndex: 1,
        pageSize: 20
      },
      totalCount: 0
    }
  },
  watch: {
    value (newVal) {
      if (this.sValue !== newVal) {
        this.sValue = newVal
      }
    },
    sValue (newVal) {
      this.$emit('input', newVal)
    },
    pretendData: {
      handler (options) {
        if (options.length) {
          this.options = options
          this.sValue = options[0].id || '' // 伪装中id不存在或者0 则赋值为空
        }
      },
      immediate: true
    },
    selectOptions: {
      handler (newVal) {
        if (!newVal) return
        this.options = this.selectOptions.map((i) => {
          return {
            id: i.id,
            fullName: i.name
          }
        })
      },
      immediate: true
    }
  },
  mounted () {
    if (this.value) this.sValue = this.value
    // pass
  },
  methods: {
    // 下拉框出现/隐藏时触发
    visibleChange (visible) {
      this.loading = true
      this.dataModel.pageIndex = 1
      this.dataModel.keyWord = ''
      visible && this.getList()
    },
    // 远程搜索
    remoteMethod (query) {
      this.loading = true
      this.dataModel.keyWord = query
      this.dataModel.pageIndex = 1
      this.getList()
    },
    loadmore () {
      if (this.totalCount === this.options.length) return
      this.dataModel.pageIndex++
      this.getList(true)
    },
    change (val) {
      if (!Array.isArray(val)) {
        val = [val]
      }
      const results = this.options.filter((i) => val.includes(i.id))
      this.$emit('change', results)
    },
    async getList (isPush) {
      const _data = await this.$http.post(
        '/api/services/app/sysClientUser/GetPage',
        this.dataModel
      )
      this.loading && (this.loading = false)
      if (_data) {
        this.totalCount = _data.totalCount

        let _items = _data.items.filter((i) => {
          return i.statusId === 1
        })
        // 根据传进来的值判断是否需要push
        this.options = isPush ? this.options.concat(_items) : _items
      }
    }
  }
}
</script>
