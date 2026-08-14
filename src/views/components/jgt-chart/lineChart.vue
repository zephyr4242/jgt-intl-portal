<template>
  <div :style="{ width: chartWidth, height: chartHeight }">
    <div v-show="show" v-loading="loading && isNoLoading"  :id="id" :style="{ width: chartWidth, height: chartHeight }"></div>
    <no-data v-show="!show"  :style="{ width: chartWidth, height: chartHeight }" />
  </div>
</template>
<script>
// 折线图
import mix from './mix'
import noData from './noData.vue'
import { merge } from 'lodash'
export default {
  name: 'lineChart',
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
      /*
        {
          return {
            xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [50, 40, 40, 30, 70, 20, 80],
            isDataZoom: false,
            yAxisName: '',
            isArea: false,
            xAxisType: 'category',
            yAxisType: 'value',
          }
        }
      */
    },
    chartHeight: {
      type: String,
      default: '500px'
    },
    id: {
      type: String,
      default: 'lineChart'
    }
  },
  mixins: [mix],
  methods: {
    showLoading () {
      this.chart.showLoading({ color: '#DEB971', effect: 'bubble' })
    },
    hideLoading () {
      this.chart.hideLoading()
    },
    tooltipFormatter (param) {
      let str = ''
      switch (this.id) {
        case 'allEarningsTrend':
          // ie下要这样赋值，setAttribute不起作用
          str = `<div style=" ">${param.name}<br>累计收益率：${param.value}${this.chartData.unit || ''}<br></div>`
          break
        case 'assetChange':
          // ie下要这样赋值，setAttribute不起作用
          str = `<div style=" ">${param.name}<br>持仓市值：${this.util.thousands(param.value)}${this.chartData.unit || ''}<br></div>`
          break

        default:
      }
      return str
    },
    yAxisAxisLabel (value) {
      let str = `${value}${(this.chartData.unit || '')}`
      switch (this.id) {
        case 'assetChange':
          str = `${this.util.thousands(value / 10000)}`
          break
        case 'allEarningsTrend':
          // ie下要这样赋值，setAttribute不起作用
          str = `${value.toFixed(this.chartData.toFixed || 2)}${(this.chartData.unit || '')}`
          break
        default:
      }
      return str
    },
    setOptions (expectedData = {}) {
      this.returnFalse()
      let option = {
        grid: this.grid(),
        tooltip: this.tooltip(),
        xAxis: this.xAxis(),
        dataZoom: this.chartData.isDataZoom ? this.dataZoom() : null,
        yAxis: this.yAxis(),
        series: {
          /*  连接空数据
          connectNulls: true,
          large: true,
          sampling: 'average',
          showSymbol: false,
          showAllSymbol: false,
          */
          data: this.chartData.data || [],
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
          // 线条样式
            width: 2,
            color: this.lineColor // 折线的颜色
          },
          emphasis: {
            lineStyle: {
              // 线条样式
              width: 2
            }
          }
        }
      }
      if (this.chartData.isArea) {
        option.series.areaStyle = {
          color: this.randerAreaColor,
          opacity: 0.6
        }
      }

      this.hideLoading()
      // 获取曲线图最大值、最小值、差值
      const dataPersonalized = this.getMostNumber(this.chartData.data, this.chartData.personalized ? this.chartData.personalized : 'min')
      const optionReSet = {
        yAxis: {
          min: dataPersonalized.min,
          max: dataPersonalized.max,
          interval: dataPersonalized.interval
        }
      }
      // 与自定义的option合并
      if (this.chartData.option) {
        option = merge(option, this.chartData.option, optionReSet)
      }
      this.chart.setOption(option, { notMerge: true })
      setTimeout(() => {
        this.chart && this.chart.resize()
      }, 500)
      /* this.chart.resize() */
    }
  }
}
</script>
<style scoped lang="scss">
// @import  '@/styles/base.scss';
</style>
