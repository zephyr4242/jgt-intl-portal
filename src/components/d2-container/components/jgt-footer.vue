<template>
  <div class="jgt-footer" v-if="!$isClient">
    <div class="jgt-footer-link">
      <ul class="jgt-footer-contact">
        <li><i class="iconfont-dizhi"></i><span>{{ $t('loginHongKongAddress') }}</span></li>
        <li><i class="iconfont-dianhua"></i><span>{{ $t('loginHotline') }}：400-820-5369（{{ $t('loginServiceHours') }}）</span></li>
        <li><i class="iconfont-youxiang"></i><span>{{ $t('loginServiceEmail') }}：service@jiyufund.com.cn</span></li>
        <li><i class="iconfont-chuanzhen"></i><span>{{ $t('loginFax') }}：021-55085991</span></li>
        <li>
          <i class="iconfont-copyright"></i>
          <span :title="$t('loginCopyrightCompany')">
            <span>Copyright©{{ currentYear }} {{ $t('loginCopyrightCompany') }}</span>
            <span class="wangbei">
              <span>
                <a
                  href="http://beian.miit.gov.cn"
                  target="_blank"
                  class="jgt-footer-contact-link"
                  style="cursor:pointer"
                  >
                  {{ $t('loginIcpFiling') }}
                </a>
              </span>
              <span class="lineLeft">|</span>
              <img
                :src="'./image/logo/safe.svg'"
                class="wangbeiImg"
              />
              <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011502017957"
                target="_blank"
                class="jgt-footer-contact-link"
                style="cursor:pointer"
                >
                {{ $t('loginPublicSecurityFiling') }}
                </a>
                <span class="lineLeft">|</span>
                <span>{{ $t('loginIpv6') }}</span>
            </span>

          </span>
        </li>
      </ul>
      <div class="jgt-footer-otherLink-wrap">
        <ul class="jgt-footer-otherLink" :data-title="$t(item.titleKey)" v-for="item in otherLinkList" :key="item.titleKey">
          <li v-for="item2 in item.links" :key="item2.labelKey" @click="openLink(item2)">{{ $t(item2.labelKey) }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/libs/util.js'
export default {
  name: 'jgt-footer',
  computed: {
    currentYear () {
      return util.getCurrentYear()
    }
  },
  data () {
    return {
      // 如果有主站外的域名，需要修改src\views\business\help-center\components\menuList.vue
      otherLinkList: [
        {
          titleKey: 'loginInvestorNotice',
          links: [
            {
              labelKey: 'loginInvestorRights',
              url: 'https://www.jiyufund.com.cn/static/footer/rights',
              activeComp: 'rights',
              subMenuCid: '1_2'
            },
            {
              labelKey: 'loginInvestorEducation',
              url: `${this.PDF_DOMAIN}%E6%8A%95%E8%B5%84%E8%80%85%E6%95%99%E8%82%B2%E4%B8%93%E9%A1%B9%E6%B4%BB%E5%8A%A8.pdf`
            },
            {
              labelKey: 'loginSuitabilityRules',
              url: `${this.PDF_DOMAIN}%E6%8A%95%E8%B5%84%E8%80%85%E9%80%82%E5%BD%93%E6%80%A7%E7%AE%A1%E7%90%86%E5%88%B6%E5%BA%A6.pdf`
            },
            {
              labelKey: 'loginSuitabilityColumn',
              url: 'http://b.eqxiu.com/s/nEo5Icb6'
            },
            {
              labelKey: 'loginFundRiskRules',
              url: `${this.PDF_DOMAIN}%E5%9F%BA%E9%87%91%E4%BA%A7%E5%93%81%E9%A3%8E%E9%99%A9%E7%AD%89%E7%BA%A7%E8%AF%84%E4%BB%B7%E7%AE%A1%E7%90%86%E5%8A%9E%E6%B3%95.pdf`
            }
          ]
        },
        {
          titleKey: 'loginImportantNotice',
          links: [
            {
              labelKey: 'loginSafetyGuide',
              url: 'https://www.jiyufund.com.cn/static/footer/safety-guidelines',
              activeComp: 'safety-guidelines',
              subMenuCid: '2_2'
            },
            {
              labelKey: 'loginLegalNotice',
              url: 'https://www.jiyufund.com.cn/static/footer/legal-notice',
              activeComp: 'legal-notice',
              subMenuCid: '2_3'
            },
            {
              labelKey: 'loginLaws',
              url: 'https://www.jiyufund.com.cn/static/footer/laws-and-regulations',
              activeComp: 'laws-regulations',
              subMenuCid: '1_1'
            },
            {
              labelKey: 'loginRiskNotice',
              url: 'https://www.jiyufund.com.cn/static/footer/risk',
              activeComp: 'risk',
              subMenuCid: '2_1'
            },
            {
              labelKey: 'loginMaterials',
              url: 'https://www.jiyufund.com.cn/static/footer/account-online',
              activeResolve: true
            }
          ]
        },
        {
          titleKey: 'loginAboutJiyu',
          links: [
            {
              labelKey: 'loginAbout',
              url: 'https://www.jigoutong.com/products/'
            },
            {
              labelKey: 'loginContact',
              url: 'https://www.jigoutong.com/career/#contact'
            },
            {
              labelKey: 'loginQualification',
              url: 'https://www.jiyufund.com.cn/static/about/certificate',
              activeComp: 'certificate',
              subMenuCid: '4_3'
            },
            {
              labelKey: 'loginPersonnelQualification',
              url: 'https://www.jiyufund.com.cn/static/about/qualification',
              activeComp: 'qualification',
              subMenuCid: '4_4'
            },
            {
              labelKey: 'loginComplaint',
              url: `${this.PDF_DOMAIN}%E6%8A%95%E8%AF%89%E5%BB%BA%E8%AE%AE.pdf`
            }
          ]
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
.jgt-footer {
  margin: 16px 0 0;
  height: 180px;
  font-size: 12px;
  @include backgroundColor(A2);
  .jgt-footer-link {
    width: 1200px;
    height: 180px;
    margin: 0 auto;
    line-height: 12px;
  }
  .jgt-footer-contact {
    float: left;
    margin-top: 20px;
    padding-bottom: 8px;
    @include color(A6);
    li {
      line-height: 16px;
      margin-bottom: 12px;
    }
    i {
      margin-right: 10px;
      vertical-align: text-bottom;
    }

    .jgt-footer-contact-link{
      @include color(A6);
      &:hover{
        @include color(A10);
      }
    }
  }
  .jgt-footer-otherLink-wrap{
    float: right;
    .jgt-footer-otherLink:first-child{
      margin-right: 0;
    }
  }
  .jgt-footer-otherLink {
    float: right;
    margin-right: 32px;
    margin-top: 20px;
    &:before {
      content: attr(data-title);
      @include color(A6);
      display: block;
      margin-bottom: 11px;
      font-weight: bold;
    }
    li {
      @include color(A6);
      margin-bottom: 12px;
      cursor: pointer;
      &:hover{
        @include color(A10);
      }
    }
  }
  .wangbei {
    margin-right: 5px;
    .lineLeft {
      margin: 0 5px;
      vertical-align: text-bottom;
    }
    .wangbeiImg{
       width:15px;
                vertical-align: text-bottom;

    }
    .color83 {
      @include color(A21);
      &:hover {
        text-decoration: underline !important;
      }
    }
  }
}
 </style>
