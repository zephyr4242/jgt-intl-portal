import FileSaver from 'file-saver'
import XLSX from 'xlsx'

const JsonToExcel = {
  getExcel (jsonData, title = '默认标题', sheetTitle, isAoa = false) {
    var excelTitle = title
    const ws = isAoa ? XLSX.utils.aoa_to_sheet(jsonData) : XLSX.utils.json_to_sheet(jsonData)
    if (jsonData && jsonData.length) {
      let colData = isAoa ? jsonData[1] : Object.keys(jsonData[0])
      let dataWch = []
      if (colData.length) {
        colData.forEach(() => {
          dataWch.push({
            wch: 20
          })
        })
      }
      // 设置每列的列宽，10代表10个字符，注意中文占2个字符
      ws['!cols'] = dataWch
    }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle)
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        excelTitle + '.xlsx'
      )
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
  }
}
const HtmlToExcel = {
  getExcel (dom, title = '默认标题') {
    var excelTitle = title
    var wb = XLSX.utils.table_to_book(document.querySelector(dom))
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        excelTitle + '.xlsx'
      )
    } catch (e) {
      if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
  }
}
export { JsonToExcel, HtmlToExcel }
