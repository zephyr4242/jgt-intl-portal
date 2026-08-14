<template>
  <div :style="{ width: chartWidth, height: chartHeight }">
    <div v-show="show" :id="id" :style="{ width: chartWidth, height: chartHeight }"></div>
    <no-data v-show="!show" className="align-center" :style="{ width: chartWidth, height: chartHeight }" />
  </div>
</template>
<script>
import noData from './noData.vue'
import { mapState } from 'vuex'
import { merge } from 'lodash'
// import * as echarts from 'echarts'
// 饼图
export default {
  name: 'newPieChart',
  components: {
    'no-data': noData
  },
  props: {
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: () => null
    },
    chartHeight: {
      type: String,
      default: '500px'
    },
    chartWidth: {
      type: String,
      default: '100%'
    },
    id: {
      type: String,
      default: 'newPieChart'
    },
    enterPieName: {
      type: String,
      default: ''
    },
    leavePieName: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      loading: false,
      chart: null,
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
    }
  },
  watch: {
    chartData: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          if (val && val.loading) {
            this.loading = true
            this.show = true
            return false
          }
          this.loading = false
          if (!val?.data?.length) {
            this.show = false
            return false
          }
          this.show = true
          if (this.chart) {
            this.setOptions()
          } else {
            this.initChart()
          }
          // this.chart.resize()
          setTimeout(() => {
            this.chart && this.chart.resize()
          }, 500)
        })
      },
      deep: true
    },
    activeName: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          this.createCommonColor()
          if (this.chart) {
            this.setOptions()
          } else {
            this.initChart()
          }
          setTimeout(() => {
            this.chart && this.chart.resize()
          }, 0)
        })
      },
      deep: true
    },
    enterPieName: {
      handler (val, oldVal) {
        this.chart.dispatchAction({
          type: 'highlight',
          name: val
        })
      },
      deep: true
    },
    leavePieName: {
      handler (val, oldVal) {
        this.chart.dispatchAction({
          type: 'downplay',
          name: val
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
    })
  },
  methods: {
    createCommonColor () {
      this.tipColor = this.isClientTrue ? '#D6BA84' : '#A08D79'
      this.labelColor = this.isClientTrue ? '#D4B883' : '#A08d79'
      this.tipBgColor = this.isClientTrue ? 'rgba(44, 44, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      this.colors = this.isClientTrue ? this.chartData.clientColor : this.chartData.webColor
    },
    showLoading () {
      this.chart.showLoading({ color: '#DEB971', effect: 'bubble' })
    },
    hideLoading () {
      this.chart.hideLoading()
    },
    labelFn () {

    },
    setOptions (expectedData = {}) {
      if (!this.chartData || !this.chartData.data.length) {
        this.hideLoading()
        return false
      }
      let option = {
        color: this.chartData?.data.length ? this.colors : ['rgb(97, 86, 74)'],
        tooltip: {
          trigger: 'item',
          borderColor: this.tipColor,
          backgroundColor: this.tipBgColor,
          textStyle: {
            color: this.tipColor,
            fontSize: 12,
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, sans-serif",
            align: 'left'
          },
          formatter: (param) => {
            return this.chartData.tooltipFormatter ? this.chartData.tooltipFormatter(param) : `<div style=" ">${this.chartData.title ? (this.chartData.title + '<br>') : ''}${param.name}：${param.value}${this.chartData.unit || '%'}</div>`
          }
        },
        series: [
          {
            type: 'pie',
            startAngle: this.chartData.startAngle || 90, // 起始角度
            minAngle: this.chartData.minAngle || 0, // 最小角度
            // 饼图的半径。可以为如下类型：
            radius: this.chartData?.radius || '65%',
            // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
            center: this.chartData?.center || ['50%', '50%'],
            data: this.chartData?.data || [],
            label: {
              show: !!this.chartData.label,
              color: this.labelColor,
              formatter: (params) => {
                const name = params.name + '：'
                const title = name.substr(0, 8)
                const title1 = name.substr(8, params.length)
                return `${title}${title1 ? ('\n' + title1) : ''}${params.value.toFixed(2)}${this.chartData.unit || '%'}`
              }
            },
            labelLine: {
              show: true
            },
            labelLayout: (params) => {
              if (this.chartData?.labelLayoutAlign) {
                // 启用时引导线拉到两端
                var isLeft = params.labelRect.x < this.chart.getWidth() / 2
                var points = params.labelLinePoints
                points[2][0] = isLeft
                  ? 10
                  : this.chart.getWidth() - 10

                return {
                  labelLinePoints: points
                }
              }
            },
            emphasis: {
              scaleSize: 12,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.hideLoading()
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
      }
      this.chart.setOption(option, { notMerge: true })
      setTimeout(() => {
        this.chart && this.chart.resize()
      }, 500)
    },
    async initChart () {
      if (document.getElementById(this.id)) {
        this.chart = this.$echarts.init(document.getElementById(this.id))
        if (this.autoResize) {
          this.__resizeHanlder = this.util.debounce(() => {
            if (this.chart) {
              this.chart.resize()
            }
          }, 100)
          window.addEventListener('resize', this.__resizeHanlder)
        }
        this.showLoading()
        this.setOptions()
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
    this.chart.dispose()
    this.chart = null
  },
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
  },
  deactivated () {
    if (this.chart) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
  }
}
</script>
<style scoped lang="scss">
// @import  '@/styles/base.scss';
</style>
