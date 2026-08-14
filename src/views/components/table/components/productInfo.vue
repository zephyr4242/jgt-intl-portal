 <template>
    <div>
      <div class="multiLineBox">
        <jy-tooltip effect="dark" :content="row.fundName" placement="bottom">
        <!-- 未上线产品 -->
        <div v-if="row.status ==='0'">
          {{row.fundName}}
        </div>
        <!-- 已上线产品 -->
        <div v-else class=" multiLineSpan1"  @click="goProDetail">
          {{row.fundName}}
        </div>
        </jy-tooltip>
      </div>
      <div class="table-multi-line-font-color-second">
        <span>{{row.fundCode}}</span>
          <!-- 前往柜台交易提示 -->
          <el-tooltip class="item" effect="dark"  content="该产品为柜台交易，请前往柜台查看详情" placement="bottom">
            <i v-if="row.status ==='0'" class="iconfont-guitaijiaoyi icon-color icon-margin-left-5"></i>
          </el-tooltip>
          <!-- 高风险提示 -->
          <el-tooltip class="item" effect="dark" content="高风险" placement="bottom">
            <i v-if="row.fundRiskLevel==='4'" class="iconfont-gaofengxianbeifen icon-color icon-margin-left-5"></i>
          </el-tooltip>
      </div>
    </div>
</template>
<script>
import './common.scss'
export default {
  name: 'productInfo',
  props: {
    prop: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      row: {}
    }
  },
  watch: {
    prop () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.row = this.prop.row
    },
    // 跳转至产品详情
    goProDetail () {
      // 券商资管 产品类型字段 = this.row.fundStylefundStyle
      this.util.gotoProduct(this.row.fundCode, this.row.fundStyle)
    }
  }
}
</script>
