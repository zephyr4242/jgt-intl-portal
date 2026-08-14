export const TRADE_ACCOUNT_ID = 'TA-HK-001'

export const TRADE_SCENARIOS = Object.freeze({
  success: 'success',
  explicitFailure: 'explicit-failure',
  resultUnknown: 'result-unknown'
})

const BASE = {
  tradeAccountId: TRADE_ACCOUNT_ID,
  operatorId: 'operator-demo-001',
  fundId: 'FUND-HK-001',
  fundCode: 'HK0001',
  side: 'SUBSCRIBE',
  valueType: 'AMOUNT',
  value: '10000.00',
  currency: 'USD',
  remark: '',
  updatedAt: '2026-08-08T08:00:00.000Z'
}

export const INITIAL_TRADES = [
  ['ACCEPTED', null, null],
  ['MANUAL_PENDING', null, null],
  ['PROCESSING', null, null],
  ['CONFIRMED', null, null],
  ['PARTIALLY_CONFIRMED', 'PARTIAL_ALLOCATION', 'tradeReasonPartialAllocation'],
  ['FAILED', 'MANUAL_REJECTED', 'tradeReasonManualRejected'],
  ['CANCELLED', 'OPERATOR_CANCELLED', 'tradeReasonOperatorCancelled'],
  ['UNKNOWN', 'RESULT_UNKNOWN', 'tradeResultUnknown']
].map(([status, reasonCode, reasonMessageKey], index) => ({
  ...BASE,
  instructionId: `INT-MOCK-HISTORY-${String(index + 1).padStart(3, '0')}`,
  clientRequestId: `mock-history-${status.toLowerCase()}`,
  status,
  reasonCode,
  reasonMessageKey,
  submittedAt: `2026-08-${String(index + 1).padStart(2, '0')}T08:00:00.000Z`
}))

export function createAcceptedInstruction (command, sequence = 1) {
  const now = new Date().toISOString()
  return {
    instructionId: `INT-MOCK-${String(sequence).padStart(6, '0')}`,
    ...command,
    status: 'ACCEPTED',
    reasonCode: null,
    reasonMessageKey: null,
    submittedAt: now,
    updatedAt: now
  }
}
