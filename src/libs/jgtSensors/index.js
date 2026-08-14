// 公共模块

import pub from './pub'
// 认申购
import singleBuy from './single-buy'
import firstMeaningfulPaint from './first-meaningful-paint.js'
// 赎回
import redeem from './redeem.js'
// 分红
import setDividend from './set-dividend.js'
// 转换
import transformation from './transformation.js'
// 预购
import purchase from './purchase.js'
// 基金产品列表
import fundlist from './fundlist.js'
// 智能拆单
import split from './split.js'
// 交易下单
import aggregation from './aggregation.js'

// 开户流程首页、登录页
import openAcc from './open-acc.js'
// 单笔认申购
import tradeOrder from './trade-order.js'
// 用户登录
import userLogin from './user-login.js'
// 在线开户管理
import onlineAccount from './online-account'
// 电子合同签署
import contract from './contract.js'
const jgtSensorsTrack = {
  ...pub,
  ...singleBuy,
  ...firstMeaningfulPaint,
  ...redeem,
  ...setDividend,
  ...transformation,
  ...purchase,
  ...fundlist,
  ...split,
  ...aggregation,
  ...openAcc,
  ...userLogin,
  ...tradeOrder,
  ...onlineAccount,
  ...contract
}

export default jgtSensorsTrack
