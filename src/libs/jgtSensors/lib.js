import Vue from 'vue'
import router from '@/router'
// 神策自定义埋点事件
export const $sensorsTrack = (eventName, payload = {}) => {
  try {
    if (typeof eventName !== 'string' && typeof payload !== 'object') {
      console.log('参数错误！')
      return
    }
    try {
      payload.page_id = router.app.$route.meta.pageId
      payload.flow_id = router.app.$route.meta.flowId
    } catch (error) {

    }
    Vue.prototype.$jySensors.trackEvent(eventName, payload)
  } catch (err) {
    console.log(err)
  }
}
