/**
 * 全局常量
 */
const constant = {
  STR: {
    ZERO: '0',
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10'
  },
  // 登录类型 1-管理员登录 2-授信管理员登录 3-基煜账户登录 4-老开户登录 5-游客登录, 6-机构登录（无基煜账户登录）7-体验账户登录
  LOGIN_TYPE: {
    MANAGER: '1',
    CREDIT: '2',
    CUSTOMER: '3',
    OLD_OPEN_ACCOUNT: '4',
    REGISTER: '5',
    ORG: '6',
    TRIAL: '7'
  },
  // 电子合同产品类型
  contractProType: [
    {
      value: 1,
      label: '资管计划',
      children: [
        { value: 'GDQXLZCP', label: '我的专属产品' },
        { value: 'XJ', label: '现金管理型' },
        { value: 'JZ', label: '净值型' }
      ]
    },
    {
      value: 2,
      label: '私募基金',
      children: [
        { value: 'TZ_EXCLUSIVE', label: '我的专属产品' },
        { value: '30101', label: '固收类' },
        { value: '30102', label: '权益类' },
        { value: '30103', label: '混合类' },
        { value: '30104', label: '商品及金融衍生品' }
      ]
    }
  ],
  // 电子合同产品类型
  privateProType: [
    {
      value: 2,
      label: '私募基金',
      children: [
        { value: '30101', label: '固收类' },
        { value: '30102', label: '权益类' },
        { value: '30103', label: '混合类' },
        { value: '30104', label: '商品及金融衍生品' },
        { value: 'TZ_EXCLUSIVE', label: '我的专属产品' }
      ]
    }
  ],
  fundType: {
    STOCK: '100101', // 股票型
    MIXTURE: '100201', // 混合型
    BOND: '100301', // 债券型
    CURRENCY: '100401', // 货币型
    QDII: '100501', // QDII
    FINANCE: '100701', // 理财型
    FIXEDLIMIT: 'GDQXLMCP', // 固定期限型
    SPECIAL: 'GDQXLZCP', // 我的专属产品
    CASH: 'XJ', // 现金管理型
    NETVALUE: 'JZ', // 净值型
    NEWFIXEDLIMIT: '404', // 固定期限型
    NEWSPECIAL: '401', // 我的专属产品
    NEWCASH: '402', // 现金管理型
    NEWNETVALUE: '403' // 净值型
  },
  fundTypeJy1: {
    STOCK: '25', // 股票型
    MIXTURE: '23', // 混合型
    BOND: '20', // 债券型
    CURRENCY: '10', // 货币型
    QDII: '30', // QDII
    FINANCE: '15', // 理财型
    FIXEDLIMIT: 'GDQXLMCP', // 固定期限型
    SPECIAL: 'GDQXLZCP', // 我的专属产品
    CASH: 'XJ', // 现金管理型
    NETVALUE: 'JZ' // 净值型
  },
  bmisHashType: {
    '404': 'GDQXLMCP',
    '401': 'GDQXLZCP',
    '402': 'XJ',
    '403': 'JZ'
  },
  newFundTypeJy1: {
    FIXEDLIMIT: '404', // 固定期限型
    SPECIAL: '401', // 我的专属产品
    CASH: '402', // 现金管理型
    NETVALUE: '403' // 净值型
  },
  fundTypeJy2: {
    SOLID: '30101', // 私募固收
    INTERESTS: '30102', // 私募权益
    PRIVATEMIXTURE: '30103', // 私募混合型
    FINANCIAL: '30104', // 私募商品及金融衍生品
    MINEFUND: 'TZ_EXCLUSIVE' // 私募证券投资基金-我的专属产品
  },
  publicFundTypeJy: ['100401', '100701', '100301', '100201', '100101', '100501'], // 公募类型
  bmisFundTypeJy: ['GDQXLMCP', 'GDQXLZCP', 'XJ', 'JZ'], // 券商类型
  privateFundTypeJy: ['301', '30101', '30102', '30103', '30104', 'TZ_EXCLUSIVE'], // 私募类型
  fundTypeName: {
    '30101': '私募-固收类',
    '30102': '私募-权益类',
    '30103': '私募-混合类',
    '30104': '私募-商品及金融衍生品',
    'TZ_EXCLUSIVE': '私募-我的专属产品',
    '401': '资管-我的专属产品',
    '402': '资管-现金管理型',
    '403': '资管-净值型',
    '404': '资管-固定期限型',
    '100401': '公募-货币型',
    '100701': '公募-理财型',
    '100301': '公募-债券型',
    '100201': '公募-混合型',
    '100101': '公募-股票型',
    '100501': '公募-QDII'
  },
  roleId: {
    QUERY: '1385398560190648326', // 查询
    HANDLE: '1385398560190648324', // 经办
    EXPERT_HANDLE: '1385398560190648323', // 高级经办
    AUDIT: '1385398560190648325' // 复核
  },
  // 业务类型
  BUSINESS_TYPE: {
    UNKNOWN: null,
    SUBSCRIPTION: '10', // 10-认购（公募）
    BUY: '20', // 20-申购（公募）
    PRE_PURCHASE: '21', // 21- 加入预购
    BATCH_BUY: '22', // 22 - 批量申购（预购清单页或者智能拆单预览页下单）
    P_SUB: '30', // 30-券商认购
    P_BUY: '40', // 40-券商申购
    P_SIGN: '50', // 50-立即签署
    REVIEW_ACCEPT: '60', // 60-复核成功
    REVIEW_REJECT: '61', // 61-复核拒绝
    BATCH_REVIEW_ACCEPT: '65', // 批量复核成功
    BATCH_REVIEW_REJECT: '66', // 批量复核拒绝
    REDEEM: '70', // 70-赎回
    TRANS: '80', // 80-转换
    SPLIT: '90', // 90-智能拆单
    REVERT: '95', // 95-撤单
    C_PRE_PURCHASE: '100', // 100-集中交易-加预购
    C_BUY: '101', // 101-集中交易-批量下单
    C_REDEEM: '105', // 105-集中交易-批量赎回
    C_BUY_AFTER_IMPORT: '106', // 106-集中交易-批量导入之后直接下单
    C_IMPORT_BUY: '110', // 101-集中交易-批量导入预购
    C_IMPORT_REDEEM: '113', // 113-集中交易-批量导入赎回
    C_REVIEW_ACCEPT: '120', // 120-集中交易-复核成功
    C_REVIEW_REJECT: '130' // 130-集中交易-复核拒绝
  },
  // 开放式基金业务类型（业务类型定义遵守开放式基金业务数据交换协议）
  BUSINESSCODE: {
    OPENACCO: '001', // 开户
    OPENACCOCONFIRM: '101', // 开户确认
    CANCELLATION: '002', // 销户
    SUBSCRIPTION: '020', // 认购
    SUBSCRIPTIONCONFIRM_120: '120', // 认购行为确认
    SUBSCRIPTIONCONFIRM_130: '130', // 认购结果确认
    PURCHASE: '022', // 申购
    PURCHASECONFIRM: '122', // 申购确认
    REDEEM: '024', // 赎回
    REDEEMCONFIRM: '124', // 赎回确认
    ALLREDEEM: '224', // 全部赎回
    DIVIDENDMETHOD: '029', // 设置分红方式
    DIVIDENDMETHODCONFIRM: '129', // 设置分红方式确认
    TRANSFER: '036', // 转换
    CANCEL: '053', // 撤单
    TRANSFER_ENTRANCE_CONFIRM: '137', // 转换入确认
    TRANSFER_EXIT_CONFIRM: '138', // 转换出确认
    ADJUST_REDEEM: '142', // 强制赎回
    DIVIDEND_CONFIRM: '143', // 分红确认（红利发放）
    ADJUST_ADD: '144', // 强制调增
    ADJUST_SUB: '145' // 强制调减
  },
  // 通用规则校验ID
  VALID: {
    WHOLESALESPLIT: '1',
    FUNDDETAIL: '2',
    ORDER: '3',
    WORKDAY: '4'
  },
  /**
   * 常量转换
   * @param {string} type 常量的键
   * @param {string} value 翻译的值
   * @param {string} defaultVal 默认值
   */
  convert (type, value, defaultVal = '--') {
    if (type && value) {
      let data = Object.entries(this[type]).filter(res => res[1] === value)
      return data.length > 0 ? data[0][0] : defaultVal
    }
    return defaultVal
  },
  colors: {
    // 数值降序的颜色值
    sorted: {
      webColor: ['#F5D8BA', '#CDB399', '#9A8774', '#7B6C5D', '#594E43'],
      clientColor: ['#FFDE9F', '#D4B883', '#A99368', '#736242', '#50462D']
    },
    // 图表常规
    chart: {
      webColor: [
        '#A08D79',
        '#EDAF6D',
        '#61564A',
        '#BA9B7C',
        '#F6DEB0',
        '#867867',
        '#D1A576',
        '#3A3116',
        '#CBAF7A',
        '#D3C8BA',
        '#7D6B58',
        '#AD8952',
        '#E7C983',
        '#C58F76',
        '#C4AA8C',
        '#DBD19A',
        '#CC9658',
        '#B4A070',
        '#CEB298',
        '#EDB76B',
        '#555557',
        '#DEA3A2',
        '#A3A0A9',
        '#EEAD8C',
        '#E57E5A',
        '#7F8180',
        '#DE5337',
        '#7F7F7D',
        '#F4C2B1',
        '#B24F1A',
        '#824A4F',
        '#E28D59',
        '#8F5C6F',
        '#A01717',
        '#E34C22',
        '#E2777B',
        '#917A94',
        '#A7647D',
        '#AF89B5',
        '#89633B'
      ],
      clientColor: [
        '#D4B883',
        '#F6DEB0',
        '#E7B65A',
        '#ECDECC',
        '#896A45',
        '#CBAD8A',
        '#867867',
        '#F4BC82',
        '#BDA786',
        '#FDD6BD',
        '#9A7735',
        '#F3D38E',
        '#DABA9E',
        '#A27E51',
        '#D9CA8D',
        '#A3916F',
        '#FDECDC',
        '#AD9A5C',
        '#C7B1A7',
        '#A57459',
        '#867F87',
        '#BDA9B5',
        '#EEAD8C',
        '#F0EAF0',
        '#C7BBC9',
        '#FDECE2',
        '#F4C2B1',
        '#EFE5DA',
        '#DEA3A2',
        '#CFA98A',
        '#E5BEC7',
        '#DDD1AC',
        '#E4D0B1',
        '#C88A8A',
        '#E28892',
        '#DF958A',
        '#C48D9E',
        '#ECB782',
        '#C48D9E',
        '#ECB782'
      ]
    }
  },
  FIXBUSINFLAG: {
    SPLIT: 'D', // 大额拆单
    STRIDE: 'K'// 超级转换
  },
  CUSTRISKNAME: {
    '1': '安逸型(C1)',
    '2': '保守型(C2)',
    '3': '稳健型(C3)',
    '4': '积极型(C4)',
    '5': '激进型(C5)'
  },
  RISKLEVELNAME: {
    '0': '低风险等级(R1)',
    '1': '中低风险等级(R2)',
    '2': '中风险等级(R3)',
    '3': '中高风险等级(R4)',
    '4': '高风险等级(R5)'
  },
  RATETYPE: {

  },
  FUNDTAG: {
    '103': '近一年离岸投资标的仅为港股',
    '104': '近一年离岸投资标的为港股+其他离岸股',
    '105': '近一年离岸投资标的为不含港股的其他离岸股'
  }
}

export default constant
