<template>
  <div :style="{ width: chartWidth, height: chartHeight }">
    <div v-show="show"  v-loading="loading && isNoLoading"  :id="id" :style="{ width: chartWidth, height: chartHeight }"></div>
    <no-data v-show="!show"  :style="{ width: chartWidth, height: chartHeight }" :isNoDataTips="isNoDataTips"/>
  </div>
</template>
<script>
import mix from './mix'
import noData from './noData.vue'
import { merge } from 'lodash'
// 雷达图
export default {
  name: 'radarChart',
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
      default: 'radarChart',
      require: true
    },
    isNoDataTips: {
      type: Boolean,
      default: false
    }
  },
  // 混入
  mixins: [mix],
  methods: {
    scoreTitle () {
      if (!this.chartData.score || this.chartData.score === '0.00') {
        return null
      }
      return {
        text: '{number|' + this.chartData.score + '}{Hanzi|分}' || '',
        x: 'center',
        y: 'center',
        textStyle: {
          rich: {
            number: {
              fontSize: 24,
              color: this.raderLabelColors,
              fontWeight: 'bold',
              fontFamily: 'Arial'
            },
            Hanzi: {
              color: this.raderLabelColors,
              fontSize: 12,
              lineHeight: 56,
              padding: [0, 0, -5, 0]
            }
          }
        }
      }
    },
    // 显示加载loading
    showLoading () {
      this.chart.showLoading({ color: '#DEB971', effect: 'bubble' })
    },
    // 隐藏加载loading
    hideLoading () {
      this.chart.hideLoading()
    },
    tooltipFormatter (param) {
      // 从外层传入分类进行渲染
      let str = ''
      if (this.chartData?.data?.length && this.chartData?.indicator?.length) {
        this.chartData.data.forEach((item, index) => {
          const val = item ? this.util.toFixed(item, 2) : '--'
          str += `<div><span>${this.chartData.indicator[index].name}评分：</span><span class="jgt-fr">${val}</span></div>`
        })
      }
      if (this.chartData.title && this.chartData.score) {
        str += `<h5><span>${this.chartData.title}：</span><span class="jgt-fr">${this.chartData.score === '0.00' ? '--' : this.util.toFixed(Number(this.chartData.score), 2)}</span></h5>`
      }
      return str
    },
    setOptions (expectedData = {}) {
      const tooltip = this.chartData?.tooltip ? this.tooltip() : null
      if (tooltip) {
        tooltip.trigger = 'item'
        // 所有雷达图的浮层位置改为固定在右下角
        tooltip.position = (point) => {
          return [point[0] + 20, point[1] + 20]
        }
      }
      if (!this.chartData?.data.length) {
        this.hideLoading()
        return false
      }
      let option = {
        title: this.chartData.score ? this.scoreTitle() : null,
        tooltip: tooltip,
        radar: {
          indicator: this.chartData?.indicator || [],
          //  坐标轴在 grid 区域中的分隔区域
          splitArea: {
            show: true,
            areaStyle: this.splitAreaAreaStyle || {}
          },
          /* 雷达线条 */
          splitLine: {
            lineStyle: {
              color: this.randerLineColor
            }
          },
          splitNumber: this.chartData?.splitNumber || 4,
          radius: this.chartData?.radius || '75%',
          /* 雷达线条 */
          axisLine: {
            lineStyle: {
              color: this.randerLineColor
            }
          },
          axisName: {
            color: this.lineColor
          }
        },
        series: [
          {
            type: 'radar',
            symbol: 'rect',
            symbolSize: '0.01',
            data: [
              {
                value: this.chartData?.data || [],
                label: this.chartData?.label ? {
                  show: true,
                  color: this.raderLabelColors,
                  fontSize: 14,
                  formatter: function (params) {
                    return params ? Number(params.value).toFixed(1) : 0.0
                  }
                } : null
              }
            ],
            lineStyle: {
              color: this.randerAreaLineColor,
              width: this.chartData?.lineWidth || 2
            },
            areaStyle: this.chartData?.areaStyle ? {
              color: this.randerAreaColor,
              opacity: 0.6
            } : null
          }
        ]
      }
      if (option.tooltip) {
        option.tooltip.axisPointer = {
          type: 'none'
        }
      }
      this.hideLoading()
      // 与自定义的option合并
      if (this.chartData.option) {
        option = merge(option, this.chartData.option)
      }
      this.chart.setOption(option)
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
