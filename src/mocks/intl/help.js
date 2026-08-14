import INTL_CONTACT from '@/config/intl-contact'

const text = (zhHans, zhHant, en) => ({
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  en
})

const keywords = (zhHans, zhHant, en) => ({
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  en
})

// Anonymous deterministic fixtures. The intentionally incomplete GUIDE-003
// verifies that a missing current language never falls back to another one.
export const HELP_CONTENT = Object.freeze([
  {
    contentId: 'FAQ-001',
    type: 'FAQ',
    categoryCode: 'ACCOUNT',
    keywords: keywords(['注册', '审核', '登录'], ['註冊', '審核', '登入'], ['registration', 'review', 'login']),
    title: text('注册后为什么不能立即登录？', '註冊後為什麼不能立即登入？', 'Why can’t I sign in immediately after registration?'),
    body: text(
      '注册申请须经人工审核。审核通过后，操作员才可登录门户。',
      '註冊申請須經人工審核。審核通過後，操作員才可登入門戶。',
      'A registration application requires manual review. The operator can sign in only after approval.'
    ),
    sortOrder: 10,
    contact: null
  },
  {
    contentId: 'FAQ-002',
    type: 'FAQ',
    categoryCode: 'TRADE',
    keywords: keywords(['交易', '指令', '成交'], ['交易', '指令', '成交'], ['trade', 'instruction', 'execution']),
    title: text('提交交易指令是否代表已成交？', '提交交易指令是否代表已成交？', 'Does submitting a trade instruction mean it is executed?'),
    body: text(
      '不代表成交。门户只接收申购或赎回内部指令，后续由人工处理，请在交易记录中查看状态。',
      '不代表成交。門戶只接收申購或贖回內部指令，後續由人工處理，請在交易記錄中查看狀態。',
      'No. The portal accepts an internal subscription or redemption instruction for manual processing. Check the transaction record for status.'
    ),
    sortOrder: 20,
    contact: null
  },
  {
    contentId: 'GUIDE-001',
    type: 'GUIDE',
    categoryCode: 'TRADE',
    keywords: keywords(['申购', '赎回', '下单'], ['申購', '贖回', '下單'], ['subscribe', 'redeem', 'order']),
    title: text('申购与赎回操作指南', '申購與贖回操作指南', 'Subscription and redemption guide'),
    body: text(
      '进入交易中心，选择申购或赎回、基金产品及交易账户，填写金额或份额并核对确认页。提交成功后，请前往交易记录查看人工处理进度。',
      '進入交易中心，選擇申購或贖回、基金產品及交易賬戶，填寫金額或份額並核對確認頁。提交成功後，請前往交易記錄查看人工處理進度。',
      'Open Trade Center, select subscription or redemption, the fund and trade account, enter the amount or units, and review the confirmation. After submission, check the transaction record for manual processing progress.'
    ),
    sortOrder: 30,
    contact: null
  },
  {
    contentId: 'GUIDE-002',
    type: 'GUIDE',
    categoryCode: 'STATEMENT',
    keywords: keywords(['账单', '下载', '打印'], ['賬單', '下載', '列印'], ['statement', 'download', 'print']),
    title: text('账单预览与打印指南', '賬單預覽與列印指南', 'Statement preview and print guide'),
    body: text(
      '在我的账户中选择账单打印，按账期查询。仅状态为可用的 PDF 可以预览或下载；预览成功后可使用浏览器打印。',
      '在我的賬戶中選擇賬單列印，按賬期查詢。僅狀態為可用的 PDF 可以預覽或下載；預覽成功後可使用瀏覽器列印。',
      'Under My Account, select Statement Printing and search by period. Only an available PDF can be previewed or downloaded; browser printing is enabled after a successful preview.'
    ),
    sortOrder: 40,
    contact: null
  },
  {
    contentId: 'GUIDE-003',
    type: 'GUIDE',
    categoryCode: 'ACCOUNT',
    keywords: keywords(['资料'], ['資料'], []),
    title: text('账户资料说明', '賬戶資料說明', null),
    body: text('账户信息仅供查看，如需更新请联系客户服务部。', '賬戶資料僅供查看，如需更新請聯繫客戶服務部。', null),
    sortOrder: 50,
    contact: null
  }
])

export const HELP_CONTACT = Object.freeze({
  contentId: 'CONTACT-001',
  type: 'CONTACT',
  categoryCode: 'CONTACT',
  keywords: keywords(['联系', '电话', '邮箱'], ['聯繫', '電話', '電郵'], ['contact', 'phone', 'email']),
  title: text('国际业务联系方式', '國際業務聯繫方式', 'International business contact'),
  body: text('如需进一步协助，请通过以下公开业务联系方式联系我们。', '如需進一步協助，請通過以下公開業務聯繫方式聯繫我們。', 'For further assistance, contact us through the public business channels below.'),
  sortOrder: 1000,
  contact: INTL_CONTACT
})

export default HELP_CONTENT
