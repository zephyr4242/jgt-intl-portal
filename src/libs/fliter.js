import Vue from 'vue'
import util from './util.js'
import dayjs from 'dayjs'

/**
 * 阿拉伯数字转换为简写汉字
 * @param Num 数字的字符串格式
 * @param moneyOrQuantity 是格式化成数字还是金额, 默认是money, 可选值为quantity
 * @returns string
 */
Vue.filter('Arabia_To_SimplifiedChinese', function (Num, moneyOrQuantity) {
  let newStr = util.Arabia_To_SimplifiedChinese(Num, moneyOrQuantity)
  return newStr
})

/**
 * 千分位格式化
 * @param Num 数字的字符串格式
 * @returns string
 */
Vue.filter('thousands', function (Num) {
  let newStr = util.thousands(Num)
  return newStr
})

/**
 * 证件有效期的转义
 * @param time 8位数的时间格式yyyymmdd
 * @returns string '永久有效/2020-12-03'
 */
Vue.filter('permanentTime', function (time) {
  let newStr = util.permanentTime(time)
  return newStr
})

Vue.filter('time_FormatB', function (str) {
  let newStr = util.time_FormatB(str)
  return newStr
})
Vue.filter('time_FormatC', function (str) {
  let newStr = util.time_FormatC(str)
  return newStr
})

/**
 * 将数字格式化成无限制/***亿元/***万元/***元
 * @param Num 数字的字符串格式
 * @returns string
 */
Vue.filter('numberToLiteChineseMoney', function (Num) {
  let newStr = util.numberToLiteChineseMoney(Num)
  return newStr
})

// 加密显示
Vue.filter('encrypt', function (value) {
  if (!value) return ''
  value = value.toString()

  if (value.length < 8) {
    return value
  }
  let start = value.substring(0, 3)
  let end = value.substring(value.length - 4)
  return start + '****' + end
})

// 格式化日期
Vue.filter('day_str', function (value, defaultVal = '') {
  if (!value) return defaultVal
  return dayjs(value).format('YYYY-MM-DD')
})

// 日期时间的part1
Vue.filter('getDate', function (value, type) {
  if (!value && type) return '--'
  if (!value) return ''
  return value.substring(0, 10)
})

Vue.filter('nvl', function (str, str2) {
  let newStr = util.nvl(str, str2)
  return newStr
})

// 日期时间的part2
Vue.filter('getTime', function (value) {
  if (!value) return ''
  return value.substring(11)
})

/**
 * value 原始值
 * multiply 单位换算 乘以一个换算单位 默认为1
 * precision 精度 默认为2
 * thousands 是否添加千分位 默认为不添加
 * percent 是否添加百分号 默认为不添加
 * nanText 非数字时文字  默认为--
 */

Vue.filter('nf', function (value, multiply = 1, precision = 2, thousands = false, percent = false, nanText = '--') {
  if (value === null || isNaN(value)) return nanText
  let ret = Number(value)

  ret = ret * multiply

  if (precision > 0) {
    ret = ret.toFixed(precision)
  } else {
    ret = Math.round(ret)
  }

  if (thousands) {
    ret = util.thousands(ret, precision)
  }

  if (percent) {
    ret = ret + '%'
  }

  return ret
})

// 添加
Vue.filter('document', function (str) {
  let newStr = str !== '--' ? '《' + str + '》' : str
  return newStr
})

// 内容为空处理
Vue.filter('isEmptySetTxt', function (str) {
  if (util.isEmpty(str)) {
    return '--'
  }
  return str
})
