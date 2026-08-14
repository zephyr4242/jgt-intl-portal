export const APPROVED_LOGIN = Object.freeze({ account: 'approved@example.test', password: 'Demo123!' })
export const PENDING_LOGIN = Object.freeze({ account: 'pending@example.test', password: 'Demo123!' })
export const REJECTED_LOGIN = Object.freeze({ account: 'rejected@example.test', password: 'Demo123!' })

export function freshRegistration (suffix = Date.now()) {
  return {
    organizationName: 'Acceptance Institution',
    operatorName: 'Acceptance Operator',
    email: `new-${suffix}@example.test`,
    mobile: `+852 56${String(suffix).slice(-6)}`,
    password: 'Demo123!'
  }
}
