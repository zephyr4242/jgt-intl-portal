/* eslint-disable no-unused-vars */
import Vue from 'vue'
const pageLoadFmp = {}
pageLoadFmp.observerData = []
pageLoadFmp.startTime = window.performance.timing.fetchStart
pageLoadFmp.mountObserver = (className) => {
  try {
    if (!window.MutationObserver) {
      // 不支持 MutationObserver 的话
      console.warn('MutationObserver 不支持，首屏时间无法被采集')
      return
    }
    // 每次 dom 结构改变时，都会调用里面定义的函数
    const observer = new window.MutationObserver(() => {
      const time = new Date().getTime() - pageLoadFmp.startTime // 当前时间 - 性能开始计算时间
      const body = className ? document.querySelector(className) : document.querySelector('body')
      let score = 0

      if (body) {
        score = pageLoadFmp.traverseEl(body, 1, false)
        pageLoadFmp.observerData.push({
          score,
          time
        })
      } else {
        pageLoadFmp.observerData.push({
          score: 0,
          time
        })
      }
    })

    // 设置观察目标，接受两个参数: target：观察目标，options：通过对象成员来设置观察选项
    // 设为 childList: true, subtree: true 表示用来监听 DOM 节点插入、删除和修改时
    observer.observe(document, {
      childList: true,
      subtree: true
    })

    pageLoadFmp.observer = observer
    pageLoadFmp.calcFirstScreenTime = 'pending'

    if (document.readyState === 'complete') {
      // MutationObserver监听的最大时间，10秒，超过 10 秒将强制结束
      pageLoadFmp.unmountObserver(10000)
    } else {
      window.addEventListener(
        'load',
        () => {
          pageLoadFmp.unmountObserver(10000)
        },
        false
      )
    }
  } catch (error) {

  }
}
/**
 * 深度遍历 DOM 树
 * 算法分析
 * 首次调用为 traverseEl(body, 1, false);
 * @param element 节点
 * @param layer 层节点编号，从上往下，依次表示层数
 * @param identify 表示每个层次得分是否为 0
 * @returns {number} 当前DOM变化得分
 */
pageLoadFmp.traverseEl = (element, layer, identify) => {
  try {
    // 窗口可视高度
    const height = window.innerHeight || 0
    let score = 0
    const tagName = element.tagName

    if (
      tagName !== 'SCRIPT' &&
    tagName !== 'STYLE' &&
    tagName !== 'META' &&
    tagName !== 'HEAD'
    ) {
      const len = element.children ? element.children.length : 0

      if (len > 0) {
        for (let children = element.children, i = len - 1; i >= 0; i--) {
          score += pageLoadFmp.traverseEl(children[i], layer + 1, score > 0)
        }
      }
      // 如果元素高度超出屏幕可视高度直接返回 0 分
      if (score <= 0 && !identify) {
        if (
          element.getBoundingClientRect &&
        element.getBoundingClientRect().top >= height
        ) {
          return 0
        }
      }
      score += 1 + 0.5 * layer
    }
    return score
  } catch (error) {

  }
}

/**
 * @param observerData
 * @returns {*}
 */
pageLoadFmp.removeSmallScore = (observerData) => {
  try {
    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].score < observerData[i - 1].score) {
        observerData.splice(i, 1)
        return pageLoadFmp.removeSmallScore(observerData)
      }
    }
    return observerData
  } catch (error) {

  }
}
pageLoadFmp.getfirstScreenTime = () => {
  try {
    pageLoadFmp.observerData = pageLoadFmp.removeSmallScore(pageLoadFmp.observerData)

    let data = null
    const {
      observerData
    } = pageLoadFmp

    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].time >= observerData[i - 1].time) {
        const scoreDiffer =
        observerData[i].score - observerData[i - 1].score
        if (!data || data.rate <= scoreDiffer) {
          data = {
            time: observerData[i].time,
            rate: scoreDiffer
          }
        }
      }
    }

    if (data && data.time > 0 && data.time < 3600000) {
      // 首屏时间
      pageLoadFmp.firstScreenTime = data.time
      // 首屏加载时长上报
      if (Vue.prototype.$jgtSensorsTrack && pageLoadFmp.firstScreenTime) {
        Vue.prototype.$jgtSensorsTrack.firstMeaningfulPaint({
          overall_load_time: pageLoadFmp.firstScreenTime / 1000
        })
      }
    }
  } catch (error) {

  }
}
/**
 * @param delayTime 延迟的时间
 * @param immediately 指是否立即卸载
 * @returns {number}
 */
pageLoadFmp.unmountObserver = (delayTime, immediately) => {
  try {
    if (pageLoadFmp.observer) {
      if (immediately || pageLoadFmp.compare(delayTime)) {
        // MutationObserver停止观察变动
        pageLoadFmp.observer.disconnect()
        pageLoadFmp.observer = null

        pageLoadFmp.getfirstScreenTime()

        pageLoadFmp.calcFirstScreenTime = 'finished'
      } else {
        setTimeout(() => {
          pageLoadFmp.unmountObserver(delayTime)
        }, 500)
      }
    }
  } catch (error) {

  }
}

// * 如果超过延迟时间 delayTime（默认 10 秒），则返回 true
// * _time - time > 2 * OBSERVE_TIME; 表示当前时间与最后计算得分的时间相比超过了 1000 毫秒，则说明页面 DOM 不再变化，返回 true
pageLoadFmp.compare = (delayTime) => {
  try {
    // 当前所开销的时间
    const _time = new Date().getTime() - pageLoadFmp.startTime
    // 取最后一个元素时间 time
    const {
      observerData
    } = pageLoadFmp
    const time =
    (
      observerData &&
      observerData.length &&
      observerData[observerData.length - 1].time) ||
    0
    return _time > delayTime || _time - time > 2 * 500
  } catch (error) {

  }
}
pageLoadFmp.unmountObserverListener = () => {
  if (pageLoadFmp.calcFirstScreenTime === 'pending') {
    pageLoadFmp.unmountObserver(0, true)
  }
  // eslint-disable-next-line no-undef
  if (!(!!window.ActiveXObject || 'ActiveXObject' in window)) {
    window.removeEventListener('beforeunload', pageLoadFmp.unmountObserverListener)
  }
}
export default pageLoadFmp
