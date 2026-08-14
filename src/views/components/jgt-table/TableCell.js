export default {
  name: 'TableCell',
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: Object,
    scopeColumn: Object,
    columns: Array,
    align: String,
    data: Array
  },
  render: (h, ctx) => {
    if (typeof ctx.props.render === 'function') {
      const params = {
        row: ctx.props.row,
        index: ctx.props.index,
        column: ctx.props.column,
        scopeColumn: ctx.props.scopeColumn,
        columns: ctx.props.columns,
        data: ctx.props.data,
        _self: ctx
      }
      return ctx.props.render.call(ctx.parent.$parent, h, params)
    } else {
      if (typeof ctx.props.column.formatter === 'function') {
        return h('span',
          ctx.props.column.formatter(
            ctx.props.row, ctx.props.scopeColumn,
            ctx.props.row[ctx.props.column.id],
            ctx.props.index
          )
        )
      }
      return h('span', ctx.props.row[ctx.props.column.id])
    }
  }
}
