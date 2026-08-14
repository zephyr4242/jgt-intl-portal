import './common.scss'
export default {
  functional: true,
  render: (h, data) => {
    const { row, column } = data.props.prop
    const { hashStatusName, statusClassName, prop, statusClass, tipTitle, prop1 } = column
    const isTrue = statusClass && statusClass.includes(row[column.prop])
    const className = isTrue ? statusClassName : null
    return hashStatusName ? (
      <span class={`statusDefaulttyle ${className}`}>
        <span>{hashStatusName[row[prop]]}</span>
        {
          isTrue ? (<el-tooltip class="item" effect="dark" content={row[tipTitle]} placement="top" open-delay={300}>
            <i class="iconName iconfont-wenhao-fill icon jgt-iconfont iconName_eclinet" ></i>
          </el-tooltip>) : null
        }
      </span>

    ) : statusClass ? (
      <span class={`statusDefaulttyle ${className}`}>
        <span>{row[prop1]}</span>
        {
          isTrue ? (<el-tooltip class="item" effect="dark" content={row[tipTitle]} placement="top" open-delay={300}>
            <i class="iconName iconfont-wenhao-fill icon jgt-iconfont iconName_eclinet"></i>
          </el-tooltip>) : null
        }
      </span>
    ) : (
      <span class={`statusDefaulttyle`}>
        <span>{row[prop1]}</span>
        {
          isTrue ? (<el-tooltip class="item" effect="dark" content={row[tipTitle]} placement="top" open-delay={300}>
            <i class="iconName iconfont-wenhao-fill icon jgt-iconfont iconName_eclinet"></i>
          </el-tooltip>) : null
        }
      </span>
    )
  }
}
