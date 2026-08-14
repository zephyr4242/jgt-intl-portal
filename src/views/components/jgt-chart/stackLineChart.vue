<template>
  <div :style="{ width: chartWidth, height: chartHeight }">
    <div v-show="show"  v-loading="loading && isNoLoading" :id="id" :style="{ width: chartWidth, height: chartHeight }"></div>
    <no-data v-show="!show"  :style="{ width: chartWidth, height: chartHeight }"/>
  </div>
</template>
<script>
// 折线图
import mix from './mix'
import noData from './noData.vue'
import { merge } from 'lodash'
export default {
  name: 'StackLineChart',
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
    id: {
      type: String,
      default: 'stackLineChart'
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
      if (param && param.length) {
        str = `<div style=" ">${param[0].name}</div>`
        param.forEach(item => {
          str += `<div>${item.marker}${item.seriesName}：${
            this.chartData.formatTooltipLabel ? this.chartData.formatTooltipLabel(item.value) : item.value
          }${this.chartData.unit}<br></div>`
        })
      }
      return str
    },
    yAxisAxisLabel (value) {
      const val = value.toFixed(2)
      let str = `${val}${(this.chartData.unit || '')}`
      return str
    },
    setOptions (expectedData = {}) {
      let option = {
        color: this.lineStackColor,
        grid: this.grid(),
        tooltip: this.tooltip(),
        xAxis: this.xAxis(),
        legend: {
          show: !this.chartData.hideLegend,
          itemHeight: 3,
          icon: 'rect',
          textStyle: {
            color: this.labelColor
          },
          bottom: 10
        },
        dataZoom: this.chartData.isDataZoom ? this.dataZoom() : null,
        yAxis: this.yAxis(),
        series: []
      }
      if (this.chartData.nameDatas) {
        const { datas } = this.chartData
        this.chartData?.nameDatas?.length && this.chartData.nameDatas.forEach((item, index) => {
          option.series.push({
            name: item || null,
            data: datas[index],
            stack: this.chartData.stack,
            type: 'line',
            smooth: !this.chartData.stackStyle,
            symbol: this.chartData.symbolStyle ? this.chartData.symbolStyle : 'none',
            symbolSize: this.chartData.symbolSize ? this.chartData.symbolSize : 0,
            emphasis: {
              lineStyle: {
              // 线条样式
                width: 2
              }
            }
          })
        })
      }
      this.hideLoading()
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
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
