export default {
  name: 'TableHeadCell',
  functional: true,
  props: {
    render: Function,
    index: Number,
    column: Object,
    scopeColumn: Object,
    columns: Array,
    data: Array
  },
  render: (h, ctx) => {
    if (typeof ctx.props.render === 'function') {
      const params = {
        index: ctx.props.index,
        column: ctx.props.column,
        scopeColumn: ctx.props.scopeColumn,
        columns: ctx.props.columns,
        data: ctx.props.data,
        _self: ctx
      }
      return ctx.props.render.call(ctx.parent.$parent, h, params)
    } else {
      return h('span', ctx.props.column.label || ctx.props.column.prop || ctx.props.scopeColumn.property)
    }
  }
}
