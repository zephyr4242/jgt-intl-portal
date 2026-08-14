export default {
  functional: true,
  render: (h, data) => {
    const params = data.props.prop
    return params.render(h, params)
  }
}
