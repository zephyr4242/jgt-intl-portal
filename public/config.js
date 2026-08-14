window.CONFIG = {
  UPDATE_URL: '',
  VUE_APP_API: 'http://localhost:8090',
  VUE_APP_LINK_PATH: 'http://localhost:8090',
  VUE_APP_ACCOUNT_PATH: '',
  VUE_APP_MANAGE_PATH: '',
  showFinanceTab: false,
  /**
   * USE_WHILELIST: 'default'
   * default  默认值，表示启用白名单接口
   * oldtrade 表示全部走旧交易流程 (回滚)
   * newtrade 表示全部走新交易流程 (全切)
   * */
  USE_WHILELIST: 'newtrade',
  IS_COMPRESS: false,
  SENTRY: {
    KEYWORDS: ['error', '异常', '系统', 'not found', 'timeout'],
    ACCOUNT_PORTAL: '',
    ACCOUNT_PORTAL_ENABLE: false,
    ETS_PORTAL: '',
    ETS_PORTAL_ENABLE: false,
    ECLIENT: '',
    ECLIENT_ENABLE: false,
    TIMEOUT: 10000
  },
  SENSORS_SERVER: {
    sensors_url: '',
    sensors_enable: false
  },
  // 某些基金显示特殊的交易提示
  TRADE_TIPS_SPECIAL_FUND_CODE: '006793,015654',
  STATIC_SERVICE: {
    FILE_DOMAIN: '',
    FILE_BUCKET: '',
    PERSONAL_PRIVACY_FILE_NAME: ''
  },
  // 网站版本号
  WEB_VERSION: '2025121101',
  // 客户端下载按钮是否显示
  IS_SHOW_CLIENT_DOWNLOAD: false,
  JGT_ADVISER: '',
  JGT_PPI_PORT: '',
  // 网站运行环境
  VUE_APP_ENV: 'development',
  // 是否开启灰度
  OPEN_GRAY: false,
  // 需要灰度的页面名称列表
  GRAY_PAGE_LIST: ['elogin', 'index'],
  SHOW_VERSION_DEBUG: true,
  ipArr: [],
  // 通知相关配置
  NOTICE: {
    // 显示范围 0-老客户端 1-网站 2-新客户端
    NOTICE_SCOPE: '0,1,2',
    // 显示文案
    NOTICE_TEXT: '',
    // 链接文案
    NOTICE_LINK_TEXT: '',
    // 链接url
    NOTICE_LINK_URL: ''
  },
  SHOWREDEMPTIONORG: '00125',
  // service worker是否注册 1-注册 0-卸载
  SW_IS_REGISTER: '0',
  //  基构云生产地址， 结尾不带/ 如果是并行环境从.env 转换
  FRP_PORTAL_DOMAIN: '',
  // 交易记录&复核列表显示初审复核信息
  SHOW_AUDITMID_ORG:'00001',
  SHOW_CONTRACT_SIGN_RECORDORG: '00001',
  // 资管：仅 loginType==='3' 且 orgCode 在白名单时隐藏热门推荐、产品列表仅「我的专属」；loginType!=='3' 走原逻辑
  BMIS_EXCLUSIVE_ORG_CODES: '01945',
  SHOW_ZIGUANTONG: {
    orgCodes: '',
    alink: ''
  },
  SHOW_DIVIDENDMETHOD_ORG: '00001',
  SHOW_DOWNLOAD_ORGS: '00001',
  ISNUMBERVALID: false,
  TRADE_ERROR_MSG: ''
}
