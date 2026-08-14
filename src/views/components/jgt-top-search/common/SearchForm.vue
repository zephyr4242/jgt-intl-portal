 <template>
  <el-form :inline="true" :model="form" class="demo-form-inline search-top-box">
    <el-form-item  v-for="(field, index) in searchFields" :key="index" size="small">
      <slot v-if="field.slot" :name="field.slot"></slot>
      <component
        v-on="$listeners"
        v-else-if="field.component"
        :is="field.component"
        v-model="form[field.mode]"
        v-bind="field.bind"
        @change="val => {componentsChange(val, field)}"
        @keyup.enter.native="val => { isIE ? componentsChange(val, field) : null}"
      >
        <el-option
          v-for="item in field.options"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
        <i v-if="field.searchIcon" slot="prefix" class="el-input__icon el-icon-search"></i>
      </component>
    </el-form-item>
    <el-button
      type="primary"
      size="small"
      v-if="isSearchBtn"
      plain
      @click="handleSearchFn">
      搜索
    </el-button>
    <el-button
      type="primary"
      size="small"
      v-if="isSearchBtn"
      plain
      @click="handleSearchFn">
      重置
    </el-button>
  </el-form>
</template>
<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'jgt-search-form',
  props: {
    searchFields: {
      type: Array,
      default: () => []
    },
    isSearchBtn: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // jgtUserDialog
  },
  computed: {
  },
  watch: {
    searchFields: {
      handler (val, oldVal) {
        if (val && val !== oldVal) {
          const data = cloneDeep(val) || JSON.parse(JSON.stringify(val))
          this.form = this.createForm(data)
        }
      },
      deep: true
    }
  },
  data () {
    return {
      handleButtons: [],
      form: null,
      isIE: false
    }
  },
  created () {
    // 判断是否是IE
    this.isIE = !!window.ActiveXObject || 'ActiveXObject' in window
    // 深拷贝form 数据
    const data = cloneDeep(this.searchFields) || JSON.parse(JSON.stringify(this.searchFields))
    this.form = this.createForm(data)
  },
  mounted () {},
  methods: {
    // 创建form表单数据
    createForm (sourceDatas) {
      let form = {}
      sourceDatas.forEach(item => {
        const key = item.mode
        let value = ''
        if (item.bind && item.bind.multiple) {
          value = []
        }
        form[key] = value
      })
      return form
    },
    // form组件change
    componentsChange (val, field) {
      this.$emit('getData', this.form)
    },
    // 搜索按钮事件
    handleSearchFn () {
      this.$emit('getData', this.form)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
<style lang="scss">
  .search-top-box{
    .el-form-item--small.el-form-item{
      margin-bottom: 16px !important;
      margin-right: 16px !important;
    }
    .el-button {
      margin-top: 1px;
      height: 32px;
      line-height: 32px;
    }
    .el-form-item__content{
      height: 32px;
    }

  }
</style>
