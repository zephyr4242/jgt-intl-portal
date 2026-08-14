// mathjs官网 https://mathjs.org/index.html
// https://zhuanlan.zhihu.com/p/148270821
import { bignumber, divide } from 'mathjs'
const utilFmt = {}

/**
 * 数字转大写单位
 * @param value
 * @param type
 * @return {string}
 */
utilFmt.numberToUpperUnit = function (value, type = '1') {
  value = Number(value || 0)

  // 0和9999999999999都格式化为无限制
  if (type === '1') {
    if (value === 0 || value >= 9999999999999) {
      return '无限制'
    }
  }
  // 只有0才格式化为无限制
  if (type === '2') {
    if (value === 0) {
      return '无限制'
    }
  }

  if (value >= 100000000) {
    return divide(bignumber(value), bignumber(100000000)) + '亿元'
  } else if (value >= 10000) {
    return divide(bignumber(value), bignumber(10000)) + '万元'
  } else {
    return value + '元'
  }
}

export default utilFmt
