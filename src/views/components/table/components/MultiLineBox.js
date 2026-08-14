import './common.scss'
import util from '@/libs/util.js'
export default {
  functional: true,
  render: (h, data) => {
    const { row, column } = data.props.prop
    // console.log(data.listeners.openPage(row), 2222)
    /*
      prop 参数名
      prop1 参数名1
      propClassName 参数名样式
      prop1ClassName 参数名1样式
      clickName 自定义事件名称
    */
    const { prop, prop1, propClassName, prop1ClassName, clickName } = column
    // 自定义事件名称
    const { openPage } = data.listeners
    let prop1Value = row[prop1] || '--'
    // 处理日期格式
    if (column.dateType && prop1Value !== '--') {
      prop1Value = util.fmtDate(prop1Value, column.dateType)
    }
    return (
      row[prop] || row[prop1] ? <span class="multiLineBox">
        <span onClick={() => clickName ? data.listeners[clickName](row) : openPage ? openPage(row) : null} class={`multiLineSpan1 ${propClassName || ''}`}>
          {row[prop] || '--'}
        </span>
        <br />
        <span class={`multiLineSpan2 ${prop1ClassName || ''}`}>{prop1Value || '--'}</span>
      </span> : <span>--</span>
    )
  }
}
