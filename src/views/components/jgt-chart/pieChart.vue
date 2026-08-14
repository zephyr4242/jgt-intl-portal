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
  components: {
    'no-data': noData
  },
  props: {
    enterPieName: {
      type: String,
      default: ''
    },
    leavePieName: {
      type: String,
      default: ''
    },
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
    id: {
      type: String,
      default: 'pieChart'
    }
  },

  data () {
    return {
      loading: false,
      chart: null,
      chartWidth: '100%',
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
          if (val.data && !val.data[0].length) {
            this.show = false
            return false
          }
          this.show = true
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
      this.loading = false
      if (!this.chartData || !this.chartData.data[0].length) {
        this.show = false
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
    setOptions (expectedData = {}) {
      if (!this.chartData || !this.chartData.data.length) {
        this.hideLoading()
        return false
      }
      let option = {
        color: this.chartData.data[0].length ? this.colors : ['rgb(97, 86, 74)'],
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
            return `<div>${param.name}：${this.util.thousands(param.data.positionAmount)}元<br></div>`
          }
        },
        series:
          this.chartData &&
          this.chartData.data.map((data, idx) => {
            return {
              type: 'pie',
              showEmptyCircle: false,
              radius: [50, 70],
              data: data,
              startAngle: 180, // 起始角度
              minAngle: 0, // 最小角度
              left: 'center',
              width: 460,
              label: {
                width: 120,
                alignTo: 'edge',
                formatter: (param) => {
                  return `{name|${param.name}} {time|${Number(param.value) === 0 ? '< 0.01' : param.value}% \n}`
                  // return `{name|{b}} {time|{${param.value <= 0 ? '<0.01' : param.name}}% \n}`
                },
                // || `{name|{b}} {time|{c}% \n}`,
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
                rich: {
                  name: {
                    fontSize: 12,
                    color: this.labelColor
                  },
                  time: {
                    fontSize: 12,
                    color: this.labelColor
                  }
                }
              },
              labelLine: {
                length: 15,
                length2: 0,
                maxSurfaceAngle: 80
              },
              labelLayout: (params) => {
                var isLeft = params.labelRect.x < this.chart.getWidth() / 2
                var points = params.labelLinePoints
                // Update the end point.
                points[2][0] = isLeft
                  ? params.labelRect.x
                  : params.labelRect.x + params.labelRect.width

                return {
                  labelLinePoints: points
                }
              },
              emphasis: {
                scaleSize: 15
              }
            }
          })
      }
      this.hideLoading()
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
      }
      this.chart.setOption(option, { notMerge: true })
      setTimeout(() => {
        this.chart.resize()
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
