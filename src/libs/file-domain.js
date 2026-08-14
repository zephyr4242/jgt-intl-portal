import Vue from 'vue'
// 文件域名
const DOMAIN = window.CONFIG.STATIC_SERVICE.FILE_DOMAIN
const FILE_BUCKET = window.CONFIG.STATIC_SERVICE.FILE_BUCKET
// pdf对应的 buckets
const PDF_BUCKETS = `/${FILE_BUCKET}/pdf/`
// excel对应的 buckets
const EXCEL_BUCKETS = `/${FILE_BUCKET}/excel/`
// image对应的 buckets
const IMAGE_BUCKETS = `/${FILE_BUCKET}/images/`
// 开户材料
const EXAMPLE_BUCKETS = `/${FILE_BUCKET}/example/`
// pdf link
const PDF_DOMAIN = DOMAIN + PDF_BUCKETS
// excel link
const EXCEL_DOMAIN = DOMAIN + EXCEL_BUCKETS
// image link
const IMAGE_DOMAIN = DOMAIN + IMAGE_BUCKETS
// example link
const EXAMPLE_DOMAIN = DOMAIN + EXAMPLE_BUCKETS
Vue.prototype.PDF_DOMAIN = PDF_DOMAIN
Vue.prototype.EXCEL_DOMAIN = EXCEL_DOMAIN
Vue.prototype.IMAGE_DOMAIN = IMAGE_DOMAIN
Vue.prototype.EXAMPLE_DOMAIN = EXAMPLE_DOMAIN
export {
  PDF_DOMAIN,
  EXCEL_DOMAIN,
  IMAGE_DOMAIN,
  EXAMPLE_DOMAIN
}
