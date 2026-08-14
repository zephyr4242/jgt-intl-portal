 <template>
    <!-- 基煜账户名 -->
    <jy-tooltip :jyTooltipId="jyTooltipId" :content="orginData.scope.row.fofundName" placement="bottom-start" :open-delay="300">
        <div class="cell_first text-left-force ellipsis">
          <span>
            {{isShowFofundName(orginData.scope, 1, orginData.conf)}}
            <br>
            {{isShowFofundName(orginData.scope,2, orginData.conf) ? isShowFofundName(orginData.scope,2, orginData.conf): ''}}
          </span>
          <!-- <div class="cell_first text-left-force ellipsis">{{isShowFofundName(orginData.scope, 1, orginData.conf)}}</div> -->
          <!-- <div class="cell_first text-left-force ellipsis" v-if="isShowFofundName(orginData.scope,2, orginData.conf)">{{isShowFofundName(orginData.scope,2, orginData.conf)}}</div> -->
      </div>
    </jy-tooltip>

</template>
<script>
import fofundNameMix from '@/views/components/fofundNameMix/index.js'
export default {
  name: 'fofundName',
  props: {
    orginData: {
      type: Object,
      default: () => null
    },
    className: {
      type: String,
      default: ''
    },
    jyTooltipId: {
      type: Number,
      default: Math.random()
    }
  },
  mixins: [ fofundNameMix ],
  data () {
    return {
    }
  },
  computed: {

  },
  created () {
    // 处理日期

  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
  .text-left-force{
    font-size: 12px !important;
  }
</style>
