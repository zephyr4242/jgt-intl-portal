export default {
  methods: {
    // 处理交易账号数据
    // keepAll 为true时，展示完整树结构，不删除投组级别
    reprocessingData(data, keepAll) {
      if (this.util.isEmpty(data) || data?.length === 0) {
        return []
      }

      data.forEach(item => {
        item.label = item.fofundShortName || item.fofundName
        item.level = 1 // 补level计算宽度, 用于拍平之后还原数据
        if (this.util.isEmpty(item?.accountList) || item.accountList.length === 0) {
          // 无投组时跳过
        } else if (item?.accountList?.length === 1 && !keepAll) { // 单投组时
          // 一级使用投组账号
          item.value = item.accountNo
          // 直接移除子级 accountList
          delete item.accountList
        } else { // 多投组时
          // 一级使用基煜账号
          item.value = item.fofundNo
          // 处理子级名称
          item.accountList.forEach(i => {
            i.value = i.accountNo
            i.level = 2
            i.label = i.investPortfolioName
          })
        }
      })

      return data
    }
  }
}
