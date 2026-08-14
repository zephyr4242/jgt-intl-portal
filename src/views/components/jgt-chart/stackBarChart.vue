<template>
  <div :style="{ width: chartWidth, height: chartHeight }">
    <div v-show="show"  v-loading="loading && isNoLoading"  :id="id" :style="{ width: chartWidth, height: chartHeight }"></div>
    <no-data v-show="!show"  :style="{ width: chartWidth, height: chartHeight }"/>
  </div>
</template>
<script>
import mix from './mix'
import noData from './noData.vue'
import { merge } from 'lodash'
// 柱状图
export default {
  name: 'stackBarChart',
  components: {
    'no-data': noData
  },
  props: {
    // 是否自动改变大小
    autoResize: {
      type: Boolean,
      default: true
    },
    // 渲染数据
    chartData: {
      type: Object,
      default: () => null
    },
    // 默认渲染高度
    chartHeight: {
      type: String,
      default: '500px'
    },
    // 图表ID  必填
    id: {
      type: String,
      default: 'stackBarChart',
      require: true
    }
  },
  // 混入
  mixins: [mix],
  methods: {
    // 显示加载loading
    showLoading () {
      this.chart.showLoading({ color: '#DEB971', effect: 'bubble' })
    },
    // 隐藏加载loading
    hideLoading () {
      this.chart.hideLoading()
    },
    tooltipFormatter (param) {
      let str = `<div style=" ">${param.name}：${param.value}${this.chartData.unit || ''}<br></div>`
      return str
    },
    yAxisAxisLabel (value) {
      let str = `${value}${(this.chartData.unit || '')}`
      return str
    },
    xAxisAxisLabel (value) {
      let str = `${value}`
      return str
    },
    setOptions (expectedData = {}) {
      const tooltip = this.tooltip()
      tooltip.trigger = 'item'
      let option = {
        grid: this.grid(),
        tooltip: tooltip,
        xAxis: this.barXais(),
        yAxis: this.yAxis(),
        legend: {
          show: true,
          textStyle: {
            color: this.labelColor
          },
          itemWidth: 10,
          itemHeight: 10
        },
        dataZoom: this.chartData.isDataZoom ? this.dataZoom() : null,
        series: []
      }
      // 多柱状图
      if (this.chartData.nameDatas) {
        const { datas, stack } = this.chartData
        this.chartData?.nameDatas?.length && this.chartData.nameDatas.forEach((item, index) => {
          option.series.push({
            name: item || null,
            data: datas[index],
            stack: stack,
            type: 'bar',
            barMaxWidth: '26.5px',
            barMinHeight: this.chartData.barMinHeight ?? 2,
            itemStyle: {
              color: this.barStackColor[index]
            }
          })
        })
      }
      option.tooltip.axisPointer = {
        type: 'none'
      }
      this.hideLoading()
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
      }
      this.chart.setOption(option, { notMerge: true })
      setTimeout(() => {
        this.chart && this.chart.resize()
      }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
// @import  '@/styles/base.scss';
</style>
