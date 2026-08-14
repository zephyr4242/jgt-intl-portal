import cookies from './util.cookies'
import log from './util.log'
import router from '@/router'
import store from '@/store'
import { database } from './util.db'
import dayjs from 'dayjs'
// 密码RSA加密
import JSEncrypt from 'jsencrypt'
import { getProductCodeTranslate } from '@/api/intl/legacy/bus-jgt-prd'
import { fastdfsInfoQuery } from '@/api/intl/legacy/bus-jgt-common'
import { etsDownload } from '@/api/intl/legacy/ets-portal'
import jgtMenuList from '@/menu/module/jgt-menu-list'
import { fofundnoAuthInfo, getLimitAndProductType, marketCalendarOffshore, clientVersionUpgrade } from '@/api/intl/legacy/bus-jgt-trade'
import { Message, MessageBox } from 'element-ui'
import { checkWhiteOperator } from '@/api/intl/legacy/fofund-fap'
import constant from '@/libs/constant'
import { firstPinyin } from './pinyin'
import eventBus from './eventBus'
import PreviewMask from '@/components/jy-preview/main.js'
import { getFrpAccountStatus, registJgyAccount } from '@/api/intl/legacy/bus-frp-agg'

// 基煜账户 已绑定
import { listOrgCustomer, accountFileDownload, checkProductContAgreement } from '@/api/intl/legacy/bus-jgt-account'
const REGISTERTRIAL = [
  constant.LOGIN_TYPE.REGISTER
  // constant.LOGIN_TYPE.TRIAL
]

const util = {
  cookies,
  log
}

util.getClientVersionUpgrade = function () {
  return clientVersionUpgrade
}

/**
 * @description 更新标题
 * @param {String} titleText 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || '基构通'
  window.document.title = `${processTitle}${
    titleText ? ` | ${titleText}` : ''
  }`
}

util.FILE_SIZE_LIMIT = 10 * 1024 * 1024

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * @description 传入内容是否为空值
 * @param expect 传入值
 */
util.isEmpty = function (expect) {
  return (
    expect === undefined ||
    expect === 'undefined' ||
    expect === 'null' ||
    expect === null ||
    (typeof expect === 'string' && expect.trim() === '') ||
    (typeof expect === 'number' && expect.toString() === 'NaN')
  )
}
/**
 * @description 传入内容是否不为空值
 * @param expect 传入值
 */
util.notEmpty = function (expect) {
  return !util.isEmpty(expect)
}

/**
 * @description 节流：规定延迟时间（delay）内只执行最开始触发的函数
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function}
 */
util.throttle = function (fn, delay) {
  var canRun = true
  return function () {
    var that = this
    var args = arguments
    if (!canRun) return // 注意，这里不能用timer来做标记，因为setTimeout会返回一个定时器id
    canRun = false
    fn.apply(that, args)
    setTimeout(function () {
      canRun = true
    }, delay)
  }
}

/**
 * @description 防抖：上个函数在规定延迟时间（delay）内未开始执行就接连触发的函数只执行最后触发的函数
 * @param {Function} fn 需要节流的函数
 * @param {Number} delay 延迟的时间
 * @returns {Function}
 */
util.debounce = function (fn, delay) {
  var timer = null
  return function () {
    var this_ = this
    var args = arguments
    clearTimeout(timer) // 每次调用debounce函数都会将前一次的timer清空，确保只执行一次
    timer = setTimeout(function () {
      fn.apply(this_, args)
    }, delay)
  }
}
/**
 * 阿拉伯数字转换为简写汉字
 * @param Num 数字的字符串格式
 * @param moneyOrQuantity 是格式化成数字还是金额, 默认是money, 可选值为quantity
 * @returns string
 */
util.Arabia_To_SimplifiedChinese = function (Num, moneyOrQuantity) {
  if (util.isEmpty(Num)) {
    return ''
  }
  Num = Num.toString()
  moneyOrQuantity = moneyOrQuantity === 'quantity' ? moneyOrQuantity : 'money'
  for (let i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', '') // 替换Num中的“,”
    Num = Num.replace(' ', '') // 替换Num中的空格
  }
  if (isNaN(Num)) {
    // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return ''
  }
  var prefix = ''
  if (Num.indexOf('-') === 0) {
    prefix = '负'
    Num = Num.substr(1)
  }
  // 字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split('.')
  var newchar = ''

  /* 处理 开头为0 的字符串 ---zhaochenglong */
  part[0] = Number(part[0]).toString()

  // 小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 12) {
      return '' // 数值过大，无法显示大写
    } // 若数量超过百亿单位，提示
    var tmpnewchar = ''
    var perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '壹' + tmpnewchar
        break
      case '2':
        tmpnewchar = '贰' + tmpnewchar
        break
      case '3':
        tmpnewchar = '叁' + tmpnewchar
        break
      case '4':
        tmpnewchar = '肆' + tmpnewchar
        break
      case '5':
        tmpnewchar = '伍' + tmpnewchar
        break
      case '6':
        tmpnewchar = '陆' + tmpnewchar
        break
      case '7':
        tmpnewchar = '柒' + tmpnewchar
        break
      case '8':
        tmpnewchar = '捌' + tmpnewchar
        break
      case '9':
        tmpnewchar = '玖' + tmpnewchar
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        // tmpnewchar = tmpnewchar;
        break
      case 1:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '拾'
        }
        break
      case 2:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '佰'
        }
        break
      case 3:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '仟'
        }
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '拾'
        }
        break
      case 6:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '佰'
        }
        break
      case 7:
        if (perchar !== '0') {
          tmpnewchar = tmpnewchar + '仟'
        }
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        tmpnewchar = tmpnewchar + '拾'
        break
      case 10:
        tmpnewchar = tmpnewchar + '佰'
        break
      case 11:
        tmpnewchar = tmpnewchar + '仟'
        break
      case 12:
        tmpnewchar = tmpnewchar + '万'
        break
    }
    newchar = tmpnewchar + newchar
  }

  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (
    newchar.search('零零') !== -1 ||
    newchar.search('零拾') !== -1 ||
    newchar.search('零佰') !== -1 ||
    newchar.search('零万') !== -1 ||
    newchar.search('零亿') !== -1 ||
    newchar.search('亿万') !== -1
  ) {
    newchar = newchar.replace('零零', '零')
    newchar = newchar.replace('零拾', '零')
    newchar = newchar.replace('零佰', '零')
    newchar = newchar.replace('零万', '万')
    newchar = newchar.replace('零亿', '亿')
    newchar = newchar.replace('亿万', '亿')
  }

  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('壹拾') === 0) {
    newchar = newchar.substr(1)
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1)
  }
  // 替换以“零拾亿”开头的，为“”
  if (newchar.indexOf('零拾亿') === 0) {
    newchar = newchar.substr(3)
  }

  // 替换以“零拾”开头的，为“”
  if (newchar.indexOf('零拾') === 0) {
    newchar = newchar.substr(2)
  }
  // 替换以“零”开头的，为“”
  if (newchar.indexOf('零') === 0) {
    newchar = newchar.substr(1)
  }

  if (util.isEmpty(newchar)) {
    if (moneyOrQuantity !== 'money') {
      newchar = '零'
    }
  }

  // 小数点之后进行转化
  if (Num.indexOf('.') !== -1 && parseInt(part[1], 10) > 0) {
    if (moneyOrQuantity === 'money') {
      if (part[1].length > 2) {
        part[1] = part[1].substr(0, 2)
      }

      if (!util.isEmpty(newchar)) {
        newchar = newchar + '元'
      }
    } else {
      newchar = newchar + '点'
    }

    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = ''
      perchar = part[1].charAt(i)
      switch (perchar) {
        case '0':
          if (i !== part[1].length - 1) {
            tmpnewchar = '零' + tmpnewchar
          }
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }

      if (moneyOrQuantity === 'money') {
        // 金额的大写模式让话术更加流畅
        if (!util.isEmpty(newchar) || perchar !== '0') {
          newchar = newchar + tmpnewchar
          if (i === 0) {
            newchar = newchar + '角'
          } else if (i === 1) {
            // 避免出现 “壹角分”
            if (newchar.lastIndexOf('角') !== newchar.length - 1) {
              newchar = newchar + '分'
            }
          }
        }
      } else {
        newchar = newchar + tmpnewchar
      }
      // 替换以“零”开头的，为“”
      if (newchar.indexOf('零角') >= 0) {
        newchar = newchar.replace('零角', '零')
      }
    }
  } else {
    if (moneyOrQuantity === 'money') {
      if (util.isEmpty(newchar)) {
        newchar = '零'
      }

      newchar = newchar + '元'
    }
  }

  return prefix + newchar
}

