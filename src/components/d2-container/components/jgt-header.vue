<template>
  <div class="header-blogroll" flex-box="0">
    <div class="header-container">
      <div class="blogroll-phone">
        <d2-icon name="phone"/>
        <span class="jgt-ml-8">400-820-5369（{{ $t('loginServiceHours') }}）</span>
      </div>
      <ul class="blogroll-link">
        <li v-for="item in headerLinkList" :key="item.labelKey" @click="openLink(item)">{{ $t(item.labelKey) }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import util from '@/libs/util.js'
export default {
  name: 'jgt-header',
  data () {
    return {
      headerLinkList: [
        { labelKey: 'loginAbout', url: 'https://www.jigoutong.com/products/' },
        { labelKey: 'loginContact', url: 'https://www.jigoutong.com/career/#contact' },
        {
          labelKey: 'loginQualification',
          url: 'https://www.jiyufund.com.cn/static/about/certificate',
          activeComp: 'certificate',
          subMenuCid: '4_3'
        },
        { labelKey: 'loginMaterials',
          url: 'https://www.jiyufund.com.cn/static/footer/account-online',
          activeResolve: true
        }
      ]
    }
  },
  methods: {
    /**
     * 打开外部链接想
     */
    openLink (row) {
      if (row.activeResolve) {
        let routeData = this.$router.resolve({
          path: '/account-counter-online'
        })
        window.open(routeData.href, '_blank')
        return false
      }
      if (row.activeComp) {
        let routeData = this.$router.resolve({
          path: '/helpSupportCenter',
          query: {
            activeComp: row.activeComp,
            subMenuCid: row.subMenuCid
          }
        })
        window.open(routeData.href, '_blank')
        return false
      }
      util.open(row.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-blogroll {
  width: 100%;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  border-bottom: 1px solid;
  @include borderColor(A13);
  .header-container {
    //padding-left: 24px;
    width: 1200px;
    margin: 0 auto;
  }
  .blogroll-phone {
    float: left;
    i {
      margin-right: 5px;
      font-size: 16px;
      vertical-align: -2px;
    }
  }
  .blogroll-link {
    float: left;
    margin-left: 30px;
    li {
      float: left;
      margin-right: 24px;
      cursor: pointer;
      @include color(A6);
      -webkit-app-region: none;
      &:hover{
        @include color(A10);
      }
    }
  }
  .blogroll-control {
    float: right;
    margin-right: 25px;
    li {
      float: left;
      margin-left: 18px;
      cursor: pointer;
    }
  }
}
</style>
