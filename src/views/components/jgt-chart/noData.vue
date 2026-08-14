<template>
  <div class="noData">
    <img :class="className" :src="isNoDataTips ? noTxtChartsUrl : noChartsUrl" alt="暂无数据">
    <div v-if="isNoDataTips" class="tipTxts">
      <p>{{tipTxts}}</p>
    </div>
  </div>
</template>
<script>
import themeImage from '@/mixins/themeImage'
export default {
  name: 'noData',
  components: {},
  props: {
    noDataUrl: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    isNoDataTips: {
      type: Boolean,
      default: false
    }
  },
  mixins: [themeImage],
  data () {
    return {
      noChartsUrl: '',
      noTxtChartsUrl: '',
      tipTxts: '该基金因成立年限、权益仓位或其他因素不满足评分要求，暂无数据'
    }
  },
  created () {
    // echarts图背景图
    this.registerThemeImage('noChartsUrl', '/charts/no_charts.png')
    this.registerThemeImage('noTxtChartsUrl', '/charts/no_charts_txt.png')
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.noData{
    width: 100%;
    height: 100%;
    position: relative;
    img{
      height: 150px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
}
.tipTxts{
  width: 100%;
  height: 100%;
  // @include backgroundColor(A14O1);
  border-radius: 6px;
  p{
    width: 370px;
    margin: 0 auto;
    opacity: 1;
    position: absolute;
    top: 72%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    /* // @include color(A10);
    &::before{
      @include backgroundColor(A10);
      content: ' ';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 6px;
    } */
  }

}
</style>