util.SimplifiedChinese = function (str, moneyOrQuantity, isUnit) {
  moneyOrQuantity = moneyOrQuantity === 'quantity' ? moneyOrQuantity : 'money'

  var unit = moneyOrQuantity === 'money' ? '元' : isUnit ? '份' : ''

  str = typeof str === 'number' ? str.toString() : str
  str = str || ''
  str = str.replace(/,/g, '')

  if (str === '0.00' || str === '0' || isNaN(str * 1) || str * 1 === 0) {
    return '零' + unit
  }

  var simplifiedChinese = util.Arabia_To_SimplifiedChinese(
    str,
    moneyOrQuantity
  )

  simplifiedChinese = simplifiedChinese.replace(/[亿|万]/g, function (a) {
    return '<span>' + a + '</span>'
  })

  if (simplifiedChinese === unit && simplifiedChinese) {
    simplifiedChinese = '零' + unit
  } else {
    if (simplifiedChinese && moneyOrQuantity === 'quantity') {
      simplifiedChinese = simplifiedChinese + unit
    }
  }

  return simplifiedChinese || '--'
}
/**
 * 对字符串中的指定字符串进行特殊样式添加
 * @param orgStr 原字符串
 * @param className 给新字符串添加的类名
 * @param str 需要被处理的指定字符串,可传多个
 * @returns string
 */
util.handleSpecialStr = function (orgStr, className, ...str) {
  let newStr = ''
  // 判断原字符串以及需要处理的字符串是否为空
  if (util.isEmpty(orgStr) && str.length <= 0) {
    newStr = ''
  }
  newStr = orgStr
  str.forEach((element) => {
    newStr = newStr.replace(
      element,
      `<span class="${className}">${element}</span>`
    )
  })
  return newStr
}

/**
 * 千分位格式化
 * 1、金额保留两位小数，为空则为--
 * 2、金额保留两位小数，为空则为0.00
 * @param thisVal 需格式化的字符串
 * @param num 固定格式化位数， 0则不格式化，默认值为2位小数
 * @param defaultVal 为空或者转失败时的值，默认的默认值
 * @param fmt 格式化 格式为{{0}}%
 * @returns
 */
util.thousands = function (thisVal, num, defaultVal, fmt) {
  if (util.isEmpty(thisVal) || util.isEmpty(Number(thisVal))) {
    return util.isEmpty(defaultVal) ? '--' : defaultVal
  }

  // 去掉可能的已经是千分位字符串中的逗号
  thisVal = (thisVal || '').toString().replace(/,/g, '')

  // 固定保留的小数位数
  if (num !== 0) {
    num = typeof num === 'undefined' || num * 1 <= 0 ? 2 : num
  }

  var prefix = ''
  var strN = util.toFixed(thisVal * 1, num).toString()

  // 找出字符串中可能的负号
  if (strN.indexOf('-') === 0) {
    prefix = '-'
    strN = strN.substr(1)
  }

  var pindex = strN.indexOf('.')
  var suffix
  var result = ''
  suffix = pindex >= 0 ? strN.substr(pindex, strN.length) : ''
  strN = pindex >= 0 ? strN.substr(0, pindex) : strN
  while (strN.length > 3) {
    result = ',' + strN.slice(-3) + result
    strN = strN.slice(0, strN.length - 3)
  }

  result = prefix + strN + result + suffix

  if (!util.isEmpty(fmt)) {
    result = result + fmt
  }
  return result
}

/**
 * 数字增加万和亿分位
 * 99999999999.99 => 999亿9999万9999.99
 * @param number
 * @returns
 */
util.numberQuantile = function (number) {
  if (number === '--') {
    return number
  }
  if (isNaN(number)) {
    return '--'
  }
  if (util.isEmpty(number) || number < 10000) {
    return util.isEmpty(number) ? number : Number(number).toFixed(2)
  }
  const value = Number(number).toFixed(2).split('.')
  let integerValue = value[0].split('').reverse().join('')
  const decimalsValue = value[1]

  // 处理亿
  if (number >= 100000000) {
    const icon = '<i class="iconfont-a-zu1931 jgt-fs-12"></i>'.split('').reverse().join('')
    integerValue = integerValue.replace(/(\d{8})/, '$1' + icon)
  }

  // 处理万
  if (number >= 10000) {
    const icon = '<i class="iconfont-wan jgt-fs-12"></i>'.split('').reverse().join('')
    integerValue = integerValue.replace(/(\d{4})/, '$1' + icon)
  }

  integerValue = integerValue.split('').reverse().join('')
  if (decimalsValue && decimalsValue.length > 0) {
    integerValue = `${integerValue}.${decimalsValue}`
  }

  return integerValue
}

/**
 * 解决chrome下toFixed当小数四舍五入精度后一位是5，导致四舍五入不准确的问题
 */
util.toFixed = function (num, n) {
  if (num < 0) {
    return (num - 1e-14).toFixed(n)
  }
  return (num + 1e-14).toFixed(n)
}

/**
 * 深拷贝
 * @param obj 需拷贝的内容
 * @returns
 */
util.deepClone = function (obj) {
  let _tmp = JSON.stringify(obj) // 将对象转换为json字符串形式
  let result = JSON.parse(_tmp) // 将转换而来的字符串转换为原生js对象
  return result
}
/**
 * 安全的转换日期
 * @param value
 * @param defautVal
 * @returns {*}
 */
/**
 * 折线图横坐标季度格式化
 * @param dateStr
 * @returns {string}
 */
util.fmtQuarter = function (dateStr) {
  const month = dayjs(dateStr).month()
  if (month <= 3) {
    return dateStr.substring(2, 4) + 'Q1'
  } else if (month <= 6) {
    return dateStr.substring(2, 4) + 'Q2'
  } else if (month <= 9) {
    return dateStr.substring(2, 4) + 'Q3'
  } else if (month <= 12) {
    return dateStr.substring(2, 4) + 'Q4'
  }
}
/**
 * RSA 公钥缓存（登录前从 /auth/public-key 拉取）
 */
util._rsaPublicKeyCache = ''
util.setRsaPublicKey = function (publicKey) {
  util._rsaPublicKeyCache = publicKey ? String(publicKey).replace(/\s+/g, '') : ''
}
util.getRsaPublicKeyCache = function () {
  return util._rsaPublicKeyCache || ''
}

/**
 * RSA加密
 * @param str 需要加密的字符串
 * @param publicKey 可选，登录前从后端 /auth/public-key 拉取的公钥；不传则用缓存或本地兜底
 * @returns
 */
util.getRsaCode = function (str, publicKey) {
  let pubKey = publicKey || util._rsaPublicKeyCache || `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8q2/lYJtkxdokRnNw/at97SkY
73KgD+Ru6X257N55TYaytMOJ8C9xb1oMg4QBl9RzSo0tvCrTaEJ8wLWQ/zvrTKRM
6zAmDSmg2svZdgdjzSdXhLiLS0jD6SLfFreovNtRn2Bpz0Elh59NIJLYYi/UYQMQ
TennL6D09cCN2wctqQIDAQAB`
  pubKey = String(pubKey).replace(/\s+/g, '')
  let encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey)
  let data = encryptStr.encrypt(str.toString())
  return data
}

/**
 * 生成随机字符串
 * @param len 表示长度，默认32位
 * @returns
 */
util.randomString = function (len = 32) {
  const template =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
  let str = ''
  for (let i = 0; i < len; i++) { str += template.charAt(Math.floor(Math.random() * template.length)) }
  return str
}

