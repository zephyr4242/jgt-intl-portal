const elTableScroll = {
  inserted (el, binding) {
    const wrapper = el.querySelector('.el-table__body-wrapper')
    wrapper && wrapper.addEventListener('scroll', function () {
      try {
        if (binding.value.jgtTable) {
          console.log(this.scrollTop)
          if (binding.value.jgtTable.$el.querySelector('.el-table__body-wrapper')) {
            binding.value.jgtTable.$el.querySelector('.el-table__body-wrapper').scrollTop = this.scrollTop
          }
          if (binding.value.jgtTable.$el.querySelector('.el-table__fixed-body-wrapper')) {
            binding.value.jgtTable.$el.querySelector('.el-table__fixed-body-wrapper').scrollTop = this.scrollTop
          }
        }
      } catch (error) {

      }
    })
  }
}
export default elTableScroll
