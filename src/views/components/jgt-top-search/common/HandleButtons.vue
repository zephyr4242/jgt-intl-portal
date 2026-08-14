 <template>
  <div class="top-btn-search">
    <span v-for="(item, index) in handleBtns" :key="item.id">
      <!-- !item.isDisabled || !item.tips || !isDisabled 禁用提示的条件 -->
      <el-tooltip
        effect="dark"
        :disabled="!item.isDisabled || !item.tips"
        :content="item.tips"
        placement="top"
        :open-delay="300"
      >
        <span>
          <el-button
            :type="item.type || 'primary'"
            size="small"
            :disabled="item.isDisabled"
            :loading="item.isLoading"
            :plain="item.noPlain ? false : true"
            :class="{marginRight0: index === handleBtns.length-1}"
            @click="handleBtnFn(item)"
          >
            {{ item.label }}
          </el-button>
        </span>
      </el-tooltip>
    </span>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'jgt-handle-button',
  props: {
    handleBtns: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  watch: {},
  data () {
    return {
      handleButtons: []
    }
  },
  created () {
    // 深拷贝渲染按钮数据 避免错乱
    this.handleButtons = cloneDeep(this.handleBtns) || JSON.parse(JSON.stringify(this.handleBtns))
  },
  mounted () {},
  methods: {
    // 操作按钮事件
    handleBtnFn (item) {
      this.$emit('click', item)
    }
  }
}
</script>
<style lang="scss">
.top-btn-search{
  button.el-button{
    margin:0 16px;
    &:first-child{
      margin-left: 0;
    }
  }
  .marginRight0{
    margin-right: 0 !important;
  }
}
#purchase-list-JgtTopSearch{
  .top-btn-search{
    button.el-button{
      margin:0 8px;
      &:first-child{
        margin-left: 0;
      }
    }
    .marginRight0{
      margin-right: 0 !important;
    }
  }
}
</style>
