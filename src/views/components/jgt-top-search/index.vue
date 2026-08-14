 <template>
  <div class="fap-opts-search" :class="{'fap-opts-search-noform':!$attrs.searchFields}">
    <div class="fap-opts-search-left" :class="{'fap-opts-search-left-more': isMaxwidth}">
      <SearchForm v-if="$attrs.searchFields" v-bind="$attrs"  v-on="$listeners">
        <template slot="JgtUserDialog">
          <JgtUserDialog
            v-on="$listeners"
            :defaultVal="defaultVal"
            :dataOrigin="dataOrigin"
            @change="userChange">
          </JgtUserDialog>
        </template>
        <template slot="Portfolio">
          <Portfolio
            v-on="$listeners"
            :defaultVal="defaultVal"
            ref="portfolioCascader">
          </Portfolio>
        </template>
      </SearchForm>
      <slot v-else></slot>
    </div>
    <div class="fap-opts-search-right" >
      <HandleButtons v-bind="$attrs" v-on="$listeners"></HandleButtons>
    </div>
  </div>
</template>
<script>
// 选择基煜账户
import JgtUserDialog from '@/views/components/jgt-user-dialog'
import Portfolio from '@/views/components/Portfolio'
// 顶部搜索按钮功能组件
import HandleButtons from './common/HandleButtons'
// 顶部搜索form表达组件
import SearchForm from './common/SearchForm'
export default {
  name: 'jgt-top-search',
  props: {
    // 基煜账户组件默认值
    defaultVal: {
      type: String,
      default: ''
    },
    isMaxwidth: {
      type: Boolean,
      default: false
    },
    // 基煜账户组件请求接口名
    dataOrigin: {
      type: String
    },
    // 样式 暂时无用
    styleProps: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    JgtUserDialog,
    Portfolio,
    HandleButtons,
    SearchForm
  },
  computed: {
  },
  watch: {},
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {},
  methods: {
    // 选择基煜账户改变
    userChange (val) {
      this.$emit('checkUserChange', val)
    }
  }
}
</script>
<style scoped lang="scss">
// 小字体
$fs_small: 12px;

// 中等字体大小
$fs_normal: 14px;
// 操作区域
.fap-opts-search {
  box-sizing: border-box;
  height: auto;
  padding: 16px 16px 0;
  display: flex;
  justify-content: space-between;
  @include backgroundColor(A2);

  // 左侧操作区
  .fap-opts-search-left {
    display: flex;
    flex: 1;
  }
  // 右侧操作区
  .fap-opts-search-right {
    button.el-button {
      margin-left: 16px;
    }
  }
}
.fap-opts-search-noform{
  padding: 16px 16px;
}
/* @media screen and ( max-width: 1800px ){
  .fap-opts-search-left{
    flex: 0 0 840px;
  }
}
@media screen and ( max-width: 1500px ){
  .fap-opts-search-left{
    flex: 0 0 744px;
  }
}
@media screen and ( max-width: 1300px ){
  .fap-opts-search-left {
    flex: 0 0 644px;
  }
  .fap-opts-search-left-more {
    flex: 0 0 644px;
  }
} */

</style>
