import { mapState } from 'vuex'
// import * as echarts from 'echarts'
export default {
  props: {
    // 用外层loading覆盖echarts 内部loading  防止用户切换条件导致数据错乱使
    isNoLoading: {
      type: Boolean,
      default: true
    },
    chartWidth: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      chart: null,
      loading: false,
      show: true,
      isClient: false
    }
  },
  computed: {
    ...mapState('d2admin/theme', [
      'list',
      'activeName'
    ]),
    isClientTrue () {
      return this.$isClient || this.activeName === 'client'
    },
    xAxisData () {
      return this.chartData?.xAxisData?.length > 0 ? this.chartData.xAxisData : (this.chartData.data?.map(item => item.name) ?? [])
    }
  },
  watch: {
    chartData: {
      handler (val, oldVal) {
        if (val && val.notKeepAlive) {
          return
        }
        this.$nextTick(() => {
          this.chart && this.chart.clear()
          if (val && val.loading) {
            this.loading = true
            this.show = true
            return false
          }
          this.loading = false
          if ((val.data && !val.data.length) || (val.datas && !val.datas.length)) {
            this.show = false
            return false
          }
          this.show = true
          if (this.chart) {
            this.chart.clear()
            this.setOptions()
          } else {
            this.initChart()
          }
        })
      },
      deep: true
    },
    activeName: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          this.createCommonColor()
          if (this.chart) {
            this.chart.clear()
            this.setOptions()
          } else {
            this.initChart()
          }
        })
      },
      deep: true
    }
  },
  created () {
    this.createCommonColor()
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
      if (this.chartData && this.chartData.loading) {
        this.loading = true
        return false
      }
      if ((this.chartData.data && !this.chartData.data.length) || (this.chartData.datas && !this.chartData.datas.length)) {
        this.show = false
        return false
      }
      this.show = true
    })
  },
  methods: {
    /**
         * 获取曲线图最大值、最小值、差值
         * @param data 数组
         * @param personalized
         * @return
         *     max: Number,
         *     min: Number,
         *     interval: Number
         */
    getMostNumber: function (data, personalized = 'min') {
      const valData = data.map(item => item.value)
      var maxData = Math.max.apply(null, valData)
      var minData = Math.min.apply(null, valData)

      /* 处理最大值和最小值等于0的情况 */
      if (maxData === 0 && minData === 0) {
        maxData = 0.5
        minData = 0
      }

      var difference = (maxData === minData ? minData : maxData - minData) / 5

      maxData = maxData + difference

      minData = minData - difference

      if (personalized === 'min') {
        if (minData <= 0) {
          minData = 0
        }
      }

      difference = (maxData - minData) / 5

      return {
        max: maxData,
        min: minData,
        interval: difference
      }
    },
    createCommonColor () {
      this.util.isClient(this)
      const mainColor = this.isClientTrue ? '#D4B883' : '#A08D79'
      const mainBarColor = this.isClientTrue ? '#DECEA8' : '#7F674D'
      const barLineColor = this.isClientTrue ? '#F6DEB0' : '#EDAF6D'

      const tipColor = this.isClientTrue ? '#D6BA84' : '#A08D79'
      const tipLineColor = this.isClientTrue ? '#838383' : '#838383'
      const labelColor = this.isClientTrue ? '#D4B883' : '#A08d79'
      const tipBgColor = this.isClientTrue ? 'rgba(44, 44, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      const xAxisColor = this.isClientTrue ? '#C0C0C0' : '#3B383B'
      const xAxisLineColor = this.isClientTrue ? '#4E4E50' : '#C0C0C0'
      const dataZoomBackAreaColor = this.isClientTrue ? '#A08D79' : '#A08D79'
      const dataZoomBSelectedBackground = this.isClientTrue ? 'rgba(212, 184, 131, 1)' : 'rgba(160, 141, 121, 1)'
      const fillerColor = this.isClientTrue ? 'rgba(212, 184, 131, .3)' : 'rgba(241,237,228,0.6)'
      const handleIcon = this.isClientTrue ? 'image://' + require('../../../assets/images/charts/handle_icon_client.png') : 'image://' + require('../../../assets/images/charts/handle_icon_web.png')
      const areaColors = this.isClientTrue ? ['#38383B'] : ['#FFFFFF']
      const stripeAreaColors = this.isClientTrue ? ['#4D483D', '#333334'] : ['#FCF4EB', '#FFFFFF']
      const raderLabelColors = this.isClientTrue ? '#FFD87C' : '#3A2014'
      const raderTitleColors = this.isClientTrue ? '#E7B65A' : '#61564A'
      const randerLineColor = this.isClientTrue ? '#838383' : '#c0c0c0'
      const randerAreaLineColor = this.isClientTrue ? '#D4B883' : '#A08D79'
      const randerAreaColor = this.isClientTrue ? 'rgba(212, 184, 131, 1)' : 'rgba(160, 141, 121, 1)'
      const webColor = [
        '#A08D79',
        '#EDAF6D ',
        '#61564A',
        '#F6DEB0',
        '#BA9B7C',
        '#867867',
        '#D1A576',
        '#3A3116',
        '#CBAF7A',
        '#D3C8BA'
      ]
      const clientColor = [
        '#D4B883',
        '#ECDECC',
        '#E7B65A',
        '#F6DEB0',
        '#896A45',
        '#CBAD8A',
        '#867867',
        '#F4BC82',
        '#BDA786',
        '#FDD6BD'
      ]
      const noStripeSplitAreaAreaStyle = {
        color: areaColors,
        opacity: 0.14
      }
      const stripeSplitAreaAreaStyle = {
        color: stripeAreaColors
      }
      // 提示样式color
      this.tipColor = tipColor
      this.tipLineColor = tipLineColor
      this.labelColor = labelColor
      this.tipBgColor = tipBgColor
      // xAxis/ yAxis color
      this.xAxisColor = xAxisColor
      this.xAxisLineColor = xAxisLineColor
      // dataZoom Color
      this.dataZoomBorderColor = mainColor
      this.dataZoomBackAreaColor = dataZoomBackAreaColor
      this.dataZoomBSelectedBackground = dataZoomBSelectedBackground
      this.fillerColor = fillerColor
      this.handleIcon = handleIcon
      this.dataZoomTextColor = mainColor
      // 柱状图
      this.barColor = mainColor
      this.barColorTwo = mainBarColor
      this.barLineColor = barLineColor
      // 折线图
      this.lineColor = mainColor
      // 雷达图
      this.splitAreaAreaStyle = this.chartData?.stripe ? stripeSplitAreaAreaStyle : noStripeSplitAreaAreaStyle
      this.raderLabelColors = raderLabelColors
      this.raderTitleColors = raderTitleColors
      this.randerLineColor = randerLineColor
      this.randerAreaLineColor = randerAreaLineColor
      this.randerAreaColor = randerAreaColor
      // 堆叠柱状图
      this.barStackColor = this.isClientTrue ? clientColor : webColor
      // 堆叠折线图
      const webLineColor = [
        '#A08D79',
        '#EDAF6D',
        '#61564A',
        '#BA9B7C',
        '#F6DEB0'
      ]
      const clientLineColor = [
        '#D4B883',
        '#F6DEB0',
        '#E7B65A',
        '#ECDECC',
        '#896A45'
      ]
      this.lineStackColor = this.isClientTrue ? clientLineColor : webLineColor
      // 基煜精选小手icon
      this.shortterm = this.isClientTrue ? require('@/assets/images/page/fund/short_term_client.png') : require('@/assets/images/page/fund/short_term_web.png')
    },
    // 阻止渲染
    returnFalse () {
      if (!this.chartData || (this.chartData && this.chartData.data && !this.chartData.data.length)) {
        this.hideLoading()
        return false
      }
    },
    // 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。可以在网格上绘制折线图，柱状图，散点图（气泡图）。
    grid () {
      return {
        left: this.chartData?.left || 120,
        right: this.chartData?.right || 50,
        bottom: this.chartData?.bottom ? this.chartData?.bottom : this.chartData?.axisLabelRotate ? 130 : 86,
        top: this.chartData?.top || 30
      }
    },
    // 柱状图Xais
    barXais () {
      return {
        type: 'category',
        splitNumber: 5,
        min: 'dataMin',
        max: 'dataMax',
        scale: true,
        axisTick: {
          show: false
        },
        axisLabel: {
          rotate: this.chartData?.axisLabelRotate || 0,
          margin: this.chartData?.axisLabelMargin ?? 10,
          color: this.xAxisColor,
          lineHeight: 16,
          formatter: (value, index) => {
            return this.chartData.xAxisAxisLabel ? this.chartData.xAxisAxisLabel(value, index) : this.xAxisAxisLabel(value, index)
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: this.xAxisLineColor
          }
        },
        data: this.xAxisData
      }
    },
    // 折线图 xAxis
    xAxis () {
      return {
        type: this.chartData.xAxisType ? this.chartData.xAxisType : 'category',
        splitNumber: 5,
        min: 'dataMin',
        max: 'dataMax',
        // x坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
        boundaryGap: false,
        axisTick: {
          show: false
        },
        splitLine: {
          show: !this.chartData.hideXAisSplitLine,
          // interval: Math.floor(this.chartData.data.length / 20),
          lineStyle: {
            type: 'solid',
            color: this.xAxisLineColor
          }
        },
        axisLabel: {
          rotate: 0,
          color: this.xAxisColor,
          margin: 16
          // 显示最大最小刻度
          // showMaxLabel: true,
          // showMinLabel: true
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: this.xAxisLineColor
          }
        },
        data: this.xAxisData
      }
    },
    // yAxis
    yAxis () {
      return {
        min: () => { // 取最小值向下取整为最小刻度
          if (this.chartData.minYAxis) {
            return this.chartData.minYAxis
          }
          return null
        },
        // max: function (value) { // 取最大值向上取整为最大刻度
        //   return value.max + (value.max - value.min) * 0.1
        // },
        type: this.chartData.yAxisType ? this.chartData.yAxisType : 'value',
        name: this.chartData.yAxisName || '',
        splitNumber: 5,
        scale: true,
        // 多出1格显示需求
        boundaryGap: [0, 0.1],
        nameTextStyle: {
          align: 'right',
          color: this.xAxisColor
        },
        splitLine: {
          // show: true,
          // interval: 5,
          lineStyle: {
            type: 'dashed',
            // color: ['#aaa', '#ddd']
            color: this.xAxisLineColor
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: this.xAxisLineColor
          }
        },
        axisLabel: {
          formatter: (value, index) => {
            return this.chartData.yAxisAxisLabel ? this.chartData.yAxisAxisLabel(value, index) : this.yAxisAxisLabel(value, index)
          },
          // showMinLabel: false, // 不显示最小刻度线值
          // showMaxLabel: false, // 不显示最大刻度线值
          color: this.xAxisColor
        }
      }
    },
    // 提示
    tooltip () {
      return {
        trigger: 'axis',
        hideDelay: 0,
        borderColor: this.tipColor,
        backgroundColor: this.tipBgColor,
        textStyle: {
          color: this.tipColor,
          fontSize: 12,
          align: 'left'
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            type: 'solid',
            color: this.tipLineColor
          }
        },
        formatter: (param) => {
          if (param && param.length) {
            if (this.chartData.stackLineChart) {
              return this.chartData.tooltipFormatter ? this.chartData.tooltipFormatter(param) : this.tooltipFormatter(param)
            }
            return this.chartData.tooltipFormatter ? this.chartData.tooltipFormatter(param[0]) : this.tooltipFormatter(param[0])
          } else {
            return this.chartData.tooltipFormatter ? this.chartData.tooltipFormatter(param) : this.tooltipFormatter(param)
          }
        },
        position: function (point, params, dom, rect, size) {
          var arr = [point[0] + 20, point[1] + 20]
          if (point[0] > size.viewSize[0] / 2) {
            arr[0] = point[0] - 20 - size.contentSize[0]
          }
          if (point[1] > size.viewSize[1] / 2) {
            arr[1] = point[1] - 20 - size.contentSize[1]
          }
          return arr
        }
      }
    },
    // 滑块
    dataZoom () {
      return [
        {
          left: '14%',
          right: '15%',
          start: 10 / this.chartData.data.length > 0.2 ? (100 - 10 * 100 / this.chartData.data.length) : 80,
          end: 100,
          moveHandleSize: 0,
          dataBackground: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: this.dataZoomBackAreaColor
            }
          },
          selectedDataBackground: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: this.dataZoomBSelectedBackground,
              opacity: 0.3
            }
          },
          fillerColor: this.fillerColor,
          borderColor: this.dataZoomBorderColor,
          handleIcon: this.handleIcon,
          handleSize: '30px',
          textStyle: {
            color: this.dataZoomTextColor
          }
        }
      ]
    },
    async initChart () {
      if (document.getElementById(this.id)) {
        this.chart = this.$echarts.init(document.getElementById(this.id))
        if (this.autoResize) {
          this.__resizeHanlder = this.util.debounce(() => {
            if (this.chart) {
              this.chart.resize()
            }
          }, 300)
          window.addEventListener('resize', this.__resizeHanlder, false)
        }
        this.showLoading()
        this.setOptions()
      }
    }
  },
  // 处理keepalive下echarts由100%变为100px
  activated () {
    this.$nextTick(() => {
      if (this.chart) {
        if (this.autoResize) {
          this.__resizeHanlder = this.util.debounce(() => {
            if (this.chart) {
              this.chart.resize()
            }
          }, 100)
          window.addEventListener('resize', this.__resizeHanlder, false)
        }
        setTimeout(() => {
          this.chart.resize()
        }, 500)
        return false
      }
      this.initChart()
      if (this.chart) {
        setTimeout(() => {
          this.chart.resize()
        }, 500)
        return false
      }
    })
    /* if (this.chart) {
      if (this.autoResize) {
        this.__resizeHanlder = this.util.debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder, false)
      }
      this.chart.resize()
    } */
  },
  deactivated () {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
  }

}
