 <template>
    <div v-if="isBtn">
      <el-tooltip
        effect="dark"
        v-for="(item) in handleBtns" :key="item.id"  :class="item.className"
        :disabled="!item.tips || !disabledBtn(item)"
        :content="item.tips"
        placement="top"
        :open-delay="300"
      >
        <jy-popover
          v-if="item.id === 'delete'"
          text="移除"
          :tips="item.tips || '请确认是否移除此产品？'"
          @confirm="handleBtnFn(item)"
        >
        </jy-popover>
        <span class="btn-box" v-else>
          <el-button
            class="handle-btn"
            @click="handleBtnFn(item)"
            :disabled="disabledBtn(item)"
            v-if="item.label"
            :type="item.type || 'text'"
            size="mini"
          >
            {{item.isChange ? item.label1 : item.label}}
            <i :class="[item.isChange ? item.iconChangeName : item.iconClassName ]"></i>

          </el-button>
          <i v-if="item.icon" class="icon jgt-iconfont" :class="item.icon">{{item.icon}}</i>
        </span>
      </el-tooltip>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import jyPopover from '@/components/jy-popover'
export default {
  name: 'handleBtns',
  components: { jyPopover },
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    isBtn () {
      return this.handleBtns && this.handleBtns.length
    },
    // 禁用按钮处理
    disabledBtn (item) {
      const { row } = this.prop
      return (item) => {
        // item.isDiabledFn 复杂禁用逻辑回调处理
        // item.prop ? row[item.prop] === item.isStatus : false 简单禁用逻辑处理
        return item.isDiabledFn ? item.isDiabledFn(row, item) : item && item.prop ? row[item.prop] === item.isStatus : false
      }
    }
  },
  data () {
    return {
      handleBtns: []
    }
  },
  created () {
    const { handleBtns } = this.prop.column
    // 深拷贝数据 避免污染全局
    this.handleBtns = cloneDeep(handleBtns) || JSON.parse(JSON.stringify(handleBtns)) || []
  },
  mounted () {
  },
  methods: {
    handleBtnFn (item, index) {
      const { isTypeBtn, isDiabledBtn } = this.prop.row
      if (isTypeBtn) {
        if (isDiabledBtn) {
          return false
        }
      }
      // 当一个展开是禁用另一个展开按钮 （保留）
      /* const isChangeData = this.handleBtns.find(i => {
        return i.isChange
      })
      if (isChangeData && isChangeData.id !== item.id) {
        return false
      } */
      // 处理change状态改变 样式改变逻辑
      if (item.label1) {
        this.handleBtns.forEach(j => {
          if (j.label1) {
            if (j.id === item.id) {
              item.isChange = !item.isChange
              item.type = item.isChange ? 'assist' : 'text'
            } else {
              j.isChange = false
              j.type = 'text'
            }
          }
        })
      }
      // 自定义事件名
      const { handleFnName } = this.prop.column
      this.$emit(handleFnName || 'HandleClick', item, this.prop)
    }
  }
}
</script>
<style scoped lang="scss">
  .btn-box{
    margin: 0 4px;
    // .handle-btn{
    //   font-size: 12px !important;
    //   padding: 2px 8px !important;
    // }
  }

</style>