/**
 * 判断pc端还是移动端
 * @returns
 */
util.isPC = function () {
  var userAgentInfo = navigator.userAgent
  var Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  ]
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * 获取封装的路由传参
 */
util.pushRouterParam = async function (path, param, query) {
  const isSame = await store.dispatch('d2admin/user/isSame', null, { root: true })
  if (!isSame) {
    location.reload()
    return
  }

  let routerParam = {
    path
  }
  if (param) {
    const routerDatabase = await database('d2admin/db/database', { user: true })
    const randomKey = param.randomKey ? param.randomKey : path.replace(/\//g, '')
    const paramStr = JSON.stringify(param)
    routerDatabase.set(randomKey, paramStr).write()
    routerParam.query = { param: randomKey, ...query }
  }
  router.push(routerParam)
}

/**
 * 获取重定向封装的路由传参
 */
util.redirectRouterParam = async function (path, param) {
  const isSame = await store.dispatch('d2admin/user/isSame', null, { root: true })
  if (!isSame) {
    location.reload()
    return
  }

  if (param) {
    const routerDatabase = await database('d2admin/db/database', { user: true })
    const randomKey = param.randomKey ? param.randomKey : path.replace(/\//g, '')
    const paramStr = JSON.stringify(param)
    routerDatabase.set(randomKey, paramStr).write()
    path += `?param=${randomKey}`
  }

  store.dispatch('d2admin/page/redirect', {
    tagName: router.history.current.fullPath,
    name: path
  })
}

/**
 * 获取重定向封装的路由传参
 */
util.getRouterParam = async function (thisRouter) {
  const routerKey = thisRouter.$route.query.param
  if (routerKey) {
    const routerDatabase = await database('d2admin/db/database', {
      user: true
    })
    if (routerDatabase) {
      try {
        return JSON.parse(routerDatabase.get(routerKey).value())
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }
  return false
}

/**
 * 设置封装的路由参数
 */
util.setRouterParam = async function (thisRouter, paramStr) {
  const routerKey = thisRouter.$route.query.param
  if (routerKey) {
    const routerDatabase = await database('d2admin/db/database', {
      user: true
    })
    routerDatabase.set(routerKey, paramStr).write()
  }
  return false
}

/**
 * 有效期的转义
 */
util.permanentTime = function (time) {
  if (util.isEmpty(time)) return '--'
  let newStr = ''
  if (time === '99991231') {
    newStr = '永久有效'
  } else {
    var reg = /^(\d{4})(\d{2})(\d{2})$/
    newStr = time.replace(reg, '$1-$2-$3')
  }
  return newStr || '--'
}

/**
 * 字符串去空格
 */
util.strTrim = function (str) {
  let newStr = ''
  if (util.notEmpty(str)) {
    newStr = str.replace(/\s+/g, '')
  }
  return newStr
}

/**
 * 获取当前时间
 * @returns
 */
util.currentTime = function () {
  let now = new Date()
  let _month =
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  let _day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  let _hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  let _minute =
    now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  let _second =
    now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  return now.getFullYear() + _month + _day + _hour + _minute + _second
}

/**
 * 获取当前年份
 */
util.getCurrentYear = function () {
  const date = new Date()
  const year = date.getFullYear()
  return year
}

/**
 * 获取当前时间戳
 * @returns
 */
util.getCurrentTime = function () {
  return new Date().getTime()
}
// 校验是否为合法email
util.rulesEmail = (rule, value, callback) => {
  if (util.isEmpty(value)) {
    return callback(new Error('必填项'))
  }
  let reg =
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的邮箱格式'))
  }
  callback()
}

/**
 * 时间格式处理加- 2020-08-05 08:00:06 =>2020-08-05
 * @param str 需要处理的时间字符串
 * @returns
 */
util.time_FormatB = function (str) {
  return str.slice(0, 10)
}

/**
 * 时间格式处理加- 2020-08-05 08:00:06 =>08:00:06
 * @param str 需要处理的时间字符串
 * @returns
 */
util.time_FormatC = function (str) {
  return str.slice(11, str.length)
}
/**
 * 转换日期
 * @param date 日期
 * @param fmt 格式
 * @param placeholder 处理失败返回值
 * @returns
 */
util.fmtDate = function (date, fmt = 'YYYY-MM-DD', placeholder = '--') {
  if (util.isEmpty(date) || date.length < fmt.length - 4) {
    return placeholder
  }

  return dayjs(date).format(fmt)
}
util.nvl = function (v1, v2) {
  return util.isEmpty(v1) ? v2 : v1
}
// 数组排序
util.arraySort = function (arr, sortKey) {
  if (arr) {
    var compare = function (x, y) {
      if (!x || !y) {
        if (x > y) {
          return 1
        } else if (x < y) {
          return -1
        }
        return 0
      }

      if (Number(x[sortKey]) > Number(y[sortKey])) {
        return 1
      } else if (Number(x[sortKey]) < Number(y[sortKey])) {
        return -1
      }
      return 0
    }
    arr.sort(compare)
    return arr
  }
  return []
}
/**
 * 将数字格式化成无限制/***亿元/***万元/***元
 * @param number
 */
util.numberToLiteChineseMoney = function (number, unit) {
  // 空值则返回无限制
  if (util.isEmpty(number) || number === 0) {
    return '无限制'
  }
  unit = unit || '元'
  if (typeof number === 'string') {
    number = Number(number)
  }
  if (isNaN(number)) {
    return number
  }
  if (number === '999999999999' || number * 1 >= 999999999999) {
    return '无限制'
  }
  let transNum = ''
  number = number + ''
  if (number * 1 >= 100000000 || number * 1 >= 999999999999) {
    // transNum = (number * 1 % 100000000) === 0 ? (number * 1 / 100000000).toString() + '亿' + unit : util.thousands((number * 1 / 100000000), 7).toString() + '亿' + unit
    transNum =
      (number * 1) % 100000000 === 0
        ? ((number * 1) / 100000000).toString() + '亿' + unit
        : ((number * 1) / 100000000).toString() + '亿' + unit
  } else if (number * 1 >= 10000) {
    // transNum = (number * 1 % 10000) === 0 ? (number * 1 / 10000).toString() + '万' + unit : util.thousands((number * 1 / 10000), 7).toString().replace(',', '') + '万' + unit
    transNum =
      (number * 1) % 10000 === 0
        ? ((number * 1) / 10000).toString() + '万' + unit
        : ((number * 1) / 10000).toString().replace(',', '') + '万' + unit
  } else {
    // transNum = number % 1 === 0 ? number + unit : util.thousands(number, 7) + unit
    transNum = number + unit
  }
  // 去除.00
  transNum = transNum.replace(/\.00$/, '')
  return transNum
}

/**
 * 如果传入变量v1为空，则返回v2变量的值
 * @param v1 值1
 * @param v2 值2
 * @returns
 */
util.nvl = function (v1, v2) {
  return util.isEmpty(v1) ? v2 : v1
}

util.isClient = function (that) {
  if (window.top && window.top.$gc) {
    that.$isClient = true
    return false
  }
  that.isThemeClient = that.activeName === 'client'
}

util.getLinkPath = function () {
  return process.env.NODE_ENV === 'production'
    ? window.CONFIG.VUE_APP_LINK_PATH
    : process.env.VUE_APP_LINK_PATH
}

// 基构通1.0 打开新窗口
util.openPostWindow = function (url, data, tradeAcco) {
  var tempForm = document.createElement('form')
  var formTarget = 'postForm_' + new Date().getTime()
  tempForm.id = formTarget
  tempForm.method = 'post'
  tempForm.action = url
  tempForm.target = formTarget

  // 添加页面当前交易账号，防止切换交易账号后当前交易账号与切换后的交易账号不一致导致的交易失败。
  var hideInput = document.createElement('input')
  hideInput.type = 'hidden'
  hideInput.name = 'prevTradeAcco'
  hideInput.value = tradeAcco
  tempForm.appendChild(hideInput)

  Object.keys(data).forEach((key) => {
    hideInput = document.createElement('input')
    hideInput.type = 'hidden'
    hideInput.name = key
    hideInput.value = data[key]
    tempForm.appendChild(hideInput)
  })

  if (tempForm.attachEvent) {
    // IE
    tempForm.attachEvent('onsubmit', function () {
      window.open('about:blank', formTarget)
    })
  } else if (tempForm.addEventListener) {
    // DOM Level 2 standard
    tempForm.addEventListener('onsubmit', function () {
      window.open('about:blank', formTarget)
    })
  }
  document.body.appendChild(tempForm)

  if (document.createEvent) {
    // DOM Level 2 standard
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(
      'submit',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    tempForm.dispatchEvent(evt)
  } else if (tempForm.fireEvent) {
    // IE
    tempForm.fireEvent('onsubmit')
  }
  // 必须手动的触发
  tempForm.submit()
  document.body.removeChild(tempForm)
}

// 开户文件下载 根据文件id转化为url
// 如果isEtsDownload 为true 会调用另一个ets接口
util.accountDownloadById = async function (fileId, isEtsDownload, isFileDownload) {
  try {
    if (isFileDownload) {
      util.preview.common(fileId)
      return false
    }
    // 使用后端返回的文件名
    const params = {
      params: { fileId },
      responseType: 'blob',
      useRemoteFileName: true
    }
    const blob = isEtsDownload ? await etsDownload(params) : await accountFileDownload(params)

    let fileName = blob.fileName
    let type = blob.blob.type

    if (fileName.endsWith('.pdf') || type === 'application/pdf') {
      type = 'application/pdf'
    } else if (type.startsWith('image/')) {
      // 图片文件不处理
    } else if (['png', 'jpeg', 'jpg', 'svg', 'webp'].find(i => fileName.includes(i))) {
      // 图片文件 未传type 补一个
      type = 'image/jpeg'
    }

    const url = window.URL.createObjectURL(blob.blob, { type: type })
    return {
      url: url,
      fileName: fileName,
      type: type,
      blob: blob.blob // 给 IE 的特殊处理
    }
  } catch (error) {
    return null
  } finally {
  }
}

/* 密码校验逻辑 */
util.ispasswordFormatRight = function (val) {
  var index = 0
  if (/\d/.test(val)) {
    index++
  }

  if (/[a-z]/.test(val)) {
    index++
  }

  if (/[A-Z]/.test(val)) {
    index++
  }

  if (/.*[~!@#$%^&*()_+].*/.test(val)) {
    index++
  }

  return index >= 2
}

// 注意url统一用/开头
// {
//  url: 跳转的链接
//  tab: tab名称
//  menu: 左侧菜单名的key 通常是中文的拼音大写
//  push: 默认false  关闭当前窗口， 如果传true则会添加一个页面
//  disableRefresh: 默认刷新下一个tab 默认刷新， true 不刷新
//  params: 携带参数
//  paramKey: 携带参数在客户端的key
// }
// 默认关闭当前tab 强制刷新下一个tab
util.fapRouter = function (options) {
  const { url, tab, menu, push, params, paramKey, disableRefresh } = options
  const isClient = window.top && window.top.$gc

  if (isClient) {
    const clientCommonFn = window.top.index
    const OPERATOR_MENUS = window.top.CONST.OPERATOR_MENUS
    let clientUrl = 'clientnewroot/index.html/#' + url

    if (paramKey && tab !== '交易记录详情') {
      clientCommonFn.setCustomVal(paramKey, params)
    }

    if (tab === '交易记录详情') {
      clientUrl = `${clientUrl}?serialNo=${params.serialNo}&fofundNo=${params.fofundNo}`
    }

    if (!push) {
      clientCommonFn.closeTabFrame(window.name)
    }

    if (!disableRefresh) {
      clientCommonFn.refreshFrameWeb(tab)
    }

    clientCommonFn.activeOrOpenFrame(clientUrl, tab, OPERATOR_MENUS[menu])
  } else {
    if (push) {
      util.pushRouterParam(url, params)
    } else {
      util.redirectRouterParam(url, params)
    }
  }
}
util.isBmis = function (type) {
  return ['XJ', 'GDQXLZCP', 'GDQXLMCP', 'JZ'].includes(type)
}
/**
 * fundCode,
 * type, true: 券商资管 , fundType: 基金类型 this.isBmis(type) 是否是券商资管
 * isRedirect
 *  */
util.goProduct = async function (fundCode, type, isRedirect) {
  // 未知类型
  if (!type || type === '99') {
    return
  }
  // 是否为券商资管产品
  // const qszg = ['XJ', 'GDQXLZCP', 'JZ']
  const isQSZG = type === true ? true : this.isBmis(type)
  const isClient = window.top && window.top.$gc

  if (isClient) {
    // window.top.gotoDetail(fundCode)
    // 白屏优化去除

    window.top.goProduct(fundCode, type, isRedirect ? window.name : '')
  } else {
    try {
      const data = await util.isInWhiteList()
      if (data) {
        const url = isQSZG ? `/bmis/product/detail/${fundCode}` : `/fund/product/detail/${fundCode}`
        // 白名单用户
        if (isRedirect) {
          util.redirectRouterParam(url)
        } else {
          util.pushRouterParam(url)
        }
        return false
      }
      if (isQSZG) {
        window.open(
          `${util.getLinkPath()}/oper/bmis/${fundCode}`,
          '_blank'
        )
      } else {
        window.open(
          `${util.getLinkPath()}/oper/fund/${fundCode}`,
          '_blank'
        )
      }
    } catch (error) {
      if (isQSZG) {
        window.open(
          `${util.getLinkPath()}/oper/bmis/${fundCode}`,
          '_blank'
        )
      } else {
        window.open(
          `${util.getLinkPath()}/oper/fund/${fundCode}`,
          '_blank'
        )
      }
    }
  }
}

/**
 * 跳转到详情页（兼容老的fundType方式）
 * @param fundCode 基金代码
 * @param fundType 基金类型 fundTypeJy1 || fundType
 * @param isRedirect 是否为重定向跳转，非必填，默认false
 */
util.gotoProduct = function (fundCode, fundType, isRedirect = false) {
  // 必填参数没有，中断跳转
  if (util.isEmpty(fundCode) || util.isEmpty(fundType)) {
    return
  }
  // 一级分类
  // 公募 10:货币型 15:理财型 20:债券型 23:混合型 25:股票型 30:QDII 35:ETF
  // 资管 401:专户产品 402:券商资管现金 403:券商资管净值
  // 私募 301:私募证券投资基金 302:私募资产配置基金
  // 老系统分类
  // 公募 100401:货币型 100701:理财型 100301:债券型 100201:混合型 100101:股票型 100501:QDII
  // 资管 GDQXLZCP:专户产品 XJ:券商资管现金 JZ:券商资管净值 GDQXLMCP:固定期限型
  const publicType = ['10', '15', '20', '23', '25', '30', '35', '100401', '100701', '100301', '100201', '100101', '100501']
  const bmisType = ['401', '402', '403', '404', 'GDQXLZCP', 'XJ', 'JZ', 'GDQXLMCP']
  const privateType = ['301', '302']
  let productType = ''
  if (publicType.includes(fundType)) {
    productType = '1'
  } else if (fundType === true || bmisType.includes(fundType)) {
    productType = '2'
  } else if (privateType.includes(fundType)) {
    productType = '3'
  }
  util.gotoProductByProductType(fundCode, productType, isRedirect)
}
/**
 * 通过productType跳转到详情页
 * @param fundCode 基金代码
 * @param productType 基金类型 productType 1-公募基金 2-资管产品 3-私募基金
 * @param isRedirect 是否为重定向跳转，非必填，默认false
 */
util.gotoProductByProductType = function (fundCode, productType, isRedirect = false) {
  // 必填参数没有，中断跳转
  if (util.isEmpty(fundCode) || util.isEmpty(productType)) {
    return
  }

  let prefixType = ''
  switch (productType) {
    case '1':
      prefixType = 'fund'
      break
    case '2':
      prefixType = 'bmis'
      break
    case '3':
      prefixType = 'private'
      break
  }
  // 意外的productType直接中断跳转
  if (util.isEmpty(prefixType)) {
    return
  }
  const isClient = window.top && window.top.$gc
  if (isClient) {
    if (isRedirect) {
      window.top.index.closeTabFrame(window.name)
    }
    // 私募在老客户端里面打开方式要特殊处理
    if (productType === '3') {
      // window.top.index.activeOrOpenFrame(`${this.$clientUrl}private/product/detail/${fundCode}`, '私募产品详情')
    } else {
      window.top.index.activeOrOpenFrame('views/oper/public-placement/fund-detail-connection.html?fundCode=' + fundCode + '&proCode=', '基金详情', 'subPage-201')
    }
  } else {
    const url = `/${prefixType}/product/detail/${fundCode}`
    if (isRedirect) {
      util.redirectRouterParam(url)
    } else {
      util.pushRouterParam(url)
    }
  }
}

// 未绑定基煜账户拦截
util.accountLimit = [
  '/account/overview', // 账户总览
  '/account/list', // 账户信息
  '/account/trade-records', // 我的账户-交易记录
  '/account/my-assets', // 我的账户-我的持仓
  '/account/contract' // 电子合同
]

// 国际门户使用独立的国际交易账户模型，不参与国内“绑定基煜账户”判断。
util.isIntlPortalUser = function (info = store.state?.d2admin?.user?.info) {
  return info?.portalType === 'intl' || info?.userLoginOrg?.orgCode === 'INTL'
}
// 路由权限
util.noRouter = function (menuList, to) {
  if (menuList) {
    let datas = []
    // 本地路由处理
    datas = jgtMenuList.reduce((arr, cur) => {
      if (cur.children && cur.children.length) {
        return [
          ...arr,
          ...cur.children.map((child) => {
            return child
          })
        ]
      } else {
        return [cur]
      }
    }, [])
    // 判断路由是否在当前权限内 不在直接返回false 不走权限验证
    const noPermissions = datas.every((item) => {
      return !to.path.includes(item.path)
    })
    if (noPermissions) {
      return false
    }
    // 处理成hash
    const hashData = {}
    datas.length &&
      datas.forEach((item) => {
        if (!hashData[item.id]) {
          hashData[item.id] = item
        }
      })

    // 二级菜单 接口返回路由处理
    let routerDatas = menuList.reduce((arr, cur) => {
      if (cur.children && cur.children.length) {
        return [...arr, ...cur.children.map((child) => child)]
      } else {
        return [cur]
      }
    }, [])
    // 根据id 处理patch
    routerDatas.length &&
      routerDatas.forEach((item) => {
        if (hashData[item.resourceId]) {
          item.path = hashData[item.resourceId].path
        }
      })
    // 三级菜单
    // let allChildData = routerDatas.reduce((arr, cur) => {
    //   if (cur.children && cur.children.length) {
    //     return [...arr, ...cur.children.map(child => { return child })]
    //   } else {
    //     return [...arr]
    //   }
    // }, [])
    // 无菜单权限为ture
    const isNoRouter = routerDatas.every((item) => {
      return !to.path.includes(item.path)
    })
    // 有菜单权限并且满足未绑定基煜账户
    if (
      !isNoRouter &&
      store.state.d2admin.user &&
      store.state.d2admin.user.info
    ) {
      if (
        !util.isIntlPortalUser(store.state.d2admin.user.info) &&
        util.isEmpty(store.state.d2admin.user.info.userLoginCustomer) &&
        util.accountLimit.some((item) => {
          return to.path.includes(item)
        })
      ) {
        return true
      }
    }
    return isNoRouter
  }
  return false
}

util.setLocal = function (name, value) {
  if (window.top.index) {
    if (name === 'isMultiple') {
      window.localStorage.setItem(name, value)
      return false
    }
    window.top.index.setCustomVal(name, value)
  } else {
    window.localStorage.setItem(name, value)
  }
}

util.getLocal = function (name) {
  if (window.top.index) {
    if (name === 'isMultiple') {
      return window.localStorage.getItem(name)
    }
    return window.top.index.getCustomVal(name)
  } else {
    return window.localStorage.getItem(name)
  }
}

util.removeLocal = function (name) {
  if (window.top.index) {
    if (name === 'isMultiple') {
      window.localStorage.removeItem(name)
    }
    window.top.index.removeCustomVal(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

util.stripsString = function (s) {
  var pattern = new RegExp(/[ \\/:*?"<>|%]/)
  var rs = ''
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '')
  }
  return rs
}

// 获取地址栏参数
util.getQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let str = window.location.href.split('?')[1] || ''
  var r = str.match(reg)
  if (r != null) return unescape(r[2])
  return null
}

util.setFofundNoList = function () {
  const isMultiple = util.getLocal('isMultiple') === 'true'
  const fofundNo =
    !util.isEmpty(store.state.d2admin.user) &&
    !util.isEmpty(store.state.d2admin.user.info) &&
    !util.isEmpty(store.state.d2admin.user.info.userLoginCustomer)
      ? store.state.d2admin.user.info.userLoginCustomer.fofundNo
      : ''
  return !isMultiple && fofundNo ? [fofundNo] : []
}

util.setAccountNoList = function () {
  const isMultiple = util.getLocal('isMultiple') === 'true'
  const accountNo =
    !util.isEmpty(store.state.d2admin.user) &&
    !util.isEmpty(store.state.d2admin.user.info) &&
    !util.isEmpty(store.state.d2admin.user.info.userLoginCustomer)
      ? store.state.d2admin.user.info.userLoginCustomer.accountNo
      : ''
  return !isMultiple && accountNo ? [accountNo] : []
}
/* 图片压缩方法-canvas压缩 */
util.compressUpload = function (image, file) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let { width, height } = image
  canvas.width = width
  canvas.height = height
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, width, height)

  // 最小压缩0.1， 这里用0.2压缩到500KB左右  0.1可以压缩到400KB左右
  let compressData = canvas.toDataURL(file.type || 'image/jpeg', 0.2)

  // 压缩后调用方法进行base64转Blob，方法写在下边
  let blobImg = util.dataURItoBlob(compressData)
  // file api不支持IE
  // return new window.File([blobImg], file.name || '', { type: file.type || 'image/jpeg' })
  blobImg.lastModifiedDate = new Date()
  blobImg.name = file.name
  // 如果用了这个方法  这么传参 formData.append('file', blobImgFile.file, blobImgFile.name)
  return {
    file: blobImg,
    name: file.name
  }
}

/* base64转Blob对象 */
util.dataURItoBlob = function (data) {
  let byteString
  if (data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(data.split(',')[1])
  } else {
    byteString = unescape(data.split(',')[1])
  }

  let mimeString = data
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

/**
 * 生成不重复的ID
 * @param randomLength
 */
util.genNonDuplicateID = function (randomLength) {
  randomLength = randomLength || 32
  var $chars = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < randomLength; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
  /*  let randomString = Math.random().toString(); var subStart = 3
  const subLen = Math.min(randomString.length - subStart, randomLength)

  // 生成随机字符串
  randomString = Number(randomString.substr(subStart, subLen) + new Date().getTime()).toString(8)

  // 保证字符串足够的长
  randomString = util.rightPad(randomString, randomLength, '0')
  console.log(randomString.substr(0, randomLength))
  // 返回唯一ID
  return randomString.substr(0, randomLength) */
}

/**
 * 在字符串右边加入填充
 * @param  str 原字符串
 * @param  size 填充后的位数
 * @param  character 填充字符串
 * @returns
 */
util.rightPad = function (str, size, character) {
  let result = '' + str

  if (this.isEmpty(character)) {
    character = ' '
  }

  while (result.length < size) {
    result += character
  }

  return result
}

util.isInWhiteList = async function (whiteVersion = '0625') {
  if (REGISTERTRIAL.includes(store.state.d2admin?.user?.info?.loginType)) {
    return false
  }

  if (window.CONFIG.USE_WHILELIST === 'newtrade') {
    return true
  } else if (window.CONFIG.USE_WHILELIST === 'oldtrade') {
    return false
  } else if (!window.CONFIG.USE_WHILELIST || window.CONFIG.USE_WHILELIST === 'default') {
    // 查看是否为白名单，该接口每次进入新页面调用
    try {
      // 如果是客户端获取window中的whiteFlag
      if (window.top && window.top.$gc) {
        if (window.CONFIG && window.CONFIG.CLIENT_BACK_WHITE_VERSION && window.CONFIG.CLIENT_BACK_WHITE_VERSION.indexOf(whiteVersion) !== -1) {
          return false
        }
        const whiteVersionKey = 'whiteVersion_' + whiteVersion
        if (window.top[whiteVersionKey] !== undefined) {
          return !window.top[whiteVersionKey]
        }
      }
      if (util.isElectron()) {
        return true
      }
      const data = await checkWhiteOperator({ whiteVersion })
      if (data?.whiteFlag === '1') {
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

util.listOrgCustomer = async function(that) {
  // 获取当前机构下的基煜账号
  let data = await listOrgCustomer({
    orgCode: that.info?.userLoginOrg?.orgCode,
    operatorCode: that.info.operatorCode
  })
  let customerData = []
  if (data && data.customerDTOList && data.customerDTOList.length) {
    // 有简称取 简称无简称取全称
    customerData = data.customerDTOList.map(item => {
      item.fofundShortName = item.fofundShortName || item.fofundName
      return item
    })
  }
  return customerData
}

util.fofundnoAuthInfo = async function (params) {
  // 查看是否有交易权限
  try {
    const paramsData = {
      resourceType: '4',
      ...params
    }
    const data = await fofundnoAuthInfo(paramsData)
    if (data?.orderFlag === '1') {
      return true
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

// 是否有某个类型的管理员授权。这里传jy1类型
util.hasProductTypeRights = async function (fundStyleJy1) {
  const data = await getLimitAndProductType()
  // 没有数据 证明报错或其他 返回false
  if (!data) {
    return false
  }
  // 全部品类返回为null
  if (!data?.fundOriStyleList) {
    return true
  }
  // 非全部品类 去匹配然后返回匹配结果
  if (data?.fundOriStyleList?.length && data.fundOriStyleList.length > 0) {
    return data.fundOriStyleList.findIndex(i => i.fundStyleJy1 === fundStyleJy1) >= 0
  }
}

// val 是用户输入的值
// 默认只能输入整数 不支持负数 不支持小数
// option.allow2 = true 最多2位小数
// option.allow6 = true 最多6位小数
util.inputNumber = function (val, option) {
  if (option) {
    if (option.allow2 || option.allow6) {
      // 最多2位小数
      val = val.replace(/[^\d\\.。]/g, '')
      // 特殊场景: 搜狗输入法中文情况下，先输入数字和小数点，此时输入的其实是句号，但是搜狗帮忙转换成小数点了
      // 但是如果此时删除了小数和小数点，再次输入小数点时，搜狗没有帮忙转换成小数点了。为了避免用户疑惑，我们直接把所有句号处理成小数点
      val = val.replace(/。/g, '.')

      let ret = ''
      if (option.allow2) {
        ret = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      } else if (option.allow6) {
        ret = val.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
      }
      if (ret === '') {
        return ret
      }
      if (ret.includes('.')) {
        const arr = ret.split('.')
        if (Number(arr[0]) === 0) {
          ret = '0' + '.' + arr[1]
        }
      } else {
        if (Number(ret) === 0) {
          ret = '0'
        }
      }
      return ret
    }
  } else {
    return val.replace(/[^\d]/g, '')
  }
}
// IE 浏览器
util.isNoChrom = function () {
  const browserType = util.isSelectBrowser()
  return browserType !== 'Chrom'
}
util.isSelectBrowser = function selectBrowser () {
  let ua = navigator.userAgent
  if (/firefox/i.test(ua)) {
    return 'firefox'
  } else if (/chrome/i.test(ua)) {
    return 'Chrom'
  } else if (/msie/i.test(ua)) {
    return 'IE'
  } else if ('ActiveXObject' in window) {
    return 'IE'
  }
}

/**
 * 获取ip地址
 */
util.getIpAddress = function () {
  // if (window.returnCitySN) {
  //   return window.returnCitySN['cip'] || ''
  // }
  return ''
}

/**
 * 判断是否绑定了基煜账户
 */
util.isBindFofundNo = function () {
  return !util.isEmpty(store.state?.d2admin?.user?.info?.userLoginCustomer?.fofundNo)
}

/**
 * 获取字符长度
 * @param {*} str
 * @returns
 */

util.getLength = function (str) {
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

// 获取拼音首字母
//  pinyin表示后端返回的pinyin
//  cnname表示后端返回的中文汉字
util.getFirstPinyin = function (pinyin, cnname) {
  if (util.isEmpty(pinyin)) {
    // 后端没有返回拼音时，转换后再返回

    return firstPinyin(cnname)
  } else {
    // 如果后端已经返回了拼音。直接返回首字母
    return pinyin.substring(0, 1)
  }
}

/* 客户类型 */
util.hashCustomerName = {
  '0': '机构',
  '1': '个人',
  '2': '产品'
}

// commonAuthor参数复杂 需要调用filePreview
const previewTypes = ['url', 'common', 'commonAccount', 'minio', 'ets', 'tradeBill']

// https://n6ikj6ymiv.feishu.cn/docx/JD2mdaI9roR1uRxeMqycRgAyn5g
util.filePreview = async function (option, previewType) {
  // option支持以下属性
  // type必填，接口类型，用于区分用哪个接口，或者使用静态文件链接
  //   - url 静态文件
  //   - blob 流文件
  //   - common => /bus-jgt-common/common/file/download
  //   - minio => /bus-jgt-account/bus/jgt/account/file-download
  //   - commonAccount =>  /bus-jgt-common/common/file/account-file-download
  //   - commonAuthor => /bus-jgt-common/common/file/author-download
  //   - ets => /ets-portal/file/download/download-file
  //   - tradeBill => /bus-jgt-trade/report/bill/send/log/download
  // fileId 必填 如果是静态文件或者流文件，将文件链接或者二进制文件传到fileId内
  // 【注意】 如果是静态文件带有特殊字符 如 '%' 需要encodeURI之后传进来

  // 以下为可选参数
  // fileName 下载时的文件名，如果没有填会使用后端返回的文件名
  // params 目前仅authorDownload时使用，用于单据生成记录
  // onDownloadProgress 下载回调
  // cb 下载完成回调

  // previewType 指定打开方式
  // 默认 跳转新页面打开
  // 传 current 时在当前页面打开预览
  // 传 download 时在当前页面下载
  if (option?.params?.fileId) {
    option.fileId = option.params.fileId
  }
  if (!option || util.isEmpty(option.type) || util.isEmpty(option.fileId)) {
    Message({
      message: '文件下载失败',
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    })
    return
  }
  const fileId = option.fileId

  const isClient = window.top && window.top.$gc
  if (isClient) {
    // 旧客户端
    if (option.type === 'url' || option.type === 'blob') {
      window.open(fileId, '_blank')
    } else {
      const params = {
        fileId: fileId
      }
      const { fileUrl } = await fastdfsInfoQuery({ params: params })
      fileUrl && window.open(fileUrl, '_blank')
    }
  } else if (previewType === 'download') {
    // 直接下载
    PreviewMask(option, false)
  } else if (previewType === 'current') {
    // 当前页面预览
    PreviewMask(option, true)
  } else if (option.type === 'url' && !fileId.trim().endsWith('.pdf')) {
    // 静态文件链接，如果不是pdf结尾，则不支持跳转页面预览
    // 图片则直接预览，否则执行下载
    PreviewMask(option, fileId.endsWith('.png') || fileId.endsWith('.jpg') || fileId.endsWith('.jpeg'))
  } else {
    // 这里不能使用randomString, 否则同一个文件反复点击会出现多个文件预览弹窗。如果后端提供了id再修改
    const path = `/file-preview/${option.type}_${fileId.replace(/[:./?&#+=% ]/g, '')}`
    util.pushRouterParam(path, option)
  }
}

// preview 是filePreview的语法糖
// 如需传入复杂参数还是使用filePreview
util.preview = {}

previewTypes.forEach(type => {
  util.preview[type] = function (fileId, previewType) {
    const option = {
      fileId,
      type
    }
    util.filePreview(option, previewType)
  }
})

// 流文件下载
util.blobDownload = (res, fileName) => {
  let blob = new Blob([res])
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // 兼容ie浏览器
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const url = window.URL.createObjectURL(blob)
    util.urlDownload(url, fileName)
  }
}

// 根据文件链接下载
util.urlDownload = (url, fileName) => {
  // if (window.ipcRenderer && util.versionCompare('2.0.2')) {
  //   // sendSaveDialogSync是electron 2.0.2 版本新增方法
  //   window.ipcRenderer.send('sendSaveDialogSync', url, fileName)
  // } else
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // 兼容ie浏览器
    window.open(url, '_blank')
  } else {
    try {
      let downloadElement = document.createElement('a')
      downloadElement.style.display = 'none'
      let urlName = url.includes('基构通开户材料(一般户)') || url.includes('基构通开户材料(产品户)') ? `${url}?time=${new Date().getTime()}` : url
      downloadElement.href = urlName
      downloadElement.download = fileName
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      let downloadElement = document.createElement('a')
      downloadElement.style.display = 'none'
      downloadElement.href = url
      downloadElement.download = fileName
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(url)
    }
  }
}

const MULTIPLE = 100000000

/**
 * 加法运算
 * @param num1 加数1
 * @param mum2 加数2
 * @return {*}
 */
util.numAdd = function (num1, mum2) {
  num1 = Number(num1) * MULTIPLE
  mum2 = Number(mum2) * MULTIPLE
  return parseFloat(((num1 + mum2) / MULTIPLE).toFixed(8))
}

/**
 * 减法运算
 * @param num1 减数
 * @param mum2 被减数
 * @return {*}
 */
util.numSub = function (num1, mum2) {
  num1 = Number(num1) * MULTIPLE
  mum2 = Number(mum2) * MULTIPLE
  return parseFloat(((num1 - mum2) / MULTIPLE).toFixed(8))
}

/**
 * 判断是否为客户端
 * @return {boolean}
 */
util.isElectron = function () {
  return navigator?.userAgent?.toLowerCase()?.indexOf('electron/') > -1
}

/**
 * 设置客户端窗口大小
 * @param isResizable 是否禁用缩放
 * @param width
 * @param height
 * @param callback
 */
util.setClientWindowSize = function ({ isResizable, width, height, callback }) {
  if (window.ipcRenderer) {
    if (!width) {
      width = Math.min(window.screen.width, 1280)
    }
    if (!height) {
      height = Math.min(window.screen.height, 768) - 58
    }
    eventBus.$emit('updateWeb', () => {
      window.ipcRenderer.send('setWindowSize', isResizable, width, height)
      callback && callback()
    })
  } else {
    callback && callback()
  }
}

util.goLoginJGT = function () {
  const goLogin = () => {
    // 支持回滚
    if (location.href.startsWith('http://sp') || location.href.startsWith('https://sp')) {
      location.href = location.origin + '/openaccount/#/elogin'
    } else {
      // TODO remove
      location.href = window.CONFIG.VUE_APP_LINK_PATH
    }
  }

  if (window.ipcRenderer) {
    util.setClientWindowSize({
      isResizable: false,
      width: 900,
      height: 500,
      callback: () => {
        goLogin()
      }
    })
    return
  }

  goLogin()
}

// 如果未传width 或者height 则全屏
util.resize = function (width, height) {
  if (util.isElectron()) {
    window.ipcRenderer.send('resize', width, height)
  }
}

// TODO 目前是直接调用ets跳转的接口  之后移除
// 只用于下载
util.postSubmitForm = function (url, args) {
  const form = document.createElement('form')
  form.method = 'post'
  form.style.display = 'none'
  form.action = url

  for (let key in args) {
    let temp = document.createElement('textarea')
    temp.name = key
    temp.value = args[key]
    form.appendChild(temp)
  }
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

// 获取当前设备id
util.getDeviceId = function () {
  let deviceFid = util.getLocal('deviceFid')
  if (util.isEmpty(deviceFid)) {
    deviceFid = util.randomString()
    util.setLocal('deviceFid', deviceFid)
  }
  return deviceFid
}

util.getMachineId = function() {
  return window.machine ? window.machine.id : util.getDeviceId()
}

util.getMachineRemark = function() {
  return window.machine ? window.machine.remark : util.getDeviceId()
}
// try/catch 封装
util.tryCatch = async function (fn, ...args) {
  try {
    return [null, await fn(...args)]
  } catch (e) {
    return [e]
  }
}

/**
 * 数字格式化方法
 * {
 *    value 需要格式化的值
 *    decimal 小数位，默认2
 *    unit 单位，默认空
 *    placeholder 如果为空时的占位符，默认--
 * }
 */
util.getNumberFmt = function (param = {}) {
  let { value, decimal = 2, unit = '', placeholder } = param
  placeholder = placeholder === undefined ? '--' : placeholder
  if (util.notEmpty(value)) {
    let valueFmt = Number(value).toFixed(decimal)
    // 将-0转为0
    if (Number(valueFmt) === 0) {
      valueFmt = valueFmt.replace(/-/g, '')
    }
    return valueFmt + unit
  }
  return placeholder
}

/**
 * 数字格式化为大写汉字并高亮数量单位
 * @param value 需要格式化的值
 * @param className 特殊字符增加的className
 * @return {string}
 */
util.getNumberFmtToChineseHighlight = function (value = '', className = '', unit = 'money') {
  value = util.Arabia_To_SimplifiedChinese(value, unit)
  return util.handleSpecialStr(value, className, '亿', '万')
}

/**
 * 重置前端缓存数据
 * {
 *    ckientKey 旧客户端缓存key
 *    randomKey 网页缓存key
 *    params 新缓存数据
 * }
 */
util.resetRouterDatabase = async function (ckientKey, randomKey, params) {
  if (window.top && window.top.$gc) {
    const clientCommonFn = window.top.index
    clientCommonFn.setCustomVal(ckientKey, params)
  } else {
    const routerDatabase = await database('d2admin/db/database', { user: true })
    const paramStr = JSON.stringify(params)
    routerDatabase.set(randomKey, paramStr).write()
  }
}

// 获取用户操作系统是否为win32位系统
util.getIsWin32 = function () {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.indexOf('win64') >= 0 || userAgent.indexOf('wow64') >= 0) {
    return false
  } else {
    return true
  }
}

// 对于输入的字符串 改成正则之前进行转义
util.stringToReg = function (str) {
  if (util.isEmpty(str)) return str
  return str.replace(new RegExp('[.?+*^$(){}[]|\\]', 'gi'), c => `\\${c}`)
}

// 判断小数精度
util.getNumberPrecision = (value) => {
  const valueString = value.toString()
  const dotPosition = valueString.indexOf('.')
  if (dotPosition === -1) return 0
  return valueString.length - dotPosition - 1
}

// 费率按精度八位四舍五入，去尾0，最低保留2位精度
util.rateNumberFormat = function (str) {
  if (util.isEmpty(str) || isNaN(Number(str))) {
    return '--'
  }

  let n = Number(str)
  // 按八位四舍五入
  n = Math.round(n * 1e8) / 1e8
  // 去尾0
  n = Number(n)

  let precision = util.getNumberPrecision(n)
  let suffix = ''
  if (precision === 0) {
    suffix = '.00'
  } else if (precision === 1) {
    suffix = '0'
  }
  return n + suffix
}
// 基煜精选菜单过滤
util.filterMenuList = function(list) {
  if (list && list.length) {
    list.forEach(item => {
      if (item.children && item.children.length && item.resourceId === '1385071203408674818') {
        item.children = item.children.filter(item => {
          return item.resourceId !== '1385071203408674822'
        })
      }
    })
    return list
  }
  return []
}
/**
 * 当前版本号跟传入版本号做比对
 * @param {*} version
 * @returns true-当前大于等于传入 false-当前小于传入
 */
util.versionCompare = function (version) {
  const currentVersion = window.CONFIG.ELECTRON_VERSION
  if (window.ipcRenderer && currentVersion && version) {
    const currentVersionArr = currentVersion.split('.')
    const versionArr = version.split('.')
    for (let index = 0; index < versionArr.length; index++) {
      let currentValue = Number(currentVersionArr[index])
      let value = Number(versionArr[index])
      if (currentValue > value) {
        return true
      } else if (currentValue < value) {
        return false
      }
    }
    return true
  }
  return false
}

util.getArrayWhenEmpty = function(obj) {
  return util.isEmpty(obj) ? [] : obj
}

// 给container添加模糊效果
util.setMainContainerStyle = function(bool) {
  const dom = document.querySelector('.d2-theme-container-main')
  if (dom && dom.style) {
    dom.style.cssText = bool ? 'filter:blur(5px)' : ''
  }
}
util.checkProductContAgreement = async function(fundCodeList) {
  try {
    if (!fundCodeList.length) {
      return true
    } else {
      const paramsData = {
        type: 1,
        channelList: ['jgt', 'ipmc'],
        fundCodeList: fundCodeList
      }
      const isReciprocalFundDialog = await checkProductContAgreement(paramsData)
      return isReciprocalFundDialog
    }
  } catch (error) {
    return !false
  }
}
util.getMarketCalendarOffshore = async function(val, workDate) {
  try {
    const productData = await getProductCodeTranslate({ productCode: val })
    if (productData && productData.productId) {
      let params = { productId: [productData.productId] }
      if (workDate) {
        params.workDate = workDate
      }
      const resData = await marketCalendarOffshore(params)
      if (resData && resData.length) {
        const findData = resData.find(item => {
          return item.productId === productData.productId
        })
        if (findData) {
          return !!findData.offshoreFlag
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

// 用于6位标准转10位基构通内码
// productCode 传6位标准码
// productType 产品大类 1公募 2资管 3私募
util.codeTranslate = async function(productCode, productType) {
  try {
    if (!productCode || !productType) {
      return
    }
    const productData = await getProductCodeTranslate({ productCode, productType })
    return productData.productId
  } catch (error) {

  }
}

// 二次确认清理缓存方法
util.confirmClearCacheDialog = false // 防止重复打开
util.confirmClearCache = function() {
  if (!util.isElectron() || util.confirmClearCacheDialog) {
    return
  }
  util.confirmClearCacheDialog = true
  const isNewVersion = util.versionCompare('2.0.3')
  const msg = isNewVersion ? '您确定要清理缓存吗？' : '您确定要清理缓存并重启客户端吗？'
  MessageBox.confirm(msg, '提示', {
    center: true,
    cancelButtonClass: 'el-button--primary is-plain'
  })
    .then(() => {
      util.refreshCacheOrRestart(isNewVersion)
    }).finally(() => {
      util.confirmClearCacheDialog = false
    })
}
util.delLastStr = str => {
  if (str.substr(str.length - 1, 1) === '/') return str.substr(0, str.length - 1)
  return str
}

// 是否跳转基构云
// 获取基构云账号状态
// 1:未申请； ---
//    温馨提示 注册基构云
//    确定 --- 注册  调用  http://yapi.jiyufund.com.cn/project/534/interface/api/46920   --- 去老投研
//    取消  --- 去老投研
// 2：审核中； --- 去老投研
// 3：审核未通过； --- 去老投研
// 4：审核通过；  --- 基构云 --- jump?platform=jgt&redirect_url=

// 4.1  首页      传 {'target_url':'index'}
// 4.2  投研资讯  传 {'target_url':'information-research-report'}
// 4.3  产品详情  传 {'target_url':'superior-fund-detail-page', 'inner_code': '0000011111'}  inner_code 可选
// 4.4  基金经理详情  传 {'target_url':'research-fund-manager-detail','fd_id':'000002'}  fd_id 可选
// 4.5  基金经理列表  传 {'target_url':'research-fund-manager-search' }

// 5：账户异常； --- 去老投研

// 统一跳转基构云（已废弃老投研）
util.isGoFrp = async function(options) {
  if (!options) return

  const res = await getFrpAccountStatus()

  if (res === '1') {
    try {
      await MessageBox.confirm('是否注册基构云', '提示', {
        center: true,
        cancelButtonClass: 'el-button--primary is-plain'
      })
      await registJgyAccount()
    } catch (e) {
      return
    }
  }

  let domain = window.CONFIG.FRP_PORTAL_DOMAIN
  let feignVersion = null
  if (location.href.includes('localhost')) {
    feignVersion = process.env.VUE_APP_BIZ_ID
  } else if (location.href.includes('://sp')) {
    feignVersion = localStorage.getItem('jgt-feign-version')
  }

  if (feignVersion) {
    domain = domain.replace(`://`, `://${feignVersion}.`)
  }
  domain = util.delLastStr(domain)

  let s = ''
  Object.keys(options).forEach(key => {
    s = s + `&${key}=${options[key]}`
  })

  let url = ''
  // 审核通过 直接登陆
  if (res === '4') {
    const token = util.cookies.get('token')
    url = `${domain}/#/login-loading?platform=jgt${s}&token=${token}`
  } else {
    // 其他状态 跳转登录页面
    url = `${domain}/#/login?platform=jgt${s}`
  }

  window.open(url, '_blank')
  return true
}

// 清理缓存并重启客户端，不做二次确认版本
util.clearCacheWithNoConfirm = function() {
  const isNewVersion = util.versionCompare('2.0.3')
  util.refreshCacheOrRestart(isNewVersion)
}

util.refreshCacheOrRestart = function(isNewVersion) {
  if (isNewVersion) {
    window.ipcRenderer && window.ipcRenderer.send('clear-cache')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  } else {
    window.ipcRenderer && window.ipcRenderer.send('reload-eclient')
  }
}
util.initDragScroll = (tableDataRef) => {
  if (!tableDataRef) return
  const tableWrapper = tableDataRef.$el.querySelector('.el-table__body-wrapper')
  if (!tableWrapper) return

  let isDragging = false
  let startX = 0
  let startScrollLeft = 0

  // 鼠标按下事件
  tableWrapper.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.clientX
    startScrollLeft = tableWrapper.scrollLeft
    tableWrapper.style.cursor = 'grabbing'
    // e.preventDefault() // 阻止默认选中行为‌:ml-citation{ref="1,2" data="citationList"}
  })

  // 鼠标移动事件
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    tableWrapper.scrollLeft = startScrollLeft - deltaX
  })

  // 鼠标释放事件
  document.addEventListener('mouseup', () => {
    isDragging = false
    tableWrapper.style.cursor = 'grab'
  })

  // 初始化样式
  tableWrapper.style.cursor = 'grab'
  // tableWrapper.style.overflow = 'hidden' // 隐藏原生滚动条‌:ml-citation{ref="1,3" data="citationList"}
}
// 替换空格
util.replaceSpace = function(str) {
  if (!str) return ''
  // 替换换行符和空格
  str = str.replace(/\\n+/g, '')
  str = str.replace(/\\r+/g, '')
  str = str.replace(/\s+/g, '')
  str = str.replace(/\\/g, '')
  return str
}
// 替换小x为大X
util.replaceX = function(str) {
  if (!str) return ''
  // 替换末尾小x为大X
  str = str.replace(/x$/, 'X')
  return str
}
/**
 * 是否在 BMIS_EXCLUSIVE_ORG_CODES 白名单中（window.CONFIG，逗号分隔，与 orgCode 全量一致）
 */
util.isBmisExclusiveOrg = function (orgCode) {
  const raw = window.CONFIG && window.CONFIG.BMIS_EXCLUSIVE_ORG_CODES
  if (!orgCode || !raw) return false
  return String(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .includes(String(orgCode))
}
/**
 * 是否对资管菜单/产品 Tab 做裁剪：须 loginType==='3'（有交易权限）且机构在白名单；loginType!=='3' 一律走原逻辑不裁剪菜单
 */
util.isBmisExclusiveOrgRestricted = function (orgCode, loginType) {
  return loginType === '3' && util.isBmisExclusiveOrg(orgCode)
}
export default util
