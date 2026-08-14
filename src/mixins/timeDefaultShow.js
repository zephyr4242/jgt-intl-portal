export default {
  data() {
    return {
      timeDefaultShow: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.timeDefaultShow = new Date()
      this.timeDefaultShow.setMonth(new Date().getMonth() - 1)
    })
  }
}
