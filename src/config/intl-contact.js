/**
 * Approved public contact details for the international portal.
 * This file must contain public business contacts only. Never add operator,
 * customer or supplier credentials here.
 */
export const INTL_CONTACT = Object.freeze({
  phone: '+852 3900-8888',
  email: 'hk.service@jiyufund.com',
  address: Object.freeze({
    'zh-Hans': '香港中环皇后大道中99号中环中心38楼',
    'zh-Hant': '香港中環皇后大道中99號中環中心38樓',
    en: "38/F, The Center, 99 Queen's Road Central, Hong Kong"
  }),
  serviceHours: Object.freeze({
    'zh-Hans': '工作日 9:00 - 18:00（香港时间）',
    'zh-Hant': '工作日 9:00 - 18:00（香港時間）',
    en: 'Weekdays 9:00 - 18:00 (HKT)'
  }),
  serviceTeam: Object.freeze({
    'zh-Hans': '基煜国际客户服务部',
    'zh-Hant': '基煜國際客戶服務部',
    en: 'Jiyu International Client Service'
  })
})

export default INTL_CONTACT
