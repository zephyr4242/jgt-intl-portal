<template>
  <div class="header-notice" :class="{ 'header-notice-center': !isRoll,'header-notice-content-is-show':  noticeShow}" v-show="noticeShow" ref="noticeRef">
    <span class="header-notice-content" ref="noticeContentRef" :style="contentStyle">{{ noticeText }}<span class="header-link" v-if="noticeLinkUrl" @click="clickLink">{{ noticeLinkText }}</span></span>
    <i class="header-close iconfont-a-guanbi1" @click="clickClose"></i>
  </div>
</template>

<script>
import {
  queryOnlineAnnouncementConfig
} from '@/api/intl/legacy/bus-jgt-common'
export default {
  data () {
    return {
      noticeWidth: 0,
      noticeContentWidth: 0,
      noticeShow: false,
      noticeText: '',
      noticeLinkText: '',
      noticeLinkUrl: '',
      contentStyle: {
        transitionProperty: 'transform',
        transitionDuration: '0s',
        transform: 'translateX(0px)'
      },
      time: 0,
      intervalTime: null,
      convertSpeed: 1,
      speed: 50,
      isRoll: false,
      isFlag: false
    }
  },
  mounted () {
    this.getNoticeData()
  },
  watch: {
    '$route': {
      handler(to) {
        // 检查当前路由是否为首页，如果是则调用getNoticeData
        if (to.name === 'index' || to.name === 'account-info') {
          this.getNoticeData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getNoticeData () {
      if (this.isFlag) {
        return true
      }
      this.isFlag = true
      queryOnlineAnnouncementConfig({
        platformType: this.$isElectron ? '1' : '0'
      }).then(res => {
        if (res) {
          if (res.platformType === '2') {
            this.noticeShow = true
          } else if (res.platformType === '1' && this.$isElectron && res.content) {
            this.noticeShow = true
          } else if (res.platformType === '0' && !this.$isElectron && res.content) {
            this.noticeShow = true
          } else {
            this.noticeShow = false
          }
          this.setContent(res)
          setTimeout(() => {
            // 获取容器宽度
            this.setNoticeWidth()
            // 窗口大小修改时更新容器宽度
            window.onresize = this.setNoticeWidth
            document.addEventListener('visibilitychange', () => {
              if (document.hidden !== true) {
                this.setNoticeWidth()
              }
            })
          }, 0)
        } else {
          this.noticeShow = false
        }
      }).finally(() => {
        this.isFlag = false
      })
    },
    setContent(res) {
      this.noticeText = res.content || ''
      this.noticeLinkText = res.linkText || ''
      this.noticeLinkUrl = res.linkUrl || ''
    },
    init () {
      this.convertSpeed = this.noticeWidth / this.noticeContentWidth * this.speed // 根据分辨率转化成不同的速度
      // 第一次启动时增加屏幕一半的偏移量
      this.startAnimate(this.noticeWidth / 2)
    },
    startAnimate (offset = 0) {
      this.contentStyle.transitionDuration = '0s'
      this.contentStyle.transform = 'translateX(' + (this.noticeWidth - offset) + 'px)'
      this.time = (this.noticeWidth + this.noticeContentWidth - offset) / this.convertSpeed
      setTimeout(() => {
        this.contentStyle.transitionDuration = this.time + 's'
        this.contentStyle.transform = 'translateX(-' + (this.noticeContentWidth) + 'px)'
        // 启动定时器，完成循环后再次开启
        clearInterval(this.intervalTime)
        this.intervalTime = setTimeout(() => {
          this.startAnimate()
        }, this.time * 1000)
      }, 200)
    },
    setNoticeWidth () {
      if (!this.$refs.noticeRef) {
        return
      }
      this.noticeWidth = this.$refs.noticeRef.offsetWidth - 90

      this.noticeContentWidth = this.$refs.noticeContentRef.offsetWidth
      this.isRoll = this.noticeWidth < this.noticeContentWidth
      if (this.isRoll) {
        this.init()
      }
    },
    clickLink () {
      window.open(this.noticeLinkUrl)
    },
    clickClose () {
      clearInterval(this.intervalTime)
      this.noticeShow = false
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalTime)
    this.intervalTime = null
  }
}
</script>

<style lang="scss" scoped>
.header-notice {
  @include backgroundColor(A22);
  @include color(A29);
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  user-select: none;
  &.header-notice-center {
    text-align: center;
    .header-notice-content {
      position: relative;
    }
  }
  .header-notice-content {
    position: absolute;
    white-space: nowrap;
    transition-timing-function: linear;
  }
  .header-link {
    cursor: pointer;
    text-decoration: underline;
    margin: 0 8px;
    &:hover {
      @include color(A21);
    }
  }
  .header-close {
    display: inline-block;
    width: 24px;
    height: 24px;
    padding-right: 16px;
    padding-left: 12px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    @include backgroundColor(A22);
    &:hover {
      @include color(A21);
    }
  }
}
</style>
