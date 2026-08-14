import auth from '@/services/intl/providers/mock/auth'
import { REGISTRATION_STORAGE_KEY } from '@/mocks/intl/registrations'
import { APPROVED_LOGIN, PENDING_LOGIN, REJECTED_LOGIN, freshRegistration } from '../../../helpers/fixtures'

describe('registration review state machine', () => {
  beforeEach(() => window.localStorage.clear())

  it('creates only a pending application and never returns a token', async () => {
    const input = freshRegistration('100001')
    const result = await auth.register(input)
    expect(result).toEqual(expect.objectContaining({
      applicationId: expect.any(String),
      reviewStatus: 'PENDING_REVIEW'
    }))
    expect(result).not.toHaveProperty('token')
    expect(result).not.toHaveProperty('accessToken')
    const stored = JSON.parse(window.localStorage.getItem(REGISTRATION_STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).not.toHaveProperty('password')
  })

  it('rejects a duplicate application without adding another record', async () => {
    const input = freshRegistration('100002')
    await auth.register(input)
    await expect(auth.register(input)).rejects.toMatchObject({ code: 'REGISTRATION_DUPLICATE', messageKey: 'registerDuplicate' })
    expect(JSON.parse(window.localStorage.getItem(REGISTRATION_STORAGE_KEY))).toHaveLength(1)
  })

  it('allows approved login and blocks pending or rejected identities', async () => {
    await expect(auth.login(APPROVED_LOGIN)).resolves.toMatchObject({ token: expect.any(String), operator: { reviewStatus: 'APPROVED' } })
    await expect(auth.login(PENDING_LOGIN)).rejects.toMatchObject({ code: 'AUTH_REVIEW_PENDING' })
    await expect(auth.login(REJECTED_LOGIN)).rejects.toMatchObject({ code: 'AUTH_REVIEW_REJECTED' })
  })
})
