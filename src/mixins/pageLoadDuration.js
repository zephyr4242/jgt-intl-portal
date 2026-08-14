export default {
  data () {
    return {
    //   接口加载时长
      apiLoadTime: '',
      //   用户感知时长
      overallLoadTime: '',
      //   开始加载接口
      apiSatrtTime: '',
      //   接口响应完成
      apiEndTime: '',
      //   页面加载完成
      pageLoadFinish: false,
      // 切换tab加载时长 如自选产品
      tabAllLoadTime: '',
      initStartFlag: true,
      hashMapPageFLowName: [
        'fund-public-product-detail', // 公募详情
        'fund-private-product-detail', // 私募详情
        'fund-bmis-product-detail', // 资管详情
        'account-redeem', // 赎回预览
        'account-dividend', // 分红预览
        'trade-info-aggregation', // 聚合交易
        'trade-batch-cancel-preview', // 批量撤单
        'trade-transfer-setting', // 转换预览
        'trade-cancel-preview', // 撤单预览
        'fund-public-split', // 智能拆单
        'trade-info-purchase-list' // 预购清单
      ]
    }
  },
  watch: {
    pageLoadFinish: {
      handler (val) {
        if (val) {
          this.$nextTick(() => {
            if (!this.overallLoadTime) {
              this.pageLoadDuration()
            }
          })
        }
      },
      deep: true
    }
  },
  created () {
    if (this.$route.name !== 'trade-info-aggregation') {
      this.setFlowId()
    }
  },
  activated () {
    if (!this.initStartFlag) {
      this.setFlowId()
    }
  },
  methods: {
    setFlowId () {
      // 生成流程Id
      if (this.hashMapPageFLowName.find(item => item === this.$route.name)) {
        this.$route.meta.flowId = this.util.genNonDuplicateID(16)
        this.$nextTick(() => {
          this.initStartFlag = false
        })
      }
    },
    /* 设置页面唯一流程id */
    setRouterFlowId (params) {
      try {
        if (params && params.flowId) {
          this.$route.meta.flowId = params.flowId
        }
      } catch (error) {

      }
    },
    /**
     * 页面加载时长
     * pageLoadTime: 静态资源加载时长
     * apiLoadTime: 接口响应时长
     * overallLoadTime: 用户感知页面加载时长
     */
    pageLoadDuration () {
      if (this.$jgtSensorsTrack) {
        this.overallLoadTime = this.tabAllLoadTime ? (this.tabAllLoadTime - this.apiSatrtTime) / 1000 : (new Date().getTime() - this.$route.meta.loadStartTime) / 1000
        // 页面路由加载时长 大于页面总加载时长 取页面路由加载时长
        this.overallLoadTime = this.$route.meta.pageLoadTime > this.overallLoadTime ? this.$route.meta.pageLoadTime : this.overallLoadTime
        this.$jgtSensorsTrack.pageLoadDuration({
          page_load_time: this.$route.meta.pageLoadTime || undefined,
          api_load_time: this.apiLoadTime || undefined,
          overall_load_time: this.overallLoadTime || undefined
        })
      }
    },
    // 接口开始加载
    apiLoadSatrtTime () {
      this.apiSatrtTime = new Date().getTime()
    },
    // 接口响应完成
    apiLoadEndTime () {
      this.apiLoadTime = (new Date().getTime() - this.apiSatrtTime) / 1000
    }
  }
}
