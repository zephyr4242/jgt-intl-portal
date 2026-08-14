import { $sensorsTrack } from './lib'

// 基金产品列表模块
const contract = {}
/*
  1. 签署结果页返回
*/
contract.contractResultBack = payload => {
  $sensorsTrack('contract_result_back', payload)
}
/*
  2. 签署确认
*/
contract.contractConfim = payload => {
  $sensorsTrack('contract_onfim', payload)
}
/*
  3. Excel确认
*/
contract.contractExcelConfim = payload => {
  $sensorsTrack('contract_excel_confim', payload)
}
/*
  4. Excel签署结果页返回
*/
contract.contractExcelResultBack = payload => {
  $sensorsTrack('contract_excel_result_back', payload)
}
export default contract
