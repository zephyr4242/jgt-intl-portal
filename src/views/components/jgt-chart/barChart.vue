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
  name: 'barChart',
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
      default: 'barChart',
      require: true
    }
  },
  data () {
    return {
      shortterm: null
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
      switch (this.id) {
        case 'thetopten':
          str = `<div style=" ">${param.name}<br>市值：${this.util.thousands(param.data.positionAmount)} ${Number(param.positionAmount) !== 0 ? this.chartData.unit1 : ''}<br>占比：${param.value}${Number(param.value) !== 0 ? this.chartData.unit : ''}<br></div>`
          break
        case 'earningsTrend':
          str = `<div style=" ">${param.name}<br>收益：${this.util.thousands(param.value)}${Number(param.value) !== 0 ? this.chartData.unit : ''}<br></div>`
          break
        case 'twoBarChart':
          str = `<div style=" ">${param.seriesName}：${param.value}${this.chartData.unit || ''}<br></div>`
          break
        default:
      }
      return str
    },
    yAxisAxisLabel (value) {
      let str = `${value}${(this.chartData.unit || '')}`
      switch (this.id) {
        case 'thetopten':
          str = `${value}${(this.chartData.unit || '')}`
          break
        case 'earningsTrend':
          str = `${this.util.thousands(value / 10000, 4)}`
          break
        default:
      }
      return str
    },
    xAxisAxisLabel (value) {
      let str = `${value}`
      switch (this.id) {
        case 'thetopten':
          let strVal = ''
          if (value.length > 12) {
            strVal = `${value.substring(0, 12)} \n ${value.substring(12, value.length)}`
          }
          str = strVal || value
          break
        case 'earningsTrend':
          str = `${value}`
          break
        default:
      }
      return str
    },
    setOptions (expectedData = {}) {
      const tooltip = this.tooltip()
      tooltip.trigger = 'item'
      this.returnFalse()
      let option = {
        grid: this.grid(),
        tooltip: tooltip,
        xAxis: this.barXais(),
        yAxis: this.yAxis(),
        legend: this.chartData.legend ? this.chartData.legend : {
          show: !!this.chartData.legendData,
          data: this.chartData.legendData || [],
          textStyle: {
            color: this.labelColor
          },
          itemWidth: 10,
          itemHeight: 10
        },
        dataZoom: this.chartData.isDataZoom ? this.dataZoom() : null,
        series: [{
          name: this.chartData?.legendData?.[0] || null,
          data: this.chartData.data,
          type: 'bar',
          barMaxWidth: 20,
          // barWidth: this.chartData.barWidth ?? 20,
          barMinHeight: 2,
          itemStyle: {
            color: this.barColor
          }
        }]
      }
      // 多柱状图
      if (this.chartData.dataTwo) {
        option.series.push({
          name: this.chartData?.legendData?.[1] || null,
          data: this.chartData.dataTwo,
          type: 'bar',
          barGap: '0%',
          barMaxWidth: 20,
          // barWidth: this.chartData.barWidth ?? 20,
          barMinHeight: 2,
          itemStyle: {
            color: this.barColorTwo
          }
        })
      }
      if (this.chartData.lineData) {
        option.yAxis = [this.yAxis()]
        option.yAxis.push({
          min: () => { // 取最小值向下取整为最小刻度
            if (this.chartData.minYAxis) {
              return this.chartData.minYAxis
            }
            return null
          },
          type: this.chartData.yAxisType ? this.chartData.yAxisType : 'value',
          name: this.chartData.yAxisName || '',
          splitNumber: 5,
          scale: true,
          // 多出1格显示需求
          boundaryGap: [0, 0.1],
          nameTextStyle: {
            align: 'left',
            color: this.xAxisColor
          },
          splitLine: {
            show: false,
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
            formatter: '{value} ' + this.chartData.util1,
            align: 'left',
            // showMinLabel: false, // 不显示最小刻度线值
            // showMaxLabel: false, // 不显示最大刻度线值
            color: this.xAxisColor
          }
        })
        option.series.push({
          name: this.chartData?.legendData?.[1] || null,
          data: this.chartData.lineData,
          type: 'line',
          symbol: 'circle',
          symbolSize: this.chartData.symbolSize ? this.chartData.symbolSize : 4,
          yAxisIndex: 1,
          itemStyle: {
            color: this.barLineColor
          }
        })
      }
      option.tooltip.axisPointer = {
        type: 'none'
      }
      this.hideLoading()
      // 与自定义的option合并
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
      }
      if (this.chartData.data.length === 2 && this.chartData.highlight) {
        if (Number(this.chartData.data[0]) > Number(this.chartData.data[1])) {
          option.series[0].markPoint = {
            symbolSize: 80,
            symbolOffset: [0, -35],
            symbol: 'image://' + this.shortterm,
            label: {
              show: false
            },
            data: [
              {
                type: 'max',
                name: '最大值'
              }
            ]
          }
        }
      }

      this.chart.setOption(option, { notMerge: true })
      if (this.chartData.legendselectchanged) {
        this.chart.on('legendselectchanged', (params) => {
          this.chartData.legendselectchanged(params, this.chart)
        })
      }
      /* this.chart.resize() */
      setTimeout(() => {
        this.chart && this.chart.resize()
        this.$emit('setChartInstance', this.chart)
      }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
// @import  '@/styles/base.scss';
</style>
